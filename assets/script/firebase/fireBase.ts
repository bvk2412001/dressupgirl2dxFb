
const {ccclass, property} = cc._decorator;
@ccclass
export class fireBase extends cc.Component {

    public static instance: fireBase;
    onLoad() {
       
        if(fireBase.instance==null){
            
            fireBase.instance = this;
        }
        cc.game.addPersistRootNode(this.node);
    }

    public LogEvent(event){
        if (firebaseLib){
            console.log("event: " + event)
            firebaseLib.trackingEvent(event);
        }

    }

}

