import * as echarts from '../../echarts/ec-canvas/echarts';
var app = getApp();
Page({
  data:{
    ec_relation: {
      onInit: drowRelation
    },
    comId:"",
    lastX: 0,
    lastY: 0,
    text: "没有滑动",
  },
  onLoad(option){
    console.log(option)
    this.setData({
      comId: option.id
    })
  },
  handletouchmove: function (event) {
    // console.log(event)
    let currentX = event.touches[0].pageX
    let currentY = event.touches[0].pageY
    let tx = currentX - this.data.lastX
    let ty = currentY - this.data.lastY
    let text = ""

    if (Math.abs(tx) > Math.abs(ty)) {
      //左右方向滑动
      if (tx < 0)
        text = "向左滑动"
      else if (tx > 0)
        text = "向右滑动"
    }
    else {
      //上下方向滑动
      if (ty < 0)
        text = "向上滑动"
      else if (ty > 0)
        text = "向下滑动"
    }

    //将当前坐标进行保存以进行下一次计算
    this.data.lastX = currentX
    this.data.lastY = currentY
    this.setData({
      text: text,
    });

  },
  handletouchtart: function (event) {
    // console.log(event)
    // 赋值
    this.data.lastX = event.touches[0].pageX
    this.data.lastY = event.touches[0].pageY
  },
  onShareAppMessage() {
    var path = '/pages/moreNet/moreNet?id=' + app.globalData.id;
    return {
      title: '做最专业的技术调查工具',
      path: path
    }
  },
  clickMorecooper() {
    wx.navigateTo({
      url: '../cooperate/cooperate?id=' + this.data.comId,
    })
  },
})
function drowRelation(canvas, width, height) {
  const chart = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  canvas.setChart(chart);
  wx.request({
    url: 'https://api.piionee.com/piionee/transfer/industry/getCompanyRelation',
    data: {
      id: app.globalData.id,
      all_graph:"是"
    },
    method: 'GET',
    dataType: 'json',
    success: function (res) {
      console.log(res)
      if (res.data.relation.date.length !== 1) {
        var option = {
          title: {
            text: ''
          },
          tooltip: {},
          // color: ['#008EFF','#FAA420'],
          animation:false,
          // addDataAnimation: false,
          animationThreshold: 9,
          animationDuration:0,
          // animationDurationUpdate: 1500,
          // animationEasingUpdate: 'quinticInOut',
          // roam: true,
          label: {
            normal: {
              show: true,
              textStyle: {
                fontSize: 12
              },
              position: 'bottom',
            }
          },
          legend: {
            x: "center",
            show: false,
            // data: ["朋友", "战友", '亲戚']
          },
          series: [

            {
              color: ['#05AAFF'],
              type: 'graph',
              layout: 'force',
              symbolSize: 20,
              top: '5px',
              focusNodeAdjacency: true,
              roam: true,
              categories: [{
                name: '朋友',
                itemStyle: {
                  normal: {
                    color: "#008EFF",
                  }
                }
              }, {
                name: '战友',
                itemStyle: {
                  normal: {
                    color: "#008EFF",
                  }
                }
              }, {
                name: '亲戚',
                itemStyle: {
                  normal: {
                    color: "#FAA420",
                  }
                }
              }],
              label: {
                normal: {
                  show: true,
                  textStyle: {
                    fontSize: 10
                  },
                }
              },
              force: {
                repulsion: 200
              },
              edgeSymbolSize: [4, 50],
              edgeLabel: {
                normal: {
                  show: true,
                  textStyle: {
                    fontSize: 8
                  },
                  formatter: "{c}"
                }
              },
              data: res.data.relation.date,
              links: res.data.relation.links,
              lineStyle: {
                normal: {
                  opacity: 0.9,
                  width: 1,
                  curveness: 0
                }
              },
              label: {
                normal: {
                  show: true,
                  textStyle: {
                    fontSize: 10,
                    color: '#888888'
                  },
                  position: 'bottom',
                }
              },
            }
          ],

        };

        chart.setOption(option);
        return chart;
      }

    },
    fail: function (res) { },
  })

}