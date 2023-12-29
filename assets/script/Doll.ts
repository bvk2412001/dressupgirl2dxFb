const {ccclass, property} = cc._decorator;

@ccclass
export default class Doll extends cc.Component {
    @property(sp.Skeleton)
    listSkeleton: sp.Skeleton[] = []

    @property(cc.Node)
    avatar: cc.Node

    @property(cc.Node)
    zoom: cc.Node

    
    start() {
       
    }


    update(deltaTime: number) {
        this.listSkeleton[2].node.zIndex = 2
        this.zoom.zIndex = 21
    }

    zoomOut() {
        if (this.avatar.scale < 1.6) {
            this.avatar.scale += 0.1
            this.node.setContentSize(new cc.Size(this.avatar.getContentSize().width * this.avatar.scale, this.avatar.getContentSize().height * this.avatar.scale))
        }
    }

    zoomIn() {
        if(this.avatar.scale > 0.6){
            if (this.avatar.getContentSize().width * this.avatar.scale < 70 || this.avatar.getContentSize().height * this.avatar.scale < 70) {
                if (this.avatar.getContentSize().width * this.avatar.scale > this.avatar.getContentSize().width
                    && this.avatar.getContentSize().height * this.avatar.scale >= this.avatar.getContentSize().height) {
                    this.avatar.scale -= 0.1
                    this.node.setContentSize(new cc.Size(this.avatar.getContentSize().width * this.avatar.scale, this.avatar.getContentSize().height * this.avatar.scale))

                }
            }
            else {
                this.avatar.scale -= 0.1
                this.node.setContentSize(new cc.Size(this.avatar.getContentSize().width * this.avatar.scale, this.avatar.getContentSize().height * this.avatar.scale))
            }
        }
    }
}
