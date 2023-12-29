// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class ItemGallery extends cc.Component {
    @property(cc.Node)
    bg: cc.Node

    @property(cc.Node)
    select: cc.Node

    @property(cc.Node)
    delete: cc.Node

    @property(cc.Node)
    fb: cc.Node

    @property(cc.Node)
    loading: cc.Node

    callbackOnClick
    callbackDelete
    callbackShareFB
    setup(callbackonClick, callbackDelete, callbackShareFB) {
        this.callbackOnClick = callbackonClick;
        this.callbackDelete = callbackDelete
        this.callbackShareFB = callbackShareFB
    }

    


    onClick() {
        if(this.callbackOnClick)
        this.callbackOnClick()
    }
    btndelete() {
        if(this.callbackDelete)
        this.callbackDelete()
    }

    btnFacebook() {
        if(this.callbackShareFB)
        this.callbackShareFB()
    }
}
