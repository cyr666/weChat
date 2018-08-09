var app = getApp();
Page({
  data:{
    hidden: true,
    avatarUrl:'../../resource/darkLogo.png',
    nickName:''
  },
  onLoad() {
    let that = this;
    getApp().editTabBar();
    console.log(app.globalData.avatarUrl)
    if (app.globalData.avatarUrl && app.globalData.nickName){
      that.setData({
        avatarUrl: app.globalData.avatarUrl,
        nickName: app.globalData.nickName
      })
    }
    // else{
    //   that.setData({
    //     hidden: false
    //   })
    // }
    console.log(this.data.avatarUrl)
  },
    // 触发用户登录授权 start
  handleLogin(e){
    this.setData({
      hidden: true
    })
    // console.log(e.detail.errMsg)
    // console.log(e.detail.userInfo)
    // console.log(e.detail.rawData)
    if (e.detail.userInfo){
      app.globalData.avatarUrl = e.detail.userInfo.avatarUrl
      app.globalData.nickName = e.detail.userInfo.nickName
      this.setData({
        avatarUrl: app.globalData.avatarUrl,
        nickName: app.globalData.nickName
      })
    }
    // app.handleLogin();
  },
  // 触发用户登录授权 end 
  // 点击进入我的收藏
  myCollect(){
    wx.navigateTo({
      url: '../collect/collect',
    })
  },
  // 点击进入我的关注
  myFollow(){
    wx.navigateTo({
      url: '../myFollow/myFollow',
    })
  },
  // 点击进入关于我们
  aboutus(){
    wx.navigateTo({
      url: '../aboutus/aboutus',
    })
  },
  // 点击进入科创时代功能介绍
  creation(){
    wx.navigateTo({
      url: '../creation/creation',
    })
  },
  suggest(){
    wx.navigateTo({
      url: '../suggest/suggest',
    })
  },
  shareXcx(){
    wx.navigateTo({
      url: '../shareXcx/shareXcx',
    })
  }
})