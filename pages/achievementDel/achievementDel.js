// pages/achievementDel/achievementDel.js
var WxParse = require('../wxParse/wxParse.js');
var app = getApp();
Page({
  data: {
    public:{},
    title: "",
    subTitles:[],
    date:"",
    schoolId:"",
    pageView:"",
  },
  onLoad: function (options) {
    app.globalData.schoolId = options.id
    this.setData({
      schoolId: options.id
    }) 
    wx.request({
      url: 'https://api.piionee.com/piionee/transfer/industry/getAchievementDetail', //仅为示例，并非真实的接口地址
      data: {
        id: this.data.schoolId
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: this.handleGetachievementSucc.bind(this)
    })
  },
  handleGetachievementSucc(res){
    if (res.data.status==0){
      let that = this;
      let subTitle = Array.from(res.data.subTitles);
      subTitle.forEach((val, ind) => {
        WxParse.wxParse('subTitle' + ind, 'html', val.content, that, 5)
      })

      that.setData({
        public: res.data.public,
        title: res.data.title,
        subTitles: res.data.subTitles,
        date: res.data.date,
        pageView: res.data.pageView
      })
    }else{

    }
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
    var path = '/pages/achievementDel/achievementDel?id=' + app.globalData.schoolId;
    return {
      title: '做最专业的技术调查工具',
      path: path
    }
  }
})