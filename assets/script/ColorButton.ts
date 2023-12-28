// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class ColorButton extends cc.Component {
    @property(cc.Sprite)
    mainColor: cc.Sprite

    @property(cc.Sprite)
    subColor: cc.Sprite

    @property(cc.SpriteFrame)
    defaultColor: cc.SpriteFrame

    start() {

    }


    setUp(index, colorMain, colorSub){
        if(index == 0){
            this.mainColor.spriteFrame = this.defaultColor
            this.subColor.node.active = false
        }
        else{
            this.mainColor.node.color = colorMain
            this.subColor.node.color = colorSub
        }
    }

    update(deltaTime: number) {
        
    }
}
