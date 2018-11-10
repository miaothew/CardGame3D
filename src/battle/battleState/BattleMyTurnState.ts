import { IBattleState, BattleStateType } from "./BattleStateManager";
import { GameTime } from "../../data/GameTime";
import { GameData } from "../../data/GameData";
import { E_NOTICE } from "../core/GameDefine";
export default class BattleMyTurnState implements IBattleState{
    public constructor() {
	}
	private _stateTo:BattleStateType = 0;
	gameState():BattleStateType{
		return BattleStateType.MY_TURN;
	}

	enter():void{
		GameData.instance.mp = 3;
		GameData.instance.drawCards();
		GameData.instance.sendNotif(E_NOTICE.BATTLE_STATE_CHANGE,BattleStateType.MY_TURN);
	}


	updateTime(gameTime:GameTime){
		
	}

	exit():void{
        
	}
}