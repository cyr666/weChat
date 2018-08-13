var app = getApp();
Page({
  data: {
    companyArray: [],
    institutionArray: [],
    colorList: ['#05AAFF', '#008EFF', '#7152E5', '#9C5BF4', '#F96060', '#FAA420', '#FFD500', '#78CD49', '#05AAFF', '#008EFF'],
  },
  onLoad(options){
    app.globalData.news_id = options.id;
    app.globalData.tech = options.tech;
    this.setData({
      news_id: options.id
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
    res.data.companyArray.forEach((val) => {
      let firstWord = val.name.slice(0, 1);
      val.firstWord = firstWord;
    })
    if (res.data.companyArray.length > 2) {
      res.data.companyArray.length = 2
    }
    if (res.data.status == 0) {
      this.setData({
        companyArray: res.data.companyArray,
        institutionArray: res.data.institutionArray
      })
    }
  },
  clickMoreSameCom(){
    wx.navigateTo({
      url: '../sameCom/sameCom',
    })
  },
  clickMoreSameIns(){
    wx.navigateTo({
      url: '../sameInstitution/sameInstitution',
    })
  },
  handleCompantDel(e) {
    const obj = JSON.stringify({ id: e.currentTarget.dataset.index, name: e.currentTarget.dataset.name })
    wx.navigateTo({
      url: '../detail/detail?id=' + obj,
    })
  },
})