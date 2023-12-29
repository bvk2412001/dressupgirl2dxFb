import WaittingInSence from "../WaitingInsence";
import Config from "./Config";
import ContantGame from "./ContantGame";
import { Native, category } from "./Enum";
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
        "character/doll",
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
                            case "character/doll":
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

    indexLoadItem = 0
    isloadItem = false
    listItemDoll = [
        "character/bag",
        "character/clothesSlow",
        "character/clothesTop",
        "character/coat",
        "character/dress",
        "character/earing",
        "character/eye",
        "character/eyeBrow",
        "character/faceAsset",
        "character/glasses",
        "character/hairBack",
        "character/hairFront",
        "character/hairSide",
        "character/headAsset",
        "character/mouth",
        "character/neckAsset",
        "character/shoe",
        "character/sock",
        "character/wing"
    ]


    loadItemDoll() {
        if (this.isloadItem == false) {
            this.isloadItem = true
            this.listItemDoll.forEach((name, index) => {
                Tools.loadPrefab(name, (err, prefab: cc.Prefab) => {
                    if (err) {

                    }
                    else {
                        switch (name) {
                            case "character/bag":
                                StaticData.listPrefabItemDoll[category.bag] = prefab
                                this.indexLoadItem++
                                break;
                            case "character/clothesSlow":
                                StaticData.listPrefabItemDoll[category.clotheslow] = prefab
                                this.indexLoadItem++
                                break;
                            case "character/clothesTop":
                                StaticData.listPrefabItemDoll[category.clothestop] = prefab
                                this.indexLoadItem++
                                break;
                            case "character/coat":
                                StaticData.listPrefabItemDoll[category.coat] = prefab
                                this.indexLoadItem++
                                break;
                            case "character/dress":
                                StaticData.listPrefabItemDoll[category.dress] = prefab
                                this.indexLoadItem++
                                break;
                            case "character/earing":
                                StaticData.listPrefabItemDoll[category.earing] = prefab
                                this.indexLoadItem++
                                break;
                            case "character/eye":
                                console.log("eye")
                                StaticData.listPrefabItemDoll[category.eye] = prefab
                                
                                this.indexLoadItem++
                                break;
                            case "character/eyeBrow":
                                StaticData.listPrefabItemDoll[category.eyebrow] = prefab
                                this.indexLoadItem++
                                break;
                            case "character/faceAsset":
                                StaticData.listPrefabItemDoll[category.faceasset] = prefab
                                this.indexLoadItem++
                                break;
                            case "character/glasses":
                                StaticData.listPrefabItemDoll[category.glasses] = prefab
                                this.indexLoadItem++
                                break;
                            case "character/hairBack":
                                StaticData.listPrefabItemDoll[category.hairback] = prefab
                                this.indexLoadItem++
                                break;
                            case "character/hairFront":
                                StaticData.listPrefabItemDoll[category.hairfront] = prefab
                                this.indexLoadItem++
                                break;
                            case "character/hairSide":
                                StaticData.listPrefabItemDoll[category.hairside] = prefab
                                this.indexLoadItem++
                                break;
                            case "character/headAsset":
                                StaticData.listPrefabItemDoll[category.headasset] = prefab
                                this.indexLoadItem++
                                break;
                            case "character/mouth":
                                StaticData.listPrefabItemDoll[category.mouth] = prefab
                                this.indexLoadItem++
                                break;
                            case "character/neckAsset":
                                StaticData.listPrefabItemDoll[category.neckasset] = prefab
                                this.indexLoadItem++
                                break;
                            case "character/shoe":
                                StaticData.listPrefabItemDoll[category.shoe] = prefab
                                this.indexLoadItem++
                                break;
                            case "character/sock":
                                StaticData.listPrefabItemDoll[category.sock] = prefab
                                this.indexLoadItem++
                                break;
                            case "character/wing":
                                StaticData.listPrefabItemDoll[category.wing] = prefab
                                this.indexLoadItem++
                                break

                        }
                    }
                })
            })
        }
    }
}
