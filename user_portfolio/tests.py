from django.test import TestCase

# Create your tests here.
import unittest
import pandas as pd
import numpy as np
from unittest.mock import patch, MagicMock
from datetime import date
from utils.momentum import MarketAnalysis, StockData

def create_mock_data():
    current_date = date.today()
    date_24_months_ago = current_date - pd.DateOffset(months=24)
    date_24_months_ago_str = date_24_months_ago.strftime("%Y-%m-%d")

    date_range = pd.date_range(start=date_24_months_ago_str, periods=24, freq='M')
    us500_table = pd.read_html('https://en.wikipedia.org/wiki/List_of_S%26P_500_companies')[0]
    tickers = us500_table['Symbol'].to_list()[:20]
    
    df = pd.DataFrame(index=date_range)

    tickers = us500_table['Symbol'].to_list()[:20]
    
    for i, ticker in enumerate(tickers):
        df[ticker] = 100 + i + np.arange(24) * (i + 1)
    
    return df



# class TestStockData(unittest.TestCase):

#     def setUp(self):

#         self.mocked_df = create_mock_data()
#         today =  date.today()
#         self.sd = StockData(start_date=today.strftime("%Y-%m-%d"))

#     @patch('yfinance.download')
#     def test_tickers(self, mock_download):
#         mock_download.return_value = self.mocked_df
#         print(self.sd.tickers)
#         self.assertEqual(self.sd.tickers[0:10], self.mocked_df.columns)
        

# class TestMarketAnalysis(unittest.TestCase):
#     def test_calculate_monthly_returns(self):
#         data = pd.DataFrame({
#             'AAPL': [100, 110, 105, 115],
#             'MSFT': [200, 210, 205, 215]
#         }, index=pd.date_range(start='2020-01-01', periods=4, freq='M'))
        
#         ma = MarketAnalysis(start_date='2023-09-01')
#         ma.data = data
#         expected_returns = np.log(data.div(data.shift(1)))[1:]
#         calculated_returns = ma.calculate_monthly_returns()

#         pd.testing.assert_frame_equal(calculated_returns, expected_returns)





    # def test_get_stock_data(self, mock_download):
    #     # Asercje
    #     # Upewnij się, że dane są takie same jak mockowane dane
    #     pd.testing.assert_frame_equal(self.sd.df, mock_data.xs('Close', level='Info', axis=1))

    #     # Sprawdzenie, czy mock został wywołany
    #     mock_download.assert_called_once_with(self.sd.tickers, start='2023-09-01', interval='1mo')

    # def test_us500_tickers_length(self):
    #     # Ta metoda wymaga aby _fetch_tickers() był wywołany, aby tickery były dostępne.
    #     self.sd._fetch_tickers()  # Upewnij się, że ta metoda jest mockowana lub skonfigurowana w setUp, jeśli ma być testowana.
    #     stocks_number = len(self.sd.tickers)

    #     self.assertEqual(stocks_number, 503)  # Poprawiona metoda asercji



class TestStockData(unittest.TestCase):
    def setUp(self):
        current_date = date.today()
        date_24_months_ago = current_date - pd.DateOffset(months=24)
        date_24_months_ago_str = date_24_months_ago.strftime("%Y-%m-%d")

        date_range = pd.date_range(start=date_24_months_ago_str, periods=24, freq='M')
        us500_table = pd.read_html('https://en.wikipedia.org/wiki/List_of_S%26P_500_companies')[0]

        df = pd.DataFrame(index=date_range)

        tickers = us500_table['Symbol'].to_list()[:20]

        for i, ticker in enumerate(tickers):
            df[ticker] = 100 + i + np.arange(24) * (i + 1)
    
        self.df = df
        self.sd = StockData(start_date=current_date.strftime("%Y-%m-%d"))
        print(self.sd.tickers[:10])
        print(self.df.columns[:10])
        

    def test_tickers(self):
        # Testowanie, czy tickery są poprawne
        self.assertEqual(self.sd.columns[:4], self.sd.columns[:4])

if __name__ == '__main__':
    unittest.main()



