/**
 * Populates portfolio data into the HTML container.
 * Creates a grid layout displaying each stock's information along with a 'Sell' button.
 * @param {Object} data - The portfolio data object containing stock information.
 */
function populatePortfolioData(responseData) {
  console.log(responseData);
  const container = document.getElementById('portfolio-display-container');
  container.innerHTML = ''; // Clear the container before adding new elements

  // Creating headers
  const headers = ['Company Info', 'Quantity', 'Purchase Price', 'Current Price', 'Value', 'Price Change', 'Percent Change', 'Action'];
  const headerDiv = document.createElement('div');
  headerDiv.className = 'grid grid-cols-8 text-center bg-gray-200 p-2'; // Styling the header
  headers.forEach(headerText => {
      const header = document.createElement('div');
      header.textContent = headerText;
      header.className = 'col-span-1'; // Adjust span as needed
      headerDiv.appendChild(header);
  });
  container.appendChild(headerDiv);

  // Iterating over each entry in the data object
  const portfolioData = responseData.portfolio_info;
  Object.entries(portfolioData).forEach(([ticker, info]) => {
      const rowDiv = document.createElement('div');
      rowDiv.className = 'grid grid-cols-8 text-center p-2 hover:bg-gray-100'; // Styling the row

      // Column with company info (ticker, company name)
      const companyInfoDiv = document.createElement('div');
      companyInfoDiv.className = 'col-span-1 text-left'; // Styling
      const companyName = document.createElement('div');
      companyName.textContent = `${info.company_name} (${ticker})`;
      companyName.className = 'company-info-class'; // Add your custom CSS class
      companyInfoDiv.appendChild(companyName);
      rowDiv.appendChild(companyInfoDiv);

      // Rest of the data
      headers.slice(1, -1).forEach(header => { // Skip the last 'Action' header
          const cellDiv = document.createElement('div');
          let textContent = info[header.toLowerCase().replace(/ /g, '_')];
          if (typeof textContent === 'number') {
              textContent = textContent.toFixed(2) + '$';
          }
          cellDiv.textContent = textContent;
          cellDiv.className = 'col-span-1';
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
          sellButton.className = 'sell-button bg-red-500 hover:bg-red-700 text-white py-1 px-3 rounded'; // Tailwind CSS for button
          sellButton.onclick = () => handleSellTicker(sellButton);
          actionCellDiv.appendChild(sellButton);
          rowDiv.appendChild(actionCellDiv);

          container.appendChild(rowDiv);
      });

      // Add performance data at the bottom
      const performanceInfo = responseData.performance_info;
      if (performanceInfo) {
        const performanceDiv = document.createElement('div');
        performanceDiv.className = 'flex justify-between performance-info mt-2 p-2 bg-gray-200'; // Tailwind CSS dla stylizacji
    
        // Używając parseFloat, przekształć string na liczbę i użyj .toFixed(2) dla zaokrąglenia
        const balanceDiv = createPerformanceDetail('Total Balance', `$${parseFloat(performanceInfo.balance).toFixed(2)}`);
        balanceDiv.className = 'pl-5'
        const availableCashDiv = createPerformanceDetail('Available Cash', `$${parseFloat(performanceInfo.available_cash).toFixed(2)}`);
        const initialValueDiv = createPerformanceDetail('Initial Portfolio Value', `$${parseFloat(performanceInfo.initial_portfolio_value).toFixed(2)}`);
        const percentChangeDiv = createPerformanceDetail('Gain', `${parseFloat(performanceInfo.percent_change).toFixed(2)}%`);
        percentChangeDiv.className = 'pr-5'

        performanceDiv.appendChild(balanceDiv);
        performanceDiv.appendChild(availableCashDiv);
        performanceDiv.appendChild(initialValueDiv);
        performanceDiv.appendChild(percentChangeDiv);
    
        container.appendChild(performanceDiv);
      }
    }

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
 * Handles the selling of a ticker.
 * Sends a POST request to the server with the ticker symbol to be sold.
 * @param {string} ticker - The ticker symbol of the stock to be sold.
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


  function createTradingViewWidget(ticker) {
    // Najpierw usuń istniejący widżet, jeśli istnieje
    const container = document.getElementById('tradingview_d7bdc');
    container.innerHTML = '';

    // Tworzenie nowego widżetu
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

function changeFormDisplayButton(ticker) {
  const buyStockDisplayButton = document.getElementById('buy-stock-display-button');
  const purchaseContainer = document.getElementById('purchase-container');

  // Upewnij się, że przycisk "Buy" jest widoczny
  buyStockDisplayButton.style.display = 'block';
  
  // Ustaw tekst przycisku "Buy" na podstawie tickera
  buyStockDisplayButton.innerHTML = `Buy ${ticker}`;

  // Ustaw zdarzenie onclick na przycisku, aby pokazać kontener zakupu
  buyStockDisplayButton.onclick = function () {
    // Pokaż kontener zakupu jeśli był ukryty
    if (purchaseContainer.style.display === 'none') {
      purchaseContainer.style.display = 'block';
      buyStockDisplayButton.style.display = 'none';
    }
  }
}



function updateWatchlistFormActions(ticker) {
  // Zakładając, że masz tylko jeden formularz do aktualizacji
  // Jeśli jest ich więcej, użyj pętli lub innych metod selekcji
  const form = document.getElementById('remove-ticker-form');
  if (form) {
      form.action = `/ticker_detail/${ticker}/`; // Zaktualizuj akcję formularza
  }
}

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
              suggestionsList.innerHTML = ''; // Czyszczenie poprzednich sugestii

              data.forEach(item => {
                  const form = document.createElement('form');
                  form.method = 'post';
                  form.action = `/ticker_detail/${window.displayed_ticker}/`;

                  // Dodaj pole ukryte z tokenem CSRF
                  const csrfInput = document.createElement('input');
                  csrfInput.type = 'hidden';
                  csrfInput.name = 'csrfmiddlewaretoken';
                  csrfInput.value = window.csrfToken; // Użyj tokenu z zmiennej globalnej
                  form.appendChild(csrfInput);

                  // Pole ukryte przechowujące wartość tickera
                  const hiddenInput = document.createElement('input');
                  hiddenInput.type = 'hidden';
                  hiddenInput.name = 'ticker';
                  hiddenInput.value = item.ticker;

                  // Przycisk lub inny element klikalny
                  const submitButton = document.createElement('button');
                  submitButton.type = 'submit';
                  submitButton.textContent = item.ticker + ' - ' + item.company_name;
                  

                  form.appendChild(hiddenInput);
                  form.appendChild(submitButton);

                  const listItem = document.createElement('li');
                  listItem.appendChild(form);
                  suggestionsList.appendChild(listItem);
              });
          })
          .catch(error => console.error('Error:', error));
  });
}

/**
 * Fetches the current price of a given ticker symbol from the API.
 * On successful retrieval, updates the specified element in the DOM with the ticker's price.
 * If an error occurs during the fetch operation or from the API, logs the error to the console.
 *
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
 * If the total price exceeds the available cash, it displays an alert and disables the submit button.
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
 * Gathers data from the form fields, sends it to the server via a POST request,
 * and processes the server's response. It prevents the default form submission behavior,
 * sends the form data as JSON, and handles the server's JSON response.
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



