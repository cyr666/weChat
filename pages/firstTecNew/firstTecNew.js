var app = getApp();
Page({
  data:{
    showAll: true,
    newsList:[],
    rows:10,
    refresh: true,
    newId:'',
  },
  onLoad(){
    getApp().editTabBar();
    this.sendAjaxAll();
  },
  // 发送请求 (全部 关注) start
  sendAjaxAll(){
    wx.request({
      url: app.globalData.serverUrl +'piionee/industry/smallApp/newsList',
      data:{
        user_id: app.globalData.user_id,
        type: 0,
        rows: this.data.rows 
      },
      success: this.handleFirstTecNew.bind(this)
    })
  },
  sendfollowAjax(){
    wx.request({
      url: app.globalData.serverUrl + 'piionee/industry/smallApp/newsList',
      data: {
        user_id: app.globalData.user_id,
        type: 1,
        rows: this.data.rows
      },
      success: this.handleFirstTecNew.bind(this)
    })
  },
  handleFirstTecNew(res){
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
  goAchievementDel(e) {
    let id = e.currentTarget.dataset.id;
    let tech = e.currentTarget.dataset.tech;
    wx.navigateTo({
      url: '../newsDel/newsDel?id=' + id + '&tech=' + tech,
    })
  },
  handleClickSkill(e) {
    let tech = e.currentTarget.dataset.tech;
    wx.navigateTo({
      url: '../skill/skill?&tech=' + tech,
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
    if (this.data.showAll) {
      this.sendAjaxAll();
    } else {
      this.sendfollowAjax();
    }
  },
  handleFollow(e) {
    if (!app.globalData.is_user) {
      if (e.detail.userInfo) {
        app.globalData.avatarUrl = e.detail.userInfo.avatarUrl
        app.globalData.nickName = e.detail.userInfo.nickName
      }
      this.handleNewUserLogin()
    }else{
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
  /*下拉加载*/
  onReachBottom() {
    wx.showLoading({
      title: '玩命加载中',
    })
    this.setData({
      rows: this.data.rows + 10
    })
    if (this.data.showAll) {
      this.sendAjaxAll();
    } else {
      this.sendFollowAjax();
    }
  },
})