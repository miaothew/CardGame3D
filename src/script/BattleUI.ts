/**
 * 本示例采用非脚本的方式实现，而使用继承页面基类，实现页面逻辑。在IDE里面设置场景的Runtime属性即可和场景进行关联
 * 相比脚本方式，继承式页面类，可以直接使用页面定义的属性（通过IDE内var属性定义），比如this.tipLbll，this.scoreLbl，具有代码提示效果
 * 建议：如果是页面级的逻辑，需要频繁访问页面内多个元素，使用继承式写法，如果是独立小模块，功能单一，建议用脚本方式实现，比如子弹脚本。
 */
import { ui } from "./../ui/layaMaxUI";
import { BattleManager } from "./../battle/BattleManager";
import { IObserver } from "../ob/Observer";
import { GameData } from "../data/GameData";
import { E_NOTICE } from "../battle/core/GameDefine";
import { BattleStateType } from "../battle/battleState/BattleStateManager";
import { FilterUtil } from "../utils/FilterUtil";
export default class BattleUI extends ui.ui.BattleUISkinUI implements IObserver {

    constructor() {
        super();
    }

    updateData(cmd: number, data: any) {
        switch (cmd) {
            case E_NOTICE.BATTLE_STATE_CHANGE:
                {
                    switch (data) {
                        case BattleStateType.READY:
                            {
                                this.log("准备开始");
                                this.txt_battleState.text = "准备开始";
                            }
                            break;
                        case BattleStateType.MY_TURN:
                            {
                                this.log("我的回合");
                                this.txt_battleState.text = "我的回合";
                                this.txt_pile.text = "" + GameData.instance.cardPile.length;
                                this.txt_discard.text = "" + GameData.instance.discardCards.length;
                                this.txt_destroy.text = "" + GameData.instance.destroyCards.length;
                                this.list_my.array = GameData.instance.handCards;
                            }
                            break;
                        case BattleStateType.OPPOSITE_TURN:
                            {
                                this.log("对方回合");
                                this.txt_battleState.text = "对方回合";
                            }
                            break;
                        case BattleStateType.TURN_END:
                            {
                                this.log("回合结束");
                                this.txt_battleState.text = "回合结束";
                            }
                            break;
                        case BattleStateType.TURN_START:
                            {
                                this.log("回合开始");
                                this.txt_battleState.text = "回合开始";
                            }
                            break;
                    }
                }
                break;
            case E_NOTICE.HAND_CARD_REMOVED: {
                // this.list_my.refresh();
                this.list_my.selectedIndex = -1;
                this.txt_discard.text = "" + GameData.instance.discardCards.length;
                this.txt_destroy.text = "" + GameData.instance.destroyCards.length;
            } break;
            case E_NOTICE.HAND_CARD_UPDATE:{
                this.list_my.refresh();
                this.txt_pile.text = "" + GameData.instance.cardPile.length;
            }
            break;
            case E_NOTICE.MP_UPDATE: {
                this.txt_mp.text = GameData.instance.mp + "";
            }
            break;
            case E_NOTICE.LOG:{
                this.log(data);
            }
            break;
            case E_NOTICE.GAME_OVER:{
                
            }
            break;
        }
    }

    log(content):void{
       this.txt_console.text += "\n" + content; 
       this.txt_console.vScrollBar.value = this.txt_console.vScrollBar.max;
    }

    onAwake() {
        let list = this.list_my;
        list.itemRender = ui.ui.CardRenderSkinUI;
        // 使用但隐藏滚动条
        list.hScrollBarSkin = "";
        list.selectEnable = true;
        list.selectHandler = new Laya.Handler(this, this.onSelect);
        list.renderHandler = new Laya.Handler(this, this.updateItem);
        this.btn_send.on(Laya.Event.CLICK, this, this.clickHandler);
        this.btn_end.on(Laya.Event.CLICK, this, this.clickHandler);
        GameData.instance.addObserver(this);

    }

    private updateItem(cell: ui.ui.CardRenderSkinUI, index: number): void {
        let card = GameData.instance.handCards[index];
        if(card){
            cell.txt_desc.text = card.config.desc;
            cell.txt_name.text = card.config.name;
            cell.txt_mp.text = card.config.mp;
            if (GameData.instance.selectedCard == card) {
                cell.filters = [FilterUtil.FILTER_GREEN()];
            } else {
                cell.filters = null;
            }
            cell.visible = true;
        }else{
            cell.visible = false;
        }
    }

    private onSelect(index: number): void {
        console.log("当前选择的索引：" + index);
        if (index >= 0) {
            GameData.instance.selectedCard = GameData.instance.handCards[index];
        }
        this.list_my.refresh();
    }

    clickHandler(e: Laya.Event) {
        if (e.currentTarget == this.btn_end) {
            BattleManager.Instance.endMyTurn();
        }else if(e.currentTarget == this.btn_send){
            BattleManager.Instance.destroyScene();
            BattleManager.Instance.init(null);
        }
    }

    onDestroy() {
        GameData.instance.removeObserver(this);
    }
}