// Global variables for charts and interval
var myChart;
var myPieChart; 
var intervalID;

// Function to update the line chart
function updateChart(chartData) {
    // Destroy existing chart if present
    if (myChart) {
        myChart.destroy();
    }

    // Create a new chart with new data
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



// Function to update the pie chart
function updatePieChart(pieChartData) {
    // Destroy existing pie chart if present
    if (myPieChart) {   
        myPieChart.destroy();
    }
     // Create a new pie chart
    var ctxPie = document.getElementById('myPieChart').getContext('2d');
    myPieChart = new Chart(ctxPie, {
        type: 'doughnut',
        data: {
            labels: pieChartData.labels,
            datasets: [{
                label: 'Portfolio Distribution',
                data: pieChartData.data,
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
        }
    });
}

// Function to fetch chart data
function fetchChartData(startDate) {
     // Preparation and API call logic
    clearInterval(intervalID);
    document.getElementById('strategy-submit-btn').disabled = true;
    document.getElementById('optimisation-submit-btn').disabled = true;
    document.getElementById('loading-spinner').style.display = 'block';
    document.getElementById('linechart-wrapper').style.display = 'none';
    document.getElementById('piechart-wrapper').style.display = 'none';
    document.getElementById('ticker-display-container').style.display = 'none';

    const windowValue = document.getElementById('start-window-input').value;
    const nlargestWindow = document.getElementById('start-nlargest-window-input').value;
    const balance = document.getElementById('start-calital-input').value;

    
    // Finalize by setting up the UI and interval
    document.getElementById('user-preferences-start-date').textContent = startDate;
    document.getElementById('user-preferences-nlargest').textContent = nlargestWindow;
    document.getElementById('user-preferences-window').textContent = windowValue;

    const params = new URLSearchParams({
        start_date: startDate,
        window: windowValue,
        nlargest: nlargestWindow,
        balance: balance
    });

    // Function to fetch optimisation data
    fetch('/chart-data/?' + params.toString())
        .then(response => response.json())
        .then(data => {
            const pieChartData = JSON.parse(data.equally_portfolio_data);
            updateChart(data.results);
            updatePieChart(pieChartData); 
            setNewFormValues()
            document.getElementById('user-preferences-start-date').textContent = startDate;
            createTickerDisplay()
        })
        .catch(error => {
            console.error('Error:', error);
        })
        .finally(() => {
            document.getElementById('loading-spinner').style.display = 'none';
            document.getElementById('linechart-wrapper').style.display = 'block';
            document.getElementById('piechart-wrapper').style.display = 'block';
            document.getElementById('ticker-display-container').style.display = 'grid'
            document.getElementById('strategy-submit-btn').disabled = false;
            document.getElementById('optimisation-submit-btn').disabled = false;
            intervalID = setInterval(updateTickerDisplay, 60000);
        });
}


// Function to fetch optimisation data
function fetchOptimisationData() {
    // Preparation and API call logic
    clearInterval(intervalID);
    document.getElementById('strategy-submit-btn').disabled = true;
    document.getElementById('optimisation-submit-btn').disabled = true;
    const startDate = document.getElementById('optimisation-date-input').value;
    const windowValue = document.getElementById('optimisation-window-input').value;
    const nlargestWindow = document.getElementById('optimisation-nlargest-window-input').value;
    

    const params = new URLSearchParams({
        optimisation_date: startDate,
        window: windowValue,
        nlargest_window: nlargestWindow
    });

    document.getElementById('loading-spinner').style.display = 'block';
    document.getElementById('linechart-wrapper').style.display = 'none';
    document.getElementById('piechart-wrapper').style.display = 'none';
    document.getElementById('ticker-display-container').style.display = 'none'
    
    fetch('/optimisation-data/?' + params.toString())
        .then(response => response.json())
        .then(data => {
            updateChart(data.results);
            updatePieChart(JSON.parse(data.equally_portfolio_data));;  
            setNewFormValues()
            createTickerDisplay()

            document.getElementById('user-preferences-start-date').textContent = startDate;
            document.getElementById('user-preferences-nlargest').textContent = data.new_nlargest_window;
            document.getElementById('user-preferences-window').textContent = data.new_window;
        })
        .catch(error => {
            console.error('Error:', error);
        })
        // Finalize by setting up the UI and interval
        .finally(() => {
            document.getElementById('loading-spinner').style.display = 'none';
            document.getElementById('linechart-wrapper').style.display = 'block';
            document.getElementById('piechart-wrapper').style.display = 'block';
            document.getElementById('ticker-display-container').style.display = 'grid'
            document.getElementById('strategy-submit-btn').disabled = false;
            document.getElementById('optimisation-submit-btn').disabled = false;
            intervalID = setInterval(updateTickerDisplay, 60000);
        });
}

// Function to update stock date display
function updateStocksDate() {
     // Update the date display for stocks
    const currentDate = new Date();

    const formattedDate = currentDate.toLocaleString('en-US', { month: 'long', year: 'numeric' });

    const dateElement = document.getElementById('stocks-date');
    if (dateElement) {
        dateElement.textContent = 'Top stocks for ' + formattedDate;
    } else {
        console.error('Element o ID "stocks-date" nie został znaleziony.');
    }
}

// Function to set new values in the form based on user preferences
function setNewFormValues() {
    // Set new values in form inputs'
    const nLargestValue = document.getElementById('user-preferences-nlargest').textContent;
    const nLargestInput = document.getElementById('start-nlargest-window-input');
    if (nLargestInput && nLargestValue) {
      nLargestInput.value = parseInt(nLargestValue, 10); 
    }
    const windowValue = document.getElementById('user-preferences-window').textContent;
    const windowInput = document.getElementById('start-window-input');
    if (windowInput && windowValue) {
      windowInput.value = parseInt(windowValue, 10); 
    }
  }

  // Function to populate ticker data
function populateTickerData(data) {
    // Populate ticker data into the ticker display container
    const container = document.getElementById('ticker-display-container');
    container.innerHTML = ''; 
    {
        const container = document.getElementById('ticker-display-container');
        container.className = 'w-full max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-4 mt-5';

        Object.entries(data).forEach(([ticker, info]) => {
            const tickerAnchor = document.createElement('a');
            tickerAnchor.href = `/portfolio/${ticker}/`; 
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
                tickerAnchor.appendChild(el); 
            });

            container.appendChild(tickerAnchor);
        });
        }
    }
 
// Function to create ticker display
function createTickerDisplay() {
// Create ticker display and set interval
const savedData = localStorage.getItem('tickerData');
if (savedData) {
    populateTickerData(JSON.parse(savedData));
}
fetch('/tickers_info/')
    .then(response => {
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    clearInterval(intervalID);
    return response.json();
    })
    .then(data => {
        intervalID = setInterval(updateTickerDisplay, 60000);
        localStorage.setItem('tickerData', JSON.stringify(data));
        populateTickerData(data);
      })
    .catch(error => {
    console.error('Could not fetch ticker data:', error);
    });
}

// Function to update ticker display
function updateTickerDisplay() {
// Update ticker display with latest information
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


// Event listener for DOM content loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initial setup and event listeners
    document.getElementById('loading-spinner').style.display = 'none';
    document.getElementById('strategy-form').addEventListener('submit', function(event) {
        event.preventDefault();
        var startDate = document.getElementById('start-date-input').value;
        fetchChartData(startDate);
    });

    document.getElementById('optimisation-form').addEventListener('submit', function(event) {
        event.preventDefault();
        fetchOptimisationData();
    });
    createTickerDisplay();
    updateStocksDate();
    setNewFormValues();

    intervalID = setInterval(updateTickerDisplay, 60000);
});