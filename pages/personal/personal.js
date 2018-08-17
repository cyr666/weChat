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
    this.sendAjax()
  },
  // 获取接口数据
  sendAjax(){
    wx.request({
      url: app.globalData.serverUrl +'piionee/industry/smallApp/personal',
      data:{
        user_id: app.globalData.user_id
      },
      success:(res)=>{
        if(res.data.status == 0){
          wx.setStorageSync('collectArr', JSON.stringify(res.data.collected))
          wx.setStorageSync('focusArr', JSON.stringify(res.data.focus))
        }
      }
    })
  },
    // 触发用户登录授权 start
  handleLogin(e){
    let that = this;
    wx.login({
      success: function (res) {
        wx.request({
          url: 'https://api.weixin.qq.com/sns/jscode2session?',
          data: {
            appid: 'wx25cf560a19772537',
            secret: '5c55c83aa224fe0facef793bb8916134',
            js_code: res.code,
            grant_type: 'authorization_code'
          },
          success: (res) => {
            app.globalData.openid = res.data.openid
            wx.request({
              url: app.globalData.serverUrl + 'piionee/industry/smallApp/beforeSign',
              data: {
                account: res.data.openid,
              },
              success: (res) => {
                // app.globalData.is_user = res.data.is_user;
                console.log(res)
                if (!res.data.is_user){
                  wx.request({
                    url: app.globalData.serverUrl + 'piionee/industry/smallApp/sign',
                    data:{
                      account: app.globalData.openid,
                      nickName: e.detail.userInfo.nickName,
                      cover: e.detail.userInfo.avatarUrl
                    },
                    success:(res)=>{
                      console.log(res)
                      if (res.data.is_success){
                        app.globalData.is_user=true,
                        app.globalData.user_id = res.data.user_id
                        app.globalData.avatarUrl = e.detail.userInfo.avatarUrl
                        app.globalData.nickName = e.detail.userInfo.nickName
                        that.setData({
                          avatarUrl: app.globalData.avatarUrl,
                          nickName: app.globalData.nickName
                        })
                      }
                    }
                  })
                }
              }
            })
          }
        })
      }
    });
    this.setData({
      hidden: true
    })
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