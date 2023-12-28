// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import ContantEventName from "../common/ContantEventName";
import Context from "../common/Context";
import Tools from "../common/Tools";

const {ccclass, property} = cc._decorator;

@ccclass
export default class HandleMessage extends cc.Component {
    static onlistening(eventName, ...args) {
        console.log(args, "test")
        const dataServer = args[0];
        const data = dataServer.data
        console.log("<<<=============================", eventName, data, dataServer.message);

        if (dataServer.success == false) {

        }

        switch (eventName) {
            case ContantEventName.server_send_list_chat:
                break;

            case ContantEventName.server_login:
                Tools.saveDataStorage("account", data)
                Context.getInstance().user = data
                Context.getInstance().indexLoadRes++
                break;

            case ContantEventName.server_update_profile:
                Tools.saveDataStorage("account", data)
                Context.getInstance().user = data
                break;
        }


        cc.director.emit(eventName, data)
    }
}
