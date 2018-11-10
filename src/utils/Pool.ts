export class Pool<T> {
	private pool: Array<T>;
	private max: number = 0;
	private creater: { new (): T; };

	/**
	 * @nums 初始化数目
	 */
	public constructor(c: { new (): T; }, nums: number = 10) {
		this.pool = [];
		this.creater = c;
		for (let i = 0; i < nums; i++) {
			this.pool.push(new (this.creater)());
		}
	}

	public pop(): T {
		var obj: T = this.pool.length > 0 ? this.pool.pop() : new (this.creater)();
		return obj;
	}

	public push(obj: T): void {
		this.pool.push(obj);
	}

	public has(obj: T): Boolean {
		for (let o of this.pool) {
			if (o == obj) {
				return true;
			}
		}
		return false;
	}

	public clear(): void {
		this.pool = [];
	}
}


