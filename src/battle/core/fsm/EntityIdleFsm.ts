
	import { Entity } from "../entity/Entity";
	import { EntityFSM, FsmState } from "./EntityFsm";
	import { EntityManager } from "../entity/EntityManager";
	import { GameTime } from "../../../data/GameTime";
	export class EntityIdleFsm implements EntityFSM {
		public static Instance: EntityIdleFsm;
		public constructor() {
		}

		canNotStateChange: boolean;
		public getState(): FsmState {
			return FsmState.FSM_STATE_IDLE;
		}

		public enter(entity: Entity, stateLast: number): void {

			entity.onEnterIdle();
		}

		public stateChange(entity: Entity, state: EntityFSM): boolean {
			return false;
		}
		public execute(entity: Entity, gameTime: GameTime): void {

		}
		public exit(entity: Entity): void {

		}
	}
