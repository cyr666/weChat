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
    newsList:[],
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
    this.sendAjaxAll();
  },
  // 发送请求 (全部 关注) start
  sendAjaxAll() {
    wx.request({
      url: app.globalData.serverUrl + 'piionee/industry/smallApp/newsList',
      data: {
        user_id: app.globalData.user_id,
        type: 0,
        rows: this.data.rows
      },
      success: this.handleFirstTecNew.bind(this)
    })
  },
  handleFirstTecNew(res) {
    console.log(res)
    if (res.data.status == 0) {
      this.setData({
        newsList: res.data.newsList,
      })
    }
    if (res.data.newsList.length == res.data.numFound) {
      this.setData({
        refresh: false
      })
    }
    wx.hideLoading();
  },
  // 发送请求 (全部 关注) end
  handleGetHotWordSucc(res) {
    if (res.statusCode == 200) {
      this.setData({
        // name_focus:true,
        wordList: res.data.wordList
      })
    }
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
    let id = e.currentTarget.dataset.id;
    console.log(e.currentTarget.dataset.type)
    if (e.currentTarget.dataset.type=="成果发布"){
      wx.navigateTo({
        url: '../achievementDel/achievementDel?id='+id,
      })
    } else if (e.currentTarget.dataset.type == "专利精选"){
      wx.navigateTo({
        url: '../patentSel/patentSel?id=' + id,
      })
    }else{
      wx.navigateTo({
        url: '../recommendAch/recommendAch?id=' + id,
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
    this.sendAjaxAll()
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
    this.sendAjaxAll();
  },
  handleFollow(e) {
    if (!app.globalData.is_user) {
      if (e.detail.userInfo) {
        app.globalData.avatarUrl = e.detail.userInfo.avatarUrl
        app.globalData.nickName = e.detail.userInfo.nickName
      }
      this.handleNewUserLogin()
    } else {
      let index = e.currentTarget.dataset.index
      this.setData({
        newId: e.currentTarget.dataset.id,
      })
      this.followAjax(index);
    }
  },
  /*处理用户关注start */
  followAjax(index) {
    wx.request({
      url: app.globalData.serverUrl + 'piionee/industry/smallApp/addFocus',
      data: {
        user_id: app.globalData.user_id,
        id: this.data.newId,
        type: 2
      },
      success: (res) => {
        console.log(res)
        if (res.data.is_success) {
          let changeNewlist = this.data.newsList;
          changeNewlist[index].focus = true;
          console.log(changeNewlist)
          this.setData({
            newsList: changeNewlist
          })
        }
      }
    })
  },
  /*处理用户关注end */


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
})