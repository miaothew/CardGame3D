/**拾取掉落状态，只有自己才会进入这个状态 */
import { Entity } from "../entity/Entity";
import { EntityFSM, FsmState } from "./EntityFsm";
import { EntityManager } from "../entity/EntityManager";
import { GameTime } from "../../../data/GameTime";
import { AnimalEntity } from "../entity/AnimalEntity";
import { EntityFreeFsm } from "./EntityFreeFsm";
	export class EntityPickupFsm implements EntityFSM {
		public static Instance: EntityPickupFsm;
		public constructor() {
		}

		canNotStateChange: boolean;
		public getState(): FsmState {
			return FsmState.FSM_STATE_PICKUP;
		}

		public enter(entity: Entity, stateLast: number): void {
			let animalEntity: AnimalEntity = entity as AnimalEntity;
			animalEntity.onPickup();
			entity.strategyTick = GameTime.Instance.totalGameTime + stateLast;
		}

		public stateChange(entity: Entity, state: EntityFSM): boolean {
			return false;
		}

		public execute(entity: Entity, gameTime: GameTime): void {
			if (entity.strategyTick > gameTime.totalGameTime) {
				return;
			}
			let animalEntity: AnimalEntity = entity as AnimalEntity;
			if (!entity.isBusy) {
				if (entity._entityAI) {
					if (entity._entityAI.check(animalEntity) != 0) {
						return;
					}
				}
				entity.changeFSMState(EntityFreeFsm.Instance);
			}
		}
		public exit(entity: Entity): void {

		}
	}
