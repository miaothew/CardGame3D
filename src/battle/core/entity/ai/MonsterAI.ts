import { EntityMoveFsm } from "../../fsm/EntityMoveFsm";
import { AIManager } from "./AIManager";
import { AnimalEntity } from "../AnimalEntity";
import { AIBase } from "./AIBase";
import { SkillHurt } from "../../skill/SkillBase";
import { DirectionUtil } from "../../util/GameUtils";
import { GameTime } from "../../../../data/GameTime";
import { FsmState } from "../../fsm/EntityFsm";
import { EntitySkillFsm } from "../../fsm/EntitySkillFsm";
import { ActionType } from "../../GameDefine";
import { Monster } from "../Monster";
import { ConfigManager, SkillConfig, SkillConditionConfig, MonsterSkillConfig } from "../../../../config/ConfigManager";
import { BattleManager } from "../../../BattleManager";

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
			// let target = EntityManager.Instance._enemyDic[2];
			let skillConfig:SkillConfig = ConfigManager.Instance.skill[skillid];
			let skillCondition:SkillConditionConfig = ConfigManager.Instance.skillCondition[skillid][level];
			let skillhurt:SkillHurt = new SkillHurt();
			skillhurt.id = target.id;
			let monster:Monster = entity as Monster;
			// let crit:boolean = CommonLogic.randomCrit(critical,level,monCritratio);
			// skillhurt.plus = 1;
			skillhurt.effectValue = skillhurt.hurt = -Math.floor(monster.config.att * skillCondition.rate / 10000) - skillCondition.hurt;
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
			entity.dieEnd(true);
			BattleManager.Instance.checkEnemyState();
		}
    }
