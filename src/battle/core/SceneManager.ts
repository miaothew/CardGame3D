import { ShaderManager } from "./ShaderManager";
import { CameraManager } from "./CameraManager";
import { AIManager } from "./entity/ai/AIManager";
import { BattleManager } from "../BattleManager";
import { Model3D } from "./entity/Model3D";
import { EntityManager } from "./entity/EntityManager";
import { AnimalEntity } from "./entity/AnimalEntity";
import { ConfigManager } from "../../config/ConfigManager";
import { GameData } from "../../data/GameData";
import { ResDisposer } from "./util/ResDisposer";

/**
* name 
*/
export class SceneManager {
	public stage: Laya.Sprite;
	scene: Laya.Scene3D;
	terrain: Laya.Terrain;
	// public terrainSprite: Laya.MeshTerrainSprite3D;
	role3d: Laya.Sprite3D;
	directionLight: Laya.DirectionLight;
	public static Instance: SceneManager;
	public pointLights: Laya.PointLight[];
	private _root:Laya.Sprite;
	public infoCont:Laya.Sprite;
	public sceneCont:Laya.Sprite;
	private _mouseRay:Laya.Ray;
	private _mousePoint:Laya.Vector2 = new Laya.Vector2();
	private _hitresult:Laya.HitResult = new Laya.HitResult();
	
	constructor() {
		this._mouseRay = new Laya.Ray(new Laya.Vector3(0,0,0),new Laya.Vector3(0,0,0));
	}

	public static createInstance(): void {
		this.Instance = new SceneManager();
	}

	public init(root:Laya.Sprite): void {
		this._root = root;
		this.sceneCont = new Laya.Sprite();
		this._root.addChild(this.sceneCont);
		this._root.mouseEnabled = this.sceneCont.mouseEnabled = true;
		// this.sceneCont.graphics.drawRect(0,0,1500,1000,"#ff00ff");
		Laya.stage.on(Laya.Event.MOUSE_DOWN,this,this.mouseDownHandler);
		Laya.stage.on(Laya.Event.MOUSE_MOVE,this,this.mouseMoveHandler);
		this.infoCont = new Laya.Sprite();
		this._root.addChild(this.infoCont);
		this.infoCont.mouseEnabled = false;
		this.infoCont.mouseThrough = true;
		ShaderManager.createInstance();
		ShaderManager.Instance.initShaders();
		CameraManager.createInstance();
		AIManager.createInstance();
	}

	

	private mouseDownHandler(e:Laya.Event):void{
		if(CameraManager.Instance.mainCamera){
			//获取鼠标位置
			this._mousePoint.elements[0] = Laya.MouseManager.instance.mouseX;
			this._mousePoint.elements[1] = Laya.MouseManager.instance.mouseY;
			//产生射线
			CameraManager.Instance.mainCamera.viewportPointToRay(this._mousePoint,this._mouseRay);
			//拿到射线碰撞的物体
			this.scene.physicsSimulation.rayCast(this._mouseRay,this._hitresult);
			//如果碰撞到物体
			if (this._hitresult.succeeded)
			{
			//删除碰撞到的物体
				let meshSp = this._hitresult.collider.owner;
				if(meshSp.parent && meshSp.parent["_aeId"]){
					let aeid = meshSp.parent["_aeId"];
					let entity = EntityManager.Instance.getEntity(aeid);
					if(entity){
						BattleManager.Instance.useCard(entity);
					}
				}
			}
		}
		
	}

	private _lastMouseEntity:AnimalEntity;

	private mouseMoveHandler(e:Laya.Event):void{
		if(CameraManager.Instance.mainCamera){
			this._mousePoint.elements[0] = Laya.MouseManager.instance.mouseX;
			this._mousePoint.elements[1] = Laya.MouseManager.instance.mouseY;
			//产生射线
			CameraManager.Instance.mainCamera.viewportPointToRay(this._mousePoint,this._mouseRay);
			//拿到射线碰撞的物体
			this.scene.physicsSimulation.rayCast(this._mouseRay,this._hitresult);
			//如果碰撞到物体
			let lastHited:AnimalEntity = this._lastMouseEntity;
			let entity;
			if (this._hitresult.succeeded)
			{
			//删除碰撞到的物体
				let meshSp = this._hitresult.collider.owner;
				if(meshSp.parent && meshSp.parent["_aeId"]){
					let aeid = meshSp.parent["_aeId"];
					entity = EntityManager.Instance.getEntity(aeid) as AnimalEntity;
					this._lastMouseEntity = entity;
					if(entity.model3D){
						entity.model3D.setSelected(true);
					}
					// if(entity){
					// 	BattleManager.Instance.useCard(entity);
					// }
					// console.log("触碰：" + entity.a_name);
				}
			}
			if(lastHited && lastHited != entity){
				if(lastHited.model3D){
					lastHited.model3D.setSelected(false);
				}
			}
		}
		
	}

	public enter(): void {
		let res = ConfigManager.Instance.map["map_" + GameData.instance.mapid].url;
		Laya.loader.create(res, Laya.Handler.create(this, this.onLoadFinish));
		// this.onLoadFinish();
	}

	public destroyScene():void{
		if(CameraManager.Instance.mainCamera){
			CameraManager.Instance.mainCamera.destroy(true);
			CameraManager.Instance.mainCamera = null;
		}	
		if(this.directionLight){
			this.directionLight.destroy(true);
			this.directionLight = null;
		}
		if(this.scene.parent){
			this.scene.parent.removeChild(this.scene);
			this.scene.destroy(true);
			this.scene = null;
		}
		let resData = ConfigManager.Instance.map["map_" + GameData.instance.mapid];
		for (const url of resData.allRes) {
			ResDisposer.Instance.disposeRes(url);
		}
		ResDisposer.Instance.disposeRes(resData.url);
	}

	private onLoadFinish(): void {
		
		var scene = Laya.loader.getRes(ConfigManager.Instance.map["map_" + GameData.instance.mapid].url) as Laya.Sprite3D;
		this.scene = this.sceneCont.addChild(scene) as Laya.Scene3D;
		// (scene.getChildAt(0) as Laya.MeshSprite3D).meshRenderer.receiveShadow = true;
		this.initCamera();
		// //添加方向光
		this.initDirectionLight();

		BattleManager.Instance.startGame();
	}

	public updateTime(): void {
	}

	private initDirectionLight(): void {
		this.directionLight = this.scene.addChild(new Laya.DirectionLight()) as Laya.DirectionLight;
		this.directionLight.color = new Laya.Vector3(1.5, 1.5, 1.5);
		//this.directionLight.transform.translate(new Laya.Vector3(-2.165527, 2.193848, -3.087891));
		// this.directionLight.direction = new Laya.Vector3(0, -1.0, -1.0);
		this.directionLight.transform.rotation = new Laya.Quaternion(0.2205614, 0.5054134, 0.8231464, -0.1354251);
		this.directionLight.shadow = false;
		// this.directionLight.shadowDistance = 45;
		// this.directionLight.shadowPSSMCount = 1;
		// this.directionLight.shadowPCFType = 3;
		// this.directionLight.shadowResolution = 2048;
	}
	private initCamera(): void {
		//添加照相机channel
		var camera: Laya.Camera = (this.scene.addChild(new Laya.Camera(0, 0.3, 1000))) as Laya.Camera;
		// camera.transform.translate(new Laya.Vector3(-50.51006, 5.763073, 24.30456));
		camera.transform.position = new Laya.Vector3(-50.51006, 5.763073, 24.30456);
		// camera.transform.rotate(new Laya.Vector3(-30, 0, 0), true, false);
		camera.transform.rotation = new Laya.Quaternion(-0.2575304, -0.6578727, -0.2569133, 0.6594522);
		camera.fieldOfView = 20;
		//this.camera.clearColor = new Laya.Vector4(0.1921569,0.3019608,0.4745098,0);
		// camera.clearFlag = Laya.BaseCamera.CLEARFLAG_SKY;
		// var skyBox = new Laya.SkyBox();
		// camera.sky = skyBox;
		// skyBox.textureCube = Laya.TextureCube.load("res/fbx/LayaScene_testLaya/Assets/TinyTerrain/Standard Assets/Skyboxes/Skybox.ltc");
		CameraManager.Instance.mainCamera = camera;

		// camera.addComponent();
	}

	

}
