import { ui } from "../ui/layaMaxUI";
import { GameData, CardIns } from "../data/GameData";
import { E_NOTICE } from "../battle/core/GameDefine";
import { FilterUtil } from "../utils/FilterUtil";
import { ConfigManager } from "../config/ConfigManager";

export class WinDialog extends ui.ui.WinDialogSkinUI{
    private _cards:CardIns[];
    onAwake(){
        let rewards = GameData.instance.rewards;
        if(this._cards){
            GameData.instance.clearCardArray(this._cards);
        }else
            this._cards = [];
        for (let index = 0; index < rewards.card.length; index++) {
            const cid = rewards[index];
            let card = CardIns.create();
            card.config = ConfigManager.Instance.card[cid];
            this._cards.push(card);
        }
        let list = this.list_card;
        list.itemRender = ui.ui.CardRenderSkinUI;
        // 使用但隐藏滚动条
        list.hScrollBarSkin = "";
        list.selectEnable = true;
        list.selectHandler = new Laya.Handler(this, this.onSelect);
        list.renderHandler = new Laya.Handler(this, this.updateItem);
        list.array = this._cards;
        this.btn_ok.on(Laya.Event.CLICK,this,this.clickHandler);
    }

    private updateItem(cell: ui.ui.CardRenderSkinUI, index: number): void {
        let card = this.list_card.array[index];
        if(card){
            cell.txt_desc.text = card.config.desc;
            cell.txt_name.text = card.config.name;
            cell.txt_mp.text = card.config.mp;
            if (index == this.list_card.selectedIndex) {
                cell.filters = [FilterUtil.FILTER_GREEN()];
            } else {
                cell.filters = null;
            }
            cell.visible = true;
        }else{
            cell.visible = false;
        }
    }

    private onSelect(index:number):void{
        this.list_card.refresh();
    }

    private clickHandler(e:Laya.Event):void{
        if(this.list_card.selectedIndex >= 0 && this._cards[this.list_card.selectedIndex]){
            GameData.instance.getReward(this._cards[this.list_card.selectedIndex].config.id);
        }else{
            //放弃卡牌
        }
        this.close();
    }

    onDestroy(){
        GameData.instance.clearCardArray(this._cards);
        this.btn_ok.off(Laya.Event.CLICK,this,this.clickHandler);
    }

}