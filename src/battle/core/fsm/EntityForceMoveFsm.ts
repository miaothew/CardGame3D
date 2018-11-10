
	import { Entity } from "../entity/Entity";
	import { EntityFSM, FsmState } from "./EntityFsm";
	import { EntityManager } from "../entity/EntityManager";
	import { GameTime } from "../../../data/GameTime";
	export class EntityForceMoveFsm implements EntityFSM {
		public static Instance: EntityForceMoveFsm;
		public constructor() {
		}

		canNotStateChange: boolean;
		public getState(): FsmState {
			return FsmState.FSM_STATE_FORCEMOVE;
		}

		public enter(entity: Entity, stateLast: number): void {
			entity.onEnterForceMove();
		}

		public stateChange(entity: Entity, state: EntityFSM): boolean {
			return false;
		}

		public execute(entity: Entity, gameTime:  GameTime): void {
			entity.onExecuteMove(gameTime);
		}
		public exit(entity: Entity): void {

		}
	}
