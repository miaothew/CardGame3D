import { Entity } from "./Entity";
import { EntityType, ActionType } from "../GameDefine";
import { Model3D } from "./Model3D";
import { SceneManager } from "../SceneManager";
import { GameTime } from "../../../data/GameTime";
import { EntityFreeFsm } from "../fsm/EntityFreeFsm";
import { GameUtils, DirectionUtil } from "../util/GameUtils";
import { AIManager } from "./ai/AIManager";
import { EntityManager } from "./EntityManager";
import { EntityInfoType } from "./EntityInfo";
import { SkillResult, SkillBase } from "../skill/SkillBase";
import { SkillManager } from "../SkillManager";

	export class AnimalEntity extends Entity {
		public constructor(id: number, type: EntityType) {
			super(id, type);
		}
		//  --------attributes-------------------
		//↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
		public a_truehp: number = 0;//真实在的用于计算的名字先那么叫着后面正常了再该回来
		public a_delayhp: number = 0;//用于技能延迟显示的
		public a_maxHp: number = 0;
		public a_weaponModel: number;
		public a_clothModel: number;
		public a_weaponItemId: number;
		public a_clothItemId: number;
		public a_fashionWeaponId:number;
		public a_fashionClothId:number;
		public a_fashionWingId:number;
		public a_wingCfgId: number;
		public a_sex: number;
		public a_career: number;
		public a_isDead: boolean = false;
		public a_trueArmor:number = 0;
		public a_delayArmor:number = 0;

		public a_wingModel: number;
		public a_titleId: number;
		public a_buffList: { [key: string]: any };
		public a_killer: string;
		/**出生点 */
		public a_bornX: number;
		public a_bornZ: number;
		public a_unionName: string;
		public a_unionId:number;
		
		public a_nameColor:string;
		/**被麻痹 */
		public mabi: boolean;
		//  --------attributes-------------------
		//↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑
		protected _directionVec:Laya.Vector3;
		protected _rotationTime:number = 0;
		public lastAngle:number = 0;
		public animator:Laya.Animator;
		public model3D:Model3D;
		public action: ActionType;
		public dir: number = 0;
		private _prepareSkill:SkillBase;
		public hideHp: boolean;
		public astarStandOn: boolean;
		/**占了个坑 */
		protected _seat: boolean;
		/**
		 * 因为其他玩家移动完后，立即停下的话，会进入站立状态，
		 * 但是其实那个玩家可能是连续走动的，由于服务端消息延时，
		 * 会造成连续移动看起来一顿一顿的
		 * 所以这里记录下时间，延时进入free状态
		 */
		public waitForNextMove: number;

		/**技能释放后的僵直结束时间 */
		//public skillWaitTime:number;
		// public deadWaitTime:number;
		/**移动动作，true用walk，false用run */
		protected _moveAction: boolean = false;


		/** 毒标记伤害值*/
		public poisonMarkValue: number = 0;
		/** 毒标记回合数*/
		public poisonMarkTimes: number = 0;

		public poisonMarkLastTime: number = 0;
		/** 躺尸时间*/
		public deadTime: number = 0;

		public createComponents(): void {
			this.deadTime = 0;
			super.createComponents();
			if (!this._entityInfo) {
				this._entityInfo = EntityManager.Instance.createEntityInfo(this);
				this._entityInfo.setTexts(EntityInfoType.NICKNAME, this.a_name, true);
				if (this.a_nameColor != null) {
					this._entityInfo.setTxtColor(EntityInfoType.NICKNAME, this.a_nameColor);
					// this._entityInfo.setTxtColor(EntityInfoType.UNIONNAME, this.a_nameColor);
				}
			}
		}

		public setBlood(hp: number, max: number, show: boolean = false): void {
			if (this._entityInfo) {
				this._entityInfo.setBlood(hp, max, show && !this.hideHp,false,true);
				// let mapcls: number = DataManager.Instance.mapData.config.cls;
				// if (this.type == EntityType.MONSTER && (this.group == GroupType.GUAJI || DataManager.Instance.mapData.config.cls == constants.E_MAP_TYPE.TASK)) {
					// this._entityInfo.hideText(EntityInfoType.BLOODVALUE);
				// }
				// else if (this.initShowBlood == 1) {
				// 	this.initShowBlood = 0;
				// 	this._entityInfo.hideText(EntityInfoType.BLOODVALUE);
				// }
				// else if (this.group != GroupType.SELF && (mapcls == constants.E_MAP_TYPE.ARENA ||
				// 	mapcls == constants.E_MAP_TYPE.WZZD_PLAYER ||
				// 	mapcls == constants.E_MAP_TYPE.LADDER ||
				// 	mapcls == constants.E_MAP_TYPE.LOOT)) {
				// 	if (hp == max) {
				// 		this._entityInfo.hideText(EntityInfoType.BLOODVALUE);
				// 	}
				// }
			}
		}

		public setNameColor(color: string): void {
			this.a_nameColor = color;
			if (this._entityInfo) {
				this._entityInfo.setTxtColor(EntityInfoType.NICKNAME, color);
				this._entityInfo.setTxtColor(EntityInfoType.UNIONNAME, color);
			}
		}

		public showBloodEffect(value: number, dir: number, type: number, plus: number, index: number = 1): void {
			if (this._entityInfo) {
				// if (this.this && this.this.group == GroupType.SELF) {
					this._entityInfo.showBloodEffect(value, dir, type, plus, index);
				// } else {
				// 	this._entityInfo.showBloodEffect(Math.abs(value), dir, type, plus, index);
				// }
			}
		}

		protected initDisplay(): void {
			this.display = this.model3D = new Model3D();
			this.model3D.setPlayCompleteHandler(new Laya.Handler(this,this.playCompleteHandler));
			this.model3D.init(this.id);
			SceneManager.Instance.scene.addChild(this.model3D);
			this.x = this._x;
			this.y = this._y;
			this.z = this._z;
			this.display.transform.position = this.display.transform.position;
			// SceneManager.Instance.modelAdd(this);
			if(this._entityInfo){
				this._entityInfo.updatePos(this.display.transform.position);
			}
			// this.animal.setPrority(this.group == GroupType.SELF ? 1 : 0);
			// this.animal.playMaxCount = -1;
			// this.animal.completeHandler = new CallBack0(this.animationComplete, this);
			// this.displayCreated();

			// if (DataManager.Instance.mapData.arpg) {
			// 	if (this.arpgBuffList) {
			// 		ARpgBuffManager.Instance.check(this);
			// 	}
			// } else {
			// 	if (this.buffList) {
			// 		BuffManager.Instance.check(this);//该加滤镜加滤镜，该加特效加特效
			// 	}
			// }

			// if (this._effects) {
			// 	for (let key in this._effects) {
			// 		this.addEffect(this._effects[key]);
			// 	}
			// }

		}

		

		/**更新武器和衣服 */
		public updateEquipments(weapon: number, cloth: number): void {
			this.a_weaponModel = weapon;
			this.a_clothModel = cloth;

			if (this.display) {
				let clothModel: number = cloth;//(cloth != null && cloth > 0)?this.getEquipModel(cloth):null;
				let weaponModel: number = weapon;//(weapon != null && weapon > 0)?this.getEquipModel(weapon):null;
				if (this.changeSkins(clothModel, weaponModel)) {
					this.setAction(this.action, this.dir, true);
				}
			}
		}
		/**更新光翼*/
		public updateWing(wingId: number): void {
			this.a_wingModel = wingId;
			if (wingId != null && wingId > 0) {
				// let wingModel:number = ConfigManager.Instance.wing[wingId].model;
				if (this.changeWing(wingId)) {
					this.setAction(this.action, this.dir, true);
				}
			}
		}

		protected initWing(): void {
			let wingId: number = this.a_wingModel;
			let wingModel: number;
			if (wingId != null && wingId > 0) {
				// wingModel = ConfigManager.Instance.wing[wingId].model;
				// this.changeWing(wingModel);
				// wingModel = ConfigManager.Instance.wing[wingId].model;
				this.changeWing(wingId);
			}
		}

		public bianshen(model: number): void {
			// if (this.animal) {
			// 	this.bianshenModel = model;
			// 	if (model) {
			// 		this.changeSkins(model, null);
			// 		this.changeWing(null);
			// 		this.setAction(ActionType.Attack, this.dir, true);
			// 	} else {
			// 		if (this.animal) {
			// 			let clothModel: number = this.clothModel;//(cloth != null && cloth > 0)?this.getEquipModel(cloth):null;
			// 			let weaponModel: number = this.weaponModel;//(weapon != null && weapon > 0)?this.getEquipModel(weapon):null;
			// 			let wingId = this.wingModel;
			// 			let changed: boolean = false;
			// 			if (wingId != null && wingId > 0)
			// 				changed = this.changeWing(wingId);
			// 			changed = this.changeSkins(clothModel, weaponModel) || changed;
			// 			if (changed) {
			// 				this.setAction(this.action, this.dir, true);
			// 			}
			// 		}
			// 	}
			// }
		}

		
		private playCompleteHandler():void{
			if(this.action == ActionType.Attack || this.action == ActionType.Attack2){
				this.setAction(ActionType.Idle);
			}
		}

		protected changeSkins(clothModel: number, weaponModel: number): boolean {
			let changed: boolean = false;
			// Laya.loader.create("res/testLaya2.lh", Laya.Handler.create(this, this.onModelOk), null, Laya.Sprite3D);
			this.model3D.createSkin(clothModel + "");
			if(weaponModel != undefined && weaponModel > 0)
				this.model3D.updateWeapon(weaponModel + "",0);
			// this.model3D.updateWeapon("20001",E_WEAPON_TYPE.LEFT);
			// this.model3D.updateWeapon("20001",E_WEAPON_TYPE.RIGHT);
			// this.model3D.updateWing("30002");
			// let skinConfig = TestSprite3DData.configs[clothModel];
			// let meshs = skinConfig[0];
			// for (var t = 0, i = meshs.length; i > t; t++) {
            //     let mesh = Laya.Mesh.load(meshs[t]);
            //     let meshSprite3D = new Laya.MeshSprite3D(mesh);
            //     meshSprite3D.name = "sms3d",
            //     this.display.addChild(meshSprite3D),
            //     meshSprite3D.meshRender.sharedMaterial = Laya.StandardMaterial.load(skinConfig.texture);
            // }
			// if (this.animal.getDataSet(AnimationType.Body) == null) {
			// 	if (clothModel) {
			// 		this.animal.addType(AnimationType.Body, clothModel, null, true);
			// 		changed = true;
			// 	}
			// } else if (clothModel != this.animal.getDataSet(AnimationType.Body).model) {
			// 	this.animal.removeType(AnimationType.Body);
			// 	if (clothModel) {
			// 		this.animal.addType(AnimationType.Body, clothModel, null, true);
			// 	}
			// 	changed = true;
			// }
			// if (this.animal.getDataSet(AnimationType.Weapon) == null) {
			// 	if (weaponModel) {
			// 		this.animal.addType(AnimationType.Weapon, weaponModel, null, true);
			// 		changed = true;
			// 	}
			// } else if (weaponModel != this.animal.getDataSet(AnimationType.Weapon).model) {
			// 	this.animal.removeType(AnimationType.Weapon);
			// 	if (weaponModel) {
			// 		this.animal.addType(AnimationType.Weapon, weaponModel, null, true);
			// 	}
			// 	changed = true;
			// }
			return changed;
		}

		protected changeWing(wingModel: number): boolean {
			if (this.display) {
				// if (this.animal.getDataSet(AnimationType.Wing) == null) {
				// 	if (wingModel) {
				// 		this.animal.addType(AnimationType.Wing, wingModel, null, true);
				// 		return true;
				// 	}
				// } else if (wingModel != this.animal.getDataSet(AnimationType.Wing).model) {
				// 	this.animal.removeType(AnimationType.Wing);
				// 	if (wingModel) {
				// 		this.animal.addType(AnimationType.Wing, wingModel, null, true);
				// 	}
				// 	return true;
				// }
				return true;
			}

		}

		public changeDir(dir: number): void {
			if (this.dir != dir) {
				this.dir = dir;
				// if (this.animal) {
				// 	this.animal.pause = false;
				// 	this.animal.setAction(this.action, dir);
				// }
			}
		}


		public setAction(action: ActionType, direction: number = -1, compulsory: Boolean = false) {
			// if (this.this && this.bianshenModel && action != ActionType.Attack) return;
			this.action = action;
			if (direction != -1) {
				this.dir = direction;
			}
			if(this.model3D){
				switch(action){
					case ActionType.Run:
					case ActionType.Walk:
						this.model3D.playAni("run",compulsory);
					break;
					case ActionType.Attack:
						this.model3D.playAni("attack",compulsory);
					break;
					case ActionType.Attack2:
						this.model3D.playAni("skill2",compulsory);
					break;
					default:
						this.model3D.playAni("idle",compulsory);
					break;
				}
			}
			
			// if (this.animal) {
			// 	this.animal.pause = false;
			// 	this.animal.setAction(action, direction, compulsory);
			// }
		}


		public updateTime(gameTime: GameTime): void {
			super.updateTime(gameTime);
			if(this.model3D){
				this.model3D.update();
			}
			// if (this.animal) {
			// 	this.animal.render(gameTime);
			// }
		}

		public onEnterIdle(): void {
			this.setAction(ActionType.Idle);
		}

		public onMoveComplete(thisObj: AnimalEntity, gameTime: number): void {
			//EntityFreeFsm.Instance.enter(thisObj,0);
			// let pointX:number = Math.ceil(thisObj.this.x / GameDefine.MAP_GRID_WIDTH - 0.5);
			// let pointy:number = Math.ceil(thisObj.this.y / GameDefine.MAP_GRID_HEIGHT - 0.5);
			// thisObj.setPosition(pointX,pointy);
			if (thisObj.isBusy) {
				(thisObj as AnimalEntity).setAction(ActionType.Idle);
				return;
			}
			if (thisObj._entityAI) {
				thisObj._entityAI.moveComplete(thisObj, gameTime);
				return;
			}
			else {
				if (thisObj.pathArr && thisObj.pathArr.length > 0) {
					let toArr: Array<number> = thisObj.pathArr.pop();
					// if (DataManager.Instance.mapData.checkCanWalk(toArr[0], toArr[1])) {
						thisObj.prepareToMove(toArr[0], toArr[1]);
						thisObj.onEnterMove();
						if (thisObj.pathArr.length == 0) {
							thisObj.pathArr = null;
						}
						return;
					// }
				}
			}

			thisObj.changeFSMState(EntityFreeFsm.Instance);

			//	thisObj.movewaittime = gameTime+thisObj.moveInterval;
		}

		public onExecuteMove(gameTime: GameTime): void {
			super.onExecuteMove(gameTime);
			if(this._directionVec){
				let destQuaternion:Laya.Quaternion = new Laya.Quaternion();
				Laya.Quaternion.rotationLookAt(this._directionVec,GameUtils.Vector3UpTemp,destQuaternion);
				let sMidQuater:Laya.Quaternion = new Laya.Quaternion();
				this._rotationTime += gameTime.elapsedGameTime;
				if(this._rotationTime > 500){
					this._rotationTime = 500;
				}
				Laya.Quaternion.lerp(this.model3D.transform.rotation, destQuaternion,  this._rotationTime / 500,sMidQuater);
				this.model3D.transform.rotation = sMidQuater;
				// console.log(`sMidQuater ${sMidQuater.x} ${sMidQuater.y} ${sMidQuater.z} ${sMidQuater.w} `);
				// console.log(`destQuaternion ${destQuaternion.x} ${destQuaternion.y} ${destQuaternion.z} ${destQuaternion.w} `);
				// this._directionVec = null;
			}
			if (!this._tween || !this._tween.enabled) {
				if (!this.isBusy && !AIManager.Instance.isAIIntervalLimit(this.uid) && (this.waitForNextMove == undefined || this.waitForNextMove < gameTime.totalGameTime)) {
					this.changeFSMState(EntityFreeFsm.Instance);
				}
			}
			
		}

		public onEnterFree(): void {
			this.setAction(ActionType.Idle);
			this.freeTime = GameTime.Instance.totalGameTime + this.idleInterval;
		}

		public onEnterMove(): void {
			super.onEnterMove();
			this._rotationTime = 0;
			let angle = DirectionUtil.orientation(this.x, -this.z, this.movePostion.x, -this.movePostion.y) ;
			let changed = angle - this.lastAngle;
			if(changed > 180){
				angle = this.lastAngle + changed - 360;
			}else if(changed < -180){
				angle = this.lastAngle + changed + 360;
			}
			// console.log("转向：" + angle);
			this._directionVec = GameUtils.ConvertDirToVector3(angle);//new Laya.Vector3(0,angle-this.lastAngle,0);
			// this.model3D.transform.rotate(new Laya.Vector3(0,angle-this.lastAngle,0),false,false);
			this.lastAngle = angle;
			let dir: number = DirectionUtil.getForwardByPoints(this.x, this.z, this.movePostion.x, this.movePostion.y);
			if (this._moveAction)
				this.setAction(ActionType.Walk, dir);
			else
				this.setAction(ActionType.Run, dir);
			if (this._entityAI) {
				this._entityAI.moveToServer(this, this.movePostion.cellX, this.movePostion.cellY);
			}
		}

		public onEnterForceMove(): void {
			super.onEnterForceMove();
			let dir: number = DirectionUtil.getForwardByPoints(this.x, this.y, this.movePostion.x, this.movePostion.y);
			dir = DirectionUtil.addDir(dir, 4);//背对着移动
			this.setAction(ActionType.Idle, dir);
		}


		public prepareSkillData(skill:SkillBase):void{
			this._prepareSkill = skill;
		}

		public onReleaseSkill(): void {
			if (this._prepareSkill) {
				this._prepareSkill.play();
				this._prepareSkill = null;
			} else {
				this.setAction(ActionType.Idle);
			}
		}

		public onPickup(): void {
			// if (this._entityAI) {
			// 	this._entityAI.pickupServer(this, this.this.gridX, this.this.gridY);
			// }
			this.setAction(ActionType.Idle);
		}

		// public addEffect(effect: EntityEffect): void {
		// 	if (!this._effects) {
		// 		this._effects = {};
		// 	}
		// 	this._effects[effect.id] = effect;
		// 	if (this.animal) {
		// 		effect.addToView();
		// 		effect.inView = true;
		// 		// effect.start();
		// 		this.animal.addAnimation(effect.animation, effect.pos);
		// 	}
		// 	effect.parentEntity = this;
		// }

		// public removeEffect(effect: EntityEffect): void {
		// 	if (this._effects && this._effects[effect.id]) {
		// 		if (this.animal && effect.animation) {
		// 			this.animal.removeAnimation(effect.animation);
		// 		}
		// 		delete this._effects[effect.id];
		// 		effect.parentEntity = null;
		// 	}
		// }


		// public addToView(): void {
		// 	super.addToView();
		// 	if (this.animal.shadow) {
		// 		this.animal.shadow.setX(this.x);
		// 		this.animal.shadow.setY(this.y);
		// 	}
		// }

		// public removeFromView(): void {
		// 	if (this.animal) {
		// 		egret.Tween.removeTweens(this.animal);
		// 	}
		// 	super.removeFromView();
		// 	this.animal = null;
		// }

		public dieEnd(clearDisplay: boolean = false): void {
			this.deadTime = 0;
			if (clearDisplay) {
				if (this.display) {
					if (this.display.parent) {
						this.display.parent.removeChild(this.display);
					}
					this.display.destroy(true);
					this.display = null;
					this.model3D = null;
				}
				if (this._entityInfo) {
					this._entityInfo.dispose();
					this._entityInfo = null;
				}
				this.enabled = false;
			}
			this._inView = false;
			// if (this._effects) {
			// 	for (let key in this._effects) {
			// 		this._effects[key].die();
			// 		this._effects[key].parentEntity = null;
			// 	}
			// 	this._effects = undefined;
			// }
		}

		public die(): void {
			// if (this.animal) {
			// 	egret.Tween.removeTweens(this.animal);
			// }
			// this.setAction(ActionType.Die);
			
			// if (EntityManager.Instance.lastSelect == this.uid) {
			// 	EntityManager.Instance.selectEntity();
			// }
			if (this._entityInfo) {
				this._entityInfo.dispose();
				this._entityInfo = null;
			}
		}

		public relive(isBornPos: boolean = false): void {
			this.enabled = true;
			this.a_isDead = false;
			this.createComponents();
			// this._entityInfo.setPositionX(isBornPos ? this.bornX : this.x);
			// this._entityInfo.setPositionY(isBornPos ? this.bornY : this.y);
			this.checkInfoInview();
		}

		public removeFromView(): void {
			super.removeFromView();
			this.model3D = null;
		}

		//待完成
		public dispose(): void {
			super.dispose();
			// if(this._effects){
			// 	for(let key in this._effects){
			// 		this._effects[key].parentEntity = null;
			// 		this._effects[key].die();
			// 	}
			// 	this._effects = undefined;
			// }
			this.display = undefined;
			if(this._prepareSkill){
				SkillManager.Instance.readyToDie(this._prepareSkill);
				this._prepareSkill = null;
			}
			
			// this._prepareSkill = undefined;
		}
	}
