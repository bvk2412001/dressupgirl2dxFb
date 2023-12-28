import AudioController from "./AudioController";
import Doll from "./Doll";
import ItemGallery from "./ItemGallery";
import Config from "./common/Config";
import ContantEventName from "./common/ContantEventName";
import ContantSpines from "./common/ContantSpines";
import Context from "./common/Context";
import { category } from "./common/Enum";
import FbSdk from "./common/FbSdk";
import StaticData from "./common/StaticData";
import Tools from "./common/Tools";
import { fireBase } from "./firebase/fireBase";
import SocketRun from "./plugin/SocketRun";
import Mobile from "./sence/Mobile";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Gallery extends cc.Component {

    @property(cc.ScrollView)
    listGallery: cc.ScrollView

    isPhoto = false
    @property(cc.Label)
    titleGallery: cc.Label

    @property(cc.Prefab)
    itemGallery: cc.Prefab

    @property(cc.Node)
    bgTop: cc.Node

    @property(cc.Node)
    bgBottom: cc.Node

    @property(cc.Node)
    notifyLockImage: cc.Node

    @property(cc.Label)
    timeBlock: cc.Label

    @property(cc.Node)
    lockNode: cc.Node

    @property(cc.Label)
    timeCountDown: cc.Label

    protected onLoad(): void {
        
    }


    serverSendCreateChat(data) {

        StaticData.waittingInsence.hide()
        console.log(data)
        this.close()
        Mobile.ins.btnChat()
    }

    protected start(): void {
        cc.director.on(ContantEventName.server_create_chat_message, this.serverSendCreateChat, this);
        fireBase.instance.LogEvent("Gallery" + Config.keyFirebase)
        this.setUpGallery()

        if (Tools.getDataStorage("theme")) {
            this.setTheme(Tools.getDataStorage("theme"))
        }
        else {
            this.setTheme(0)
        }
    }


    show() {
        this.node.active = true
        this.setUpGallery()
    }

    setUpGallery() {

        this.listGallery.content.destroyAllChildren()

        let list = []
        if (Tools.getDataStorage("photos")) {
            list = Tools.getDataStorage("photos")
        }

        this.titleGallery.string = "(" + list.length + ")"
        let index = 8
        if (list.length > 8) {
            index = list.length
        }
        console.log(index)
        for (let i = 0; i < index; i++) {
            console.log("khoa", i, list.length)
            if (i < list.length) {
                console.log(this.itemGallery)
                let newItemm = cc.instantiate(this.itemGallery)

                this.listGallery.content.addChild(newItemm)
                // if (Web.ins) {
                //     newItemm = instantiate(StaticData.itemGallery)
                //     this.listGallery.content.addChild(newItemm)
                //     Tools.addDoll(newItemm.getComponent(ItemGallery).bg, 0.5, list[i])

                // }

                if (Mobile.ins) {
                    Tools.addDoll(newItemm.getComponent(ItemGallery).bg, 0.65, list[i])
                }


                if (Mobile.ins && Mobile.ins?.indexEdit == i) {
                    newItemm.getComponent(ItemGallery).select.active = true
                }
                // if (Web.ins?.indexEdit == i) {
                //     newItemm.getComponent(ItemGallery).select.active = true
                // }
                newItemm.getComponent(ItemGallery).setup(() => {
                    // if (Web.ins) {
                    //     Web.ins.offZoomItem()
                    //     Web.ins.indexEdit = i
                    //     this.listGallery.content.children.forEach(child => {
                    //         child.getComponent(ItemGallery).select.active = false
                    //     })
                    //     newItemm.getComponent(ItemGallery).select.active = true

                    //     console.log("check")

                    //     Web.ins.character.getComponent(Doll).listSkeleton.forEach(skeleton => {
                    //         skeleton._skeleton.slots.forEach(slot => {
                    //             if (slot.data.name != ContantSpines.body) {
                    //                 skeleton.setAttachment(slot.data.name, "undefined")
                    //             }
                    //         })
                    //         skeleton.setAttachment("blank", "blank")

                    //     })
                    //     list[i].forEach((slot, index) => {
                    //         slot.forEach(item => {
                    //             Tools.setSpineSave(Web.ins.character.getComponent(Doll).listSkeleton[index], item.nameSlot, item.nameItem, item.color)
                    //         })

                    //     })

                    //     Web.ins.saveProcess()
                    // }

                    if (Mobile.ins) {
                        Mobile.ins.offZoomItem()
                        Mobile.ins.indexEdit = i
                        this.listGallery.content.children.forEach(child => {
                            child.getComponent(ItemGallery).select.active = false
                        })
                        newItemm.getComponent(ItemGallery).select.active = true

                        Mobile.ins.character.getComponent(Doll).listSkeleton.forEach((skeleton, index) => {
                            skeleton.skeletonData.skeletonJson.slots.forEach(slot => {
                                if (slot.name != ContantSpines.body) {
                                    skeleton.setAttachment(slot.name, null)
                                }
                            })
                            if (index != category.body)
                                skeleton.setAttachment("blank", "blank")

                        })
                        list[i].forEach((slot, index) => {
                            slot.forEach(item => {
                                Tools.setSpineSave(Mobile.ins.character.getComponent(Doll).listSkeleton[index], item.nameSlot, item.nameItem, item.color)
                            })

                        })
                    }
                }, () => {
                    AudioController.instance.playDeleteSound()
                    // if (Web.ins) {
                    //     Web.ins.offZoomItem()
                    //     list.splice(i, 1)
                    //     if (Web.ins.indexEdit == i) {
                    //         Web.ins.indexEdit = -1
                    //     }
                    // }
                    if (Mobile.ins) {
                        Mobile.ins.offZoomItem()
                        list.splice(i, 1)
                        if (Mobile.ins.indexEdit == i) {
                            Mobile.ins.indexEdit = -1
                        }
                    }
                    Tools.saveDataStorage("photos", list)
                    this.setUpGallery()
                },
                    () => {
                        let that = Mobile.ins
                        // if (Web.ins) {
                        //     that = Web.ins
                        // }
                        // else {
                        //     that = Mobile.ins
                        // }
                        if (this.isPhoto == false) {
                            this.isPhoto = true
                            that.bgShare.destroyAllChildren()
                            let newDoll = cc.instantiate(StaticData.doll)
                            that.bgShare.addChild(newDoll)
                            newDoll.getChildByName("body").setScale(new cc.Vec3(1.4, 1.4, 1))
                            newDoll.getChildByName("body").setPosition(new cc.Vec3(0, 300, 0))
                            // if (Web.ins) {
                            //     newDoll.getChildByName("body").setScale(new Vec3(1.2, 1.2, 1))
                            // }
                            // else {
                            //     newDoll.getChildByName("body").setScale(new Vec3(1.4, 1.4, 1))
                            //     newDoll.getChildByName("body").setPosition(new Vec3(0, 300, 0))
                            // }
                            list[i].forEach((slot, index) => {
                                slot.forEach(item => {
                                    Tools.setSpineSave(newDoll.getComponent(Doll).listSkeleton[index], item.nameSlot, item.nameItem, item.color)
                                })

                            })


                            let isLoadBg = false
                            Tools.LoadSpriteFrameFromPatch(`/texture/bg/bg (2)`, (err, spriteFrame) => {
                                that.bgShare.getComponent(cc.Sprite).spriteFrame = spriteFrame
                                isLoadBg = true
                            })

                            let wait = () => {
                                if (isLoadBg == true) {
                                    FbSdk.getInstance().Share(Tools.takePhoto(that.bgShare, that.nodeTest.getContentSize().height), "Play full game: " + "https://dressupgirl.online/", () => {

                                    })
                                }
                                else {
                                    this.scheduleOnce(() => {
                                        wait()
                                    }, 0.1)
                                }
                            }

                            wait()
                        }
                    })

            }
            else {
                let newItemm
                // if (Web.ins) {
                //     newItemm = instantiate(StaticData.itemGallery)
                //     this.listGallery.content.addChild(newItemm)

                // }
                if (Mobile.ins) {
                    newItemm = cc.instantiate(this.itemGallery)

                }


                this.listGallery.content.addChild(newItemm)
                newItemm.getComponent(ItemGallery).delete.active = false
                newItemm.getComponent(ItemGallery).fb.active = false
            }

        }

    }


    close() {
        if (Mobile.ins) {
            Mobile.ins.bottom.active = true
            Mobile.ins.listButton.active = true
            this.node.destroy()
        }
    }

    setTheme(index) {
        if (Mobile.ins) {
            this.bgTop.color = Mobile.ins.listColor2[index]
            this.bgBottom.color = Mobile.ins.listColor1[index]
        }

    }

    update() {
        this.node.setContentSize(Tools.getSizeWindow(1080, 1920))
        this.optimizeScrollView(this.listGallery)
        if(StaticData.timeLockImage > 0){
            this.lockNode.active = true
            this.timeCountDown.string = StaticData.timeLockImage + "s"
        }
        else{
            this.lockNode.active = false
        }
    }

    optimizeScrollView(scrollView: cc.ScrollView) {

        let view2 = scrollView.node.getChildByName("view");
        let view = view2.getBoundingBox();
        let width = scrollView.content.getContentSize().width
        if (view) {

            var viewRect = cc.rect(
                - scrollView.content.getBoundingBox().x - 400,
                - 0,
                view.width,
                view.height);

            for (let i = 0; i < scrollView.content.children.length; i++) {
                const node = scrollView.content.children[i];
                if (viewRect.intersects(node.getBoundingBox())) {
                    if (node) {
                        node.opacity = 255;
                    }

                }
                else {
                    if (node) {
                        node.opacity = 0;
                    }
                }
            }

        }
    }

    btnSendToChat() {
        if(StaticData.timeLockImage == 0){
            Context.getInstance().setTimeLockImage(30)
            SocketRun.getInstance().send(ContantEventName.client_create_chat_message,
                {
                    sender: Context.getInstance().user._id,
                    message: { type: 1, data: Tools.saveDoll(Mobile.ins.character.getComponent(Doll)) },
                    locale: Context.getInstance().user.locale
                })
            StaticData.waittingInsence.show()
        }
        else {
            this.notifyLockImage.active = true
            this.timeBlock.string = StaticData.timeLockImage + "s"
            this.scheduleOnce(()=>{
                this.notifyLockImage.active = false
            }, 1)
        }
        

    }


    protected onDestroy(): void {
        cc.director.off(ContantEventName.server_create_chat_message, this.serverSendCreateChat, this)
    }
}
