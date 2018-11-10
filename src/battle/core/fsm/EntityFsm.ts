import { Entity } from "../entity/Entity";
import { GameTime } from "../../../data/GameTime";

	export interface EntityFSM {
		canNotStateChange: boolean;
		getState(): FsmState;
		enter(entity: Entity, stateLast: number): void;
		/**不让切换状态返回true */
		stateChange(entity: Entity, state: EntityFSM): boolean;
		execute(entity: Entity, gameTime: GameTime): void;
		exit(entity: Entity): void;
	}

	export const enum FsmState {
		//空闲
		FSM_STATE_FREE,
		//移动
		FSM_STATE_RUN,
		//施放技能
		FSM_STATE_RELEASE,
		//死亡
		FSM_STATE_DEAD,
		//强制移动
		FSM_STATE_FORCEMOVE,
		//复活
		FSM_STATE_RELIVE,
		//站立
		FSM_STATE_IDLE,
		//拾取掉落
		FSM_STATE_PICKUP,
	}
