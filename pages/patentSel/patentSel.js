var WxParse = require('../wxParse/wxParse.js');
var app = getApp();
Page({
  data: {
    schoolId:"",
    schoolLogo:"",
    name:"",
    date:"",
    college: {
      content: "本期公布公告的84项专利，共涉及29个院系，排名如下："
    },
    investor: {
      content: "本期公布公告的84项专利，其发明人团队排名如下："
    },
    subTitles:[],
    
  },
  onLoad(option) {
    console.log(option)
    this.setData({
      schoolId: option.id
    })
    app.globalData.schoolId = option.id
    wx.request({  /* 获取专利精选信息 */
      url: 'https://api.piionee.com/piionee/transfer/industry/getAchievementDetail',
      data: {
        "id": this.data.schoolId, 
        "type": "专利"
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: this.getIPSelectInfo.bind(this)
    })
  },
  getIPSelectInfo(res) {
    if (res.statusCode == 200) {
      console.log(res)
      let that = this;
      let subTitle = res.data.subTitles[0].content;
      WxParse.wxParse('subTitle', 'html', subTitle, that, 5)
      this.setData({
        schoolLogo: res.data.public.logo,
        name: res.data.public.name,
        date: res.data.date,
        subTitles: res.data.subTitles
      })
    }
  },
  onShareAppMessage() {
    return {
      title: '做最专业的技术调查工具',
    }
  }
})