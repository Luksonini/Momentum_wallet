# Django imports
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.db import IntegrityError
from django.http import HttpResponseRedirect
from django.shortcuts import render, redirect
from django.urls import reverse
from .forms import StrategyInputForm, OptimisationPreferencesForm
from .models import User, UserStrategyModel, MarketAnalysisPreferences
from .utils.momentum import MarketAnalysis
from .utils.calculate_weights import EqualWeightedPortfolio
from .utils.calculate_user_portfolio import UserPortfolio
from django.http import JsonResponse
import json
from datetime import datetime, timedelta
from django.core.serializers.json import DjangoJSONEncoder
# user_portfolio\utils
# user_portfolio\views.py

@login_required(login_url='login')
def index(request):
    strategy_form = StrategyInputForm(request.POST or None)
    optimisation_form = OptimisationPreferencesForm(request.POST or None)
    user_strategy_model = UserStrategyModel.objects.filter(user=request.user).first()
    chart_data = None

    user_preferences, created = MarketAnalysisPreferences.objects.get_or_create(user=request.user)

    if user_strategy_model and user_strategy_model.returns_data:
        chart_data = user_strategy_model.returns_data
        # equally_portfolio = EqualWeightedPortfolio(user_strategy_model.current_tickers, total_amount=user_preferences.balance)
        equally_portfolio = EqualWeightedPortfolio(total_amount=int(user_preferences.balance), tickers=user_strategy_model.current_tickers)
        equally_portfolio_data = equally_portfolio.get_chart_data()

    return render(request, "user_portfolio/index.html", {
        'strategy_form': strategy_form,
        'chart_data': json.dumps(chart_data) if chart_data else None,
        'equally_portfolio_data' : equally_portfolio_data,
        'optimisation_form' : optimisation_form,
        'user_preferences' : user_preferences,
    })

@login_required(login_url='login')
def chart_data(request):
    start_date_str = request.GET.get('start_date', None)
    window = request.GET.get('window')
    nlargest = request.GET.get('nlargest')
    balance = request.GET.get('balance')
    start_date = datetime.strptime(str(start_date_str), '%Y-%m-%d').date()
    user_preferences = MarketAnalysisPreferences.objects.get(user=request.user)
    user_preferences.start_date = start_date 
    user_preferences.window = int(window)
    user_preferences.nlargest_window = int(nlargest)
    user_preferences.balance = int(balance)

    user_preferences.save()
    market_analysis = MarketAnalysis(
        start_date=str(start_date),
        window=user_preferences.window,
        nlargest_window=user_preferences.nlargest_window,
    )

    results_json = market_analysis.strategy_results()
    tickers = market_analysis.get_current_month_tickers()

   
    UserStrategyModel.objects.update_or_create(
        user=request.user, defaults={'returns_data': results_json, 'current_tickers' : tickers})
    equally_portfolio = EqualWeightedPortfolio(user_preferences.balance, tickers)
    equally_portfolio_data = equally_portfolio.get_chart_data()


    response_data = {
        'results': results_json,
        'piechart_data': equally_portfolio_data,
        'equally_portfolio_data' : equally_portfolio_data
    }

    # response = JsonResponse(results_json, encoder=DjangoJSONEncoder, safe=False)

    return JsonResponse(response_data)

@login_required(login_url='login')
def optimisation_view(request):
    # Pobierz wartości z parametrów zapytania
    optimisation_date = request.GET.get('optimisation_date')
    window = request.GET.get('window')
    nlargest_window = request.GET.get('nlargest_window')
    market_analysis = MarketAnalysis(start_date=optimisation_date)
    optimal_params = market_analysis.optimize_parameters(window_range=(1, int(window) + 1), nlargest_range=(5, int(nlargest_window) + 1))

    # Zaktualizuj instancję optymalnymi parametrami
    new_window = int(optimal_params[0][0])
    new_nlargest_window = int(optimal_params[0][1])

    user_preferences = MarketAnalysisPreferences.objects.get(user=request.user)
    user_preferences.start_date = datetime.strptime(str(optimisation_date), '%Y-%m-%d').date()
    user_preferences.window = new_window
    user_preferences.nlargest_window = new_nlargest_window
    user_preferences.save()

    market_analysis.window = new_window
    market_analysis.nlargest_window = new_nlargest_window
    market_analysis.rolling_returns_large = market_analysis.calculate_rolling_returns(market_analysis.monthly_returns, market_analysis.window)

    # Wywołaj metodę strategy_results dla optymalizowanej strategii
    results_json = market_analysis.strategy_results()
    tickers = market_analysis.get_current_month_tickers()
    print(tickers)
    equally_portfolio = EqualWeightedPortfolio(tickers, total_amount=int(user_preferences.balance))
    equally_portfolio_data = equally_portfolio.get_chart_data()

    # data, created = 
    UserStrategyModel.objects.update_or_create(user=request.user, defaults={'returns_data': results_json, 'current_tickers': tickers})
    
    # Dodaj nowe parametry do wyników
    response_data = {
        'results': results_json,
        'new_window': new_window,
        'new_nlargest_window': new_nlargest_window,
        # 'piechart_data': tickers,
        'equally_portfolio_data' : equally_portfolio_data
    }

    return JsonResponse(response_data, encoder=DjangoJSONEncoder, safe=False)

def tickers_info(request):
    # Przykładowe dane - dostosuj je do swoich potrzeb
    user_strategy_model = UserStrategyModel.objects.filter(user=request.user).first()
    user_preferences = MarketAnalysisPreferences.objects.filter(user=request.user).first()
    tickers = user_strategy_model.current_tickers
    total_amount = user_preferences.balance
   
    portfolio = EqualWeightedPortfolio(int(total_amount), tickers)
    ticker_info = portfolio.get_ticker_info_dict()

    return JsonResponse(ticker_info)


def ticker_detail(request, ticker):

    return render(request, "user_portfolio/portfolio.html", {'ticker': ticker})

def user_portfolio_api(request):
    user_portfolio = UserPortfolio(user=request.user)
    portfolio_info = user_portfolio.get_portfolio_info()

    return JsonResponse(portfolio_info)


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "user_portfolio/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "user_portfolio/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("login"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "user_portfolio/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "user_portfolio/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "user_portfolio/register.html")




