// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class ItemSelect extends cc.Component {

    @property(cc.Sprite)
    avatar: cc.Sprite

    @property(cc.Sprite)
    select: cc.Sprite

    @property(cc.Node)
    selectNode: cc.Node


    setUp(avatar: cc.SpriteFrame, select: cc.SpriteFrame) {
        this.avatar.spriteFrame = avatar
        this.select.spriteFrame = select
    }
}
