/**
 * Populates portfolio data into the HTML container.
 * Creates a grid layout displaying each stock's information along with a 'Sell' button,
 * and also appends performance details at the bottom of the portfolio display.
 * @param {Object} responseData - The response data object containing portfolio and performance information.
 */
function populatePortfolioData(responseData) {
  console.log(responseData);
  const container = document.getElementById('portfolio-display-container');
  container.innerHTML = ''; // Clear the container before adding new elements

  // Creating headers
  const headers = ['Company Info', 'Quantity', 'Purchase Price', 'Current Price', 'Value', 'Price Change', 'Percent Change', 'Action'];
  const headerDiv = document.createElement('div');
  headerDiv.className = 'grid grid-cols-4 sm:grid-cols-8 text-center bg-[#25174B] text-[#e9e7ed] p-2 font-semibold'; // Styling the header

  headers.forEach((headerText, index) => {
  const header = document.createElement('div');
  header.textContent = headerText;
  header.className = 'md:col-span-1'; // Klasa dla większych ekranów
  // Ukryj kolumny 'Quantity', 'Purchase Price', 'Current Price', i 'Value' na mniejszych ekranach
  if (['Quantity', 'Purchase Price', 'Current Price', 'Value'].includes(headerText)) {
    header.className += ' hidden sm:block';
  }
  headerDiv.appendChild(header);
  });
  container.appendChild(headerDiv);

// Iterating over each entry in the data object
const portfolioData = responseData.portfolio_info;
Object.entries(portfolioData).forEach(([ticker, info]) => {
  const rowDiv = document.createElement('div');
  rowDiv.className = 'grid grid-cols-4 sm:grid-cols-8 text-center p-2 hover:bg-gray-100 font-semibold'; // Styling the row// Styling the row

    // Column with company info (ticker, company name)
    const companyInfoDiv = document.createElement('div');
    companyInfoDiv.className = 'col-span-1 text-left'; // Styling

    // Create two separate elements for ticker and company name
    const tickerDiv = document.createElement('div');
    tickerDiv.textContent = ticker;
    tickerDiv.className = 'block sm:hidden'; // Tylko ticker będzie widoczny na małych ekranach

    const companyNameDiv = document.createElement('div');
    companyNameDiv.textContent = info.company_name;
    companyNameDiv.className = 'hidden md:block'; // Pełna nazwa firmy będzie ukryta na małych ekranach

    // Add both ticker and company name to the company info div
    companyInfoDiv.appendChild(tickerDiv);
    companyInfoDiv.appendChild(companyNameDiv);

    rowDiv.appendChild(companyInfoDiv);

      // Rest of the data
      // headers.slice(1, -1).forEach(header => { // Skip the last 'Action' header
      //     const cellDiv = document.createElement('div');
      //     let textContent = info[header.toLowerCase().replace(/ /g, '_')];
      //     if (typeof textContent === 'number') {
      //         textContent = textContent.toFixed(2) + '$';
      //     }
      //     cellDiv.textContent = textContent;
      //     cellDiv.className = 'col-span-1';
      //     if (header === 'Price Change' || header === 'Percent Change') {
      //         cellDiv.className += ` text-${textContent < 0 ? 'red' : 'green'}-500`;
      //     }
      //     rowDiv.appendChild(cellDiv);
      // });
      headers.slice(1, -1).forEach(header => { // Skip the last 'Action' header
        const cellDiv = document.createElement('div');
        let textContent = info[header.toLowerCase().replace(/ /g, '_')];
        if (typeof textContent === 'number') {
            textContent = textContent.toFixed(2) + '$';
        }
        cellDiv.textContent = textContent;
        cellDiv.className = 'sm:col-span-1';
        // Dodaj klasę "hidden md:block" dla kolumny 'Quantity', 'Purchase Price', 'Current Price', i 'Value'
        if (['Quantity', 'Purchase Price', 'Current Price', 'Value'].includes(header)) {
          cellDiv.className += ' hidden sm:block';
        }
        // Dodatkowe style dla zmiany koloru tekstu
        if (header === 'Price Change' || header === 'Percent Change') {
          cellDiv.className += ` text-${textContent < 0 ? 'red' : 'green'}-500`;
        }
        rowDiv.appendChild(cellDiv);
      });

          // Adding the 'Action' column with a 'Sell' button
          const actionCellDiv = document.createElement('div');
          actionCellDiv.className = 'col-span-1';
          const sellButton = document.createElement('button');
          sellButton.value = ticker;
          sellButton.name = 'sell';
          sellButton.setAttribute('data-ticker', ticker); 
          sellButton.setAttribute('data-current-price', info.current_price); 
          sellButton.textContent = 'Sell';
          sellButton.className = 'sell-button bg-[#a28834] text-white hover:bg-[#796832] text-white py-1 px-3 rounded'; // Tailwind CSS for button
          sellButton.onclick = () => handleSellTicker(sellButton);
          actionCellDiv.appendChild(sellButton);
          rowDiv.appendChild(actionCellDiv);

          container.appendChild(rowDiv);
      });

      // Add performance data at the bottom
      const performanceInfo = responseData.performance_info;
      if (performanceInfo) {
        const performanceDiv = document.createElement('div');
        performanceDiv.className = 'flex justify-between performance-info mt-2 p-2 bg-[#25174B] text-[#D1D5DB]'; // Tailwind CSS dla stylizacji
    
        // Use parseFloat to convert string to number and .toFixed(2) for rounding
        const balanceDiv = createPerformanceDetail('Total Balance', `$${parseFloat(performanceInfo.balance).toFixed(2)}`);
        balanceDiv.className = 'pl-[8px]'
        const availableCashDiv = createPerformanceDetail('Available Cash', `$${parseFloat(performanceInfo.available_cash).toFixed(2)}`);
        const initialValueDiv = createPerformanceDetail('Initial Portfolio Value', `$${parseFloat(performanceInfo.initial_portfolio_value).toFixed(2)}`);
        initialValueDiv.className='hidden sm:block'
        const percentChangeDiv = createPerformanceDetail('Gain', `${parseFloat(performanceInfo.percent_change).toFixed(2)}%`);
        percentChangeDiv.className = 'pr-[8px]'

        performanceDiv.appendChild(balanceDiv);
        performanceDiv.appendChild(availableCashDiv);
        performanceDiv.appendChild(initialValueDiv);
        performanceDiv.appendChild(percentChangeDiv);
    
        container.appendChild(performanceDiv);
      }
    }

 /**
 * Creates a detail element for performance data.
 * Each detail consists of a label and a value, formatted in a specific way.
 * @param {string} label - The label for the detail.
 * @param {string} value - The value for the detail.
 * @returns {HTMLElement} - A div element containing the label and value.
 */
function createPerformanceDetail(label, value) {
  const detailDiv = document.createElement('div');
  detailDiv.className = 'performance-detail'; // Add any necessary CSS classes

  const labelSpan = document.createElement('span');
  labelSpan.textContent = `${label}: `;
  detailDiv.appendChild(labelSpan);

  const valueSpan = document.createElement('span');
  valueSpan.textContent = value;
  detailDiv.appendChild(valueSpan);

  return detailDiv;
}

/**
 * Fetches portfolio data and populates it in the portfolio display container.
 * It requests the user's portfolio data from the server and updates the UI accordingly.
 */
function createPortfolioDisplay() {
  fetch('/user_portfolio_api/')
      .then(response => {
          if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
      })
      .then(data => populatePortfolioData(data))
      .catch(error => console.error('Could not fetch portfolio data:', error));
}

/**
 * Handles the selling of a stock by sending a POST request to the server.
 * Updates the UI based on the response from the server, including refreshing the portfolio display.
 * @param {HTMLElement} button - The button element that was clicked to sell the stock.
 */
function handleSellTicker(button) {
  const ticker = button.getAttribute('data-ticker');
  const currentPrice = button.getAttribute('data-current-price')
  const data = {
    'sell_ticker': ticker, // The ticker symbol to sell
    'price': currentPrice // Current price of the ticker
  };

  // Sending the data to the server using the fetch API
  fetch('/user_portfolio_api/', { 
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': window.csrfToken // CSRF token for Django security
      },
      body: JSON.stringify(data) // Sending the data as a JSON string
  })
  .then(response => {
      if (!response.ok) {
          // If the server response is not OK, throw an error
          throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json(); // Parsing the JSON response from the server
  })
  .then(data => {
      console.log('Success:', data); // Logging the success data
      // Update the UI after successful sell
      createPortfolioDisplay(); // Assuming this function refreshes the portfolio display
  })
  .catch(error => {
      // Logging any errors to the console
      console.error('Error:', error);
  });
}

/**
 * Creates a TradingView widget for the given stock ticker.
 * Assumes the existence of a specific container element and refreshes its content with the new widget.
 * @param {string} ticker - The stock ticker symbol.
 */
  function createTradingViewWidget(ticker) {
    const container = document.getElementById('tradingview_d7bdc');
    container.innerHTML = ''; // Remove existing widget

    new TradingView.widget({
        "autosize": true,
        "symbol": ticker,
        "interval": "D",
        "timezone": "Etc/UTC",
        "theme": "light",
        "style": "1",
        "locale": "en",
        "enable_publishing": false,
        "allow_symbol_change": true,
        "container_id": "tradingview_d7bdc"
    });
}
  

/**
 * Sets up event listeners on strategy buttons for displaying the TradingView widget.
 */
function widgetOnTickerClick() {
  document.querySelectorAll('.strategy-button').forEach(button => {
      button.addEventListener('click', function() {
          const ticker = this.getAttribute('data-ticker').replace(/-/g, '.');
          document.getElementById('purchase-container').style.display = 'none';
          changeFormDisplayButton(ticker);
          window.displayed_ticker = ticker;
          createTradingViewWidget(ticker);
          updateWatchlistFormActions(ticker);
          fetchTickerPrice(ticker)
      });
  });
}

/**
 * Changes the display of the 'Buy' button based on the selected ticker.
 * Retrieves the current price of the ticker and updates the purchase form accordingly.
 * @param {string} ticker - The ticker symbol for the stock.
 */
function changeFormDisplayButton(ticker) {
  const buyStockDisplayButton = document.getElementById('buy-stock-display-button');
  const purchaseContainer = document.getElementById('purchase-container');
  fetchTickerPrice(ticker)

  buyStockDisplayButton.style.display = 'block';
  
  buyStockDisplayButton.innerHTML = `Buy ${ticker}`;

  buyStockDisplayButton.onclick = function () {
    // Pokaż kontener zakupu jeśli był ukryty
    if (purchaseContainer.style.display === 'none') {
      purchaseContainer.style.display = 'block';
      buyStockDisplayButton.style.display = 'none';
    }
  }
}

/**
 * Toggles the display of the searching form and sets up the click event listener on the "Find Stock" button.
 * Initialized during document load to ensure proper interaction with the user interface.
 */
function toggleSearchingFormDisplay() {
  const searchingForm = document.getElementById('searching-form');
  const findStockButton = document.getElementById('find-stock');

  if (findStockButton) {
    findStockButton.onclick = function() {
      if (searchingForm) {
        searchingForm.style.display = searchingForm.style.display === 'block' ? 'none' : 'block';
      }
    };
  }
}

/**
 * Adds a ticker to the watchlist UI.
 * Creates a new div element with ticker information and appends it to the watchlist container.
 * Each ticker element consists of a button with the company name and ticker symbol, and a remove button.
 * @param {string} ticker - The ticker symbol of the stock.
 * @param {string} companyName - The name of the company associated with the ticker.
 */
function addTickerToWatchlistUI(ticker, companyName) {
  const watchlistContainer = document.getElementById('watchlist-container');
  if (!watchlistContainer) {
      console.error('Watchlist container not found');
      return;
  }

  // Creating a new element in the watchlist
  const tickerDiv = document.createElement('div');
  tickerDiv.className = 'flex items-center space-x-2 border border-gray-300 shadow-sm bg-[#25174B] text-[#e9e7ed] font-semibold pl-2 px-4 rounded hover:bg-[#50456e] hover:border-gray-400 hover:shadow-md transition-all duration-200';
  tickerDiv.setAttribute('data-ticker-id', ticker);

  // Adding the ticker name and company
  const tickerButton = document.createElement('button');
  tickerButton.className = 'strategy-button hover:border-none focus:outline-none';
  tickerButton.textContent = `${companyName} (${ticker})`;
  tickerButton.onclick = function() {
    createTradingViewWidget(ticker);
    fetchTickerPrice(ticker);
  };
  tickerDiv.appendChild(tickerButton);

  // Adding a button for removal
  const removeButton = document.createElement('button');
  removeButton.onclick = () => manageWatchlistTicker('remove', ticker);
  removeButton.innerHTML = '<img src="https://www.freeiconspng.com/uploads/close-button-png-27.png" width="20" alt="Remove" class="remove-ticker-icon">';
  tickerDiv.appendChild(removeButton);

  // Adding the new element to the watchlist container
  watchlistContainer.appendChild(tickerDiv);
  updateNoTickersMessage();
}

/**
 * Handles adding or removing a ticker from the watchlist.
 * Sends a POST request with the action and ticker information.
 * @param {string} action - The action to be performed ('add' or 'remove').
 * @param {string} ticker - The ticker symbol.
 * @param {string} companyName - The name of the company corresponding to the ticker.
 */
function manageWatchlistTicker(action, ticker, companyName) {
  console.log("Sending request with data:", { action: action, ticker: ticker });
  fetch('/manage_watchlist/', {
      method: 'POST',
      body: JSON.stringify({ action: action, ticker: ticker }),
      headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': window.csrfToken,
      },
  })
  .then(response => response.json())
  .then(data => {
      if (data.success) {
          console.log(data.message);
          if (action === 'add') {
            addTickerToWatchlistUI(ticker, companyName);
            fetchTickerPrice(ticker)
        }else if (action === 'remove') {
          removeTickerFromWatchlistUI(ticker);
          fetchTickerPrice(ticker);
      }
      } else {
          console.error('Action failed');
      }
  })
  .catch(error => console.error('Error:', error));
}

/**
 * Removes a ticker from the watchlist UI.
 * Locates and removes the div element corresponding to the ticker from the watchlist container.
 * @param {string} ticker - The ticker symbol to be removed.
 */
function removeTickerFromWatchlistUI(ticker) {
  const tickerElement = document.querySelector(`div[data-ticker-id='${ticker}']`);
  if (tickerElement) {
      tickerElement.remove();
      updateRemoveButtons()
      updateNoTickersMessage() 
  }
}

/**
 * Initializes ticker suggestions.
 * Listens for input on the search bar and fetches ticker suggestions based on the query.
 */
function initializeTickerSuggestions() {
  const searchInput = document.getElementById('id_company_name');
  const suggestionsList = document.createElement('ul');
  suggestionsList.classList.add('suggestions-list');
  searchInput.parentNode.insertBefore(suggestionsList, searchInput.nextSibling);

  searchInput.addEventListener('input', function(e) {
    const query = e.target.value;

    fetch('/ticker_search_suggestions/?query=' + query)
      .then(response => response.json())
      .then(data => {
        suggestionsList.innerHTML = '';

        data.forEach(item => {
          const listItem = document.createElement('li');
          const addButton = document.createElement('button');
          addButton.textContent = item.ticker + ' - ' + item.company_name;
          addButton.onclick = (event) => {
            event.preventDefault(); // Zapobieganie domyślnemu zachowaniu przycisku
            manageWatchlistTicker('add', item.ticker, item.company_name);
            updateNoTickersMessage();
          };

          listItem.appendChild(addButton);
          suggestionsList.appendChild(listItem);
        });
      })
      .catch(error => console.error('Error:', error));
  });
}

/**
 * Updates the remove buttons for each ticker in the watchlist.
 * Each button's click event is set to call manageWatchlistTicker with the 'remove' action.
 */
function updateRemoveButtons() {
  document.querySelectorAll('.remove-ticker-button').forEach(button => {
      button.onclick = function() {
          const ticker = this.getAttribute('data-ticker');
          manageWatchlistTicker('remove', ticker);
      };
  });
}

/**
 * Updates the visibility of the "No tickers on your watchlist" message.
 * Displays the message if there are no tickers in the watchlist.
 */
function updateNoTickersMessage() {
  const noTickersMessage = document.getElementById('in-case-no-tickers');
  const watchlistContainer = document.getElementById('watchlist-container');

  if (!watchlistContainer) {
      console.error('Watchlist container not found');
      return;
  }

  // Sprawdź, czy są jakieś tickery w watchliście
  const hasTickers = watchlistContainer.querySelectorAll('div[data-ticker-id]').length > 0;

  // Aktualizuj widoczność wiadomości
  noTickersMessage.style.display = hasTickers ? 'none' : 'block';
}


/**
 * Fetches the current price of a given ticker symbol from the API.
 * Updates the purchase form with the ticker's current price and available cash.
 * Handles any errors that occur during the fetch operation.
 * @param {string} ticker - The ticker symbol for which the price is being fetched.
 */
function fetchTickerPrice(ticker) {
  fetch(`/searching_ticker_value_api/?ticker=${ticker}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      if (data.error) {
        console.error('Error:', data.error);
      } else {
        let formPrice = document.getElementById('form-ticker-price');
        let roundedPrice = parseFloat(data.price).toFixed(2);
        formPrice.innerHTML = `Current price: $${roundedPrice}`;
        const input_purchase_price = document.getElementById('purchase_price');
        input_purchase_price.value = data.price;

        let formTicker = document.getElementById('form-ticker');
        formTicker.innerHTML = data.ticker;
        const input_ticker_symbol = document.getElementById('id_ticker_symbol');
        input_ticker_symbol.value = data.ticker;

        window.availableCash = parseFloat(data.available_cash);

        // Update the total price and add event listener for quantity change
        let quantityInput = document.getElementById('quantity');
        quantityInput.value = 0.1; // Set default quantity to 1
        calculateTotalPrice(roundedPrice); // Calculate total price with the default quantity
        quantityInput.addEventListener('input', function() {
          calculateTotalPrice(roundedPrice);
        });
      }
    })
    .catch(error => {
      console.error('Fetch error:', error);
    });
}

/**
 * Calculates the total price of the purchase based on the price per share and the quantity.
 * Displays an alert and disables the submit button if the total price exceeds the available cash.
 * Interacts with the user interface to provide real-time feedback.
 * @param {number} pricePerShare - The price per share of the stock.
 */
function calculateTotalPrice(pricePerShare) {
  let quantityInput = document.getElementById('quantity');
  let quantity = parseFloat(quantityInput.value);
  let totalPrice = quantity * pricePerShare;
  let totalPriceElement = document.getElementById('total-price');
  totalPriceElement.innerHTML = `Total Price: $${totalPrice.toFixed(2)}`;

  let purchaseContainer = document.getElementById('purchase-container');
  let alertBox = document.getElementById('alert-box'); // Use getElementById to search for the alert box by id

  let buyButton = document.getElementById('buy-button');

  // Check if the total price exceeds the available cash
  if (totalPrice > window.availableCash) {
      // If alert box doesn't exist, create it
      if (!alertBox) {
          alertBox = document.createElement('div');
          alertBox.id = 'alert-box'; // Assign a unique id to the alert box
          alertBox.className = 'bg-red-500 text-white p-4 mt-4 rounded';
          purchaseContainer.appendChild(alertBox);
      }
      // Update the alert box message
      alertBox.textContent = `Warning: Purchase value exceeds available cash! Available amount: $${window.availableCash.toFixed(2)}`;

      // Disable the 'Buy' button and change its style
      buyButton.disabled = true;
      buyButton.classList.add('bg-gray-400', 'cursor-not-allowed');
      buyButton.classList.remove('bg-green-500', 'hover:bg-green-700');
  } else {
      // If the alert box exists and the total price is less than available cash, remove the alert box
      if (alertBox) {
          alertBox.remove();
      }
      // Enable the 'Buy' button and reset its style
      buyButton.disabled = false;
      buyButton.classList.remove('bg-gray-400', 'cursor-not-allowed');
      buyButton.classList.add('bg-green-500', 'hover:bg-green-700');
  }
}

/**
 * Handles the submission of the portfolio form.
 * Sends data to the server via a POST request and updates the UI based on the server's response.
 * Prevents default form submission, sends form data as JSON, and handles the JSON response.
 * Refreshes the portfolio display after a successful transaction.
 */
function handleAppendTickerToPortfolioForm() {
  const form = document.querySelector('#append-to-portfolio-form');
  
  form.addEventListener('submit', function(event) {
      event.preventDefault();

      // Zbieranie danych z formularza
      const formData = new FormData(form);
      const data = {
          'ticker_symbol': formData.get('ticker_symbol'),
          'purchase_price': formData.get('purchase_price'),
          'quantity': formData.get('quantity'),
          'csrfmiddlewaretoken': formData.get('csrfmiddlewaretoken')  // Wartość tokena CSRF
      };

      // Wysyłanie danych do API
      fetch('/user_portfolio_api/', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'X-CSRFToken': data.csrfmiddlewaretoken  // Wymagane dla Django CSRF
          },
          body: JSON.stringify(data)
      })
      .then(response => {
          if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
      })
      .then(data => {
          console.log('Success:', data);
          document.getElementById('purchase-container').style.display = 'none';
          createPortfolioDisplay();
      })
      .catch(error => {
          console.error('Error:', error);
      });
  });
}



