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

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.