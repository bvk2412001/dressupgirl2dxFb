import Language from "./Language";

const { ccclass, property } = cc._decorator;

@ccclass
export default class LocaleLable extends cc.Component {
    @property({ type: String })
    key: string = "";

    id = ""
    protected onLoad(): void {
        this.id = this.node.uuid
        Language.getInstance().updateListLable(this.id, this.key, this.node.getComponent(cc.Label))
    }

    protected onDestroy(): void {
        Language.getInstance().removeLable()
    }
}
