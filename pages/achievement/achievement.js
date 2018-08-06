var app = getApp();
Page({
  data:{
    count: 0,
    people_num: 10,
    team_keyword: ['常用有色金属', '贵金属冶制', '发射设备制造', '广播电视节目制作及发射设备制造'],
    keyWordId: '',
    comId: '',
    row:10,
    numFound:'',
    industry:[],
    patentArray:[],
    refresh:true,
  },
  onLoad: function (option) {
    if (option.id){
      this.setData({
        comId: option.id
      })
    }else{
      this.setData({
        comId: option.pathId
      })
    }
    this.firtAjax()
  },
  getAreaSpecial(e) {
    this.setData({
      count: e.currentTarget.dataset.index,
      keyWordId: e.currentTarget.dataset.id,
      row: 10
    })
    this.firtAjax()
  },
  getAbstract(e){
    const obj = JSON.stringify({
      title: e.currentTarget.dataset.title,
      code: e.currentTarget.dataset.code,
      abstracts: e.currentTarget.dataset.abstract,
    })
    wx.navigateTo({
      url: '../abstract/abstract?obj='+obj,
      success: this.handleAbstract.bind(this)
    })
  },
  handleAbstract(res){
    // console.log(res)
  },
  firtAjax() {
    wx.request({
      url: 'https://api.piionee.com/piionee/transfer/industry/getPatentAnalysis', //仅为示例，并非真实的接口地址
      data: {
        id: this.data.comId,
        industry: this.data.keyWordId,
        rows: this.data.row
      },
      method: 'GET',
      header: {
        'content-type': 'application/json',// 默认值
      },
      success: this.handleAchievementSucc.bind(this),
      fail: function () {
        console.log("shibai")
      }
    })
  },
  handleAchievementSucc(res){
    if (res.data.industry.length>0){
      this.setData({
        industry: res.data.industry,
      })
    }
      this.setData({
        numFound: res.data.numFound,
        patentArray: res.data.patentArray
      })
      if (res.data.patentArray.length == res.data.numFound){
        this.setData({
          refresh:false
        })
      }
      wx.hideLoading();
  },
  goBack() {
    wx.navigateBack({
      delta: 1
    })
  },
  onReachBottom(){
    wx.showLoading({
      title: '玩命加载中',
    })
    this.setData({
      row: this.data.row+10
    })
    this.firtAjax()
  },
  onShareAppMessage() {
    var path = '/pages/achievement/achievement?pathId=' + app.globalData.id;
    return {
      title: '做最专业的技术调查工具',
      path: path
    }
  }
})