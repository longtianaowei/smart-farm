import * as echarts from '../../ec-canvas/echarts';
import http from './../utils/http.js';
const app = getApp();
// 全局变量用于存储图表实例
let smokeChart = null
let coChart = null
function initsmokeChart(canvas, width, height, dpr) {
    smokeChart = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr // new
  });
  canvas.setChart(smokeChart);

  var option = {
    series: [
      {
        // 图表类型仪表盘
        type: 'gauge',
        // 指定了仪表盘的中心位
        center: ['50%', '60%'],
        // 仪表盘的起始角度
        startAngle: 200,
        // 仪表盘的结束角度
        endAngle: -20,
        // 数字范围
        min: 0,
        max: 50,
        splitNumber: 10,
        // 仪表盘颜色
        itemStyle: {
          color: '#00E500'
        },
        // 仪表盘的进度条
        progress: {
          show: true,
          // 进度条的宽度
          width: 30
        },
        // 指针是否显示
        pointer: {
          show: false
        },
        // 仪表盘的轴线、刻度、分隔线、刻度标签、指针锚点和标题等
        axisLine: {
          lineStyle: {
            width: 30
          }
        },
        axisTick: {
          distance: -45,
          splitNumber: 5,
          lineStyle: {
            width: 2,
            color: '#999'
          }
        },
        splitLine: {
          distance: -52,
          length: 14,
          lineStyle: {
            width: 3,
            color: '#999'
          }
        },
        axisLabel: {
          distance: -20,
          color: '#999',
          fontSize: 20
        },
        anchor: {
          show: false
        },
        title: {
          show: false
        },
        detail: {
          // 数字改变动画是否开启
          valueAnimation: true,
          // 仪表盘数字部分的宽度
          width: '60%',
          // 数字部分行高
          lineHeight: 40,
          // 数字部分的边框圆角半径
          borderRadius: 8,
          // 数字部分相对于仪表盘中心的偏移量
          offsetCenter: [0, '-15%'],
          // 字体大小
          fontSize: 30,
          // 字体粗细
          fontWeight: 'bolder',
          // 显示数字部分的内容
          formatter: '{value} PPM',
          // 继承上面的颜色
          color: 'inherit' 
        },
        data: [
          {
            value: 0
          }
        ]
      }
    ]
  };

  smokeChart.setOption(option, true);

  return smokeChart;
}


function initCoChart(canvas, width, height, dpr) {
  coChart = echarts.init(canvas, null, {
  width: width,
  height: height,
  devicePixelRatio: dpr // new
});
canvas.setChart(coChart);

var option = {
  series: [
    {
      type: 'gauge',
      center: ['50%', '60%'],
      startAngle: 200,
      endAngle: -20,
      min: 0,
      max: 50,
      splitNumber: 10,
      itemStyle: {
        color: '#00E500'
      },
      progress: {
        show: true,
        width: 30
      },
      pointer: {
        show: false
      },
      axisLine: {
        lineStyle: {
          width: 30
        }
      },
      axisTick: {
        distance: -45,
        splitNumber: 5,
        lineStyle: {
          width: 2,
          color: '#999'
        }
      },
      splitLine: {
        distance: -52,
        length: 14,
        lineStyle: {
          width: 3,
          color: '#999'
        }
      },
      axisLabel: {
        distance: -20,
        color: '#999',
        fontSize: 20
      },
      anchor: {
        show: false
      },
      title: {
        show: false
      },
      detail: {
        valueAnimation: true,
        width: '30%',
        lineHeight: 40,
        borderRadius: 8,
        offsetCenter: [0, '-15%'],
        fontSize: 30,
        fontWeight: 'bolder',
        formatter: '{value} PPM',
        color: 'inherit'
      },
      data: [
        {
          value: 0
        }
      ]
    }
  ]
};

coChart.setOption(option, true);

return coChart;
}
Page({
  /**
   * 页面的初始数据
   */
  data: {
    ecSmoke: {
      onInit: initsmokeChart
    },
    ecCo: {
      onInit: initCoChart
    }
  },

  // 获取烟雾传感器数据
  getSmokeSensorData() {
    http({
      url: '/sensor.ylzesp32_smoke', // 这里的URL是相对于pubUrl的路径部分
      method: 'GET', 
    }).then(res => {
      const newValue = res.data.state;
      // 传感器大于4000为正常值
      if(newValue > 3000) {
        let randomInt = Math.floor(Math.random() * 5)
        smokeChart.setOption({
          series: [{
            data: [{ value: randomInt }],
            itemStyle: {
              color: '#00E500' // 绿色
            }
          }]
        })
        return
      }
      let color
      if (newValue < 5) {
        color = '#00E500'; // 绿色
      } else if (newValue < 10) {
        color = '#FFD306'; // 黄色
      } else {
        color = '#FF3E3E'; // 红色
      }
      // 更新仪表盘的数据和颜色
      smokeChart.setOption({
        series: [{
          data: [{ value: newValue }],
          itemStyle: {
            color: color // 根据传感器值设置颜色
          }
        }]
      })
    }).catch(err => {
      // 处理请求失败的情况
      wx.showToast({
        title: '请检查网络',
        icon: 'error',
        duration: 3000
      })
      
    })
  },

  // 获取CO传感器数据
  getCoSensorData() {
    http({
      url: '/sensor.ylzesp32_co', // 这里的URL是相对于pubUrl的路径部分
      method: 'GET', // 请求方法，根据实际情况填写，如'GET'、'POST'等
      // data: {}, // 如果是POST请求，这里填写请求体中的数据
    }).then(res => {
      const newValue = res.data.state;
      // 传感器大于500为正常值
      if(newValue > 300) {
        let randomInt = Math.floor(Math.random() * 20)
        coChart.setOption({
          series: [{
            data: [{ value: randomInt }],
            itemStyle: {
              color: '#00E500' // 绿色
            }
          }]
        })
        return
      }
      let color
      if (newValue < 30) {
        color = '#00E500'; // 绿色
      } else if (newValue < 50) {
        color = '#FFD306'; // 黄色
      } else {
        color = '#FF3E3E'; // 红色
      }
      // 更新仪表盘的数据和颜色
      coChart.setOption({
        series: [{
          data: [{ value: newValue }],
          itemStyle: {
            color: color // 根据传感器值设置颜色
          }
        }]
      })
    }).catch(err => {
      // 处理请求失败的情况
      wx.showToast({
        title: '请检查网络',
        icon: 'error',
        duration: 3000
      })
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    wx.showToast({
      title: '加载数据中',
      icon: 'loading',
      duration: 3000
    })
    setInterval(() => {this.getSmokeSensorData()},3000)
    setInterval(() => {this.getCoSensorData()},3000)

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    return {
      title: '农足智控小程序',
      path: '/pages/index/index',
      success: function () { },
      fail: function () { }
    }
  },
});
