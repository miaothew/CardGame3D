/*
* name;
*/
export class CustomMaterial extends Laya.BlinnPhongMaterial {
    public static MARGINALCOLOR:number = 24;
    public static INNER_GLOW:number;
    public static shaderDefines2:laya.d3.shader.ShaderDefines;
    public static init():void{
        this.shaderDefines2 = new laya.d3.shader.ShaderDefines(this.shaderDefines);
        this.INNER_GLOW = this.shaderDefines2.registerDefine("INNER_GLOW");
    }
    constructor() {
        super();
    }

    /**
     * 获取纹理平铺和偏移。
     * @param value 纹理平铺和偏移。
     */
    public set marginalColor(value: Laya.Vector3) {
        if (value) {
            this._defineDatas.add(CustomMaterial.INNER_GLOW);
        } else {
            this._defineDatas.remove(CustomMaterial.INNER_GLOW);
        }
        this._shaderValues.setVector(CustomMaterial.MARGINALCOLOR,value);
    }

    public get marginalColor():Laya.Vector3{
        return this._shaderValues.getVector(CustomMaterial.MARGINALCOLOR) as Laya.Vector3;
    }


    setShaderName(name: string): void {
        super.setShaderName("customShader");
    }
    
}