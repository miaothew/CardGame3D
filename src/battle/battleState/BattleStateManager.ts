import { GameTime } from "../../data/GameTime";
import BattleReadyState from "./BattleReadyState";
import BattleMyTurnState from "./BattleMyTurnState";
import BattleOppTurnState from "./BattleOppTurnState";
import BattleEndState from "./BattleEndState";
import BattleWaitState from "./BattleWaitState";
import BattleTurnStartState from "./BattleTurnStartState";
import BattleTurnEndState from "./BattleTurnEndState";

export class BattleStateManager {

	private _gameStates:{[stateType:number]:IBattleState} = {};
	private _currentState:IBattleState;
	public constructor() {

	}
	
	public init():void{
		let gState:IBattleState = new BattleReadyState();
		this._gameStates[BattleStateType.READY] = gState;

		gState = new BattleMyTurnState();
		this._gameStates[BattleStateType.MY_TURN] = gState;

		gState = new BattleOppTurnState();
		this._gameStates[BattleStateType.OPPOSITE_TURN] = gState;

		gState = new BattleTurnStartState();
		this._gameStates[BattleStateType.TURN_START] = gState;

		gState = new BattleTurnEndState;
		this._gameStates[BattleStateType.TURN_END] = gState;

		gState = new BattleEndState();
		this._gameStates[BattleStateType.END] = gState;
		
		gState = new BattleWaitState();
		this._gameStates[BattleStateType.WAIT_TURN] = gState;

	}

	public get curState():IBattleState{
		return this._currentState;
	}

	public changeGameState(state:BattleStateType):void{
		if(this._currentState != null && this._currentState.gameState() == state)
		{
			return;
		}
		if(this._gameStates[state] != null){
			if(this._currentState != null){
				this._currentState.exit();
			}
			this._currentState = this._gameStates[state];
			this._currentState.enter();
		}
	}

	public  updateTime(gameTime:GameTime)
	{
		if (this._currentState != null)
		{
			this._currentState.updateTime(gameTime);
		}
		// let nextStateType:BattleStateType = BattleStateType.Continue;
		// if (this._currentState != null)
		// {
		// 	nextStateType = this._currentState.update(gameTime);
		// }

		// if (nextStateType > BattleStateType.Continue)
		// {
		// 	this.changeGameState(nextStateType);
		// }
	}

	public getState(type:BattleStateType):IBattleState
	{
		return this._gameStates[type];
	}
}

export interface IBattleState{
	gameState():BattleStateType;
	enter():void;
	updateTime(gameTime:GameTime);
	exit():void;
}
export const enum BattleStateType{
    Continue,//继续当前状态
	READY,//等待游戏开始
	MY_TURN,//我的回合
	OPPOSITE_TURN,//对方回合
	TURN_START,//回合开始
	TURN_END,//回合结束
    WAIT_TURN,//回合等待，比如动画过程比较长。。。等待队列中动画播放完后才进入下一个回合
    END//本局结束
}