export class LimitedPool<T extends ILimitedPoolItem> {
	private pool:Array<T>;
	private max:number = 0;
	private creater:{new(): T; };
	public constructor(c: {new(): T; },maxCount:number) {
		this.pool = [];
		this.creater = c;
		this.max = maxCount;
	}

	public pop() : T
	{
		var obj:T = this.pool.length > 0?this.pool.pop():new (this.creater)();
		return obj;
	}
    
	public push(obj:T) : void
	{
		// if(this.pool.indexOf(obj) > -1){
		// 	console.log("ssss");
			
		// }
		if(this.max == 0 || this.pool.length < this.max){
			obj.returnToPool();
			this.pool.push(obj);
		}else{
			//超出限制永久销毁
			obj.disposePermanent();
		}
	}
	
	public has(obj:T) : Boolean
	{
		for(let o of this.pool){
			if(o == obj)
			{
				return true;
			}
		}
		return false;
	}
}

export interface ILimitedPoolItem{
	disposePermanent():void;
	returnToPool():void;
}