// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class ContantEventName extends cc.Component {

    public static client_login = "client_login"
    public static server_login = "server_login"

    public static client_get_list_chat = "client_get_list_chat"
    public static server_send_list_chat = "server_send_list_chat"

    public static client_chat_message = "client_chat_message"
    public static server_chat_message = "server_chat_message"

    public static client_feedback_game = "client_feedback_game"

    public static client_send_base_64 = "client_send_base_64"
    public static server_send_url = "server_send_url"

    public static client_update_profile = "client_update_profile"
    public static server_update_profile = "server_update_profile"

    public static client_create_chat_message = "client_create_chat_message"
    public static server_create_chat_message = "server_create_chat_message"
}
