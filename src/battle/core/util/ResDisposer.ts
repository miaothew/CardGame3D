import { ConfigManager } from "../../../config/ConfigManager";

export class ResDisposer{
    public static Instance:ResDisposer = new ResDisposer();
    public _references = {};
    /**
     * addRef
     */
    public addRefByObjId(id,firstName = "model_") {
        let obj = ConfigManager.Instance.obj[firstName + id];
        if(obj){
            for (const url of obj.allRes) {
                //根据资源路径获取资源
                this.addRef(url);
            }
            this.addRef(obj.url);
        }
    }
    
    public removeRefByObjId(id,firstName = "model_"){
        let obj = ConfigManager.Instance.obj[firstName + id];
        if(obj){
            this.removeRef(obj.url);
            for (const url of obj.allRes) {
                //根据资源路径获取资源
                this.removeRef(url);
            }
        }
    }

    public checkRef(id,firstName = "model_"){
        let obj = ConfigManager.Instance.obj[firstName + id];
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
    

    
    public disposeRes(url):void{
        //根据资源路径获取资源
        var resource:Laya.Resource = Laya.loader.getRes(url)as Laya.Resource;
        //非空
        if(resource)
        {
            if(resource instanceof Laya.Sprite3D){
                resource.destroy();
                Laya.loader.clearRes(url);
            }else{
                resource.destroy();
                if(resource.releaseResource)
                    resource.releaseResource(true);
                Laya.loader.clearRes(url);
            }
        }
        else{
            Laya.loader.cancelLoadByUrl(url);
        }
    }
    
    public _loading:{[key:string]:number} = {};
    public _resArr:{[key:string]:string[]} = {};
    
    public addToLoading(url:string):void{
        if(!this._loading[url])
            this._loading[url] = 1;
        else
            this._loading[url] += 1;
    }
    public removeLoad(url:string):boolean{
        if(!this._loading[url])
        {
            return false;
        }
        this._loading[url] -= 1;
        if(this._loading[url] == 0)
        {
            delete this._loading[url];
            return true;
        }
        else if(this._loading[url] < 0)
        {
            console.error(url + "引用计数出错！");
            delete this._loading[url];
        }
        return false;
    }

    disposeLoadedUrl(url:string):void
    {
        if(this._loading[url]){
            return;
        }
        if(!url)
            return;

        var disposeRes = this._resArr[url];
        if(!disposeRes)
            return;

        for(var i=0,len=disposeRes.length;i<len;i++)
        {
            var obj = disposeRes[i];
            this.disposeRes(obj);
        }
    }

    addMesh3DRes(sp3D, res_arr):void
    {
		if (!res_arr){
			return;
		}
		if (!sp3D || sp3D.destroyed){
			return;
		}
		if (sp3D instanceof Laya.SkinnedMeshSprite3D || sp3D instanceof Laya.MeshSprite3D)
        {
            var mesh = sp3D;
            if (mesh && mesh.meshFilter)
            {
                var sharedMesh = mesh.meshFilter.sharedMesh;
                if(sharedMesh)
                    this.pushUrl(res_arr, sharedMesh.url);
            }
			if (mesh && mesh._render){
                var mats = mesh._render._materials;
                for (var i=0,len:number=mats.length;i<len;i++){
                    var mat = mats[i];
                    if(mat)
                    {
                        if(mat.url)
                            this.pushUrl(res_arr, mat.url);
                        else
                        {    
                            console.error("找不到材质资源resUrl");
                            debugger;
                        }
                        if (mat["albedoTexture"]){
                            this.pushUrl(res_arr, mat["albedoTexture"].url);
                        }
                        if (mat["specularTexture"]){
                            this.pushUrl(res_arr, mat["specularTexture"].url);
                        }
                        if (mat["normalTexture"]){
                            this.pushUrl(res_arr, mat["normalTexture"].url);
                        }
                        if (mat["wingTexture"]){
                            this.pushUrl(res_arr, mat["wingTexture"].url);
                        }
                        if (mat["maskTexture"]){
                            this.pushUrl(res_arr, mat["maskTexture"].url);
                        }
                    } 
                }
            }
		}
        else if (sp3D instanceof Laya.ShuriKenParticle3D)
        {
            var particle = sp3D;
            if (particle && particle._render)
            {
                var render = particle._render;
                if(render["mesh"])
                    this.pushUrl(res_arr, render["mesh"].url);
                var parMats = render._materials;
                for (var i=0,len:number=parMats.length;i<len;i++){
                    var parMat = parMats[i];
                    if(parMat.url)
                        this.pushUrl(res_arr,parMat.url);
                    else
                        debugger;
                    if (parMat && parMat["texture"]){
                        this.pushUrl(res_arr,parMat["texture"]._url);
                    }
                }
            }
        }
        else if (sp3D instanceof Laya.Sprite3D)
        {
            var animator = sp3D.getComponent(Laya.Animator) as Laya.Animator;
            if(animator)
            {
                var avatar = animator.avatar;
                if(avatar && avatar.url)
                    this.pushUrl(res_arr,avatar.url);
                let controlLayers = animator["_controllerLayers"] as Laya.AnimatorControllerLayer[];
                if(controlLayers)
                {
                    for (let index = 0; index < controlLayers.length; index++) {
                        const element = controlLayers[index];
                        if(element._states){
                            for (let index = 0; index < element._states.length; index++) {
                                const state:Laya.AnimatorState = element._states[index];
                                if(state._clip){
                                    this.pushUrl(res_arr,state._clip["_url"]);
                                }
                            }
                        }
                    }
                }
            }
        }
        else
        {
            debugger;
        }
		for (var i=0;i < sp3D.numChildren;i++){
			var node=sp3D.getChildAt(i);
			if (!node || node.destroyed)
                continue;
			this.addMesh3DRes(node, res_arr);
		}
    }

    analysisUrl(url):string[]
    {
        var disposeRes = this._resArr[url];
        if(!disposeRes)
        {
            var res = Laya.loader.getRes(url);
            var arrRes=[];
            arrRes.push(url);
            this.addMesh3DRes(res, arrRes);
            disposeRes = this._resArr[url] = arrRes;
        }
        return disposeRes;
    }

    pushUrl(resAry, url):void
    {
        if(!url)
        {
            debugger;
            return;
        }
        if(-1 == resAry.indexOf(url))
            resAry.push(url);
    }

    addReferenceRes(url):void
    {
        if(!url)
            return;
        
        var disposeRes = this.analysisUrl(url);

        for(var i=0,len=disposeRes.length;i<len;i++)
        {
            var obj = disposeRes[i];
            if(!this._references[obj])
                this._references[obj] = 1;
            else
                this._references[obj] += 1;
        }
    }

    removeReferenceRes(url):void
    {
        if(!url)
            return;

        var disposeRes = this._resArr[url];
        if(!disposeRes)
        {
            // debugger;
            // if(!this._roleDisposeObj[url])
            //     this.cancelLoadByUrl(url);
            return;
        }

        for(var i=0,len=disposeRes.length;i<len;i++)
        {
            var obj = disposeRes[i];
            if(!this._references[obj])
                continue;

            this._references[obj] -= 1;
            if(0 == this._references[obj])
            {
                this.disposeRes(obj);
                delete this._references[obj];
            }
            else if(this._references[obj] < 0)
            {
                console.error(obj + "资源释放错误");
                delete this._references[obj];
            }
        }
    }
}