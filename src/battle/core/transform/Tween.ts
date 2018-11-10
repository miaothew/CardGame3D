import { Vector2Extension, IUpdateable } from "../util/GameUtils";
import { GameTime } from "../../../data/GameTime";

export class Tween implements IUpdateable {

	public get end(): number[] {
		return this._end;
	}

	public moveStep: Function; 				 // 每移动完一格 
	public moveComplete: Function; 				 // 移动完成事件
	public moveBegin: Function; 				 // 开始移动



	public _moveIncrement: number[]; 			 // 平滑移动增量
	public _movePoint: number[]; 			 // 要移动到的点
	public _start: number[]; 			 // 起始点
	public _end: number[];			     // 目标点
	public speed: number; 							 // 移动速度	
	public _betweenDistance: number; 			 // 两点之间的距离
	public _moveDistance: number; 			 // 已移动了的距离
	public _tweenAble: ITweenAble; 	 // 移动对象
	public _direction: number; 				 // 方向
	public _lasttime: number = 0;
	public enabled: boolean = true;

	constructor(tweenAble: ITweenAble = null, speed: number = 5) {
		this._tweenAble = tweenAble;
		this.speed = speed;
		this._moveIncrement = [];
	}

	public get tweenAble(): ITweenAble {
		return this._tweenAble;
	}
	public set tweenAble(value: ITweenAble) {
		this._tweenAble = value;
	}

	/**
	 * 动态修改平移速度 
	 * @param speed 速度值
	 * 
	 */
	public setSpeed(speed: number): void {
		if (this.enabled) {
			this.speed = speed;
			Vector2Extension.moveIncrementByPoint(this._moveIncrement, this._start, this._end, this.speed);
		}
	}

	public initialize(): void {
		this.enabled = false;
	}

	/** 开始移动 */
	public move(end: number[]): void {
		this.resetTween();
		// 最终必须移动到的点。坐标取整后也要移动到得点

		this._movePoint = [this._tweenAble.x, this._tweenAble.z];

		// 获取下一格的目标点
		this._start  = [this._tweenAble.x, this._tweenAble.z];
		this._end = end;
		this._direction = Vector2Extension.directionByTan(this._start[0], this._start[1], this._end[0], this._end[1]); // 方向
		Vector2Extension.moveIncrementByPoint(this._moveIncrement, this._start, this._end, this.speed);
		this._betweenDistance = Vector2Extension.distanceOfPoint(this._start, this._end);										// 两点距离
		this.enabled  = true;

		// 开始移动
		if (this.moveBegin != null) {
			this.moveBegin(this._direction);
		}
	}

	/** 平滑移动动画逻辑更新 */
	public updateTime(gameTime: GameTime): void {
		var frame: number = gameTime.elapsedGameTime / (1000 / 60);

		if (frame > 6) {//这是什么情况。。。这么卡？
			frame = 6;
		}


		//计算移动组件此次移动的坐标点
		this._moveDistance += this.speed * frame;
		this._movePoint[0] += this._moveIncrement[0] * frame;
		this._movePoint[1] += this._moveIncrement[1] * frame;

		//移动完成
		if (this.enabled && (this._moveDistance >= this._betweenDistance || this._tweenAble.endNow)) {
			if (!this._tweenAble.moveNext) {
				this._movePoint[0] = this._end[0];
				this._movePoint[1] = this._end[1];
			}
			this._tweenAble.setHorizontalPosition(this._movePoint[0], this._movePoint[1]);

			this.enabled = false;
			this.resetTween();

			if (this.moveComplete != null) {
				this.moveComplete(this._tweenAble, gameTime.totalGameTime);
			}
		}
		else {
			this._tweenAble.setHorizontalPosition(this._movePoint[0], this._movePoint[1]);

			if (this.moveStep != null) {
				this.moveStep();
			}
		}
	}

	protected resetTween(): void {
		this.enabled  = false;
		this._moveDistance  = 0;
		this._betweenDistance = 0;
		this._moveIncrement = [];
		this._movePoint = null;
		this._start = null;
		this._end = null;
	}

	public stop(): void {
		this.resetTween();
	}

	public dispose(): void {
		this.moveBegin = null;
		this.moveStep = null;
		this.moveComplete = null;

		this._moveIncrement = null;
		this._movePoint = null;
		this._start = null;
		this._end = null;
		this._tweenAble = null;
		this.speed = NaN; 							 // 移动速度	
		this._betweenDistance = NaN; 			 // 两点之间的距离
		this._moveDistance = NaN; 			 // 已移动了的距离
	}
}

export interface ITweenAble {
	moveNext: boolean;
	endNow: boolean;
	x: number;
	z: number;
	setHorizontalPosition(x: number, z: number): void;
}
// class test implements ITweenAble{
// 	get moveNext():boolean{return false;}
// 		get uniform():boolean{return false;}

// 		get endNow():boolean{return false;}
// 		get x() : number{return 1;}

// 		set x(value : number) {}

// 		get y() : number{return 1;}

// 		set y(value : number){}
// }