import Config from "./common/Config";
import ContantGame from "./common/ContantGame";
import { Native, effect } from "./common/Enum";
import Tools from "./common/Tools";
import Mobile from "./sence/Mobile";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Effect extends cc.Component {
    @property(cc.Node)
    listSelection: cc.Node

    @property(cc.Node)
    notify: cc.Node
    indexSelect = ""

    start() {

        this.indexSelect = Tools.getDataStorage("effect")
        if (Tools.getDataStorage("effect")) {
            this.setStateBtnSelect(Number(Tools.getDataStorage("effect")))
        }
        else {
            this.setStateBtnSelect(1)
        }
    }


    selectEffect(event, args) {
        this.indexSelect = args
        this.setStateBtnSelect(Number(args))
        if (Mobile.ins) {
            Mobile.ins.selectEffect(args)
        }
    }


    setStateBtnSelect(index: number) {
        this.listSelection.children.forEach(element => {
            element.getChildByName("theme select").active = false
        })


        this.listSelection.children[index].getChildByName("theme select").active = true
    }

    btnClose() {
        
        Mobile.ins.selectEffect(Tools.getDataStorage("effect"))
        this.node.destroy()
    }

    update(deltaTime: number) {
        if (Config.native == Native.Mobile) {
            this.node.setContentSize(Tools.getSizeWindow(ContantGame.mobile_width, ContantGame.mobile_height))
        }
        else {
            this.node.setContentSize(Tools.getSizeWindow(ContantGame.web_width, ContantGame.web_height))
        }
    }

    btnOk() {
        this.node.destroy()
        Tools.saveDataStorage("effect", this.indexSelect)

    }

    protected onDestroy(): void {
    }

    showNotify() {
        this.notify.active = true
        this.scheduleOnce(() => {
            this.notify.active = false
        }, 2)
    }
}
