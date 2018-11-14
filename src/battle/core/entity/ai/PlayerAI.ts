import { AIBase } from "./AIBase";
import { AnimalEntity } from "../AnimalEntity";
import { EntityMoveFsm } from "../../fsm/EntityMoveFsm";
import { AIManager } from "./AIManager";
import { SkillHurt, SkillBase } from "../../skill/SkillBase";
import { DirectionUtil } from "../../util/GameUtils";
import { GameTime } from "../../../../data/GameTime";
import { FsmState } from "../../fsm/EntityFsm";
import { EntitySkillFsm } from "../../fsm/EntitySkillFsm";
import { ActionType, E_NOTICE } from "../../GameDefine";
import { SkillConfig, ConfigManager, SkillConditionConfig } from "../../../../config/ConfigManager";
import { GameData } from "../../../../data/GameData";
import { SkillManager } from "../../SkillManager";

/**
* name 
*/

	export class PlayerAI extends AIBase{
		/** 0不动 1走路 2施法 3保持原来状态*/
		public check(entity: AnimalEntity): number {
            if(super.check(entity) == 0 ){
                return 0;
			}
			if(entity.curFsm.getState() == FsmState.FSM_STATE_RELEASE && entity.action == ActionType.Idle){
				return 0;
			}
            // if(Math.random() > 0.8){
			// 	let fpcellx:number,fpcelly:number;
			// 	//离出生点太远就往回走
			// 	if(Math.abs(entity.a_bornX - entity.x) > 10 || Math.abs(entity.a_bornZ - entity.z) > 10){
			// 		fpcellx = entity.a_bornX;
			// 		fpcelly = entity.a_bornZ;
			// 	}else{
			// 		fpcellx = entity.x - 2 + Math.floor(Math.random() * 4);
			// 		fpcelly = entity.z - 2 + Math.floor(Math.random() * 4);
			// 	}
			// 	let tpoint:number[] = [fpcellx,fpcelly];
			// 	entity.prepareToMove(tpoint[0],tpoint[1],0.1);	
			// 	entity.changeFSMState(EntityMoveFsm.Instance);
			// }
			// AIManager.Instance.setAIInterval(entity.uid,3000 + Math.random() * 500);
			// entity.showBloodEffect(1234,0,0,0,0);
			return 3;
		}
		
		public doSkill(entity:AnimalEntity,target:AnimalEntity,skillid:number,level:number = 1):boolean{
			let skill:SkillBase = SkillManager.Instance.createSkill(skillid);
			skill.calculate(entity,target,skillid,level);
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

		public die(entity: AnimalEntity): void {
			// entity.die();
			GameData.instance.sendNotif(E_NOTICE.LOG,"玩家死亡-失败");
			GameData.instance.gameOver();
		}
	}
