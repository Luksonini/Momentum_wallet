## Introduction
Welcome to the Capybara Investments Platform, an advanced web-based application designed to revolutionize personal investment management. At the intersection of finance and technology, this platform delivers a seamless integration of market analytics, strategy optimization, and real-time portfolio management, all through a user-centric interface.
In a financial landscape where decision-making is paramount, our platform stands as a beacon of innovation, providing users with a sophisticated toolkit designed to tailor investment strategies to individual financial goals and market conditions. By leveraging cutting-edge technologies and complex algorithms, the Capybara Investments Platform offers a unique solution that empowers users to navigate the markets with confidence and precision.
From the meticulous implementation of Django's robust backend functionalities to the dynamic and responsive front-end design, every aspect of this platform has been crafted with the utmost attention to detail. This ensures not only the reliability and security expected of a modern financial application but also an engaging and intuitive user experience.

## Distinctiveness and Complexity

The Capybara Investments Platform stands out in its comprehensive approach to personal investment management. Unlike standard investment tools that offer generic advice, this platform harnesses the power of historical market data analysis combined with real-time stock updates to provide tailored strategy optimization. The integration of `scipy.optimize` enables the application to not just present data but to process it in a way that directly influences the users' decision-making processes with actionable insights.
Moreover, the project goes beyond the capabilities of typical e-commerce or social network projects by providing dynamic portfolio adjustment tools, real-time stock price monitoring through `yfinance`, and interactive data visualizations with `matplotlib`. The platform's responsiveness to market trends and user preferences makes it uniquely adaptive, providing investment recommendations that evolve with the market.
Each component of the project, from the backend Django models to the frontend JavaScript interactions, has been carefully crafted to ensure a seamless and secure user experience. The project's complexity is also evident in the detailed transaction tracking system, which not only records user activities but also provides analytical insights, thus serving as a crucial tool for financial planning and strategy assessment.
The platform's mobile responsiveness ensures that the sophisticated tools and data visualizations are accessible across all devices, catering to the modern investor's need for on-the-go financial management. This responsiveness is not just about visual layout but also about the functional adaptability of the platform's features, which maintain their integrity and usefulness regardless of the device.
Furthermore, the Capybara Investments Platform employs `chart.js` for graphical representations, fetching real-time data every minute from `yfinance` to update stock price changes in the user-created portfolio. This illustrates the platform's commitment to providing up-to-date financial information, fostering informed investment decisions.
In addition to real-time data updates, the project utilizes two other APIs: `API Ninjas` and `Polygon.io` to create a mapping API that correlates ticker symbols to full company names and logos. This mapping is crucial for the platform's functionality, displaying accurate and recognizable information to the user. 
Another cornerstone of the project is the implementation of `TradingView charts`. This integration provides on-demand, interactive charting capabilities, allowing users to visualize the stock performance for any listed company by simply clicking on the company's name, further enhancing the user experience.
The platform leverages the momentum strategy, a sophisticated investment approach that capitalizes on trends by identifying companies with the highest returns over a specified number of months. On the optimization page, users can customize their preferred values for the number of months to analyze and the number of top-performing stocks to display, along with the starting year for the simulation. The output includes both the list of companies and a `chart.js` line chart that compares the strategy's performance to the benchmark US500 index over the same historical period.
Additionally, an optimization form can be executed to determine the optimal number of months for the highest returns and the ideal number of stocks to be displayed. This optimization process is a testament to the platform's advanced analytical capabilities.
The project also features a `Piechart.js` functionality that calculates the number of shares to purchase for each company, aiming to allocate equal capital to each to achieve an equally weighted portfolio with minimal cash leftovers. This algorithmic distribution showcases the application's strategic planning features.
It is also worth noting that the project is predominantly API and AJAX driven, ensuring asynchronicity and a seamless user experience without the need for page reloads. This approach underscores the modern web development practices employed in creating a dynamic, responsive, and user-friendly investment platform.
In essence, the Capybara Investments Platform not only provides a robust tool for personal investment management but also serves as a model for cutting-edge web application development in the financial domain.
In summary, the Capybara Investments Platform is distinguished by its:
- Advanced algorithmic analysis and optimization of investment strategies.
- Real-time monitoring and visualization of stock data for informed decision-making.
- A robust and secure full-stack Django application that supports intricate user interactions and data management.
The project’s commitment to combining sophisticated financial analysis with user-centric design makes it a novel contribution to the field of financial web applications.
## File Structure and Contents

- `market_portfolio/`: Main Django project directory containing settings and root URL configurations.
- `user_portfolio/`: Main application directory housing the core functionality of the investment platform.

  - `management/commands/`: Contains custom Django management commands.
    - `maptickers.py`: This command maps ticker symbols to full company names and logos, populating the `MappedTickers` model with this data for later use on the platform.

  - `migrations/`: Django database migration files.

  - `static/user_portfolio/`: Static files for the application.
    - `images/`: Image assets used across the platform.
    - `js/`: JavaScript files.
      - `main.js`: Provides styling and functionality for the strategy and portfolio parameters page.
      - `portfolio.js`: Styles the TradingView charts and user portfolio page.
    - `index.css`: The main stylesheet for the application.

  - `templates/user_portfolio/`: Django HTML templates for rendering views.
    - `index.html`: The landing page template.
    - `login.html`, `register.html`, etc.: Templates for user authentication.

  - `utils/`: Utility functions and classes for strategy calculations and portfolio management.
    - `momentum.py`: Contains classes necessary for calculating the momentum strategy and optimization parameters.
    - `calculate_weights.py`: Houses the `EqualWeightedPortfolio` class for calculating optimal share quantity for each stock returned by the strategy.
    - `calculate_user_portfolio.py`: Contains helper class for managing cash flow during stock transactions and updating the `PortfolioEntry` model.

  - `admin.py`: Configuration for the Django admin interface for our models.
  - `filters.py`: Utilizes `django_filters` for searching tickers in the `MappedTickers` model.
  - `forms.py`: Forms used throughout the project for strategy input, optimization preferences, and portfolio creation.
  - `models.py`: Django models including `User`, `MarketAnalysisPreferences`, `Portfolio`, `PortfolioEntry`, `MappedTickers`, and `Watchlist`.
  - `views.py`: Django views for rendering pages and handling backend logic.
  - `urls.py`: URL configurations for the application routes.

- `db.sqlite3`: The SQLite database file.
- `manage.py`: A command-line utility for administrative tasks.

- `README.md`: The project documentation file.
- `requirements.txt`: A list of Python packages to be installed for the project.
## Installation and Setup

[... Detailed instructions on how to install and run the application ...]

## Additional Python Packages

The following packages are required and listed in `requirements.txt`:

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

This project is licensed under the MIT License. 
