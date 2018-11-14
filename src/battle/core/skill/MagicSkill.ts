import { SkillBase, SkillHurt } from "./SkillBase";
import { E_Skill_Type, E_Buff_Trigger } from "../GameDefine";
import { AnimalEntity } from "../entity/AnimalEntity";
import { DirectionUtil, IDProvider } from "../util/GameUtils";
import { GameTime } from "../../../data/GameTime";
import { SkillConfig, ConfigManager, SkillConditionConfig, BuffConfig } from "../../../config/ConfigManager";
import { utils } from "../../../utils/Utils";
import { BuffManager, BuffVO } from "../BuffManager";
import { GameData } from "../../../data/GameData";

export class MagicSkill extends SkillBase{
	public constructor() {
		super();
		this.type = E_Skill_Type.MAGIC;
    }
    
    public calculate(entity:AnimalEntity,target:AnimalEntity,skillid:number,level:number = 1,att:number = 0):void{
        let skillConfig:SkillConfig = ConfigManager.Instance.skill[skillid];
        let skillCondition:SkillConditionConfig = ConfigManager.Instance.skillCondition[skillid][level];
        let hurtlist;
        if(skillCondition.hurt > 0){
            let skillhurt:SkillHurt = new SkillHurt();
            skillhurt.id = target.id;
            // let crit:boolean = CommonLogic.randomCrit(critical,level,monCritratio);
            // skillhurt.plus = 1;
            let hurt:number = Math.floor(att * skillCondition.rate / 10000) + skillCondition.hurt;
			if(target.a_trueArmor > 0){
				if(target.a_trueArmor >= hurt){
					BuffManager.Instance.subArmor(target,hurt);
					target.a_delayArmor = target.a_trueArmor = target.a_trueArmor - hurt;
					skillhurt.hurt = 0;
				}else{
					hurt -= target.a_trueArmor;
					BuffManager.Instance.subArmor(target,target.a_trueArmor );
					target.a_delayArmor = target.a_trueArmor = 0;
				}
			}
			skillhurt.effectValue = skillhurt.hurt = -hurt;
            let curhp:number =  target.a_truehp =  target.a_truehp + skillhurt.hurt;
            if(curhp<=0)//死亡处理
            {
                target.a_truehp = 0;
                target.a_isDead = true;
                target.a_killer = entity.uid;
                entity._entityTargetId = null;
            }
            if(!this.hurtList){
                hurtlist = [];
            }
            hurtlist.push(skillhurt);
        }
        let buffs = utils.splitNumberTwoLevel(skillCondition.buffers,"&","#");
        let buffList;
        for (const iterator of buffs) {
            let targetType = iterator[0];
            let buffTarget = targetType == 1?target:entity;
            let buffid = iterator[1];
            if(buffTarget){
                if(!buffList)
                {	
                    buffList = [];
                }
                let buffCfg:BuffConfig = ConfigManager.Instance.buff[buffid];
                let buff = new BuffVO();
                buff.id = IDProvider.getBuffInsID();
                buff.entityId = buffTarget.id;
                buff.endTime = GameData.instance.turnId + buffCfg.duration;
                buff.buffId = buffid;
                buff.config = buffCfg;
                if(buff.config.trigger == E_Buff_Trigger.Immediate && buffTarget){//直接触发的
                    BuffManager.Instance.buffCalculate(buff,buffTarget);
                    buffList.push(buff);
                }else{
                    buffList.push(buff);
                }
            }
            
        }
		this.from = entity;
		this.prepareSkillData(
			skillid,
			target.id,
			target.x,
			target.y,
			DirectionUtil.getForwardByGridXY(entity.x,entity.y,target.x,target.y),
			GameTime.Instance.totalGameTime,
			true,
			hurtlist,
			buffList,
			0
		);
    }
}