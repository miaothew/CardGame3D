import { ISubject, IObserver } from "../ob/Observer";
import { E_NOTICE } from "../battle/core/GameDefine";
import { CardConfig, ConfigManager } from "../config/ConfigManager";
import { Pool } from "../utils/Pool";
import { IDProvider } from "../battle/core/util/GameUtils";
import { utils } from "../utils/Utils";

export class GameData implements ISubject {
    protected _observers: Array<IObserver> = [];

    addObserver(observer: IObserver) {
        if (this._observers.indexOf(observer) == -1) {
            this._observers.push(observer);
        }
    }

    removeObserver(observer: IObserver) {
        let index: number = this._observers.indexOf(observer);
        if (index > -1) {
            this._observers.splice(index, 1);
        }
    }

    sendNotif(cmd: number, data?: any) {
        for (let ob of this._observers) {
            ob.updateData(cmd, data);
        }
    }
    //跳转游戏页面时记录游戏成绩
    public static instance = new GameData();

    public turnId:number = 0;
    public result: number = 1;
    public myTurn:boolean = true;
    public waitFor:number;

    public stageW: number;
    public stageH: number;
    public career:number;

    /**玩家卡池（当前所拥有的所有卡id） */
    public playerCardPool:number[] = [10001,10002,10001,10002,10001,10002,10001,10002,10001,10001];

    /**玩家手牌 */
    public handCards:CardIns[];
    /**牌库 */
    public cardPile:CardIns[];
    /**已使用的牌堆 */
    public discardCards:CardIns[];
    /**销毁的牌 */
    public destroyCards:CardIns[];
    /**选中的卡牌 */
    public selectedCard:CardIns;
    public mapid:number = 1;

    public _gameOver:boolean = false;

    _hp:number = 100;//生命: number
    _mp:number = 3;//内力: number
    _gold:number = 0;
    /**
     * 0:开始
     * 1：执行中
     * 2：执行结束
     */
    oppState:number = 0;
    oppQueue:any[];

    public rewards;

    public gameOver():void{
        this._gameOver = true;
        // this.sendNotif(E_NOTICE.GAME_OVER);
    }

    public win():void{
        this.rewards = {cards:[10001,10002,10003],gold:100};
        this.sendNotif(E_NOTICE.LEVEL_COMPLETE,this.rewards);
    }

    public getReward(cardid):void{
        this.playerCardPool.push(cardid);
    }

    public clearCardArray(arr:CardIns[]):void{
        while(arr.length > 0){
            let card = arr.pop();
            card.returnToPool()
        }
    }

    /**
     * 准备卡组
     */
    public prepareCardPile():void{
        //打乱我的牌并放入发牌堆
        if(!this.cardPile){
            this.cardPile = [];
        }
        if(!this.handCards){
            this.handCards = [];
        }
        if(!this.discardCards){
            this.discardCards = [];
        }
        if(!this.destroyCards){
            this.destroyCards = [];
        }
        let mycards = utils.shuffleClone(this.playerCardPool);
        for (let index = 0; index < mycards.length; index++) {
            const element = mycards[index];
            let card = CardIns.create();
            card.config = ConfigManager.Instance.card[element];
            this.cardPile.push(card);
        }
    }

    /**
     * 发牌，从发牌堆里抽5张牌，如果发牌堆里的牌不足，则把弃牌堆（discardCards）里的牌重新洗入发牌堆
     */
    public drawCards():void{
        let handCardMax = 5;
        let hand = this.handCards;
        let pile = this.cardPile;
        let discard = this.discardCards;
        while(hand.length < handCardMax){
            if(pile.length == 0 && discard.length > 0){
                utils.shuffleClone(discard,pile);
                discard.length = 0;
            }
            if(pile.length > 0){
                hand.push(pile.pop());
            }
            else{
                break;
            }
        }
    }
    /**
     * 回合结束弃掉所有手牌进入弃牌堆discardCards
     */
    public dropCards():void{
        while(this.handCards.length > 0){
            this.discardCards.push(this.handCards.pop());
        }
        this.sendNotif(E_NOTICE.HAND_CARD_UPDATE);
    }

    public set mp(value:number){
        this._mp = value;
        this.sendNotif(E_NOTICE.MP_UPDATE,value);
    }
    public get mp():number{
        return this._mp;
    }

    public set hp(value:number){
        this._hp = value;
        this.sendNotif(E_NOTICE.HP_UPDATE,value);
    }
    public get hp():number{
        return this._hp;
    }

    public set gold(value:number){
        this._gold = value;
        this.sendNotif(E_NOTICE.GOLD_UPDATE,value);
    }
    public get gold():number{
        return this._gold;
    }

    public addHandCard(card):void{
        this.handCards.push(card);
    }

    public useHandCard(id:number):void{
        for (let index = 0; index < this.handCards.length; index++) {
            const element = this.handCards[index];
            if(element.id == id){
                this.handCards.splice(index,1);
                this.discardCards.push(element);
                break;
            }
        }
        if(id == this.selectedCard.id){
            this.selectedCard = null;
        }
        this.sendNotif(E_NOTICE.HAND_CARD_REMOVED,id);
    }

    public clearLevel():void{
        if(this.cardPile){
            this.clearCardArray(this.cardPile);
        }
        if(this.handCards){
            this.clearCardArray(this.handCards);
        }
        if(this.discardCards){
            this.clearCardArray(this.discardCards);
        }
        if(this.destroyCards){
            this.clearCardArray(this.destroyCards);
        }
        this.sendNotif(E_NOTICE.HAND_CARD_UPDATE);
    }

    public resetGame():void{
        this.hp = 100;
        this.mp = 3;
        this.gold = 0;
        this._gameOver = false;
        this.playerCardPool = [10001,10002,10001,10002,10001,10002,10001,10002,10001,10001];
    }
}

export class CardIns{
    private static pool:Pool<CardIns> = new Pool<CardIns>(CardIns); 
    public static create():CardIns{
        let card = this.pool.pop();
        card.id = IDProvider.getCardInsID();
        card.level = 1;
        return card;
    }

    public returnToPool():void{
        CardIns.pool.push(this);
    }

    config:CardConfig;
    id:number;
    level:number = 1;
}
