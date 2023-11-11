from django_q.tasks import async_task
from django_q.models import Schedule
import pandas as pd
import yfinance as yf
from datetime import datetime, timedelta
from . models import Ticker, Prices

def get_nasdaq_tickers():
    url = 'https://en.wikipedia.org/wiki/Nasdaq-100'
    tables = pd.read_html(url)
    return tables[4]['Ticker'].to_list()

def update_stock_data():
    print("the data base ongoing update...")
    last_date = Prices.objects.latest('date').date if Prices.objects.exists() else None
    end_date = datetime.today().date()
    start_date = last_date if last_date else end_date - timedelta(days=365)
    tickers = get_nasdaq_tickers()
    for ticker_symbol in tickers:
        # Sprawdź, czy obiekt Ticker z danym symbolem już istnieje
        ticker, created = Ticker.objects.get_or_create(symbol=ticker_symbol)
        
        data = yf.download(ticker_symbol, start=start_date, end=end_date)
        for index, row in data.iterrows():
            stock, created = Prices.objects.update_or_create(
                ticker=ticker,  # Użyj obiektu Ticker zamiast ciągu tekstowego
                date=index.date(),
                defaults={
                    'open': row['Open'],
                    'high': row['High'],
                    'low': row['Low'],
                    'close': row['Close'],
                }
            )

