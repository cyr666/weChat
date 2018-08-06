//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    // var logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: function (res) {
        if (res.code) {
          //发起网络请求
          // wx.request({
          //   url: 'https://test.com/onLogin',
          //   data: {
          //     code: res.code
          //   }
          // })
          // console.log(res.code)
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    });
    // 获取用户信息
    // wx.getSetting({
    //   success: res => {
    //     if (res.authSetting['scope.userInfo']) {
    //       // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
    //       wx.getUserInfo({
    //         success: res => {
    //           // 可以将 res 发送给后台解码出 unionId
    //           this.globalData.userInfo = res.userInfo

    //           // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //           // 所以此处加入 callback 以防止这种情况
    //           if (this.userInfoReadyCallback) {
    //             this.userInfoReadyCallback(res)
    //           }
    //         }
    //       })
    //     }else{
    //       console.log("去登陆")
    //     }
    //   }
    // })
  },
  editTabBar: function () {
    var tabbar = this.globalData.tabbar,
      currentPages = getCurrentPages(),
      _this = currentPages[currentPages.length - 1],
      pagePath = _this.__route__;
    // (pagePath.indexOf('/') != 0) && (pagePath = '/' + pagePath);
    for (var i in tabbar.list) {
      tabbar.list[i].selected = false;
      (tabbar.list[i].pagePath == pagePath) && (tabbar.list[i].selected = true);
    }
    // console.log(currentPages)
    _this.setData({
      tabbar: tabbar
    });
  },
  globalData: {
    id: "1",
    userInfo: null,
    tabbar: {
      color: "#9A9A9A",
      selectedColor: "#008EFF",
      backgroundColor: "#FAFAFA",
      borderStyle: "",
      list: [
        {
          pagePath: "pages/first/first",
          text: "搜公司",
          iconPath: "../../resource/tab1_1.png",
          selectedIconPath: "../../resource/tab1_2.png",
          selected: true
        },
        {
          pagePath: "",
          text: "科技头条",
          iconPath: "../../resource/tab2_1.png",
          selectedIconPath: "../../resource/tab2_2.png",
          selected: false
        },
        {
          pagePath: "pages/project/project",
          text: "项目",
          iconPath: "../../resource/tab3_1.png",
          selectedIconPath: "../../resource/tab3_2.png",
          selected: false
        },
        {
          pagePath: "",
          text: "我的",
          iconPath: "../../resource/tab4_1.png",
          selectedIconPath: "../../resource/tab4_2.png",
          selected: false
        }
      ],
      position: "bottom"
    }
  }
})