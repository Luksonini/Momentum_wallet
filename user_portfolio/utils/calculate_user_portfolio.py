import yfinance as yf
from ..models import Portfolio, MappedTickers, PortfolioEntry
from decimal import Decimal
from django.utils import timezone
import pandas as pd
import numpy as np


class UserPortfolio_utils:
    def __init__(self, user, precision=2):
        self.user = user
        self.precision = precision
        self.portfolio = Portfolio.objects.get(user=user)
        self.entries = self.portfolio.entries.all()
        self.total_value = 0
        self.cash_left = self.portfolio.available_cash  

    def fetch_current_prices(self):
        tickers = [entry.ticker_symbol for entry in self.entries]

        if not tickers:
            return {}

        data = yf.download(tickers, period="1d")['Close'].iloc[-1]

        if isinstance(data, (float, np.float64)):
            return {tickers[0]: data}
        else:
            return data.to_dict()

    def calculate_portfolio_performance(self):
        current_value = self.calculate_total_value()
        initial_value = self.portfolio.initial_portfolio_value
        percent_change = ((current_value - initial_value) / initial_value) * 100 if initial_value != 0 else 0
        return {
            'balance': round(current_value, self.precision),
            'available_cash': round(self.cash_left, self.precision),
            'initial_portfolio_value': round(initial_value, self.precision),
            'percent_change': round(percent_change, self.precision)
        }
    
    def get_portfolio_info(self):
        current_prices = self.fetch_current_prices()
        portfolio_info = {}

        for entry in self.entries:
            ticker = entry.ticker_symbol  # Use the ticker symbol from the entry
            ticker_modified = ticker.replace('-', '.') if '-' in ticker else ticker
            mapped_ticker = MappedTickers.objects.get(ticker=ticker_modified)
            company_name = mapped_ticker.company_name  # Use the correct attribute for company name
            logo = mapped_ticker.logo_url  # Get the logo URL
            purchase_price = entry.purchase_price
            current_price = Decimal(current_prices.get(ticker, 0))  
            quantity = entry.quantity
            value = quantity * current_price  # Now both are Decimal
            price_change = current_price - purchase_price
            percent_change = (price_change / purchase_price) * 100


            portfolio_info[ticker] = {
                'ticker': ticker,
                'company_name' : company_name,
                'logo' : logo,
                'quantity': quantity,
                'purchase_price': round(purchase_price, 2),
                'current_price': round(current_price, 2),
                'value': round(value, 2),
                'price_change': round(price_change, 2),
                'percent_change': round(percent_change, 2),
            }

            self.total_value += value

        return portfolio_info

    def calculate_total_value(self):
        return self.total_value + self.cash_left
    

    def add_ticker_to_portfolio(self, ticker_symbol, purchase_price, quantity):
        existing_entry = self.entries.filter(ticker_symbol=ticker_symbol).first()

        if existing_entry:
            existing_entry.purchase_price = (existing_entry.purchase_price * existing_entry.quantity + purchase_price * quantity) / (existing_entry.quantity + quantity)
            existing_entry.quantity += quantity
            existing_entry.save()
        else:
            new_entry = PortfolioEntry(
                portfolio=self.portfolio,
                ticker_symbol=ticker_symbol,
                purchase_date=timezone.now(), 
                purchase_price=purchase_price,
                quantity=quantity
            )
            new_entry.save()

        self.portfolio.available_cash -= purchase_price * quantity
        self.portfolio.save()

    def remove_ticker_from_portfolio(self, ticker_symbol, current_price):
        entry_to_remove = self.entries.filter(ticker_symbol=ticker_symbol).first()

        if entry_to_remove:
            self.portfolio.available_cash += current_price * entry_to_remove.quantity
            self.portfolio.save()
            
            entry_to_remove.delete()
