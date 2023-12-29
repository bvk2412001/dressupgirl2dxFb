// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import Config from "./common/Config";
import StaticData from "./common/StaticData";
import Tools from "./common/Tools";
import { fireBase } from "./firebase/fireBase";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MessageChat extends cc.Component {
    @property(cc.Node)
    inf: cc.Node

    @property(cc.Sprite)
    avatar: cc.Sprite

    @property(cc.Label)
    userName: cc.Label

    @property(cc.Label)
    message: cc.Label

    @property(cc.Node)
    doll: cc.Node

    @property(cc.Sprite)
    localeSprite: cc.Sprite

    dataChat

    textureAvatar
    textureLocale

    @property(cc.SpriteFrame)
    avatarDefault: cc.SpriteFrame

    @property(cc.Node)
    commingSoon: cc.Node

    @property(cc.Node)
    loading: cc.Node


    isEdit
    type
    avatarUrl
    isRepeate = false
    userName1
    locale
    setUp(avatar, isRepeat, userName, locale) {
        this.avatarUrl = avatar;
        this.userName1 = userName
        this.locale = locale
        this.isRepeate = isRepeat
        this.avatar.node.active = false
        if (isRepeat == true) {
            this.inf.destroy()
        }
        else {
            this.isEdit = false
            Tools.loadFBavatar(StaticData.flagImg[locale], (err, sp) => {
                if (err) {
                    return
                }

                if (this.node) {
                    this.textureLocale = sp.texture
                    this.localeSprite.spriteFrame = sp;
                    this.textureLocale = sp.getTexture()
                }
            });


            if (avatar.length == 1) {
                console.log(avatar)
                Tools.LoadSpriteFrameFromPatch("texture/chat/avatar " + avatar, (err, spriteFrame: cc.SpriteFrame) => {
                    if (this.node) {
                        this.avatar.spriteFrame = spriteFrame
                        this.avatar.node.active = true
                        this.textureAvatar = spriteFrame.getTexture()
                    }

                })

            }
            else {
                console.log(avatar)
                Tools.loadFBavatar(avatar, (err, spriteFrame: cc.SpriteFrame, texture) => {
                    console.log(spriteFrame)
                    if (this.node) {
                        this.avatar.spriteFrame = spriteFrame
                        this.avatar.node.active = true
                    }
                })
            }
            this.userName.string = userName
        }
    }


    release() {
        cc.assetManager.releaseAsset(this.textureAvatar)
        cc.assetManager.releaseAsset(this.textureLocale)
    }

    protected onDestroy(): void {
        //this.release()
    }

    btnChat(){
        fireBase.instance.LogEvent("btnschatMessage" + Config.keyFirebase)
        this.commingSoon.active = true
        this.scheduleOnce(()=>{
            this.commingSoon.active = false
        }, 1)
    }
}
