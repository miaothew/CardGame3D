import { EntityType } from "../GameDefine";
import { Entity } from "./Entity";
import { GameTime } from "../../../data/GameTime";
import { Player } from "./Player";
import { IDProvider } from "../util/GameUtils";
import { EntityInfo } from "./EntityInfo";
import { Monster } from "./Monster";

/**
* name 
*/
	export class EntityManager {
		firstPlayer:Player;
		private _entityDic:{[key:number]:Entity} = {};
		_enemyDic:{[key:number]:Monster} = {};
		private _readyToDispose:Array<Entity> = [];
		_playerDic:{[key:number]:Player} = {};
		private _resized:boolean = false;
		constructor() {

		}

		private static _instance: EntityManager;
		public static get Instance(): EntityManager {
			if (!this._instance) {
				this._instance = new EntityManager();
			}
			return this._instance;
		}

		public getEntity(id:number):Entity{
			return this._entityDic[id];
		}

		public getAllEntity():{[key:string]:Entity}{
			return this._entityDic;
		}

		public getAllEnemy():{[key:string]:Monster}{
			return this._enemyDic;
		}

		public createPlayer():Player{
			let player = this.createEntity(EntityType.PLAYER,IDProvider.getEntityInsID()) as Player;
			this._playerDic[player.uid] = player;
			return player;
		}

		public createEnemy(id:number):Monster{
			let player = this.createEntity(EntityType.MONSTER,id) as Monster;
			return player;
		}

		public createComponent(entity:Entity):void{
			entity.createComponents();
		}
		
		public createEntity(type:EntityType,id:number):Entity{
			let entity:Entity;
			switch(type){
			case EntityType.PLAYER:
				entity = new Player(id,type);
				// entity.createComponents();
				// entity.checkHide();
				this._playerDic[id.toString()] = entity as Player;
				break;
			case EntityType.MONSTER:
				entity = new Monster(id,type);
				// entity.createComponents();
				// entity.checkHide();
				// this._playerDic[id.toString()] = entity as Player;
				this._enemyDic[id.toString()] = entity as Monster;
				break;
			}
			if(entity){
				this._entityDic[id.toString()] = entity;
			}
			return entity;
		}

		public createEntityInfo(entity:Entity):EntityInfo{
			let entityInfo:EntityInfo;
			switch(entity.type){
				default:
					entityInfo = new EntityInfo(entity);
					break;
			}
			return entityInfo;
		}

		public resize():void{
			this._resized = true;
		}

		public update(gameTime:GameTime):void{
			this.updateDead(gameTime);
			let entity:Entity;
			for(let key in this._entityDic){
				entity = this._entityDic[key];
				entity.updateTime(gameTime);
				if(this._resized){
					entity.updateInfoPos();
				}
			}
			this._resized = false;
		}

		public updateDead(gameTime:GameTime):void{
			for(let deadentity of this._readyToDispose){
				if(deadentity)
				{
					this.destoryEntity(deadentity.uid);
				}
			}
			this._readyToDispose.length = 0;
		}

		public destoryAllEntity():void
		{
			for(let key in this._entityDic)
			{
				this.destoryEntity(key);
			}
		}
		
		/**
		 * 考虑换成对象池
		 */
		public destoryEntity(id:string):boolean{
			let entity:Entity = this._entityDic[id];
			if(entity){
				switch(entity.type){
					case EntityType.PLAYER:
					if(this.firstPlayer && this.firstPlayer.uid == id){
						this.firstPlayer = null;
					}
					delete this._playerDic[id];
					break;
					case EntityType.MONSTER:
					delete this._playerDic[id];
					delete this._enemyDic[id];
					break;
					case EntityType.NPC:
					break;
					case EntityType.MINION:
					break;
					case EntityType.HERO:
					break;
					// case EntityType.HOME:
					// case EntityType.TRANSFER:
					case EntityType.DROP:
					break;
				}
				entity.dispose();
				delete this._entityDic[id];
				return true;
			}
			return false;
		}
	}
