import pandas as pd
import numpy as np
import yfinance as yf
import matplotlib.pyplot as plt
from scipy.optimize import brute
import json

class StockData:
    def __init__(self, start_date):
        self.start = start_date
        self.tickers = []
        self.df = pd.DataFrame()
        self.us500_table = None
        self.removed_tickers = None

    def _fetch_tickers(self):
        us500_table = pd.read_html('https://en.wikipedia.org/wiki/List_of_S%26P_500_companies')[0]
        self.tickers = us500_table['Symbol'].to_list()
        self.us500_table = us500_table[us500_table['Date added'] >= self.start]

    def _fetch_removed_tickers(self):
        removed_tickers = pd.read_html('https://en.wikipedia.org/wiki/List_of_S%26P_500_companies')[1][['Date', 'Removed']]
        removed_tickers.columns = removed_tickers.columns.get_level_values(1)
        self.removed_tickers = removed_tickers[['Date', 'Ticker']]
        self.removed_tickers.set_index('Date', inplace=True)
        self.removed_tickers.index = pd.to_datetime(self.removed_tickers.index)
        self.removed_tickers = self.removed_tickers[self.removed_tickers.index >= self.start].dropna()

    def _combine_tickers(self):
        self.tickers.extend(self.removed_tickers.Ticker.tolist())
        self.tickers = [ticker.replace('.', '-') for ticker in self.tickers]

    def _download_data(self):
        self.df = yf.download(self.tickers, start=self.start, interval='1mo')['Close']
        self.df.index = pd.to_datetime(self.df.index)

    def _pricefilter_rem(self, ticker):
        if ticker in self.df.columns:
            self.df[ticker] = self.df[ticker][self.df[ticker].index <= self.removed_tickers[self.removed_tickers.Ticker == ticker].index[0]]

    def _pricefilter_add(self, ticker):
        if ticker in self.df.columns:
            self.df[ticker] = self.df[ticker][self.df[ticker].index >= self.us500_table[self.us500_table.Symbol == ticker]['Date added'].values[0]]

    def _apply_filters(self):
        for removed_ticker in self.removed_tickers['Ticker']:
            self._pricefilter_rem(removed_ticker)
        for ticker_added in self.us500_table['Symbol']:
            self._pricefilter_add(ticker_added)

    def get_data(self):
        if self.df.empty:
            self._fetch_tickers()
            self._fetch_removed_tickers()
            self._combine_tickers()
            self._download_data()
            self._apply_filters()
        
        return self.df

class MarketAnalysis:

    def __init__(self, start_date, window=8, nlargest_window=6):
        self.start_date = start_date
        self.window = window
        self.nlargest_window = nlargest_window
        self.market_data = StockData(self.start_date)
        self.data = self.market_data.get_data()
        self.monthly_returns = self.calculate_monthly_returns()
        self.rolling_returns_large = self.calculate_rolling_returns(self.monthly_returns, self.window)
        self.nas_df = self._get_SP500_data()
    
    def _get_SP500_data(self):
        nas_df = yf.download('^GSPC', start=self.start_date, interval='1mo')['Close'].to_frame()
        nas_df["US500_returns"] = np.log(nas_df['Close'].div(nas_df['Close'].shift(1)))
        nas_df["US500_returns"] = nas_df["US500_returns"].cumsum().apply(np.exp)
        return nas_df

    def calculate_monthly_returns(self):
        monthly_returns = np.log(self.data.div(self.data.shift(1)))[1:]
        return monthly_returns

    def calculate_rolling_returns(self, df, n):
        return df.rolling(n).sum().apply(np.exp)

    def get_top_tickers(self, date):
        top_window = self.rolling_returns_large.loc[date].nlargest(self.nlargest_window).index
        return top_window

    def portfolio_performance(self, date):
        portfolio = self.monthly_returns.loc[date:, self.get_top_tickers(date)].shift(-1).head(1)
        return portfolio.mean(axis=1).values[0]

    def get_current_month_tickers(self):
        tickers = self.get_top_tickers(self.monthly_returns.index[-1])
        return json.dumps(list(tickers))

    def plot_performance(self):
        returns = [self.portfolio_performance(date) for date in self.monthly_returns.index[:-1]]
        strategy = pd.Series(returns, index=self.monthly_returns.index[:-1]).cumsum().apply(np.exp)
        self.nas_df['strategy'] = strategy
        self.nas_df[['US500_returns', 'strategy']].plot()


    def strategy_results(self):
        results_df = self.nas_df[['US500_returns']].iloc[:-1]
        strategy_returns = pd.Series(
            [self.portfolio_performance(date) for date in self.monthly_returns.index[:-1]],
            index=self.monthly_returns.index[:-1]
        ).cumsum().apply(np.exp)

        results_df['strategy'] = strategy_returns
        results_df = results_df.dropna()  # Usuwa wiersze z jakimikolwiek wartościami NaN

        chart_data = [
            {
                'date': index.strftime('%Y-%m-%d'),  # Zmiana formatu daty na string
                'US500_returns': row['US500_returns'],
                'strategy': row['strategy']
            }
            for index, row in results_df.iterrows()
        ]
        
        return chart_data

        # Nowa metoda do optymalizacji
    def optimize_parameters(self, window_range, nlargest_range, step=1):
        """
        Optymalizuje parametry window i nlargest_window.

        :param window_range: krotka (min, max) dla window
        :param nlargest_range: krotka (min, max) dla nlargest_window
        :param step: krok przeszukiwania
        :return: najlepsze znalezione parametry
        """
        
        def objective(params):
            self.window, self.nlargest_window = int(params[0]), int(params[1])
            self.rolling_returns_large = self.calculate_rolling_returns(self.monthly_returns, self.window)
            returns = []
            for date in self.monthly_returns.index[:-1]:
                try:
                    performance = self.portfolio_performance(date)
                    if np.isnan(performance):
                        performance = 0  # Zastąpienie NaN zerem
                    returns.append(performance)
                except KeyError:
                    returns.append(0)
            cumulative_performance = np.exp(np.sum(np.log1p(returns)))
            return -cumulative_performance  # minus, ponieważ brute szuka minimum

        ranges = (slice(window_range[0], window_range[1], step), slice(nlargest_range[0], nlargest_range[1], step))
        
        result = brute(objective, ranges, full_output=True, finish=None)
        return result[0], -result[1]


