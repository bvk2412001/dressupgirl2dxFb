// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class ItemButton extends cc.Component {
    @property(cc.Sprite)
    avatar: cc.Sprite

    @property(cc.Node)
    select: cc.Node

    
    @property(cc.Node)
    lock: cc.Node

    callbackLock
    path
    setUp(buttonSprite: cc.SpriteFrame, path, size) {
        this.path = path
        const realW = buttonSprite.getRect().width
        const realH = buttonSprite.getRect().height

        let ratio = realW / size
        let itemW = size
        let itemH = realH / ratio

        if (itemH > size) {
            ratio = itemH / size
            itemH = size
            itemW = itemW / ratio
        }

        if (realW < size && realH < size) {
            this.avatar.node.setContentSize(new cc.Size(itemW * 0.6, itemH * 0.6));

        } else {
            this.avatar.node.setContentSize(new cc.Size(itemW, itemH));

        }
        this.avatar.spriteFrame = buttonSprite
    }

    setupBg(buttonSprite: cc.SpriteFrame, path) {
        this.path = path
        this.avatar.spriteFrame = buttonSprite
    }

    start() {

    }

    callbackClick
    setUpCallback(callback) {
        this.callbackClick = callback
    }


    onClick() {
        this.callbackClick()
    }


    btnLock(){
        this.callbackLock()
    }
    update(deltaTime: number) {

    }
}
