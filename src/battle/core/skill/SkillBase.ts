import { AnimalEntity } from "../entity/AnimalEntity";
import { Entity } from "../entity/Entity";
import { LimitedPool, ILimitedPoolItem } from "../../../utils/Utils";
import { E_Skill_Type, GroupType, ActionType, EntityType, GameDefine } from "../GameDefine";
import { GameData } from "../../../data/GameData";
import { ConfigManager, SkillEffectConfig } from "../../../config/ConfigManager";
import { EffectManager } from "../effect/EffectManager";
import { GameTime } from "../../../data/GameTime";
import { SkillManager } from "../SkillManager";
import { EntityManager } from "../entity/EntityManager";
import { BuffManager } from "../BuffManager";
import { EntityDeadFsm } from "../fsm/EntityDeadFsm";

export class SkillBase{

    public type:E_Skill_Type;
	public skillid:number;
	public config:any;
	public targetEffect:SkillEffectConfig[];
	public from:AnimalEntity;
	public target:Entity;
	public targetX:number;
	public targetY:number;
	public enabled:boolean = false;
	protected hurtList:Array<SkillHurt>;
	protected bufferList:Array<SKillBuffAdd>;
	// protected bullet:SkillBullet;
	public id:number;
	protected end:boolean = false;
	public releaseTime:number;
	protected moving:boolean = false;
	private _showHurt:boolean = false;
	private _needSound:boolean;
	public isLj = false;
    private _attantion:boolean = true;
    
    
    public release($skillid:number,$from:AnimalEntity,$target:Entity,x:number,y:number,direction:number,time:number,showHurt:boolean,hurtList:Array<SkillHurt>,bufferList?:Array<SKillBuffAdd>):void{
		let thisObj = this;
		thisObj.from = $from;
		thisObj.target = $target;
		// thisObj._attantion = false;
		if(thisObj.target){
			thisObj.targetX = $target.x;
			thisObj.targetY = $target.y;
			// if($target && ($target as AnimalEntity).group == GroupType.SELF){
			// 	thisObj._attantion = true;
			// }
		}else{
			thisObj.targetX = x;
			thisObj.targetY = y;
		}
		thisObj.enabled = true;
		thisObj._showHurt = showHurt;
		thisObj.hurtList = hurtList;
		thisObj.bufferList = bufferList;
		thisObj.skillid = $skillid;
		thisObj.config = ConfigManager.Instance.skill[$skillid];
		if(thisObj.config.cls == E_Skill_Type.LIAN_JI)
		{
			thisObj.isLj = true;
		}
		thisObj.end = false;
		thisObj.releaseTime = time;
		//0攻击动作 1施法动作 2无动作
		if($from){
			if(thisObj.config.action == 0){
				$from.setAction(ActionType.Attack,direction,true);
			}
			thisObj.from.bianshen(null);
			
		}

		
		thisObj.initEffects();
		if(thisObj.bufferList){//为了把毒的伤害分隔代码放到伤害判断前，不知道会不会出先大问题 ---又改回来了
			thisObj.addBufferList(thisObj.bufferList);
		}
    }
    
    public initEffects():void{
		let thisObj = this;
		let from = thisObj.from;
		if(from && from.group == GroupType.SELF){
			thisObj._needSound = true;
		}else{
			thisObj._needSound = false;
		}
		let cfgBulletEffect:SkillEffectConfig;
		let cfgTargetEffets:SkillEffectConfig[];
		let configs:Array<SkillEffectConfig> = ConfigManager.Instance.skillEffects[thisObj.skillid];
		if(configs){
			for(let effect of configs){
				if(effect.type == 0){//施法者
					//cfgFirstEffets.push(effect);
					if(from){
						// EffectManager.Instance.addEffect(effect.effect,from.x ,from.y,
						// effect.pos == 1?MapLayerType.Effect_Above:MapLayerType.Effect_Below,1,effect.delaytime,
						// thisObj.from.dir,thisObj._needSound?effect.sound:null,null,effect.scale,effect.x,effect.y,null,
						// thisObj._attantion);
					}
				}else if(effect.type == 1){//受术者
					if(!cfgTargetEffets){
						cfgTargetEffets = [];
					}
					cfgTargetEffets.push(effect);
				}else if(effect.type == 2){//运动轨迹
					cfgBulletEffect = effect;
				}
			}
			thisObj.targetEffect = cfgTargetEffets;
			if(cfgBulletEffect && from){//有弹道的技能，打到人后开始计算受术者的特效延时和伤害延时
				thisObj.moving = true;
				// 	thisObj.bindex = Math.ceil(Math.random()*1000000);
				// let bulletEffect:SkillBullet = EffectManager.Instance.addSkillBullet(thisObj.id,cfgBulletEffect.effect,from.x,from.y - GameDefine.SKILL_HitTestY,thisObj.target,thisObj.targetX,thisObj.targetY,cfgBulletEffect.pos == 1?MapLayerType.Effect_Above:MapLayerType.Effect_Below,-1,cfgBulletEffect.delaytime,undefined,thisObj._needSound?cfgBulletEffect.sound:null,null,cfgBulletEffect.scale,cfgBulletEffect.x,cfgBulletEffect.y);
				// bulletEffect.bindex = thisObj.bindex;
				// if(!bulletEffect){
					thisObj.flyComplete();
				// }
			}else{
				thisObj.moving = false;
				thisObj.playTargetEffects();
			}
		}else{
			thisObj.targetEffect = undefined;
		}
	}

	public flyComplete():void{
		this.releaseTime = GameTime.Instance.totalGameTime;
		this.moving = false;
		this.playTargetEffects(60);
	}

	public playTargetEffects(yPlus:number = 0):void{
		let thisObj = this;
		if(thisObj.targetEffect){
			for(let effect of thisObj.targetEffect){
				// EffectManager.Instance.addEffect(effect.effect,thisObj.target,thisObj.targetX,thisObj.targetY - yPlus,
				// effect.pos == 1?MapLayerType.Effect_Above:MapLayerType.Effect_Below,1,effect.delaytime,undefined,
				// thisObj._needSound?effect.sound:null,null,effect.scale,effect.x,effect.y,effect.rotation,
				// thisObj._attantion);
			}
		}
	}


	public update(gameTime:GameTime):void{
		let thisObj = this;
		if(thisObj.end){
            
			SkillManager.Instance.readyToDie(this);
			thisObj.enabled = false;
		}else{
			if(!thisObj.moving && gameTime.totalGameTime > thisObj.config.hurtDelay + thisObj.releaseTime ){
				thisObj.playHurtList(thisObj.hurtList,gameTime);
				thisObj.end = true;
			}
		}
	}

	protected addBufferList(bufferList:Array<SKillBuffAdd>):void{
		let allentity:{[key:string]:Entity} = EntityManager.Instance.getAllEntity();
		for(let eachBuff of bufferList)
		{
			let ae:AnimalEntity = allentity[eachBuff.targetId.toString()] as AnimalEntity;
			// console.log("arpgbuff");
			
			
				BuffManager.Instance.addBuff(ae,eachBuff);
			
		}
	}

	protected playHurtList(hurtlist:SkillHurt[],gameTime:GameTime):void
	{
		// console.log(this.skillid + "结算");
		if(!hurtlist)
		{
			return;
		}
		let thisObj = this;
		let allentity:{[key:string]:Entity} = EntityManager.Instance.getAllEntity();
		let hurtindex:number = 0;//连击伤害按位置拍下去
		for(let eachhurt of hurtlist)
		{
			hurtindex++;
			let ae:AnimalEntity = allentity[eachhurt.id.toString()] as AnimalEntity;
			if(eachhurt.hurt == 0 && eachhurt.effectValue == 0)
			{
				continue;
			}
			if(!ae || !ae.enabled){
				continue;
			}
			if(thisObj._showHurt && eachhurt.effectValue!=0 && thisObj.from)
			{
				let dir:number = 0;
				if(thisObj.from && thisObj.from.enabled){
					if(thisObj.from.x > ae.x){
						dir = 1;
					}else if(thisObj.from.x < ae.x){
						dir = 2;
					}
				}
				let btype:number = 0;
				// if(!thisObj.from || ae.group == GroupType.SELF){
				// 	btype = 0;
				// }else{
				// 	// if(thisObj.from.group == GroupType.SELF)
				// 	// {
				// 	// 	ae.beHurt();
				// 	// }
				// 	if(thisObj.from.type == EntityType.MINION){
				// 		btype = 3;
				// 	}else if(thisObj.from.fighterObject.career == constants.E_Career.WARRIOR){
				// 		btype = 1;
				// 	}else if(thisObj.from.fighterObject.career == constants.E_Career.MAGE){
				// 		btype = 2;
				// 	}else if(thisObj.from.fighterObject.career == constants.E_Career.TAOIST){
				// 		btype = 3;
				// 	}
				// }
				if((thisObj._attantion || ae.group == GroupType.SELF)&& ((eachhurt.plus == 3 && hurtindex <=3) || eachhurt.plus != 3))//连击只显示3个搞笑把
				{
					ae.showBloodEffect(eachhurt.effectValue,dir,btype,eachhurt.plus,hurtindex);
				}
			}
			ae.a_delayhp += eachhurt.hurt;//这个还是要再算一次的把，延迟不一样呀
			ae.a_delayhp = ae.a_delayhp<0?0:ae.a_delayhp;
			if(eachhurt.hurt!=0)
			{
				ae.setBlood(ae.a_delayhp,ae.a_maxHp,true);
				// if(ae.type == EntityType.MONSTER)
				// {
				// 	GameData.instance.sendNotif(constants.E_DATA_NOTIFY_UIVIEW.UPDATE_HEAD,ae.gameObject);
				// }
			}
			if(ae.a_delayhp == 0 && ae.a_isDead)//fighterObject.delayhp <= 0 || 
			{
				// if(!gd.map.arpg){
				// 	if(ae.gameObject.type == EntityType.PLAYER && ae.gameObject.group == GroupType.SELF)
				// 	{
				// 		if(ae.animal)
				// 		{
				// 			ae.animal.visible = false;//是不是会出现模型池问题
				// 		}
				// 		ae._entityInfo.visible = false;
				// 		return;
				// 	}
				// }
				
				ae.changeFSMState(EntityDeadFsm.Instance);
				
			}
		}
    }
    
    public dispose():void{
		let thisObj = this;
		thisObj.enabled = false;
		thisObj.targetEffect = undefined;
		thisObj.from = undefined;
		thisObj.target = undefined;
		thisObj.isLj = false;
		thisObj.targetX = undefined;
		thisObj.targetY = undefined;
		thisObj.skillid = undefined;
		if(thisObj.hurtList){
			for(let hurt of thisObj.hurtList){
				hurt.dispose();
			}
			thisObj.hurtList = null;
		}
		SkillManager.Instance.returnSkill(this);
	}
}
export class NormalHurtSkill extends SkillBase{
	public constructor() {
		super();
		this.type = E_Skill_Type.NORMAL;
	}

	
}

export class SkillResult {
	public skillid:number;
	public toid:number;
	public x:number;
	public y:number;
	public time:number;
	public direction:number;
	public hurtList:Array<SkillHurt>;
	public bufferList:Array<SKillBuffAdd>;
	public showHurt:boolean;//是否显示飘雪
	public busyTime:number;
}

export class SkillHurt implements ILimitedPoolItem{
	public id:number;
	public hurt:number;
	public effectValue:number;//用来显示飘血的，boss打人要飘雪但是不掉血.....
//	public isChangeBlood:boolean = true;//是否更新血条,要是多人副本场景里的不显示可以去掉了
	// public curhp:number;//全造假的要你何用
	// public critical:boolean;
	public plus:number;
	public inner:number;
	private static pool:LimitedPool<SkillHurt> = new LimitedPool<SkillHurt>(SkillHurt,100);

	public static create(id?:number,hurt?:number,effectValue?:number,plus?:number,inner:number = 0):SkillHurt{
		let skillHurt = this.pool.pop();
		skillHurt.id = id;
		skillHurt.hurt = hurt;
		skillHurt.effectValue = effectValue;
		skillHurt.plus = plus;
		skillHurt.inner = inner;
		return skillHurt;
	}

	public dispose():void{
		if(this.id){
			SkillHurt.pool.push(this);
			this.id = null;
		}
	}

	disposePermanent():void{

	}
	returnToPool():void{

	}

}
export class SKillBuffAdd {
	public buffid:number;
	public targetId:number;
	public buffType:number;
	public time:number;
	public lid:number;
}