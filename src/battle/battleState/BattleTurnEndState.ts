import { IBattleState, BattleStateType, BattleStateManager } from "./BattleStateManager";
import { GameTime } from "../../data/GameTime";
import { GameData } from "../../data/GameData";
import { E_NOTICE } from "../core/GameDefine";
import { BattleManager } from "../BattleManager";
export default class BattleTurnEndState implements IBattleState{
    public constructor() {
	}
	private _stateTo:BattleStateType = 0;
	gameState():BattleStateType{
		return BattleStateType.TURN_END;
	}

	enter():void{
		GameData.instance.sendNotif(E_NOTICE.BATTLE_STATE_CHANGE,BattleStateType.TURN_END);
		GameData.instance.selectedCard = null;
		GameData.instance.dropCards();
	}

	updateTime(gameTime:GameTime){
		GameData.instance.myTurn = !GameData.instance.myTurn;
		BattleManager.Instance.enemyStateClear();
		BattleManager.Instance.state.changeGameState(BattleStateType.TURN_START);
	}

	exit():void{
        
	}
}