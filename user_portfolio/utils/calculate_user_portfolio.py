import yfinance as yf
from ..models import Portfolio, MappedTickers
from decimal import Decimal

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
        data = yf.download(tickers, period="1d")['Close'].iloc[-1]
        return data.to_dict()

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
            current_price = Decimal(current_prices.get(ticker, 0))  # Convert to Decimal
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
