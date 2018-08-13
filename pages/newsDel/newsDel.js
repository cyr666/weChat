// pages/achievementDel/achievementDel.js
var WxParse = require('../wxParse/wxParse.js');
var app = getApp();
Page({
  data: {
    logo: '',
    title: "",
    subTitles: [],
    date: "",
    news_id: "",
    pageView: "",
    name: '',
    companyArray:[],
    institutionArray:[],
    colorList: ['#05AAFF', '#008EFF', '#7152E5', '#9C5BF4', '#F96060', '#FAA420', '#FFD500', '#78CD49', '#05AAFF', '#008EFF'],
  },
  onLoad: function (options) {
    console.log(options)
    app.globalData.news_id = options.id;
    app.globalData.tech = options.tech;
    this.setData({
      news_id: options.id
    })
    wx.request({
      url: app.globalData.serverUrl + 'piionee/industry/smallApp/newsDetail', //仅为示例，并非真实的接口地址
      data: {
        id: 44033 //this.data.news_id
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: this.handleGetachievementSucc.bind(this)
    });
    this.getoneTechRelated()
  },
  handleGetachievementSucc(res) {
    if (res.data.status == 0) {
      console.log(res)
      let that = this;
      WxParse.wxParse('subTitle', 'html', res.data.content, that, 5)
      that.setData({
        logo: res.data.public_logo,
        title: res.data.title,
        date: res.data.date,
        pageView: res.data.pageView,
        name: res.data.public_name
      })
    } else {

    }
  },
  getoneTechRelated(){
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
  handleGetoneTechRelated(res){
    console.log(res)
    res.data.companyArray.forEach((val)=>{
      let firstWord = val.name.slice(0, 1);
      val.firstWord = firstWord;
    })
    if (res.data.companyArray.length>2){
      res.data.companyArray.length = 2
    }
    if(res.data.status == 0){
      this.setData({
        companyArray: res.data.companyArray,
        institutionArray: res.data.institutionArray
      })
    }
  },
  handleCompantDel(e) {
    const obj = JSON.stringify({ id: e.currentTarget.dataset.index, name: e.currentTarget.dataset.name })
    wx.navigateTo({
      url: '../detail/detail?id=' + obj,
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var path = '/pages/newsDel/newsDel?id=' + app.globalData.news_id + '&tech=' + app.globalData.tech;
    return {
      title: '做最专业的技术调查工具',
      path: path
    }
  }
})