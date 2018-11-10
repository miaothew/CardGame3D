import { DirectionType } from "../GameDefine";
import { GameTime } from "../../../data/GameTime";

export class IDProvider {
    public constructor() {
    }
    private static __entityId: number = 0;
    public static getEntityInsID(): number {
        return ++this.__entityId;
    }

    private static __effectId: number = 0;
    public static getEffectInsID(): number {
        this.__effectId++;
        return this.__effectId;
    }

    private static __skillId: number = 0;
    public static getSkillInsID(): number {
        this.__skillId++;
        return this.__skillId;
    }
    private static __cardId: number = 0;
    public static getCardInsID(): number {
        this.__cardId++;
        return this.__cardId;
    }
}

/*
* name;
*/
export class GameUtils {
    constructor() {

    }
    public static Vector3Temp = new Laya.Vector3(0, 0, 0);
    public static Vector3Temp2 = new Laya.Vector3(0, 0, 0);
    public static Vector3Temp3 = new Laya.Vector3(0, 0, 0);
    public static Vector3UpTemp = new Laya.Vector3(0, 1, 0);
    public static tempQuaternion = new Laya.Quaternion(0, 0, 0, 0);

    public static setQuaternion(sp: Laya.Sprite3D, q2: Laya.Quaternion): void {
        let q1: Laya.Quaternion = sp.transform.localRotation;
        q1.elements[0] = q2.elements[0];
        q1.elements[1] = q2.elements[1];
        q1.elements[2] = q2.elements[2];
        q1.elements[3] = q2.elements[3];
        sp.transform.localRotation = q1;
    }

    //工具函数GSToGC.Dir转Vector3
    public static ConvertDirToVector3(angle): Laya.Vector3 {
        angle = angle / 180 * Math.PI;
        return new Laya.Vector3(Math.cos(angle), 0, Math.sin(angle));
    }
}

export class Vector2Extension {
    /**
     * 转向物体 方向
     * @param start 目标点
     * @param end   旋转对象
     *
     */
    public static orientation(start: number[], end: number[]): number {
        var dx: number = end[0] - start[0];
        var dy: number = end[1] - start[1];
        var r: number = Math.atan2(dy, dx) * 180 / Math.PI;
        return r;
    }

    /**
     * 击飞效果（绝对坐标点）
     *
     */
    public static blowFlyEffects(x1: number, y1: number, x2: number, y2: number, distance: number): number[] {
        var radians: number = Math.atan((y2 - y1) / (x2 - x1));
        var degrees: number = radians * 180 / Math.PI;

        var xFlag: number = x1 > x2 ? -1 : 1;
        var yFlag: number = y1 > y2 ? -1 : 1;

        var x3: number = Math.abs(Math.cos(degrees * Math.PI / 180)) * distance * xFlag + x2;
        var y3: number = Math.abs(Math.sin(degrees * Math.PI / 180)) * distance * yFlag + y2;

        if (x1 == x2) {
            x3 = x2;
            y3 = distance * yFlag + y2;
        }

        if (y1 == y2) {
            x3 = distance * xFlag + x2;
            y3 = y2;
        }

        return [x3, y3];
    }

    /**
     * 移动增量计算（以步长折分）
     * @param startPoint 起点
     * @param endPoint   终点
     * @param stepLength 每步步长
     */
    public static moveIncrement(startPoint: number[], endPoint: number[], step: number): number[] {
        var seDistance: number = Vector2Extension.distanceOfPoint(startPoint, endPoint); 	// startPoint 到 endPoint 的距离
        var scaleStepLength: number = step / seDistance;
        var x: number = (endPoint[0] - startPoint[0]) * scaleStepLength;
        var y: number = (endPoint[1] - startPoint[1]) * scaleStepLength;

        return [x, y];
    }

    /**
     * 移动增量计算（以步长折分）
     * @param startPoint 起点
     * @param endPoint   终点
     * @param stepLength 每步步长
     */
    public static moveIncrementByPoint(movePoint: number[], startPoint: number[], endPoint: number[], step: number): void {
        var seDistance: number = Vector2Extension.distanceOfPoint(startPoint, endPoint); 	// startPoint 到 endPoint 的距离
        var scaleStepLength: number = step / seDistance;
        var x: number = (endPoint[0] - startPoint[0]) * scaleStepLength;
        var y: number = (endPoint[1] - startPoint[1]) * scaleStepLength;
        movePoint[0] = x;
        movePoint[1] = y;
    }

    /**
     * 移动A*格距离计算
     * @param startPoint 起点
     * @param endPoint   终点
     * @param stepLength 移动长度
     */
    public static moveDistance(startPoint: number[], endPoint: number[], stepLength: number): number[] {
        var seDistance: number = Vector2Extension.distanceOfPoint(startPoint, endPoint);	// startPoint 到 endPoint 的距离
        var scaleStepLength: number = stepLength / seDistance;
        var x: number = Math.floor(startPoint[0] + (endPoint[0] - startPoint[0]) * scaleStepLength);
        var y: number = Math.floor(startPoint[1] + (endPoint[1] - startPoint[1]) * scaleStepLength);
        return [x, y];
    }

    /**
     * 通过正切值获取向量朝向代号（方向代码和小键盘的数字布局一样-8：上、４：左、６：右、２：下等）
     * @param currentPoint  当前点
     * @param targetPoint   目标点
     */
    public static directionPointByTan(currentPoint: number[], targetPoint: number[]): number {
        return Vector2Extension.directionByTan(currentPoint[0], currentPoint[1], targetPoint[0], targetPoint[1]);
    }

    public static distanceOfPoint(p: number[], p2: number[]): number {
        var xx: number = p[0] - p2[0];
        var yy: number = p[1] - p2[1];
        return Math.sqrt(xx * xx + yy * yy);
    }

    /**
     * 通过正切值获取向量朝向代号（方向代码和小键盘的数字布局一样-８：上、４：左、６：右、２：下等）
     * @param targetX  目标点的X值
     * @param targetY  目标点的Y值
     * @param currentX 当前点的X值
     * @param currentY 当前点的Y值
     */
    public static directionByTan(currentX: number, currentY: number, targetX: number, targetY: number): number {
        var tan: number = (targetY - currentY) / (targetX - currentX);
        if (Math.abs(tan) >= Math.tan(Math.PI * 3 / 8) && targetY <= currentY) {
            return 8;
        }
        else if (Math.abs(tan) > Math.tan(Math.PI / 8) && Math.abs(tan) < Math.tan(Math.PI * 3 / 8) && targetX > currentX && targetY < currentY) {
            return 9;
        }
        else if (Math.abs(tan) <= Math.tan(Math.PI / 8) && targetX >= currentX) {
            return 6;
        }
        else if (Math.abs(tan) > Math.tan(Math.PI / 8) && Math.abs(tan) < Math.tan(Math.PI * 3 / 8) && targetX > currentX && targetY > currentY) {
            return 3;
        }
        else if (Math.abs(tan) >= Math.tan(Math.PI * 3 / 8) && targetY >= currentY) {
            return 2;
        }
        else if (Math.abs(tan) > Math.tan(Math.PI / 8) && Math.abs(tan) < Math.tan(Math.PI * 3 / 8) && targetX < currentX && targetY > currentY) {
            return 1;
        }
        else if (Math.abs(tan) <= Math.tan(Math.PI / 8) && targetX <= currentX) {
            return 4;
        }
        else if (Math.abs(tan) > Math.tan(Math.PI / 8) && Math.abs(tan) < Math.tan(Math.PI * 3 / 8) && targetX < currentX && targetY < currentY) {
            return 7;
        }
        else {
            return Vector2Extension.RandomExtract<number>([1, 2, 3, 4, 6, 7, 8, 9]);		// 两点为同一点时，随机返回一个方向
        }
    }

    /**
     * 从参数ary（数组）中随机返回一个 数组项
     * 例如 var array:Array = new Array(4,5,6)
     * 返回 5或者6或者4
     */
    public static RandomExtract<T>(ary: Array<T>): T {
        return (ary[Math.floor(Math.random() * ary.length)]);
    }
}

export class DirectionUtil {
    /**
     * 根据起始点跟目标点获取方向
     */
    public static getForwardByPoints(fx: number, fy: number, tox: number, toy: number): number {
        var nx: number = tox - fx;
        var ny: number = toy - fy;
        var todir: number = 0;

        var r: number = Math.sqrt(nx * nx + ny * ny);
        var cos: number = nx / r;
        var angle: number = Math.floor(Math.acos(cos) * 180 / Math.PI);
        if (ny < 0) {
            angle = 360 - angle;
        }

        if (angle > 337 || angle < 23) {
            todir = DirectionType.RIGHT;
        } else if (angle > 292) {
            todir = DirectionType.RIGHT_UP;
        } else if (angle > 247) {
            todir = DirectionType.UP;
        } else if (angle > 202) {
            todir = DirectionType.LEFT_UP;
        } else if (angle > 157) {
            todir = DirectionType.LEFT;
        } else if (angle > 112) {
            todir = DirectionType.LEFT_DOWN;
        } else if (angle > 67) {
            todir = DirectionType.DOWN;
        } else {
            todir = DirectionType.RIGHT_DOWN;
        }
        return todir;
    }

    public static getRotateByDir(dir: number): number {
        var rotate: number;
        switch (dir) {
            case DirectionType.UP: rotate = 0; break;
            case DirectionType.RIGHT_UP: rotate = 56 / 180 * Math.PI; break;
            case DirectionType.RIGHT: rotate = 90 / 180 * Math.PI; break;
            case DirectionType.RIGHT_DOWN: rotate = 124 / 180 * Math.PI; break;
            case DirectionType.DOWN: rotate = 180 / 180 * Math.PI; break;
            case DirectionType.LEFT_DOWN: rotate = 236 / 180 * Math.PI; break;
            case DirectionType.LEFT: rotate = 270 / 180 * Math.PI; break;
            case DirectionType.LEFT_UP: rotate = 304 / 180 * Math.PI; break;
        }
        return rotate;
    }

    public static getRotateByDir2(dir: number): number {
        var rotate: number;
        switch (dir) {
            case DirectionType.UP: rotate = 180; break;
            case DirectionType.RIGHT_UP: rotate = -124; break;
            case DirectionType.RIGHT: rotate = -90; break;
            case DirectionType.RIGHT_DOWN: rotate = -56; break;
            case DirectionType.DOWN: rotate = 0; break;
            case DirectionType.LEFT_DOWN: rotate = 56; break;
            case DirectionType.LEFT: rotate = 90; break;
            case DirectionType.LEFT_UP: rotate = 124; break;
        }
        return rotate;
    }

    /**
     * 根据起始点跟目标点获取方向
     */
    public static getForwardByGridXY(fx: number, fy: number, tox: number, toy: number): number {
        var todir: number = 0;
        var hor: number = tox - fx;
        var ver: number = toy - fy;
        todir = DirectionUtil.getDir(hor, ver);
        return todir;
    }

    /**
     * 根据速度确定方向
     */
    public static getDir(hor: number, ver: number): number {
        var dir: number = 0;
        if (hor > 0) {//右
            if (ver < 0)//上
                dir = DirectionType.RIGHT_UP;
            else if (ver > 0)
                dir = DirectionType.RIGHT_DOWN;
            else
                dir = DirectionType.RIGHT;
        } else if (hor < 0) {//左
            if (ver < 0)//上
                dir = DirectionType.LEFT_UP;
            else if (ver > 0)
                dir = DirectionType.LEFT_DOWN;
            else
                dir = DirectionType.LEFT;
        } else {
            if (ver < 0)
                dir = DirectionType.UP;
            else
                dir = DirectionType.DOWN;
        }
        return dir;
    }

    /**
     * 根据给出的方向获得从近到远的方向集合
     */
    public static getNearDirs(curDir: number): Array<number> {
        var i: number = 0;
        var dirs: Array<number> = DirectionType.EIGHT_DIRS;
        var result: number[] = [];
        for (var j: number = 0; j < 8; j++) {
            if (dirs[j] == curDir) {
                i = j;
                break;
            }
        }
        for (var k: number = 1; k <= 4; k++) {
            if (dirs[i + k] != null) {
                result.push(dirs[i + k]);
            } else {
                result.push(dirs[i + k - 8]);
            }
            if (k == 4) {
                break;
            }
            if (dirs[i - k] != null) {
                result.push(dirs[i - k]);
            } else {
                result.push(dirs[i - k + 8]);
            }
        }
        return result;
    }

    public static addNode(x: number, y: number, dir: number, count: number = 1): number[] {
        var p: number[] = [x, y];
        switch (dir) {
            case DirectionType.UP: p[0] = p[1] - count; break;
            case DirectionType.RIGHT_UP: p[1] = p[1] - count; p[0] = p[0] + count; break;
            case DirectionType.RIGHT: p[0] = p[0] + count; break;
            case DirectionType.RIGHT_DOWN: p[1] = p[1] + count; p[0] = p[0] + count; break;
            case DirectionType.DOWN: p[1] = p[1] + count; break;
            case DirectionType.LEFT_DOWN: p[1] = p[1] + count; p[0] = p[0] - count; break;
            case DirectionType.LEFT: p[0] = p[0] - count; break;
            case DirectionType.LEFT_UP: p[1] = p[1] - count; p[0] = p[0] - count; break;
        }
        return p;
    }

    public static addDir(dir: number, add: number): number {
        add = add % 8;
        if (add < 0) {
            add = 8 + add;
        }
        var tdir: number = dir + add;
        if (tdir > 7)
            tdir = tdir - 8;
        return tdir;
    }

    /**
     * 只获取垂直方向的方向
     */
    public static getVecDir(dir: number): number {
        switch (dir) {
            case DirectionType.UP:
            case DirectionType.RIGHT_UP:
            case DirectionType.LEFT_UP:
                return DirectionType.UP;
            case DirectionType.RIGHT_DOWN:
            case DirectionType.DOWN:
            case DirectionType.LEFT_DOWN:
                return DirectionType.DOWN;
        }
        return -1;
    }

    /**
     * 只获取水平方向的方向
     */
    public static getHorDir(dir: number): number {
        switch (dir) {
            case DirectionType.RIGHT_UP:
            case DirectionType.RIGHT:
            case DirectionType.RIGHT_DOWN:
                return DirectionType.RIGHT;
            case DirectionType.LEFT_DOWN:
            case DirectionType.LEFT:
            case DirectionType.LEFT_UP:
                return DirectionType.LEFT;
        }
        return -1;
    }

    public static orientation(fx: number, fy: number, ex: number, ey: number): number {
        var dx: number = ex - fx;
        var dy: number = ey - fy;
        var r: number = Math.atan2(dy, dx) * 180 / Math.PI;
        return r;
    }


}
export interface IUpdateable {
    enabled: boolean;
    updateTime(timer: GameTime): void;
}