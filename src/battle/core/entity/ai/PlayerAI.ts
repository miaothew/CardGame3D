import { AIBase } from "./AIBase";
import { AnimalEntity } from "../AnimalEntity";
import { EntityMoveFsm } from "../../fsm/EntityMoveFsm";
import { AIManager } from "./AIManager";
import { SkillHurt } from "../../skill/SkillBase";
import { DirectionUtil } from "../../util/GameUtils";
import { GameTime } from "../../../../data/GameTime";
import { FsmState } from "../../fsm/EntityFsm";
import { EntitySkillFsm } from "../../fsm/EntitySkillFsm";
import { ActionType, E_NOTICE } from "../../GameDefine";
import { SkillConfig, ConfigManager, SkillConditionConfig } from "../../../../config/ConfigManager";
import { GameData } from "../../../../data/GameData";

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
			 // let target = EntityManager.Instance._enemyDic[2];
			 let skillConfig:SkillConfig = ConfigManager.Instance.skill[skillid];
			 let skillCondition:SkillConditionConfig = ConfigManager.Instance.skillCondition[skillid][level];
			 let skillhurt:SkillHurt = new SkillHurt();
			 skillhurt.id = target.id;
			 // let crit:boolean = CommonLogic.randomCrit(critical,level,monCritratio);
			 skillhurt.plus = 0;
			 skillhurt.effectValue = skillhurt.hurt = -skillCondition.hurt;
			 let curhp:number =  target.a_truehp =  target.a_truehp + skillhurt.hurt;
			 if(curhp<=0)//死亡处理
			 {
				 target.a_truehp = 0;
				 target.a_isDead = true;
				 target.a_killer = entity.uid;
				 entity._entityTargetId = null;
			 }
			 let hurtlist = [];
			 hurtlist.push(skillhurt);
			 
			 // if(bufferid>0)
			 // {
			 // 	if(!buffList)
			 // 	{	
			 // 		buffList = [];
			 // 	}
			 // 	buff = new SKillBuffAdd();
			 // 	buff.bufferid = bufferid;
			 // 	buff.time = GameTime.Instance.totalGameTime + 30000;
			 // 	buff.id = eachEnemy.realUid;
			 // 	buffList.push(buff);
			 // }
			 entity.prepareSkillData(
				skillid,
				 target.id,
				 target.x,
				 target.y,
				 DirectionUtil.getForwardByGridXY(entity.x,entity.y,target.x,target.y),
				 GameTime.Instance.totalGameTime,
				 true,
				 hurtlist,
				 null,
				 0
			 );
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
