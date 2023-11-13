import json
import yfinance as yf

class EqualWeightedPortfolio:
    def __init__(self, tickers_json, total_amount=1000, precision=2):
        self.total_amount = total_amount
        self.tickers = json.loads(tickers_json)
        self.precision = precision
        self.portfolio = {}
        self.cash_left = total_amount
        self.last_close_prices = None
        self.chart_data = None

    def fetch_last_close_prices(self):
        data = yf.download(self.tickers, period="1d")
        self.last_close_prices = data['Close'].iloc[-1]

    def calculate_portfolio(self):
        amount_per_stock = self.total_amount / len(self.tickers)
        self.fetch_last_close_prices()

        for ticker in self.tickers:
            price = self.last_close_prices[ticker]
            num_shares = round(amount_per_stock / price, self.precision)
            self.portfolio[ticker] = num_shares
            self.cash_left -= num_shares * price

        self.cash_left = round(self.cash_left, self.precision)

    def prepare_chart_data(self):
        labels = [f"{ticker}: {shares} shares" for ticker, shares in self.portfolio.items()]
        labels.append("Cash")

        data = [round(shares * self.last_close_prices[ticker], self.precision) for ticker, shares in self.portfolio.items()]
        data.append(self.cash_left)

        self.chart_data = {'labels': labels, 'data': data}

    def get_chart_data(self):
        if self.chart_data is None:
            self.calculate_portfolio()
            self.prepare_chart_data()
        return self.chart_data
