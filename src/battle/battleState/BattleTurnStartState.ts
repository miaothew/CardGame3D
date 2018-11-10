import { IBattleState, BattleStateType } from "./BattleStateManager";
import { GameTime } from "../../data/GameTime";
import { GameData } from "../../data/GameData";
import { E_NOTICE } from "../core/GameDefine";
import { BattleManager } from "../BattleManager";
import { GameStateManager } from "../../manager/GameStateManager";
export default class BattleTurnStartState implements IBattleState{
    public constructor() {
	}
	private _stateTo:BattleStateType = 0;
	gameState():BattleStateType{
		return BattleStateType.TURN_START;
	}

	enter():void{
		GameData.instance.sendNotif(E_NOTICE.BATTLE_STATE_CHANGE,BattleStateType.TURN_START);
		
	}

	updateTime(gameTime:GameTime){
		BattleManager.Instance.startTurn();
	}

	exit():void{
        
	}
}