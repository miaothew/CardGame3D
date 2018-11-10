
	import { Entity } from "../entity/Entity";
	import { EntityFSM, FsmState } from "./EntityFsm";
	import { EntityManager } from "../entity/EntityManager";
	import { GameTime } from "../../../data/GameTime";
import { AnimalEntity } from "../entity/AnimalEntity";
	export class EntityFreeFsm implements EntityFSM {

		public static Instance: EntityFreeFsm;
		public constructor() {
		}

		canNotStateChange: boolean;
		public getState(): FsmState {
			return FsmState.FSM_STATE_FREE;
		}

		public enter(entity: Entity, stateLast: number): void {
			entity.onEnterFree();
		}

		public stateChange(entity: Entity, state: EntityFSM): boolean {
			return false;
		}
		public execute(entity: Entity, gameTime: GameTime): void {
			if (entity._entityAI) {
				if (entity.freeTime < gameTime.totalGameTime) {
					entity._entityAI.check(entity as AnimalEntity);
				}
			}
		}
		public exit(entity: Entity): void {

		}
	}
