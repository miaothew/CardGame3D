import { utils } from "../utils/Utils";

export class ConfigManager{

	public static Instance:ConfigManager = new ConfigManager();
	public tables;
	loadConfig(callback): void {
		this.tables = [
			{url:"config/cfg_card.csv",item:this.card,cls:CardConfig,reader:this.setConf}, 
			{url:"config/cfg_buff.csv",item:this.buff,cls:BuffConfig,reader:this.setConf}, 
			{url:"config/cfg_skill_effects.csv",item:this.skillEffects,cls:SkillEffectConfig,reader:this.addSkillEffect}, 
			{url:"config/cfg_skills.csv",item:this.skill,cls:SkillConfig,reader:this.setConf}, 
			{url:"config/cfg_skills_condition.csv",item:this.skillCondition,cls:SkillConditionConfig,reader:this.addSkillCondition}, 
			{url:"config/cfg_monsters.csv",item:this.monster,cls:MonsterConfig,reader:this.setConf}, 
			{url:"config/cfg_monster_skill.csv",item:this.monsterSkill,cls:MonsterSkillConfig,reader:this.addMonsterSkill},
			{url:"config/map.json",type:"json",item:"map"},
			{url:"config/obj.json",type:"json",item:"obj"}
		];
		let tablesUrl = [];
		this.tables.forEach(element => {
			let type = element.type == "json"?Laya.Loader.JSON:Laya.Loader.TEXT;
			tablesUrl.push( {url:element.url,type:type});
		});
        Laya.loader.create(tablesUrl, Laya.Handler.create(this, this.configLoaded, [callback]), null);
	}
	
	public skill = {};
	public skillCondition = {};
	public card = {};
	public skillEffects = {};
	public bufferEffects = {};
	public buff = {};
	public monsterSkill = {};
	public monster = {};
	public level = {};
	public map;
	public obj;

    configLoaded(callback): void {
		this.tables.forEach(element => {
			let str = Laya.loader.getRes(element.url);
			if(element.type == "json"){
				this[element.item] = str;
			}else
				element.reader.call(this,str, element.cls, element.item);
		});
		if (callback) {
            callback();
        }
	}
	
	private addMonsterSkill(content: string, configs, con):void{
		let contents: string[][] = [];
        let columns: string[];
        let types: string[];
        var lines: string[] = content.split("\n");
        let noUseLine = 1;
        while (noUseLine > 0) {
            noUseLine--;
            lines.shift();
        }
        var line0: String = lines[0];
        var line1: String = lines[1];
        columns = line1.trim().split(","); line1
        types = line0.trim().split(",");
        var columnsCount: number = columns.length;
        var row: string[] = null;
        for (let i: number = 2; i < lines.length; i++) {
            let line: String = lines[i];
            if (line) {
                row = line.trim().split(',');
                contents.push(row);
            }
        }
        for (let i: number = 0; i < contents.length; i++) {
            let line: string[] = contents[i];
            let config = new configs();
            for (let j: number = 0; j < columns.length; j++) {
                let key: string = columns[j];
                let type: string = types[j];
                if (type == "str") {
                    config[key] = line[j];
                } else if(type != "")
                    config[key] = Number(line[j]);
            }
			con[config["monsterId"]] = config;
			config.skillId = utils.splitNumber(config.skillId,"#");
			config.skillLevel = utils.splitNumber(config.skillLevel,"#");
			config.hpPercentMax = utils.splitNumber(config.hpPercentMax,"#");
			config.hpPercentMin = utils.splitNumber(config.hpPercentMin,"#");
			config.priority = utils.splitNumber(config.priority,"#");
        }
	}

	private setConf(content: string, configs, con) {
        let contents: string[][] = [];
        let columns: string[];
        let types: string[];
        var lines: string[] = content.split("\n");
        let noUseLine = 1;
        while (noUseLine > 0) {
            noUseLine--;
            lines.shift();
        }
        var line0: String = lines[0];
        var line1: String = lines[1];
        columns = line1.trim().split(","); line1
        types = line0.trim().split(",");
        var columnsCount: number = columns.length;
        var row: string[] = null;
        for (let i: number = 2; i < lines.length; i++) {
            let line: String = lines[i];
            if (line) {
                row = line.trim().split(',');
                contents.push(row);
            }
        }
        for (let i: number = 0; i < contents.length; i++) {
            let line: string[] = contents[i];
            let config = new configs();
            for (let j: number = 0; j < columns.length; j++) {
                let key: string = columns[j];
                let type: string = types[j];
                if (type == "str") {
                    config[key] = line[j];
                } else if(type != "")
                    config[key] = Number(line[j]);
            }
            con[config["id"]] = config;
        }
	}

	protected addSkillCondition(content: string, configs, con):void{
		let contents: string[][] = [];
        let columns: string[];
        let types: string[];
        var lines: string[] = content.split("\n");
        let noUseLine = 1;
        while (noUseLine > 0) {
            noUseLine--;
            lines.shift();
        }
        var line0: String = lines[0];
        var line1: String = lines[1];
        columns = line1.trim().split(","); line1
        types = line0.trim().split(",");
        var columnsCount: number = columns.length;
        var row: string[] = null;
        for (let i: number = 2; i < lines.length; i++) {
            let line: String = lines[i];
            if (line) {
                row = line.trim().split(',');
                contents.push(row);
            }
        }
        for (let i: number = 0; i < contents.length; i++) {
            let line: string[] = contents[i];
            let config = new configs();
            for (let j: number = 0; j < columns.length; j++) {
                let key: string = columns[j];
                let type: string = types[j];
                if (type == "str") {
                    config[key] = line[j];
                } else
                    config[key] = Number(line[j]);
            }
			// con[config["id"]] = config;
			let sc = this.skillCondition;
			if (!(config.skillid in sc)) {
				sc[config.skillid] = {};
			}
			sc[config.skillid][config.level] = config;
        }
	}

	
	protected addSkillEffect(content: string, configs, con):void{
		let contents: string[][] = [];
        let columns: string[];
        let types: string[];
        var lines: string[] = content.split("\n");
        let noUseLine = 1;
        while (noUseLine > 0) {
            noUseLine--;
            lines.shift();
        }
        var line0: String = lines[0];
        var line1: String = lines[1];
        columns = line1.trim().split(","); line1
        types = line0.trim().split(",");
        var columnsCount: number = columns.length;
        var row: string[] = null;
        for (let i: number = 2; i < lines.length; i++) {
            let line: String = lines[i];
            if (line) {
                row = line.trim().split(',');
                contents.push(row);
            }
        }
        for (let i: number = 0; i < contents.length; i++) {
            let line: string[] = contents[i];
            let config = new configs();
            for (let j: number = 0; j < columns.length; j++) {
                let key: string = columns[j];
                let type: string = types[j];
                if (type == "str") {
                    config[key] = line[j];
                } else
                    config[key] = Number(line[j]);
            }
			// con[config["id"]] = config;
			let skillEffects:{ [key: number]: Array<SkillEffectConfig> } = this.skillEffects;
			let bufferEffects:{ [key: number]: Array<SkillEffectConfig> } = this.bufferEffects;
			if (config.efftype == 0) {
				if (!(config.skillid in skillEffects)) {
					skillEffects[config.skillid] = [];
				}
				skillEffects[config.skillid].push(config);
			} else if (config.efftype == 1) {
				if (!(config.skillid in bufferEffects)) {
					bufferEffects[config.skillid] = [];
				}
				bufferEffects[config.skillid].push(config);
			}
        }
	}
}
	
export class SkillEffectConfig{
	id:number;
	skillid:number;
	delaytime:number;
	type:number;
	pos:number;
	effect:number;
	sound:number;
	frame:number;
	efftype:number;
	scale:number;
	x:number;
	y:number;
	front:number;
	sortchange:number;
	param:String;
	autorotate:number;
	hidemovie:number;
	rotation:number;
}

export class CardConfig {
    id;//: number
	name;//名字: string
	desc;//卡牌描述: string
    type;//类型 1:外功 2.道具 3：内功 4：轻功: number
    term;//技能使用条件: number
    skill;//技能ID: string
    mp;//耗蓝: number
    source;//资源: string
}

export class RoleConfig {
    id;//: number
    name;//名字: string
    blue;//内力值: number
    skill;//技能ID: number
    red;//生命: number
    deck;//卡组: string
}


export class SkillConfig{
	id:number;
	name:string;
	icon:string;
	cls:number;
	isshow:number;
	skilltype:number;
	career:number;
	/**
	 * 目标类型
	 * 1敌人2队友（包括自己）3自己 4.对地（火墙）
	 */
	targetType:number;
	/**0攻击动作 1施法动作 2无动作 */
	action:number;
	tips1:string;
	hurtDelay:number;
	
	/**是否是被动技能 */
	passive:number;
	/**技能释放距离 */
	releaseDis:number;
	/**消耗魔法 */
	costMp:number;
	/**
	 * 释放目标类型
	 * 1、对目标，2、对点（客户端发过来的点），3、自己所在的点
	 */
	releaseType:number;
	/**作用区域范围大小 */
	areaDis:number;
	
}

export class SkillConditionConfig{
	skillid:number;
	level:number;
	param:string;
	rate:number;
	hurt:number;
	armor:number;
	buffers:string;
}

//id,name,trigger,bufferType,probability,parameter,show,type,overLying,replace,extraParam,duration,cd,cdTime,icon,buffName,txt,buffeffect

export class BuffConfig {
	id: number;
	name: string;
	buffType: number;
	trigger: number;
	probability: number;
	parameter: string;
	extraParam:string;
	duration: number;
	show: string;
	overLying:number;
	replace:number;
	cd:number;
	cdTime:number;
	type: number;
	icon: string;
	txt: string;
	buffeffect:number;
}
// id,type,name,level,hpshow,head,model,hp,fixHurt,att,phyDef,magicDef,bloodY,scale,canRepel,aitype,heart

export class MonsterConfig{
	id:number;
	type:number;
	name:string;
	head:number;
	model:number;
	hp:number;
	scale:number;
	bloodY:number;
	hpshow:number;
	att:number;
	level:number;
	aitype:number;
}

export class MonsterSkillConfig{
	id:number;
	monsterId:number;
	skillId:number[];
	skillLevel:number[];
	hpPercentMax:number[];
	hpPercentMin:number[];
	priority:number[];
	cdTime:number[];
}