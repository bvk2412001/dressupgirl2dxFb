// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import Doll from "../Doll";
import ColorPicker from "./ColorPicker";
import Config from "./Config";
import ContantSpines from "./ContantSpines";
import Context from "./Context";
import { Native } from "./Enum";
import StaticData from "./StaticData";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Tools extends cc.Component {

    public static saveDataStorage(key: string, value): void {
        cc.sys.localStorage.setItem(key + Config.key, JSON.stringify(value));
    }

    public static getDataStorage(key: string) {
        return JSON.parse(cc.sys.localStorage.getItem(key + Config.key));
    }

    static LoadSpriteFrameFromPatch(patch: string, callBack) {
        try {
            cc.resources.load(patch, cc.SpriteFrame, (err, result: cc.SpriteFrame) => {
                if (err) console.error("loadRes: " + err);
                else {
                    callBack(err, result)
                }
            });

        }
        catch (err) {

        }

    }
    static loadSpriteAtlasFromPath(pathAtlas: string, callBack) {
        cc.loader.loadRes(pathAtlas, cc.SpriteAtlas, (err, atlas) => {
            callBack(atlas)
        })
    }

    public static setColorSlot(skeleton: sp.Skeleton, color, slotName) {
        let slot = skeleton.findSlot(slotName)
        slot.color.r = color.r / 255
        slot.color.g = color.g / 255
        slot.color.b = color.b / 255

    }

    static loadSpriteFrameAtlasFromPath(pathAtlas: string, imageName: string, callBack) {
        cc.loader.loadRes(pathAtlas, cc.SpriteAtlas, (err, atlas: cc.SpriteAtlas) => {
            if (err) console.log(err)
            else {
                callBack(atlas.getSpriteFrame(imageName))
            }
        })
    }
    public static downloadImage(data) {
        let a = document.createElement('a');
        a.href = data;
        a.download = 'downloaded-image.png';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

    }

    public static getSizeWindow(width, height) {
        let newH: number = 0
        let newW: number = 0
        let scaleW = cc.game.canvas.width / width
        let scaleH = cc.game.canvas.height / height
        if (scaleW > scaleH) {
            newW = cc.game.canvas.width / scaleH
            newH = height
        }
        else {
            newH = cc.game.canvas.height / scaleW
            newW = width
        }

        return new cc.Size(newW, newH)
    }

    public static checkNative() {
        if (cc.game.canvas.width < cc.game.canvas.height) {
            return Native.Mobile;
        }
        else {
            return Native.Web
        }
    }
    public static loadFBavatar(url, callback) {
        try {
            cc.assetManager.loadRemote(url, { ext: '.jpg' }, (err, tex) => {
                if (err)
                    console.error("LoadAvatar: " + err);
                else
                    if (tex instanceof cc.Texture2D) {
                        try {
                            if (callback) callback(err, new cc.SpriteFrame(tex), tex);
                        } catch (error) {
                            console.error("LoadAvatar: " + error);
                        }
                    }
            });
        } catch (error) {
            console.error("LoadAvatar: " + error);
        }
    }

    static loadPrefab(pathName, callBack) {
        return new Promise((resolve, reject) => {
            try {
                let prefab: cc.Prefab = cc.resources.get(pathName);
                if (prefab) {
                    if (callBack)
                        callBack(null, prefab)

                    resolve(prefab)
                } else {
                    cc.resources.load(pathName, cc.Prefab, (err, prefab) => {
                        if (err) {
                            resolve(null);
                            console.error("loadPrefeb: " + err);
                            if (callBack)
                                callBack(err, null)
                        } else {
                            if (callBack)
                                callBack(null, prefab)
                            resolve(prefab)
                        }
                    });
                }
            } catch (err) {
                console.error("loadPrefeb: " + err);
                callBack(err, null)
            }
        });
    }

    public static getRandomNumber(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    public static setItemSlot(skeleton: sp.Skeleton, slotName, itemName, slot) {
        if (slot != ContantSpines.hairback && slot != ContantSpines.hairfront && slot != ContantSpines.hairside && slot != ContantSpines.coat) {
            skeleton.skeletonData.skeletonJson.slots.forEach(slota => {
                console.log(slota.name)
                skeleton.setAttachment(slota.name, null)
            })

        }
        else {
            skeleton.setAttachment("blank", null)
            console.log(slotName)
            skeleton.setAttachment(slotName, null)
        }


        
        skeleton.setAttachment(slotName, itemName)
    }

    public static addDoll(bg, scale, data) {
        let newDoll = cc.instantiate(StaticData.doll)
        bg.addChild(newDoll)
        newDoll.getChildByName("body").setScale(new cc.Vec3(scale, scale, 1))
        newDoll.getComponent(cc.Button).enabled = false
        data.forEach((slot, index) => {
            slot.forEach(item => {
                Tools.setSpineSave(newDoll.getComponent(Doll).listSkeleton[index], item.nameSlot, item.nameItem, item.color)
            })

        })
    }

    public static setSpineSave(skeleton: sp.Skeleton, slotName, itemName, color) {
        Tools.setColorSlot(skeleton, color, slotName)
        skeleton.setAttachment(slotName, itemName)
    }

    public static loadFlag(): Promise<void> {
        return new Promise((resolve, reject) => {
            cc.loader.loadRes("FlagImg", (err, data) => {
                StaticData.flagImg = data.json;
                resolve(StaticData.flagImg.flagImg);
            });
        })
    }

    public static saveDoll(doll: Doll) {
        let listSkeleton = []
        doll.listSkeleton.forEach((skeleton: sp.Skeleton) => {

            let listSlots: Object[] = []
            for (let i = 0; i < skeleton.skeletonData.skeletonJson.slots.length; i++) {
                let nameItem

                let slots = skeleton.skeletonData.skeletonJson.slots[i]
                if (skeleton.findSlot(slots.name).getAttachment()) {
                    nameItem = skeleton.findSlot(slots.name).getAttachment().name
                    let color = { r: skeleton.findSlot(slots.name).color.r * 255, g: skeleton.findSlot(slots.name).color.g * 255, b: skeleton.findSlot(slots.name).color.b * 255, a: skeleton.findSlot(slots.name).color.a * 255 }
                    let slot = {
                        nameSlot: slots.name,
                        nameItem: nameItem,
                        color: color


                    }
                    listSlots.push(slot)
                }
            }
            listSkeleton.push(listSlots)
        })
        console.log(listSkeleton)
        return listSkeleton
    }

    public static wrapText(input: string, maxLineLength: number) {
        const words = input.split(' ');

        let result = "";
        let line = "";

        for (const i of words) {
            if ((line + i).length > maxLineLength) {
                if (line.length) {
                    result += line.trim() + '\n';
                    line = "";
                }
                if (i.length > maxLineLength) {
                    let tmp = i;
                    while (tmp.length > maxLineLength) {
                        result += tmp.substring(0, maxLineLength) + '\n';
                        tmp = tmp.substring(maxLineLength);
                    }
                    line = tmp + ' ';

                } else {
                    line = i + ' ';
                }
            } else {
                line += i + ' ';
            }
        }

        if (line.trim()) {
            result += line.trim();
        }

        return result;
    }

    public static loadSoundAsset(path, callback) {
        cc.resources.load(path, cc.AudioClip, (error, asset) => {
            callback(asset);
        })
    }

    public static takePhoto(node, x) {
        let camera = node.addComponent(cc.Camera);
        camera.enabled = false;
        let texture = new cc.RenderTexture();
        let gl = cc.game._renderContext;
        // If the Mask component is not included in the screenshot, you don't need to pass the third parameter.
        texture.initWithSize(node.width, node.height, gl.STENCIL_INDEX8);
        camera.zoomRatio = cc.visibleRect.height / node.height;
        camera.targetTexture = texture;
        camera.render();

        // This allows the data to be obtained from the rendertexture.
        let data = texture.readPixels();
        // Then you can manipulate the data.
        let canvas = document.createElement('canvas');
        let ctx = canvas.getContext('2d');
        let width = texture.width;
        let height = texture.height;
        canvas.width = texture.width;
        canvas.height = texture.height - x;

        let rowBytes = width * 4;
        for (let row = 0; row < height; row++) {
            let startRow = height - 1 - row;
            let imageData = ctx.createImageData(width, 1);
            let start = startRow * width * 4;
            for (let i = 0; i < rowBytes; i++) {
                imageData.data[i] = data[start + i];
            }
            ctx.putImageData(imageData, 0, row);
        }

        let dataURL = canvas.toDataURL("image/jpeg");
        let img = document.createElement("img");
        img.src = dataURL;
        canvas.remove();
        console.log("dataURL", dataURL);

        return dataURL
    }

    public static filterBadWord(str: string) {
        var rgx = new RegExp(ColorPicker.filterWords.join("|"), "gi");
        return str.replace(rgx, "****");
    }
}
