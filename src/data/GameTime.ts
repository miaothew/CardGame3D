export class GameTime {
	public static Instance: GameTime;

	public static createInstance(): void {
		this.Instance = new GameTime();
	}
	public constructor() {
	}
	/** 上次Update被调用以后的时间 */
	public elapsedGameTime: number = 0;

	/** 自游戏开始时到现在的游戏总时间量 */
	public totalGameTime: number = 0;
	/**
	 * 游戏开始时间戳
	 */
	public startTime: number;
	public getNow(): number {
		return Date.now() - this.startTime;
	}

	public update(): void {
		var now = Date.now() - this.startTime;
		var time = this.totalGameTime;
		this.elapsedGameTime = now - time;
		this.totalGameTime = now;
	}
}