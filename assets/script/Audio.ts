// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import AudioController from "./AudioController";
import Tools from "./common/Tools";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Audio extends cc.Component {

    @property(cc.Node)
    tickSound: cc.Node

    @property(cc.Node)
    tickMusic: cc.Node

    start() {
        if (Tools.getDataStorage("sound")) {
            this.tickSound.active = Tools.getDataStorage("sound")
        }

        if (Tools.getDataStorage("music")) {
            this.tickMusic.active = Tools.getDataStorage("music")
        }

    }


    selectSound() {
        if (this.tickSound.active == false) {
            this.tickSound.active = true
            Tools.saveDataStorage("sound", true)
            AudioController.instance.setSound(true)
        }
        else {
            this.tickSound.active = false
            Tools.saveDataStorage("sound", false)
            AudioController.instance.setSound(false)
        }
    }

    selectMusic() {
        if (this.tickMusic.active == false) {
            this.tickMusic.active = true
            Tools.saveDataStorage("music", true)
            AudioController.getInstance().playBGMusic()
        }
        else {
            this.tickMusic.active = false
            Tools.saveDataStorage("music", false)
            cc.audioEngine.stop(AudioController.getInstance().bgm)
        }
    }

    off() {
        this.node.destroy()
    }

    update(deltaTime: number) {

    }
}
