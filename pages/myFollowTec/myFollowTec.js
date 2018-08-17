Page({
  data:{
    isCollect: true,
    patPublicArray:[],
  },
  onLoad: function (options) {
    console.log("科研机构")
    let focusArr = JSON.parse(wx.getStorageSync('focusArr'))
    this.setData({
      patPublicArray: focusArr.patPublicArray
    })
  },
  goAchList(e){
    console.log(e)
    let id = e.currentTarget.dataset.id;
    let followProject = false
    wx.navigateTo({
      url: '../project/project?id=' + id + '&type=1' + '&followProject=' + followProject,
    })
  }
}) 