/**This class is automatically generated by LayaAirIDE, please do not make any modifications. */
import View=Laya.View;
import Dialog=Laya.Dialog;
import Scene=Laya.Scene;
export module ui.test {
    export class BattleSceneUI extends Scene {
        public static  uiView:any ={"type":"Scene","props":{"width":1136,"runtime":"script/BattleScene.ts","height":640},"compId":1,"loadList":[],"loadList3D":[]};
        constructor(){ super()}
        createChildren():void {
            super.createChildren();
            this.createView(BattleSceneUI.uiView);
        }
    }
    export class TestSceneUI extends Scene {
		public btn_1:Laya.Button;
        public static  uiView:any ={"type":"Scene","props":{"width":1136,"runtime":"script/GameUI.ts","positionVariance_0":100,"maxPartices":100,"height":640},"compId":1,"child":[{"type":"Button","props":{"width":200,"var":"btn_1","top":200,"skin":"comp/button.png","labelSize":20,"label":"按钮","height":60,"centerX":0},"compId":20}],"loadList":["comp/button.png"],"loadList3D":[],"components":[]};
        constructor(){ super()}
        createChildren():void {
            super.createChildren();
            this.createView(TestSceneUI.uiView);
        }
    }
}
export module ui.ui {
    export class BattleUISkinUI extends View {
		public txt_mp:Laya.Label;
		public group_othertime:Laya.Sprite;
		public txt_level:Laya.Label;
		public group_button:Laya.Sprite;
		public btn_send:Laya.Sprite;
		public btn_end:Laya.Sprite;
		public group_mytime:Laya.Sprite;
		public txt_battleState:Laya.Label;
		public list_my:Laya.List;
		public txt_console:Laya.TextArea;
		public txt_pile:Laya.Label;
		public txt_discard:Laya.Label;
		public txt_destroy:Laya.Label;
        public static  uiView:any ={"type":"View","props":{"width":1136,"runtime":"script/BattleUI.ts","height":640},"compId":1,"child":[{"type":"Label","props":{"y":524,"x":76,"var":"txt_mp","text":"label","styleSkin":"comp/label.png","fontSize":20,"color":"#ffffff"},"compId":6},{"type":"Label","props":{"y":524,"x":20.6279296875,"text":"水晶","styleSkin":"comp/label.png","fontSize":20,"color":"#ffffff"},"compId":7},{"type":"Sprite","props":{"y":14,"x":18.8837890625,"var":"group_othertime"},"compId":10,"child":[{"type":"Sprite","props":{"x":-0.8837890625,"width":255,"texture":"common/recovery_fontBg0.png","height":46},"compId":8},{"type":"Label","props":{"y":13,"x":85.1162109375,"var":"txt_level","text":"出牌阶段","styleSkin":"comp/label.png","fontSize":20,"color":"#ffffff"},"compId":9}],"components":[]},{"type":"Sprite","props":{"y":544,"x":722,"var":"group_button"},"compId":16,"child":[{"type":"Sprite","props":{"y":30,"x":79,"var":"btn_send","texture":"common/commonbutton13_1.png","pivotY":30,"pivotX":79},"compId":12,"child":[{"type":"Script","props":{"runtime":"script/ImageBtn.ts"},"compId":20}],"components":[]},{"type":"Label","props":{"y":17,"x":56,"text":"测试","styleSkin":"comp/label.png","mouseEnabled":false,"fontSize":20,"color":"#ffffff"},"compId":13},{"type":"Sprite","props":{"y":30,"x":283,"var":"btn_end","texture":"common/commonbutton13_1.png","pivotY":30,"pivotX":79},"compId":14,"child":[{"type":"Script","props":{"runtime":"script/ImageBtn.ts"},"compId":21}],"components":[]},{"type":"Label","props":{"y":17,"x":243,"text":"结束回合","styleSkin":"comp/label.png","mouseEnabled":false,"fontSize":20,"color":"#ffffff"},"compId":15}],"components":[]},{"type":"Sprite","props":{"y":472,"x":858,"var":"group_mytime"},"compId":17,"child":[{"type":"Sprite","props":{"x":-0.8837890625,"width":255,"texture":"common/recovery_fontBg0.png","height":46},"compId":18},{"type":"Label","props":{"y":13,"x":85.1162109375,"var":"txt_battleState","text":"出牌阶段","styleSkin":"comp/label.png","fontSize":20,"color":"#ffffff"},"compId":19}],"components":[]},{"type":"List","props":{"y":471,"x":169,"width":531,"var":"list_my","repeatY":1,"height":153},"compId":22},{"type":"TextArea","props":{"y":60,"x":20.6279296875,"width":181,"var":"txt_console","vScrollBarSkin":"comp/vscroll.png","text":"console","skin":"comp/textarea.png","height":115,"fontSize":16,"editable":false},"compId":23},{"type":"Label","props":{"y":564,"x":86,"var":"txt_pile","text":"label","styleSkin":"comp/label.png","fontSize":20,"color":"#ffffff"},"compId":24},{"type":"Label","props":{"y":565,"x":20,"text":"发牌堆","styleSkin":"comp/label.png","fontSize":20,"color":"#ffffff"},"compId":25},{"type":"Label","props":{"y":586,"x":86,"var":"txt_discard","text":"label","styleSkin":"comp/label.png","fontSize":20,"color":"#ffffff"},"compId":26},{"type":"Label","props":{"y":586,"x":20,"text":"出牌堆","styleSkin":"comp/label.png","fontSize":20,"color":"#ffffff"},"compId":27},{"type":"Label","props":{"y":607,"x":86,"var":"txt_destroy","text":"label","styleSkin":"comp/label.png","fontSize":20,"color":"#ffffff"},"compId":28},{"type":"Label","props":{"y":607,"x":19,"text":"垃圾堆","styleSkin":"comp/label.png","fontSize":20,"color":"#ffffff"},"compId":29}],"loadList":["comp/label.png","common/recovery_fontBg0.png","common/commonbutton13_1.png","comp/vscroll.png","comp/textarea.png"],"loadList3D":[],"components":[]};
        constructor(){ super()}
        createChildren():void {
            super.createChildren();
            this.createView(BattleUISkinUI.uiView);
        }
    }
    export class CardRenderSkinUI extends View {
		public txt_name:Laya.Label;
		public txt_desc:Laya.Label;
		public txt_mp:Laya.Label;
        public static  uiView:any ={"type":"View","props":{"width":104,"height":143},"compId":1,"child":[{"type":"Image","props":{"y":16,"x":0,"width":104,"skin":"common/bg_render.png","sizeGrid":"7,7,7,7","height":143},"compId":3},{"type":"Label","props":{"y":24,"x":1,"width":98,"var":"txt_name","text":"卡牌名","strokeColor":"#000000","stroke":1,"height":17,"color":"#ffffff","bold":true,"align":"center"},"compId":4},{"type":"Label","props":{"y":93,"x":2,"wordWrap":true,"width":98,"var":"txt_desc","valign":"middle","text":"卡牌描述卡牌描述卡牌描述卡牌描述卡牌描述卡牌描述卡牌描述卡牌描述","strokeColor":"#000000","stroke":1,"leading":2,"height":64,"color":"#ffffff","align":"left"},"compId":5},{"type":"Label","props":{"y":71.5,"x":3,"width":98,"var":"txt_mp","text":"卡牌名","strokeColor":"#000000","stroke":1,"height":17,"color":"#ffffff","bold":true,"align":"center"},"compId":7}],"loadList":["common/bg_render.png"],"loadList3D":[],"components":[]};
        constructor(){ super()}
        createChildren():void {
            super.createChildren();
            this.createView(CardRenderSkinUI.uiView);
        }
    }
    export class GameOverDialogSkinUI extends Dialog {
		public btn_go:Laya.Image;
        public static  uiView:any ={"type":"Dialog","props":{"width":500,"height":300},"compId":1,"child":[{"type":"Image","props":{"y":0,"x":10,"width":480,"skin":"common/tuozhanjiemian2.png","sizeGrid":"60,30,40,30","height":301},"compId":8},{"type":"Label","props":{"y":130,"x":140,"text":"gg了，从头再来吧！菜鸡！","styleSkin":"comp/label.png","fontSize":20,"color":"#ffffff"},"compId":10},{"type":"Image","props":{"y":237,"x":250,"var":"btn_go","skin":"common/commonbutton11.png","pivotY":26,"pivotX":54},"compId":11,"child":[{"type":"Script","props":{"runtime":"script/ImageBtn.ts"},"compId":14}],"components":[]},{"type":"Label","props":{"y":223,"x":230,"text":"取消","styleSkin":"comp/label.png","mouseThrough":false,"mouseEnabled":false,"fontSize":20,"color":"#ffffff"},"compId":12}],"loadList":["common/tuozhanjiemian2.png","comp/label.png","common/commonbutton11.png"],"loadList3D":[],"components":[]};
        constructor(){ super()}
        createChildren():void {
            super.createChildren();
            this.createView(GameOverDialogSkinUI.uiView);
        }
    }
    export class HelpViewSkinUI extends View {
        public static  uiView:any ={"type":"View","props":{"width":500,"height":500},"compId":1,"child":[{"type":"Label","props":{"y":174,"x":208,"text":"帮助","styleSkin":"comp/label.png","fontSize":20,"color":"#ffffff"},"compId":2}],"loadList":["comp/label.png"],"loadList3D":[],"components":[]};
        constructor(){ super()}
        createChildren():void {
            super.createChildren();
            this.createView(HelpViewSkinUI.uiView);
        }
    }
    export class SelectHeroSceneUI extends Scene {
		public hero3:Laya.Sprite;
		public hero2:Laya.Sprite;
		public hero1:Laya.Sprite;
		public hero4:Laya.Sprite;
        public static  uiView:any ={"type":"Scene","props":{"width":1136,"runtime":"script/SelectHeroUI.ts","height":640},"compId":1,"child":[{"type":"Sprite","props":{"y":449,"x":549,"width":292,"var":"hero3","texture":"img/choose1.png","pivotY":121,"pivotX":145,"height":246},"compId":2,"child":[{"type":"Script","props":{"runtime":"script/ImageBtn.ts"},"compId":12}],"components":[]},{"type":"Sprite","props":{"y":176,"x":545,"width":296,"var":"hero2","texture":"img/choose2.png","pivotY":155,"pivotX":147,"height":307},"compId":3,"child":[{"type":"Script","props":{"runtime":"script/ImageBtn.ts"},"compId":9}],"components":[]},{"type":"Sprite","props":{"y":294.5,"x":173,"width":289,"var":"hero1","texture":"img/choose4.png","pivotY":189,"pivotX":144,"height":377},"compId":4,"child":[{"type":"Script","props":{"runtime":"script/ImageBtn.ts"},"compId":10}],"components":[]},{"type":"Sprite","props":{"y":293,"x":926,"width":314,"var":"hero4","texture":"img/choose3.png","pivotY":200,"pivotX":157,"height":402},"compId":5,"child":[{"type":"Script","props":{"runtime":"script/ImageBtn.ts"},"compId":11}],"components":[]}],"loadList":["img/choose1.png","img/choose2.png","img/choose4.png","img/choose3.png"],"loadList3D":[],"components":[]};
        constructor(){ super()}
        createChildren():void {
            super.createChildren();
            this.createView(SelectHeroSceneUI.uiView);
        }
    }
    export class WinDialogSkinUI extends Dialog {
		public list_card:Laya.List;
		public btn_ok:Laya.Image;
		public btn_cancel:Laya.Image;
        public static  uiView:any ={"type":"Dialog","props":{"width":500,"height":300},"compId":1,"child":[{"type":"Image","props":{"y":10,"x":10,"width":480,"skin":"common/tuozhanjiemian2.png","sizeGrid":"60,30,40,30","height":363},"compId":2},{"type":"Label","props":{"y":31,"x":234.9951171875,"text":"win","styleSkin":"comp/label.png","fontSize":20,"color":"#ffffff"},"compId":3},{"type":"List","props":{"y":121,"x":43.5,"width":413,"var":"list_card","repeatY":1,"height":153},"compId":4},{"type":"Image","props":{"y":314,"x":180,"var":"btn_ok","skin":"common/commonbutton11.png","pivotY":26,"pivotX":54},"compId":5,"child":[{"type":"Script","props":{"runtime":"script/ImageBtn.ts"},"compId":9}],"components":[]},{"type":"Label","props":{"y":300,"x":160,"text":"确定","styleSkin":"comp/label.png","mouseThrough":false,"mouseEnabled":false,"fontSize":20,"color":"#ffffff"},"compId":6},{"type":"Image","props":{"y":314,"x":330,"var":"btn_cancel","skin":"common/commonbutton11.png","pivotY":26,"pivotX":54},"compId":7,"child":[{"type":"Script","props":{"runtime":"script/ImageBtn.ts"},"compId":10}],"components":[]},{"type":"Label","props":{"y":300,"x":310,"text":"取消","styleSkin":"comp/label.png","mouseThrough":false,"mouseEnabled":false,"fontSize":20,"color":"#ffffff"},"compId":8}],"loadList":["common/tuozhanjiemian2.png","comp/label.png","common/commonbutton11.png"],"loadList3D":[],"components":[]};
        constructor(){ super()}
        createChildren():void {
            super.createChildren();
            this.createView(WinDialogSkinUI.uiView);
        }
    }
}