var app = getApp();
Page({
  data: {
    companyArray: [],
    institutionArray: [],
    colorList: ['#05AAFF', '#008EFF', '#7152E5', '#9C5BF4', '#F96060', '#FAA420', '#FFD500', '#78CD49', '#05AAFF', '#008EFF'],
    tech:''
  },
  onLoad(options) {
    app.globalData.tech = options.tech;
    this.setData({
      tech: options.tech,
    })
    this.getoneTechRelated()
  },
  getoneTechRelated() {
    wx.request({
      url: app.globalData.serverUrl + 'piionee/industry/smallApp/oneTechRelated', //仅为示例，并非真实的接口地址
      data: {
        tech: '水利工程' //this.data.news_id
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: this.handleGetoneTechRelated.bind(this)
    })
  },
  handleGetoneTechRelated(res) {
    console.log(res)
    var i = 0;
    res.data.institutionArray.forEach((val) => {
      let firstWord = val.name.slice(0, 1);
      val.firstWord = firstWord;
      val.i = i++ % 8;
    })
    if (res.data.status == 0) {
      this.setData({
        institutionArray: res.data.institutionArray
      })
    }
  },
})