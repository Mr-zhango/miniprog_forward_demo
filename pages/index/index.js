//index.js
//获取应用实例
const app = getApp()

Page({
    data: {
        motto: 'Hello World',
        userInfo: {},
        hasUserInfo: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo')
    },
    //事件处理函数
    bindViewTap: function () {
        wx.navigateTo({
            url: '../logs/logs'
        })
    },
    onLoad: function () {
        if (app.globalData.userInfo) {
            this.setData({
                userInfo: app.globalData.userInfo,
                hasUserInfo: true
            })
        } else if (this.data.canIUse) {
            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
            // 所以此处加入 callback 以防止这种情况
            app.userInfoReadyCallback = res => {
                this.setData({
                    userInfo: res.userInfo,
                    hasUserInfo: true
                })
            }
        } else {
            this.doLogin();
            // 在没有 open-type=getUserInfo 版本的兼容处理
        }
    },


    doLogin: function (callback = () => {
    }) {
        let that = this;
        wx.login({
            success: function (loginRes) {
                if (loginRes) {
                    //获取用户信息
                    wx.getUserInfo({
                        withCredentials: true,//非必填  默认为true
                        success: function (infoRes) {
                            console.log(infoRes, '>>>');
                            //请求服务端的登录接口
                            wx.request({
                                url: 'http://localhost:8080/user/login',
                                data: {
                                    code: loginRes.code,//临时登录凭证
                                    rawData: infoRes.rawData,//用户非敏感信息
                                    signature: infoRes.signature,//签名
                                    encrypteData: infoRes.encryptedData,//用户敏感信息
                                    iv: infoRes.iv//解密算法的向量
                                },
                                success: function (res) {
                                    console.log('login success');
                                    console.log('res信息:' + res);

                                    res = res.data;
                                    if (res.result == 0) {
                                        //that.globalData.userInfo = res.userInfo;
                                        wx.setStorageSync('userInfo', JSON.stringify(res.userInfo));
                                        wx.setStorageSync('loginFlag', res.skey);
                                        console.log("skey=" + res.skey);

                                        that.setData({
                                            userInfo: res.userInfo,
                                            hasUserInfo: true
                                        })

                                    } else {
                                        console.log("登录失败");
                                    }
                                },
                            });
                        }
                    });
                } else {

                }
            }
        });
    }
})
