var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    text:"",
    isText: false,
    hidden: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },
  bindTextAreaBlur(e){
    this.setData({
      text: e.detail.value
    })
    if(this.data.text){
      this.setData({
        isText:true
      })
    }else{
      this.setData({
        isText: false
      })
    }
  },
  // 提交意见
  handleSubmit(){
    wx.request({
      url: app.globalData.serverUrl + 'piionee/industry/smallApp/suggestion',
      data:{
        user_id: app.globalData.user_id,
        text: this.data.text
      },
      success:(res)=>{
        if(res.data.is_success){
          this.setData({
            hidden: true
          })
        }
        setTimeout(()=>{
          this.setData({
            hidden: false
          })
        },2000)
      }
    })
  },
  confirm(){
    this.setData({
      hidden: true
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
    
  }
})