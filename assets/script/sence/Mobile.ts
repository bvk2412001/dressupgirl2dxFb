// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import AudioController from "../AudioController";
import AvatarFriend from "../AvatarFriend";
import ColorButton from "../ColorButton";
import Doll from "../Doll";
import ItemButton from "../ItemButton";
import ItemSelect from "../ItemSelect";
import ItemInSence from "../IteminSence";
import Theme from "../Theme";
import ColorPicker from "../common/ColorPicker";
import Config from "../common/Config";
import ContantEventName from "../common/ContantEventName";
import ContantSpines from "../common/ContantSpines";
import Context from "../common/Context";
import DataSaveItem from "../common/DataSaveItem";
import { category, effect } from "../common/Enum";
import FbSdk from "../common/FbSdk";
import StaticData from "../common/StaticData";
import Tools from "../common/Tools";
import { fireBase } from "../firebase/fireBase";
import Language from "../language/Language";
import SocketRun from "../plugin/SocketRun";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Mobile extends cc.Component {
    @property(cc.Node)
    listItemSelect: cc.Node

    @property(cc.Prefab)
    itemSelect: cc.Prefab

    @property(cc.ScrollView)
    listItemButton: cc.ScrollView

    @property(cc.Prefab)
    itemButton: cc.Prefab

    @property(cc.Node)
    bg: cc.Node



    @property(cc.Node)
    canvas: cc.Node

    @property(cc.Node)
    trash: cc.Node

    @property(cc.Prefab)
    colorButton: cc.Prefab

    @property(cc.ScrollView)
    listColorHair: cc.ScrollView

    @property(cc.Node)
    listButton: cc.Node

    @property(cc.Node)
    bottom: cc.Node

    @property(cc.Node)
    ui: cc.Node

    @property(cc.Node)
    option: cc.Node

    @property(cc.Node)
    bgShare: cc.Node

    @property(cc.Camera)
    camera: cc.Camera

    @property(cc.Node)
    nodeTest: cc.Node

    @property(cc.Node)
    loading: cc.Node

    @property(cc.Node)
    bgListCategory: cc.Node

    @property(cc.Node)
    bgListButton: cc.Node

    @property(cc.Node)
    subscribeButton: cc.Node

    @property(cc.Node)
    gamePlay: cc.Node

    @property(cc.Prefab)
    itemInsenceAvatar: cc.Prefab

    @property(cc.Prefab)
    avatarFriend: cc.Prefab


    backHair = ""
    frontHair = ""
    sideHair = ""
    pathBg = "bg (1)"
    character: cc.Node

    audio: cc.Node
    feedback: cc.Node

    @property(cc.Node)
    bgShare1: cc.Node

    @property(cc.Node)
    nodeSetUpShare: cc.Node

    @property(cc.ScrollView)
    listAvatarFriend: cc.ScrollView

    @property(cc.Node)
    particle: cc.Node



    listColor1 = [new cc.Color(71, 87, 154), new cc.Color(215, 96, 167), new cc.Color(63, 157, 180), new cc.Color(116, 80, 170), new cc.Color(216, 159, 87)]
    listColor2 = [new cc.Color(91, 111, 197), new cc.Color(237, 106, 184), new cc.Color(68, 189, 194), new cc.Color(130, 89, 190), new cc.Color(255, 188, 103)]
    listColor3 = [new cc.Color(237, 106, 184), new cc.Color(130, 89, 190), new cc.Color(237, 106, 184), new cc.Color(68, 189, 194), new cc.Color(130, 89, 190)]
    listColor4 = [new cc.Color(177, 191, 254), new cc.Color(255, 201, 224), new cc.Color(159, 244, 230), new cc.Color(210, 180, 254), new cc.Color(255, 244, 191)]


    listNameItemSelect = new Array<String>(20)

    public static ins: Mobile


    public onSubscribeBot() {
        FbSdk.getInstance().SubscribeBot((value) => {
            console.log('Subscribe:', 'finished');
            if (value) {
                FbSdk.getInstance().sendNotification('dressupgirl', true);
                this.node.active = false;
            } else {
                //this.subscibeButton.active = false;
            }
        });
    }

    protected onLoad(): void {

        this.scheduleOnce(() => {
            fireBase.instance.LogEvent("Play game 5s" + Config.keyFirebase)
        }, 5)
        fireBase.instance.LogEvent("loadSuccess" + Config.keyFirebase)
        Mobile.ins = this
        cc.director.on(ContantEventName.server_send_url, this.serverSendUrl, this);

    }

    serverSendUrl(data) {
        if (Config.debug == false) {
            const request = { data: data.secure_url };
            const query = encodeURIComponent(data.secure_url)
            fetch(`https://api.dressupgirl.online/v1/api/upload/?image=${data.secure_url}`)
                .then(res => window.open(`https://www.facebook.com/sharer.php?u="https://api.dressupgirl.online/v1/api/upload/?image=${data.secure_url}"`, '_blank'));
        }
    }

    start(): void {
        if (Tools.getDataStorage("effect")) {
            this.selectEffect(Number(Tools.getDataStorage("effect")))
        }
        else {
            this.selectEffect(1)
            Tools.saveDataStorage("effect", '1')
            this.btnEffect()
        }

        
        this.subscribeButton.active = false;
        FbSdk.getInstance().checkCanSubscribeBot((canSubscribe) => {
            console.log('Can subscribe bot', canSubscribe);
            this.subscribeButton.active = canSubscribe;
            if (!canSubscribe) {
                FbSdk.getInstance().sendNotification('dressupgirl', false);
            }
        })
        if (Tools.getDataStorage("theme")) {
            this.changeTheme(Tools.getDataStorage("theme"))
        }
        else {
            this.changeTheme(0)
        }

        this.listNameItemSelect.fill("")
        this.setUpListItemSelect()
        this.setUpListColor()



        if (StaticData.process) {

            let data = StaticData.process

            Tools.LoadSpriteFrameFromPatch(`texture/bg/bg` + data.bg, (spriteFrame) => {
                this.pathBg = data.bg
                this.bg.getComponent(cc.Sprite).spriteFrame = spriteFrame
                this.saveProcess()
            })
            data.dataPhoto.forEach(element => {
                this.setPhoto(this.bg, element, 1, 1, null, null)
                this.saveProcess()
            })

        }


        else {
            this.character = cc.instantiate(StaticData.doll)
            this.gamePlay.addChild(this.character)
            this.character.getChildByName("body").setScale(new cc.Vec3(1.4, 1.4))
            this.character.setPosition(new cc.Vec3(0, 100, 0))
            this.character.setContentSize(new cc.Size(this.character.getChildByName("body").getContentSize().width * this.character.getChildByName("body").scale, this.character.getChildByName("body").getContentSize().height * this.character.getChildByName("body").scale))
            this.character.on(cc.Node.EventType.TOUCH_START, this.touchStartItem, this)
            this.character.on(cc.Node.EventType.TOUCH_MOVE, this.moveItem, this)
            this.character.on(cc.Node.EventType.TOUCH_END, this.touchEndItem, this)
            this.character.on(cc.Node.EventType.TOUCH_CANCEL, this.touchEndItem, this)
            this.saveProcess()
        }
        this.listItemSelect.on(cc.Node.EventType.TOUCH_START, () => {
            this.offZoomItem()
        })
        this.listItemButton.content.on(cc.Node.EventType.TOUCH_START, () => {
            this.offZoomItem()
        })



    }
    iSelect = false
    setUpListColor() {
        const totalColor = ColorPicker.HAIR_COLOR_LIST.length;
        let count = 0;
        for (let i = 0; i < Math.floor(totalColor / 2); i++) {
            for (let j = 0; j < 2; j++) {
                let colorItem = cc.instantiate(this.colorButton);
                let mainColor = ColorPicker.HAIR_COLOR_LIST[count]
                let subColor = ColorPicker.SUB_HAIR_COLOR_LIST[count]
                let index = count
                colorItem.getComponent(ColorButton).setUp(count, ColorPicker.HAIR_COLOR_LIST[count], ColorPicker.SUB_HAIR_COLOR_LIST[count])

                this.listColorHair.content.addChild(colorItem);
                colorItem.on(cc.Node.EventType.TOUCH_END, () => {
                    AudioController.getInstance().playButtonSound()
                    if (this.indexSelect == category.hairback) {
                        if (index != 0) {
                            this.character.getComponent(Doll).listSkeleton[category.hairback].setAttachment("hairback", null);
                        }
                        else {
                            this.character.getComponent(Doll).listSkeleton[category.hairback].setAttachment("hairback", this.backHair);
                        }

                        Tools.setColorSlot(this.character.getComponent(Doll).listSkeleton[category.hairback], mainColor, "hairback-base")
                        Tools.setColorSlot(this.character.getComponent(Doll).listSkeleton[category.hairback], subColor, "hairback-line")
                    }

                    if (this.indexSelect == category.hairfront) {
                        if (index != 0) {
                            this.character.getComponent(Doll).listSkeleton[category.hairfront].setAttachment("hairfront", null);
                        }
                        else {
                            this.character.getComponent(Doll).listSkeleton[category.hairfront].setAttachment("hairfront", this.frontHair);
                        }

                        Tools.setColorSlot(this.character.getComponent(Doll).listSkeleton[category.hairfront], mainColor, "hairfront-base")
                        Tools.setColorSlot(this.character.getComponent(Doll).listSkeleton[category.hairfront], subColor, "hairfront-line")
                    }

                    if (this.indexSelect == category.hairside) {
                        if (index != 0) {
                            this.character.getComponent(Doll).listSkeleton[category.hairside].setAttachment("hairside", null);
                        }
                        else {
                            this.character.getComponent(Doll).listSkeleton[category.hairside].setAttachment("hairside", this.sideHair);
                        }

                        Tools.setColorSlot(this.character.getComponent(Doll).listSkeleton[category.hairside], mainColor, "hairside-base")
                        Tools.setColorSlot(this.character.getComponent(Doll).listSkeleton[category.hairside], subColor, "hairside-line")
                    }


                }, this)

                count++;
            }
        }

        // this.listColorHair.node.active = false
    }
    setUpListItemSelect() {
        for (let i = 0; i <= 24; i++) {
            let newItem = cc.instantiate(this.itemSelect)
            this.listItemSelect.addChild(newItem)
            let count = 0
            newItem.getChildByName("select").getChildByName("category select bg").color = StaticData.colorSelectCategory
            Tools.loadSpriteFrameAtlasFromPath("texture/category/category", "category " + i, (spriteFrame: cc.SpriteFrame) => {
                newItem.getComponent(ItemSelect).avatar.spriteFrame = spriteFrame
                count++
            })
            Tools.loadSpriteFrameAtlasFromPath("texture/select/select", "select " + i, (spriteFrame: cc.SpriteFrame) => {
                newItem.getComponent(ItemSelect).select.spriteFrame = spriteFrame
                count++
            })


            let call = () => {
                if (count == 2) {
                    if (i == 0) {
                        newItem.getComponent(ItemSelect).selectNode.active = true
                        this.showListItemButton(0)
                    }
                    newItem.on(cc.Node.EventType.TOUCH_END, () => {
                        AudioController.getInstance().playButtonSound()
                        if (this.iSelect == false) {
                            onClick()
                        }


                    }, this)
                    let onClick = () => {

                        this.listItemSelect.children.forEach(item => {
                            item.getComponent(ItemSelect).selectNode.active = false
                        })
                        newItem.getComponent(ItemSelect).selectNode.active = true
                        this.showListItemButton(i)
                        this.scheduleOnce(() => {
                            this.offZoomItem()
                        }, 0.05)
                    }
                }
                else {
                    this.scheduleOnce(() => {
                        call()
                    }, 0.1)
                }
            }

            call()
        }
    }
    indexEdit = -1
    showListItemButton(index, args = null) {
        if (this.indexSelect == index && args == null) return
        if (this.iSelect == false) {
            this.iSelect = true
            this.loading.active = true
            this.listColorHair.node.parent.active = false
            this.listItemButton.content.destroyAllChildren()
            this.indexSelect = index

            switch (index) {
                case category.body:
                    this.loading.active = false
                    this.iSelect = false
                    for (let i = 0; i < ColorPicker.SKIN_COLOR_LIST.length; i++) {
                        this.createButtonBellow(i, null, ColorPicker.SKIN_COLOR_LIST[i], ContantSpines.body)
                    }
                    break

                case category.eyebrow:
                    this.loadAtlas("eyebrow", category.eyebrow, ContantSpines.eyebrow)
                    break

                case category.eye:
                    this.loadAtlas("eye", category.eye, ContantSpines.eye)
                    break

                case category.mouth:
                    this.loadAtlas("mouth", category.mouth, ContantSpines.mouth)
                    break

                case category.faceasset:
                    this.loadAtlas("faceasset", category.faceasset, ContantSpines.faceasset)
                    break

                case category.hairfront:
                    if (this.frontHair == "") {
                        this.listColorHair.node.parent.active = false
                    }
                    else {
                        this.listColorHair.node.parent.active = true
                    }
                    this.loadAtlas("hairfront", category.hairfront, ContantSpines.hairfront)
                    break

                case category.hairback:
                    if (this.backHair == "") {
                        this.listColorHair.node.parent.active = false
                    }
                    else {
                        this.listColorHair.node.parent.active = true
                    }
                    this.loadAtlas("hairback", category.hairback, ContantSpines.hairback)
                    break

                case category.hairside:
                    if (this.sideHair == "") {
                        this.listColorHair.node.parent.active = false
                    }
                    else {
                        this.listColorHair.node.parent.active = true
                    }
                    this.loadAtlas("hairside", category.hairside, ContantSpines.hairside)
                    break

                case category.clothestop:
                    this.loadAtlas("clothestop", category.clothestop, ContantSpines.clothestop)
                    break

                case category.dress:
                    this.loadAtlas("dress", category.dress, ContantSpines.dress)
                    break

                case category.clotheslow:
                    this.loadAtlas("clotheslow", category.clotheslow, ContantSpines.clotheslow)
                    break

                case category.coat:
                    this.loadAtlas("coat", category.coat, ContantSpines.coat)
                    break

                case category.sock:
                    this.loadAtlas("sock", category.sock, ContantSpines.sock)
                    break

                case category.shoe:
                    this.loadAtlas("shoe", category.shoe, ContantSpines.shoe)
                    break

                case category.neckasset:
                    this.loadAtlas("neckasset", category.neckasset, ContantSpines.neckasset)
                    break

                case category.earing:
                    this.loadAtlas("earing", category.earing, ContantSpines.earing)
                    break

                case category.bag:
                    this.loadAtlas("bag", category.bag, ContantSpines.bag)
                    break

                case category.headasset:
                    this.loadAtlas("headasset", category.headasset, ContantSpines.headasset)
                    break

                case category.glasses:
                    this.loadAtlas("glasses", category.glasses, ContantSpines.glasses)
                    break

                case category.wing:
                    this.loadAtlas("wing", category.wing, ContantSpines.wing)
                    break

                case category.key:
                    this.loadAtlas("key", category.key, "key")
                    break

                case category.bg:
                    this.loading.active = false
                    this.iSelect = false
                    for (let i = 0; i < 47; i++) {
                        Tools.LoadSpriteFrameFromPatch(`texture/bg/bg (${i + 1})`, (err, spriteFrame) => {
                            if (this.indexSelect == category.bg) {
                                this.createButtonBellow(i + 1, spriteFrame, null, `bg (${i + 1})`)
                            }
                        })
                    }
                    break

                case category.bubble:
                    this.loadAtlas("bubble", category.bubble, "")
                    break

                case category.pet:
                    this.loadAtlas("pet", category.pet, "")
                    break

                case category.sticker:
                    this.loadAtlas("sticker", category.sticker, "")
                    break
            }
        }

    }


    loadAtlas(key, index, slot) {
        Tools.loadSpriteAtlasFromPath("atlas/buttonBellow/" + key, (spriteAtlas: cc.SpriteAtlas) => {
            this.iSelect = false
            if (this.indexSelect == index) {
                this.loading.active = false
                this.createItemBlank()
                for (let i = 0; i < spriteAtlas.getSpriteFrames().length; i++) {
                    this.createButtonBellow(i + 1, spriteAtlas.getSpriteFrames()[i], null, slot)
                }
            }
        })


    }

    createButtonBellow(index, spriteFrame, color, type) {
        let newItem = cc.instantiate(this.itemButton)
        this.listItemButton.content.addChild(newItem)
        if (this.indexSelect != category.body) {
            if (spriteFrame.name.includes("shop")) {
                newItem.getComponent(ItemButton).lock.active = true
                newItem.getComponent(ItemButton).btnLock = () => {
                    this.btnThemeChristmas()
                }
            }
            if (this.indexSelect > 0 && this.indexSelect < 20) {
                if (this.indexSelect != category.hairback && this.indexSelect != category.hairfront && this.indexSelect != category.hairside) {
                    if (this.listNameItemSelect[this.indexSelect] == spriteFrame.name) {
                        this.listItemButton.content.children.forEach(element => {
                            element.getComponent(ItemButton).select.active = false
                        })
                        newItem.getComponent(ItemButton).select.active = true
                    }
                }
                else {
                    if (this.indexSelect == category.hairback) {
                        if (this.character.getComponent(Doll).listSkeleton[this.indexSelect].findSlot("hairback-base").getAttachment()) {
                            if (this.character.getComponent(Doll).listSkeleton[this.indexSelect].findSlot("hairback-base").getAttachment().name == "hairback/hairback-base/" + spriteFrame.name + "-base") {
                                this.listItemButton.content.children.forEach(element => {
                                    element.getComponent(ItemButton).select.active = false
                                })
                                newItem.getComponent(ItemButton).select.active = true

                            }

                        }
                    }

                    if (this.indexSelect == category.hairfront) {
                        if (this.character.getComponent(Doll).listSkeleton[this.indexSelect].findSlot("hairfront-base").getAttachment()) {
                            if (this.character.getComponent(Doll).listSkeleton[this.indexSelect].findSlot("hairfront-base").getAttachment().name == "hairfront/1/" + spriteFrame.name + "-base") {
                                this.listItemButton.content.children.forEach(element => {
                                    element.getComponent(ItemButton).select.active = false
                                })
                                newItem.getComponent(ItemButton).select.active = true

                            }

                        }
                    }

                    if (this.indexSelect == category.hairside) {
                        if (this.character.getComponent(Doll).listSkeleton[this.indexSelect].findSlot("hairside-base").getAttachment()) {
                            if (this.character.getComponent(Doll).listSkeleton[this.indexSelect].findSlot("hairside-base").getAttachment().name == "hairside/hairside-base/" + spriteFrame.name + "-base") {
                                this.listItemButton.content.children.forEach(element => {
                                    element.getComponent(ItemButton).select.active = false
                                })
                                newItem.getComponent(ItemButton).select.active = true

                            }

                        }
                    }
                }

                newItem.getComponent(ItemButton).setUp(spriteFrame, spriteFrame.name, 130)
                newItem.getComponent(ItemButton).setUpCallback(() => {
                    AudioController.getInstance().playButtonSound()

                    this.listItemButton.content.children.forEach(element => {
                        element.getComponent(ItemButton).select.active = false
                    })
                    newItem.getComponent(ItemButton).select.active = true
                    this.listNameItemSelect[this.indexSelect] = spriteFrame.name

                    if (this.indexSelect != category.hairback && this.indexSelect != category.hairfront && this.indexSelect != category.hairside && this.indexSelect != category.coat) {
                        Tools.setItemSlot(this.character.getComponent(Doll).listSkeleton[this.indexSelect], type + "/" + spriteFrame.name, type + "/" + spriteFrame.name, type)
                    }
                    else {
                        if (this.indexSelect == category.coat) {
                            Tools.setItemSlot(this.character.getComponent(Doll).listSkeleton[this.indexSelect], "Coat", "coat/" + spriteFrame.name, type)
                            Tools.setItemSlot(this.character.getComponent(Doll).listSkeleton[this.indexSelect], "coat-hand", "coat/hand/" + spriteFrame.name + "-hand", type)
                        }

                        else {
                            this.listColorHair.node.parent.active = true

                            if (this.indexSelect == category.hairback) {

                                this.backHair = "hairback/hairback/" + spriteFrame.name

                                if (this.character.getComponent(Doll).listSkeleton[this.indexSelect].findSlot("hairback-base").color.r == 1 && this.character.getComponent(Doll).listSkeleton[this.indexSelect].findSlot("hairback-base").color.g == 1 && this.character.getComponent(Doll).listSkeleton[this.indexSelect].findSlot("hairback-base").color.b == 1) {
                                    Tools.setItemSlot(this.character.getComponent(Doll).listSkeleton[this.indexSelect], "hairback", "hairback/hairback/" + spriteFrame.name, type)
                                }
                                Tools.setItemSlot(this.character.getComponent(Doll).listSkeleton[this.indexSelect], "hairback-base", "hairback/hairback-base/" + spriteFrame.name + "-base", type)
                                Tools.setItemSlot(this.character.getComponent(Doll).listSkeleton[this.indexSelect], "hairback-line", "hairback/hairback-line/" + spriteFrame.name + "-line", type)
                                Tools.setItemSlot(this.character.getComponent(Doll).listSkeleton[this.indexSelect], "hairback-item", "hairback/" + spriteFrame.name + "-item", type)
                            }

                            if (this.indexSelect == category.hairfront) {
                                if (this.character.getComponent(Doll).listSkeleton[this.indexSelect].findSlot("hairfront-base").color.r == 1 && this.character.getComponent(Doll).listSkeleton[this.indexSelect].findSlot("hairfront-base").color.g == 1 && this.character.getComponent(Doll).listSkeleton[this.indexSelect].findSlot("hairfront-base").color.b == 1) {
                                    Tools.setItemSlot(this.character.getComponent(Doll).listSkeleton[this.indexSelect], "hairfront", "hairfront/3/" + spriteFrame.name, type)
                                }
                                this.frontHair = "hairfront/3/" + spriteFrame.name
                                Tools.setItemSlot(this.character.getComponent(Doll).listSkeleton[this.indexSelect], "hairfront-base", "hairfront/1/" + spriteFrame.name + "-base", type)
                                Tools.setItemSlot(this.character.getComponent(Doll).listSkeleton[this.indexSelect], "hairfront-line", "hairfront/2/" + spriteFrame.name + "-line", type)
                                Tools.setItemSlot(this.character.getComponent(Doll).listSkeleton[this.indexSelect], "hairfront-item", "hairfront/" + spriteFrame.name + "-item", type)
                            }

                            if (this.indexSelect == category.hairside) {
                                if (this.character.getComponent(Doll).listSkeleton[this.indexSelect].findSlot("hairside-base").color.r == 1 && this.character.getComponent(Doll).listSkeleton[this.indexSelect].findSlot("hairside-base").color.g == 1 && this.character.getComponent(Doll).listSkeleton[this.indexSelect].findSlot("hairside-base").color.b == 1) {
                                    Tools.setItemSlot(this.character.getComponent(Doll).listSkeleton[this.indexSelect], "hairside", "hairside/hairside/" + spriteFrame.name, type)
                                }
                                this.sideHair = "hairside/hairside/" + spriteFrame.name
                                Tools.setItemSlot(this.character.getComponent(Doll).listSkeleton[this.indexSelect], "hairside-base", "hairside/hairside-base/" + spriteFrame.name + "-base", type)
                                Tools.setItemSlot(this.character.getComponent(Doll).listSkeleton[this.indexSelect], "hairside-line", "hairside/hairside-line/" + spriteFrame.name + "-line", type)
                                Tools.setItemSlot(this.character.getComponent(Doll).listSkeleton[this.indexSelect], "hairside-item", "hairside/" + spriteFrame.name + "-item", type)
                            }
                        }
                    }


                    this.scheduleOnce(() => {
                        this.offZoomItem()
                    }, 0.1)


                })
            }
            if (this.indexSelect >= 20) {
                if (this.indexSelect == 21) {
                    newItem.getComponent(ItemButton).setupBg(spriteFrame, spriteFrame.name)
                    newItem.getComponent(ItemButton).setUpCallback(() => {
                        AudioController.getInstance().playButtonSound()
                        this.offZoomItem()
                        this.pathBg = type
                        this.bg.getComponent(cc.Sprite).spriteFrame = spriteFrame
                        this.listItemButton.content.children.forEach(element => {
                            element.getComponent(ItemButton).select.active = false
                        })
                        newItem.getComponent(ItemButton).select.active = true
                    })
                }
                else {

                    newItem.getComponent(ItemButton).setUp(spriteFrame, spriteFrame.name, 100)

                    newItem.getComponent(ItemButton).setUpCallback(() => {
                        AudioController.getInstance().playButtonSound()

                        newItem.getComponent(ItemButton).select.active = true
                        let newItemInSence = cc.instantiate(StaticData.itemInSence)
                        newItemInSence.getComponent(ItemInSence).setUp(spriteFrame)
                        newItemInSence.getComponent(ItemInSence).type123 = this.indexSelect
                        this.gamePlay.addChild(newItemInSence)
                        if (this.indexSelect == category.bubble) {
                            newItemInSence.getComponent(ItemInSence).editbox.node.active = true
                            newItemInSence.getComponent(ItemInSence).editbox.node.on('editing-did-began', () => {
                                newItemInSence.getComponent(ItemInSence).editbox.enabled = false
                                this.saveProcess()
                            }, this)

                        }
                        let randomx = Tools.getRandomNumber(-200, 200)
                        let randomy = Tools.getRandomNumber(-200, 200)
                        newItemInSence.setPosition(randomx, randomy)

                        newItemInSence.on(cc.Node.EventType.TOUCH_START, this.touchStartItem, this)
                        newItemInSence.on(cc.Node.EventType.TOUCH_MOVE, this.moveItem, this)
                        newItemInSence.on(cc.Node.EventType.TOUCH_END, this.touchEndItem, this)
                        newItemInSence.on(cc.Node.EventType.TOUCH_CANCEL, this.touchEndItem, this)
                        this.scheduleOnce(() => {
                            this.offZoomItem()
                        }, 0.1)

                    });
                }
            }


        }
        else {
            newItem.getComponent(ItemButton).avatar.node.color = color
            newItem.getComponent(ItemButton).setUpCallback(() => {
                AudioController.getInstance().playButtonSound()
                this.offZoomItem()
                Tools.setColorSlot(this.character.getComponent(Doll).listSkeleton[this.indexSelect], color, "body_base")

            })
        }

    }
    createItemBlank() {
        let newItem = cc.instantiate(this.itemButton)
        this.listItemButton.content.addChild(newItem)
        newItem.getComponent(ItemButton).avatar.node.active = false
        newItem.getComponent(ItemButton).select.active = true
        newItem.getComponent(ItemButton).setUpCallback(() => {
            this.listItemButton.content.children.forEach(element => {
                element.getComponent(ItemButton).select.active = false
            })
            newItem.getComponent(ItemButton).select.active = true
            AudioController.getInstance().playButtonSound()
            this.listColorHair.node.parent.active = false
            if (this.indexSelect == category.hairfront) {
                this.frontHair = ""
            }
            if (this.indexSelect == category.hairback) {
                this.backHair = ""
            }

            if (this.indexSelect == category.hairside) {
                this.sideHair = ""
            }

            Tools.setItemSlot(this.character.getComponent(Doll).listSkeleton[this.indexSelect], "blank", "blank", "blank")
            this.offZoomItem()

        })
    }


    indexSibilingItem = -1
    offZoomItem() {
        this.gamePlay.children.forEach(element => {
            if (element.getChildByName("body").getChildByName("zoom line").active == true) {
                element.getChildByName("body").getChildByName("zoom line").active = false
                element.getChildByName("zoom").active = false
                element.setSiblingIndex(this.indexSibilingItem)
            }
        })

        this.bgShare1.children.forEach(element => {
            if (element.getChildByName("body").getChildByName("zoom line").active == true) {
                element.getChildByName("body").getChildByName("zoom line").active = false
                element.getChildByName("zoom").active = false
                element.setSiblingIndex(this.indexSibilingItem)
            }
        })

        this.saveProcess()
    }


    indexSelect = -1

    saveProcess() {
        let listdataSave = new Array<DataSaveItem>()
        this.bg.children.forEach(element => {
            let newDataSave
            if (element.getComponent(Doll)) {
                newDataSave = new DataSaveItem("doll", element.position, element.getChildByName("body").scale)
                newDataSave.dataDoll = Tools.saveDoll(element.getComponent(Doll))
            }
            else {
                newDataSave = new DataSaveItem(element.getComponent(ItemInSence).type123.toString(), element.position, element.getChildByName("body").scale)
                newDataSave.path = element.getComponent(ItemInSence).path

                if (element.getComponent(ItemInSence).type123 == category.bubble) {
                    newDataSave.message = element.getComponent(ItemInSence).editbox.string
                }
            }

            listdataSave.push(newDataSave)
        })


        let data = {
            bg: this.pathBg,
            dataPhoto: listdataSave
        }

        // Tools.saveDataStorage("processMobile", data)
        StaticData.process = data
    }
    showZoomItem(item: cc.Node) {
        item.getChildByName("zoom line").active = true
        this.indexSibilingItem = item.parent.getSiblingIndex()
        item.parent.getChildByName("zoom").active = true
        item.parent.setSiblingIndex(999)
    }
    possisionStart
    touchStartItem(event) {
        let posCurrent = new cc.Vec3(event.getLocation().x, event.getLocation().y, 0)
        this.possisionStart = event.target.getPosition().subtract(posCurrent)
        this.offZoomItem()
        this.showZoomItem(event.target.getChildByName("body"))


    }



    public moveItem(touchEvent) {
        if (touchEvent.target.getComponent(ItemInSence)) {
            this.trash.active = true
        }
        let loc = touchEvent.getLocation();
        let x = this.ui.getContentSize().width
        let y = this.ui.getContentSize().height


        let width = touchEvent.target.getContentSize().width * touchEvent.target.scale / 2
        let height = touchEvent.target.getContentSize().height * touchEvent.target.scale / 2


        console.log(loc.y + this.possisionStart.y, -y / 2 + height)
        if ((loc.x + this.possisionStart.x < x / 2 - width && loc.x + this.possisionStart.x > -x / 2 + width) && (loc.y + this.possisionStart.y < y / 2 - height && loc.y + this.possisionStart.y > -y / 2 + height)) {

            touchEvent.target.setPosition(new cc.Vec3(loc.x, loc.y))
            touchEvent.target.setPosition(touchEvent.target.getPosition().add(this.possisionStart))

        }
        else {
            if ((loc.x + this.possisionStart.x >= x / 2 - width + 10 || loc.x + this.possisionStart.x <= -x / 2 + width - 10) && (loc.y + this.possisionStart.y < y / 2 - height && loc.y + this.possisionStart.y > -y / 2 + height)) {
                touchEvent.target.setPosition(touchEvent.target.position.x, loc.y - y / 2)
            }

            if ((loc.x + this.possisionStart.x < x / 2 - width && loc.x + this.possisionStart.x > -x / 2 + width) && (loc.y + this.possisionStart.y >= y / 2 - height + 10 || loc.y + this.possisionStart.y <= -y / 2 + height - 10)) {
                touchEvent.target.setPosition(loc.x - this.bg.getContentSize().width / 2, touchEvent.target.position.y)
            }
            //touchEvent.target.translate(this.possisionStart)
        }

        let kcY = touchEvent.target.convertToWorldSpaceAR(cc.Vec2.ZERO).y - this.trash.convertToWorldSpaceAR(cc.Vec2.ZERO).y + touchEvent.target.position.y / 2;
        if (kcY <= 0 && touchEvent.target.getComponent(ItemInSence)) {
            if (touchEvent.target.isValid) {
                this.trash.active = false


                cc.tween(touchEvent.target).parallel(
                    cc.tween(touchEvent.target).to(0.2, { scale: new cc.Vec3(0, 0, 1) }),
                    cc.tween(touchEvent.target).call(() => {
                        //tween(touchEvent.target.getComponent(UIOpacity)).to(0.3, { opacity: 0 }).start()
                    })
                )
                    .call(() => {
                        touchEvent.target.destroy()
                        this.trash.active = false
                    }).start()


            }
        }


    }

    public touchEndItem(touchEvent) {
        if (touchEvent.target.getComponent(ItemInSence)?.editbox.node.active == true) {
            touchEvent.target.getComponent(ItemInSence).editbox.enabled = true
            touchEvent.target.getComponent(ItemInSence).editbox.focus()
        }
        this.trash.active = false
    }

    changeTheme(index) {

        this.bgListButton.color = this.listColor1[index]

        this.bgListCategory.color = this.listColor3[index]
        StaticData.colorSelectChat = this.listColor4[index]
        StaticData.colorChatOther = this.listColor2[index]
        StaticData.colorSelectCategory = this.listColor2[index]
        StaticData.colorChatUser = this.listColor3[index]

        this.listItemSelect.children.forEach(element => {
            element.getChildByName("select").getChildByName("category select bg").color = StaticData.colorSelectCategory
        })


    }

    isClickChat = false
    btnChat() {
        fireBase.instance.LogEvent("BtnChat" + Config.keyFirebase)
        StaticData.waittingInsence.show()
        AudioController.getInstance().playButtonSound()
        if (this.isClickChat == false) {
            this.isClickChat = true
            Tools.loadPrefab("prefab/chat", (err, prefab: cc.Prefab) => {
                StaticData.waittingInsence.hide()
                this.isClickChat = false
                let chat = cc.instantiate(prefab)
                this.bottom.active = false
                this.bg.active = false
                this.ui.addChild(chat)
            })
        }
    }

    isClickGallery = false
    btnGallery() {
        fireBase.instance.LogEvent("BtnGallery" + Config.keyFirebase)
        StaticData.waittingInsence.show()
        AudioController.getInstance().playButtonSound()
        if (this.isClickGallery == false) {
            this.isClickGallery = true
            Tools.loadPrefab("prefab/gallery", (err, prefab: cc.Prefab) => {
                StaticData.waittingInsence.hide()
                this.listButton.active = false
                this.isClickGallery = false
                this.bottom.active = false
                let gallery = cc.instantiate(prefab)
                this.ui.addChild(gallery)
            })
        }
    }
    btnSaveDoll() {
        this.scheduleOnce(() => {
            this.offZoomItem()
            if (this.indexEdit == -1) {
                AudioController.getInstance().playButtonSound()
                let list = []
                if (Tools.getDataStorage("photos")) {
                    list = Tools.getDataStorage("photos")
                }
                list.push(Tools.saveDoll(this.character.getComponent(Doll)))
                Tools.saveDataStorage("photos", list)
            }
            else {
                let list = []
                if (Tools.getDataStorage("photos")) {
                    list = Tools.getDataStorage("photos")
                    list[this.indexEdit] = Tools.saveDoll(this.character.getComponent(Doll))
                    Tools.saveDataStorage("photos", list)
                    this.btnReset()
                }
            }
            this.btnGallery()
        }, 0.1)
    }

    btnReset() {
        AudioController.getInstance().playButtonSound()
        this.listNameItemSelect.fill("")
        this.backHair = ""
        this.frontHair = ""
        this.sideHair = ""
        this.offZoomItem()
        this.indexEdit = -1
        this.showListItemButton(this.indexSelect, "1")
        this.pathBg = "bg (1)"
        Tools.LoadSpriteFrameFromPatch(`texture/bg/bg (1)`, (err, spriteFrame) => {
            this.bg.getComponent(cc.Sprite).spriteFrame = spriteFrame
        })

        this.bg.destroyAllChildren()
        this.character.destroy()
        this.character = cc.instantiate(StaticData.doll)
        this.gamePlay.addChild(this.character)
        this.character.getChildByName("body").setScale(new cc.Vec3(1.4, 1.4))
        this.character.setPosition(new cc.Vec3(0, 100, 0))
        this.character.on(cc.Node.EventType.TOUCH_START, this.touchStartItem, this)
        this.character.on(cc.Node.EventType.TOUCH_MOVE, this.moveItem, this)
        this.character.on(cc.Node.EventType.TOUCH_END, this.touchEndItem, this)
        this.character.on(cc.Node.EventType.TOUCH_CANCEL, this.touchEndItem, this)
    }


    btnOption() {
        AudioController.getInstance().playButtonSound()
        this.option.active = true
    }

    offOption() {
        this.option.active = false
    }

    isFeedback = false
    btnFeedback() {
        StaticData.waittingInsence.show()
        AudioController.getInstance().playButtonSound()
        if (this.isFeedback == false) {
            this.isFeedback = true
            Tools.loadPrefab("prefab/feedback", (err, prefab: cc.Prefab) => {
                StaticData.waittingInsence.hide()
                this.isFeedback = false
                let feedback = cc.instantiate(prefab)
                feedback.scale = 1.35
                this.ui.addChild(feedback)
            })
        }
    }

    isBtnTheme = false
    btnTheme() {
        StaticData.waittingInsence.show()
        AudioController.getInstance().playButtonSound()
        if (this.isBtnTheme == false) {
            this.isBtnTheme = true
            Tools.loadPrefab("prefab/theme", (err, prefab: cc.Prefab) => {
                StaticData.waittingInsence.hide()
                this.isBtnTheme = false
                let theme = cc.instantiate(prefab)
                theme.scale = 1.35
                this.ui.addChild(theme)
                theme.getComponent(Theme).setUp((index) => {
                    this.changeTheme(index)
                })
            })
        }
    }

    isBtnAudio = false
    btnAudio() {
        StaticData.waittingInsence.show()
        AudioController.getInstance().playButtonSound()
        if (this.isBtnAudio == false) {
            this.isBtnAudio = true
            Tools.loadPrefab("prefab/audio", (err, prefab: cc.Prefab) => {
                StaticData.waittingInsence.hide()
                this.isBtnAudio = false
                let audio = cc.instantiate(prefab)
                audio.scale = 1.35
                this.ui.addChild(audio)
            })
        }
    }


    btnPhoto() {
        // StaticData.waittingInsence.show()
        // this.bgShare.destroyAllChildren()
        // let dataSave = StaticData.process

        // dataSave.dataPhoto.forEach((element, index) => {
        //     this.setPhoto(this.bgShare, element, 1, 1, index, null)
        // })
        // let isLoadBg = false
        // Tools.LoadSpriteFrameFromPatch(`texture/bg/${dataSave.bg}`, (err, spriteFrame) => {
        //     this.bgShare.getComponent(cc.Sprite).spriteFrame = spriteFrame
        //     isLoadBg = true
        // })


        // let wait = () => {
        //     if (this.bgShare.children.length == dataSave.dataPhoto.length && isLoadBg == true) {
        //         FbSdk.getInstance().Share(Tools.takePhoto(this.bgShare, this.nodeTest.getContentSize().height), "Play full game: " + "https://dressupgirl.online/", () => {
        //             StaticData.waittingInsence.hide()
        //         })
        //     }

        //     else {
        //         this.scheduleOnce(() => {
        //             wait()
        //         }, 0.1)
        //     }
        // }

        // wait()

        this.bgShare1.destroyAllChildren()
        let dataSave = StaticData.process
        this.nodeSetUpShare.active = true
        Tools.LoadSpriteFrameFromPatch(`texture/bg/${dataSave.bg}`, (err, spriteFrame) => {
            this.bgShare1.getComponent(cc.Sprite).spriteFrame = spriteFrame
        })

        let itemnew = cc.instantiate(this.itemInsenceAvatar)
        this.bgShare1.addChild(itemnew)
        this.gamePlay.getComponent(cc.Button).enabled = false
        itemnew.setPosition(new cc.Vec3(400, 400))
        Tools.loadFBavatar(Context.getInstance().user.photoUrl, (err, spri) => {
            itemnew.getComponent(ItemInSence).setUp(spri)
            itemnew.getComponent(ItemInSence).avatar.node.setContentSize(new cc.Size(200, 200))
            itemnew.setContentSize(new cc.Size(200, 200))
            itemnew.getComponent(ItemInSence).avatar.node.parent.setContentSize(new cc.Size(200, 200))
        })

        itemnew.on(cc.Node.EventType.TOUCH_START, this.touchStartItem, this)
        itemnew.on(cc.Node.EventType.TOUCH_MOVE, this.moveItem, this)
        itemnew.on(cc.Node.EventType.TOUCH_END, this.touchEndItem, this)
        itemnew.on(cc.Node.EventType.TOUCH_CANCEL, this.touchEndItem, this)

        this.listButton.active = false
        this.bottom.active = false


    }

    btnShare() {
        this.offZoomItem()
        FbSdk.getInstance().Share(Tools.takePhoto(this.bgShare1, 0), "Play full game: " + "https://dressupgirl.online/", () => {
            StaticData.waittingInsence.hide()
        })
    }

    btnDownload() {
        this.bgShare.destroyAllChildren()
        let dataSave = StaticData.process

        dataSave.dataPhoto.forEach((element, index) => {
            this.setPhoto(this.bgShare, element, 1, 1, index, null)
        })
        let isLoadBg = false
        Tools.LoadSpriteFrameFromPatch(`texture/bg/${dataSave.bg}`, (err, spriteFrame) => {
            this.bgShare.getComponent(cc.Sprite).spriteFrame = spriteFrame
            isLoadBg = true
        })


        let wait = () => {
            if (this.bgShare.children.length == dataSave.dataPhoto.length && isLoadBg == true) {
                Tools.downloadImage(Tools.takePhoto(this.bgShare, this.nodeTest.getContentSize().height))

            }
            else {
                this.scheduleOnce(() => {
                    wait()
                }, 0.1)
            }
        }

        wait()
    }

    public setPhoto(bg: cc.Node, dataSaveItems: DataSaveItem, x, y, zindex, listtexture: cc.Texture2D[] = null) {
        switch (dataSaveItems.type) {
            case "doll":
                if (bg) {
                    let newDoll = cc.instantiate(StaticData.doll)
                    bg.addChild(newDoll)
                    newDoll.setPosition(new cc.Vec3(dataSaveItems.possision.x * x, dataSaveItems.possision.y * y, 1))
                    newDoll.getComponent(cc.Button).enabled = false
                    newDoll.getChildByName("body").setScale(new cc.Vec3(dataSaveItems.scale * x, dataSaveItems.scale * y, 1))
                    newDoll.setSiblingIndex(zindex)
                    newDoll.setContentSize(new cc.Size(newDoll.getComponent(Doll).avatar.getContentSize().width * newDoll.getComponent(Doll).avatar.scale, newDoll.getComponent(Doll).avatar.getContentSize().height * newDoll.getComponent(Doll).avatar.scale))

                    dataSaveItems.dataDoll.forEach((slot, index) => {
                        slot.forEach(item => {
                            Tools.setSpineSave(newDoll.getComponent(Doll).listSkeleton[index], item.nameSlot, item.nameItem, item.color)
                        })

                    })

                }
                break;
            case category.sticker.toString():
                Tools.loadSpriteFrameAtlasFromPath("atlas/buttonBellow/sticker", dataSaveItems.path, (spriteFrame: cc.SpriteFrame, texture: cc.Texture2D) => {
                    if (bg.isValid) {
                        let newSticker = cc.instantiate(StaticData.itemInSence)
                        newSticker.getComponent(cc.Button).enabled = false
                        bg.addChild(newSticker)

                        newSticker.setPosition(new cc.Vec3(dataSaveItems.possision.x * x, dataSaveItems.possision.y * y, 1))
                        newSticker.getComponent(ItemInSence).avatar.node.setScale(new cc.Vec3(dataSaveItems.scale * x, dataSaveItems.scale * y, 1))
                        newSticker.getComponent(ItemInSence).setUp(spriteFrame)

                    }
                })
                break;
            case category.bubble.toString():
                Tools.loadSpriteFrameAtlasFromPath("atlas/buttonBellow/bubble", dataSaveItems.path, (spriteFrame: cc.SpriteFrame, texture: cc.Texture2D) => {

                    if (bg.isValid) {
                        let newBubble = cc.instantiate(StaticData.itemInSence)
                        newBubble.getComponent(cc.Button).enabled = false
                        bg.addChild(newBubble)
                        newBubble.setPosition(new cc.Vec3(dataSaveItems.possision.x * x, dataSaveItems.possision.y * y, 1))
                        newBubble.getComponent(ItemInSence).avatar.node.setScale(new cc.Vec3(dataSaveItems.scale * x, dataSaveItems.scale * y, 1))
                        newBubble.getComponent(ItemInSence).editbox.enabled = false
                        newBubble.getComponent(ItemInSence).editbox.string = dataSaveItems.message
                        newBubble.getComponent(ItemInSence).editbox.node.active = true
                        newBubble.getComponent(ItemInSence).setUp(spriteFrame)
                    }
                })

                break;

            case category.key.toString():
                Tools.loadSpriteFrameAtlasFromPath("atlas/buttonBellow/key", dataSaveItems.path, (spriteFrame: cc.SpriteFrame, texture: cc.Texture2D) => {
                    if (bg.isValid) {
                        let key = cc.instantiate(StaticData.itemInSence)
                        key.getComponent(cc.Button).enabled = false
                        bg.addChild(key)
                        key.setPosition(new cc.Vec3(dataSaveItems.possision.x * x, dataSaveItems.possision.y * y, 1))
                        key.getComponent(ItemInSence).avatar.node.setScale(new cc.Vec3(dataSaveItems.scale * x, dataSaveItems.scale * y, 1))

                        key.getComponent(ItemInSence).setUp(spriteFrame)
                    }
                })

                break;

            case category.pet.toString():
                Tools.loadSpriteFrameAtlasFromPath("atlas/buttonBellow/pet", dataSaveItems.path, (spriteFrame: cc.SpriteFrame, texture: cc.Texture2D) => {
                    if (bg.isValid) {
                        let pet = cc.instantiate(StaticData.itemInSence)
                        pet.getComponent(cc.Button).enabled = false
                        bg.addChild(pet)
                        pet.setPosition(new cc.Vec3(dataSaveItems.possision.x * x, dataSaveItems.possision.y * y, 1))
                        pet.getComponent(ItemInSence).avatar.node.setScale(new cc.Vec3(dataSaveItems.scale * x, dataSaveItems.scale * y, 1))

                        pet.getComponent(ItemInSence).setUp(spriteFrame)
                    }
                })
                break;
        }
    }

    protected update(dt: number): void {
        this.canvas.setContentSize(Tools.getSizeWindow(1080, 1920))
        this.ui.setContentSize(Tools.getSizeWindow(1080, 1920))
        this.optimizeScrollView(this.listItemButton)
    }

    optimizeScrollView(scrollView: cc.ScrollView) {
        let view2 = scrollView.node.getChildByName("view");
        let view = view2.getBoundingBox();
        let width = scrollView.content.getContentSize().height
        if (view) {
            if (scrollView.vertical) {
                var viewRect = cc.rect(
                    - view.width / 2,
                    - (width + (scrollView.content.getBoundingBox().y) + view.height / 3),
                    view.width,
                    view.height);

                for (let i = 0; i < scrollView.content.children.length; i++) {
                    const node = scrollView.content.children[i];
                    if (viewRect.intersects(node.getBoundingBox())) {
                        node.opacity = 255;


                    }
                    else {
                        if (node) {
                            node.opacity = 0;
                        }
                    }
                }

            }
        }
    }

    btnCommunity() {
        FbSdk.getInstance().joinGroup()
    }

    btnThemeChristmas() {
        StaticData.waittingInsence.show()
        Tools.loadPrefab("prefab/themeChristmas", (err, prefab: cc.Prefab) => {
            StaticData.waittingInsence.hide()
            let theme = cc.instantiate(prefab)
            this.ui.addChild(theme)
        })
    }


    btnLanguage() {
        StaticData.waittingInsence.show()
        Tools.loadPrefab("prefab/language", (err, prefab: cc.Prefab) => {
            StaticData.waittingInsence.hide()
            let language = cc.instantiate(prefab)
            this.ui.addChild(language)
        })
    }


    btnAdd() {
        if (this.listAvatarFriend.node.active == false) {
            this.listAvatarFriend.node.active = true
            this.listAvatarFriend.content.destroyAllChildren()
            FbSdk.getInstance().getFriend((entries) => {
                console.log(entries)
                entries.forEach(element => {
                    if (element.getID()) {
                        let newAvatar = cc.instantiate(this.avatarFriend)
                        this.listAvatarFriend.content.addChild(newAvatar)
                        Tools.loadFBavatar(element.getPhoto(), (err, spri) => {
                            newAvatar.getComponent(AvatarFriend).setUp(spri)
                        })

                        newAvatar.on(cc.Node.EventType.TOUCH_END, () => {
                            let itemnew = cc.instantiate(this.itemInsenceAvatar)
                            this.bgShare1.addChild(itemnew)
                            this.gamePlay.getComponent(cc.Button).enabled = false
                            itemnew.setPosition(new cc.Vec3(-400, 400))
                            Tools.loadFBavatar(element.getPhoto(), (err, spri) => {
                                itemnew.getComponent(ItemInSence).setUp(spri)
                                itemnew.getComponent(ItemInSence).avatar.node.setContentSize(new cc.Size(200, 200))
                                itemnew.setContentSize(new cc.Size(200, 200))
                                itemnew.getComponent(ItemInSence).avatar.node.parent.setContentSize(new cc.Size(200, 200))
                            })

                            itemnew.on(cc.Node.EventType.TOUCH_START, this.touchStartItem, this)
                            itemnew.on(cc.Node.EventType.TOUCH_MOVE, this.moveItem, this)
                            itemnew.on(cc.Node.EventType.TOUCH_END, this.touchEndItem, this)
                            itemnew.on(cc.Node.EventType.TOUCH_CANCEL, this.touchEndItem, this)
                        }, this)
                    }
                });
            });
        }

        else
            this.listAvatarFriend.node.active = false


    }


    offShareUI() {
        this.nodeSetUpShare.active = false
        this.listButton.active = true
        this.bottom.active = true
        this.gamePlay.getComponent(cc.Button).enabled = true
    }

    btnEffect(){
        StaticData.waittingInsence.show()
        Tools.loadPrefab("prefab/effect", (err, prefab: cc.Prefab) => {
            StaticData.waittingInsence.hide()
            let effect = cc.instantiate(prefab)
            this.ui.addChild(effect)
            effect.scale = 1.3
        })
    }

    selectEffect(args) {
        console.log("click")
        //Tools.saveDataStorage("effect", args)
        switch (Number(args)) {
            case 0:
                this.particle.destroyAllChildren()

                break;
            case 1:
                this.particle.destroyAllChildren()
                StaticData.waittingInsence.show()
                Tools.loadPrefab("particle/snow", (err, prefab: cc.Prefab) => {
                    StaticData.waittingInsence.hide()
                    let snow = cc.instantiate(prefab)
                    this.particle.addChild(snow)

                })

                break
            case 2:
                this.particle.destroyAllChildren()
                StaticData.waittingInsence.show()
                Tools.loadPrefab("particle/rain", (err, prefab: cc.Prefab) => {
                    StaticData.waittingInsence.hide()
                    let rain = cc.instantiate(prefab)
                    this.particle.addChild(rain)

                })

                break
            case 3:
                this.particle.destroyAllChildren()
                StaticData.waittingInsence.show()
                Tools.loadPrefab("particle/bubble", (err, prefab: cc.Prefab) => {
                    StaticData.waittingInsence.hide()
                    let bubble = cc.instantiate(prefab)
                    this.particle.addChild(bubble)

                })

                break
            case 4:
                this.particle.destroyAllChildren()
                StaticData.waittingInsence.show()
                Tools.loadPrefab("particle/spring", (err, prefab: cc.Prefab) => {
                    
                    StaticData.waittingInsence.hide()
                    let sakura = cc.instantiate(prefab)
                    this.particle.addChild(sakura)
                })
                break
        }
    }

}
