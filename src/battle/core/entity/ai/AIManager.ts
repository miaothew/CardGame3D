import { EntityDeadFsm } from "../../fsm/EntityDeadFsm";
import { EntitySkillFsm } from "../../fsm/EntitySkillFsm";
import { EntityForceMoveFsm } from "../../fsm/EntityForceMoveFsm";
import { EntityFreeFsm } from "../../fsm/EntityFreeFsm";
import { EntityMoveFsm } from "../../fsm/EntityMoveFsm";
import { EntityPickupFsm } from "../../fsm/EntityPickupFsm";
import { GameTime } from "../../../../data/GameTime";
import { PlayerAI } from "./PlayerAI";
import { MonsterAI } from "./MonsterAI";
import { AIBase } from "./AIBase";

/**
* name 
*/
export class AIManager {

	// public static readonly instance:AIManager = new AIManager();
	public static Instance: AIManager;

	public static createInstance(): void {
		this.Instance = new AIManager();
		EntityDeadFsm.Instance = new EntityDeadFsm();
		EntitySkillFsm.Instance = new EntitySkillFsm();
		EntityForceMoveFsm.Instance = new EntityForceMoveFsm();
		EntityFreeFsm.Instance = new EntityFreeFsm();
		EntityMoveFsm.Instance = new EntityMoveFsm();
		EntityPickupFsm.Instance = new EntityPickupFsm();
	}


	public aiDic: { [key: number]: any } = {};
	/** ai脚本*/
	public aiIntevalDic: { [key: string]: number } = {};


	/** true 还没结束 false已经结束*/
	public isAIIntervalLimit(uid: string): boolean {
		let aitime = this.aiIntevalDic[uid];
		if (aitime == undefined) {
			aitime = 0;
		}
		return aitime > GameTime.Instance.totalGameTime;
	}


	public setAIInterval(uid: string, time: number): void {
		let aitime: number = GameTime.Instance.totalGameTime + time;
		let temptime: number = this.aiIntevalDic[uid];
		if (temptime == undefined) {
			temptime = 0;
		}
		this.aiIntevalDic[uid] = Math.max(aitime, temptime);
	}


	public constructor() {
		this.aiDic[AIType.PLAYER] = PlayerAI;
		this.aiDic[AIType.MONSTER] = MonsterAI;
	}

	/** 根据策划配置的来获取指定的ai*/
	public getAI(type: number): AIBase {
		let temp: any = this.aiDic[type];
		if (temp instanceof Function) {
			temp = new this.aiDic[type]();
			this.aiDic[type] = temp;
		}
		return temp;
	}

	public checkClose(fx: number, fy: number, tx: number, ty: number, closeX: number, closeY: number): boolean {
		return Math.abs(fx - tx) <= closeX && Math.abs(fy - ty) <= closeY;
	}

	public removeEntityAI(uid: string): void {
		delete this.aiIntevalDic[uid];
	}

}

export const enum AIType {
	PLAYER = 0,						//玩家
	MONSTER = 1,					//怪物
}

