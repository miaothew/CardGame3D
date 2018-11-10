import { AnimalEntity } from "./AnimalEntity";
import { EntityType, E_MODEL_Id } from "../GameDefine";
import { MonsterConfig } from "../../../config/ConfigManager";

	export class Monster extends AnimalEntity {
		public constructor(id: number, type: EntityType) {
			super(id, type);
		}
		//  --------attributes-------------------
		//↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
		a_level:number;
		/** 主玩家id */
        mid:number;
        config:MonsterConfig
		//  --------attributes-------------------
		//↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑

		public createComponents(): void {
			super.createComponents();
		}

		public checkHide(): void {
        }
        
		protected initDisplay(): void {
			super.initDisplay();
			this.initEquipments();
			
			this.setBlood(this.a_truehp, this.a_maxHp, true);
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

		
		
		public dispose(): void {
			super.dispose();
		}

	}
