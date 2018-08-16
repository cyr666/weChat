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
    console.log(res)
    if (res.data.status == 0) {
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
    console.log(res)
    if (res.data.status == 0) {
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
    wx.navigateTo({
      url: '../newsDel/newsDel?id=' + id + '&tech=' + tech + '&focus=' + focus,
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
    if (!app.globalData.is_user) {
      if (e.detail.userInfo) {
        app.globalData.avatarUrl = e.detail.userInfo.avatarUrl
        app.globalData.nickName = e.detail.userInfo.nickName
      }
      this.handleNewUserLogin()
    }
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
      let index = e.currentTarget.dataset.index
      this.setData({
        newId: e.currentTarget.dataset.id,
      })
      this.followAjax(index);
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
  followAjax(index) {
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
          changeNewlist[index].focus = true;
          console.log(changeNewlist)
          this.setData({
            newsList: changeNewlist
          })
        }
      }
    })
  },
  /*处理用户关注end */
  /*取消关注*/
  handleDeleteFollow(e) {
    let index = e.currentTarget.dataset.index
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
          arr[index].focus = false
          this.setData({
            newsList: arr
          })
        }
      }
    })
  },
  
  // 触发用户登录授权 end
  // 新用户登录 start
  handleNewUserLogin() {
    console.log(app.globalData.openid)
    wx.request({
      url: app.globalData.serverUrl + 'piionee/industry/smallApp/sign',
      data: {
        account: app.globalData.openid,
        nickName: app.globalData.nickName,
        cover: app.globalData.avatarUrl
      },
      success: (res) => {
        console.log(res)
      }
    })
  },
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
})