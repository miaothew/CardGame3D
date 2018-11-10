import { IBattleState, BattleStateType } from "./BattleStateManager";
import { GameTime } from "../../data/GameTime";
import { GameData } from "../../data/GameData";
import { E_NOTICE } from "../core/GameDefine";
import { BattleManager } from "../BattleManager";
import { SkillManager } from "../core/SkillManager";
export default class BattleWaitState implements IBattleState{
    public constructor() {
	}
	private _stateTo:BattleStateType = 0;
	gameState():BattleStateType{
		return BattleStateType.WAIT_TURN;
	}

	enter():void{
		GameData.instance.sendNotif(E_NOTICE.BATTLE_STATE_CHANGE,BattleStateType.WAIT_TURN);
	}


	updateTime(gameTime:GameTime){
		if(SkillManager.Instance.empty){
			if(GameData.instance._gameOver){
				GameData.instance.sendNotif(E_NOTICE.GAME_OVER);
			}else
				BattleManager.Instance.state.changeGameState(BattleStateType.TURN_END);
		}
	}

	exit():void{
        
	}
}