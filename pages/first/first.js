var app = getApp();
Page({
  data: {
    bannerData: {
      bg: "../../resource/bg.png",
      logo: "../../resource/LOGO@2x.png",
      searchBtn: "../../resource/search.png"
    },
    hotWord: ["奇虎", "腾讯", "百度", "阿里巴巴", "联想", "新东方", "猫眼"],
    wordList:[],
    rows: 10,
    newsList:[],
    refresh:true,
    refreshload: false,
    isFollow: true,
    //Query:'',
    //companyArray:[],
    //delQuery:'',
    showChangeCss: false,
    showSearchInput: true,
    classStyle: '',
    hidden: true,
    nocancel: false,
    animationData:{},
    hidden_test: true,
    //reg: ''
  },
  onLoad() {
    getApp().editTabBar(); 
    console.log(app.globalData.serverUrl)
    this.setData({
      classStyle: wx.getStorageSync('classStyle')
    });
    console.log(this.data.classStyle)
    wx.request({
      url: app.globalData.serverUrl+'piionee/transfer/industry/getHotWord', //仅为示例，并非真实的接口地址
      data: {},
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: this.handleGetHotWordSucc.bind(this)
    });
    this.sendAjaxAll();
  },
  // 发送请求 (全部 关注) start
  sendAjaxAll() {
    wx.request({
      url: app.globalData.serverUrl + 'piionee/industry/smallApp/newsList',
      data: {
        user_id: app.globalData.user_id,
        type: 0,
        rows: this.data.rows
      },
      success: this.handleFirstTecNew.bind(this)
    })
  },
  handleFirstTecNew(res) {
    console.log(res)
    if (res.data.status == 0) {
      res.data.newsList.forEach((val)=>{
        if (val.coverSize.w>687){
          val.coverSize.w=687
        }
        if (val.coverSize.w == 687){
          val.coverSize.w = 520
        }
        if (val.coverSize.h > 280){
          val.coverSize.h=300
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
  handleGetHotWordSucc(res) {
    if (res.statusCode == 200) {
      this.setData({
        // name_focus:true,
        wordList: res.data.wordList
      })
    }
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
  goComDel(e) {
    const obj = JSON.stringify({ id: e.currentTarget.dataset.id, name: e.currentTarget.dataset.name })
    wx.navigateTo({
      url: '../detail/detail?id=' + obj,
    })
  },
  focus() {
    wx.navigateTo({
      url: '../search/search',
    })
  },
  onPageScroll(e) {
    var animation = wx.createAnimation({
      duration: 400,
      timingFunction: 'linear',
    })
    this.animation = animation
    if (e.scrollTop > 0) {
      this.setData({
        showChangeCss: true,
        showSearchInput: false
      })
      animation.opacity(1).step()
      this.setData({
        animationData: animation.export()
      })
      
    } else {
      this.setData({
        showChangeCss: false,
        showSearchInput: true
      })
      animation.opacity(0).step()
      this.setData({
        animationData: animation.export()
      })
    }
  },
  onShareAppMessage() {
    return {
      title: '做最专业的技术调查工具',
    }
  },
  goAchievementDel(e){
    console.log(e)
    let id = e.currentTarget.dataset.id;
    let tech = e.currentTarget.dataset.tech;
    let index = e.currentTarget.dataset.index;
    let focus = this.data.newsList[index].focus;
    wx.navigateTo({
      url: '../newsDel/newsDel?id=' + id + '&tech=' + tech +'&focus='+focus,
    })
  },
  handleClickSkill(e){
    let tech = e.currentTarget.dataset.tech;
    wx.navigateTo({
      url: '../skill/skill?&tech=' + tech,
    })
  },
  onReachBottom() {
    wx.showLoading({
      title: '玩命加载中',
    })
    this.setData({
      rows: this.data.rows + 10
    })
    this.sendAjaxAll()
  },
  onPullDownRefresh(){
    wx.stopPullDownRefresh();
    this.setData({
      rows: this.data.rows + 10
    })
    this.sendAjaxAll()
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
    this.sendAjaxAll();
  },
  handleFollow(e) {
    if (!app.globalData.is_user) {
      this.setData({
        hidden: false
      })
    } else {
      let name = e.currentTarget.dataset.name
      this.setData({
        newId: e.currentTarget.dataset.id,
      })
      this.followAjax(name);
    }
  },
  confirm() {
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
    wx.request({
      url: app.globalData.serverUrl + 'piionee/industry/smallApp/addFocus',
      data: {
        user_id: app.globalData.user_id,
        id: this.data.newId,
        type: 2
      },
      success: (res) => {
        if (res.data.is_success) {
          let changeNewlist = this.data.newsList;
          changeNewlist.forEach((val)=>{
            if (val.public_name==name){
              val.focus = true
            }
          });
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
  handleDeleteFollow(e){
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
          arr.forEach((val)=>{
            if(val.public_name==name){
              val.focus=false
            }
          })
          this.setData({
            newsList:arr
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
})