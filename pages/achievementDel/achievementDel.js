// pages/achievementDel/achievementDel.js
var WxParse = require('../wxParse/wxParse.js');
var app = getApp();
Page({
  data: {
    public:{},
    title: "",
    subTitles:[],
    date:"",
    schoolId:"",
    pageView:"",
    focus:true,
    public_id:'',
    collected:true,
    collectId:'',
    hidden: true,
    nocancel: false,
  },
  onLoad: function (options) {
    let btnFocus = true;
    app.globalData.schoolId = options.id;
    if (options.focus == 'true') {
      btnFocus = true
    } else {
      btnFocus = false;
    }
    this.setData({
      schoolId: options.id,
      focus: btnFocus
    }) 
    wx.request({
      url: app.globalData.serverUrl +'piionee/transfer/industry/getAchievementDetail', //仅为示例，并非真实的接口地址
      data: {
        id: this.data.schoolId,
        user_id: app.globalData.user_id
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: this.handleGetachievementSucc.bind(this)
    })
  },
  handleGetachievementSucc(res){
    if (res.data.status==0){
      console.log(res)
      let that = this;
      let subTitle = Array.from(res.data.subTitles);
      subTitle.forEach((val, ind) => {
        WxParse.wxParse('subTitle' + ind, 'html', val.content, that, 5)
      })

      that.setData({
        public: res.data.public,
        collected: res.data.collected,
        title: res.data.title,
        subTitles: res.data.subTitles,
        date: res.data.date,
        pageView: res.data.pageView,
        collectId: res.data.id,
      })
    }else{

    }
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
    // this.setData({
    //   showAll: !this.data.showAll
    // })
    // this.sendAjaxAll();
  },
  handleFollow(e) {
    if (!app.globalData.is_user) {
     this.setData({
       hidden: false
     })
    }else{
      this.setData({
        public_id: e.currentTarget.dataset.id,
      })
      let public_id = this.data.public_id
      this.followAjax(public_id, 1);
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
  //收藏
  handleCollect(e){
    if (!app.globalData.is_user) {
      this.setData({
        hidden: false
      })
    } else {
      let collectId = this.data.collectId
      this.followAjax(collectId,3);
    }
  },
  //取消收藏
  handleDeleCollect(){
    wx.request({
      url: app.globalData.serverUrl + 'piionee/industry/smallApp/deleteFocus',
      data: {
        id: this.data.collectId,
        user_id: app.globalData.user_id,
        type: 3
      },
      success:(res)=>{
        if(res.data.is_success){
          this.setData({
            collected: false
          })
        }
      }
    })
  },
  /*处理用户关注 收藏start */
  followAjax(id,type) {
    let that = this;
    wx.request({
      url: app.globalData.serverUrl + 'piionee/industry/smallApp/addFocus',
      data: {
        user_id: app.globalData.user_id,
        id: id,
        type: type
      },
      success: (res) => {
        console.log(res)
        
        if (res.data.is_success) {
          if (type == 1) {
            that.setData({
              focus: true
            })
          }else if(type==3){
            that.setData({
              collected: true
            })
          }else{
            that.setData({
              collected: false
            })
          }  
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
        type: 1
      },
      success: (res) => {
        if (res.data.is_success) {
          this.setData({
            focus: false
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
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var path = '/pages/achievementDel/achievementDel?id=' + app.globalData.schoolId;
    return {
      title: '做最专业的技术调查工具',
      path: path
    }
  }
})