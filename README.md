# Investment Portfolio Application

## Overview

This Django-based investment application enables users to manage their investment strategies and portfolio with ease. It provides robust market analysis, strategy optimization, and portfolio management features. Users can personalize their investment strategies, track market performance, and stay informed with real-time ticker suggestions.

## Key Features

- **User Authentication:** Secure login, logout, and user registration.
- **Strategy Management:** Input and automatic generation of investment strategies based on user preferences.
- **Market Analysis:** Historical data analysis to generate portfolio recommendations.
- **Strategy Optimization:** Parameter optimization features for maximizing investment returns.
- **Portfolio Management:** Create and adjust an equally-weighted investment portfolio.
- **User Interaction:** Dynamic charts and data presentation for strategy performance comparison.
- **Watchlist Management:** Add and remove tickers from a personalized watchlist.
- **Ticker Suggestions:** Auto-suggestions for tickers during searches for ease of adding to portfolios or watchlists.
- **User Portfolio API:** Provides portfolio information, including performance and detailed entries.

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

- **User Authentication Views:** Handle user sessions including login, logout, and registration.
- **Market Analysis Class:** Analyses the market using historical data to generate portfolio suggestions.
- **Portfolio Management Utilities:** Manage user portfolios, calculate performance, and handle ticker additions/removals.
- **API Endpoints:** Interact with the frontend for dynamic data retrieval and user-specific updates.

## Initial Setup

Upon first running the application, execute the `maptickers` command to update the database with the latest ticker information. This step is crucial for the proper functioning of the application and ensures all features related to market data are accurate and up to date.

## Contribution

Your contributions are welcome! Please fork the repository and submit a pull request with your proposed changes.

# Key Features

## User Authentication:

- Utilizes Django's built-in mechanisms for logging in and logging out.
- New user registration with password validation and security.

## Strategy Management:

- Allows users to input their investment strategy preferences.
- Automatically generates investment strategies based on user preferences.

## Market Analysis:

- Analyzes the market using historical data to generate portfolio recommendations.
- Uses the `yfinance` library to fetch market data.

## Strategy Optimization:

- Features for optimizing investment strategy parameters to maximize returns.
- Optimization algorithm using `scipy.optimize`.

## Portfolio Management:

- Creates an equally weighted investment portfolio based on selected tickers.
- Ability to add and remove tickers from the user's portfolio.

## User Interaction:

- Dynamic charts and data present the performance of strategies compared to the S&P 500 index.
- A user interface that allows customization and review of strategy results.

## Watchlist:

- Functionality that allows users to create and manage a watchlist of tickers.
- Adding and removing tickers from the watchlist.

## Ticker Suggestions:

- Automatic ticker suggestions during searches for easier addition to the portfolio or watchlist.

## User Portfolio API:

- Provides information about the portfolio, including performance and details of individual entries.

# Technical Description of Functions

# `index`:

- Renders the main page with a form for entering strategies and displays portfolio data.

# `chart_data`:

- An API endpoint that receives data from the frontend, saves user preferences, and generates chart data for the current portfolio strategy.

# `optimisation_view`:

- An API endpoint for optimizing strategy parameters, saves new parameters in user preferences, and generates chart data.

# `tickers_info`:

- An API endpoint that provides information about the tickers in the user's portfolio.

# `ticker_detail`:

- Renders a page with detailed information about the selected ticker, user strategies, and watchlist.

# `manage_watchlist`:

- An API endpoint for managing the watchlist, allowing the addition and removal of tickers.

# `ticker_suggestions`:

- An API endpoint that provides ticker suggestions based on user queries.

# `user_portfolio_api`:

- An API endpoint that manages the user's portfolio, allows adding and removing tickers, and calculates portfolio performance.

# `searching_ticker_value`:

- An API endpoint that searches for the current value of a ticker and the user's available funds.

# `login_view`, `logout_view`, `register`:

- Views to manage the login, logout, and registration process for users.

# Helper Classes and Methods

# `UserPortfolio_utils`:

- A helper class for managing the user's portfolio, adding and removing tickers, and calculating performance.

# `EqualWeightedPortfolio`:

- A class for creating and managing an equally weighted portfolio, calculating current prices, and generating chart data.

# `MarketAnalysis`:

- A class for conducting market analysis, strategy optimization, and generating strategy results.

# `StockData`:

- A helper class for fetching and processing stock market data for market analysis.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.