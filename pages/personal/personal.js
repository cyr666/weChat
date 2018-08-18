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
          wx.setStorageSync('newsPublicArray', JSON.stringify(res.data.focus.newsPublicArray))
          wx.setStorageSync('patPublicArray', JSON.stringify(res.data.focus.patPublicArray))
        }
      }
    })
  },
    // 触发用户登录授权 start
  handleLogin(e){
    let that = this;
    console.log(e)
    wx.login({
      success: function (res) {
        // console.log(res)
        app.globalData.code = res.code
        wx.getUserInfo({
          withCredentials: true,
          lang: '',
          success: function(res) {
            app.globalData.nickName = res.userInfo.nickName;
            app.globalData.avatarUrl = res.userInfo.avatarUrl;
            wx.request({
              url: app.globalData.serverUrl + 'piionee/industry/smallApp/beforeSign',
              data: {
                code: app.globalData.code,
              },
              success:(res)=>{
                if(res.data.status == 0){
                  app.globalData.openid = res.data.openId;
                  if (!res.data.is_user){
                    wx.request({
                      url: app.globalData.serverUrl + 'piionee/industry/smallApp/sign',
                      data:{
                        account: app.globalData.openid,
                        nickName: app.globalData.nickName,
                        cover: app.globalData.avatarUrl
                      },
                      success:(res)=>{
                        if(res.data.status == 0){
                          if (res.data.is_success){
                            app.globalData.is_user = res.data.is_user;
                            app.globalData.user_id = res.data.user_id;
                            that.setData({
                              avatarUrl: app.globalData.avatarUrl,
                              nickName: app.globalData.nickName
                            })
                          }
                        }
                      }
                    })
                  }
                }
              }
            })
          },
          fail: function(res) {console.log(res)},
          complete: function(res) {},
        })
        
      }
    });
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