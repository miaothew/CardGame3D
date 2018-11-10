/**
* name 
*/
import { Pool } from "../../../utils/Utils";
import { LimitedPool } from "../../../utils/Utils";
import { GameTime } from "../../../data/GameTime";
import { GameDefine } from "../GameDefine";
import { GameUtils, IDProvider, IUpdateable } from "../util/GameUtils";
import { SceneManager } from "../SceneManager";
import { Entity } from "../entity/Entity";
export class EffectManager {

    public static Instance: EffectManager;
    public _effectDic: { [key: number]: NormalEffect } = {};
    private _readyToDispose: Array<NormalEffect> = [];
    private _effectPools: { [key: number]: Pool<NormalEffect> };

    public static createInstance(): void {
        this.Instance = new EffectManager();
        this.Instance.initPool();
    }

    public initPool(): void {
        this._effectPools = {};
        this._effectPools[E_Effect_Type.NORMAL] = new Pool<NormalEffect>(NormalEffect);
    }

    public getEffect(key: number): NormalEffect {
        return this._effectDic[key];
    }

    public createEffect(type: E_Effect_Type): NormalEffect {
        let pool: Pool<NormalEffect> = this._effectPools[type];
        if (pool) {
            let effect: NormalEffect = pool.pop();
            effect.type = type;
            effect.id = IDProvider.getEffectInsID();
            return effect;
        }
        return null;
    }

    public returnEffect(effect: NormalEffect): void {
        let pool: Pool<NormalEffect> = this._effectPools[effect.type];
        if (pool) {
            pool.push(effect);
        }
    }

    public addEffect(id: number, x: number, y: number, z: number, startTime: number, rotation: Laya.Quaternion = null, endTime: number = 0): void {
        let effect: NormalEffect = this.createEffect(E_Effect_Type.NORMAL);
        effect.init(id, SceneManager.Instance.scene, endTime, startTime);
        effect.setPosition(x, y, z);
        if (rotation) {
            effect.rotation = rotation;
        }
        this._effectDic[effect.id] = effect;
        if (startTime == 0)
            effect.start();
    }

    // public addEntityEffect()

    public destoryAllEffect(): void {
        for (let key in this._effectDic) {
            this.readyToDie(this._effectDic[key]);
        }
    }

    public updateTime(gameTime: GameTime): void {
        for (let deadEffect of this._readyToDispose) {
            delete this._effectDic[deadEffect.id];
            deadEffect.dispose();
        }
        this._readyToDispose.length = 0;
        let effect: NormalEffect;
        for (let key in this._effectDic) {
            effect = this._effectDic[key];
            effect.updateTime(gameTime);
        }
    }

    public readyToDie(effect: NormalEffect): void {
        this._readyToDispose.push(effect);
    }
}
export class EffectResConfig {
    constructor() {

    }

    //技能特效ID对应表
    static GL_MagicEffectIdConfig = {
        //战士1-5技能
        1: "res/res3D/par3D/zs_skill1.lh",
        2: "res/res3D/par3D/zs_skill2.lh",
        3: "res/res3D/par3D/zs_skill3.lh",
        4: "res/res3D/par3D/zs_skill4.lh",
        5: "res/res3D/par3D/zs_skill5.lh",
        //法师1-5技能
        6: "res/res3D/par3D/fs_skill1.lh",
        7: "res/res3D/par3D/fs_skill2.lh",
        8: "res/res3D/par3D/fs_skill3.lh",
        9: "res/res3D/par3D/fs_skill4.lh",
        10: "res/res3D/par3D/fs_skill5.lh",
        //道士1-5技能
        11: "res/res3D/par3D/gs_skill1.lh",
        12: "res/res3D/par3D/gs_skill2.lh",
        13: "res/res3D/par3D/gs_skill3.lh",
        14: "res/res3D/par3D/gs_skill4.lh",
        15: "res/res3D/par3D/gs_skill5.lh"

    };

}

export enum E_Effect_Type {
    NORMAL,
    BULLET,
    ENTITY_EFFECT,
    TREASURE,
    BUFF
}
export class NormalEffect implements IUpdateable {
    public id: number;
    public constructor() {
    }
    public enabled: boolean = false;
    private _container;
    // public config: EffectConfig;
    public animation: Laya.Sprite3D;
    private _x: number;
    private _y: number;
    private _z: number;
    private _inView: boolean = false;
    public eid: number;
    protected _loop: number;
    /**开始播放时间 */
    public startTime: number;
    public _dir: number;
    private soundid: number;
    private _rotation: Laya.Quaternion;
    protected _targetEntity: Entity;
    private _scale: number;
    public type: E_Effect_Type;
    protected offsetX: number;
    protected offsetY: number;
    protected attention: boolean;

    public init(eid: number, container, loop: number = -1, startTime: number = 0, dir?: number, sound?: number, frame?: number, scale?: number, offsetX?: number, offsetY?: number, attention?: boolean): void {
        this.eid = eid;
        // this.config = ConfigManager.Instance.effect[eid];
        this._container = container;
        this._loop = loop;
        if (scale == 0) {
            this._scale = null;
        } else {
            this._scale = scale;
        }
        this.offsetX = offsetX == null ? 0 : offsetX;
        this.offsetY = offsetY == null ? 0 : offsetY;
        this.startTime = startTime;
        //this.animation.addType(AnimationType.Effect,this.config.model,SkinConfig.getPlayer());
        this.id = IDProvider.getEffectInsID();
        this._dir = dir;
        this.soundid = sound;
        this.attention = attention;
    }

    public setTarget(target: Entity): void {
        this._targetEntity = target;
    }

    public set rotation(value: Laya.Quaternion) {
        if (!this._rotation) {
            this._rotation = new Laya.Quaternion(0, 0, 0, 0);
        }
        value.cloneTo(this._rotation)
        if (this.animation) {
            // this.animation.rotation = value;
            GameUtils.setQuaternion(this.animation, this._rotation);
        }
    }

    public setPosition(x: number, y: number, z: number): void {
        this._x = x;
        this._y = y;
        this._z = z;
        if (this.animation) {
            let pos: Laya.Vector3 = this.animation.transform.localPosition;
            pos.x = x;
            pos.y = y;
            pos.z = z;
            this.animation.transform.localPosition = pos;
        }
    }

    public addToView(): void {
        if (this.animation == null)
            this.initDisplay();
        // this.animation.addToParent(this._container);

    }

    public initDisplay(): void {
        // let sp = Laya.Sprite3D.load(EffectResConfig.GL_MagicEffectIdConfig[this.eid]);
        // if (sp && sp.loaded) {
        //     this.animation = Laya.Sprite3D.instantiate(sp);
        //     this._container.addChild(this.animation);
        //     this.initAnimation();
        // } else {
        //     this.animation = sp;
        //     this.animation.once(Laya.Event.HIERARCHY_LOADED, this, this.loadedHandler);
        // }
    }

    protected initAnimation(): void {
        if (this._rotation) {
            GameUtils.setQuaternion(this.animation, this._rotation);
        }
        this.animation.transform.scale = new Laya.Vector3(3, 3, 3);
        this.setPosition(this._x, this._y, this._z);
    }

    private loadedHandler(e: Laya.Event): void {
        this.animation = Laya.Sprite3D.instantiate(this.animation);
        this._container.addChild(this.animation);
        this.initAnimation();
    }

    public die(): void {
        this.enabled = false;
        if (this.animation) {
            // this.animation.off(Laya.Event.HIERARCHY_LOADED, this, this.loadedHandler, true);
            this.animation = null;
        }
        //放入销毁列表，场景中的物体销毁都放到下一帧
        EffectManager.Instance.readyToDie(this);
    }

    public start(): void {
        if (!this.enabled) {
            this.enabled = true;
            this.startTime = GameTime.Instance.totalGameTime;
            this.addToView();
        }
        if (this._targetEntity && this._targetEntity.enabled) {
            this.x = this._targetEntity.x + this.offsetX;
            this.y = this._targetEntity.y + this.offsetY;
        }
    }

    public set inView(value: boolean) {
        this._inView = value;
    }

    public get inView(): boolean {
        return this._inView;
    }

    set x(value: number) {
        this._x = value;
    }

    get x(): number {
        return this._x;
    }

    set y(value: number) {
        this._y = value;
    }

    get y(): number {
        return this._y;
    }

    set z(value: number) {
        this._z = value;
    }

    get z(): number {
        return this._z;
    }

    public updateTime(gameTime: GameTime): void {
        let self = this;
        if (self.enabled) {
            if (self.animation) {//下载好并在视野中播放了
                // self.animation.render(gameTime);
                if (self._targetEntity && self._targetEntity.enabled) {
                    self.x = self._targetEntity.x + self.offsetX;
                    self.y = self._targetEntity.y + self.offsetY;
                }
                if (self._loop > 0 && self.startTime + self._loop < gameTime.totalGameTime) {
                    self.die();
                }
            } else if (self._loop > 0 && self.startTime + GameDefine.Effect_Wait_Time < gameTime.totalGameTime) {//不循环的动画超时后销毁
                self.die();
            }
        } else if (self.startTime > 0 && gameTime.totalGameTime > self.startTime) {
            self.start();
        }
    }

    public dispose(): void {
        if (this.id == undefined) {
            return;
        }
        this.id = undefined;
        this.enabled = false;
        this._container = undefined;
        // this.config = undefined;
        if (this.animation) {
            // this.animation.removeFromParent();
            // this.animation.dispose();
            this.animation.destroy(true);
            this.animation = undefined;
        }
        this._x = undefined;
        this._y = undefined;
        this._inView = false;
        this.eid = undefined;
        this._loop = undefined;
        this._rotation = null;
        this._targetEntity = null;
        this.soundid = undefined;
        EffectManager.Instance.returnEffect(this);
    }
}

