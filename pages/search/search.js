Page({
  data:{
    wordList:[],
    companyArray: [],
    searchQuery: "企业",
  },
  onLoad(){
    wx.request({
      url: 'https://api.piionee.com/piionee/transfer/industry/getHotWord', //仅为示例，并非真实的接口地址
      data: {},
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: this.handleGetHotWordSucc.bind(this)
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
  goComDel(e) {
    const obj = JSON.stringify({ id: e.currentTarget.dataset.id, name: e.currentTarget.dataset.name })
    wx.navigateTo({
      url: '../detail/detail?id=' + obj,
    })
  },
  handleSearch() {
    wx.navigateTo({
      url: '../index/index?query=' + this.data.searchQuery,
    })
  },
  getComInput(e) {
    this.setData({
      searchQuery: e.detail.value,
    })
    wx.request({
      url: 'https://api.piionee.com/piionee/transfer/industry/getDropDownMenu', //仅为示例，并非真实的接口地址
      data: {
        query: e.detail.value
      },
      method: 'GET',
      header: {
        'content-type': 'application/json',// 默认值
      },
      success: this.handleSearchSucc.bind(this),
      fail: function () {
        console.log("shibai")
      }
    })
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
  handleSearch(){
    console.log(this.data.searchQuery)
    wx.navigateTo({
      url: '../index/index?query=' + this.data.searchQuery,
    })
  },
  onShareAppMessage() {
    return {
      title: '做最专业的技术调查工具',
    }
  }
})