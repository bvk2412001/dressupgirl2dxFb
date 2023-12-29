// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import Config from "../common/Config";
import ContantGame from "../common/ContantGame";
import Context from "../common/Context";
import { Native } from "../common/Enum";
import FbSdk from "../common/FbSdk";
import StaticData from "../common/StaticData";
import Tools from "../common/Tools";
import { fireBase } from "../firebase/fireBase";
import Language from "../language/Language";
import SocketRun from "../plugin/SocketRun";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Loading extends cc.Component {
    @property(Boolean)
    debug: Boolean = false;
    @property(Boolean)
    private facebook: Boolean = false;
    @property(Boolean)
    public android: Boolean = false;
    @property(Boolean)
    public web: Boolean = false;
    @property(Boolean)
    public ios: Boolean = false;
    @property(String)
    public version: String = "";

    @property(cc.ProgressBar)
    loadingProgressBar: cc.ProgressBar;

    @property(cc.Label)
    loadingLb: cc.Label

    @property(cc.Node)
    avatar: cc.Node

    @property(cc.Node)
    bg: cc.Node
    protected onLoad(): void {
        StaticData.listPrefabItemDoll = new Array<cc.Prefab>(20)
        console.log(StaticData.listPrefabItemDoll)
        fireBase.instance.LogEvent("loading" + Config.keyFirebase);
        if (this.debug == false) {
            console.log = function () { };
            console.warn = function () { };
            console.info = function () { };
        }
        else {
            Config.debug = true
        }

        this.scheduleOnce(()=>{
          
        })
        if (this.web == true) {
            Config.native = Tools.checkNative()
            console.log(Config.native)
            if (Config.native == Native.Web) {
                this.avatar.scale = 0.6
                this.loadingProgressBar.node.setScale(new cc.Vec3(0.6, 0.6, 0.6))
                cc.view.setDesignResolutionSize(1920, 1080, cc.ResolutionPolicy.SHOW_ALL)
                StaticData.maxSize = new cc.Size(window.innerWidth, window.innerHeight)
            }
            else {
                cc.view.setDesignResolutionSize(1080, 1920, cc.ResolutionPolicy.SHOW_ALL)
                StaticData.maxSize = new cc.Size(window.innerWidth, window.innerHeight)

            }
        }


        if (this.facebook == true) {
            Config.native = Native.Mobile
        }
    }
    start() {
        Tools.loadFlag()
        this.loading()
        Context.getInstance().getLocale()
        FbSdk.getInstance().loginGame()
        let loadLocale = () => {
            if (FbSdk.getInstance().dataFb.locale != "") {
                if(!Tools.getDataStorage("language")){
                    if(FbSdk.getInstance().dataFb.locale == "vn"){
                        Language.getInstance().changeLanguage("vn")
                    }
                    else{
                        Language.getInstance().changeLanguage("en")
                    }
                }
                SocketRun.getInstance().connect()
            }
            else {
                this.scheduleOnce(() => {
                    loadLocale()
                }, 0.1)
            }
        }

        loadLocale()

        Context.getInstance().startGame()
    }


    delay = 0.0002
    count = 0
    loading() {
        try {
            if (this.loadingProgressBar.progress < 1) {
                this.delay += 0.0005;
                this.loadingProgressBar.progress += 0.002;
                this.loadingLb.string = "Loading..." + Math.round(this.loadingProgressBar.progress * 100) + "%";
            }
            this.scheduleOnce(() => {
                this.loading();
            }, this.delay);
        } catch (error) {
            console.error(error);
        }
    }

    update(deltaTime: number) {
        if (Config.native == Native.Mobile) {
            this.bg.setContentSize(Tools.getSizeWindow(ContantGame.mobile_width, ContantGame.mobile_height))
        }
        else {
            this.bg.setContentSize(Tools.getSizeWindow(ContantGame.web_width, ContantGame.web_height))
        }
    }

}
