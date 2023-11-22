function populatePortfolioData(data) {
    console.log(data)  
    const container = document.getElementById('portfolio-display-container');
    container.innerHTML = ''; // Wyczyść kontener przed dodaniem nowych elementów
  
    // Tworzenie nagłówków
    const headers = ['Company Info', 'Quantity', 'Purchase Price', 'Current Price', 'Value', 'Price Change', 'Percent Change'];
    const headerDiv = document.createElement('div');
    headerDiv.className = 'grid grid-cols-7 text-center bg-gray-200 p-2'; // Stylizacja nagłówka
    headers.forEach(headerText => {
      const header = document.createElement('div');
      header.textContent = headerText;
      header.className = 'col-span-1'; // Dostosuj rozpiętość według potrzeb
      headerDiv.appendChild(header);
    });
    container.appendChild(headerDiv);
  
    // Iteracja po każdym wpisie w obiekcie danych
    Object.entries(data).forEach(([ticker, info]) => {
      const rowDiv = document.createElement('div');
      rowDiv.className = 'grid grid-cols-7 text-center p-2 hover:bg-gray-100';// Stylizacja wiersza
        rowDiv.onclick = function() {
          // Zamiana '-' na '.' jeśli '-' występuje w ticker
          ticker = ticker.replace(/-/g, '.');
          window.displayed_ticker = ticker
          createTradingViewWidget(ticker);
          
      };
      // Kolumna z informacjami o firmie (ticker, nazwa firmy)
      const companyInfoDiv = document.createElement('div');
      companyInfoDiv.className = 'text-left'; // Stylizacja
      const companyName = document.createElement('div');
      companyName.textContent = `${info.company_name} (${ticker})`;
      companyName.className = 'company-info-class'; // Dodaj swoją klasę CSS
      companyInfoDiv.appendChild(companyName);
      rowDiv.appendChild(companyInfoDiv);
  
      // Reszta danych
      headers.slice(1).forEach(header => {
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
      
      container.appendChild(rowDiv);
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
  
  function createPortfolioDisplay() {
    fetch('/user_portfolio_api/')
        .then(response => response.json())
        .then(data => populatePortfolioData(data))
        .catch(error => console.error('Could not fetch portfolio data:', error));
  }

  function widgetOnTickerClick() {
    document.querySelectorAll('.strategy-button').forEach(button => {
        button.addEventListener('click', function() {
            const ticker = this.getAttribute('data-ticker').replace(/-/g, '.');
            window.displayed_ticker = ticker;
            createTradingViewWidget(ticker);
            updateWatchlistFormActions(ticker);
            fetchTickerPrice(ticker)
        });
    });
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
  console.log('I am trying to handle form')
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
          createPortfolioDisplay();
      })
      .catch(error => {
          console.error('Error:', error);
      });
  });
}






