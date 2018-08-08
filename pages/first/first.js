var app = getApp();
Page({
  data: {
    bannerData: {
      bg: "../../resource/bg.png",
      logo: "../../resource/LOGO@2x.png",
      searchBtn: "../../resource/search.png"
    },
    hotWord: ["奇虎", "腾讯", "百度", "阿里巴巴", "联想", "新东方", "猫眼"],
    wordList:[],
    rows: 10,
    patList:[],
    refresh:true,
    refreshload: false,
    isFollow: true,
    //Query:'',
    //companyArray:[],
    //delQuery:'',
    showChangeCss: false,
    showSearchInput: true,
    classStyle: ''
    //reg: ''
  },
  onLoad() {
    getApp().editTabBar(); 
    console.log(app.globalData.serverUrl)
    this.setData({
      classStyle: wx.getStorageSync('classStyle')
    });
    console.log(this.data.classStyle)
    wx.request({
      url: app.globalData.serverUrl+'piionee/transfer/industry/getHotWord', //仅为示例，并非真实的接口地址
      data: {},
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: this.handleGetHotWordSucc.bind(this)
    });
    this.sendAjax();
  },
  sendAjax(){
    wx.request({
      url: app.globalData.serverUrl+'piionee/transfer/industry/getAchievementList', //仅为示例，并非真实的接口地址
      data: {
        rows: this.data.rows
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: this.handleSchoolInfo.bind(this)
    })
  },
  handleGetHotWordSucc(res) {
    if (res.statusCode == 200) {
      this.setData({
        // name_focus:true,
        wordList: res.data.wordList
      })
    }
  },
  handleSchoolInfo(res){
    console.log(res);
    if(res.data.status == 0){
      this.setData({
        patList: res.data.patList
      })
    }
    if (res.data.patList.length == res.data.numFound) {
      this.setData({
        refresh: false
      })
    }
    wx.hideLoading();
  },
  handleSearchSucc(res) {
    let that = this;
    if (res.statusCode == 200) {
      if (res.data.companyArray.length > 0) {
        that.setData({
          companyArray: res.data.companyArray
        })
      } else {
        that.setData({
          companyArray: []
        })
      }
    }
  },
  goComDel(e) {
    const obj = JSON.stringify({ id: e.currentTarget.dataset.id, name: e.currentTarget.dataset.name })
    wx.navigateTo({
      url: '../detail/detail?id=' + obj,
    })
  },
  focus() {
    wx.navigateTo({
      url: '../search/search',
    })
  },
  onPageScroll(e) {
    if (e.scrollTop > 0) {
      this.setData({
        showChangeCss: true,
        showSearchInput: false
      })
      
    } else {
      this.setData({
        showChangeCss: false,
        showSearchInput: true
      })
    }
  },
  onShareAppMessage() {
    return {
      title: '做最专业的技术调查工具',
    }
  },
  goAchievementDel(e){
    let id = e.currentTarget.dataset.id
    if (e.currentTarget.dataset.type=="成果发布"){
      wx.navigateTo({
        url: '../achievementDel/achievementDel?id='+id,
      })
    }else{
      wx.navigateTo({
        url: '../patentSel/patentSel?id=' + id,
      })
    }
  },
  onReachBottom() {
    wx.showLoading({
      title: '玩命加载中',
    })
    this.setData({
      rows: this.data.rows + 10
    })
    this.sendAjax()
  },
  onPullDownRefresh(){
    wx.stopPullDownRefresh();
    if (this.data.refreshload) {
      return
    }
    this.setData({
      refreshload: true
    })
  },
  handleFollow(e) {
    console.log(e)
    // if (!app.globalData.is_user) {
    //   if (e.detail.userInfo) {
    //     app.globalData.avatarUrl = e.detail.userInfo.avatarUrl
    //     app.globalData.nickName = e.detail.userInfo.nickName
    //   }
    //   this.handleNewUserLogin()
    // }
  },
})