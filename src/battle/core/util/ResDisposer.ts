import { ConfigManager } from "../../../config/ConfigManager";

export class ResDisposer{
    public static Instance:ResDisposer = new ResDisposer();
    public _references = {};
    /**
     * addRef
     */
    public addRefByObjId(id) {
        let obj = ConfigManager.Instance.obj["model_" + id];
        if(obj){
            for (const url of obj.allRes) {
                //根据资源路径获取资源
                this.addRef(url);
            }
            this.addRef(obj.url);
        }
    }
    
    public removeRefByObjId(id){
        let obj = ConfigManager.Instance.obj["model_" + id];
        if(obj){
            this.removeRef(obj.url);
            for (const url of obj.allRes) {
                //根据资源路径获取资源
                this.removeRef(url);
            }
        }
    }

    public checkRef(id){
        let obj = ConfigManager.Instance.obj["model_" + id];
        if(obj){
            for (const url of obj.allRes) {
                //根据资源路径获取资源
                if(this._references[url] <= 0){
                    this.disposeRes(url);
                }
            }
            this.disposeRes(obj.url);
        }
    }

    public disposeRes(url):void{
        //根据资源路径获取资源
        var resource:Laya.Resource = Laya.loader.getRes(url)as Laya.Resource;
        //非空
        if(resource)
        {
            resource.destroy();
            if(resource.releaseResource)
                resource.releaseResource(true);
            Laya.loader.clearRes(url);
        }else{
            Laya.loader.cancelLoadByUrl(url);
        }
    }

    public addRef(url:string):void{
		if(this._references[url] == null){
			this._references[url] = 1;
		}else{
			this._references[url]++;
		}
	}

	public removeRef(url:string):void{
		if(this._references[url]){
			this._references[url]--;
			if(this._references[url] <= 0){
                this.disposeRes(url);
            }
		}
	}
}