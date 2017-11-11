function convert(row) {
  var timestamp = `${row.timestamp.split('T')[0]} ${row.timestamp.split('T')[1].split('.')[0]}`;
  return {
    temperature: row.temperature,
    humidity: row.humidity,
    timestamp: timestamp,
  };
}

const colors = {
  temperature: '#0000ff',
  humidity: '#ff0000',
};

function renderChart(datapoint, data) {
  var x = ['x'];
  var series = [datapoint];

  data.forEach(function(r) {
    var row = convert(r);
    x.push(row.timestamp);
    series.push(row[datapoint]);
  });

  return c3.generate({
    bindto: `#${datapoint}`,
    color: { pattern: [colors[datapoint]] },
    data: {
      x: 'x',
      xFormat: '%Y-%m-%d %H:%M:%S',
      columns: [x, series],
    },
    axis: {
      x: {
        type: 'timeseries',
        tick: {
          format: '%Y-%m-%d %H:%M:%S'
        }
      }
    }
  });
}

