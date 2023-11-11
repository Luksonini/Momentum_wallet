from django.core.management.base import BaseCommand
from user_portfolio.models import Prices, Ticker  # Zaimportuj model
from datetime import datetime, timedelta
import yfinance as yf
import pandas as pd


from django.db.models import Case, When
from django.db import transaction
from django.db.models import Max

class Command(BaseCommand):
    help = 'Update stock data'
    
    def handle(self, *args, **kwargs):
        self.update_stock_data()

    def get_nasdaq_tickers(self):
        url = 'https://en.wikipedia.org/wiki/Nasdaq-100'
        tables = pd.read_html(url)
        return tables[4]['Ticker'].to_list()

    def update_stock_data(self):
        print('The database is updating')
        last_date = Prices.objects.aggregate(Max('date'))['date__max']
        end_date = datetime.today().date()
        start_date = last_date + timedelta(days=1) if last_date else end_date - timedelta(days=3650)
        tickers = self.get_nasdaq_tickers()
        
        with transaction.atomic():
            for ticker_symbol in tickers:
                ticker, created = Ticker.objects.get_or_create(symbol=ticker_symbol)
                data = yf.download(ticker_symbol, start=start_date, end=end_date)
                price_updates = []
                for index, row in data.iterrows():
                    price_updates.append(Prices(
                        ticker=ticker,
                        date=index.date(),
                        open=row['Open'],
                        high=row['High'],
                        low=row['Low'],
                        close=row['Close'],
                    ))

                Prices.objects.bulk_create(price_updates, ignore_conflicts=True)