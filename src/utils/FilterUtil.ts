export var FilterUtil = {
	/**
		 * 变灰滤镜
		 */
	FILTER_GRAY : function () {
		return new Laya.ColorFilter([0.3, 0.59, 0.11, 0, 0, 0.3, 0.59, 0.11, 0, 0, 0.3, 0.59, 0.11, 0, 0, 0, 0, 0, 1, 0]);
	},
	/**
	 * 高亮滤镜 
	 */
	FILTER_HighLight : function () {
		return new Laya.ColorFilter([
			1, 0, 0, 0, 50,
			0, 1, 0, 0, 50,
			0, 0, 1, 0, 50,
			0, 0, 0, 1, 0]);
	},

	/**
	 * 变暗滤镜  
	 */
	FILTER_AN : function () {
		return new Laya.ColorFilter([
			0.9, 0, 0, 0, 0,
			0, 0.9, 0, 0, 0,
			0, 0, 0.9, 0, 0,
			0, 0, 0, 0.9, 0]);
	},

	/**
	 * 反相滤镜 
	 */
	FILTER_RP : function () {
		return new Laya.ColorFilter([-1, 0, 0, 0, 255, 0, -1, 0, 0, 255, 0, 0, -1, 0, 255, 0, 0, 0, 1, 0]);
	},

	/**
	 * 绿色中毒滤镜 
	 */
	FILTER_GREEN : function () {
		return new Laya.ColorFilter([
			0, 0, 0, 0, 0,
			0, 1, 0, 0, 0,
			0, 0, 0, 0, 0,
			0, 0, 0, 1, 0
		]);
	},

	/**
	 * 绿色中毒滤镜 
	 */
	FILTER_RED : function () {
		return new Laya.ColorFilter([
			1, 0, 0, 0, 0,
			0, 0, 0, 0, 0,
			0, 0, 0, 0, 0,
			0, 0, 0, 1, 0
		]);
	},

	FILTER_MABI : function () {
		return new Laya.ColorFilter([
			0.3086, 0.6094, 0.0820, 0, 0,
			0.3086, 0.6094, 0.0820, 0, 0,
			0.3086, 0.6094, 0.0820, 0, 0,
			0, 0, 0, 1, 0
		]);
    }
}