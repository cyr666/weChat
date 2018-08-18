var app = getApp();
Page({
  data:{
    rows: 10,
    patList: [],
    refresh: true,
    isFollow: true,
    showAll: true,
    projectId:'',
    projectType:1,
    followProject:true,
    myFollowProId:'',
    hidden: true,
    nocancel: false,
  },
  onLoad(option){
    console.log(option)
    if (option.followProject){
      this.setData({
        followProject: false,
        myFollowProId: option.id,
      })
      this.myFollowProject()
    }else{
      this.setData({
        followProject: true
      })
      this.sendAjaxAll();
    }
    getApp().editTabBar(); 
  },
//从关注页进来的请求
  myFollowProject(){
    wx.request({
      url: app.globalData.serverUrl + 'piionee/industry/smallApp/getListByPublic', //仅为示例，并非真实的接口地址
      data: {
        rows: this.data.rows,
        id: this.data.myFollowProId,
        type: 1
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: this.handleListByPublic.bind(this)
    })
  },
  handleListByPublic(res){
    console.log(res)
    if (res.data.status == 0) {
      this.setData({
        patList: res.data.list
      })
    }
    if (res.data.list.length == res.data.numFound) {
      this.setData({
        refresh: false
      })
    }
    wx.hideLoading();
  },
// 获取列表数据的接口 start
  sendAjaxAll() {
    wx.request({
      url: app.globalData.serverUrl +'piionee/transfer/industry/getAchievementList', //仅为示例，并非真实的接口地址
      data: {
        rows: this.data.rows,
        user_id: app.globalData.user_id,
        type: 0
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: this.handleSchoolInfo.bind(this)
    })
  },
  sendAjaxFollow(){
    wx.request({
      url: app.globalData.serverUrl + 'piionee/transfer/industry/getAchievementList', //仅为示例，并非真实的接口地址
      data: {
        rows: this.data.rows,
        user_id: app.globalData.user_id,
        type: 1
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: this.handleSchoolInfo.bind(this)
    })
  },
  handleSchoolInfo(res) {
    console.log(res)
    if (res.data.status == 0) {
      this.setData({
        patList: res.data.patList
      })
    }
    if (res.data.patList.length == res.data.numFound) {
      this.setData({
        refresh: false
      })
    }
    wx.hideLoading();
  },
  onReachBottom() {
    wx.showLoading({
      title: '玩命加载中',
    })
    this.setData({
      rows: this.data.rows + 10
    })
    if (this.data.followProject){
      if (this.data.showAll){
        this.sendAjaxAll();
      }else{
        this.sendAjaxFollow();
      } 
    }else{
      this.myFollowProject()
    }
  },
  onPullDownRefresh() {
    wx.stopPullDownRefresh();
    this.setData({
      rows: this.data.rows + 10
    })
    if (this.data.followProject) {
      if (this.data.showAll) {
        this.sendAjaxAll();
      } else {
        this.sendAjaxFollow();
      }
    } else {
      this.myFollowProject()
    }
  },
  // 获取列表数据的接口 end

  // 触发用户登录授权 start
  handleLogin(e){
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
      this.sendAjaxFollow();
    }
  },
  handleFollow(e){
    if(!app.globalData.is_user){
      this.setData({
        hidden: false
      })
    }else{
      let name = e.currentTarget.dataset.name
      this.setData({
        projectId: e.currentTarget.dataset.id,
        projectType: e.currentTarget.dataset.type,
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
  cancel(){
    this.setData({
      hidden: true
    })
  },
  // 触发用户登录授权 end
  /*处理用户关注start */
   followAjax(name){
     wx.request({
       url: app.globalData.serverUrl +'piionee/industry/smallApp/addFocus',
       data:{
         user_id: app.globalData.user_id,
         id: this.data.projectId,
         type: 1
       },
       success:(res)=>{
         if (res.data.is_success){
            let changePatlist = this.data.patList;
            changePatlist.forEach((val)=>{
              if(val.public_name==name){
                val.focus=true
              }
            });
            this.setData({
              patList: changePatlist
            })
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
        type: 1
      },
      success: (res) => {
        if (res.data.is_success) {
          let arr = this.data.patList
          arr.forEach((val)=>{
            if(val.public_name==name){
              val.focus=false
            }
          })
          this.setData({
            patList: arr
          })
        };
        if (!this.data.followProject) {
          var pages = getCurrentPages();
          var currPage = pages[pages.length - 1]; // 当前页面
          var prevPage = pages[pages.length - 2]; // 上一级页面
          let patArr = prevPage.data.patPublicArray;
          patArr.forEach((val, i) => {
            if (val.name == name) {
              patArr.splice(i, 1)
            }

          })

          prevPage.setData({
            patPublicArray: patArr
          })
        }
      }
    })
    
    
  },
  // 新用户登录 start
    // handleNewUserLogin(){
    //   console.log(app.globalData.openid)
    //   wx.request({
    //     url: app.globalData.serverUrl + 'piionee/industry/smallApp/sign',
    //     data:{
    //       account: app.globalData.openid,
    //       nickName: app.globalData.nickName,
    //       cover: app.globalData.avatarUrl
    //     },
    //     success:(res)=>{
    //       console.log(res)
    //     }
    //   })
    // },
    //点击进入专利 成果详情页
  goAchievementDel(e) {
    let id = e.currentTarget.dataset.id;
    let index = e.currentTarget.dataset.index;
    let focus = this.data.patList[index].focus;
    let name = e.currentTarget.dataset.name
    console.log(e.currentTarget.dataset.type)
    if (e.currentTarget.dataset.type == "成果发布") {
      wx.navigateTo({
        url: '../achievementDel/achievementDel?id=' + id + '&focus=' + focus + '&name=' + name,
      })
    } else if (e.currentTarget.dataset.type == "专利精选") {
      wx.navigateTo({
        url: '../patentSel/patentSel?id=' + id + '&focus=' + focus + '&name=' + name,
      })
    } else {
      wx.navigateTo({
        url: '../recommendAch/recommendAch?id=' + id + '&focus=' + focus + '&name=' + name,
      })
    }
  },
  // 分享
  onShareAppMessage() {
    var path = '/pages/project/project';
    return {
      title: '做最专业的技术调查工具',
      path: path
    }
  }
})