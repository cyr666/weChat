var app = getApp();
Page({
  data:{
    isCollect: false,
    collectArr:[]
  },
  onLoad(){
    this.setData({
      collectArr: JSON.parse(wx.getStorageSync('collectArr'))
    })
  },
  //点击进入专利 成果详情页
  goAchievementDel(e) {
    let id = e.currentTarget.dataset.id;
    let focus = e.currentTarget.dataset.focus;
    let collect = e.currentTarget.dataset.collect;
    let title = e.currentTarget.dataset.title;
    if (e.currentTarget.dataset.type == "成果发布") {
      wx.navigateTo({
        url: '../achievementDel/achievementDel?id=' + id + '&focus=' + focus + '&collect=' + collect + '&title=' + title,
      })
    } else if (e.currentTarget.dataset.type == "专利精选") {
      wx.navigateTo({
        url: '../patentSel/patentSel?id=' + id + '&focus=' + focus + '&collect=' + collect + '&title=' + title,
      })
    } else {
      wx.navigateTo({
        url: '../recommendAch/recommendAch?id=' + id + '&focus=' + focus + '&collect=' + collect + '&title=' + title,
      })
    }
  },
})