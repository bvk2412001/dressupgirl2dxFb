// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import WaittingInSence from "../WaitingInsence";

const {ccclass, property} = cc._decorator;

@ccclass
export default class StaticData extends cc.Component {
    public static maxSize = null

    public static doll: cc.Prefab
    public static itemInSence: cc.Prefab
    public static itemGallery: cc.Prefab
    public static itemGalleryMobile: cc.Prefab

    public static colorSelectChat
    public static colorChatOther
    public static colorSelectCategory
    public static colorChatUser
    public static process = null

    public static flagImg

    public static waittingInsence: WaittingInSence

    public static timeLockImage = 0

    setTimeLockImage(timeLockImage: number){
        setTimeout(()=>{

        }, timeLockImage * 1000)
    }

    
}
