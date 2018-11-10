import { AIManager } from "./ai/AIManager";
import { EntityFreeFsm } from "../fsm/EntityFreeFsm";
import { GameTime } from "../../../data/GameTime";
import { EntityFSM } from "../fsm/EntityFsm";
import { GameDefine, GroupType, EntityType, E_Entity_TurnState } from "../GameDefine";
import { SceneManager } from "../SceneManager";
import { Tween, ITweenAble } from "../transform/Tween";
import { AIBase } from "./ai/AIBase";
import { IUpdateable, GameUtils } from "../util/GameUtils";
import { EntityInfo } from "./EntityInfo";
import { CameraManager } from "../CameraManager";

/**
* name 
*/
	export class Entity implements IUpdateable,ITweenAble {
		public constructor(id: number, type: EntityType) {
			this.uid = id.toString();
			this.id = id;
			this.type = type;
		}
		//  --------attributes-------------------
		//↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
		/**对象类型 */
		public type: EntityType;
		/** 是否可用 */
		public enabled: boolean = true;
		/** 唯一id  string */
		public uid: string;
		/** 唯一id Long */
		public id:number;
		/** 所在格子x */
		public gridX:number;
		/** 所在格子y */
		public gridY:number;
		protected _x:number;
		protected _y:number;
		protected _z:number;
		/** 名字 */
		public a_name:string;
		/** 组概念 玩家挂机的怪物和掉落是一组，野战对象是一组等等 用于区分和移除*/
		public group:GroupType;
		/**攻击目标或者什么目标id*/
		public _entityTargetId: string;
		private _busy: number = 0;
		/**寻路的走点 */
		public pathArr: Array<Array<number>>;
		/**休息间隔 */
		public idleInterval: number = 0;
		/**下次苏醒时间 */
		public freeTime: number = 0;
		
		public a_state:E_Entity_TurnState = 0;
		/**可复活 */
		public canRelive: boolean;
		//  --------attributes-------------------
		//↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑

		public display: Laya.Sprite3D;
		// public _path:Array<egret.Point>;
		public curFsm: EntityFSM;
		public strategyTick: number;
		// public layer: MapLayerType;
		public movePostion: EntityMoveInfo = new EntityMoveInfo();
		protected _coverd: boolean = false;
		protected _inView: boolean = false;
		protected _hideDisplay: boolean = false;
		protected _hideInfo: boolean = false;
		protected _tween:Tween;

		protected _rotationY:number;

		public _entityInfo: EntityInfo;
		public entityAI: AIBase;

		public set _entityAI(a: AIBase) {
			this.entityAI = a;
		}

		public get _entityAI(): AIBase {
			return this.entityAI;
		}
		// public moveInterval:number = 0;
		/** 角色很忙不能做其他的了*/
		
		/**走路后摇结束时间 */
		//	public movewaittime:number = 0;
		
		// protected _effects: { [key: number]: EntityEffect };

		public createComponents(): void {
			// this.canRelive = false;
			// this.gameObject = gameObject;
			if (!this._tween) {
				this._tween = new Tween(this);
				this._tween.moveComplete = this.onMoveComplete;
			}
		}

		public checkHide(): void {

		}

		public setSkin(skin: number): void {

		}

		public stopTween(): void {
			if (this._tween) {
				this._tween.stop();
			}
		}

		protected initDisplay(): void {

		}

		// public addEffect(effect: EntityEffect): void {
		// 	if (!this._effects) {
		// 		this._effects = {};
		// 	}
		// 	this._effects[effect.id] = effect;
		// 	effect.addToView();
		// 	effect.inView = true;
		// 	// effect.start();
		// 	effect.animation.addToParent(this.display);
		// 	effect.parentEntity = this;
		// }

		// public hasEff(id: number): boolean {
		// 	for (let eachkey in this._effects) {
		// 		if (this._effects[eachkey].eid == id) {
		// 			return true;
		// 		}
		// 	}
		// 	return false;
		// }

		// public removeEffect(effect: EntityEffect): void {
		// 	if (this._effects && this._effects[effect.id]) {
		// 		delete this._effects[effect.id];
		// 		effect.parentEntity = null;
		// 	}
		// }

		protected displayCreated(): void {
			if (this._coverd && this.display) {
				// this.display.alpha = 0.6;
			}
		}

		public set inView(value: boolean) {
			this._inView = value;
			// if(this._effects){
			// 	for(let key in this._effects){
			// 		this._effects[key].inView = value;
			// 	}
			// }
		}

		public get inView(): boolean {
			return this._inView;
		}

		public hideDisplay(value: boolean): void {
			if (this._hideDisplay != value) {
				this._hideDisplay = value;
				this.checkDisplayInview();
			}
		}

		public getHideDisplay(): boolean {
			return this._hideDisplay;
		}

		public hideInfo(value: boolean): void {
			if (this._hideInfo != value) {
				this._hideInfo = value;
				this.checkInfoInview();
			}
		}

		/**
		 * 必须要发生变化了才能调用!!!!
		 * 检测当前动画是否显示
		 **/
		protected checkDisplayInview(): void {
			if (this._inView && !this._hideDisplay) {
				if (this.display == null) {
					this.addToView();
				}
			} else {
				if (this.display != null) {
					this.removeFromView();
				}
			}
		}

		/**检测当前entityinfo是否显示 */
		public checkInfoInview(): void {
			if (this._inView && !this._hideInfo) {
				if (this._entityInfo) {
					this._entityInfo.inView = true;
				}
			} else {
				if (this._entityInfo) {
					this._entityInfo.inView = false;
				}
			}
		}

		public get tween(): Tween {
			return this._tween;
		}

		get moveNext(): boolean {
			return false;
		}

		get endNow(): boolean {
			return false;
		}

		public setPosition(gridX: number, gridY: number): void {
			this.gridX = gridX;
			this.gridY = gridY;
			// if (DataManager.Instance.mapData.hitTestCover(gridX, gridY)) {
			// 	if (!this._coverd) {
			// 		this._coverd = true;
			// 		if (this.display) {
			// 			// this.display.alpha = 0.6;
			// 		}
			// 	}
			// } else {
			// 	if (this._coverd) {
			// 		this._coverd = false;
			// 		if (this.display) {
			// 			// this.display.alpha = 1;
			// 		}
			// 	}
			// }
		}

		public setPixelPosition(x: number, y: number,z:number): void {
			this.x = x;
			this.y = y;
			this.z = z;
			this.display.transform.position = this.display.transform.position;
		}

		public setHorizontalPosition(x: number, z:number):void{
			let pos = this.display.transform.position;
			pos.x = x;
			pos.z = z;
			let heighty = 0;//SceneManager.Instance.terrainSprite.getHeight(-x/40, z/40);
			if (isNaN(heighty)) {
				heighty = 0;
			}
			pos.y = heighty;
			this.display.transform.position = pos;
			if(this._entityInfo){
				this._entityInfo.updatePos(pos);
			}
		}

		public updateInfoPos():void{
			if(this._entityInfo && this.display){
				this._entityInfo.updatePos(this.display.transform.position);
			}
		}

		set x(value: number) {
			if (this.display){
				this.display.transform.position.x = value;
			}else{
				this._x = value;
			}
			if(this._entityInfo){
				let pos:Laya.Vector3 = GameUtils.Vector3Temp2;
				pos.x = value;pos.y = this._y,pos.z = this._z;
				this._entityInfo.updatePos(pos);
			}
			// if (this._entityInfo)
			// 	this._entityInfo.setPositionX(value);
		}

		get x(): number {
			if (this.display){
				return this.display.transform.position.x;
			}
			
			return this._x;
		}

		set y(value: number) {
			if (this.display){
				this.display.transform.position.y = value;
			}else{
				this._y = value;
			}
			// if(this._entityInfo){
			// 	let pos:Laya.Vector3 = GameUtils.Vector3Temp2;
			// 	pos.y = value;pos.x = this._x;
			// 	this._entityInfo.updatePos(pos);
			// }
		}

		get y(): number {
			if (this.display){
				return this.display.transform.position.y;
			}
			return this._y;
		}

		set z(value: number) {
			this._z = value;
			if (this.display)
				this.display.transform.position.z = value;
			if(this._entityInfo){
				let pos:Laya.Vector3 = GameUtils.Vector3Temp2;
				pos.z = value;pos.x = this._x,pos.y = this._y;
				this._entityInfo.updatePos(pos);
			}
		}

		get z(): number {
			if (this.display){
				return this.display.transform.position.z;
			}
			return this._z;
		}

		public updateTime(gameTime: GameTime): void {
			if (this._entityInfo) {
				this._entityInfo.sortShow();
			}
			if (this.curFsm) {
				this.curFsm.execute(this, gameTime);
			}
		}

		public updateRect(rect: Laya.Rectangle): void {
			let nowInView: boolean = rect.contains(this.x, this.y);
			if (nowInView != this._inView) {
				this.inView = nowInView;
				this.checkDisplayInview();
				this.checkInfoInview();
			}
			// if(!nowInView && this._inView){
			// 	this.inView = nowInView;
			// 	this.removeFromView();
			// }else if(nowInView && !this._inView){
			// 	this.inView = nowInView;
			// 	this.addToView();
			// }
		}

		public resetPosition(): void {
			// if (this._tween && this.gameObject) {
			// 	this.x = this.gameObject.gridX * GameDefine.MAP_GRID_WIDTH + GameDefine.MAP_GRID_WIDTH * 0.5;
			// 	this.y = this.gameObject.gridY * GameDefine.MAP_GRID_HEIGHT + GameDefine.MAP_GRID_HEIGHT * 0.5;
			// 	this.stopTween();
			// }
		}

		public hitTest(mx: number, my: number): boolean {
			if (!this._inView)
				return false;
			if (-GameDefine.MAP_GRID_WIDTH * 0.5 < mx && -GameDefine.MAP_GRID_HEIGHT * 0.5 < my && GameDefine.MAP_GRID_WIDTH * 0.5 > mx && GameDefine.MAP_GRID_HEIGHT * 0.5 > my) {//选中格子就算中了
				return true;
			}
			if (this.display == null) {
				return false;
			}
			let hited: boolean = false;//this.display.hitTest(mx, my);
			return hited;
		}

		public removeFromView(): void {
			if (this.display.parent) {
				this.display.parent.removeChild(this.display);
			}
			this.display.destroy(true);
			this.display = null;

			// if (this._effects) {
			// 	for (let key in this._effects) {
			// 		this._effects[key].removeFromView();
			// 	}
			// }
		}

		public addToView(): void {
			this._inView = true;
			// if (this.display == null) {
				this.initDisplay();
			// 	this.display.x = this.x;
			// 	this.display.y = this.y;
			// }
			// this.display.inView = true;
			// GameSceneManager.Instance.getLayer(this.layer).addChild(this.display);
			// GameSceneManager.Instance.getLayer(this.layer).needSort();

			// if (this._effects) {
			// 	for (let key in this._effects) {
			// 		this._effects[key].addToView();
			// 		this._effects[key].inView = true;
			// 	}
			// }
		}

		// public set rotationY(ry:number){
		// 	this._rotationY = ry;
		// 	if(this.display){
		// 		let rot = this.display.transform.rotation;
		// 		Laya.Quaternion.createFromAxisAngle(new Laya.Vector3(0,1,0),ry,rot);
		// 		this.display.transform.rotation = rot;
		// 		if(this._entityInfo){
		// 			this._entityInfo.updatePos(this.display.transform.position);
		// 		}
		// 	}
		// }

		public changeFSMState(fsm: EntityFSM, time: number = 0, compulsory: Boolean = true): void {
			if (this.curFsm != null && this.curFsm.stateChange(this, fsm)) {
				return;
			}
			if (!compulsory && this.curFsm == fsm) {
				return;
			}
			if (this.curFsm != null) {
				this.curFsm.exit(this);
			}
			this.curFsm = fsm;
			// this.strategyTick = GameTime.Instance.totalGameTime;
			this.curFsm.enter(this, time);
		}

		public get isBusy(): boolean {
			if (this._busy > GameTime.Instance.totalGameTime) {
				return true;
			}
			return false;
		}

		public set busy(times: number) {
			this._busy = Math.max(GameTime.Instance.totalGameTime + times, this._busy);
		}

		public onEnterIdle(): void { }

		public onEnterFree(): void {
			this.freeTime = GameTime.Instance.totalGameTime + this.idleInterval;
		}

		public onEnterMove(): void {
			if (this._tween) {
				this._tween.move([this.movePostion.x, this.movePostion.y]);
				this._tween.setSpeed(this.movePostion.speed);
			}
		}

		public onEnterForceMove(): void {
			if (this._tween) {
				this._tween.move([this.movePostion.x, this.movePostion.y]);
				this._tween.setSpeed(this.movePostion.speed);
			}
		}


		public prepareToMove(cellX: number, cellY: number, speed: number = 0.5, server?: boolean): void {
			this.movePostion.x = cellX;
			this.movePostion.y = cellY;
			this.movePostion.cellX = cellX;
			this.movePostion.cellY = cellY;
			this.movePostion.speed = speed;
			if (!server)
				this.setPosition(cellX, cellY);
		}

		public onExecuteMove(gameTime: GameTime): void {
			if (this._tween && this._tween.enabled) {
				this._tween.updateTime(gameTime);
				// GameSceneManager.Instance.getLayer(this.layer).needSort();
			}
		}

		public onMoveComplete(thisObj: any, gameTime: number): void {
			// if (thisObj.pathArr && thisObj.pathArr.length > 0) {
			// 	let toArr: Array<number> = thisObj.pathArr.pop();
			// 	if (DataManager.Instance.mapData.checkCanWalk(toArr[0], toArr[1])) {
			// 		thisObj.prepareToMove(toArr[0], toArr[1]);
			// 		thisObj.onEnterMove();
			// 		if (thisObj.pathArr.length == 0) {
			// 			thisObj.pathArr = null;
			// 		}
			// 		return;
			// 	}
			// }

			thisObj.changeFSMState(EntityFreeFsm.Instance);
			//	thisObj.movewaittime = gameTime+thisObj.moveInterval;
		}


		public dispose() {
			// if (this._effects) {
			// 	for (let key in this._effects) {
			// 		this._effects[key].parentEntity = null;
			// 		this._effects[key].die();
			// 	}
			// 	this._effects = undefined;
			// }
			if (this.display) {
				if (this.display.parent) {
					this.display.parent.removeChild(this.display);
				}
				this.display.destroy(true);
				// this.display.dispose();
				this.display = null;
			}
			if (this._entityInfo) {
				this._entityInfo.dispose();
				this._entityInfo = null;
			}
			if (this._entityAI) {
				AIManager.Instance.removeEntityAI(this.uid);
				this._entityAI = null;
			}
			this.uid = null;
			this.id = null;
			this.enabled = false;
		}
	}

	export class EntityMoveInfo{
		public speed:number;
		public x:number;
		public y:number;
		public cellX:number;
		public cellY:number;
	}

