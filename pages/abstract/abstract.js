Page({
  data:{
    code:'',
    title:'',
    abstracts:''
  },
  onLoad: function (option) {
    if(option.obj){
      const obj = JSON.parse(option.obj);
      this.setData({
        code: obj.code,
        title: obj.title,
        abstracts: obj.abstracts
      })
    }else{
      const obj = JSON.parse(option.shareAbstract);
      this.setData({
        code: obj.code,
        title: obj.title,
        abstracts: obj.abstracts
      })
    } 
  },
  goBack() {
    wx.navigateBack({
      delta: 1
    })
  },
  onShareAppMessage() {
    const data = JSON.stringify(this.data)
    var path = '/pages/abstract/abstract?shareAbstract=' + data;
    return {
      title: '做最专业的技术调查工具',
      path: path
    }
  }
})