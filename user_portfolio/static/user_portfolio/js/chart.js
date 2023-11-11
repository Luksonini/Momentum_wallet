     // Parse the JSON data
     var chartData = JSON.parse('{{ chart_data | safe }}');

     // Prepare data for the chart
     var labels = chartData.map(function(item) { return item.date; });
     var us500Data = chartData.map(function(item) { return item.US500_returns; });
     var strategyData = chartData.map(function(item) { return item.strategy; });

     // Get the context of the canvas element we want to select
     var ctx = document.getElementById('myChart').getContext('2d');
     var myChart = new Chart(ctx, {
         type: 'line',  // The type of chart we want to create
         data: {
             labels: labels,  // Our labels along the x-axis
             datasets: [{
                 label: 'US500 Returns',
                 backgroundColor: 'rgb(255, 99, 132)',
                 borderColor: 'rgb(255, 99, 132)',
                 data: us500Data,
                 fill: false,
             }, {
                 label: 'Strategy',
                 backgroundColor: 'rgb(54, 162, 235)',
                 borderColor: 'rgb(54, 162, 235)',
                 data: strategyData,
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
                 xAxes: [{
                     display: true,
                     scaleLabel: {
                         display: true,
                         labelString: 'Date'
                     }
                 }],
                 yAxes: [{
                     display: true,
                     scaleLabel: {
                         display: true,
                         labelString: 'Return'
                     }
                 }]
             }
         }
     });
