// Przygotuj zmienną na wykres, aby była dostępna globalnie
var myChart;
var myPieChart; 

// Funkcja aktualizująca wykres
    // Funkcja aktualizująca wykres
    function updateChart(chartData) {
        // Usuń istniejący wykres, jeśli istnieje
        if (myChart) {
            myChart.destroy();
        }
    
        // Stwórz nowy wykres z nowymi danymi
        var ctx = document.getElementById('myChart').getContext('2d');
        myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: chartData.map(function(item) { return item.date; }),
                datasets: [{
                    label: 'US500 Returns',
                    backgroundColor: 'rgb(255, 99, 132)',
                    borderColor: 'rgb(255, 99, 132)',
                    data: chartData.map(function(item) { return item.US500_returns; }),
                    fill: false,
                }, {
                    label: 'Strategy',
                    backgroundColor: 'rgb(54, 162, 235)',
                    borderColor: 'rgb(54, 162, 235)',
                    data: chartData.map(function(item) { return item.strategy; }),
                    fill: false,
                }]
            },
            options: {
                responsive: true,
                title: {
                    display: true,
                    text: 'Performance Comparison'
                },
                tooltips: {
                    mode: 'index',
                    intersect: false,
                },
                hover: {
                    mode: 'nearest',
                    intersect: true
                },
                scales: {
                    x: { // 'xAxes' zmienione na 'x'
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString: 'Date'
                        }
                    },
                    y: { // 'yAxes' zmienione na 'y'
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString: 'Return'
                        }
                    }
                }
            }
        });
    }



// Funkcja aktualizująca wykres kołowy
function updatePieChart(pieChartData) {
    // Usuń istniejący wykres kołowy, jeśli istnieje
    if (myPieChart) {
        myPieChart.destroy();
    }
    var ctxPie = document.getElementById('myPieChart').getContext('2d');
    myPieChart = new Chart(ctxPie, {
        type: 'doughnut',
        data: {
            labels: pieChartData.labels,
            datasets: [{
                label: 'Portfolio Distribution',
                data: pieChartData.data,
                // backgroundColor i borderColor zostały usunięte, więc będą użyte domyślne kolory
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
        }
    });
}

// Funkcja pobierająca dane wykresu
function fetchChartData(startDate) {
    document.getElementById('loading-spinner').style.display = 'block';
    document.getElementById('charts-wrapper').style.display = 'none';

    const windowValue = document.getElementById('start-window-input').value;
    const nlargestWindow = document.getElementById('start-nlargest-window-input').value;
    const balance = document.getElementById('start-calital-input').value;

    // Utwórz parametry dla żądania
    const params = new URLSearchParams({
        start_date: startDate,
        window: windowValue,
        nlargest: nlargestWindow,
        balance: balance
    });

    // Użyj zmiennej `startDate` jako części URL w żądaniu GET
    fetch('/chart-data/?' + params.toString())
        .then(response => response.json())
        .then(data => {
            updateChart(data.results);
            updatePieChart(data.equally_portfolio_data); 
            setNewFormValues()
            document.getElementById('user-preferences-start-date').textContent = startDate;
        })
        .catch(error => {
            console.error('Error:', error);
        })
        .finally(() => {
            document.getElementById('loading-spinner').style.display = 'none';
            document.getElementById('charts-wrapper').style.display = 'block';
        });
}

// Funkcja pobierająca dane do optymalizacji
function fetchOptimisationData() {
    const startDate = document.getElementById('optimisation-date-input').value;
    const windowValue = document.getElementById('optimisation-window-input').value;
    const nlargestWindow = document.getElementById('optimisation-nlargest-window-input').value;

    // Utwórz parametry dla żądania
    const params = new URLSearchParams({
        optimisation_date: startDate,
        window: windowValue,
        nlargest_window: nlargestWindow
    });

    document.getElementById('loading-spinner').style.display = 'block';
    document.getElementById('charts-wrapper').style.display = 'none';

    // Wyślij żądanie z parametrami
    fetch('/optimisation-data/?' + params.toString())
        .then(response => response.json())
        .then(data => {
            updateChart(data.results);
            updatePieChart(data.equally_portfolio_data);  
            setNewFormValues()
            document.getElementById('user-preferences-start-date').textContent = startDate;
            document.getElementById('user-preferences-nlargest').textContent = data.new_nlargest_window;
            document.getElementById('user-preferences-window').textContent = data.new_window;
        })
        .catch(error => {
            console.error('Error:', error);
        })
        .finally(() => {
            document.getElementById('loading-spinner').style.display = 'none';
            document.getElementById('charts-wrapper').style.display = 'block';
        });
}

function updateStocksDate() {
    // Pobranie obecnej daty
    const currentDate = new Date();

    // Formatowanie daty
    const formattedDate = currentDate.toLocaleString('en-US', { month: 'long', year: 'numeric' });

    // Znalezienie elementu w DOM i aktualizacja jego zawartości
    const dateElement = document.getElementById('stocks-date');
    if (dateElement) {
        dateElement.textContent = 'Top stocks for ' + formattedDate;
    } else {
        console.error('Element o ID "stocks-date" nie został znaleziony.');
    }
}

function setNewFormValues() {
    // Pobierz wartość z elementu span i ustaw ją jako value dla inputa 'nlargest_window'
    const nLargestValue = document.getElementById('user-preferences-nlargest').textContent;
    const nLargestInput = document.getElementById('start-nlargest-window-input');
    if (nLargestInput && nLargestValue) {
      nLargestInput.value = parseInt(nLargestValue, 10); // Używamy parseInt, aby upewnić się, że wartość jest liczbą całkowitą
    }
  
    // Pobierz wartość z elementu span i ustaw ją jako value dla inputa 'window'
    const windowValue = document.getElementById('user-preferences-window').textContent;
    const windowInput = document.getElementById('start-window-input');
    if (windowInput && windowValue) {
      windowInput.value = parseInt(windowValue, 10); // To samo tutaj
    }
  }

function populateTickerData(data) {
    const container = document.getElementById('ticker-display-container');
    container.innerHTML = ''; // Czyść kontener przed dodaniem nowych elementów
    {
        const container = document.getElementById('ticker-display-container');
        container.className = 'w-full max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-4';

        Object.entries(data).forEach(([ticker, info]) => {
            const tickerAnchor = document.createElement('a');
            tickerAnchor.href = `/ticker_detail/${ticker}/`; // Ustaw adres URL
            tickerAnchor.className = 'bg-white shadow rounded-lg p-4 flex flex-col items-center hover:shadow-lg transition-all duration-300 transform hover:scale-105';
            tickerAnchor.style.textDecoration = 'none';
            tickerAnchor.style.backfaceVisibility = 'hidden';
            tickerAnchor.style.color = 'inherit';
            tickerAnchor.style.WebkitFontSmoothing = 'subpixel-antialiased';

            const logoImg = document.createElement('img');
            logoImg.src = info.logo;
            logoImg.alt = info.company_name;
            logoImg.className = 'w-40 h-40 object-contain';

            const tickerSymbol = document.createElement('div');
            tickerSymbol.textContent = ticker;
            tickerSymbol.className = 'text-lg font-semibold';

            const companyName = document.createElement('div');
            companyName.textContent = info.company_name;
            companyName.className = 'text-sm text-gray-600';

            const currentPrice = document.createElement('div');
            currentPrice.textContent = `${info.current_price.toFixed(2)}$`;
            currentPrice.className = 'text-xl font-bold';
            currentPrice.id = `price-${ticker}`;

            const priceChange = document.createElement('div');
            priceChange.textContent = info.price_change.toFixed(2) + '$';
            priceChange.className = `text-${info.price_change < 0 ? 'red' : 'green'}-500`;
            priceChange.id = `change-${ticker}`;

            const percentChange = document.createElement('div');
            percentChange.textContent = `${info.percent_change.toFixed(2)}%`;
            percentChange.className = `text-${info.percent_change < 0 ? 'red' : 'green'}-500`;
            percentChange.id = `percent-${ticker}`; 

            [logoImg, tickerSymbol, companyName, currentPrice, priceChange, percentChange].forEach(el => {
                tickerAnchor.appendChild(el); // Dodaj elementy do anchor tag
            });

            container.appendChild(tickerAnchor);
        });
        }
    }
 

function createTickerDisplay() {
const savedData = localStorage.getItem('tickerData');
if (savedData) {
    populateTickerData(JSON.parse(savedData));
}
fetch('/tickers_info/')
    .then(response => {
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
    })
    .then(data => {
        localStorage.setItem('tickerData', JSON.stringify(data));
        populateTickerData(data);
      })
    .catch(error => {
    console.error('Could not fetch ticker data:', error);
    });
}
  
function updateTickerDisplay() {
    fetch('/tickers_info/')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        localStorage.setItem('tickerData', JSON.stringify(data));
        Object.entries(data).forEach(([ticker, info]) => {
          // Zaktualizuj istniejące elementy, jeśli istnieją

          const currentPriceElement = document.getElementById(`price-${ticker}`);
          const priceChangeElement = document.getElementById(`change-${ticker}`);
          const percentChangeElement = document.getElementById(`percent-${ticker}`);
  
          if (currentPriceElement && priceChangeElement && percentChangeElement) {
            currentPriceElement.textContent = `${info.current_price.toFixed(2)}$`;
            priceChangeElement.textContent = info.price_change.toFixed(2) + '$';
            percentChangeElement.textContent = `${info.percent_change.toFixed(2)}%`;
  
            // Aktualizacja koloru tekstu dla zmiany ceny
            priceChangeElement.className = `text-${info.price_change < 0 ? 'red' : 'green'}-500`;
            percentChangeElement.className = `text-${info.percent_change < 0 ? 'red' : 'green'}-500`;
          }
        });
      })
      .catch(error => {
        console.error('Could not fetch ticker data:', error);
      });
  }

  function handleSubmitPortfolioForm() {
    const form = document.querySelector('#purchase-container form');
    
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
        fetch('/ścieżka-do-user_portfolio_api/', {
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
            // Tutaj możesz obsłużyć dane zwrotne, np. aktualizując UI
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });
}

document.addEventListener('DOMContentLoaded', function() {
    handleSubmitPortfolioForm();
    // Tutaj możesz wywołać inne funkcje inicjalizujące
});
  

// Obsługa zdarzeń formularza
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('loading-spinner').style.display = 'none';
    document.getElementById('strategy-form').addEventListener('submit', function(event) {
        event.preventDefault(); // Zapobiega domyślnemu zachowaniu formularza
        var startDate = document.getElementById('start-date-input').value;
        fetchChartData(startDate); // Przekazujemy wybraną datę do funkcji fetchChartData
    });

    document.getElementById('optimisation-form').addEventListener('submit', function(event) {
        event.preventDefault();
        fetchOptimisationData(); // Wywołaj funkcję z danymi z formularza
    });
    createTickerDisplay()
    updateStocksDate();
    setNewFormValues();
  // Wywołanie funkcji
    setInterval(updateTickerDisplay, 60000); // Co minutę
});