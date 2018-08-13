var app = getApp();
Page({
  data:{
    wordList:[],
    companyArray: [],
    searchQuery: "企业",
    historySearch:[],
  },
  onLoad(){
    this.sendAjax();
    wx.request({
      url: app.globalData.serverUrl +'piionee/transfer/industry/getHotWord', //仅为示例，并非真实的接口地址
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
  sendAjax(){
    wx.request({
      url: app.globalData.serverUrl +'piionee/industry/getHistory',
      data:{
        user_id: app.globalData.user_id
      },
      success:(res)=>{
        if(res.data.status==0){
          this.setData({
            historySearch: res.data.history
          })
        }
      }
    })
  },
  goComDel(e) {
    const obj = JSON.stringify({ id: e.currentTarget.dataset.id, name: e.currentTarget.dataset.name })
    wx.navigateTo({
      url: '../detail/detail?id=' + obj,
    })
  },
  getComInput(e) {
    this.setData({
      searchQuery: e.detail.value,
    })
    wx.request({
      url: app.globalData.serverUrl +'piionee/transfer/industry/getDropDownMenu', //仅为示例，并非真实的接口地址
      data: {
        query: e.detail.value,
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
    wx.navigateTo({
      url: '../index/index?query=' + this.data.searchQuery,
    })
  },
  onShareAppMessage() {
    return {
      title: '做最专业的技术调查工具',
    }
  },
  // 删除历史搜索记录
  deleteSearch(e){
    var id = "";
    var delete_id = "";
    if (e.currentTarget.dataset.id){
      var id = e.currentTarget.dataset.id;
      delete_id = 0
    }else{
      var id = "";
      delete_id = 1
    }
    wx.request({
      url: app.globalData.serverUrl + 'piionee/industry/deleteHistory',
      data:{
        user_id: app.globalData.user_id,
        is_delete_all: delete_id,
        id: id
      },
      success:(res)=>{
        console.log(res)
        if(res.data.status==0){
          if (res.data.is_delete){
            this.sendAjax();
          }
        }
      }
    })
  },
  // 点击搜索历史
  handleHistory(e){
    let companyId = e.currentTarget.dataset.companyid
    if (companyId == 0){
      wx.navigateTo({
        url: '../index/index?query=' + e.currentTarget.dataset.name,
      })
    }else{
      const obj = JSON.stringify({ id: e.currentTarget.dataset.id, name: e.currentTarget.dataset.name })
      wx.navigateTo({
        url: '../detail/detail?id=' + obj,
      })
    }
  }
})