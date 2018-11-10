export default class ImageTest extends Laya.Script {
    private scaleTime: number;

    onAwake() {

        this.scaleTime = 100;
        this.owner.on(Laya.Event.MOUSE_DOWN, this, this.scaleSmal);
        //添加鼠标抬起事件侦听。抬起时还原按钮。
        this.owner.on(Laya.Event.MOUSE_UP, this, this.scaleBig);
        //添加鼠标离开事件侦听。离开时还原按钮。
        this.owner.on(Laya.Event.MOUSE_OUT, this, this.scaleBig);
    }

    scaleBig()  {
        //变大还原的缓动效果
        Laya.Tween.to(this.owner, { scaleX: 1, scaleY: 1 }, this.scaleTime);
    }
    scaleSmal()  {
        //缩小至0.8的缓动效果
        Laya.Tween.to(this.owner, { scaleX: 0.8, scaleY: 0.8 }, this.scaleTime);
    }

    onDestroy() {
        //添加鼠标按下事件侦听。按时时缩小按钮。
        this.owner.off(Laya.Event.MOUSE_DOWN, this, this.scaleSmal);
        //添加鼠标抬起事件侦听。抬起时还原按钮。
        this.owner.off(Laya.Event.MOUSE_UP, this, this.scaleBig);
        //添加鼠标离开事件侦听。离开时还原按钮。
        this.owner.off(Laya.Event.MOUSE_OUT, this, this.scaleBig);
    }
}