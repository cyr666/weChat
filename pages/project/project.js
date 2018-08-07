var app = getApp();
Page({
  data:{
    rows: 10,
    patList: [],
    refresh: true,
    isFollow: true,
    showAll: true
  },
  onLoad(){
    getApp().editTabBar(); 
    this.sendAjax();
  },
// 获取列表数据的接口 start
  sendAjax() {
    wx.request({
      url: app.globalData.serverUrl +'piionee/transfer/industry/getAchievementList', //仅为示例，并非真实的接口地址
      data: {
        rows: this.data.rows
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: this.handleSchoolInfo.bind(this)
    })
  },
  handleSchoolInfo(res) {
    if (res.data.status == 0) {
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
  onReachBottom() {
    wx.showLoading({
      title: '玩命加载中',
    })
    this.setData({
      rows: this.data.rows + 10
    })
    this.sendAjax();
  },
  // 获取列表数据的接口 end

  // 触发用户登录授权 start
  handleLogin(e){
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
  },
  handleFollow(e){
    if(!app.globalData.is_user){
      if (e.detail.userInfo) {
        app.globalData.avatarUrl = e.detail.userInfo.avatarUrl
        app.globalData.nickName = e.detail.userInfo.nickName
      }
      this.handleNewUserLogin()
    }
  },
  // 触发用户登录授权 end
  // 新用户登录 start
    handleNewUserLogin(){
      console.log(app.globalData.openid)
      wx.request({
        url: app.globalData.serverUrl + 'piionee/industry/smallApp/sign',
        data:{
          account: app.globalData.openid,
          nickName: app.globalData.nickName,
          cover: app.globalData.avatarUrl
        },
        success:(res)=>{
          console.log(res)
        }
      })
    }
})