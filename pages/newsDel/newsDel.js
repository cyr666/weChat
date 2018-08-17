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
    focus: true,
    tech:'',
    public_id:'',
    hidden: true,
    nocancel: false,
    newsName:''
  },
  onLoad: function (options) {
    console.log(options)
    let btnFocus = true;
    app.globalData.news_id = options.id;
    app.globalData.tech = options.tech;
    if (options.focus=='true'){
      btnFocus = true
    }else{
      btnFocus = false;
    }
    this.setData({
      news_id: options.id,
      focus: btnFocus,
      tech: options.tech,
      newsName: options.name
    })
    wx.request({
      url: app.globalData.serverUrl + 'piionee/industry/smallApp/newsDetail', //仅为示例，并非真实的接口地址
      data: {
        id: this.data.news_id,
        user_id: app.globalData.user_id
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: this.handleGetachievementSucc.bind(this)
    });
    this.getoneTechRelated();
    this.handleChangeRead()
  },
  handleGetachievementSucc(res) {
    if (res.data.status == 0) {
      console.log(res)
      let that = this;
      that.setData({
        logo: res.data.public_logo,
        title: res.data.title,
        date: res.data.date,
        pageView: res.data.pageView,
        name: res.data.public_name,
        public_id: res.data.public_id
      })
      if (res.data.content){
        WxParse.wxParse('subTitle', 'html', res.data.content, that, 5)
      }else{
      }
      
    } else {

    }
  },
  getoneTechRelated(){
    wx.request({
      url: app.globalData.serverUrl + 'piionee/industry/smallApp/oneTechRelated', //仅为示例，并非真实的接口地址
      data: {
        tech: this.data.tech
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
    res.data.institutionArray.forEach((val) => {
      let firstWord = val.name.slice(0, 1);
      val.firstWord = firstWord;
    })
    if (res.data.companyArray.length>2){
      res.data.companyArray.length = 2
    }
    if (res.data.institutionArray.length > 2) {
      res.data.institutionArray.length = 2
    }
    if(res.data.status == 0){
      this.setData({
        companyArray: res.data.companyArray,
        institutionArray: res.data.institutionArray
      })
    }
  },
  // 改变我的关注里面读与未读的状态
  handleChangeRead(){
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1]; // 当前页面
    var prevPage = pages[pages.length - 3]; // 上一级页面
    if (prevPage.data.newsPublicArray){
      let arr = prevPage.data.newsPublicArray;
      arr.forEach((val,i)=>{
        if(val.name==this.data.newsName){
          val.article.read=true
        }
      })
     prevPage.setData({
       newsPublicArray:arr
     })
      console.log(prevPage.data.newsPublicArray)
    }
  },
  // 触发用户登录授权 start
  handleLogin(e) {
    if (!app.globalData.is_user) {
      if (e.detail.userInfo) {
        app.globalData.avatarUrl = e.detail.userInfo.avatarUrl
        app.globalData.nickName = e.detail.userInfo.nickName
      }
      this.handleNewUserLogin()
    }
    // app.handleLogin();
    this.setData({
      showAll: !this.data.showAll
    })
    // this.sendAjaxAll();
  },
  handleFollow(e) {
    if (!app.globalData.is_user) {
      this.setData({
        hidden: false
      })
    } else {
      let index = e.currentTarget.dataset.index
      this.setData({
        public_id: e.currentTarget.dataset.id,
      })
      this.followAjax(index);
    }
  },
  confirm() {
    this.setData({
      hidden: true
    })
    wx.navigateTo({
      url: '../personal/personal',
    })
  },
  cancel() {
    this.setData({
      hidden: true
    })
  },
  /*处理用户关注start */
  followAjax(index) {
    wx.request({
      url: app.globalData.serverUrl + 'piionee/industry/smallApp/addFocus',
      data: {
        user_id: app.globalData.user_id,
        id: this.data.public_id,
        type: 2
      },
      success: (res) => {
        console.log(res)
        if (res.data.is_success) {
          this.setData({
            focus: true
          })
        }
      }
    })
  },
  /*处理用户关注end */
  /*取消关注*/
  handleDeleteFollow(e) {
    let index = e.currentTarget.dataset.index
    wx.request({
      url: app.globalData.serverUrl + 'piionee/industry/smallApp/deleteFocus',
      data: {
        id: e.currentTarget.dataset.id,
        user_id: app.globalData.user_id,
        type: 2
      },
      success: (res) => {
        if (res.data.is_success) {
          this.setData({
            focus: false
          })
        }
      }
    })
  },

  // 触发用户登录授权 end
  // 新用户登录 start
  handleNewUserLogin() {
    console.log(app.globalData.openid)
    wx.request({
      url: app.globalData.serverUrl + 'piionee/industry/smallApp/sign',
      data: {
        account: app.globalData.openid,
        nickName: app.globalData.nickName,
        cover: app.globalData.avatarUrl
      },
      success: (res) => {
        console.log(res)
      }
    })
  },
  // 点击查看更多相关公司相关企业
  clickMoreSameCom() {
    wx.navigateTo({
      url: '../sameCom/sameCom?tech=' + app.globalData.tech,
    })
  },
  clickMoreSameIns() {
    wx.navigateTo({
      url: '../sameInstitution/sameInstitution' + app.globalData.tech,
    })
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