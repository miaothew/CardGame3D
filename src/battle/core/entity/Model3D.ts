import { SceneManager } from "../SceneManager";
import { CustomMaterial } from "../marterial/CustomMaterial";
import { ResDisposer } from "../util/ResDisposer";
import { ConfigManager } from "../../../config/ConfigManager";

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
				ResDisposer.Instance.addRefByObjId(id);
				this._skinConfig = ConfigManager.Instance.obj["model_" + id];
				this._skinModel = id;
				let sp:Laya.Sprite3D = Laya.loader.getRes(this._skinConfig.url);
				if(sp){
					this.createMesh(id);
				}else{
					Laya.Sprite3D.load(this._skinConfig.url,Laya.Handler.create(this,this.createMesh,[id]));
				}
			}
		}
		
		public setSelected(value:boolean,compulsory:boolean = false){
			if(this._selected != value || compulsory){
				this._selected = value;
				if(this.meshSprite3D){
					for(let ms of this.meshSprite3D._children){
						let mat = (ms as Laya.SkinnedMeshSprite3D).skinnedMeshRenderer.sharedMaterial as CustomMaterial;
						if(value){
							mat.marginalColor = new Laya.Vector3(0.0, 0.3, 1.0);
						}else{
							mat.marginalColor = null;
						}
					}
				}
			}
		}

		public createMesh(id):void{
			if(this._skinModel == id){
				let sp:Laya.Sprite3D = Laya.loader.getRes(this._skinConfig.url);
				this.meshSprite3D = Laya.Sprite3D.instantiate(sp.getChildAt(0) as Laya.Sprite3D );
				this.addChild(this.meshSprite3D);
				// this.meshSprite3D.name = 
				// this.meshSprite3D.transform.scale = new Laya.Vector3(10,10,10);
				for(let ms of this.meshSprite3D._children){
					// ms.skinnedMeshRenderer.castShadow = true;
					//添加碰撞器组件并获取
					// var meshCollider:Laya.PhysicsCollider = ms.addComponent(Laya.PhysicsCollider)as Laya.PhysicsCollider;
					let mat = (ms as Laya.SkinnedMeshSprite3D).skinnedMeshRenderer.sharedMaterial as CustomMaterial;
					(ms as Laya.SkinnedMeshSprite3D).skinnedMeshRenderer.sharedMaterial = mat.clone();
					// mat.marginalColor = new Laya.Vector3(0.0, 0.3, 1.0);
					// var boxShape:Laya.MeshColliderShape = new Laya.MeshColliderShape();
					// //获取模型的Mesh网格
					// boxShape.mesh = ms.meshFilter.sharedMesh as Laya.Mesh;
					//把Mesh网格添加到碰撞器
					// meshCollider.colliderShape = boxShape;
					// var capsuleShape:Laya.CapsuleColliderShape = new Laya.CapsuleColliderShape(0.5,2);
					// capsuleShape.localOffset = new Laya.Vector3(0,0.6,0);
					// meshCollider.colliderShape = capsuleShape;
				}
				if(this._selected)
					this.setSelected(this._selected,true);
				// this.meshSprite3D.name = "model";
				// this.animator = this.meshSprite3D.getComponentByType(Laya.Animator) as Laya.Animator;
				this.animator = this.meshSprite3D.getComponent(Laya.Animator) as Laya.Animator;
				this.animator.play("idle");
				
				// this.animator.on(Laya.Event.STOPPED, this, this.playCompleteHandler);
				if(this._weaponSprite && this._weaponSprite.loaded){
					this.animator.linkSprite3DToAvatarNode(this._skinConfig.hand,this._weaponSprite);
				}
				//FXDummy_MainWeapon
			}else{
				ResDisposer.Instance.checkRef(id);
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
				this._skinModel = model;
				this.removeSkin();
				if(model){
					this.createSkin(model);
				}
			}
		}

		public removeSkin() {
			if(this.meshSprite3D){
				for(let ms of this.meshSprite3D._children){
					// ms.skinnedMeshRenderer.castShadow = true;
					//添加碰撞器组件并获取
					// var meshCollider:Laya.PhysicsCollider = ms.addComponent(Laya.PhysicsCollider)as Laya.PhysicsCollider;
					let mat = (ms as Laya.SkinnedMeshSprite3D).skinnedMeshRenderer.sharedMaterial as CustomMaterial;
					mat.destroy();
				}
				this.meshSprite3D.destroy(true);
				this.meshSprite3D = null;
				ResDisposer.Instance.removeRefByObjId(this._skinModel);
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

		
		public playAni(action:string,compulsory: Boolean = false):void{
			if(compulsory || this._curAction != action){
				this._curAction = action;
				if(!this.animator)return;
				// let ani = this._animationFrames[action];
				switch(action){
					case "idle":
					
						this.animator.play("idle");
						// this.playAniByUrl(ani[0],ani[1],null,Number.MAX_VALUE);
					break;
					case "run":
					case "die":
					case "dieEnd":
						this.animator.play("run");
					break;
					case "attack":
					
					this.animator.play("attack",0,0);
					break;
					case "skill2":
						this.animator.play("attack");
						
					break;
					default:
						// this.playAniByUrl(ani[0],ani[1],this.onSkinAniChange,0);
					break;
				}
			}
		}

		private playCompleteHandler(e: Laya.Event): void {
			if(this._curAction == "skill1" || this._curAction == "skill2"){
				this.playAni("idle",true);
			}
		}

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
