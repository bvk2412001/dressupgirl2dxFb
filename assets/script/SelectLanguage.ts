import Tools from "./common/Tools";
import Language from "./language/Language";

const { ccclass, property } = cc._decorator;

@ccclass
export default class changeLanguage extends cc.Component {
    @property(cc.Label)
    languageLabel: cc.Label

    @property(cc.Node)
    boardSelect: cc.Node

    @property(cc.Label)
    lanSelected: cc.Label

    @property(cc.Label)
    lanSelect: cc.Label

    protected onLoad(): void {
        if (Tools.getDataStorage("language") == "vn") {
            this.languageLabel.string = "Vietnamese";

        }
        else {
            this.languageLabel.string = "English";
        }
    }


    showBoardSelect() {
        this.boardSelect.active = true
        if (Tools.getDataStorage("language") == "vn") {
            this.lanSelected.string = "Vietnamese";
            this.lanSelect.string = "English";

        }
        else {
            this.lanSelect.string = "Vietnamese";
            this.lanSelected.string = "English";
        }
    }

    changeLanguage() {
        if (Tools.getDataStorage("language") == "en") {
            this.languageLabel.string = "Vietnamese";
            Tools.saveDataStorage("language", "vn")
            Language.getInstance().changeLanguage("vn")

        }
        else {
            this.languageLabel.string = "English";
            Tools.saveDataStorage("language", "en")
            Language.getInstance().changeLanguage("en")
        }


        this.offBoardSelect()
    }


    offBoardSelect() {
        this.boardSelect.active = false
    }

    offNode() {
        this.node.destroy()
    }

    update(deltaTime: number) {
        this.node.setContentSize(Tools.getSizeWindow(1080, 1920))
    }
}
