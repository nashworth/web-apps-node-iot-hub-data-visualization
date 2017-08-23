$(document).ready(function () {
  var timeData = [],
  Acc100Data = [];
  Acc800Data = [];
  Acc3200Data = [];
  var data = {
    labels: timeData,
    datasets: [
      {
        fill: false,
        label: 'Acc100',
        yAxisID: 'Amplitude',
        borderColor: "rgba(255, 204, 0, 1)",
        pointBoarderColor: "rgba(255, 204, 0, 1)",
        backgroundColor: "rgba(255, 204, 0, 0.4)",
        pointHoverBackgroundColor: "rgba(255, 204, 0, 1)",
        pointHoverBorderColor: "rgba(255, 204, 0, 1)",
        data: Acc100Data
      },
      {
        fill: false,
        label: 'Acc800',
        yAxisID: 'Amplitude',
        borderColor: "rgba(100, 100, 100, 1)",
        pointBoarderColor: "rgba(100, 100, 100, 1)",
        backgroundColor: "rgba(100, 100, 100, 0.4)",
        pointHoverBackgroundColor: "rgba(100, 100, 100, 1)",
        pointHoverBorderColor: "rgba(100, 100, 100, 1)",
        data: Acc800Data
      },
      {
        fill: false,
        label: 'Acc3200',
        yAxisID: 'Amplitude',
        borderColor: "rgba(24, 120, 240, 1)",
        pointBoarderColor: "rgba(24, 120, 240, 1)",
        backgroundColor: "rgba(24, 120, 240, 0.4)",
        pointHoverBackgroundColor: "rgba(24, 120, 240, 1)",
        pointHoverBorderColor: "rgba(24, 120, 240, 1)",
        data: Acc3200Data
      }
    ]
  }

  var basicOption = {
    title: {
      display: true,
      text: 'Vibration Amplitude Real-time Data',
      fontSize: 36
    },
    scales: {
      yAxes: [{
        id: 'Amplitude',
        type: 'linear',
        scaleLabel: {
          labelString: 'RMS Amplitude',
          display: true
        },
        position: 'left',
      }, 
      ]
    }
  }

  //Get the context of the canvas element we want to select
  var ctx = document.getElementById("myChart").getContext("2d");
  var optionsNoAnimation = { animation: false }
  var myLineChart = new Chart(ctx, {
    type: 'line',
    data: data,
    options: basicOption
  });

  var ws = new WebSocket('wss://' + location.host);
  ws.onopen = function () {
    console.log('Successfully connect WebSocket');
  }
  ws.onmessage = function (message) {
    console.log('receive message' + message.data);
    try {
      var obj = JSON.parse(message.data);
      if(obj.device_id != 420027000d47353136383631)
      {
        return;
      }
      timeData.push(obj.published_at);
      Acc100Data.push(obj.Acc_100);
      // only keep no more than 50 points in the line chart
      const maxLen = 50;
      var len = timeData.length;
      if (len > maxLen) {
        timeData.shift();
        Acc100Data.shift();
      }

      if (obj.Acc_3200) {
        Acc3200Data.push(obj.Acc_3200);
      }
      if (Acc3200Data.length > maxLen) {
        Acc3200Data.shift();
      }
      if (obj.Acc_800) {
        Acc800Data.push(obj.Acc_800);
      }
      if (Acc800Data.length > maxLen) {
        Acc800Data.shift();
      }

      myLineChart.update();
    } catch (err) {
      console.error(err);
    }
  }
});
