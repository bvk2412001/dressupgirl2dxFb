// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class ItemInSence extends cc.Component {
    @property(cc.EditBox)
    editbox: cc.EditBox

    @property(cc.Label)
    message: cc.Label

    @property(cc.Sprite)
    avatar: cc.Sprite

    @property(cc.Node)
    holder: cc.Node

    type123

    getType(){
        return this.type123
    }
    path
    setUp(sprite: cc.SpriteFrame){
        this.path = sprite.name
        this.avatar.spriteFrame = sprite
        this.node.setContentSize(new cc.Size(this.avatar.node.getContentSize().width * this.avatar.node.scale, this.avatar.node.getContentSize().height * this.avatar.node.scale))
    }

    zoomOut() {
        if (this.avatar.node.scale < 1.6) {
            this.avatar.node.scale += 0.1
            if(this.avatar.node.parent.name == "body") {
                this.avatar.node.parent.setContentSize(new cc.Size(this.avatar.node.getContentSize().width * this.avatar.node.scale, this.avatar.node.getContentSize().height * this.avatar.node.scale))
            }
            this.node.setContentSize(new cc.Size(this.avatar.node.getContentSize().width * this.avatar.node.scale, this.avatar.node.getContentSize().height * this.avatar.node.scale))
        }
    }


    zoomIn() {
        if (this.avatar.node.scale > 0.6) {
            if (this.avatar.node.getContentSize().width * this.avatar.node.scale < 70 || this.avatar.node.getContentSize().height * this.avatar.node.scale < 70) {
                if (this.avatar.node.getContentSize().height * this.avatar.node.scale > this.avatar.node.getContentSize().width
                    && this.avatar.node.getContentSize().height * this.avatar.node.scale >= this.avatar.node.getContentSize().height) {
                    this.avatar.node.scale -= 0.1
                    if(this.avatar.node.parent.name == "body") {
                        this.avatar.node.parent.setContentSize(new cc.Size(this.avatar.node.getContentSize().width * this.avatar.node.scale, this.avatar.node.getContentSize().height * this.avatar.node.scale))
                    }
                    this.node.setContentSize(new cc.Size(this.avatar.node.getContentSize().width * this.avatar.node.scale, this.avatar.node.getContentSize().height * this.avatar.node.scale))
                }
            }
            else {
                this.avatar.node.scale -= 0.1
                if(this.avatar.node.parent.name == "body") {
                    this.avatar.node.parent.setContentSize(new cc.Size(this.avatar.node.getContentSize().width * this.avatar.node.scale, this.avatar.node.getContentSize().height * this.avatar.node.scale))
                }
                this.node.setContentSize(new cc.Size(this.avatar.node.getContentSize().width * this.avatar.node.scale, this.avatar.node.getContentSize().height * this.avatar.node.scale))
            }
        }


    }

    update(deltaTime: number) {
        if(this.editbox){
            this.message.verticalAlign = cc.Label.VerticalAlign.CENTER
            this.message.horizontalAlign = cc.Label.HorizontalAlign.CENTER
            this.holder.setContentSize(new cc.Size(150, 70))
            this.holder.getComponent(cc.Widget).verticalCenter = 0
            this.holder.getComponent(cc.Widget).horizontalCenter = 0
        }

    }
}
