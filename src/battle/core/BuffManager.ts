import { AnimalEntity } from "./entity/AnimalEntity";
import { BuffConfig, ConfigManager, SkillEffectConfig } from "../../config/ConfigManager";
import { EffectManager } from "./effect/EffectManager";
import { GameTime } from "../../data/GameTime";
import { EntityManager } from "./entity/EntityManager";
import { E_Buff_Tpye, E_Buff_Trigger } from "./GameDefine";

export class BuffManager {
	public constructor() {
	}

	private static _instance:BuffManager;
	public enabled:boolean = true;

	private _buffs:{[key:number]:BuffVO} = {};

	private _nextUpdate:number = 0;

	public static get Instance():BuffManager
    {
        if(this._instance == null || this._instance == undefined)
        {
            this._instance = new BuffManager();
        }
        return this._instance;
    }

	public addBuff(entity:AnimalEntity,bufferAdd:BuffVO,showDelay:boolean = false):void{
		if(entity){
			
			let buff:BuffVO;
			if(!entity.a_buffList){
				entity.a_buffList = {};
			}
			// console.log(`${go.name}添加buff ${bufferAdd.buffid} - ${bufferAdd.lid}`);
			
			buff = bufferAdd
			entity.a_buffList[buff.id] = buff;
			let buffConfig:BuffConfig = ConfigManager.Instance.buff[buff.buffId];
			
			this._buffs[buff.id] = buff;
			//如果buff效果想要延时显示，比如毒或者麻痹之类的，延迟变颜色，那么showDelay传true，然后下面在延时check一下这个entity即可
			if(!showDelay){
				if(entity.display){	
					
					// let configs = ConfigManager.Instance.bufferEffects[buffConfig[BuffConConfig.bufferType]];
					// if(configs){
					// 	for(let effect of configs){
					// 		if(!buff.effects){
					// 			buff.effects = [];
					// 		}
					// 		// console.log("加魔法盾特效1");
					// 		if(!entity.hasEff(effect.effect)){
					// 			// console.log("加魔法盾特效2");
					// 			let eff = SceneEffectManager.Instance.addEntityEffect(entity,effect.effect,effect.x,effect.y,-1,1,effect.delaytime);
					// 			buff.effects.push[eff.id];
					// 		}
					// 	}
					// }
					// if(buffConfig[BuffConConfig.bufferType] == constants.E_Buff_Type.SHI_DU_SHU || buffConfig[BuffConConfig.bufferType] == constants.E_Buff_Type.HERO_SHI_DU_SHU){
					// 	entity.animal.setBodyFilter(FilterUtil.FILTER_GREEN());
					// }
					// else if(buffConfig[BuffConConfig.bufferType] == constants.E_Buff_Type.MA_BI || buffConfig[BuffConConfig.bufferType] == constants.E_Buff_Type.YE_MAN
					//  || buffConfig[BuffConConfig.bufferType] == constants.E_Buff_Type.HERO_YE_MAN){
					// 	entity.animal.setBodyFilter(FilterUtil.FILTER_MABI());
					// }
				}
			}
			
			
		}
	}

	public removeBuff(entity:AnimalEntity,lid:number):void{
		if(entity && entity.a_buffList && entity.a_buffList[lid]){
			let buffvo = entity.a_buffList[lid];
			if(buffvo.effects){
				for(let effid of buffvo.effects){
					let eff = EffectManager.Instance.getEffect(effid);
					if(eff){
						eff.die();
					}
				}
			}
			switch(buffvo.buffType){
				case E_Buff_Tpye.ARMOR:
				{
					if(buffvo.param > 0 && entity){
						entity.a_delayArmor = entity.a_trueArmor = entity.a_trueArmor - buffvo.param;
					}
				}
				break;
			}
			delete entity.a_buffList[lid];
			this.check(entity);
		}
		delete this._buffs[lid];
	}
	

	//检测是否加滤镜
	public check(entity:AnimalEntity):void{
		if(entity.display){
			let a_buffList:{[key:number]:BuffVO} = entity.a_buffList;
			let hasFilter:boolean = false;
			entity.mabi = false;
			for(let key in a_buffList){
				let buff:BuffVO = a_buffList[key];
				let buffConfig = ConfigManager.Instance.buff[buff.buffId];
				// if(buffConfig[BuffConConfig.bufferType] == constants.E_Buff_Type.MA_BI){
				// 	entity.mabi = true;
				// }
				// if(buffConfig[BuffConConfig.bufferType] == constants.E_Buff_Type.SHI_DU_SHU){
				// 	entity.animal.setBodyFilter(FilterUtil.FILTER_GREEN());
				// 	hasFilter = true;
				// 	continue;
				// }else if(buffConfig[BuffConConfig.bufferType] == constants.E_Buff_Type.MA_BI || buffConfig[BuffConConfig.bufferType] == constants.E_Buff_Type.YE_MAN
				// 		 || buffConfig[BuffConConfig.bufferType] == constants.E_Buff_Type.HERO_YE_MAN){
				// 	entity.animal.setBodyFilter(FilterUtil.FILTER_MABI());
				// 	continue;
				// }
				// let configs:Array<SkillEffectConfig> = ConfigManager.Instance.bufferEffects[buffConfig[BuffConConfig.bufferType]];
				// if(configs){
				// 	for(let effect of configs){
				// 		if(!buff.effects){
				// 			buff.effects = [];
				// 		}
				// 		if(!entity.hasEff(effect.effect)){
				// 			// let eff = EffectManager.Instance.addEntityEffect(entity,effect.effect,effect.x,effect.y,-1,1,effect.delaytime);
				// 			// buff.effects.push[eff.id];
				// 		}
				// 	}
				// }
			}
			if(!hasFilter){
				// entity.animal.setBodyFilter(null);
			}
		}
	}

	public subArmor(entity:AnimalEntity,value:number):void{
		let a_buffList:{[key:number]:BuffVO} = entity.a_buffList;
			for(let key in a_buffList){
				let buff:BuffVO = a_buffList[key];
				if(buff.param >= value){
					buff.param -= value;
					break;
				}else{
					value -= buff.param;
					buff.param = 0;
				}
			}
	}
	
	// buff结束移除处理，buff效果触发处理
	public turnBegin(turnNum:number):void{
		let thisObj = this;
		for(let key in thisObj._buffs)
		{
			let buff:BuffVO = thisObj._buffs[key];
			// if(buff.endTime < turnNum){//超过结束时间1秒了，客户端自己移除先？防止出bug一直被麻痹。。。
			// 	thisObj.removeBuff(EntityManager.Instance.getEntity(buff.entityId) as AnimalEntity,buff.id);
			// }
			if(buff.config.trigger == E_Buff_Trigger.TurnBegin){
				this.buffCalculate(buff,EntityManager.Instance.getEntity(buff.entityId) as AnimalEntity);
			}
		}
	}

	// buff结束移除处理，buff效果触发处理
	public turnEnd(turnNum:number):void{
		let thisObj = this;
		for(let key in thisObj._buffs)
		{
			let buff:BuffVO = thisObj._buffs[key];
			if(buff.endTime <= turnNum){//超过结束时间1秒了，客户端自己移除先？防止出bug一直被麻痹。。。
				thisObj.removeBuff(EntityManager.Instance.getEntity(buff.entityId) as AnimalEntity,buff.id);
			}else{
				if(buff.config.trigger == E_Buff_Trigger.TurnEnd){
					this.buffCalculate(buff,EntityManager.Instance.getEntity(buff.entityId) as AnimalEntity);
				}
			}
		}
	}

	public buffCalculate(buff:BuffVO,target:AnimalEntity):void{
		switch(buff.config.buffType){
			case E_Buff_Tpye.ARMOR:
			{
				let armor = Number(buff.config.parameter);
				target.a_delayArmor = target.a_trueArmor = target.a_trueArmor + armor;
				buff.param = armor;
			}
			break;
		}
	}


	//目前啥也没有。。
	public clear():void{
		this._buffs = {};
	}
}

export class BuffVO {
	public endTime:number;//结束回合数
	public buffId:number;
	public entityId:number;
	public id:number;
	public config:BuffConfig;
	public effects:number[];
	public param:number;
}
