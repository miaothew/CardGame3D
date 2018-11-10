import { IBattleState, BattleStateType, BattleStateManager } from "./BattleStateManager";
import { GameTime } from "../../data/GameTime";
import { GameData } from "../../data/GameData";
import { E_NOTICE } from "../core/GameDefine";
import { BattleManager } from "../BattleManager";
export default class BattleOppTurnState implements IBattleState{
    public constructor() {
	}
	private _stateTo:BattleStateType = 0;
	gameState():BattleStateType{
		return BattleStateType.OPPOSITE_TURN;
	}

	enter():void{
		let gData = GameData.instance;
		gData.sendNotif(E_NOTICE.BATTLE_STATE_CHANGE,BattleStateType.OPPOSITE_TURN);
		gData.oppState = 0;
		
	}


	updateTime(gameTime:GameTime){
		if(GameData.instance.oppQueue){
			let result = BattleManager.Instance.enemyAction();
			if(!result){
				BattleManager.Instance.state.changeGameState(BattleStateType.WAIT_TURN);
			}
		}
	}

	exit():void{
        
	}
}