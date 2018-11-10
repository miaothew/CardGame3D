import { AnimalEntity } from "./AnimalEntity";
import { EntityType, E_MODEL_Id } from "../GameDefine";

	export class Player extends AnimalEntity {
		public constructor(id: number, type: EntityType) {
			super(id, type);
		}
		//  --------attributes-------------------
		//↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
		a_level:number;
		a_master:boolean;
		/** 主玩家id */
		userId:number;
		//  --------attributes-------------------
		//↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑

		public createComponents(): void {
			super.createComponents();
		}

		public checkHide(): void {
			// if (DataManager.Instance.instanceData.isShield && this.gameObject.group != GroupType.SELF) {
			// 	this._hideDisplay = true;
			// } else {
			// 	this._hideDisplay = false;
			// }
		}

		public setPosition(gridX: number, gridY: number): void {
			// if (this.gridX && this.gridX) {
			// 	DataManager.Instance.mapData.changeUnWalk(this.gridX, this.gridY, gridX, gridY);
			// }
			// else {
			// 	if (!this._seat) {
			// 		DataManager.Instance.mapData.addUnWalk(gridX, gridY);
			// 		this._seat = true;
			// 	}
			// }

			super.setPosition(gridX, gridY);
		}

		protected initDisplay(): void {
			super.initDisplay();
			this.initEquipments();
			this.initWing();
			
			// this.animal.setAction(this.action, this.dir, true);
			this.setBlood(this.a_truehp, this.a_maxHp, true);
			// if (this._entityInfo) {
			// 	if (DataManager.Instance.mapData.config.cls == constants.E_MAP_TYPE.BOSS_MJ
			// 		|| DataManager.Instance.mapData.config.cls == constants.E_MAP_TYPE.BOSS_YW
			// 		|| DataManager.Instance.mapData.config.cls == constants.E_MAP_TYPE.BOSS_LH) {
			// 		this._entityInfo.hideText(EntityInfoType.BLOODVALUE);
			// 	}
			// 	this._entityInfo.setTitle(playerObject.titleId, true);
			// }
		}


		protected initWing(): void {
			let wingId: number = this.a_wingModel;
			let wingModel: number;
			// if(DataManager.Instance.fameData.wingId){
			// 	let titleConfig= ConfigManager.Instance.title[DataManager.Instance.fameData.wingId];
			// 	wingModel = Number(titleConfig.model);
			// }else 
			if (wingId != null && wingId > 0) {
				// wingModel = ConfigManager.Instance.wing[wingId].model;
				wingModel = wingId;
			} else {
				wingModel = 0;
			}

			// if (this.animal.getDataSet(AnimationType.Wing) == null) {
			// 	if (wingModel) {
			// 		this.animal.addType(AnimationType.Wing, wingModel, null, true);
			// 	}
			// } else if (wingModel != this.animal.getDataSet(AnimationType.Wing).model) {
			// 	this.animal.removeType(AnimationType.Wing);
			// 	if (wingModel) {
			// 		this.animal.addType(AnimationType.Wing, wingModel, null, true);
			// 	}
			// }
		}
		protected initEquipments(): void {
			let cloth: number = this.a_clothModel;
			let weapon: number = this.a_weaponModel;
			let clothModel: number;
			let weaponModel: number;
			if (cloth != null && cloth > 0) {
				clothModel = cloth;
				// clothModel = this.getEquipModel(cloth);
			} else {
				if (this.a_sex == 2) {
					clothModel = E_MODEL_Id.Female_Body;
				} else {
					clothModel = E_MODEL_Id.Male_Body;
				}
			}
			if (weapon != null && weapon > 0) {
				weaponModel = weapon;
				// weaponModel = this.getEquipModel(weapon);
			} else {
				// if(this.sex == 2){
				// 	weaponModel = constants.E_MODEL_Id.Female_Hand;
				// }else{
				// 	weaponModel = constants.E_MODEL_Id.Male_Hand;
				// }
			}
			this.changeSkins(clothModel, weaponModel);
		}


		/**更新武器和衣服 */
		public updateEquipments(weapon: number, cloth: number): void {
			this.a_weaponModel = weapon;
			this.a_clothModel = cloth;
			if (this.display) {
				let clothModel: number;
				let weaponModel: number;
				// if(DataManager.Instance.fameData.fashionId){
				// 	let titleConfig= ConfigManager.Instance.title[DataManager.Instance.fameData.fashionId];
				// 	let modleArr:Array<string> = titleConfig.model.split("/");
				// 	clothModel = Number(modleArr[1]);
				// }else 
				if (cloth != null && cloth > 0) {
					clothModel = cloth;
					// clothModel = this.getEquipModel(cloth);
				} else {
					if (this.a_sex == 2) {
						clothModel = E_MODEL_Id.Female_Body;
					} else {
						clothModel = E_MODEL_Id.Male_Body;
					}
				}
				if (weapon != null && weapon > 0) {
					weaponModel = weapon;
				} 
				if (this.changeSkins(clothModel, weaponModel)) {
					this.setAction(this.action, this.dir, true);
				}
			}
		}

		/**更新光翼*/
		public updateWing(wingId: number): void {
			this.a_wingModel = wingId;
			if (wingId != null && wingId > 0) {
				let wingModel: number = wingId
				if (this.changeWing(wingModel)) {
					this.setAction(this.action, this.dir, true);
				}
			} else {
				// this.animal.removeType(AnimationType.Wing);
			}
		}
		/**更新称号 */
		public updateTitle(titleId): void {
			this.a_titleId = titleId;
			// if (this._entityInfo != null) {
			// 	this._entityInfo.setTitle(titleId);
			// }
		}
		/**更新行会 */
		public updateUnionName(unionName): void {
			this.a_unionName = unionName;
			// if (this._entityInfo != null) {
			// 	if (unionName) {
			// 		this._entityInfo.setTexts(EntityInfoType.UNIONNAME, unionName, true);
			// 	} else {
			// 		this._entityInfo.hideText(EntityInfoType.UNIONNAME);
			// 	}
			// }
		}

		public updatePlayerName(playerName): void {
			this.a_name = playerName;
			// if (this._entityInfo != null) {
			// 	if (playerName) {
			// 		this._entityInfo.setTexts(EntityInfoType.NICKNAME, playerName, true);
			// 	}
			// }
		}

		
		public dispose(): void {
			// if (this._seat) {
			// 	DataManager.Instance.mapData.removeUnWalk(this.gameObject.gridX, this.gameObject.gridY);
			// 	this._seat = false;
			// }
			
			super.dispose();
		}

	}
