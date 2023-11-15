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
    updateStocksDate();
    setNewFormValues()
});