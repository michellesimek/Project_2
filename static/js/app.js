// check to ensure data is uploading correctly
// d3.csv("/static/data/potholes_clean_noid.csv").then(function(data) {
//     // loop through each data row and print out creation date
//     // for (var i = 0; i < data.length; i++) {
//     //     console.log(data[i].CREATION_DATE);
//     // };
//     data.forEach(function(data) {
//         console.log(data.STATUS)
//     });
//     // print out all data from csv
//     // console.log(data)
// });

// ---------------------------------------------------------------
// svg container
var svgHeight = 400;
var svgWidth = 1000;

// margins
var margin = {
  top: 50,
  right: 50,
  bottom: 50,
  left: 50
};

// chart area minus margins
var chartHeight = svgHeight - margin.top - margin.bottom;
var chartWidth = svgWidth - margin.left - margin.right;

// create svg container
var svg = d3.select("#svg-area").append("svg")
  .attr("height", svgHeight)
  .attr("width", svgWidth);

// shift everything over by the margins
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);


//read in data
d3.csv("/static/data/potholes_clean_yearfinal.csv").then(function(data) {
    let filteredData = data.filter(elt => elt.CREATION_YEAR == "2010");
    console.log(filteredData);

    function groupBy(objectArray, property) {
        return objectArray.reduce(function (acc, obj) {
          let key = obj[property]
          if (!acc[key]) {
            acc[key] = []
          }
          acc[key].push(obj)
          return acc
        }, {})
    };

    let groupedAction = groupBy(filteredData, 'MOST_RECENT_ACTION');
    console.log(groupedAction);

    // let groupData = filteredData.groupBy(data, elt => elt.name);
    // console.log(groupData);

    // let recent_action = [];
    // let recent_action_count = [];

    // filteredData.forEach(function(data) {
    //     if (data["MOST RECENT ACTION"] in recent_action) {
    //         recent_action_count += 1
    //     } else {
    //         recent_action += data["MOST RECENT ACTION"];
    //         recent_action_count == 1
    //     }
    //     // recent_action = data["MOST RECENT ACTION"];
    //     console.log(recent_action);
    //     console.log(recent_action_count);
    // });
});
//     google.charts.load('current', {'packages':['corechart']});
//     google.charts.setOnLoadCallback(drawChart);

//     function drawChart() {

//     // // Create the data table.
//     // var data = new google.visualization.DataTable();
//     // data.addColumn('string', 'Topping');
//     // data.addColumn('number', 'Slices');
//     // data.addRows([
//     //   ['Mushrooms', 3],
//     //   ['Onions', 1],
//     //   ['Olives', 1],
//     //   ['Zucchini', 1],
//     //   ['Pepperoni', 2]
//     // ]);

//         // Create the data table.
//         var data = new google.visualization.DataTable();
//         data.addColumn('string', 'MOST_RECENT_ACTION');
//         data.addColumn('number', 'Count of MOST_RECENT_ACTION');
//         data.addRows(
            
//         );

//     // Set chart options
//     var options = {'title':'Streets With The Most Potholes Reported',
//                    'width':400,
//                    'height':300};

//     // Instantiate and draw our chart, passing in some options.
//     var chart = new google.visualization.BarChart(document.getElementById('chart_div'));
//     chart.draw(data, options);
//   }


