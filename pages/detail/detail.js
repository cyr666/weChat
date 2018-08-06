import * as echarts from '../../echarts/ec-canvas/echarts';
var app = getApp();
var WIDTH = 0;
Page({
  data:{
    tabList: ['基本信息', '产业布局', '技术布局', '创新团队', '创新成果','竞品推荐'],
    tabClick:0,
    showAll: false,
    scrollLeft: 0,
    showZhezhao: false,
    colorList: ['#05AAFF', '#008EFF', '#7152E5', '#9C5BF4', '#F96060', '#FAA420', '#FFD500', '#78CD49'],
    ec: {
      onInit: initChart
    },
    ecBar: {
      onInit: drowBar
    },
    ec_relation:{
      onInit: drowRelation
    },
    industryArray:[],
    techTrend: [],
    toView:"ee",
    test: ["top1", "#E8EAEB", "有机绝缘材料; 应用", "绝缘子", "无机绝缘材料","热敏电阻和变阻器"],
    fen: 90,
    colorList: ['#05AAFF', '#008EFF', '#7152E5', '#9C5BF4', '#F96060', '#FAA420', '#FFD500', '#78CD49'],
    people: 455,
    companyDel:{}, 
    companyArray:[], 
    comId:'',
    topF_term:{},
    heagth1:'',
    heagth2: '',
    heagth3: '',
    heagth4: '',
    heagth5: '',
    name:'',
    hidden:true,
    introduction:'',
    canvasHidden:true,
    inventer: [],
    patentArray: [],
    companyRelationList:[],
    inventer_num:'',
    patent_num:'',
    showCharts: false,
    /* chart data start */
    chartDate: {
      max: 0
    },
    posArr: [],
    countArr: [],
    initValue: "",
    ft:"",
    showTab: true,
    /* chart data end */
  },
  onLoad(option){
    let obj = ""
    if (option.pathId) {
      app.globalData.id = option.pathId
      this.setData({
        comId: option.pathId
      })
    }else{
      console.log(option)
      obj = JSON.parse(option.id);
      app.globalData.id = obj.id
      this.setData({
        comId: obj.id
      })
    }
    wx.request({
      url: 'https://api.piionee.com/piionee/transfer/industry/getCompanyDetail', //仅为示例，并非真实的接口地址
      data: {
        id: this.data.comId
        // id:'54462'
      },
      method: 'GET',
      header: {
        'content-type': 'application/json',// 默认值
      },
      success: this.handlecomDel.bind(this),
      fail: function () {
        console.log("shibai")
      }
    })
    wx.request({
      url: 'https://api.piionee.com/piionee/transfer/industry/getCompanyChainAndTech', //仅为示例，并非真实的接口地址
      data: {
        id: this.data.comId
        // id: '54462'
      },
      method:'GET',
      header: {
        'content-type': 'application/json',// 默认值
      },
      success: this.handleChanData.bind(this),
      fail: function(){
        console.log("shibai")
      }
    })
    wx.request({
      url: 'https://api.piionee.com/piionee/transfer/industry/getSimilarCompany', //仅为示例，并非真实的接口地址
      data: {
        id: this.data.comId
        // id: '54462'
      },
      method: 'GET',
      header: {
        'content-type': 'application/json',// 默认值
      },
      success: this.handlesameCom.bind(this),
      fail: function () {
        console.log("shibai")
      }
    });
    wx.request({
      url: 'https://api.piionee.com/piionee/transfer/industry/getCompanyRelation', //仅为示例，并非真实的接口地址
      data: {
        id: this.data.comId
        // id: '54462'
      },
      method: 'GET',
      header: {
        'content-type': 'application/json',// 默认值
      },
      success: this.handleCompanyRelation.bind(this),
      fail: function () {
        console.log("shibai")
      }
    });
    // wx.setStorageSync('x','')
    // wx.setStorageSync('y', '')
    // wx.setStorageSync('radar_chart','');
    // wx.setStorageSync('value','');
    this.firtAjax1();
    this.firtAjax2();
  },
  handleCompanyRelation(res){
    if (res.data.status == 0){
      this.setData({
        companyRelationList: res.data.companyArray
      })
    }
  },
  goBack() {
    wx.navigateBack({
      delta: 1
    })
  },
  handlecomDel(res){
    let firstWord = res.data.name.slice(0, 1);
    res.data.firstWord = firstWord;
    if (res.data.name.length>8){
     var name = res.data.name.slice(0, 8)+"...";
     wx.setNavigationBarTitle({
       title: name,
     })
    }
    this.setData({
      companyDel: res.data,
      name: res.data.name,
      introduction: res.data.introduction
    })
    wx.setStorageSync('radar_chart', res.data.abilityObject.radar_chart.indicator);
    wx.setStorageSync('value', res.data.abilityObject.radar_chart.value);
  },
  changTab(e){
    this.setData({
      tabClick: e.currentTarget.dataset.index,
      showAll: false,
      showZhezhao: false,
      scrollLeft: 82 * e.currentTarget.dataset.index,
      toView: e.currentTarget.dataset.opt,
    })
  },
  showAllTab(){
    this.setData({
      showAll: true,
      showZhezhao: true,
    })
  },
  showBigCharts(e){
    this.setData({
      showCharts: true,
      ft: e.currentTarget.dataset.ft,
      showTab: false
    })
    this.canvas();
  },
  closeBigChart(){
    this.setData({
      showCharts: false,
      showTab: true
    })
  },
  handleChanData(res){
    this.setData({
      industryArray: res.data.industryArray,
      techTrend: res.data.techTrend,
      topF_term: res.data.topF_term,
      heagth1: Math.ceil(res.data.topF_term.top1_max_length/4)*20+10+'px',
      heagth2: Math.ceil(res.data.topF_term.top2_max_length / 4) * 20 + 10 + 'px',
      heagth3: Math.ceil(res.data.topF_term.top3_max_length / 4) * 20 + 10+ 'px',
      heagth4: Math.ceil(res.data.topF_term.top4_max_length / 4) * 20 + 10+ 'px',
      heagth5: Math.ceil(res.data.topF_term.top5_max_length / 4) * 20 + 10+ 'px',
    });
  },
  handlesameCom(res){
    if (res.data.companyArray.length>0){
      res.data.companyArray.map((val) => {
        let firstWord = val.name.slice(0, 1);
        val.firstWord = firstWord
      })
      wx: wx.setStorageSync('companyArray', res.data.companyArray)
      this.setData({
        companyArray: res.data.companyArray
      })
    }
  },
  // 点击查看更多表格
  clickMorecooper(){
    wx.navigateTo({
      url: '../cooperate/cooperate?id=' + this.data.comId,
    })
  },
  handleComteam(){
    wx.navigateTo({
      // url: '../team/team'
      url: '../team/team?id=' + this.data.comId,
    })
  },
  handleComAchievement(){
    wx.navigateTo({
      url: '../achievement/achievement?id='+this.data.comId,
    })
  },
  chickintroduction(){
    this.setData({
      hidden:false,
      canvasHidden:false,
    })
  },
  confirm(){
    this.setData({
      hidden: true,
      canvasHidden:true
    })
  },
  checkCompetitor(){
    wx.navigateTo({
      url: '../competitor/competitor'
    })
  },
  firtAjax1() {
    wx.request({
      url: 'https://api.piionee.com/piionee/transfer/industry/getInnovationPerson', //仅为示例，并非真实的接口地址
      data: {
        id: this.data.comId,
      },
      method: 'GET',
      header: {
        'content-type': 'application/json',// 默认值
      },
      success: this.handleTeamSucc.bind(this),
      fail: function () {
        console.log("shibai")
      }
    })
  },
  handleTeamSucc(res) {
    if (res.data.inventer.length > 0) {
      var i = 0;
      res.data.inventer.map((val) => {
        if (i > 7) {
          i = 0
        }
        i += 1
        let firstWord = val.name.slice(0, 1);
        val.firstWord = firstWord;
        val.i = i;
      })

      this.setData({
        inventer: res.data.inventer,
        inventer_num: res.data.all_numFound
      })
    }
  },
  firtAjax2() {
    wx.request({
      url: 'https://api.piionee.com/piionee/transfer/industry/getPatentAnalysis', //仅为示例，并非真实的接口地址
      data: {
        id: this.data.comId,
      },
      method: 'GET',
      header: {
        'content-type': 'application/json',// 默认值
      },
      success: this.handleAchievementSucc.bind(this),
      fail: function () {
        console.log("shibai")
      }
    })
  },
  handleAchievementSucc(res) {
    this.setData({
      patentArray: res.data.patentArray,
      patent_num: res.data.all_numFound
    })
    if (res.data.patentArray.length == res.data.numFound) {
      this.setData({
        refresh: false
      })
    }
  },
  // canvas start
  canvas(){
    var th = this;
    wx.getSystemInfo({ /* 获取屏幕宽度 */
      success: function (res) {

        WIDTH = res.windowWidth; /* 缓存屏幕宽 */

        wx.request({ /* 获取接口数据 */
          url: 'https://api.piionee.com/piionee/transfer/industry/getCompanyFtermBigGraph',
          data: {
            id: th.data.comId, /* 需要动态设置 */
            ft: th.data.ft /* 需要动态设置 */
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success: th.getChartDate.bind(th)
        })
      }
    })
  },
  /* chart function start */
  getChartDate(res) { /* 获取图表数据 */
    if (res.statusCode == 200) {
      //console.info(res.data.yList.slice(1));
      /* 假数据 */
      var arr = res.data.yList;
      this.data.countArr = arr; /* 专利数量数据缓存 */

      /* 请求的真数据 */
      //arr = res.data.yList.slice(1);
      //this.data.countArr = arr; /* 专利数量数据缓存 */

      this.drawChart(WIDTH, this, arr); /* 画图，WIDTH为屏幕宽度，arr为图表数据 */
    }
  },
  drawChart(width, obj, info) {/* 画图函数 */
    var time = width / 750, /* rpx与px换算 */
      canvasWidth = Math.ceil(time * 540), /* 计算canvas画布宽度 */
      canvasHeight = Math.ceil(time * 180),/* 计算canvas画布高度 */

      /* 请求的数据源 */
      arr = info,

      ctx = wx.createCanvasContext('firstCanvas');

    function kLine(arr) {
      var value = arr,
        len = value.length,
        startX = Math.ceil(time * 50),
        startX2 = Math.ceil(time * 100),
        height = canvasHeight,
        temp = 0,
        h = 0,

        max = Math.max.apply(null, value),
        min = Math.min.apply(null, value),
        //lines = 5, // 标尺，分成5行，隔4段

        setValue = {},
        posArr2 = [];

      setValue["max1"] = max; /* 修改绑定的数据 */
      setValue["max2"] = min + Math.ceil((max - min) / 3 * 2);
      setValue["max3"] = min + Math.ceil((max - min) / 3 * 1);
      setValue["max4"] = min;

      obj.setData({
        chartDate: setValue
      });

      ctx.setLineWidth(2);
      ctx.setStrokeStyle("#008eff");
      for (var i = 1; i < len; i++) {
        temp = value[i - 1];
        ctx.beginPath();
        h = height - Math.ceil((temp - min) * height / (max - min));
        ctx.moveTo(startX, h);
        h = height - Math.ceil((value[i] - min) * height / (max - min));
        ctx.lineTo(startX2, h);
        ctx.stroke();
        posArr2.push(startX); /* 保存10个点的坐标 */
        startX = startX2;
        startX2 = startX2 + Math.ceil(time * 50);
      }
      ctx.draw();
      posArr2.push(startX);
      obj.setData({
        posArr: posArr2 /* 缓存10个点的坐标 */
      });
    }
    kLine(arr);
  },
  touchStartCanvas(e) { /* 点击10个点的附件，显示对应的专利数量 */
    var th = this, //timeout = null,
      x = e.touches[0].x,
      arr = this.data.posArr,
      len = arr.length;
    if (x <= (arr[0] + 5) && x >= (arr[0] - 5)) {
      this.setData({
        initValue: "2009年专利数量 " + this.data.countArr[0]
      });
    } else if (x <= (arr[1] + 5) && x >= (arr[1] - 5)) {
      this.setData({
        initValue: "2010年专利数量 " + this.data.countArr[1]
      });
    } else if (x <= (arr[2] + 5) && x >= (arr[2] - 5)) {
      this.setData({
        initValue: "2011年专利数量 " + this.data.countArr[2]
      });
    } else if (x <= (arr[3] + 5) && x >= (arr[3] - 5)) {
      this.setData({
        initValue: "2012年专利数量 " + this.data.countArr[3]
      });
    } else if (x <= (arr[4] + 5) && x >= (arr[4] - 5)) {
      this.setData({
        initValue: "2013年专利数量 " + this.data.countArr[4]
      });
    } else if (x <= (arr[5] + 5) && x >= (arr[5] - 5)) {
      this.setData({
        initValue: "2014年专利数量 " + this.data.countArr[5]
      });
    } else if (x <= (arr[6] + 5) && x >= (arr[6] - 5)) {
      this.setData({
        initValue: "2015年专利数量 " + this.data.countArr[6]
      });
    } else if (x <= (arr[7] + 5) && x >= (arr[7] - 5)) {
      this.setData({
        initValue: "2016年专利数量 " + this.data.countArr[7]
      });
    } else if (x <= (arr[8] + 5) && x >= (arr[8] - 5)) {
      this.setData({
        initValue: "2017年专利数量 " + this.data.countArr[8]
      });
    } else if (x <= (arr[9] + 5) && x >= (arr[9] - 5)) {
      this.setData({
        initValue: "2018年专利数量 " + this.data.countArr[9]
      });
    }
    /* 每隔2秒清除提示信息，可选 */
    /*timeout = setTimeout(function(){
        th.setData({
            initValue: ""
        });
        clearTimeout(timeout);
        timeout = null;
    }, 2000);*/
  },
  /* chart function end */
  // 点击表格里面的机构 公司
  gocomDel(e){
    const obj = JSON.stringify({ id: e.currentTarget.dataset.id, name: e.currentTarget.dataset.name })
    wx.navigateTo({
      url: '../detail/detail?id=' + obj,
    })
  },
  getAbstract(e) {
    const obj = JSON.stringify({
      title: e.currentTarget.dataset.title,
      code: e.currentTarget.dataset.code,
      abstracts: e.currentTarget.dataset.abstract,
    })
    wx.navigateTo({
      url: '../abstract/abstract?obj=' + obj,
      success: this.handleAbstract.bind(this)
    })
  },
  handleAbstract(res) {
    // console.log(res)
  },
  onShareAppMessage() {
    var path = '/pages/detail/detail?pathId=' + app.globalData.id ;
    return {
      title: '做最专业的技术调查工具',
      path: path
    }
  },
  // 点击查看合作网络
  checkMoreNet(){
    wx.navigateTo({
      url: '../moreNet/moreNet?id=' + this.data.comId,
    })
  }
})
function initChart(canvas, width, height) {
  var chart = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  canvas.setChart(chart);
  wx.request({
    url: 'https://api.piionee.com/piionee/transfer/industry/getCompanyDetail', //仅为示例，并非真实的接口地址
    data: {
      // id: obj.id
      id: app.globalData.id
    },
    method: 'GET',
    header: {
      'content-type': 'application/json',// 默认值
    },
    success: (res)=>{
      var option = {
        backgroundColor: "#ffffff",
        color: ["#37A2DA", "#FF9F7F"],
        tooltip: {},
        xAxis: {
          show: false
        },
        yAxis: {
          show: false
        },
        radar: {
          shape: 'circle',
          indicator: res.data.abilityObject.radar_chart.indicator,
          name: {
            formatter: (value) => {
              if (value == "技术创新活跃度" || value == "技术合作能力") {
                value = value.replace(/\S{4}/g, function (match) {
                  return match + '\n'
                })
                return value
              } else {
                return value
              }
            },
            textStyle: {
              fontSize: 12,
              color: '#888888',
              lineHeight: 14,
            }
          }
        },

        series: [{
          name: '预算 vs 开销',
          type: 'radar',
          itemStyle: {
            normal: {
              areaStyle: {
                color: "#008EFF"
              }
            }
          },
          data: [{
            value: res.data.abilityObject.radar_chart.value,
            name: '预算'
          },
          ]
        }]
      };
      chart.setOption(option);
      return chart;
    },
    fail: function () {
      console.log("shibai")
    }
  })
  

  
}
var chart = null;
function drowBar(canvas, width, height) {
  chart = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  canvas.setChart(chart);
  wx.request({
    url: 'https://api.piionee.com/piionee/transfer/industry/getCompanyChainAndTech', //仅为示例，并非真实的接口地址
    data: {
      id: app.globalData.id
      // id: '54462'
    },
    method: 'GET',
    header: {
      'content-type': 'application/json',// 默认值
    },
    success: (res)=>{
      let x = res.data.patentTrend.x;
      let y = res.data.patentTrend.y;
      let arr = Array.from(res.data.patentTrend.y);
      arr.sort((a, b) => {
        return b - a
      })
      wx.setStorageSync('max', arr[0]);
      var option = {
        color: ['#008EFF'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        // legend: {
        //   data: ['热度', '正面']
        // },
        grid: {
          left: 20,
          right: 20,
          bottom: 15,
          top: 5,
          containLabel: true
        },
        yAxis: [
          {
            type: 'value',
            min: 0,
            max: Math.ceil(arr[0] * 1.1),
            interval: Math.ceil((wx.getStorageSync('max') * 1.1) / 5),
            axisLabel: {
              textStyle: {
                color: '#A7AFB6'
              },
              formatter: '{value}'
            },
            axisTick: {
              show: false,
            },
            axisLine: {    // 轴线
              show: false,
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: '#EAEDF1',
              }
            }
          }
        ],
        xAxis: [
          {
            type: 'category',
            axisTick: { show: false },
            data: x,
            axisTick: {
              show: false,
            },
            axisLabel: {
              textStyle: {
                color: '#A7AFB6'
              }
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: '#EAEDF1',
              }
            },
          }
        ],
        series: [
          {
            name: '热度',
            type: 'bar',
            barWidth: "30%",
            center: ['30%', '50%'],
            label: {
              normal: {
                show: false,
                // position: 'inside'
              }
            },
            data: y,
            itemStyle: {
              // emphasis: {
              //   color: '#37a2da'
              // }
            }
          },
        ]
      };
      chart.setOption(option);
      return chart;
    },
    fail: function () {
      console.log("shibai")
    }
  })
  
}
function drowRelation(canvas, width, height) {
  const chart = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  canvas.setChart(chart);
  wx.request({
    url: 'https://api.piionee.com/piionee/transfer/industry/getCompanyRelation',
    data: {
      id: app.globalData.id
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
          animation: false,
          // addDataAnimation: false,
          animationThreshold: 9,
          animationDuration: 0,
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
                repulsion: 100
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