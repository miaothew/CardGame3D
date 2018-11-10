
	import { Entity } from "../entity/Entity";
	import { EntityFSM, FsmState } from "./EntityFsm";
	import { EntityManager } from "../entity/EntityManager";
	import { GameTime } from "../../../data/GameTime";
import { AnimalEntity } from "../entity/AnimalEntity";
	export class EntityMoveFsm implements EntityFSM {
		public static Instance: EntityMoveFsm;
		public constructor() {
		}

		canNotStateChange: boolean;
		public getState(): FsmState {
			return FsmState.FSM_STATE_RUN;
		}

		public enter(entity: Entity, stateLast: number): void {
			if (entity instanceof AnimalEntity) {
				entity.bianshen(null);
				// if(entity.realUid.equals(EntityManager.Instance.controlPlayerID))//走动又不打断了
				// {
				// 	DataManager.Instance.arpgInstanceData.perpareLj.length = 0;
				// }
			}
			entity.onEnterMove();
		}

		public stateChange(entity: Entity, state: EntityFSM): boolean {
			return false;
		}

		public execute(entity: Entity, gameTime: GameTime): void {
			entity.onExecuteMove(gameTime);
		}
		public exit(entity: Entity): void {
			entity.stopTween();
		}
	}
