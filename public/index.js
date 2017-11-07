function convert(row) {
  var timestamp = `${row.timestamp.split('T')[0]} ${row.timestamp.split('T')[1].split('.')[0]}`;
  return {
    temperature: row.temperature,
    humidity: row.humidity,
    timestamp: timestamp,
  };
}

function renderChart(data) {
  var x = ['x'];
  var temperature = ['temperature'];
  var humidity = ['humidity'];

  data.forEach(function(r) {
    var row = convert(r);
    x.push(row.timestamp);
    temperature.push(row.temperature);
    humidity.push(row.humidity);
  });

  return c3.generate({
    data: {
      x: 'x',
      xFormat: '%Y-%m-%d %H:%M:%S',
      columns: [x, temperature, humidity],
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

