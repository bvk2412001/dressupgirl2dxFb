// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class ContantSpines extends cc.Component {
    public static bag = "bag"
    public static earing = "earing"
    public static neckasset = "neckasset"
    public static glasses = "glasses"
    public static shoe = "shoe"
    public static hairside = "hairside"
    public static hairfront = "hairfront"
    public static coat = "coat"
    public static clothestop = "clothestop"
    public static clotheslow = "clotheslow"
    public static dress = "dress"
    public static sock = "sock"
    public static faceasset = "faceasset"
    public static eye = "eye"
    public static eyebrow = "eyebrow"
    public static mouth = "mouth"
    public static body = "body"
    public static hairback = "hairback"
    public static wing = "wing"
    public static headasset = "headasset"
}
