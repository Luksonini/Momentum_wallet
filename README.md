# Investment Portfolio Application

## Overview

This Django-based investment application enables users to manage their investment strategies and portfolio with ease. It provides robust market analysis, strategy optimization, and portfolio management features. Users can personalize their investment strategies, track market performance, and stay informed with real-time ticker suggestions.

## Key Features

- **User Authentication:** Secure login, logout, and user registration with Django's built-in mechanisms.
- **Strategy Management:** Users can input their investment preferences and automatically generate investment strategies.
- **Market Analysis:** Utilizes historical market data to generate portfolio recommendations.
- **Strategy Optimization:** Employs parameter optimization to maximize investment returns using the `scipy.optimize` algorithm.
- **Portfolio Management:** Users can create and adjust an equally-weighted investment portfolio.
- **User Interaction:** Interactive charts and data provide insights into strategy performance compared to benchmarks like the S&P 500 index.
- **Watchlist Management:** Enables users to add and remove tickers from a personal watchlist.
- **Ticker Suggestions:** Offers auto-suggestions for ticker symbols to aid in portfolio assembly or watchlist curation.
- **User Portfolio API:** Provides detailed portfolio information, including performance metrics and individual entry details.

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

### `ticker_detail`:

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