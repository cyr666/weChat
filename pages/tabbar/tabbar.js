var app = getApp()
Page({
  data:{
    isIphoneX: false
  },
  onLoad(){
    console.log("tab")
    this.setData({
      isIphoneX: app.globalData.isIphoneX
    })
  }
})