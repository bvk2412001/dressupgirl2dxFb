import ContantGame from "./common/ContantGame";
import Tools from "./common/Tools";

const { ccclass, property } = cc._decorator;

@ccclass
export default class WaittingInSence extends cc.Component {
    protected onLoad(): void {
        this.hide()
    }

    hide(){
        this.node.active = false
    }


    show(){
        this.node.active = true
    }

    protected update(dt: number): void {
        this.node.setContentSize(Tools.getSizeWindow(ContantGame.mobile_width, ContantGame.mobile_height))
    }
}
