//app.js
App({
  onLaunch: function () {
    this.handleLogin();
    this.handleDeviceType()
  },
  handleLogin(){
    var that = this;
    wx.login({
      success:(res)=>{
        that.globalData.code = res.code;
        wx.request({
          url: that.globalData.serverUrl + 'piionee/industry/smallApp/beforeSign',
          data: {
            code: that.globalData.code,
          },
          success: (res) => {
            if (res.data.status == 0 && res.data.is_user) {
              that.globalData.user_id = res.data.user_id
              that.globalData.avatarUrl = res.data.cover;
              that.globalData.nickName = res.data.nickName;
              that.globalData.is_user = true

            }
          }
        })
      }
    })
  },
  handleDeviceType(){
    let that = this;
    wx.getSystemInfo({
      success: function (res) {
        if (res.model == 'iPhone X') {
          that.globalData.tabbar.isIphoneX=true
        }
      }
    })　
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
    serverUrl: 'https://api.piionee.com/', //'https://apit.piionee.com/',
    userInfo: null,
    tabbar: {
      color: "#9A9A9A",
      selectedColor: "#008EFF",
      backgroundColor: "#FAFAFA",
      borderStyle: "",
      isIphoneX: false,
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
    tech:"",
    code:''
  }
})