/**This class is automatically generated by LayaAirIDE, please do not make any modifications. */
import BattleScene from "./script/BattleScene"
import GameUI from "./script/GameUI"
import BattleUI from "./script/BattleUI"
import ImageBtn from "./script/ImageBtn"
import SelectHeroUI from "./script/SelectHeroUI"
/*
* 游戏初始化配置;
*/
export default class GameConfig{
    static width:number=1136;
    static height:number=640;
    static scaleMode:string="fixedheight";
    static screenMode:string="horizontal";
    static alignV:string="middle";
    static alignH:string="center";
    static startScene:any="test/TestScene.scene";
    static sceneRoot:string="";
    static debug:boolean=false;
    static stat:boolean=true;
    static physicsDebug:boolean=false;
    static exportSceneToJson:boolean=true;
    constructor(){}
    static init(){
        var reg: Function = Laya.ClassUtils.regClass;
        reg("script/BattleScene.ts",BattleScene);
        reg("script/GameUI.ts",GameUI);
        reg("script/BattleUI.ts",BattleUI);
        reg("script/ImageBtn.ts",ImageBtn);
        reg("script/SelectHeroUI.ts",SelectHeroUI);
    }
}
GameConfig.init();