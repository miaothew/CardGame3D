/**
 * 本示例采用非脚本的方式实现，而使用继承页面基类，实现页面逻辑。在IDE里面设置场景的Runtime属性即可和场景进行关联
 * 相比脚本方式，继承式页面类，可以直接使用页面定义的属性（通过IDE内var属性定义），比如this.tipLbll，this.scoreLbl，具有代码提示效果
 * 建议：如果是页面级的逻辑，需要频繁访问页面内多个元素，使用继承式写法，如果是独立小模块，功能单一，建议用脚本方式实现，比如子弹脚本。
 */
import { ui } from "./../ui/layaMaxUI";
import { GameStateManager } from "../manager/GameStateManager";
import { GameStateType } from "../manager/GameStateManager";
import { GameData } from "../data/GameData";
export default class SelectHeroUI extends ui.ui.SelectHeroSceneUI {
    constructor() {
        super();
        //加载场景文件
        //this.loadScene("ui/SelectHeroSkin.scene");
    }

    onAwake() {
        this.hero1.on(Laya.UIEvent.CLICK, this, this.clickHandler);
        this.hero2.on(Laya.UIEvent.CLICK, this, this.clickHandler);
        this.hero3.on(Laya.UIEvent.CLICK, this, this.clickHandler);
        this.hero4.on(Laya.UIEvent.CLICK, this, this.clickHandler);
    }

    clickHandler(e) {
        switch (e.currentTarget) {
            case this.hero1:
                GameData.instance.career = 1;
                break;
            case this.hero2:
                GameData.instance.career = 2;
                break;
            case this.hero3:
                GameData.instance.career = 3;
                break;
            case this.hero4:
                GameData.instance.career = 4;
                break;
        }
		GameStateManager.Instance.changeGameState(GameStateType.GameEnter);
    }

    onDestroy() {
        this.hero1.off(Laya.UIEvent.CLICK, this, this.clickHandler);
        this.hero2.off(Laya.UIEvent.CLICK, this, this.clickHandler);
        this.hero3.off(Laya.UIEvent.CLICK, this, this.clickHandler);
        this.hero4.off(Laya.UIEvent.CLICK, this, this.clickHandler);
    }
}