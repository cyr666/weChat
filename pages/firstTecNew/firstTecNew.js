var app = getApp();
Page({
  data:{
    showAll: true,
    newsList:[],
    rows:10,
    refresh: true,
    newId:'',
    followProject: true,
    myFollowProId: '',
    hidden: true,
    nocancel: false,
  },
  onLoad(option){
    if (option.followProject) {
      this.setData({
        followProject: false,
        myFollowProId: option.id,
      })
      this.myFollowProject()
    } else {
      this.setData({
        followProject: true
      })
      this.sendAjaxAll();
    }
    getApp().editTabBar();
  },
  //从关注页进来的请求
  myFollowProject() {
    wx.request({
      url: app.globalData.serverUrl + 'piionee/industry/smallApp/getListByPublic', //仅为示例，并非真实的接口地址
      data: {
        rows: this.data.rows,
        id: this.data.myFollowProId,
        type: 2
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: this.handleListByPublic.bind(this)
    })
  },
  handleListByPublic(res) {
    if (res.data.status == 0) {
      res.data.list.forEach((val) => {
        if (val.coverSize.w > 687) {
          val.coverSize.w = 687
        }
      })
      this.setData({
        newsList: res.data.list
      })
    }
    if (res.data.list.length == res.data.numFound) {
      this.setData({
        refresh: false
      })
    }
    wx.hideLoading();
  },
  // 发送请求 (全部 关注) start
  sendAjaxAll(){
    wx.request({
      url: app.globalData.serverUrl +'piionee/industry/smallApp/newsList',
      data:{
        user_id: app.globalData.user_id,
        type: 0,
        rows: this.data.rows 
      },
      success: this.handleFirstTecNew.bind(this)
    })
  },
  sendfollowAjax(){
    wx.request({
      url: app.globalData.serverUrl + 'piionee/industry/smallApp/newsList',
      data: {
        user_id: app.globalData.user_id,
        type: 1,
        rows: this.data.rows
      },
      success: this.handleFirstTecNew.bind(this)
    })
  },
  handleFirstTecNew(res){
    if (res.data.status == 0) {
      res.data.newsList.forEach((val) => {
        if (val.coverSize.w > 687) {
          val.coverSize.w = 687
        }
      })
      this.setData({
        newsList: res.data.newsList,
      })
    }
    if (res.data.newsList.length == res.data.numFound) {
      this.setData({
        refresh: false
      })
    }
    wx.hideLoading();
  },
  // 发送请求 (全部 关注) end
  goAchievementDel(e) {
    let id = e.currentTarget.dataset.id;
    let tech = e.currentTarget.dataset.tech;
    let index = e.currentTarget.dataset.index;
    let focus = this.data.newsList[index].focus;
    let name = e.currentTarget.dataset.name;
    wx.navigateTo({
      url: '../newsDel/newsDel?id=' + id + '&tech=' + tech + '&focus=' + focus + '&name=' + name,
    })
  },
  handleClickSkill(e) {
    let tech = e.currentTarget.dataset.tech;
    wx.navigateTo({
      url: '../skill/skill?&tech=' + tech,
    })
  },
  // 触发用户登录授权 start
  handleLogin(e) {
    // if (!app.globalData.is_user) {
    //   if (e.detail.userInfo) {
    //     app.globalData.avatarUrl = e.detail.userInfo.avatarUrl
    //     app.globalData.nickName = e.detail.userInfo.nickName
    //   }
    // }
    // app.handleLogin();
    this.setData({
      showAll: !this.data.showAll
    })
    if (this.data.showAll) {
      this.sendAjaxAll();
    } else {
      this.sendfollowAjax();
    }
  },
  handleFollow(e) {
    if (!app.globalData.is_user) {
      this.setData({
        hidden: false
      })
    }else{
      let name = e.currentTarget.dataset.name
      this.setData({
        newId: e.currentTarget.dataset.id,
      })
      this.followAjax(name);
    }
  },
  confirm(){
    this.setData({
      hidden: true
    })
    wx.navigateTo({
      url: '../personal/personal',
    })
  },
  cancel() {
    this.setData({
      hidden: true
    })
  },
  /*处理用户关注start */
  followAjax(name) {
    console.log(name)
    wx.request({
      url: app.globalData.serverUrl + 'piionee/industry/smallApp/addFocus',
      data: {
        user_id: app.globalData.user_id,
        id: this.data.newId,
        type: 2
      },
      success: (res) => {
        console.log(res)
        if (res.data.is_success) {
          let changeNewlist = this.data.newsList;
          changeNewlist.forEach((val)=>{
            if(val.public_name == name){
              val.focus = true
            }
          })
          this.setData({
            newsList: changeNewlist
          })
          var pages = getCurrentPages();
          var currPage = pages[pages.length - 1]; // 当前页面
          var prevPage = pages[pages.length - 3]; // 上一级页面
          if (prevPage.data.newsList){
            let arr = prevPage.data.newsList;
            arr.forEach((val)=>{
              if(val.public_name == name){
                val.focus = true
              }
            })
            prevPage.setData({
              newsList: arr
            })
          }
        }
      }
    })
  },
  /*处理用户关注end */
  /*取消关注*/
  handleDeleteFollow(e) {
    let name = e.currentTarget.dataset.name
    wx.request({
      url: app.globalData.serverUrl + 'piionee/industry/smallApp/deleteFocus',
      data: {
        id: e.currentTarget.dataset.id,
        user_id: app.globalData.user_id,
        type: 2
      },
      success: (res) => {
        if (res.data.is_success) {
          let arr = this.data.newsList
          arr.forEach((val) => {
            if (val.public_name == name) {
              val.focus = false
            }
          })
          this.setData({
            newsList: arr
          })
        }
        var pages = getCurrentPages();
        var currPage = pages[pages.length - 1]; // 当前页面
        var prevPage = pages[pages.length - 2]; // 上一级页面
        if (!this.data.followProject) {
          let patArr = prevPage.data.newsPublicArray;
          patArr.forEach((val, i) => {
            if (val.name == name) {
              patArr.splice(i, 1)
            }

          })

          prevPage.setData({
            newsPublicArray: patArr
          })
        }
        if (prevPage.data.newsList) {
          let arr = prevPage.data.newsList;
          arr.forEach((val) => {
            if (val.public_name == name) {
              val.focus = false
            }
          })
          prevPage.setData({
            newsList: arr
          })
        }
      }
    })
  },
  
  // 触发用户登录授权 end
  // 新用户登录 start
  
  /*下拉加载*/
  onReachBottom() {
    let that = this;
    wx.showLoading({
      title: '玩命加载中',
    })
    this.setData({
      rows: this.data.rows + 10
    })
    if (this.data.followProject) {
      if (this.data.showAll) {
        this.sendAjaxAll();
      } else {
        this.sendfollowAjax();
      }
    } else {
      this.myFollowProject()
    }
  },
  /*上拉刷新*/
  onPullDownRefresh() {
    wx.stopPullDownRefresh();
    this.setData({
      rows: this.data.rows + 10
    })
    if (this.data.followProject) {
      if (this.data.showAll) {
        this.sendAjaxAll();
      } else {
        this.sendfollowAjax();
      }
    } else {
      this.myFollowProject()
    }
  },
  // 分享
  onShareAppMessage() {
    var path = '/pages/firstTecNew/firstTecNew';
    return {
      title: '做最专业的技术调查工具',
      path: path
    }
  }
})