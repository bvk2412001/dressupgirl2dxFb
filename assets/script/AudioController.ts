// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import Tools from "./common/Tools";

const { ccclass, property } = cc._decorator;

@ccclass
export default class AudioController extends cc.Component {

    public static instance: AudioController = null;
    playBG: cc.AudioClip | null = null;




    @property(cc.AudioSource)
    bgmClip: cc.AudioSource



    backgroundMusicID;
    bgm


    public static getInstance() {
        if (this.instance == null)
            this.instance = new AudioController()
        return this.instance
    }
    onLoad() {
        AudioController.getInstance()
        // Get the AudioSource component
        const isMusic = Tools.getDataStorage("music");
        if (isMusic) {
            AudioController.getInstance().playBGMusic();
        }
        if (Tools.getDataStorage("music") == null || Tools.getDataStorage("music") == undefined) {
            Tools.saveDataStorage("music", true)
            AudioController.getInstance().playBGMusic();
        }

        console.log(Tools.getDataStorage("sound"))
        if (Tools.getDataStorage("sound") == null || Tools.getDataStorage("sound") == undefined) {
            console.log(Tools.getDataStorage("sound"))
            AudioController.getInstance()._soundOn = true;
            Tools.saveDataStorage("sound", true)
        }
        else {
           
            AudioController.getInstance()._soundOn = Tools.getDataStorage("sound");
            console.log(this._soundOn)
        }
    }
    private _soundOn: boolean = false;
    public setSound(value: boolean) {
        AudioController.getInstance()._soundOn = value;
    }


    public playBGMusic() {
       
        Tools.loadSoundAsset('audio/bgm', (sound) => {
            //check again.playBGMus.p.playBGMusic
            this.bgm = cc.audioEngine.playEffect(sound, true);
        });
    }



    //
    playButtonSound() { 
        console.log(this._soundOn)
        if (AudioController.getInstance()._soundOn) {
            Tools.loadSoundAsset('audio/click', (sound) => {
                cc.audioEngine.play(sound, false, 0.5)
            });
            
        }
    }
    playPhotoSound() {
        if (AudioController.getInstance()._soundOn) {
            Tools.loadSoundAsset('audio/PhotoSound', (sound) => {
                cc.audioEngine.play(sound, false, 1)
            });
        }
    }
    playDeleteSound() {
        if (AudioController.getInstance()._soundOn) {
            Tools.loadSoundAsset('audio/Delete', (sound) => {
                cc.audioEngine.play(sound, false, 1)
            });
        }
    }
    protected update(dt: number): void {
    }
}
