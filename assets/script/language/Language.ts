import Tools from "../common/Tools";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Language extends cc.Component {
    public static ins: Language

    listLable: Object[] = []
    public static getInstance() {
        if (!Language.ins) {
            Language.ins = new Language();
        }

        return Language.ins;
    }

    updateListLable(id, key, lable: cc.Label) {
        this.listLable.push({ id: id, key: key, lable: lable });

        let type = "en"

        if (Tools.getDataStorage("language")) {
            type = Tools.getDataStorage("language")
        }
        switch (type) {
            case "vn":
                lable.string = this.vn[key]
                break;

            case "en":
                lable.string = this.en[key]
                break;
        }
    }

    changeLanguage(type) {
        let change = (list) => {
            this.listLable.forEach((ob: any) => {
                if (ob.lable) {
                    ob.lable.string = list[ob.key]
                }
            });
        }


        Tools.saveDataStorage("language", type)
        switch (type) {
            case "vn":
                change(this.vn)
                break;
            case "en":
                change(this.en)
                break;
        }


    }

    removeLable() {
        console.log(this.listLable.length)
        let index1 = -1
        this.listLable.forEach((ob: any, index) => {
            console.log(ob.lable.node, index)
            if (ob.lable.node == null) {
                index1 = index

                if (index1 != -1) {
                    this.listLable.splice(index1, 1)
                }
            }
        })


        console.log(this.listLable.length)
    }

    public en = {
        "Play full game": "Play full game website: ",
        "Gallery": "Gallery",
        "Event": "Event",
        "Save": "Save",
        "Audio": "Audio",
        "Feedback": "Feedback",
        "Community": "Community",
        "Theme": "Theme",
        "Music": "Music",
        "Sound": "Sound",
        "FEEDBACK": "FEEDBACK",
        "We value your opinion": "We value your opinion",
        "Enter text here...": "Enter text here...",
        "Blue": "Blue",
        "Pink": "Pink",
        "Green": "Green",
        "Purple": "Purple",
        "Yellow": "Yellow",
        "THEME": "THEME",
        "Send to chat": "Send to chat",
        "GLOBAL": "GLOBAL",
        "No Image": "No Image",
        "Save the Doll in the": "Save the Doll\n in the",
        "to share in Chat": "to share in Chat",
        "Language": "Language",
        "Add avatar to make a picture": "Add avatar to make a picture",
        "Special": "Special",
        "Share": "Share",
        "Add": "Add",
        "Effect": "Effect",
        "None": "None",
        "Snow": "Snow",
        "Rain": "Rain",
        "Bubble": "Bubble",
        "Sakura": "Sakura",
        "To got this effect": "To got this effect",
        "Play on:": "Play on: ",
        "only valiable on": "only valiable on",
        "Global": "Global",
        "Wait": "Wait",
        "to upload another picture": "to upload another picture",
        "Comming soon" : "Comming soon",
        "Please Write Something!" : 'Please Write Something!'
    }



    public vn = {
        "Play full game": "Chơi full game tại website: ",
        "Gallery": "Album",
        "Event": "Sự kiện",
        "Save": "Lưu",
        "Audio": "Âm thanh",
        "Feedback": "Phản hồi",
        "Community": "Cộng đồng",
        "Theme": "Chủ đề",
        "Music": "Âm nhạc",
        "Sound": "Âm thanh",
        "FEEDBACK": "PHẢN HỒI",
        "We value your opinion": "Chúng tôi đánh giá cao \n ý kiến ​​của bạn",
        "Enter text here...": "Nhập văn bản ở đây...",
        "Blue": "Màu Xanh Lam",
        "Pink": "Màu Hồng",
        "Green": "Màu Xanh Lục",
        "Purple": "Màu Tím",
        "Yellow": "Màu Vàng",
        "THEME": "CHỦ ĐỀ",
        "Send to chat": "Gửi tin nhắn",
        "GLOBAL": 'TOÀN CẦU',
        "No Image": "Không có hình ảnh",
        "Save the Doll in the": "     Lưu Doll \ntrong",
        "to share in Chat": "để chia sẻ trong Chat",
        "Language": "Ngôn ngữ",
        "Add avatar to make a picture": "Thêm avatar để tạo ảnh",
        "Special": "Đặc biệt",
        "Share": "Chia sẻ",
        "Add": "Thêm",
        "Effect": "Hiệu ứng",
        "None": "Không có",
        "Snow": "Tuyết",
        "Rain": "Mưa",
        "Bubble": "Bong bóng",
        "Sakura": "Hoa đào",
        "To got this effect": "Để có được hiệu ứng này",
        "Play on:" : "Chơi tại: ",
        "only valiable on": "chỉ có hiệu lực trên",
        "Global" : "Toàn cầu",
        "Wait": "Chờ",
        "to upload another picture" : "để tải lên một hình ảnh khác",
        "Comming soon" : "Sắp ra mắt",
        "Please Write Something!": "Hãy viết gì đó đi!"
    }
}
