export default class BitmapPool {

	public static bpPool:Laya.Sprite[] = [];
	public static createBp(res?) : Laya.Sprite
	{
		var obj:Laya.Sprite = this.bpPool.length > 0?this.bpPool.pop():new Laya.Sprite();
		if(res){
			obj.texture = res;
		}
		obj.width = obj.height = NaN;
		obj.x = obj.y = 0;
		obj.scaleX = obj.scaleY = 1;
		return obj;
	}
    
	public static pushBp(obj:Laya.Sprite) : void
	{
		if(this.bpPool.length < 100){
			this.bpPool.push(obj);
		}
	}
}