// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class DataSaveItem extends cc.Component {
    public type: string
    public possision: cc.Vec3
    public scale: number
    public dataDoll = null
    public message = null
    public path = ""


    constructor(type, possision, scale, dataDoll = null, message = null, path = null) {
        super()

        this.type = type
        this.possision = possision
        this.scale = scale
        if (dataDoll)
            this.dataDoll = dataDoll
        if(message)
            this.message = message
        if(path)
            this.path = path
    }
}
