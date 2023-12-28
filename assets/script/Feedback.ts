// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import Config from "./common/Config";
import ContantEventName from "./common/ContantEventName";
import Context from "./common/Context";
import { Native } from "./common/Enum";
import Tools from "./common/Tools";
import SocketRun from "./plugin/SocketRun";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Feedback extends cc.Component {
    @property(cc.EditBox)
    editBox

    @property(cc.Node)
    noti: cc.Node

    start() {
    }

    btnSend() {
        if (this.editBox.string.trim()) {
            let native = ""
            if (Config.native == Native.Web) {
                native = "facebook"
            }
            else {
                native = "Mobile facebook"
            }
            let dataTransfer = {
                game_name: Config.key,
                user_locale: Context.getInstance().locale,
                language: "",
                feedbackContent: this.editBox.string,
                native: native
            }

            SocketRun.getInstance().send(ContantEventName.client_feedback_game, dataTransfer)
            this.editBox.string = ""
            this.node.active = false
        }
        else{
            this.noti.active = true
            this.scheduleOnce(()=>{
                this.noti.active = false
            }, 1)
        }
    }

    off() {
        this.node.destroy()
    }

    update(deltaTime: number) {
        this.node.setContentSize(Tools.getSizeWindow(1080, 1920))
    }
}
