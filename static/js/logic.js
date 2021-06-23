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

// Step 1: Plotly
// initialize the page with default data
function init() {
  // read in samples.json
  d3.csv("/static/data/potholes_clean_mnthfinal.csv").then((data) => {

    // function to group data
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

    // call groupBy function to group data by CREATION_YEAR
    let groupedYears = groupBy(data, 'CREATION_YEAR');
    console.log(groupedYears);

    // loop through dictionary and append the keys to the dropdown menu
    for (const [key, value] of Object.entries(groupedYears)) {
      let dropdownMenu = d3.selectAll("#selDataset")
        .append("option")
        .text(key)
        .property("value", key);
      // console.log elt to ensure data is pulling correctly
        console.log(value);
        }
})};

// Call updateData() when a change takes place to the DOM
d3.selectAll("#selDataset").on("change", updateData);

//read in data
function updateData() {
    d3.csv("/static/data/potholes_clean_mnthfinal.csv").then(function(data) {
      
    // create variable for dropdown
    let dropdownMenu = d3.select("#selDataset");
    // create variable for selection in dropdown Menu
    let dataSelection = dropdownMenu.property("value");

    // filter data based on year selected in dropdown menu
    let filteredData = data.filter(elt => elt.CREATION_YEAR == dataSelection);
    console.log(filteredData);
    console.log(dataSelection);

    // // create function to group data by
    // function groupBy(objectArray, property) {
    //     return objectArray.reduce(function (acc, obj) {
    //       let key = obj[property]
    //       if (!acc[key]) {
    //         acc[key] = []
    //       }
    //       acc[key].push(obj)
    //       return acc
    //     }, {})
    // };

    // function groupBySum(objectArray, property) {
    //   return objectArray.reduce(function (acc, obj) {
    //     let key = obj[property]
    //     acc[key] = (acc[key] || 0) + 1
    //     return acc
    //   }, {})
    // };

    // // call groupBy function to group filteredData by MOST_RECENT_ACTION
    // let groupedAction = groupBy(filteredData, 'STATUS');
    // console.log(groupedAction);

    buildGeoMap(filteredData);
    buildBarChart(dataSelection, filteredData);
    buildLineChart(dataSelection, filteredData);

  })
};

function buildGeoMap() {
  var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
});

var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "dark-v10",
    accessToken: API_KEY
});

var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap
};

// var overlayMaps = {
//     Earthquakes: earthquakes
// };
// Read markers data from data.csv
d3.csv("/static/data/potholes_clean_mnthfinal.csv", function(csvString) {

  // Use PapaParse to convert string to array of objects
  var data = Papa.parse(csvString, {header: true, dynamicTyping: true}).data;

  // For each row in data, create a marker and add it to the map
  // For each row, columns `Latitude`, `Longitude`, and `Title` are required
  for (var i in data) {
    var row = data[i];

    var marker = L.marker([row.LATITUDE, row.LONGITUDE], {
      opacity: 1
    }).bindPopup(row.ZIP);
    
    marker.addTo(map);
  }

});

// Create a new map
var myMap = L.map("map", {
    center: [41.8781, -87.6298],
    zoom: 2,
    layers: [streetmap]
});

// Create a layer control containing our baseMaps
// Be sure to add an overlay Layer containing the earthquake GeoJSON
L.control.layers(baseMaps).addTo(myMap);
};

function buildBarChart(dataSelection,filteredData) {

  // clear/overwrite previous data
  let barchart = d3.select("#top_x_div")
  barchart.html(""); 
  
  console.log(dataSelection);
  console.log(filteredData);

  let status = filteredData.map(data => data.STATUS);
  console.log(status);

  // create function to group data by
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

  function groupBySum(objectArray, property) {
    return objectArray.reduce(function (acc, obj) {
      let key = obj[property]
      acc[key] = (acc[key] || 0) + 1
      return acc
    }, {})
  };

    // call groupBy function to group filteredData by MOST_RECENT_ACTION
    let groupedStatus = groupBySum(filteredData, 'STATUS');
    console.log(groupedStatus);

  google.charts.load('current', {'packages':['corechart']});
  google.charts.setOnLoadCallback(drawChart);

  function drawChart() {

    var data = new google.visualization.arrayToDataTable([
      ['Status', 'Number'],
      ...Object.entries(groupedStatus)
    ]);
    var options = {
      title: 'Pothole Status',
    };

    var chart = new google.visualization.PieChart(document.getElementById('top_x_div'));
    chart.draw(data, options);
  }
    };


function buildLineChart(dataSelection, filteredData) {

  // clear/overwrite previous data
  let linechart = d3.select("#chart_div")
  linechart.html(""); 
  
  console.log(dataSelection);
  console.log(filteredData);

  let status = filteredData.map(data => data.STATUS);
  // console.log(status);
  
  let months = filteredData.map(data => data.CREATION_MONTH);
  // console.log(months);

  var counts = {};

  for (var i = 0; i < months.length; i++) {
    var num = months[i];
    counts[num] = counts[num] ? counts[num] + 1 : 1;
  }

// Create our first trace
var trace1 = {
  x: Object.keys(counts),
  y: Object.values(counts),
  type: "scatter"
};

// The data array consists of both traces
var data = [trace1];

// Note that we omitted the layout object this time
// This will use default parameters for the layout
Plotly.newPlot("chart_div", data);

};

// load page with default data
init();