// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class Config extends cc.Component {

    public static key = "DressUp_Girl2xv1"
    public static debug = false
    public static ANDROID = 2;
    public static FACEBOOK = 1;
    public static IOS = 3;
    public static WEB = 4;
    public static platform = Config.ANDROID;
    public static os = cc.sys.os;
    public static version = "1.0.0"
    public static native = 0
    //public static urlDev = "192.168.31.156:3000"
    public static urlDev = "192.168.1.10:8687"
    public static urlLive = "https://maxgame.vxh87.online/"   
    public static keyFirebase = 6
    public static url = null
}
