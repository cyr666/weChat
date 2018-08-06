//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    companyNum: 0,
    fen: 90,
    colorList: ['#05AAFF', '#008EFF', '#7152E5', '#9C5BF4', '#F96060', '#FAA420', '#FFD500', '#78CD49', '#05AAFF', '#008EFF'],
    searchQuery:"企业",
    companyList:[],
    row:10,
    refresh: true,
    value:'',
    reg:''
  },
  //事件处理函数
  onLoad(option){
    let reg = '/['+ option.query.split("").join("|")+']/ig'
    this.setData({
      searchQuery: option.query,
      value: option.query,
      reg: reg
    })
    this.handleSearch()
  },
  userNameInput(e){
    this.setData({
      searchQuery: e.detail.value,
    })
  },
  handleSearch(){
    this.ruquire()
  },
  ruquire(){
    const query = this.data.searchQuery;
    const reg = this.data.searchQuery.split("").join("|");
    this.setData({
      reg: reg
    })
    wx.request({
      url: 'https://api.piionee.com/piionee/transfer/industry/getCompanyByQuery', //仅为示例，并非真实的接口地址
      data: {
        query: query,
        rows: this.data.row
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
  handleSearchSucc(res){
    var i = 0;
    res.data.companyArray.map((val)=>{
      if (i > 7) {
        i = 0
      }
      i += 1;
      val.i = i;
      let firstWord = val.name.slice(0,1);
      val.firstWord=firstWord;
      let nameArr = val.name.split("");
      let nameObjArr = [] 
      nameArr.map((obj)=>{
        if(obj.match(this.data.reg)){
          nameObjArr.push({'sym':1,'title':obj})
        }else{
          nameObjArr.push({ 'sym': 2, 'title': obj })
        }
      })
      val.nameObjArr = nameObjArr
    })
    this.setData({
      companyList: res.data.companyArray,
      companyNum: res.data.numFound
    })
    if (res.data.companyArray.length == res.data.numFound) {
      this.setData({
        refresh: false
      })
    }
    wx.hideLoading();
  },
  handleCompantDel(e){
    const obj = JSON.stringify({ id: e.currentTarget.dataset.index, name: e.currentTarget.dataset.name})
    wx.navigateTo({
      url: '../detail/detail?id='+obj,
    })
  },
  goBack(){
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
    this.ruquire()
  },
  onShareAppMessage() {
    const query = this.data.searchQuery;
    const path = '/pages/index/index?query=' + query;
    return {
      title: '做最专业的技术调查工具',
      path: path
    }
  }
})
