Page({

  /**
   * 页面的初始数据
   */
  data: {
    colorList: ['#05AAFF', '#008EFF', '#7152E5', '#9C5BF4', '#F96060', '#FAA420', '#FFD500', '#78CD49'],
    companyArray:[],
    fen:'90'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.companyArray){
      const sharecompanyArray = JSON.parse(options.companyArray);
      this.setData({
        companyArray: sharecompanyArray
      })
    }else{
      let companyArray = wx.getStorageSync('companyArray')
      this.setData({
        companyArray: companyArray
      })
    }
  },
  goBack() {
    wx.navigateBack({
      delta: 1
    })
  },
  handleComDel(e) {
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
    let companyArray = JSON.stringify(wx.getStorageSync('companyArray'));
    var path = '/pages/competitor/competitor?companyArray=' + companyArray;
    return {
      title: '做最专业的技术调查工具',
      path: path
    }
  }
})