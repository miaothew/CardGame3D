import { IUpdateable, IDProvider } from "./util/GameUtils";
import { GameTime } from "../../data/GameTime";
import { SkillBase } from "./skill/SkillBase";
import { Pool } from "../../utils/Pool";
import { E_Skill_Type } from "./GameDefine";
import { SkillConfig, ConfigManager } from "../../config/ConfigManager";
import { NormalHurtSkill } from "./skill/NormalHurtSkill";
import { MagicSkill } from "./skill/MagicSkill";

export class SkillManager implements IUpdateable{
	
	private static _instance:SkillManager;
	public enabled:boolean = true;
	public _skills:{[key:number]:SkillBase} = {};
	public _readyToDispose:Array<SkillBase>;
	private skillPools:{[key:number]:Pool<SkillBase>};
	public empty:boolean = true;

	public static get Instance():SkillManager
    {
        if(this._instance == null || this._instance == undefined)
        {
            this._instance = new SkillManager();
        }
        return this._instance;
    }

	constructor(){
		let thisObj = this;
		thisObj._skills = {};
		thisObj._readyToDispose = new Array<SkillBase>();
		thisObj.skillPools = {};
		thisObj.skillPools[E_Skill_Type.NORMAL] = new Pool<NormalHurtSkill>(NormalHurtSkill);
		thisObj.skillPools[E_Skill_Type.MAGIC] = new Pool<NormalHurtSkill>(MagicSkill);
	}
	

	public updateTime(gameTime:GameTime):void{
		let thisObj = this;
		let noneSkill:boolean = true;
		for(let key in thisObj._skills){
			let skill = thisObj._skills[key];
			if(skill.enabled)
				skill.update(gameTime);
			noneSkill = false;
		}
		for(let dead of thisObj._readyToDispose){
			delete thisObj._skills[dead.id];
			dead.dispose();
		}
		thisObj._readyToDispose.length = 0;
		thisObj.empty = noneSkill;
	}

	public cleanSkill()
	{
		let thisObj = this;
		for(let key in thisObj._skills){
			let skill = thisObj._skills[key];
			thisObj._readyToDispose.push(skill);
		}
	}

	public readyToDie(skill:SkillBase):void{
		this._readyToDispose.push(skill);
	}

	public createSkill(skillid:number):SkillBase{
		let skillCfg:SkillConfig = ConfigManager.Instance.skill[skillid];
		let pool:Pool<SkillBase> = this.skillPools[skillCfg.skilltype];
		if(pool){
			let skill:SkillBase = pool.pop();
			skill.id = IDProvider.getSkillInsID();
			skill.enabled = false;
			this._skills[skill.id] = skill;
			this.empty = false;
			return skill;
		}
		return null;
	}

	public returnSkill(skill:SkillBase):void{
		let pool:Pool<SkillBase> = this.skillPools[skill.type];
		if(pool){
			pool.push(skill);
		}
	}

	public getSkillById(sid:number):SkillBase{
		if(sid in this._skills){
			return this._skills[sid];
		}else 
		{
			return null;
		}
	}
}