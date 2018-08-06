Page({
  data:{
    comId:"",
    rows: 20,
    companyList:[],
    refresh:true
  },
  onLoad(option){
    this.setData({
      comId: option.id,
    })
    this.sendAjax()
  },
  sendAjax(){
    wx.request({
      url: 'https://api.piionee.com/piionee/transfer/industry/getCompanyRelation',
      data: {
        id: this.data.comId,
        rows: this.data.rows
      },
      method: 'GET',
      header: {
        'content-type': 'application/json',// 默认值
      },
      success: this.handleRelation.bind(this),
      fail: function () {
        console.log("shibai")
      }
    });
  },
  handleRelation(res) {
    if(res.data.status == 0){
      this.setData({
        companyList: res.data.companyArray
      })
    }
    if (res.data.companyArray.length == res.data.numFound) {
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
    this.sendAjax()
  },
  onShareAppMessage() {
    var path = '/pages/cooperate/cooperate?id=' + app.globalData.id;
    return {
      title: '做最专业的技术调查工具',
      path: path
    }
  },
  gocomDel(e) {
    const obj = JSON.stringify({ id: e.currentTarget.dataset.id, name: e.currentTarget.dataset.name })
    wx.navigateTo({
      url: '../detail/detail?id=' + obj,
    })
  },
})