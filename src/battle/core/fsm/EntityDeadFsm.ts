import { Entity } from "../entity/Entity";
import { EntityFSM, FsmState } from "./EntityFsm";
import { EntityManager } from "../entity/EntityManager";
import { GameTime } from "../../../data/GameTime";
import { AnimalEntity } from "../entity/AnimalEntity";

	export class EntityDeadFsm implements EntityFSM {

		public static Instance: EntityDeadFsm;
		public constructor() {
		}

		canNotStateChange: boolean;
		public getState(): FsmState {
			return FsmState.FSM_STATE_DEAD;
		}

		public enter(entity: Entity, stateLast: number): void {
			entity._entityAI.die(entity as AnimalEntity);
			//entity.onEnterIdle();
		}

		public stateChange(entity: Entity, state: EntityFSM): boolean {
			if (entity == EntityManager.Instance.firstPlayer) {
				// if ((entity as AnimalEntity).fighterObject.isDead) {
				// 	return true;
				// }
			}
			return false;
		}

		public execute(entity: Entity, gameTime: GameTime): void {
			if (entity.canRelive) {
				if (entity.freeTime < gameTime.totalGameTime) {
					entity._entityAI.relive(entity);
					return;
				}
			}
			if ((entity as AnimalEntity).deadTime > 0 && (entity as AnimalEntity).deadTime < gameTime.totalGameTime) {
				entity._entityAI.dieEnd(entity);
			}

			// let animalEntity:AnimalEntity = entity as AnimalEntity;
			// // if(animalEntity.deadWaitTime < gameTime.totalGameTime){
			// 	if(animalEntity._entityAI)
			// 	{
			// 		animalEntity._entityAI.check(animalEntity);
			// 	}
			// entity.onEnterDead();
			// }

		}
		public exit(entity: Entity): void {

		}
	}
