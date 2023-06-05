import { GameMain } from "../GameMain";
import { LevelSceneLogic } from "../LevelSceneLogic";

export class ttPlatform
{
     public static AD_VIDEO_TYPE = {
        AD_VIDEO_TYPE_DOUBLEREWARD: 1, //双倍领取
        AD_VIDEO_TYPE_REVIVE: 2, //复活
        AD_VIDEO_TYPE_SKILL_1:3,//主界面技能1升级
        AD_VIDEO_TYPE_SKILL_2:4,//主界面技能2升级
        AD_VIDEO_TYPE_SKILL_3:5,//主界面技能3升级
    }

    public static m_AD_VIDEO_TYPE:any = ttPlatform.AD_VIDEO_TYPE.AD_VIDEO_TYPE_DOUBLEREWARD;
    public static m_VideoADInstance:any = null;

    public static record_stop = true
    public static record_path = ""
    public static AD_interstitial:any = null; //插屏广告

    public static Login()
    {
        console.log("Login");
        tt.login({
            success(_res) {
              console.log("登录成功");
              // 调用 getUserInfo 前, 请确保登录成功
          
              // 获取用户信息
              tt.getUserInfo({
                // withCredentials: true,
                // withRealNameAuthenticationInfo: true,
                success(res) {
                  console.log(`getUserInfo 调用成功`, res.userInfo);
                },
                fail(res) {
                  console.log(`getUserInfo 调用失败`, res.errMsg);
                },
              });
            },
          });
    }

//--------------------------------------------------------视频激励AD---------------------------------------------------
    // VideoIDStr = 1k9ri0lfl7o31garcb
    public static CreateVideoAD(VideoIDStr)
    {
        console.log("CreateVideoAD");
        if(ttPlatform.m_VideoADInstance != null)
        {
            ttPlatform.m_VideoADInstance = tt.createRewardedVideoAd({
                adUnitId: VideoIDStr,
                multiton: false,
                multitonRewardMsg: ['更多奖励1'],
                multitonRewardTimes: 1,
                progressTip: false,
              });
              
              ttPlatform.m_VideoADInstance.onClose(ttPlatform.OnVideoADEnd)
        }
    }

    public static OnVideoADEnd (res) 
    {
        console.log("OnVideoADEnd");
        if(ttPlatform.m_AD_VIDEO_TYPE == ttPlatform.AD_VIDEO_TYPE.AD_VIDEO_TYPE_DOUBLEREWARD)
        {
            console.log("AD_VIDEO_TYPE_DOUBLEREWARD");
            LevelSceneLogic.GetInstance().OnVideoEndDoubleReward(res);
        }
        else if(ttPlatform.m_AD_VIDEO_TYPE == ttPlatform.AD_VIDEO_TYPE.AD_VIDEO_TYPE_REVIVE)
        {
            console.log("AD_VIDEO_TYPE_REVIVE");
            LevelSceneLogic.GetInstance().OnVideoEndRevive(res);
        }
        else if(ttPlatform.m_AD_VIDEO_TYPE == ttPlatform.AD_VIDEO_TYPE.AD_VIDEO_TYPE_SKILL_1)
        {
            console.log("AD_VIDEO_TYPE_SKILL_1");
            GameMain.GetInstance().OnSkillBuy_1(res);
        }
        else if(ttPlatform.m_AD_VIDEO_TYPE == ttPlatform.AD_VIDEO_TYPE.AD_VIDEO_TYPE_SKILL_2)
        {
            console.log("AD_VIDEO_TYPE_SKILL_2");
            GameMain.GetInstance().OnSkillBuy_2(res);
        }
        else if(ttPlatform.m_AD_VIDEO_TYPE == ttPlatform.AD_VIDEO_TYPE.AD_VIDEO_TYPE_SKILL_3)
        {
            console.log("AD_VIDEO_TYPE_SKILL_3");
            GameMain.GetInstance().OnSkillBuy_3(res);
        }
    }

    public static ShowVideoAD(AD_VIDEO_TYPE:number)
    {
        console.log("ShowVideoAD");
        ttPlatform.m_AD_VIDEO_TYPE = AD_VIDEO_TYPE

        let res = {isEnded:true, count:1}
        ttPlatform.OnVideoADEnd(res)

        //if(ttPlatform.m_VideoADInstance != null)
        //{
        //    ttPlatform.m_VideoADInstance.show().then(() => {
        //        console.log("ShowVideoAD showed");
        //        });
        //}
        
    }

//--------------------------------------------------------插屏AD---------------------------------------------------
     /**插屏广告 */
     public static showAD_Interstitial () 
     {
         console.log("showAD_Interstitial");
         if(ttPlatform.AD_interstitial != null)
         {
            ttPlatform.AD_interstitial.destroy()
         }
         ttPlatform.AD_interstitial = tt.createInterstitialAd({
             adUnitId: "962dd6jaegfh22739h",
           });
           ttPlatform.AD_interstitial.onClose(() => {
             console.log("Interstitial destroy");
             ttPlatform.AD_interstitial.destroy()})
             ttPlatform.AD_interstitial.load()
             .then(() => {
                ttPlatform.AD_interstitial.show().then(() => {
                 console.log("插屏广告展示成功");
               });
             })
             .catch((err) => {
               console.log(err);
               console.log("插屏广告展示fail");
               ttPlatform.AD_interstitial.destroy()
             });
     }
 
    //--------------------------------------------------------录屏分享---------------------------------------------------

    /**开始录屏*/
       public static startRecord(){
        tt.getSystemInfo({
            success(res) {
              const screenWidth = res.screenWidth;
              const screenHeight = res.screenHeight;
              const recorder = tt.getGameRecorderManager();
              var maskInfo = recorder.getMark();
              var x = (screenWidth - maskInfo.markWidth) / 30;
              var y = (screenHeight - maskInfo.markHeight) / 1.5;
          
              recorder.onStart((res) => {
                console.log("录屏开始");
                ttPlatform.record_stop = false
                // do something; 监听到录屏开始事件后的反馈
              });

              recorder.onStop((res) => {
                console.log("录屏结束");
                ttPlatform.record_path = res.videoPath
                ttPlatform.record_stop = true
                console.log(res.videoPath);
                // do something;
                });

              //添加水印并且居中处理
              recorder.start({
                duration: 300,
                isMarkOpen: true,
                locLeft: x,
                locTop: y,
              });
            },
          });   
    }

    /** 结束录屏*/
    public static stoptRecord(){
        const recorder = tt.getGameRecorderManager();
        recorder.stop();    
    }

    /** 分享录屏*/
    public  static recordShare(){
        
        console.log("recordShare !!!");

        const recorder = tt.getGameRecorderManager();

        if(ttPlatform.record_stop == true)
        {
            tt.shareAppMessage({
                title: "镖在手，跟我走",
                channel: "video",
                extra: {
                videoPath: ttPlatform.record_path, //录屏后得到的文件地址
                withVideoId: true,
                },
                success(res) {
                    console.log("分享成功");
                    tt.showToast({
                        title: "分享成功",
                        duration: 2000,
                        success(res) {
                          console.log(`${res}`);
                        },
                        fail(res) {
                          console.log(`showToast调用失败`);
                        },
                      });
                    // tt.showModal({
                    //     title: "分享成功",
                    //     content: JSON.stringify(res),
                    // });
                },
                fail(e) {
                    console.log("分享失败");
                    tt.showToast({
                        title: "分享失败",
                        duration: 1000,
                        success(res) {
                          console.log(`${res}`);
                        },
                        fail(res) {
                          console.log(`showToast调用失败`);
                        },
                      });
                    // tt.showModal({
                    //     title: "分享失败",
                    //     content: JSON.stringify(e),
                    // });
                },
            });
        }
        else
        {
            recorder.onStop((res) => {
                console.log("录屏结束并分享");
                console.log(res.videoPath);
                tt.shareAppMessage({
                    title: "镖在手，跟我走",
                    channel: "video",
                    extra: {
                    videoPath: res.videoPath, //录屏后得到的文件地址
                    withVideoId: true,
                    },
                    success(res) {
                        console.log("分享成功");
                        tt.showToast({
                            title: "分享成功",
                            duration: 2000,
                            success(res) {
                              console.log(`${res}`);
                            },
                            fail(res) {
                              console.log(`showToast调用失败`);
                            },
                          });
                        // tt.showModal({
                        //     title: "分享成功",
                        //     content: JSON.stringify(res),
                         //  });
                    },
                    fail(e) {
                        console.log("分享失败");
                        tt.showToast({
                            title: "分享失败",
                            duration: 1000,
                            success(res) {
                              console.log(`${res}`);
                            },
                            fail(res) {
                              console.log(`showToast调用失败`);
                            },
                          });
                        // tt.showModal({
                        //     title: "分享失败",
                        //     content: JSON.stringify(e),
                        // });
                    },
                });
            });

            recorder.stop();
        }
        
            
    }
}
