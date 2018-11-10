/**
 * 本示例采用非脚本的方式实现，而使用继承页面基类，实现页面逻辑。在IDE里面设置场景的Runtime属性即可和场景进行关联
 * 相比脚本方式，继承式页面类，可以直接使用页面定义的属性（通过IDE内var属性定义），比如this.tipLbll，this.scoreLbl，具有代码提示效果
 * 建议：如果是页面级的逻辑，需要频繁访问页面内多个元素，使用继承式写法，如果是独立小模块，功能单一，建议用脚本方式实现，比如子弹脚本。
 */
import BattleUI from "./BattleUI"
import { ui } from "./../ui/layaMaxUI";
import {BattleManager} from "./../battle/BattleManager";
import { IObserver } from "../ob/Observer";
import { GameData } from "../data/GameData";
import { E_NOTICE } from "../battle/core/GameDefine";
import { WinDialog } from "./WinDialog";
import { GameOverDialog } from "./GameOverDialog";
export default class BattleScene extends ui.test.BattleSceneUI implements IObserver{
    ui: BattleUI;

    battleScene:Laya.Sprite;
    winDialog:WinDialog;
    gameOverDialog:GameOverDialog;
    constructor() {
        super();
    }

    createChildren(): void {
        super.createChildren();
        this.battleScene = this.addChild(new Laya.Sprite()) as Laya.Sprite;
        this.mouseEnabled = true;
        // this.battleScene.mouseEnabled = true;
        this.ui = this.addChild(new BattleUI) as BattleUI;
        BattleManager.Instance.init(this.battleScene);
    }

    updateData(cmd:number,data:any){
        switch(cmd){
            case E_NOTICE.GAME_OVER:
            {
                if(!this.gameOverDialog){
                    this.gameOverDialog = new GameOverDialog();
                }
                this.gameOverDialog.isModal = true;
                this.gameOverDialog.show(false);
            }
            break;
            case E_NOTICE.LEVEL_COMPLETE:
            {
                if(!this.winDialog){
                    this.winDialog = new WinDialog();
                }
                this.winDialog.isModal = true;
                this.winDialog.show(false);
            }
            break;
        }
    }

    onAwake() {
        GameData.instance.addObserver(this);
    }

    clickHandler(e) {
    }

    onDestroy() {
        GameData.instance.removeObserver(this);
    }
}