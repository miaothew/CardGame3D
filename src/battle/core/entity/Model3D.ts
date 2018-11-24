import { SceneManager } from "../SceneManager";
import { CustomMaterial } from "../marterial/CustomMaterial";
import { ResDisposer } from "../util/ResDisposer";
import { ConfigManager } from "../../../config/ConfigManager";
import { ActionType } from "../GameDefine";

/**
* name 
*/
	export class Model3D extends Laya.Sprite3D{
		_skinModel:string;
		_skinConfig;
		// _animations:Array<Laya.SkinAnimations>;
		_eventAnimation;
		_curAction;
		_weaponModels = [];
		_weaponConfigs = [];
		_weaponMeshs = [];
		_wingModel;
		_wingConfig;
		_wingMesh;
		_wingAni;
		meshSprite3D:Laya.Sprite3D;
		animator:Laya.Animator;
		_weaponSprite;
		_aeId:number
		_selected:boolean = false;
		_playCompleteHandler:Laya.Handler;
		_disposed:boolean = false;

		public init(id:number):void{
			this._aeId = id;
		}

		// _attachPoint:Laya.AttachPoint;
		public createSkin(id:string):void{
			if(!this.meshSprite3D){
				// ResDisposer.Instance.addRefByObjId(id);
				this._skinConfig = ConfigManager.Instance.obj["model_" + id];
				this._skinModel = id;
				let sp:Laya.Sprite3D = Laya.loader.getRes(this._skinConfig.url);
				if(sp){
					this.createMesh(id,this._skinConfig.url);
				}else{
					ResDisposer.Instance.addToLoading(this._skinConfig.url);
					Laya.Sprite3D.load(this._skinConfig.url,Laya.Handler.create(this,this.createMesh,[id,this._skinConfig.url]));
				}
			}
		}
		
		public setSelected(value:boolean,compulsory:boolean = false){
			if(this._selected != value || compulsory){
				this._selected = value;
				if(this.meshSprite3D){
					if(value){
						this.setMeshMatValue(this.meshSprite3D,"marginalColor",new Laya.Vector3(0.0, 0.3, 1.0));
					}else{
						this.setMeshMatValue(this.meshSprite3D,"marginalColor",null);
					}
					
				}
			}
		}

		private readMesh(sp):void{
			for(let ms of sp._children){
				if(ms.skinnedMeshRenderer){
					let mat = (ms as Laya.SkinnedMeshSprite3D).skinnedMeshRenderer.sharedMaterial as CustomMaterial;
					if(mat){
						(ms as Laya.SkinnedMeshSprite3D).skinnedMeshRenderer.sharedMaterial = mat.clone();
					}
				}else if(ms._children){
					for(let cms of ms._children){
						this.readMesh(cms);
					}
				}
			}
		}

		private destroyMesh(sp):void{
			for(let ms of sp._children){
				if(ms.skinnedMeshRenderer){
					let mat = (ms as Laya.SkinnedMeshSprite3D).skinnedMeshRenderer.sharedMaterial;
					if(mat)
						mat.destroy();
				}else if(ms._children){
					for(let cms of ms._children){
						this.destroyMesh(cms);
					}
				}
			}
		}

		private setMeshMatValue(sp,key,value):void{
			for(let ms of sp._children){
				if(ms.skinnedMeshRenderer){
					let mat = (ms as Laya.SkinnedMeshSprite3D).skinnedMeshRenderer.sharedMaterial as CustomMaterial;
					if(mat){
						if(value){
							mat[key] = new Laya.Vector3(0.0, 0.3, 1.0);
						}else{
							mat[key] = null;
						}
					}
				}else if(ms._children){
					for(let cms of ms._children){
						this.setMeshMatValue(cms,key,value);
					}
				}
			}
		}

		public createMesh(id,url):void{
			if(this._skinModel == id){
				let sp:Laya.Sprite3D = Laya.loader.getRes(url);
				ResDisposer.Instance.removeLoad(url);
				ResDisposer.Instance.addReferenceRes(url);
				this.meshSprite3D = Laya.Sprite3D.instantiate(sp.getChildAt(0) as Laya.Sprite3D );
				this.meshSprite3D.transform.position = new Laya.Vector3(0,0,0);
				this.addChild(this.meshSprite3D);
				// this.meshSprite3D.name = 
				// this.meshSprite3D.transform.scale = new Laya.Vector3(10,10,10);
				// for(let ms of this.meshSprite3D._children){
					this.readMesh(this.meshSprite3D);
				// }
				if(this._selected)
					this.setSelected(this._selected,true);
				// this.meshSprite3D.name = "model";
				// this.animator = this.meshSprite3D.getComponentByType(Laya.Animator) as Laya.Animator;
				this.animator = this.meshSprite3D.getComponent(Laya.Animator) as Laya.Animator;
				this.playAni(ActionType.Idle,true);
				// this.animator.play("idle");
				
				// this.animator.on(Laya.Event.STOPPED, this, this.playCompleteHandler);
				if(this._weaponSprite && this._weaponSprite.loaded){
					this.animator.linkSprite3DToAvatarNode(this._skinConfig.hand,this._weaponSprite);
				}
				//FXDummy_MainWeapon
			}else{
				ResDisposer.Instance.removeReferenceRes(url);
			}
		}

		private weaponloaded():void{
			this._weaponSprite = Laya.Sprite3D.instantiate(this._weaponSprite.getChildAt(0) as Laya.Sprite3D);
				// this._weaponSprite.meshRender.castShadow = true;
				
			
			SceneManager.Instance.scene.addChild(this._weaponSprite);
			//从场景中获取动画模型
			//获取动画模型中动画组件
			if(this.animator)
				this.animator.linkSprite3DToAvatarNode(this._skinConfig.hand,this._weaponSprite);
		}

		public updateSkin(model:string):void{
			if(this._skinModel != model){
				this.removeSkin();
				this._skinModel = model;
				if(model){
					this.createSkin(model);
				}
			}
		}

		public removeSkin() {
			if(this.meshSprite3D){
				// for(let ms of this.meshSprite3D._children){
				// 	let mat = (ms as Laya.SkinnedMeshSprite3D).skinnedMeshRenderer.sharedMaterial as CustomMaterial;
				// 	mat.destroy();
				// }
				this.destroyMesh(this.meshSprite3D);
				this.meshSprite3D.destroy(true);
				this.meshSprite3D = null;
				if(!ResDisposer.Instance.removeLoad(this._skinConfig.url)){
					ResDisposer.Instance.removeReferenceRes(this._skinConfig.url);
				}
				// ResDisposer.Instance.removeRefByObjId(this._skinModel);
			}
		}

		public updateWeapon(weaponModel:string,type:number):void{
			// if(this._weaponModels[type] != weaponModel){
			// 	this._weaponModels[type] = weaponModel;
			// 	this.removeWeapon(type);
			// 	if(weaponModel){
			// 		// if(this._skinConfig[E_Model_Config.HANDS] && this._skinConfig[E_Model_Config.HANDS][type]){
			// 		this._weaponConfigs[type] = Resource3DConfig.WeaponConfig[weaponModel];
			// 		if(this._weaponConfigs[type]){
			// 			this.createWeaponMesh(type);
			// 		}
			// 		// }
			// 	}
			// }
		}

		public createWeaponMesh(type:number) :void{
			// var wConfig = this._weaponConfigs[type];
			// this._weaponSprite = Laya.Sprite3D.load(wConfig.url);
			// if(this._weaponSprite.loaded){
			// 	this.weaponloaded();
			// }else
			// 	this._weaponSprite.once(Laya.Event.HIERARCHY_LOADED,this,this.weaponloaded);
		}

		private removeWeapon(type:number):void{
			// var wConfig = this._weaponConfigs[type];
			// var o = this._weaponMeshs[type];
			// if(o){
			// 	o.destroy();
			// 	CacheManager.Instance.removeReferenceByConfig(wConfig);
			// 	this._weaponMeshs[type] = null;
			// }
			// this._weaponConfigs[type] = null;
			// this._weaponMeshs[type] = null;
			// delete this._weaponConfigs[type];
			// delete this._weaponMeshs[type];
		}

		
		public playAni(action:number,compulsory: Boolean = false):void{
			if(compulsory || this._curAction != action){
				this._curAction = action;
				if(!this.animator)return;
				// let ani = this._animationFrames[action];
				if(this._skinConfig && this._skinConfig.actions[action]){
					switch(action){
						case ActionType.Idle:
							this.animator.play(this._skinConfig.actions[action]);
							// this.playAniByUrl(ani[0],ani[1],null,Number.MAX_VALUE);
						break;
						default:
							this.animator.play(this._skinConfig.actions[action],0,0);
							// this.playAniByUrl(ani[0],ani[1],this.onSkinAniChange,0);
						break;
					}
				}
				
			}
		}

		// private playCompleteHandler(e: Laya.Event): void {
		// 	if(this._curAction == "skill1" || this._curAction == "skill2"){
		// 		this.playAni("idle",true);
		// 	}
		// }

		// public playAniByUrl(from, to,changeHandler,count:number = 0) {
        //     for (var t = 0, i = this._animations.length; i > t; t++) {
		// 		if(this._eventAnimation){
		// 			this._eventAnimation.player.off(Laya.Event.STOPPED, this, this.onSkinAniChange);
		// 		}
        //         var animationComp = this._animations[t];
        //         animationComp.player.playByFrame(0, 1, count, from, to);
        //         if(t == i - 1 && changeHandler){
		// 			this._eventAnimation = animationComp;
        //         	animationComp.player.once(Laya.Event.STOPPED, this, changeHandler);
		// 		} else{
		// 			this._eventAnimation = null;
        //         	if("die" == this._curAction || "dieEnd" == this._curAction) {
		// 				animationComp.player.returnToZeroStopped = false;
		// 			}
		// 		}
        //     }
        //     // this.skinWeaponAni && (GameUtils.set3DAniUrl(this.skinWeaponAni, this.weaponInfo.ani),
        //     // this.skinWeaponAni.player.playByFrame(0, l, e, _, o),
        //     // "die" == this._curAction && (this.skinWeaponAni.player.returnToZeroStopped = !1)),
        //     // this.skinWingAni && (GameUtils.set3DAniUrl(this.skinWingAni, this.wingInfo.ani),
        //     // this.skinWingAni.player.playByFrame(0, l, e, _, o),
        //     // "die" == this._curAction && (this.skinWingAni.player.returnToZeroStopped = !1))
        
    	// }

		public update():void{
			if (this.animator && this.animator.getCurrentAnimatorPlayState(0)._finish){
				// this.stop();
				if(this._playCompleteHandler){
					this._playCompleteHandler.run();
				}
			}
		}

		public onSkinAniChange():void {
			if(this._curAction == "die"){
			}else{
				this.stop();
			}
		}

		public setPlayCompleteHandler(handler:Laya.Handler):void{
			this._playCompleteHandler = handler;
		}

		public stop() {
			// this.sprite && (this._eventAnimation && this._eventAnimation.player.off(Laya.Event.STOPPED, this, this.onSkinAniChange),
			// this.bufMgr.GetIsInStatue(RoleBufType.SKILL_SPECIAL) || this._special_move || this.runAni("idle"),
			// this._special_move = !1)
			// if(this._eventAnimation){
			// 	this._eventAnimation.player.off(Laya.Event.STOPPED, this, this.onSkinAniChange);
			// }
			// this.playAni("idle");
			
		}

		public destroy(desChild:boolean = true):void{
			if(!this._disposed){
				this.removeSkin();
				this.animator = null;
				this._playCompleteHandler = null;
				this._disposed = true;
				this._skinConfig = null;
				this._skinModel = null;
				super.destroy(desChild);
			}
		}
		
	}
