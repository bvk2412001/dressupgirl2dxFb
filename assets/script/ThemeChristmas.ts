// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import Tools from "./common/Tools";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ThemeChristmas extends cc.Component {

    off(){
        this.node.destroy()
    }

    update(){
        this.node.setContentSize(Tools.getSizeWindow(1080, 1920))
    }
}
