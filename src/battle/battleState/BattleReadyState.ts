import { IBattleState, BattleStateType } from "./BattleStateManager";
import { GameTime } from "../../data/GameTime";
import { GameData } from "../../data/GameData";
import { E_NOTICE } from "../core/GameDefine";
import { BattleManager } from "../BattleManager";
export default class BattleReadyState implements IBattleState{
    public constructor() {
	}
	private _stateTo:BattleStateType = 0;
	gameState():BattleStateType{
		return BattleStateType.READY;
	}


	enter():void{
		let gameData = GameData.instance;
		// gameData.mp = 3;
		// gameData.hp = 100;
		gameData.sendNotif(E_NOTICE.BATTLE_STATE_CHANGE,BattleStateType.READY);
		gameData.prepareCardPile();
		gameData.myTurn = true;
	}

	updateTime(gameTime:GameTime){
		BattleManager.Instance.state.changeGameState(BattleStateType.TURN_START);
	}

	exit():void{
        
	}
}