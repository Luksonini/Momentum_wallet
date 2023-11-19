function populatePortfolioData(data) {
      
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
        });
    });
}

  function initializeTickerSuggestions() {
    const searchInput = document.getElementById('id_company_name');
    const suggestionsList = document.createElement('ul');
    suggestionsList.classList.add('suggestions-list'); // Dodaj klasę dla stylizacji
    searchInput.parentNode.insertBefore(suggestionsList, searchInput.nextSibling);

    searchInput.addEventListener('input', function(e) {
        const query = e.target.value;

        fetch('/ticker_search_suggestions/?query=' + query)
            .then(response => response.json())
            .then(data => {
                // Czyszczenie poprzednich sugestii
                suggestionsList.innerHTML = '';

                // Dodawanie nowych sugestii do listy
                data.forEach(item => {
                    const listItem = document.createElement('li');
                    listItem.textContent = item.ticker + ' - ' + item.company_name;
                    listItem.addEventListener('click', function() {
                        searchInput.value = item.ticker; // Możesz dostosować to zachowanie
                        suggestionsList.innerHTML = ''; // Czyszczenie listy po wyborze
                    });
                    suggestionsList.appendChild(listItem);
                });
            })
            .catch(error => console.error('Error:', error));
    });
}

  document.addEventListener('DOMContentLoaded', function() {
    createPortfolioDisplay();
    widgetOnTickerClick();
    initializeTickerSuggestions();
  });
