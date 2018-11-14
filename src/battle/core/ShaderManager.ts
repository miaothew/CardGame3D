import { CustomShader } from "./shader/CustomShader";

/*
* name;
*/

export class ShaderManager {
    constructor() {

    }
    public static Instance: ShaderManager;

    public static createInstance(): void {
        this.Instance = new ShaderManager();
    }

    public initShaders(): void {
        CustomShader.initShader();
    }
   
}
