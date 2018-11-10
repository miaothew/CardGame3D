/*
* name;
*/

export class CameraManager {
    public static Instance: CameraManager = new CameraManager();
    public static createInstance(): void {
        this.Instance = new CameraManager();
    }

    constructor() {

    }
    public mainCamera: Laya.Camera;
    public move: number;
    /**绕y轴角度 */
    public curHor: number = 0;
    /**绕x轴角度 */
    public curVer: number = 45;
    /**距离 */
    public curDistance: number = 20;
    /**
     * 上下左右  1234
     * @param forward 
     */
    public moveCamera(forward: number): void {
        this.move = forward;
    }

}
