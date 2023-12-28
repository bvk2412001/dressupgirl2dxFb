// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import Config from "../common/Config";
import ContantEventName from "../common/ContantEventName";
import Context from "../common/Context";
import FbSdk from "../common/FbSdk";
import RandomName from "../common/RandomName";
import Tools from "../common/Tools";
import HandleMessage from "./HandleMessage";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SocketRun {

    public static ins: SocketRun = null;

    public static getInstance() {
        if (this.ins == null)
            this.ins = new SocketRun();
        return this.ins;
    }

    private io = null;
    private socket = null;
    constructor() {
        if (!window.io) {
        }

        this.io = window.io;
    }

    connect() {
        if (Config.debug) {
            Config.url = Config.urlDev
        }
        else {
            Config.url = Config.urlLive
        }

        this.socket = this.io.connect(Config.url);

        this.socket.on("connect", () => {
            SocketRun.getInstance().send(ContantEventName.client_login,
                {
                    userCode: FbSdk.getInstance().dataFb.fbId,
                    userName: FbSdk.getInstance().dataFb.sender,
                    photoUrl: FbSdk.getInstance().dataFb.photoURL,
                    locale: FbSdk.getInstance().dataFb.locale

                })



            this.socket.onAny((eventName, ...args) => {
                HandleMessage.onlistening(eventName, ...args);
            });

        })


    }

    update(deltaTime: number) {

    }

    send(eventName, data = null) {
        if (this.socket) {
            console.log("=============================>>>", eventName, data);
            if (data != null) {
                this.socket.emit(eventName, data);
            } else
                this.socket.emit(eventName);
        }
    }
}
