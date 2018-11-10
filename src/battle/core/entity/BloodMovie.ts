
import { EntityManager } from "./EntityManager";
import { Player } from "./Player";
import BitmapPool from "../util/BitmapPool";
import { E_HURT_PLUS } from "../GameDefine";

export class BloodMovie extends Laya.Sprite{
	private images:Array<Laya.Sprite> = [];
	private _img_type:Laya.Sprite;
	private _w:number;
	private _plus:number = 0;

	private static movies:Array<BloodMovie> = [];
	private static UseCount:number = 0;

	public static create():BloodMovie{
		if(this.movies.length > 0){
			return this.movies.pop();
		}else{
			if(this.UseCount > 30){
				return null;
			}
			this.UseCount++;
			return new BloodMovie();
		}
	}

	public returnToPool():void{
		if(this.parent){
			this.parent.removeChild(this);
		}
		this.alpha = 1;
		this._plus = 0;
		if(BloodMovie.movies.indexOf(this)>=0)
		{
			return;
		}
		BloodMovie.movies.push(this);
	}

	public show(type:number,plus:number,num:number):void{
		let fx:number = 0;
		let thisObj = this;
		thisObj._plus = plus;
		if(plus >0)
		{
			let showname:string = type + "_c";
			let out:boolean = false;
			switch(plus)
			{
				case E_HURT_PLUS.SHEN_LI:
					showname = "sl";
					out =true;
					break;
				case E_HURT_PLUS.SHEN_TI:
					showname = "st";
					out =true;
					break;
				case E_HURT_PLUS.MA_BI:
					showname = "mb";
					out =true;
					break;
				case E_HURT_PLUS.FU_HUO:
					let player: Player = EntityManager.Instance.firstPlayer;
				// 	if(player && player.gameObject)
				// 	{
				// 		SceneEffectManager.Instance.addEffect(E_Effect_Id.RESURGENCE, null, player.gameObject.gridX * GameDefine.MAP_GRID_WIDTH + GameDefine.MAP_GRID_WIDTH / 2,
				// player.gameObject.gridY * GameDefine.MAP_GRID_HEIGHT + GameDefine.MAP_GRID_HEIGHT / 2, MapLayerType.Effect_Above, 1, 0);
				// 	}
					showname = "fh";
					out =true;
					break;
				case E_HURT_PLUS.DETERRENCE:
					showname = "ws";
					break;
				case E_HURT_PLUS.CRITICAL:
					showname = type + "_c";
					break;
				case E_HURT_PLUS.LIANJI:
					showname = type+"_name";//(type==0?"e":"s") + "_hj";
					break;
				case E_HURT_PLUS.POISON:
					showname = "poison";
					break;
				case E_HURT_PLUS.RECOVERY:
					showname = "recovery";
					break;
				case E_HURT_PLUS.SUCK:
					showname = "suck";
					break;
				case E_HURT_PLUS.REOUND:
					showname = "reound";
					break;
			}
			if(thisObj._img_type){
				thisObj._img_type.texture = Laya.loader.getRes("bloodfont/" + showname + ".png") ;
			}else{
				thisObj._img_type = BitmapPool.createBp(Laya.loader.getRes("bloodfont/" + showname + ".png"));
			}
			thisObj._img_type.y = -15;
			thisObj._img_type.x = 0;
			if(plus == E_HURT_PLUS.RECOVERY ||plus == E_HURT_PLUS.SUCK)
			{
				thisObj._img_type.y = -5;
			}
			else if(plus == E_HURT_PLUS.REOUND)
			{
				thisObj._img_type.y = 2;
			}
			else if(plus == E_HURT_PLUS.LIANJI)
			{
				thisObj._img_type.y = -60;
				thisObj._img_type.x = 55;
				if(type == 20411)
				{
					thisObj._img_type.x = 40;
				}
			}
			if(thisObj._img_type.parent == null){
				thisObj.addChildAt(thisObj._img_type,0);
			}
			if(out)
			{
				while(thisObj.images.length>0)
				{
					let temp:Laya.Sprite = thisObj.images.pop();
					BitmapPool.pushBp(temp);
					if(temp.parent)
					{
						temp.parent.removeChild(temp);
					}
				}
				return;
			}
			fx = thisObj._img_type.width;
		}
		else
		{
			if(thisObj._img_type){
				BitmapPool.pushBp(thisObj._img_type);
				if(thisObj._img_type.parent)
					thisObj._img_type.parent.removeChild(thisObj._img_type);
				thisObj._img_type = null;
			}
		}
		
		thisObj.images = thisObj.addNumber(type,type==5?"+"+num:num+"",fx,0,plus);
	}

	public addNumber(type:number,num:string,x:number,y:number,plus:number):Array<Laya.Sprite>{
		let len:number = num.length;
		let w:number = x;
		//let tx:number = 0;
		let thisObj = this;
		let imgs:Array<Laya.Sprite> = thisObj.images;
		while(imgs.length>len)
		{
			let image:Laya.Sprite = thisObj.images.pop();
			BitmapPool.pushBp(image);
			image.removeSelf();
		}
		if(num == "0")
		{
			while(imgs.length>0)
			{
				let image:Laya.Sprite = thisObj.images.pop();
				BitmapPool.pushBp(image);
				image.removeSelf();
			}
			return imgs;
		}
		for(let i:number = 0; i < len;i++){
			let str:string = num.charAt(i);
			
			let image:Laya.Sprite;
			if(imgs.length > i && imgs[i] != null){
				image = imgs[i];
				if(image.parent == null)
					thisObj.addChild(image);
					image.texture = Laya.loader.getRes("bloodfont/" + type+ "_"+ str + ".png");

			}else{
				image = BitmapPool.createBp(Laya.loader.getRes("bloodfont/" + type+ "_"+ str + ".png"));
				thisObj.addChild(image);
				imgs.push(image);
			}
			image.x = w;
			w += image.width-3;//这个是飘字艰巨缩小点，其他地方又用另外来
		}
		thisObj._w = w;
		return imgs;
	}

	get width():number{
		return this._w;
	}

	public dispose():void{
		let thisObj = this;
		if(thisObj.images){
			for(let img of thisObj.images){
				if(img.parent){
					img.parent.removeChild(img);
					BitmapPool.pushBp(img);
					img.texture = null;
				}
			}
			thisObj.images = null;
		}
		if(thisObj._img_type){
			thisObj._img_type.parent.removeChild(thisObj._img_type);
			BitmapPool.pushBp(thisObj._img_type);
			thisObj._img_type.texture = null;
		}
		if(thisObj.parent){
			thisObj.parent.removeChild(this);
		}
	}
}