# Django imports
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.db import IntegrityError
from django.http import HttpResponseRedirect
from django.shortcuts import render, redirect
from django.urls import reverse
from .forms import StrategyInputForm, OptimisationPreferencesForm, PortfolioCreationForm
from .models import User, UserStrategyModel, MarketAnalysisPreferences, MappedTickers, Portfolio, Watchlist
from .utils.momentum import MarketAnalysis
from .utils.calculate_weights import EqualWeightedPortfolio
from .utils.calculate_user_portfolio import UserPortfolio_utils
from django.http import JsonResponse
import json
from datetime import datetime
from django.core.serializers.json import DjangoJSONEncoder
from .filters import MappedTickersFilter
from django.db.models import Q
import json
from decimal import Decimal
import yfinance as yf


def index(request):
    """
    Renders the homepage of the investment application.
    """
    return render(request, "user_portfolio/index.html")


@login_required(login_url='login')
def momentum(request):
    """
    Handles the momentum strategy page. It allows users to input investment 
    preferences, view and optimize their investment strategies using historical 
    market data.
    """
    strategy_form = StrategyInputForm(request.POST or None)
    optimisation_form = OptimisationPreferencesForm(request.POST or None)
    user_strategy_model = UserStrategyModel.objects.filter(user=request.user).first()
    chart_data = None
    equally_portfolio_data = None

    user_preferences, created = MarketAnalysisPreferences.objects.get_or_create(user=request.user)

    if user_strategy_model and user_strategy_model.returns_data:
        chart_data = user_strategy_model.returns_data
        equally_portfolio = EqualWeightedPortfolio(total_amount=int(user_preferences.balance), tickers=user_strategy_model.current_tickers)
        equally_portfolio_data = equally_portfolio.get_chart_data()

    return render(request, "user_portfolio/momentum_settings.html", {
        'strategy_form': strategy_form,
        'chart_data': json.dumps(chart_data) if chart_data else None,
        'equally_portfolio_data' : equally_portfolio_data,
        'optimisation_form' : optimisation_form,
        'user_preferences' : user_preferences,
    })

@login_required(login_url='login')
def chart_data(request):
    """
    API view to fetch and return chart data based on user's strategy preferences.
    The data includes performance comparison between user's strategy and US500 returns.
    """
    start_date_str = request.GET.get('start_date', None)
    window = request.GET.get('window')
    nlargest_window = int(request.GET.get('nlargest'))
    balance = request.GET.get('balance')
    start_date = datetime.strptime(str(start_date_str), '%Y-%m-%d').date()
    user_preferences, created = MarketAnalysisPreferences.objects.update_or_create(
    user=request.user,
    defaults={
        'start_date': start_date,
        'window': int(window),
        'nlargest_window': int(nlargest_window),
        'balance': int(balance)
    }
)

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


    return JsonResponse(response_data)


@login_required(login_url='login')
def optimisation_view(request):
    """
    View for optimizing investment strategy parameters. It updates user preferences 
    and generates new chart data based on optimized parameters.
    """
    optimisation_date = request.GET.get('optimisation_date')
    window = request.GET.get('window')
    nlargest_window = request.GET.get('nlargest_window') 

    market_analysis = MarketAnalysis(start_date=optimisation_date)
    optimal_params = market_analysis.optimize_parameters(window_range=(1, int(window) + 1), nlargest_range=(5, int(nlargest_window) + 1))

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

    results_json = market_analysis.strategy_results()
    tickers = market_analysis.get_current_month_tickers()
    print(tickers)
    equally_portfolio = EqualWeightedPortfolio(total_amount=int(user_preferences.balance), tickers=tickers)
    equally_portfolio_data = equally_portfolio.get_chart_data()

    UserStrategyModel.objects.update_or_create(user=request.user, defaults={'returns_data': results_json, 'current_tickers': tickers})
    

    response_data = {
        'results': results_json,
        'new_window': new_window,
        'new_nlargest_window': new_nlargest_window,
        # 'piechart_data': tickers,
        'equally_portfolio_data' : equally_portfolio_data
    }

    return JsonResponse(response_data, encoder=DjangoJSONEncoder, safe=False)

def tickers_info(request):
    """
    API view that provides information about tickers in user's strategy.
    Returns data including current prices, price changes, and company details.
    """
    user_strategy_model = UserStrategyModel.objects.filter(user=request.user).first()
    user_preferences = MarketAnalysisPreferences.objects.filter(user=request.user).first()
    tickers = user_strategy_model.current_tickers
    total_amount = user_preferences.balance
   
    portfolio = EqualWeightedPortfolio(int(total_amount), tickers)
    ticker_info = portfolio.get_ticker_info_dict()

    return JsonResponse(ticker_info)


@login_required(login_url='login')
def portfolio(request, ticker=''):
    """
    Portfolio management view. If a user's portfolio exists, it displays the portfolio.
    Otherwise, it provides a form to create a new portfolio. Users can also delete their portfolio here.
    """
    try:
        # Try to get the existing portfolio
        portfolio = Portfolio.objects.get(user=request.user)
        # If a portfolio is found, we do not need to create a new one
        portfolio_created = True
    except Portfolio.DoesNotExist:
        # If a portfolio does not exist, we will indicate that one needs to be created
        portfolio = None
        portfolio_created = False

    form = PortfolioCreationForm(request.POST or None)

    if request.method == 'POST':
        if form.is_valid() and not portfolio_created:
            initial_cash = form.cleaned_data['initial_cash']
            # Create a new portfolio instance with the initial cash
            Portfolio.objects.create(
                user=request.user,
                available_cash=initial_cash,
                initial_portfolio_value=initial_cash
            )
            return redirect('portfolio', ticker=ticker)

        if 'delete_portfolio' in request.POST:
            if portfolio:
                portfolio.delete()
                return redirect('portfolio', ticker=ticker)
    
    strategy_tickers = UserStrategyModel.objects.filter(user=request.user).first()
    strategy_tickers = json.loads(strategy_tickers.current_tickers) if strategy_tickers and strategy_tickers.current_tickers else []
    company_names = {}
    for strategy_ticker in strategy_tickers:
        formatted_ticker = strategy_ticker.replace('.', '-') if '.' in strategy_ticker else strategy_ticker
        mapped_tickers = MappedTickers.objects.filter(ticker=formatted_ticker).first()
        if mapped_tickers:
            company_names[mapped_tickers.ticker] = mapped_tickers.company_name

    watchlist = Watchlist.objects.filter(user=request.user).first()
    watchlist_tickers = watchlist.tickers.all() if watchlist else []

    filter = MappedTickersFilter(request.GET, queryset=MappedTickers.objects.all())

    return render(request, "user_portfolio/portfolio.html", {
        'form': form if not portfolio_created else None,
        'ticker': ticker, 
        'strategy_tickers_dict': company_names,
        'watchlist_tickers': watchlist_tickers,
        'filter': filter,
        'portfolio_created': portfolio_created,
    })


def manage_watchlist(request):
    """
    API view for managing a user's watchlist. Allows adding and removing tickers from the watchlist.
    """
    if request.method == 'POST':
        data = json.loads(request.body)
        action = data.get('action')
        ticker = data.get('ticker')

        if action == 'add':
            watchlist_ticker = MappedTickers.objects.filter(ticker=ticker).first()
            if watchlist_ticker:
                watchlist, created = Watchlist.objects.get_or_create(user=request.user)
                watchlist.tickers.add(watchlist_ticker)
                watchlist.save()
            return JsonResponse({'success': True, 'message': 'Ticker added to watchlist'})

        elif action == 'remove':
            watchlist_ticker = MappedTickers.objects.filter(ticker=ticker).first()
            if watchlist_ticker:
                watchlist = Watchlist.objects.get(user=request.user)
                watchlist.tickers.remove(watchlist_ticker)
                watchlist.save()
            return JsonResponse({'success': True, 'message': 'Ticker removed from watchlist'})

    return JsonResponse({'success': False, 'message': 'Invalid request'})


def ticker_suggestions(request):
    """
    API view that provides auto-suggestions for ticker symbols based on user input.
    Helps users in assembling their portfolio or curating their watchlist.
    """
    query = request.GET.get('query', '')
    data = []

    if query:  
        suggestions = MappedTickers.objects.filter(
            Q(ticker__icontains=query) | Q(company_name__icontains=query)
        )[:10]  

        data = [{'ticker': t.ticker, 'company_name': t.company_name} for t in suggestions]

    return JsonResponse(data, safe=False)

def user_portfolio_api(request):
    """
    API view for managing user's portfolio. It allows adding and removing tickers 
    from the portfolio and calculates portfolio performance.
    """
    user_portfolio = UserPortfolio_utils(user=request.user)

    if request.method == 'GET':
        portfolio_info = user_portfolio.get_portfolio_info()
        performance_info = user_portfolio.calculate_portfolio_performance()
        response_data = {
            'portfolio_info': portfolio_info,
            'performance_info': performance_info
        }
    elif request.method == 'POST':
        data = json.loads(request.body)
        if 'sell_ticker' not in data:
            ticker_symbol = data.get('ticker_symbol')
            purchase_price = data.get('purchase_price')
            quantity = data.get('quantity')
            user_portfolio.add_ticker_to_portfolio(ticker_symbol, Decimal(purchase_price), Decimal(quantity))
        else:
            user_portfolio.remove_ticker_from_portfolio(ticker_symbol=data['sell_ticker'], current_price=Decimal(data['price']))

        portfolio_info = user_portfolio.get_portfolio_info()
        performance_info = user_portfolio.calculate_portfolio_performance()
        response_data = {
            'portfolio_info': portfolio_info,
            'performance_info': performance_info
        }

    return JsonResponse(response_data)

def searching_ticker_value(request):
    """
    API view for fetching the current market value of a specific ticker symbol. 
    Also provides the user's available cash for potential transactions.
    """
    if request.method == 'GET':
        ticker = request.GET.get('ticker')
        if ticker:
            try:
                data = yf.download(ticker, period="1d")['Close'].iloc[-1]
                user_portfolio = Portfolio.objects.get(user=request.user)
                available_cash = user_portfolio.available_cash

                return JsonResponse({'ticker': ticker, 'price': data, 'available_cash': available_cash})
            except Exception as e:
                return JsonResponse({'error': str(e)}, status=400)
        else:
            return JsonResponse({'error': 'No ticker provided'}, status=400)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)


def login_view(request):
    """
    View for handling user login. Authenticates users and directs them to the homepage upon successful login.
    """
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
    """
    Handles user logout and redirects to the login page.
    """
    logout(request)
    return HttpResponseRedirect(reverse("login"))


def register(request):
    """
    View for handling new user registrations. Validates user input and creates new user accounts.
    """
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




