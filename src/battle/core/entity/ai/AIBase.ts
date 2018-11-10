import { Entity } from "../Entity";
import { EntityFreeFsm } from "../../fsm/EntityFreeFsm";
import { AnimalEntity } from "../AnimalEntity";
import { FsmState } from "../../fsm/EntityFsm";
import { AIManager } from "./AIManager";
import { EntityMoveFsm } from "../../fsm/EntityMoveFsm";

/**
* name 
*/
export class AIBase {
	/** 状态 0停止 1开始*/
	public state: number = 1;
	/** 技能延迟时间*/
	protected skillDelayTime: number = 1000;

	public moveComplete(entity: AnimalEntity, time: number): void {
		if (entity.curFsm.getState() == FsmState.FSM_STATE_RUN) {
			let state = this.check(entity);
			if (state != 0) {
				return;
			}
		}
		entity.changeFSMState(EntityFreeFsm.Instance);
	}

	/** 0不动 1走路 2施法 3保持原来状态*/
	public check(entity: AnimalEntity): number {
		//当前AI状态
		if (this.state == 0) {
			return 0;
		}
		//判断AI时间间隔
		if (AIManager.Instance.isAIIntervalLimit(entity.uid)) {
			return 0;
		}
		if (entity.pathArr && entity.pathArr.length > 0) {
			let toArr: Array<number> = entity.pathArr.shift();
			entity.prepareToMove(toArr[0], toArr[1], 0.1);
			if (entity.curFsm.getState() == FsmState.FSM_STATE_RUN) {
				entity.onEnterMove();
			} else {
				entity.changeFSMState(EntityMoveFsm.Instance);
			}

			// let heighty = SceneManager.Instance.terrainSprite.getHeight(-toArr[0]/40, toArr[1]/40);
			// if (isNaN(heighty)) {
			//      heighty = 0;
			// }
			// entity.setPixelPosition(toArr[0],heighty,toArr[1]);
			// if(entity.pathArr.length == 0){
			// 	entity.pathArr = null;
			// }
		}
		return 3;
	}

	public doSkill(entity:AnimalEntity,target:AnimalEntity,skillid:number,level:number = 1):boolean{
		return false;
	}

	public doSomething(entity:AnimalEntity,target:AnimalEntity):void{

	}

	/** 开始AI*/
	public start(): void {
		this.state = 1;
	}
	/** 停止AI*/
	public stop(): void {
		this.state = 0;
	}


	/**死亡一定要设置entity.deadTime时间，不然就一直躺着不会销毁了*/
	public die(entity: AnimalEntity): void {
		// if (entity instanceof AnimalEntity && entity.entityType != EntityType.PLAYER && entity.entityType != EntityType.HERO) {
		// 	entity.die();
		// 	entity.deadTime = GameTime.Instance.totalGameTime + 1500;//尸体时间
		// } else {
		// 	this.dieEnd(entity);
		// }
	}

	public relive(entity: Entity): void {
		// (entity as AnimalEntity).relive();
		// entity.changeFSMState(EntityFreeFsm.Instance);
	}

	public dieEnd(entity: Entity): void {
		// EntityManager.Instance.readyToDispose(entity);
	}


	//移动，发送至服务端同步
	public moveToServer(entity: Entity, x: number, y: number): void {

	}
	//技能释放 ，发送至服务端
	public skillToServer(entity: Entity, target, skillid: number): void {

	}
	/**通知服务端拾取掉落 */
	public pickupServer(entity: Entity, x: number, y: number): void {

	}
}

