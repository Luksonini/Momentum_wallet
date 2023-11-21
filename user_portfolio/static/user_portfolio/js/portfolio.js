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
              console.log('Ticker Price:', data.price);
              // Możesz tutaj zaktualizować interfejs użytkownika, wyświetlając cenę
          }
      })
      .catch(error => {
          console.error('Fetch error:', error);
      });
}


  document.addEventListener('DOMContentLoaded', function() {
    createPortfolioDisplay();
    widgetOnTickerClick();
    initializeTickerSuggestions();
    createTradingViewWidget(window.displayed_ticker) 
    const formTickerName = document.getElementById('form-ticker')
    formTickerName.innerHTML = window.displayed_ticker
  });
