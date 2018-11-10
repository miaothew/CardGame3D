import { Entity } from "./Entity";
import { SceneManager } from "../SceneManager";
import { CameraManager } from "../CameraManager";
import { GameUtils } from "../util/GameUtils";
import { BloodMovie } from "./BloodMovie";

export enum EntityInfoType {
	ALL,
	BLOODBAR,
	BLOODVALUE,
	INNERBAR,
	NICKNAME,
	UNIONNAME,
	NONSENSE,
	JUNXIANNAME,
	TIME,
	TITLE
}

export class EntityInfo {

	protected _ae: Entity;
	public _cont: Laya.Sprite;
	public static spPool:Laya.Sprite[] = [];
	//public _animationContainer:Laya.Sprite;
	protected _texts: { [key: string]: Laya.Label } = {};
	public _needSort: boolean = false;
	public _posArr: Array<number> = [];
	public _bloodY: number = 0;//血条高度
	public _bloodBar: Laya.Image;
	public _bloodBarBg: Laya.Image;
	protected _nameY: number = 137;
	protected iconY: number = 0;
    private _inView: boolean = false;
    private _colorSet: { [key: string]: string };
	public static SORTRULE: Array<EntityInfoType> = [ EntityInfoType.BLOODVALUE, EntityInfoType.NICKNAME, EntityInfoType.JUNXIANNAME, EntityInfoType.UNIONNAME];

	public static createSp() : Laya.Sprite
	{
		var obj:Laya.Sprite = this.spPool.length > 0?this.spPool.pop():new Laya.Sprite();obj.visible = true;
		return obj;
	}
    
	public static pushSp(obj:Laya.Sprite) : void
	{
		if(this.spPool.length < 80){
			this.spPool.push(obj);
		}
	}

	public constructor(ae: Entity) {
		this._ae = ae;
		this._cont = EntityInfo.createSp();
		// this._cont.graphics.drawCircle(0,0,10,"#ff0000")
		SceneManager.Instance.infoCont.addChild(this._cont);
		//this._animationContainer = new Laya.Sprite();
		//let mapLayer:MapLayer = GameSceneManager.Instance.getLayer(MapLayerType.Info);
		//mapLayer.addChildAt(this._infoContainer,0);//改之后
		// mapLayer.addChild(this._infoContainer);//改之前
		//mapLayer.addChild(this._animationContainer);
	}

	public set inView(value: boolean) {
		let thisObj = this;
		if (thisObj._inView != value) {
			if (!value && thisObj._cont.parent) {
				thisObj._cont.parent.removeChild(thisObj._cont);
			} else if (value && !thisObj._cont.parent) {
				SceneManager.Instance.infoCont.addChildAt(thisObj._cont, 0);
			}
			thisObj._inView = value;
		}
	}

	public get inView(): boolean {
		return this._inView;
	}

	public set visible(value: boolean) {
		if (this._cont) {
			this._cont.visible = value;
		}
	}

	public setNameY(value: number): void {
		this._nameY = value;
		this._needSort = true;
	}

	public setBloodY(value: number): void {
		this._bloodY = value;
		this._needSort = true;
	}

	/**
	 * 设置血条
	 *
	 */
	public setBlood(hp: number, maxHp: number, show: Boolean = false, needTween: Boolean = false,hasBloodValue:boolean = false): void {
		let thisObj = this;
		if (thisObj._bloodBar == null) {
			thisObj._bloodBar = new Laya.Image("common/red_blood.png");
			thisObj._bloodBarBg = new Laya.Image("common/empty_blood.png");
			// thisObj._bloodBar.width = 60;
			// thisObj._bloodBarBg.width = 60;
			if (thisObj._bloodBar) {
				thisObj._bloodBarBg.x = -thisObj._bloodBarBg.width >> 1;
				thisObj._bloodBar.x = -thisObj._bloodBar.width >> 1;
				thisObj._bloodBar.y = thisObj._bloodBarBg.y = -thisObj._bloodY;
			}
			
				// thisObj.addText(EntityInfoType.BLOODVALUE,0xffffff);
			
			thisObj.setPosition(EntityInfoType.BLOODBAR);
			thisObj.setPosition(EntityInfoType.BLOODVALUE);
		}
		// if(_bloodTween)
		// 	_bloodTween.kill();
		// if(needTween)
		// 	_bloodTween = TweenLite.to(thisObj._bloodBar,0.6,{scaleX:Math.min(hp / maxHp, 1)});
		// else
		let lastScale: number = thisObj._bloodBar.scaleX;
		thisObj._bloodBar.scaleX = Math.min(hp / maxHp, 1);
		//thisObj._bloodBar.scaleX = ;
		if(hasBloodValue || thisObj.getText(EntityInfoType.BLOODVALUE))
		{
			thisObj.setTexts(EntityInfoType.BLOODVALUE,hp + "/" + maxHp);
		}
		if (show) {
			thisObj._cont.addChildAt(thisObj._bloodBarBg, 0);
			thisObj._cont.addChild(thisObj._bloodBar);
			thisObj.showText(EntityInfoType.BLOODVALUE);
		}
	}

	

	/** 显示一个文本提示项 */
	public showText(key: EntityInfoType): void {
		let thisObj = this;
		if (thisObj._texts[key] && thisObj._cont.contains(thisObj._texts[key]) == false) {
			thisObj._cont.addChild(thisObj._texts[key]);
			thisObj._needSort = true;
		}
	}

	/** 隐藏一个文本提示项 */
	public hideText(key: EntityInfoType): void {
		let thisObj = this;
		if (thisObj._texts[key] && thisObj._cont.contains(thisObj._texts[key])) {
			thisObj._cont.removeChild(thisObj._texts[key]);
			thisObj._needSort = true;
		}
	}


	public hideBlood() {
		let thisObj = this;
		if (thisObj._cont.contains(thisObj._bloodBarBg)) {
			thisObj._cont.removeChild(thisObj._bloodBarBg);
		}
		if (thisObj._cont.contains(thisObj._bloodBar)) {
			thisObj._cont.removeChild(thisObj._bloodBar);
		}
		thisObj.hideText(EntityInfoType.BLOODVALUE);
		thisObj._needSort = true;
	}


	public setTexts(key: EntityInfoType, value: string, show: Boolean = false): void {
		// value = "名字有九个字那么长";
		let thisObj = this;
		var t: Laya.Label = thisObj.getText(key);
		if (t == null) {
			t = thisObj.addText(key);

		}
		thisObj.setText(key, value, t);
		if (show) {
			thisObj.showText(key);
			thisObj.setPosition(key);
		}
	}

	/** 获取一个文本提示项 */
	public getText(key: EntityInfoType): Laya.Label {
		return this._texts[key];
	}

	/**
	 * 所有文本和图标高度
	 * @param key 不重载当前关键字的文本组件位置
	 */
	public setPosition(key: EntityInfoType = 0): void {
		this.locateX(key);
		this.locateY(key);
	}

	/** 添加一个文本提示项 */
	public addText(key: EntityInfoType, color: string = "#FFFFFF"): Laya.Label {
		let thisObj = this;
		var t: Laya.Label = new Laya.Label();
		t.fontSize = 20;
		// t.borderColor = "#000000";
		t.bold = true;
		if (thisObj._colorSet) {
			if (thisObj._colorSet[key] != null) {
				color = thisObj._colorSet[key];
			}
		}
		// if (t.textColor != color)
		t.color = color;
		t.width = 180;
		t.align = "center";
		thisObj._texts[key] = t;
		thisObj._needSort = true;
		return t;
	}

	/** 设置文本宽 */
	protected setText(key: EntityInfoType, text: string, tf: Laya.Label = null): void {
		if (tf == null) {
			tf = this.getText(key);
		}
		tf.text = text == null ? "" : text;
		if (key == EntityInfoType.NICKNAME || key == EntityInfoType.UNIONNAME || key == EntityInfoType.JUNXIANNAME || key == EntityInfoType.BLOODVALUE) {
			tf.width = 140;
			tf.x = -70;//-tf.width >> 1;
		}
	}



	public locateX(key: EntityInfoType = 0): void {
		var _icon: Object;
		var t: Laya.Label;
		var _x: number;
		let thisObj = this;
		if (key == EntityInfoType.ALL) {
			for (let k in thisObj._texts) {
				t = thisObj._texts[k];
				switch (Number(k)) {
					case EntityInfoType.NICKNAME:
						{
							t.x = Math.round(-t.width * 0.5);
							break;
						}
					case EntityInfoType.UNIONNAME:
						t.x = Math.round(-t.width * 0.5);
						break;
					case EntityInfoType.BLOODVALUE:
						t.x = Math.round(-t.width * 0.5);
						break;
					case EntityInfoType.TIME:
						t.x = Math.round(-t.width * 0.5);
						break;
					case EntityInfoType.JUNXIANNAME:
						t.x = Math.round(-t.width * 0.5);
						break;
					default:
						{
							break;
						}
				}
			}
		} else {
			t = thisObj._texts[key];
			if (t)
				switch (key) {
					case EntityInfoType.NICKNAME:
						{
							t.x = Math.round(-t.width * 0.5);
							break;
						}
					case EntityInfoType.UNIONNAME:
						t.x = Math.round(-t.width * 0.5);
						break;
					case EntityInfoType.BLOODVALUE:
						t.x = Math.round(-t.width * 0.5);
						break;
					case EntityInfoType.TIME:
						t.x = Math.round(-t.width * 0.5);
						break;
					case EntityInfoType.JUNXIANNAME:
						t.x = Math.round(-t.width * 0.5);
						break;
					default:
						{
							break;
						}
				}
		}
	}

	public locateY(key: EntityInfoType = 0): void {
		var t: Laya.Label;
		//var offsetY:int = -_animal.offsetY;
		var offsetY: number = 0;
		let thisObj = this;
		if (key == EntityInfoType.ALL) {
			for (let k in thisObj._texts) {
				t = thisObj._texts[k];
				switch (Number(k)) {
					case EntityInfoType.NICKNAME:
						{
							t.y = offsetY - thisObj._posArr[1];

							break;
						}
					case EntityInfoType.UNIONNAME:
						t.y = offsetY - thisObj._posArr[3];
						break;
					case EntityInfoType.JUNXIANNAME:
						t.y = offsetY - thisObj._posArr[2];
						break;
					case EntityInfoType.BLOODVALUE:
						t.y = offsetY - thisObj._posArr[0];

						break;
					case EntityInfoType.TIME:
						t.y = offsetY;
						break;
					default:
						{
							break;
						}
				}
			}
		} else {
			t = thisObj._texts[key];
			if (t)
				switch (key) {
					case EntityInfoType.NICKNAME:
						{
							t.y = offsetY - thisObj._posArr[1];

							break;
						}
					case EntityInfoType.UNIONNAME:
						t.y = offsetY - thisObj._posArr[3];
						break;
					case EntityInfoType.JUNXIANNAME:
						t.y = offsetY - thisObj._posArr[2];
						break;
					case EntityInfoType.TIME:
						t.y = offsetY;
					case EntityInfoType.BLOODVALUE:
						t.y = offsetY - thisObj._posArr[0];
						break;
					default:
						{
							break;
						}
				}
		}
	}

	public sortShow(): void {
		let t = this;
		if (t._needSort) {
			let index: number = 0;
			let count: number = 0;
			let rule: Array<EntityInfoType> = EntityInfo.SORTRULE;
			let maxY: number = 0;
			for (let i in rule) {
				var o: EntityInfoType = rule[i];
				var txt: Laya.Label = t.getText(o);
				if (txt && txt.visible && txt.parent) {
					t._posArr[index] = maxY = count * 28 + t._bloodY + 30;//t._nameY;

					count++;
				}
				else {
					t._posArr[index] = 0;
				}
				index++;
			}
			t.iconY = maxY;
			t.locateY();
			t._needSort = false;
		}
    }
    public updatePos(pos:Laya.Vector3):void{
		let tempVec3 = GameUtils.Vector3Temp;
		let temp2Vec3 = GameUtils.Vector3Temp3;
		let camera = CameraManager.Instance.mainCamera;
		temp2Vec3.x = pos.x;temp2Vec3.y = pos.y + 2;temp2Vec3.z = pos.z;
        camera.viewport.project(temp2Vec3, camera.projectionViewMatrix, tempVec3);
        this.setPositionX(tempVec3.x / Laya.stage.clientScaleX);
        this.setPositionY( tempVec3.y / Laya.stage.clientScaleY);
    }

	public setPositionX(value: number): void {
		this._cont.x = value;
	}

	public setPositionY(value: number): void {
		this._cont.y = value;
	}

	public dispose(): void {
		let t = this;
		t._colorSet = null;
		if (t._cont) {
			let container = t._cont;
			while (container.numChildren > 0) {
				container.removeChildAt(0);
			}
			if (container.parent)
				container.parent.removeChild(container);
			EntityInfo.pushSp(container);
			t._cont = null;
		}
		
		if (t._bloodBar) {
			t._bloodBar.texture = null;
			t._bloodBar = null;
		}
		if (t._bloodBarBg) {
			t._bloodBarBg.texture = null;
			t._bloodBarBg = null;
		}
		t._ae = null;
		t._posArr = null;
		if (t._texts) {
			t._texts = null;
		}
	}

	// public bloodEffect:Array<Laya.BitmapText> = new Array();

	public showBloodEffect(value: number, dir: number, type: number, plus: number, index: number): void {
		
		if (!this._inView)//理论上说只有自己和被打会显示伤害票字，怪物死的那一下不票字了加上这个
			return;
		let bt: BloodMovie = BloodMovie.create();
		if (bt == null) {
			return;
		}
		bt.show(type, plus, value);
		bt.x = this._cont.x - bt.width / 2;

		bt.y = this._cont.y - 80 - 20;
		if (plus > 0) {
			bt.x += 30;
			bt.y += 30;
		}
		let hasPunch: boolean = false;
		let mapLayer:Laya.Sprite = SceneManager.Instance.infoCont;
		if (mapLayer.numChildren > 0) {
			let temp: BloodMovie = mapLayer.getChildAt(mapLayer.numChildren - 1) as BloodMovie;
		}

		if (hasPunch) {
			mapLayer.addChildAt(bt, mapLayer.numChildren - 1);
		}
		else {
			mapLayer.addChild(bt);
		}
		Laya.Tween.clearTween(bt);
		// Laya.Tween.removeTweens(bt);
		// let tween: Laya.Tween = Laya.Tween.get(bt);
		let tx: number, ty: number, endX: number, endY: number;
		if (dir == 0) {//中
			tx = bt.x;
			endX = tx;
		} else if (dir == 1) {//左
			tx = bt.x - 40 - Math.round(Math.random() * 40);
			endX = tx - 30;
		} else if (dir == 2) {//右
			tx = bt.x + 40 + Math.round(Math.random() * 40);
			endX = tx + 30;
		}
		ty = bt.y - 20 - Math.round(Math.random() * 30);
		endY = ty - 50;

		// if (plus == constants.E_HURT_PLUS.LIANJI) {//连击现在用id了
		// 	bt.x = index * 10 - SceneManager.Instance.scrollX + (mStage.stageWidth - 640) / 2;
		// 	bt.alpha = 0;
		// 	if(value == 0)
		// 	{
		// 		bt.x += 130;
		// 	}
		// 	let showy: number = 350 - 80 * index - SceneManager.Instance.scrollY;
		// 	Laya.Tween.to(bt,{ alpha: 1, y: showy }, 100, Laya.Ease.sineIn)
		// 		.to(bt,{}, 400, Laya.Ease.sineIn)
		// 		.to(bt,{ x: bt.x + 100, y: showy - 100, alpha: 0 }, 600, Laya.Ease.sineIn,Laya.Handler.create(this,function () { bt.returnToPool(); }))
		// }
		// else {
			Laya.Tween.to(bt,{ x: tx, y: ty, scaleX: 1.5, scaleY: 1.5 }, 100, Laya.Ease.sineIn)
				.to(bt,{ scaleX: 1, scaleY: 1 }, 100, Laya.Ease.sineIn)
				.to(bt,{}, 300, Laya.Ease.sineIn).to(bt,{ x: endX, y: endY, alpha: 0 }, 600, Laya.Ease.sineIn,Laya.Handler.create(this,function () { bt.returnToPool(); }))
		// }
	}

	

	public setTxtColor(key: any, color: string): void {
		var t: Laya.Label = this.getText(key);
		if (!this._colorSet) {
			this._colorSet = {};
		}
		this._colorSet[key] = color;
		if (t == null) {
			return;
		}
		t.color = color;
	}

	// public onComplete():void
	// {
	// 	let bt:Laya.BitmapText = this.bloodEffect.shift();
	// 	let mapLayer:MapLayer = GameSceneManager.Instance.getLayer(MapLayerType.Info);
	// 	mapLayer.removeChild(bt);
	// 	bt = null;
	// }

	


}