import F2 from '@antv/wx-f2'; // 注：也可以不引入， initChart 方法已经将 F2 传入，如果需要引入，注意需要安装 @antv/wx-f2 依赖
function initChart(canvas, width, height, F2) { // 使用 F2 绘制图表
  var that = this;
  let chart = null;
  let initChart_data = wx.getStorageSync('charts').score.score1

  chart = new F2.Chart({
    el: canvas,
    width,
    height
  });
  chart.tooltip(false);

  chart.source(initChart_data);

  // chart.changeData(data);  //更新表单

  chart.coord({
    transposed: true
  });

  chart.tooltip({
    showItemMarker: false,
    onShow(ev) {
      const { items } = ev;
      items[0].name = null;
      items[0].name = items[0].title;
      items[0].value = items[0].value;
    }
  });
  chart.interval().position('info*standard_score').size(20).color('standard_score', function (val) {
    if (val <= 3) {
      return '#FFFF00';
    } else if (val >= 4 && val <= 7) {
      return '#FFA500';
    } else {
      return '#0088FF';
    }
  });

  // 柱状图添加文本
  initChart_data.map((obj) => {
    var obj_content;
    if (obj.original_score > obj.standard_score) {
      obj_content = obj.high_character;
    } else {
      obj_content = obj.low_character;
    }
    chart.guide().text({
      position: [obj.info, obj.standard_score],
      content: obj_content,
      style: {
        textAlign: 'center',
        textBaseline: 'bottom'
      },
      offsetY: 6,
      offsetX: -6
    });
  });

  chart.render();
  return chart;
}

// 第2图表
function initChart1(canvas, width, height, F2) { // 使用 F2 绘制图表
  var that = this;
  let chart = null;
  let initChart_data = wx.getStorageSync('charts').score.score2

  chart = new F2.Chart({
    el: canvas,
    width,
    height
  });
  chart.tooltip(false);

  chart.source(initChart_data);

  // chart.changeData(data);  //更新表单

  chart.tooltip({
    showItemMarker: false,
    onShow(ev) {
      const { items } = ev;
      items[0].name = null;
      items[0].name = items[0].title;
      items[0].value = items[0].value;
    }
  });
  chart.interval().position('info*standard_score').size(20);
  chart.render();
  return chart;
}

Page({
  data: {
    opts: {
      onInit: initChart,
    },
    opts1: {
      onInit: initChart1,
    },
    chartData: ''
  },

  onLoad() {
    var that = this;
    wx.getSystemInfo({
      success(res) {
        console.log(res)
        that.setData({
          firstOptTop: res.screenHeight
        })
      },
    })

    this.setData({ chartData: wx.getStorageSync('charts')})
  }
});