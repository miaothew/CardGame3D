import { EntityMoveFsm } from "../../fsm/EntityMoveFsm";
import { AIManager } from "./AIManager";
import { AnimalEntity } from "../AnimalEntity";
import { AIBase } from "./AIBase";
import { SkillHurt, SkillBase } from "../../skill/SkillBase";
import { DirectionUtil } from "../../util/GameUtils";
import { GameTime } from "../../../../data/GameTime";
import { FsmState } from "../../fsm/EntityFsm";
import { EntitySkillFsm } from "../../fsm/EntitySkillFsm";
import { ActionType } from "../../GameDefine";
import { Monster } from "../Monster";
import { ConfigManager, SkillConfig, SkillConditionConfig, MonsterSkillConfig } from "../../../../config/ConfigManager";
import { BattleManager } from "../../../BattleManager";
import { SkillManager } from "../../SkillManager";

/*
* name;
*/
    export class MonsterAI extends AIBase{
       /** 0不动 1走路 2施法 3保持原来状态*/
		public check(entity: AnimalEntity): number {
            if(super.check(entity) == 0 ){
                return 0;
			}
			if(entity.curFsm.getState() == FsmState.FSM_STATE_RELEASE && entity.action == ActionType.Idle){
				return 0;
			}
			return 3;
            // if(Math.random() > 0.8){
			// 	let fpcellx:number,fpcelly:number;
			// 	//离出生点太远就往回走
			// 	if(Math.abs(entity.a_bornX - entity.x) > 10 || Math.abs(entity.a_bornZ - entity.z) > 10){
			// 		fpcellx = entity.a_bornX;
			// 		fpcelly = entity.a_bornZ;
			// 	}else{
			// 		fpcellx = entity.x - 5 + Math.floor(Math.random() * 10);
			// 		fpcelly = entity.z - 5 + Math.floor(Math.random() * 10);
			// 	}
			// 	let tpoint:number[] = [fpcellx,fpcelly];
			// 	entity.prepareToMove(tpoint[0],tpoint[1],0.1);	
			// 	entity.changeFSMState(EntityMoveFsm.Instance);
			// }
			// AIManager.Instance.setAIInterval(entity.uid,1000 + Math.random() * 500);
		}
		
		public doSkill(entity:AnimalEntity,target:AnimalEntity,skillid:number,level:number = 1):boolean{
			let monster:Monster = entity as Monster;
			let skill:SkillBase = SkillManager.Instance.createSkill(skillid);
			skill.calculate(entity,target,skillid,level,monster.config.att);
			entity.prepareSkillData(skill);
			if(entity.curFsm.getState() == FsmState.FSM_STATE_RELEASE)
			{
				entity.curFsm.enter(entity,0);
			}
			else
			{
				entity.changeFSMState(EntitySkillFsm.Instance);
			}
			return true;
	   }

	   public doSomething(entity:AnimalEntity,target:AnimalEntity):void{
		   	let monster:Monster = entity as Monster;
			let ms:MonsterSkillConfig = ConfigManager.Instance.monsterSkill[monster.mid];
			let skillid = ms.skillId[0];
			let skillLv = ms.skillLevel[0];
			if(!target.a_isDead){
				this.doSkill(entity,target,skillid,skillLv);
			}
		}

		public die(entity: AnimalEntity): void {
			entity.deadTime = GameTime.Instance.totalGameTime + 2000;
			entity.die();
		}

		public dieEnd(entity: AnimalEntity):void{
			entity.dieEnd(true);
			BattleManager.Instance.checkEnemyState();
		}
    }
