// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import Tools from "./common/Tools";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Theme extends cc.Component {
    @property(cc.Node)
    listTheme: cc.Node


    selectThemeCallBack
    start() {

        if (Tools.getDataStorage("theme")) {
            this.listTheme.children[Tools.getDataStorage("theme")].getChildByName("theme select").active = true
        }
        else {
            Tools.saveDataStorage("theme", 0)
            this.listTheme.children[Tools.getDataStorage("theme")].getChildByName("theme select").active = true
        }
    }


    setUp(selectThemeCallback) {
        this.selectThemeCallBack = selectThemeCallback;
    }


    actionSelectTheme(event, args) {
        this.selectThemeCallBack(Number(args))
        this.listTheme.children.forEach(element => {
            element.getChildByName("theme select").active = false
        })
        event.target.getChildByName("theme select").active = true
        Tools.saveDataStorage("theme", Number(args))
    }

    onClose(){
        this.node.destroy()
    }

    update(deltaTime: number) {
        this.node.setContentSize(Tools.getSizeWindow(1080, 1920))
    }
}
