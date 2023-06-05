import { Enum } from "cc";

export class constant {

    public static GAME_NAME = 'crazyTornado';
    public static GAME_VERSION = '1.0.0';
    public static GAME_FRAME = 60;      //游戏当前帧率
    public static GAME_INIT_FRAME = 60; //游戏开发基础帧率

    //音频资源枚举
    public static AUDIO_SOUND = {
        BACKGROUND: 'background',//背景音乐
        PLAYERMOVE:'move',
        BUILDING:'buildingdie',
    }
    

    //广告视频触发点类型
    public static AD_VIDEO_ID = {
        REWORD_DOUBLE: 1, //双倍领取
        REVIVE: 2, //复活
        SKILLUP_1:3,//主界面技能1升级
        SKILLUP_2:4,//主界面技能2升级
        SKILLUP_3:5,//主界面技能3升级
    }

    //平台
    public static PLATFORM = {
        WX: 'wx',
        TT:'tt',
        COCOSPLAY: 'cocosplay',
        ANDROID: 'android',
        APPSTORE: 'appstore'
    }


    //碰撞分组
    public static CollisionType = {
        PLAYER: 1 << 1,
        TARGET: 1 << 2,
        TRIGER: 1 << 3,
    }
    //场景元素的状态
    public static TARGETSTATE = {
        IDLE: 1, //待机
        SCARE:2, //惊吓
        DIEING: 3,//被吞噬
    }

    //事件枚举
    public static EVENT_TYPE = {
        ON_INIT_GAME: "onInitGame",//初始化游戏
        ON_GAME_START: "onGameStart",//闯关开始
        ON_GAME_OVER: "onGameOver",//游戏结束
        ON_REVIVE: "onRevive",//游戏复活
        REFRESH_LEVEL: "refreshLevel",//刷新等级
        REFRESH_COIN: "refreshcoin",//刷新等级

    }
}
