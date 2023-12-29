// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import AudioController from "./AudioController";
import ItemGallery from "./ItemGallery";
import MessageChat from "./MessageChat";
import Config from "./common/Config";
import ContantEventName from "./common/ContantEventName";
import Context from "./common/Context";
import StaticData from "./common/StaticData";
import Tools from "./common/Tools";
import { fireBase } from "./firebase/fireBase";
import SocketRun from "./plugin/SocketRun";
import Mobile from "./sence/Mobile";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Chat extends cc.Component {
    @property(cc.Label)
    localeChat: cc.Label

    @property(cc.Prefab)
    messageUser: cc.Prefab

    @property(cc.Prefab)
    messagePlayer: cc.Prefab

    @property(cc.Prefab)
    messageDollPlayer: cc.Prefab

    @property(cc.Prefab)
    messageDollUser: cc.Prefab

    @property(cc.Node)
    selectLocale: cc.Node

    @property(cc.Node)
    selectGlobal: cc.Node

    @property(cc.Node)
    uiCreateAccout: cc.Node

    @property(cc.Sprite)
    avatar: cc.Sprite

    @property(cc.EditBox)
    nameUser: cc.EditBox

    @property(cc.EditBox)
    message: cc.EditBox

    @property(cc.ScrollView)
    listChat: cc.ScrollView

    @property(cc.Sprite)
    localeSprite: cc.Sprite

    @property(cc.ScrollView)
    listPhotoChat: cc.ScrollView

    @property(cc.Node)
    nodePhotoChat: cc.Node
    @property(cc.Node)
    bgTopChat: cc.Node

    @property(cc.Node)
    bgBottomChat: cc.Node

    @property(cc.Node)
    bgChatBot: cc.Node

    @property(cc.Node)
    bg: cc.Node

    @property(cc.Prefab)
    itemGallery: cc.Prefab

    @property(cc.Node)
    scrollDown: cc.Node

    @property(cc.Node)
    noDoll: cc.Node

    @property(cc.Node)
    blockChat: cc.Node

    @property(cc.Label)
    timeBlock: cc.Label


    roomNo = Context.getInstance().locale
    lastId = null

    @property(cc.Node)
    notifyLockImage: cc.Node

    @property(cc.Node)
    lockNode: cc.Node

    @property(cc.Label)
    timeCountDown: cc.Label

    @property(cc.Node)
    imagebtn: cc.Node

    protected onLoad(): void {

        cc.director.on(ContantEventName.server_update_profile, this.serverSendUpdateAccount, this);
        cc.director.on(ContantEventName.server_send_list_chat, this.serverSendListChat, this);
        cc.director.on(ContantEventName.server_chat_message, this.serverSendChat, this);
    }


    protected start(): void {
        fireBase.instance.LogEvent("Chat" + Config.keyFirebase)
        this.listChat.node.on('scroll-to-top', this.checkTopScroll, this)
        if (Tools.getDataStorage("theme")) {
            this.setTheme(Tools.getDataStorage("theme"))
        }
        else {
            this.setTheme(0)
        }
        this.setUpChat()

        this.nameUser.string = Context.getInstance().user.userName
        Tools.LoadSpriteFrameFromPatch("texture/chat/avatar " + Context.getInstance().user.photoUrl, (err, spriteFrame: cc.SpriteFrame) => {
            this.avatar.spriteFrame = spriteFrame
        })

        Tools.loadFBavatar(StaticData.flagImg[Context.getInstance().user.locale], (err, sp) => {
            if (err) {
                return
            }

            if (this.node) {
                this.localeSprite.spriteFrame = sp;
            }
        });

        this.nameUser.node.on('editing-did-began', () => {
            if (this.nameUser.string.trim()) {
                SocketRun.getInstance().send(ContantEventName.client_update_profile,
                    {
                        userId: Context.getInstance().user._id,
                        userName: this.nameUser.string.trim(),
                        photoUrl: Context.getInstance().user.photoUrl
                    })
            }

        }, this)

        SocketRun.getInstance().send(ContantEventName.client_get_list_chat, { locale: Context.getInstance().user.locale, limit: 20 })
    }

    btnEditName() {
        this.nameUser.focus()
    }
    setUpChat() {
        this.localeChat.string = Context.getInstance().user.locale.toUpperCase()

    }

    checkTopScroll() {
        if (this.lastId) {
            SocketRun.getInstance().send(ContantEventName.client_get_list_chat, { locale: this.roomNo, limit: 20, lastId: this.lastId })
        }

    }

    serverSendUpdateAccount(data) {
        this.nameUser.string = Context.getInstance().user.userName

        Tools.LoadSpriteFrameFromPatch("texture/chat/avatar " + Context.getInstance().user.photoUrl, (err, spriteFrame: cc.SpriteFrame) => {
            this.avatar.spriteFrame = spriteFrame
        })
    }

    setTheme(index) {
        this.bg.color = Mobile.ins.listColor1[index]
        this.bgTopChat.color = Mobile.ins.listColor2[index]
        this.bgBottomChat.color = Mobile.ins.listColor2[index]
        this.bgChatBot.color = Mobile.ins.listColor4[index]


        this.selectLocale.color = StaticData.colorSelectChat
        if (this.roomNo == "global") {
            this.selectLocale.getChildByName("title").color = new cc.Color(255, 255, 255, 255)
            this.selectGlobal.getChildByName("title").color = Mobile.ins.listColor2[index]
        }
        else {
            this.selectLocale.getChildByName("title").color = Mobile.ins.listColor2[index]
            this.selectGlobal.getChildByName("title").color = new cc.Color(255, 255, 255, 255)
        }
        this.selectGlobal.color = StaticData.colorSelectChat
        this.selectLocale.color = StaticData.colorSelectChat
        this.listChat.content.children.forEach(element => {
            if (element.name == "messagePlayer") {
                element.getChildByName("chatmessagebg").color = StaticData.colorChatOther
            }
        })

        this.listChat.content.children.forEach(element => {
            if (element.name == "messageUser") {
                element.getChildByName("chatmessagebg2").color = StaticData.colorChatUser
            }
        })


    }
    serverSendChat(data) {
        if (data.locale == this.roomNo) {
            if (this.listChat.content.children.length > 0) {
                if (data.sender == this.listChat.content.children[0].getComponent(MessageChat).dataChat.sender) {
                    this.createMessage(data, 0, true)
                }
                else {
                    this.createMessage(data, 0, false)
                }
            }
            else {
                this.createMessage(data, 0, false)
            }
        }
    }
    serverSendListChat(data) {
        if (data.roomNo == this.roomNo) {
            this.lastId = data.lastId
            data.listChat.forEach((element, index) => {
                if (index == 0 && this.listChat.content.children.length > 0) {
                    if (element.sender == this.listChat.content.children[this.listChat.content.children.length - 1].getComponent(MessageChat).dataChat.sender) {
                        this.createMessage(element, 999, true)
                    }
                    else {
                        this.createMessage(element, 999, false)
                    }
                }
                else {
                    if (index + 1 < data.listChat.length) {

                        if (element.sender == data.listChat[index + 1].sender) {
                            this.createMessage(element, 999, true)
                        }
                        else {
                            this.createMessage(element, 999, false)
                        }
                    }
                    else {
                        this.createMessage(element, 999, false)
                    }

                }
            })
        }
    }



    createMessage(data, index, isRepeat) {
        let newMess: cc.Node = null
        if (Context.getInstance().user) {
            if (data.sender == Context.getInstance().user._id) {
                if (data.message.type == 0) {
                    newMess = cc.instantiate(this.messageUser)
                    newMess.getComponent(MessageChat).message.string = Tools.filterBadWord(Tools.wrapText(data.message.data, 30))
                    newMess.getChildByName("chatmessagebg2").color = StaticData.colorChatUser
                }
                else {
                    newMess = cc.instantiate(this.messageDollUser)


                }
            }
            else {
                if (data.message.type == 0) {
                    newMess = cc.instantiate(this.messagePlayer)
                    newMess.getComponent(MessageChat).message.string = Tools.filterBadWord(Tools.wrapText(data.message.data, 30))
                    newMess.getChildByName("chatmessagebg").color = StaticData.colorChatOther
                }
                else {
                    newMess = cc.instantiate(this.messageDollPlayer)

                }

                newMess.getComponent(MessageChat).setUp(data.avatar, isRepeat, data.userName, data.country)

            }
        }

        else {
            if (data.message.type == 0) {
                newMess = cc.instantiate(this.messagePlayer)
                newMess.getComponent(MessageChat).message.string = Tools.filterBadWord(Tools.wrapText(data.message.data, 30))
                newMess.getChildByName("chatmessagebg").color = StaticData.colorChatOther
            }
            else {
                newMess = cc.instantiate(this.messageDollPlayer)
            }

            newMess.getComponent(MessageChat).setUp(data.avatar, isRepeat, data.userName, data.country)

        }

        newMess.getComponent(MessageChat).dataChat = data
        if (index != 0) {
            this.listChat.content.addChild(newMess)

        }
        else {
            this.listChat.content.insertChild(newMess, 0)
        }

        if (data.message.type == 1) {
            let callback = () => {
                console.log(Context.getInstance().indexLoadItem, "khoa")
                if (Context.getInstance().indexLoadItem == 19) {
                    newMess.getComponent(MessageChat).loading.active = false
                    Tools.addDoll(newMess.getComponent(MessageChat).doll, 0.8, data.message.data)
                }
                else{
                    this.scheduleOnce(()=>{
                        callback()
                    },0.1)
                }
            }

            callback()
            
        }
    }

    selectAvatar(event, args) {
        event.target.parent.children.forEach(element => {
            if (element.getChildByName("avatar select")) {
                element.getChildByName("avatar select").active = false
            }
        })
        event.target.getChildByName("avatar select").active = true
        SocketRun.getInstance().send(ContantEventName.client_update_profile,
            {
                userId: Context.getInstance().user._id,
                userName: Context.getInstance().user.userName,
                photoUrl: args
            })
    }

    sendAccount() {
        if (Context.getInstance().avatar != "" && this.nameUser.string.trim()) {
            SocketRun.getInstance().send(ContantEventName.client_login,
                {
                    userCode: new Date().getTime() + new Date().toLocaleTimeString() + this.nameUser.string.trim(),
                    userName: this.nameUser.string.trim(),
                    photoUrl: Context.getInstance().avatar,
                    locale: Context.getInstance().user.locale

                })
        }
        else {

        }
    }

    btnBack() {
        AudioController.getInstance().playButtonSound()
        Mobile.ins.bottom.active = true
        Mobile.ins.bg.active = true
        this.node.destroy()
    }

    btnImage() {
        if (StaticData.timeLockImage == 0) {
            AudioController.getInstance().playButtonSound()
            this.listPhotoChat.content.destroyAllChildren()
            this.nodePhotoChat.active = true
            if (Tools.getDataStorage("photos")) {
                let list = Tools.getDataStorage("photos")
                if (list.length > 0) {
                    this.noDoll.active = false
                    for (let i = list.length - 1; i >= 0; i--) {
                        let newItemm = cc.instantiate(this.itemGallery)
                        this.listPhotoChat.content.addChild(newItemm)
                        newItemm.getComponent(ItemGallery).delete.active = false
                        newItemm.getComponent(ItemGallery).fb.active = false

                        let callback = () => {
                            if (Context.getInstance().indexLoadItem == 19) {
                                newItemm.getComponent(ItemGallery).loading.active = false
                                Tools.addDoll(newItemm.getComponent(ItemGallery).bg, 0.5, list[i])
                            }
                            else{
                                this.scheduleOnce(()=>{
                                    callback()
                                },0.1)
                            }
                        }

                        callback()
                        
                        newItemm.getComponent(ItemGallery).setup(() => {
                            console.log(StaticData.timeLockImage)
                            Context.getInstance().setTimeLockImage(30)
                            AudioController.instance.playButtonSound()
                            SocketRun.getInstance().send(ContantEventName.client_chat_message,
                                {
                                    sender: Context.getInstance().user._id,
                                    message: { type: 1, data: list[i] },
                                    locale: this.roomNo
                                })

                            this.nodePhotoChat.active = false
                            this.listPhotoChat.content.destroyAllChildren()


                        }, null, null)
                    }
                }
                else {
                    this.noDoll.active = true
                }
            }
            else {
                this.noDoll.active = true
            }
        }
        else {
            this.notifyLockImage.active = true
            this.timeBlock.string = StaticData.timeLockImage + "s"
            this.scheduleOnce(() => {
                this.notifyLockImage.active = false
            }, 1)
        }
    }

    closeImageChat() {
        this.nodePhotoChat.active = false
    }

    offSelectAccount() {
        this.uiCreateAccout.active = false
    }


    showUICreateAccount() {
        this.uiCreateAccout.active = true
    }


    btnGallery() {
        this.btnBack()
    }

    getChat(event, args) {

        AudioController.getInstance().playButtonSound()
        this.listChat.content.destroyAllChildren()
        this.listChat.stopAutoScroll()
        this.listChat.scrollToBottom(0)
        switch (args) {
            case "0":
                this.blockChat.active = false
                this.selectLocale.getComponent(cc.Sprite).enabled = true
                this.selectGlobal.getComponent(cc.Sprite).enabled = false
                this.roomNo = Context.getInstance().user.locale
                this.selectLocale.getChildByName("title").color = StaticData.colorChatOther

                this.selectGlobal.getChildByName("title").color = new cc.Color(255, 255, 255, 255)

                break;

            case "1":
                this.selectLocale.getComponent(cc.Sprite).enabled = false
                this.selectGlobal.getComponent(cc.Sprite).enabled = true
                this.roomNo = "global"
                this.selectLocale.getChildByName("title").color = new cc.Color(255, 255, 255, 255)
                this.selectGlobal.getChildByName("title").color = StaticData.colorChatOther
                this.blockChat.active = true
                break;


        }

        SocketRun.getInstance().send(ContantEventName.client_get_list_chat, { locale: this.roomNo, limit: 20 })

    }

    sendChatMessage() {
        if (this.message.string.trim()) {
            SocketRun.getInstance().send(ContantEventName.client_chat_message,
                {
                    sender: Context.getInstance().user._id,
                    message: { type: 0, data: this.message.string },
                    locale: this.roomNo
                })

            this.message.string = ""
        }
    }

    protected update(dt: number): void {
        this.optimalScrollView(this.listChat)
        this.node.setContentSize(Tools.getSizeWindow(1080, 1920))

        this.selectLocale.getComponent(cc.Widget).right = this.bgTopChat.getContentSize().width / 2
        this.selectGlobal.getComponent(cc.Widget).left = this.bgTopChat.getContentSize().width / 2

        if (this.listChat.getScrollOffset().y >= this.listChat.content.height - this.listChat.node.height - 500) {
            this.scrollDown.active = false
        }
        else {
            this.scrollDown.active = true
        }

        if (StaticData.timeLockImage > 0) {
            this.lockNode.active = true
            this.timeCountDown.string = StaticData.timeLockImage + "s"
        }
        else {
            this.lockNode.active = false
        }
    }

    btnScrollDown() {
        this.listChat.stopAutoScroll()
        this.listChat.scrollToBottom(0.5, true)
    }

    optimalScrollView(scrollView: cc.ScrollView) {
        if (this.node) {
            let view2 = scrollView.node.getChildByName("view");
            let view = view2.getBoundingBox();
            if (view) {
                if (scrollView.vertical) {
                    var viewRect = cc.rect(- view.width / 2,
                        - scrollView.content.getBoundingBox().y - view.height / 2 - 200,
                        view.width,
                        view.height);
                    for (let i = 0; i < scrollView.content.children.length; i++) {
                        const node = scrollView.content.children[i];
                        if (viewRect.intersects(node.getBoundingBox())) {
                            node.opacity = 255
                        }
                        else {
                            node.opacity = 0


                        }
                    }
                }
            }
        }
    }

}
