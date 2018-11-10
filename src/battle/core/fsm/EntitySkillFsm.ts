
import { Entity } from "../entity/Entity";
import { EntityFSM, FsmState } from "./EntityFsm";
import { EntityManager } from "../entity/EntityManager";
import { GameTime } from "../../../data/GameTime";
import { AnimalEntity } from "../entity/AnimalEntity";
import { EntityFreeFsm } from "./EntityFreeFsm";
import { ActionType } from "../GameDefine";
export class EntitySkillFsm implements EntityFSM {
	public static Instance: EntitySkillFsm;
	public constructor() {
	}

	canNotStateChange: boolean;
	public getState(): FsmState {
		return FsmState.FSM_STATE_RELEASE;
	}

	public enter(entity: Entity, stateLast: number): void {
		let animalEntity: AnimalEntity = entity as AnimalEntity;
		animalEntity.onReleaseSkill();
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
		if (animalEntity.action == ActionType.Idle && !entity.isBusy) {
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
