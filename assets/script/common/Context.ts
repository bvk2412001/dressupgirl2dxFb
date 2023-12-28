import WaittingInSence from "../WaitingInsence";
import Config from "./Config";
import ContantGame from "./ContantGame";
import { Native } from "./Enum";
import StaticData from "./StaticData";
import Tools from "./Tools";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Context extends cc.Component {

    public static ins: Context
    public locale = "";
    public avatar = "0";
    private localeURL = 'https://api.country.is/';

    user = null

    getLocale() {
        this.getLocaleManual()
    }

    private getLocaleManual() {
        fetch('https://api.country.is')
            .then(response => response.json())
            .then(data => {
                console.log("du lieu: ", data);
                const countryCode = data.country.toLowerCase();
                this.locale = countryCode.toLowerCase();

            })
            .catch(error => console.error('Error:', error));
    }

    public SetDataUser(data) {

        if (data.locale) {
            this.locale = data.locale.toLowerCase();
        }
    }

    public static getInstance() {
        if (this.ins == null)
            this.ins = new Context()
        return this.ins
    }

    public prefabs = [
        "prefab/doll",
        "prefab/itemInsence",
        "prefab/waittingInsence"
    ];


    public startGame() {
        this.loadRes()
        console.log(this.indexLoadRes)
        if (this.indexLoadRes == 4) {
            if (Config.native == Native.Web) {
                cc.director.loadScene(ContantGame.web_sence)
            }
            else {
                cc.director.loadScene(ContantGame.mobile_sence)
            }

        }
        else {
            setTimeout(() => {
                this.startGame()
            }, 100);
        }
    }




    indexLoadRes = 0
    isLoadRes = false
    public loadRes() {
        if (this.isLoadRes == false) {
            this.isLoadRes = true
            this.prefabs.forEach((name, index) => {
                Tools.loadPrefab(name, (err, prefab: cc.Prefab) => {
                    if (err) {

                    }
                    else {
                        switch (name) {
                            case "prefab/doll":
                                console.log(prefab)
                                StaticData.doll = prefab
                                this.indexLoadRes++
                                break;

                            case "prefab/itemInsence":
                                console.log(prefab)
                                StaticData.itemInSence = prefab
                                this.indexLoadRes++
                                break;
                            case "prefab/waittingInsence":
                                let wait = cc.instantiate(prefab)
                                cc.game.addPersistRootNode(wait)
                                StaticData.waittingInsence = wait.getComponent(WaittingInSence)
                                wait.zIndex = 0
                                this.indexLoadRes++
                        }
                    }
                })
            })
        }
    }

    setTimeLockImage(timeLockImage: number) {
        StaticData.timeLockImage = timeLockImage
        let countDownTime = () => {
            StaticData.timeLockImage--
            if (StaticData.timeLockImage <= 0) {
                StaticData.timeLockImage = 0
                this.unschedule(countDownTime)
            }
        }
        
        this.schedule(countDownTime, 1, timeLockImage)



    }
}
