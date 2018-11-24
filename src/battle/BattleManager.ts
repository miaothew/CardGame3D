import { SceneManager } from "./core/SceneManager";
import { EffectManager } from "./core/effect/EffectManager";
import { GameTime } from "../data/GameTime";
import { IUpdateable, GameUtils, DirectionUtil, IDProvider } from "./core/util/GameUtils";
import { EntityManager } from "./core/entity/EntityManager";
import { ActionType, E_NOTICE, E_Entity_TurnState } from "./core/GameDefine";
import { BattleStateManager, BattleStateType } from "./battleState/BattleStateManager";
import { SkillManager } from "./core/SkillManager";
import { Player } from "./core/entity/Player";
import { EntityFreeFsm } from "./core/fsm/EntityFreeFsm";
import { AIManager, AIType } from "./core/entity/ai/AIManager";
import { CameraManager } from "./core/CameraManager";
import { GameData } from "../data/GameData";
import { SkillHurt } from "./core/skill/SkillBase";
import { FsmState } from "./core/fsm/EntityFsm";
import { EntitySkillFsm } from "./core/fsm/EntitySkillFsm";
import { Monster } from "./core/entity/Monster";
import { ConfigManager } from "../config/ConfigManager";


export class BattleManager {

    public static Instance: BattleManager = new BattleManager();
    private _renders: Array<IUpdateable> = [];
    private _gameTime: GameTime;
    public state: BattleStateManager;
    public skill: SkillManager;
    public gameData:GameData;
    private _init:boolean = false;
    public battleing:boolean = false;
    constructor() {

    }

    public init(root: Laya.Sprite): void {
        if(!this._init){
            GameTime.createInstance();
            this._gameTime = GameTime.Instance;
            this._gameTime.totalGameTime = 0;
            this._gameTime.startTime = Date.now();
            SceneManager.createInstance();
            EffectManager.createInstance();
            Laya.timer.frameLoop(1, this, this.enterFrame);
            this.state = new BattleStateManager();
            this.state.init();
            this.skill = SkillManager.Instance;
            this.gameData = GameData.instance;
            SceneManager.Instance.init(root);
            Laya.stage.on(Laya.UIEvent.RESIZE, this, this.resizeHandler);
            this._init = true;
        }
        GameData.instance.turnId = 0;
        SceneManager.Instance.enter();
    }

    public nextLevel():void{
        GameData.instance.turnId = 0;
        SceneManager.Instance.enter();
    }

    private resizeHandler(e: Laya.UIEvent): void {
        EntityManager.Instance.resize();
    }

    private enterFrame(): void {
        let timer = this._gameTime;
        timer.update();
        if(this.battleing){
            this.skill.updateTime(timer);
            this.state.updateTime(timer);
            SceneManager.Instance.updateTime();
            EntityManager.Instance.update(timer);
            EffectManager.Instance.updateTime(timer);
        }
        for (let update of this._renders) {
            if (update.enabled)
                update.updateTime(timer);
        }
    }


    public addUpdate(update: IUpdateable): void {
        if (this._renders.indexOf(update) == -1)
            this._renders.push(update);
    }

    public removeUpdate(update: IUpdateable): void {
        let index: number = this._renders.indexOf(update);
        if (index > -1) {
            this._renders.splice(index, 1);
        }
    }

    public addPlayer(): void {
		let player: Player = EntityManager.Instance.createPlayer();
		player.a_bornX = player.gridX = -20.7;
		player.a_bornZ = player.gridY = 22.7;
		player.x = -20.7;
		player.y = 0;
		player.z = 22.7;
		player.a_name = "测试玩家";
		EntityManager.Instance.firstPlayer = player;
		player.changeFSMState(EntityFreeFsm.Instance);
		player._entityAI = AIManager.Instance.getAI(AIType.PLAYER);
		player.a_weaponModel = 20001;
		player.a_clothModel = 1;
		player.a_maxHp = player.a_truehp = player.a_delayhp = GameData.instance.hp;
		player.createComponents();
		player.addToView();
		player.checkInfoInview();
		player.model3D.transform.rotate(new Laya.Vector3(0,-90,0));
		CameraManager.Instance.mainCamera.transform.position = new Laya.Vector3(player.x, player.y + 18, player.z - 12);
		CameraManager.Instance.mainCamera.transform.lookAt(player.model3D.transform.position, GameUtils.Vector3UpTemp);
		CameraManager.Instance.mainCamera.transform.translate(new Laya.Vector3(3,0,0));
        player._entityInfo.updatePos(player.model3D.transform.position);
        
    }
    
    public startGame():void{
        let enemys:any[] = [
            {id:IDProvider.getEntityInsID(),mid:40001},
            {id:IDProvider.getEntityInsID(),mid:40002},
            {id:IDProvider.getEntityInsID(),mid:40003},
            {id:IDProvider.getEntityInsID(),mid:40004},
            {id:IDProvider.getEntityInsID(),mid:40005}
        ];
        this.addPlayer();
        this.addEnemys(enemys);
        GameData.instance.oppQueue = enemys;
        this.battleing = true;
        this.state.changeGameState(BattleStateType.READY);
    }

	public addEnemys(enemys): void {
        let enemyPos:number[][][] = [
            [	
                [0,0]
            ],[	
                [0,-1],[0,1]
            ],[	
                [0,0],[1,-1],[1,1]
            ],[	
                [0,-1],[0,1],[1,2],[1,-2]
            ],[	
                [0,0],[0,-2],[0,2],[1,-1],[1,1]
            ]
        ];
		let poss = enemyPos[enemys.length - 1];
		for (let index = 0; index < poss.length; index++) {
			const element = poss[index];
            let player: Monster = EntityManager.Instance.createEnemy(enemys[index].id);
            player.config = ConfigManager.Instance.monster[enemys[index].mid];
            player.mid = enemys[index].mid;
			player.a_bornX = player.gridX = -26.7 - element[0];
			player.a_bornZ = player.gridY = 22.7 - element[1];
			player.x = -26.7 - element[0];
			player.y = 0;
			player.z = 22.7 - element[1];
			player.a_name = player.config.name;
			player.changeFSMState(EntityFreeFsm.Instance);
			player._entityAI = AIManager.Instance.getAI(AIType.MONSTER);
			player.a_weaponModel = 20001;
			player.a_clothModel = 101 + Math.floor(Math.random() * 19);
			player.a_maxHp = player.a_truehp = player.a_delayhp = 12;
			player.createComponents();
			player.addToView();
			player.checkInfoInview();
            player.model3D.transform.rotate(new Laya.Vector3(0,90,0));
            player.model3D.transform.scale = new Laya.Vector3(0.7,0.7,0.7);
			player._entityInfo.updatePos(player.model3D.transform.position);
		}
		
    }

    public useCard(target): void {
        let gData = GameData.instance;
        if(gData.selectedCard && target){
            //进行技能释放
            if(gData.mp < gData.selectedCard.config.mp){
                gData.sendNotif(E_NOTICE.LOG,"法力不足");
                return;
            }
            let card = GameData.instance.selectedCard;
            let entity = EntityManager.Instance.firstPlayer;
            let result = entity.entityAI.doSkill(entity,target,card.config.skill,card.level);
            if(result){
                gData.mp -= card.config.mp;
                GameData.instance.useHandCard(card.id);
            }
        }
    }

    public startTurn():void{
        if(this.gameData.myTurn){
            this.state.changeGameState(BattleStateType.MY_TURN);
        }else{
            this.state.changeGameState(BattleStateType.OPPOSITE_TURN);
        }
    }

    public endMyTurn():void{
        //如果是我的回合，就进入回合等待
        if(this.state.curState.gameState() == BattleStateType.MY_TURN){
            this.state.changeGameState(BattleStateType.WAIT_TURN);
        }
        
    }

    public enemyStateClear():void{
        for (const iterator of GameData.instance.oppQueue) {
            if(iterator.id){
                let entity = EntityManager.Instance._enemyDic[iterator.id];
                entity.a_state = E_Entity_TurnState.WAIT;
            }
        }
    }

    public enemyAction():boolean{
        for (const iterator of GameData.instance.oppQueue) {
            if(iterator.id){
                let entity = EntityManager.Instance._enemyDic[iterator.id];
                if(entity.a_isDead){
                    continue;
                }
                if(entity.a_state == E_Entity_TurnState.WAIT){
                    entity.a_state = E_Entity_TurnState.ACTION;
                    entity.entityAI.doSomething(entity,EntityManager.Instance.firstPlayer);
                    return true;
                }else if(entity.a_state == E_Entity_TurnState.ACTION){
                    if(entity.curFsm.getState() == FsmState.FSM_STATE_FREE){//动作结束
                        entity.a_state = E_Entity_TurnState.END;
                    }else{
                        return true;
                    }
                }
            }
        }
        return false;
    }

    public checkEnemyState():void{
        let enemys = EntityManager.Instance.getAllEnemy();
        for(let key in enemys){
            let entity = enemys[key];
            if(!entity.a_isDead){
                return;
            }
        }
        //敌人全倒了
        GameData.instance.win();
        this.state.changeGameState(BattleStateType.END);
    }

    public destroyScene():void{
        GameData.instance.clearLevel();
        SkillManager.Instance.cleanSkill();
        EntityManager.Instance.destoryAllEntity();
        EffectManager.Instance.destoryAllEffect();
        SceneManager.Instance.destroyScene();
        this.battleing = false;
    }
}
