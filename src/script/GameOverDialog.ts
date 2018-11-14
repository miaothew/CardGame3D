import { ui } from "../ui/layaMaxUI";
import { BattleManager } from "../battle/BattleManager";
import { GameData } from "../data/GameData";

export class GameOverDialog extends ui.ui.GameOverDialogSkinUI{
    onAwake(){
        this.btn_go.on(Laya.Event.CLICK,this,this.clickHandler);
    }

    private clickHandler(e:Laya.Event):void{
        GameData.instance.resetGame();
        BattleManager.Instance.destroyScene();
        BattleManager.Instance.init(null);
    }
}