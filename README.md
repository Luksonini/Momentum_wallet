# Investment Portfolio Application

## User Registration Screen

Below is the user registration screen of the Capybara Investments platform. This is the first step for new users to create an account, granting access to personalized investment strategy tools and portfolio management. The design emphasizes clarity and ease of use, inviting users to join the Capybara community.

<div align="center">
  <img src="https://github.com/Luksonini/Momentum_wallet/assets/97095836/f9c47241-d8f7-4146-81d3-17f61463d98f" alt="User Registration Screen" width="100%"/>
</div>

## Main Dashboard

The screenshot below showcases the main dashboard of the Capybara Investments platform. It's designed to welcome users with an intuitive layout, providing quick access to essential features like 'Momentum' and 'Portfolio'. The vibrant illustration emphasizes our commitment to helping users build a stronger financial future with accessible high-quality investment advice.

<div align="center">
  <img src="https://github.com/Luksonini/Momentum_wallet/assets/97095836/136f334b-2f87-4d40-9eee-ac944f623664" alt="Main Dashboard" width="100%"/>
</div>

## Momentum Strategy Optimization

The image below displays the Momentum Optimization page of the Capybara Investments platform, where users can fine-tune their investment strategies. This page allows users to set and adjust parameters such as the evaluation window, the number of top-performing stocks to consider, and the available capital for investment. The interactive graph provides a visual representation of the strategy's performance against the US500 returns, offering an intuitive way to compare and optimize investment strategies for better decision-making.

<div align="center">
  <img src="https://github.com/Luksonini/Momentum_wallet/assets/97095836/a7eecadd-731d-4a2b-844c-b3684726b0f1" alt="Momentum Strategy Optimization" width="100%"/>
</div>

## Portfolio Management Interface

The screenshot illustrates the Portfolio Management interface of the Capybara Investments platform, a central feature where users can view and manage their individual stock holdings. The page presents a detailed table with information on company holdings, quantities, purchase prices, current values, and performance indicators such as price and percentage changes. Actions such as selling stocks can be performed directly from this interface. Above the table, an interactive stock chart for a selected company, such as Apple Inc. in this instance, shows historical price data, allowing users to visualize stock performance over time.

<div align="center">
  <img src="https://github.com/Luksonini/Momentum_wallet/assets/97095836/333e2acf-8b30-4c57-aeca-1203094d25ee" alt="Portfolio Management Interface" width="100%"/>
</div>

## Overview

This Django-based investment application enables users to manage their investment strategies and portfolio with ease. It provides robust market analysis, strategy optimization, and portfolio management features. Users can personalize their investment strategies, track market performance, and stay informed with real-time ticker suggestions.

## Key Features


### Market Analysis and Strategy Optimization

- **Historical Market Data Analysis (`MarketAnalysis` class)**: Utilizes historical market data to generate actionable portfolio suggestions. This class leverages the `scipy.optimize` algorithm for optimizing strategy parameters, enhancing investment returns.
  - **Code Reference**: `MarketAnalysis` in `market_analysis.py`.

### Advanced Portfolio Management

- **Dynamic Portfolio Adjustment (`EqualWeightedPortfolio` class)**: Enables users to dynamically adjust their portfolio's weight distribution. It integrates `yfinance` for real-time stock price monitoring and utilizes interactive `matplotlib` charts for strategy performance insights.
  - **Code Reference**: `EqualWeightedPortfolio` in `portfolio_management.py`.

### User Interaction and Insights

- **Interactive Data Visualization**: Provides users with interactive charts and data, using `matplotlib` to offer insights into strategy performance compared to benchmarks like the S&P 500 index.
  - **Code Reference**: `plot_performance` method in `MarketAnalysis` class.

### User Portfolio API

- **Detailed Portfolio Management (`UserPortfolio_utils` class)**: Allows for in-depth management of a user's portfolio, including adding and removing stocks, and calculating portfolio performance.
  - **Code Reference**: `UserPortfolio_utils` in `user_portfolio_utils.py`.

### Watchlist Management

- **Personalized Watchlist (`manage_watchlist` API)**: This feature enables users to add and remove tickers from their watchlist, tailoring their investment focus.
  - **Code Reference**: `manage_watchlist` in `views.py`.

### Ticker Suggestions

- **Auto-Suggestions for Tickers (`ticker_suggestions` API)**: Offers real-time ticker symbol suggestions to aid users in assembling their portfolio or curating their watchlist.
  - **Code Reference**: `ticker_suggestions` in `views.py`.

### Security and User Authentication

- **Secure User Sessions**: The application ensures user security, particularly for handling sensitive financial data, through Django's secure authentication mechanisms for login, logout, and user registration.
  - **Code Reference**: `login_view`, `logout_view`, `register` in `views.py`.

### Date Range Customization in Analysis

- **Flexible Date Analysis (`StockData` class)**: Users can customize the date range for market analyses, supported by the `StockData` class's flexible date handling.
  - **Code Reference**: `StockData` in `stock_data.py`.

### Automated Ticker Updates

- **Real-time Ticker Information Updates**: The application automatically updates ticker information from Wikipedia, ensuring up-to-date S&P 500 company details.
  - **Code Reference**: `_fetch_tickers` method in `StockData` class.

### Portfolio Transaction History

- **Detailed Transaction Tracking (`UserPortfolio_utils` class)**: Users can track their portfolio transaction history and changes, facilitated by the detailed tracking in `UserPortfolio_utils`.
  - **Code Reference**: `add_ticker_to_portfolio`, `remove_ticker_from_portfolio` in `UserPortfolio_utils`.

### Adaptive Investment Suggestions

- **Responsive Investment Recommendations**: The application adapts its investment suggestions based on current market trends and user preferences.
  - **Code Reference**: Strategy generation methods in `MarketAnalysis`.

---

## Installation

To get started with this investment application, follow the installation steps below:

1. Ensure you have Python installed on your system.
2. Clone the repository to your local machine.
3. Navigate to the project directory and install the required dependencies:

    ```sh
    pip install -r requirements.txt
    ```

4. Before running the server for the first time, you need to populate the database with ticker symbols, company logos, and full names:

    ```sh
    python manage.py maptickers
    ```

5. After the database has been successfully populated, you can run the development server:

    ```sh
    python manage.py runserver
    ```

6. Access the application through your browser at `http://127.0.0.1:8000/`.

## Technical Description

- **User Authentication Views:** Manages user sessions, including secure login, logout, and registration processes.
- **Market Analysis Class:** Analyzes the market using historical data to generate actionable portfolio suggestions.
- **Portfolio Management Utilities:** Assists in managing user portfolios, including ticker management and performance calculations.
- **API Endpoints:** Provides dynamic interaction with the frontend for real-time data updates and user-specific customizations.

## Initial Setup

To ensure the application's functionality, execute the `maptickers` command before the first run to update the database with the latest ticker information, logos, and full company names. This step is essential for the application to deliver accurate and up-to-date market data.

## Getting Started

After installation, navigate to the main page to start customizing your investment strategy. Use the form to enter your preferences and let the application generate a strategy for you. Explore different sections to optimize your strategy, manage your portfolio, and stay updated with the latest market trends.

## Contribution

Your contributions are welcome! Please fork the repository and submit a pull request with your proposed changes.


# Technical Description of Functions

### `index`:

- Renders the main page with a form for entering strategies and displays portfolio data.

### `chart_data`:

- An API endpoint that receives data from the frontend, saves user preferences, and generates chart data for the current portfolio strategy.

### `optimisation_view`:

- An API endpoint for optimizing strategy parameters, saves new parameters in user preferences, and generates chart data.

### `tickers_info`:

- An API endpoint that provides information about the tickers in the user's portfolio.

### `portfolio`:

- Renders a page with detailed information about the selected ticker, user strategies, and watchlist.

### `manage_watchlist`:

- An API endpoint for managing the watchlist, allowing the addition and removal of tickers.

### `ticker_suggestions`:

- An API endpoint that provides ticker suggestions based on user queries.

### `user_portfolio_api`:

- An API endpoint that manages the user's portfolio, allows adding and removing tickers, and calculates portfolio performance.

### `searching_ticker_value`:

- An API endpoint that searches for the current value of a ticker and the user's available funds.

### `login_view`, `logout_view`, `register`:

- Views to manage the login, logout, and registration process for users.

# Helper Classes and Methods

### `UserPortfolio_utils`:

- A helper class for managing the user's portfolio, adding and removing tickers, and calculating performance.

### `EqualWeightedPortfolio`:

- A class for creating and managing an equally weighted portfolio, calculating current prices, and generating chart data.

### `MarketAnalysis`:

- A class for conducting market analysis, strategy optimization, and generating strategy results.

### `StockData`:

- A helper class for fetching and processing stock market data for market analysis.



## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.
