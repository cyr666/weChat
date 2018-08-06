var app = getApp();
Page({
  data:{
    count:0,
    team_keyword: ['常用有色金属', '贵金属冶制', '发射设备制造','广播电视节目制作及发射设备制造'],
    colorList: ['#05AAFF', '#008EFF', '#7152E5', '#9C5BF4', '#F96060', '#FAA420', '#FFD500', '#78CD49'],
    industryList:[],
    inventer:[],
    numFound:'',
    keyWordId:'',
    comId:'',
    row: 10,
    refresh: true,
  },
  onLoad(option) {
    this.setData({
      comId:option.id
    })
    console.log(option)
    this.firtAjax()
  },
  firtAjax(){
    wx.request({
      url: 'https://api.piionee.com/piionee/transfer/industry/getInnovationPerson', //仅为示例，并非真实的接口地址
      data: {
        id: this.data.comId,
        industry: this.data.keyWordId,
        rows: this.data.row
      },
      method: 'GET',
      header: {
        'content-type': 'application/json',// 默认值
      },
      success: this.handleTeamSucc.bind(this),
      fail: function () {
        console.log("shibai")
      }
    })
  },
  handleTeamSucc(res){
    this.setData({
      numFound: res.data.numFound
    })
    if (res.data.industry.length>0){
      this.setData({
        industryList: res.data.industry
      })
    }
    if (res.data.inventer.length > 0) {
      var i = 0;
      res.data.inventer.map((val) => {
        if(i>7){
          i=0
        }
        i+=1
        let firstWord = val.name.slice(0, 1);
        val.firstWord = firstWord;
        val.i = i;
      })
      
      this.setData({
        inventer: res.data.inventer
      })
      if (res.data.inventer.length == res.data.numFound) {
        this.setData({
          refresh: false
        })
      }
    }
    wx.hideLoading();
  },
  getAreaSpecial(e){
    this.setData({
      count: e.currentTarget.dataset.index,
      keyWordId: e.currentTarget.dataset.id,
      row:10
    })
    this.firtAjax()
  },
  goBack() {
    wx.navigateBack({
      delta: 1
    })
  },
  onReachBottom() {
    wx.showLoading({
      title: '玩命加载中',
    })
    this.setData({
      row: this.data.row + 10
    })
    this.firtAjax()
  },
  onShareAppMessage() {
    var path = '/pages/team/team?id=' + app.globalData.id;
    return {
      title: '做最专业的技术调查工具',
      path: path
    }
  }
})