/**
* name 
*/

export const enum EntityType {
	//回城点
	HOME = 1,
	//地图传送点
	TRANSFER,
	// 掉落
	DROP,
	// 怪物
	MONSTER,
	// Npc
	NPC,
	//玩家
	PLAYER,
	//宝宝心好累
	MINION,
	//英雄
	HERO
}
export const enum GroupType {
	SELF = 1,		//自己的组
	ENEMY = 2
}

export class GameDefine {
	static readonly MAP_GRID_WIDTH: number = 72;
	static readonly MAP_GRID_HEIGHT: number = 48;
	static readonly Effect_Wait_Time: number = 200;
}

export const enum ActionType {
	Idle = 1,
	Walk,
	Run,
	Attack,
	Attack2,
	Die = 10,
}

export class DirectionType {
	public static readonly UP: number = 4;
	public static readonly RIGHT_UP: number = 3;
	public static readonly RIGHT: number = 2;
	public static readonly RIGHT_DOWN: number = 1;
	public static readonly DOWN: number = 0;
	public static readonly LEFT_DOWN: number = 7;
	public static readonly LEFT: number = 6;
	public static readonly LEFT_UP: number = 5;
	public static readonly NONE: number = 0;

	public static readonly EIGHT_MIRROR_DIRS: number[] = [0, 1, 2, 3, 4, 3, 2, 1];
	public static readonly EIGHT_FROM_TWO_DIRS: number[] = [1, 1, 1, 3, 3, 3, 1, 1];


	/**
	  * 四方向数组
	  */
	public static readonly FOUR_DIRS: number[] = [0, 2, 4, 6];
	/**
	  * 八方向数组
	  */
	public static readonly EIGHT_DIRS: number[] = [0, 1, 2, 3, 4, 5, 6, 7];
}

/**模型id */
export const enum E_MODEL_Id {
	Female_Body = 9002,
	Male_Body = 9001,
	Male_Hand = 6085,
	Female_Hand = 6086,
	Female_Hair_Career_1 = 3000,
	Female_Hair_Career_2 = 3001,
	Female_Hair_Career_3 = 3002,
	Male_Hair_Career_1 = 3003,
	Male_Hair_Career_2 = 3004,
	Male_Hair_Career_3 = 3005,
}


export const enum E_HURT_PLUS {
	CRITICAL = 1,           //暴击
	DETERRENCE = 2,         //威慑
	LIANJI = 3,               //连击
	SHEN_LI = 4,            //神力戒指
	SHEN_TI = 5,            //神体
	FU_HUO = 6,             //复活
	MA_BI = 7,              //麻痹戒指
	POISON = 8,             //毒戒指
	RECOVERY = 9,            //回血
	SUCK = 10,           //吸血
	REOUND = 11,            //反弹
}

export const enum E_NOTICE{
	BATTLE_STATE_CHANGE,//回合状态改变
	MP_UPDATE,//mp更新
	HP_UPDATE,//mp更新
	GOLD_UPDATE,//gold更新
	HAND_CARD_REMOVED,//手牌更新
	HAND_CARD_ADD,//手牌更新
	HAND_CARD_UPDATE,//所有手牌更新
	LOG,//控制台输出
	GAME_OVER,
	LEVEL_COMPLETE,//关卡胜利
	
}

//当前对象状态
export const enum E_Entity_TurnState {
	WAIT,//等待
	ACTION,//行动
	END//行动结束
}

//1敌人2自己
export const enum E_Skill_TargetType{
	ENEMY = 1,
	SELF = 2
}
//1通用伤害技能 2抗击火环 3野蛮冲撞 4幽灵术 5施毒 6 召唤月灵
export const enum E_Skill_Type {
	NORMAL = 1,         //普通伤害技
	MAGIC = 2,         //法术
}


export const enum E_Buff_Tpye {
	/**护甲 */
	ARMOR = 1,
}

export const enum E_Buff_Trigger {
	/**即时触发，比如获得护甲 */
	Immediate,
	/**回合开始触发 */
	TurnEnd,
	/**回合结束触发 */
	TurnBegin
}