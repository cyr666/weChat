//app.js
App({
  onLaunch: function () {
    this.handleLogin()
  },
  handleLogin(){
    var that = this;
    wx.login({
      success: function (res) {
        wx.request({
          url: 'https://api.weixin.qq.com/sns/jscode2session?',
          data:{
            appid:'wx25cf560a19772537',
            secret: '5c55c83aa224fe0facef793bb8916134',
            js_code: res.code,
            grant_type: 'authorization_code'
          },
          success:(res)=>{
            that.globalData.openid = res.data.openid
            wx.request({
              url: that.globalData.serverUrl + 'piionee/industry/smallApp/beforeSign',
              data:{
                account: res.data.openid
              },
              success:(res)=>{
                that.globalData.is_user = res.data.is_user;
                console.log(res)
                if (that.globalData.is_user){
                  that.globalData.avatarUrl = res.data.cover;
                  that.globalData.nickName = res.data.nickName;
                  that.globalData.user_id = res.data.user_id;
                }
              }
            })
          }
        })
      }
    });
  },
  editTabBar: function () {
    var tabbar = this.globalData.tabbar,
      currentPages = getCurrentPages(),
      _this = currentPages[currentPages.length - 1],
      pagePath = _this.__route__;
    (pagePath.indexOf('/') != 0) && (pagePath = '/' + pagePath);
    for (var i in tabbar.list) {
      tabbar.list[i].selected = false;
      (tabbar.list[i].pagePath == pagePath) && (tabbar.list[i].selected = true);
    }
    _this.setData({
      tabbar: tabbar
    });
    // console.log(_this.data.tabbar)
  },
  globalData: {
    id: "1",
    serverUrl: 'https://apit.piionee.com/', //'https://api.piionee.com/',
    userInfo: null,
    tabbar: {
      color: "#9A9A9A",
      selectedColor: "#008EFF",
      backgroundColor: "#FAFAFA",
      borderStyle: "",
      list: [
        {
          pagePath: "/pages/first/first",
          text: "搜公司",
          iconPath: "../../resource/tab1_1.png",
          selectedIconPath: "../../resource/tab1_2.png",
          selected: true
        },
        {
          pagePath: "/pages/firstTecNew/firstTecNew",
          text: "科技头条",
          iconPath: "../../resource/tab2_1.png",
          selectedIconPath: "../../resource/tab2_2.png",
          selected: false
        },
        {
          pagePath: "/pages/project/project",
          text: "科技项目",
          iconPath: "../../resource/tab3_1.png",
          selectedIconPath: "../../resource/tab3_2.png",
          selected: false
        },
        {
          pagePath: "/pages/personal/personal",
          text: "我的",
          iconPath: "../../resource/tab4_1.png",
          selectedIconPath: "../../resource/tab4_2.png",
          selected: false
        }
      ],
      position: "bottom"
    },
    openid:'',
    avatarUrl:'',
    nickName:'',
    is_user: '',
    user_id:'',
    news_id:'',
    tech:""
  }
})