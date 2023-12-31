import json
import yfinance as yf
import requests
from ..models import MappedTickers

class EqualWeightedPortfolio:
    def __init__(self, total_amount, tickers, precision=2):
        self.total_amount = total_amount
        self.tickers = json.loads(tickers)
        self.precision = precision
        self.portfolio = {}
        self.cash_left = total_amount
        self.last_close_prices = None
        self.previous_close_prices = None
        self.chart_data = None


    def fetch_last_close_prices(self):
        # Pobierz dane za ostatnie dwa dni
        data = yf.download(self.tickers, period="2d")
        self.last_close_prices = data['Close'].iloc[-1]
        self.previous_close_prices = data['Close'].iloc[-2]

    def calculate_portfolio(self):
        amount_per_stock = self.total_amount / len(self.tickers)
        self.fetch_last_close_prices()

        for ticker in self.tickers:
            price = self.last_close_prices[ticker]
            num_shares = round(amount_per_stock / price, self.precision)
            self.portfolio[ticker] = num_shares
            self.cash_left -= num_shares * price

        self.cash_left = round(self.cash_left, self.precision)

    def get_company_logo_and_name(self, ticker):
        try:
            mapped_ticker = MappedTickers.objects.get(ticker=ticker)
            return mapped_ticker.company_name, mapped_ticker.logo_url
        except MappedTickers.DoesNotExist:
            return None, None
        
    def get_ticker_info_dict(self):
        if self.last_close_prices is None or self.previous_close_prices is None:
            self.fetch_last_close_prices()

        ticker_info_dict = {}
        for ticker in self.tickers:
            current_price = self.last_close_prices[ticker]
            previous_price = self.previous_close_prices[ticker]
            price_change = current_price - previous_price
            percent_change = (price_change / previous_price) * 100
            company_name, logo = self.get_company_logo_and_name(ticker)
            ticker_info_dict[ticker] = {
                'ticker': ticker,
                'current_price': round(current_price, self.precision),
                'price_change': round(price_change, self.precision),
                'percent_change': round(percent_change, self.precision),
                'company_name': company_name,
                'logo': logo,
            }
        return ticker_info_dict

    def prepare_chart_data(self):
        labels = [f"{ticker}: {shares} shares" for ticker, shares in self.portfolio.items()]
        labels.append("Cash")

        data = [round(shares * self.last_close_prices[ticker], self.precision) for ticker, shares in self.portfolio.items()]
        data.append(self.cash_left)

        self.chart_data = json.dumps({'labels': labels, 'data': data})

    def get_chart_data(self):
        if self.chart_data is None:
            self.calculate_portfolio()
            self.prepare_chart_data()
        return self.chart_data





