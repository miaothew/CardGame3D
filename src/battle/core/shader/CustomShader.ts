import { CustomMaterial } from "../marterial/CustomMaterial";

/*
* name;
*/
export class CustomShader {
    constructor() {

    }

    public static initShader(): void {
        var attributeMap: Object = {
            'a_Position': Laya.VertexMesh.MESH_POSITION0,
            'a_Color': Laya.VertexMesh.MESH_COLOR0,
            'a_Normal': Laya.VertexMesh.MESH_NORMAL0,
            'a_Texcoord0': Laya.VertexMesh.MESH_TEXTURECOORDINATE0,
            'a_Texcoord1': Laya.VertexMesh.MESH_TEXTURECOORDINATE1,
            'a_BoneWeights': Laya.VertexMesh.MESH_BLENDWEIGHT0,
            'a_BoneIndices': Laya.VertexMesh.MESH_BLENDINDICES0,
            'a_Tangent0': Laya.VertexMesh.MESH_TANGENT0
        };
        var uniformMap: Object = {
            'u_Bones': [ /*laya.d3.core.SkinnedMeshSprite3D.BONES*/0,/*laya.d3.shader.Shader3D.PERIOD_CUSTOM*/0],
            'u_DiffuseTexture': [ /*laya.d3.core.material.BlinnPhongMaterial.ALBEDOTEXTURE*/1,/*laya.d3.shader.Shader3D.PERIOD_MATERIAL*/1],
            'u_SpecularTexture': [ /*laya.d3.core.material.BlinnPhongMaterial.SPECULARTEXTURE*/3,/*laya.d3.shader.Shader3D.PERIOD_MATERIAL*/1],
            'u_NormalTexture': [ /*laya.d3.core.material.BlinnPhongMaterial.NORMALTEXTURE*/2,/*laya.d3.shader.Shader3D.PERIOD_MATERIAL*/1],
            'u_AlphaTestValue': [ /*laya.d3.core.material.BaseMaterial.ALPHATESTVALUE*/0,/*laya.d3.shader.Shader3D.PERIOD_MATERIAL*/1],
            'u_DiffuseColor': [ /*laya.d3.core.material.BlinnPhongMaterial.ALBEDOCOLOR*/5,/*laya.d3.shader.Shader3D.PERIOD_MATERIAL*/1],
            'u_MaterialSpecular': [ /*laya.d3.core.material.BlinnPhongMaterial.MATERIALSPECULAR*/6,/*laya.d3.shader.Shader3D.PERIOD_MATERIAL*/1],
            'u_Shininess': [ /*laya.d3.core.material.BlinnPhongMaterial.SHININESS*/7,/*laya.d3.shader.Shader3D.PERIOD_MATERIAL*/1],
            'u_TilingOffset': [ /*laya.d3.core.material.BlinnPhongMaterial.TILINGOFFSET*/8,/*laya.d3.shader.Shader3D.PERIOD_MATERIAL*/1],
            'u_WorldMat': [Laya.Sprite3D.WORLDMATRIX,/*laya.d3.shader.Shader3D.PERIOD_SPRITE*/2],
            'u_MvpMatrix': [Laya.Sprite3D.MVPMATRIX,/*laya.d3.shader.Shader3D.PERIOD_SPRITE*/2],
            'u_LightmapScaleOffset': [Laya.RenderableSprite3D.LIGHTMAPSCALEOFFSET,/*laya.d3.shader.Shader3D.PERIOD_SPRITE*/2],
            'u_LightMap': [Laya.RenderableSprite3D.LIGHTMAP,/*laya.d3.shader.Shader3D.PERIOD_SPRITE*/2],
            'u_CameraPos': [ /*laya.d3.core.BaseCamera.CAMERAPOS*/0,/*laya.d3.shader.Shader3D.PERIOD_CAMERA*/3],
            'u_ReflectTexture': [ /*laya.d3.core.scene.Scene3D.REFLECTIONTEXTURE*/22,/*laya.d3.shader.Shader3D.PERIOD_SCENE*/4],
            'u_ReflectIntensity': [ /*laya.d3.core.scene.Scene3D.REFLETIONINTENSITY*/23,/*laya.d3.shader.Shader3D.PERIOD_SCENE*/4],
            'u_FogStart': [ /*laya.d3.core.scene.Scene3D.FOGSTART*/1,/*laya.d3.shader.Shader3D.PERIOD_SCENE*/4],
            'u_FogRange': [ /*laya.d3.core.scene.Scene3D.FOGRANGE*/2,/*laya.d3.shader.Shader3D.PERIOD_SCENE*/4],
            'u_FogColor': [ /*laya.d3.core.scene.Scene3D.FOGCOLOR*/0,/*laya.d3.shader.Shader3D.PERIOD_SCENE*/4],
            'u_DirectionLight.Color': [ /*laya.d3.core.scene.Scene3D.LIGHTDIRCOLOR*/4,/*laya.d3.shader.Shader3D.PERIOD_SCENE*/4],
            'u_DirectionLight.Direction': [ /*laya.d3.core.scene.Scene3D.LIGHTDIRECTION*/3,/*laya.d3.shader.Shader3D.PERIOD_SCENE*/4],
            'u_PointLight.Position': [ /*laya.d3.core.scene.Scene3D.POINTLIGHTPOS*/5,/*laya.d3.shader.Shader3D.PERIOD_SCENE*/4],
            'u_PointLight.Range': [ /*laya.d3.core.scene.Scene3D.POINTLIGHTRANGE*/6,/*laya.d3.shader.Shader3D.PERIOD_SCENE*/4],
            'u_PointLight.Color': [ /*laya.d3.core.scene.Scene3D.POINTLIGHTCOLOR*/8,/*laya.d3.shader.Shader3D.PERIOD_SCENE*/4],
            'u_SpotLight.Position': [ /*laya.d3.core.scene.Scene3D.SPOTLIGHTPOS*/9,/*laya.d3.shader.Shader3D.PERIOD_SCENE*/4],
            'u_SpotLight.Direction': [ /*laya.d3.core.scene.Scene3D.SPOTLIGHTDIRECTION*/10,/*laya.d3.shader.Shader3D.PERIOD_SCENE*/4],
            'u_SpotLight.Range': [ /*laya.d3.core.scene.Scene3D.SPOTLIGHTRANGE*/12,/*laya.d3.shader.Shader3D.PERIOD_SCENE*/4],
            'u_SpotLight.Spot': [ /*laya.d3.core.scene.Scene3D.SPOTLIGHTSPOTANGLE*/11,/*laya.d3.shader.Shader3D.PERIOD_SCENE*/4],
            'u_SpotLight.Color': [ /*laya.d3.core.scene.Scene3D.SPOTLIGHTCOLOR*/14,/*laya.d3.shader.Shader3D.PERIOD_SCENE*/4],
            'u_AmbientColor': [ /*laya.d3.core.scene.Scene3D.AMBIENTCOLOR*/21,/*laya.d3.shader.Shader3D.PERIOD_SCENE*/4],
            'u_shadowMap1': [ /*laya.d3.core.scene.Scene3D.SHADOWMAPTEXTURE1*/18,/*laya.d3.shader.Shader3D.PERIOD_SCENE*/4],
            'u_shadowMap2': [ /*laya.d3.core.scene.Scene3D.SHADOWMAPTEXTURE2*/19,/*laya.d3.shader.Shader3D.PERIOD_SCENE*/4],
            'u_shadowMap3': [ /*laya.d3.core.scene.Scene3D.SHADOWMAPTEXTURE3*/20,/*laya.d3.shader.Shader3D.PERIOD_SCENE*/4],
            'u_shadowPSSMDistance': [ /*laya.d3.core.scene.Scene3D.SHADOWDISTANCE*/15,/*laya.d3.shader.Shader3D.PERIOD_SCENE*/4],
            'u_lightShadowVP': [ /*laya.d3.core.scene.Scene3D.SHADOWLIGHTVIEWPROJECT*/16,/*laya.d3.shader.Shader3D.PERIOD_SCENE*/4],
            'u_shadowPCFoffset': [ /*laya.d3.core.scene.Scene3D.SHADOWMAPPCFOFFSET*/17,/*laya.d3.shader.Shader3D.PERIOD_SCENE*/4],
            'u_marginalColor': [CustomMaterial.MARGINALCOLOR, Laya.Shader3D.PERIOD_MATERIAL]
        };
        

        var vs = "#include \"Lighting.glsl\";\n" +
            "\n" +
            "attribute vec4 a_Position;\n" +
            "uniform mat4 u_MvpMatrix;\n" +
            "\n" +
            "#if defined(DIFFUSEMAP)||((defined(DIRECTIONLIGHT)||defined(POINTLIGHT)||defined(SPOTLIGHT))&&(defined(SPECULARMAP)||defined(NORMALMAP)))||(defined(LIGHTMAP)&&defined(UV))\n" +
            "	attribute vec2 a_Texcoord0;\n" +
            "	varying vec2 v_Texcoord0;\n" +
            "#endif\n" +
            "\n" +
            "#if defined(LIGHTMAP)&&defined(UV1)\n" +
            "	attribute vec2 a_Texcoord1;\n" +
            "#endif\n" +
            "\n" +
            "#ifdef LIGHTMAP\n" +
            "	uniform vec4 u_LightmapScaleOffset;\n" +
            "	varying vec2 v_LightMapUV;\n" +
            "#endif\n" +
            "\n" +
            "#ifdef COLOR\n" +
            "	attribute vec4 a_Color;\n" +
            "	varying vec4 v_Color;\n" +
            "#endif\n" +
            "\n" +
            "#ifdef BONE\n" +
            "	const int c_MaxBoneCount = 24;\n" +
            "	attribute vec4 a_BoneIndices;\n" +
            "	attribute vec4 a_BoneWeights;\n" +
            "	uniform mat4 u_Bones[c_MaxBoneCount];\n" +
            "#endif\n" +
            "\n" +
            "#if defined(DIRECTIONLIGHT)||defined(POINTLIGHT)||defined(SPOTLIGHT)||defined(REFLECTMAP)||defined(INNER_GLOW)\n" +
            "	attribute vec3 a_Normal;\n" +
            "	varying vec3 v_Normal; \n" +
            "	uniform vec3 u_CameraPos;\n" +
            "	varying vec3 v_ViewDir; \n" +
            "#endif\n" +
            "\n" +
            "#if (defined(DIRECTIONLIGHT)||defined(POINTLIGHT)||defined(SPOTLIGHT))&&defined(NORMALMAP)\n" +
            "	attribute vec4 a_Tangent0;\n" +
            "	varying vec3 v_Tangent;\n" +
            "	varying vec3 v_Binormal;\n" +
            "#endif\n" +
            "\n" +
            "#if defined(DIRECTIONLIGHT)||defined(POINTLIGHT)||defined(SPOTLIGHT)||defined(REFLECTMAP)||defined(RECEIVESHADOW)\n" +
            "	uniform mat4 u_WorldMat;\n" +
            "	varying vec3 v_PositionWorld;\n" +
            "#endif\n" +
            "\n" +
            "varying float v_posViewZ;\n" +
            "#ifdef RECEIVESHADOW\n" +
            "  #ifdef SHADOWMAP_PSSM1 \n" +
            "  varying vec4 v_lightMVPPos;\n" +
            "  uniform mat4 u_lightShadowVP[4];\n" +
            "  #endif\n" +
            "#endif\n" +
            "\n" +
            "#ifdef TILINGOFFSET\n" +
            "	uniform vec4 u_TilingOffset;\n" +
            "#endif\n" +
            "\n" +
            "void main_castShadow()\n" +
            "{\n" +
            "	#ifdef BONE\n" +
            "		mat4 skinTransform = u_Bones[int(a_BoneIndices.x)] * a_BoneWeights.x;\n" +
            "		skinTransform += u_Bones[int(a_BoneIndices.y)] * a_BoneWeights.y;\n" +
            "		skinTransform += u_Bones[int(a_BoneIndices.z)] * a_BoneWeights.z;\n" +
            "		skinTransform += u_Bones[int(a_BoneIndices.w)] * a_BoneWeights.w;\n" +
            "		vec4 position=skinTransform*a_Position;\n" +
            "		gl_Position = u_MvpMatrix * position;\n" +
            "	#else\n" +
            "		gl_Position = u_MvpMatrix * a_Position;\n" +
            "	#endif\n" +
            "	 \n" +
            "	//TODO没考虑UV动画呢\n" +
            "	#if defined(DIFFUSEMAP)&&defined(ALPHATEST)\n" +
            "		v_Texcoord0=a_Texcoord0;\n" +
            "	#endif\n" +
            "		v_posViewZ = gl_Position.z;\n" +
            "}\n" +
            "\n" +
            "mat3 inverse(mat3 m) {\n" +
            "  float a00 = m[0][0], a01 = m[0][1], a02 = m[0][2];\n" +
            "  float a10 = m[1][0], a11 = m[1][1], a12 = m[1][2];\n" +
            "  float a20 = m[2][0], a21 = m[2][1], a22 = m[2][2];\n" +
            "\n" +
            "  float b01 = a22 * a11 - a12 * a21;\n" +
            "  float b11 = -a22 * a10 + a12 * a20;\n" +
            "  float b21 = a21 * a10 - a11 * a20;\n" +
            "\n" +
            "  float det = a00 * b01 + a01 * b11 + a02 * b21;\n" +
            "\n" +
            "  return mat3(b01, (-a22 * a01 + a02 * a21), (a12 * a01 - a02 * a11),\n" +
            "              b11, (a22 * a00 - a02 * a20), (-a12 * a00 + a02 * a10),\n" +
            "              b21, (-a21 * a00 + a01 * a20), (a11 * a00 - a01 * a10)) / det;\n" +
            "}\n" +
            "\n" +
            "void main_normal()\n" +
            "{\n" +
            "	#ifdef BONE\n" +
            "		mat4 skinTransform = u_Bones[int(a_BoneIndices.x)] * a_BoneWeights.x;\n" +
            "		skinTransform += u_Bones[int(a_BoneIndices.y)] * a_BoneWeights.y;\n" +
            "		skinTransform += u_Bones[int(a_BoneIndices.z)] * a_BoneWeights.z;\n" +
            "		skinTransform += u_Bones[int(a_BoneIndices.w)] * a_BoneWeights.w;\n" +
            "		vec4 position=skinTransform*a_Position;\n" +
            "		gl_Position = u_MvpMatrix * position;\n" +
            "	#else\n" +
            "		gl_Position = u_MvpMatrix * a_Position;\n" +
            "	#endif\n" +
            "\n" +
            "	#if defined(DIRECTIONLIGHT)||defined(POINTLIGHT)||defined(SPOTLIGHT)||defined(REFLECTMAP)\n" +
            "		mat3 worldInvMat;\n" +
            "		#ifdef BONE\n" +
            "			worldInvMat=inverse(mat3(u_WorldMat*skinTransform));\n" +
            "		#else\n" +
            "			worldInvMat=inverse(mat3(u_WorldMat));\n" +
            "		#endif  \n" +
            "		v_Normal=a_Normal*worldInvMat;\n" +
            "		#if (defined(DIRECTIONLIGHT)||defined(POINTLIGHT)||defined(SPOTLIGHT))&&defined(NORMALMAP)\n" +
            "			v_Tangent=a_Tangent0.xyz*worldInvMat;\n" +
            "			v_Binormal=cross(v_Normal,v_Tangent)*a_Tangent0.w;\n" +
            "		#endif\n" +
            "	#endif\n" +
            "\n" +
            "	#if defined(DIRECTIONLIGHT)||defined(POINTLIGHT)||defined(SPOTLIGHT)||defined(REFLECTMAP)||defined(RECEIVESHADOW)\n" +
            "		#ifdef BONE\n" +
            "			v_PositionWorld=(u_WorldMat*position).xyz;\n" +
            "		#else\n" +
            "			v_PositionWorld=(u_WorldMat*a_Position).xyz;\n" +
            "		#endif\n" +
            "	#endif\n" +
            "	\n" +
            "	#if defined(DIRECTIONLIGHT)||defined(POINTLIGHT)||defined(SPOTLIGHT)||defined(REFLECTMAP)\n" +
            "		v_ViewDir=u_CameraPos-v_PositionWorld;\n" +
            "	#endif\n" +
            "\n" +
            "	#if defined(DIFFUSEMAP)||((defined(DIRECTIONLIGHT)||defined(POINTLIGHT)||defined(SPOTLIGHT))&&(defined(SPECULARMAP)||defined(NORMALMAP)))\n" +
            "		v_Texcoord0=a_Texcoord0;\n" +
            "		#ifdef TILINGOFFSET\n" +
            "			v_Texcoord0=TransformUV(v_Texcoord0,u_TilingOffset);\n" +
            "		#endif\n" +
            "	#endif\n" +
            "\n" +
            "	#ifdef LIGHTMAP\n" +
            "		#ifdef SCALEOFFSETLIGHTINGMAPUV\n" +
            "			#ifdef UV1\n" +
            "				v_LightMapUV=vec2(a_Texcoord1.x,1.0-a_Texcoord1.y)*u_LightmapScaleOffset.xy+u_LightmapScaleOffset.zw;\n" +
            "			#else\n" +
            "				v_LightMapUV=vec2(a_Texcoord0.x,1.0-a_Texcoord0.y)*u_LightmapScaleOffset.xy+u_LightmapScaleOffset.zw;\n" +
            "			#endif \n" +
            "			v_LightMapUV.y=1.0-v_LightMapUV.y;\n" +
            "		#else\n" +
            "			#ifdef UV1\n" +
            "				v_LightMapUV=a_Texcoord1;\n" +
            "			#else\n" +
            "				v_LightMapUV=a_Texcoord0;\n" +
            "			#endif \n" +
            "		#endif \n" +
            "	#endif\n" +
            "\n" +
            "	#if defined(COLOR)&&defined(ENABLEVERTEXCOLOR)\n" +
            "		v_Color=a_Color;\n" +
            "	#endif\n" +
            "\n" +
            "	#ifdef RECEIVESHADOW\n" +
            "		v_posViewZ = gl_Position.w;\n" +
            "		#ifdef SHADOWMAP_PSSM1 \n" +
            "			v_lightMVPPos = u_lightShadowVP[0] * vec4(v_PositionWorld,1.0);\n" +
            "		#endif\n" +
            "	#endif\n" +
            "}\n" +
            "\n" +
            "void main()\n" +
            "{\n" +
            "	#ifdef CASTSHADOW\n" +
            "		main_castShadow();\n" +
            "	#else\n" +
            "		main_normal();\n" +
            "	#endif\n" +
            "}";
        var ps = "#ifdef HIGHPRECISION\n" +
            "	precision highp float;\n" +
            "#else\n" +
            "	precision mediump float;\n" +
            "#endif\n" +
            "\n" +
            "#include \"Lighting.glsl\";\n" +
            "\n" +
            "uniform vec4 u_DiffuseColor;\n" +
            "\n" +
            "#if defined(COLOR)&&defined(ENABLEVERTEXCOLOR)\n" +
            "	varying vec4 v_Color;\n" +
            "#endif\n" +
            "#if defined(INNER_GLOW)\n" +
            "uniform vec3 u_marginalColor;\n"+
            "#endif\n" +
            "\n" +
            "#if defined(DIRECTIONLIGHT)||defined(POINTLIGHT)||defined(SPOTLIGHT) || defined(INNER_GLOW)\n" +
            "	varying vec3 v_ViewDir; \n" +
            "#endif\n" +
            "\n" +
            "#ifdef ALPHATEST\n" +
            "	uniform float u_AlphaTestValue;\n" +
            "#endif\n" +
            "\n" +
            "#ifdef DIFFUSEMAP\n" +
            "	uniform sampler2D u_DiffuseTexture;\n" +
            "#endif\n" +
            "\n" +
            "\n" +
            "\n" +
            "#if defined(DIFFUSEMAP)||((defined(DIRECTIONLIGHT)||defined(POINTLIGHT)||defined(SPOTLIGHT))&&(defined(SPECULARMAP)||defined(NORMALMAP)))\n" +
            "	varying vec2 v_Texcoord0;\n" +
            "#endif\n" +
            "\n" +
            "#ifdef LIGHTMAP\n" +
            "	varying vec2 v_LightMapUV;\n" +
            "	uniform sampler2D u_LightMap;\n" +
            "#endif\n" +
            "\n" +
            "#if defined(DIRECTIONLIGHT)||defined(POINTLIGHT)||defined(SPOTLIGHT)\n" +
            "	uniform vec3 u_MaterialSpecular;\n" +
            "	uniform float u_Shininess;\n" +
            "	#ifdef SPECULARMAP \n" +
            "		uniform sampler2D u_SpecularTexture;\n" +
            "	#endif\n" +
            "#endif\n" +
            "\n" +
            "#ifdef FOG\n" +
            "	uniform float u_FogStart;\n" +
            "	uniform float u_FogRange;\n" +
            "	uniform vec3 u_FogColor;\n" +
            "#endif\n" +
            "\n" +
            "\n" +
            "#if defined(DIRECTIONLIGHT)||defined(POINTLIGHT)||defined(SPOTLIGHT)\n" +
            "	varying vec3 v_Normal;\n" +
            "#endif\n" +
            "\n" +
            "#if (defined(DIRECTIONLIGHT)||defined(POINTLIGHT)||defined(SPOTLIGHT))&&defined(NORMALMAP)\n" +
            "	uniform sampler2D u_NormalTexture;\n" +
            "	varying vec3 v_Tangent;\n" +
            "	varying vec3 v_Binormal;\n" +
            "#endif\n" +
            "\n" +
            "#ifdef DIRECTIONLIGHT\n" +
            "	uniform DirectionLight u_DirectionLight;\n" +
            "#endif\n" +
            "\n" +
            "#ifdef POINTLIGHT\n" +
            "	uniform PointLight u_PointLight;\n" +
            "#endif\n" +
            "\n" +
            "#ifdef SPOTLIGHT\n" +
            "	uniform SpotLight u_SpotLight;\n" +
            "#endif\n" +
            "\n" +
            "uniform vec3 u_AmbientColor;\n" +
            "\n" +
            "\n" +
            "#if defined(POINTLIGHT)||defined(SPOTLIGHT)||defined(RECEIVESHADOW)\n" +
            "	varying vec3 v_PositionWorld;\n" +
            "#endif\n" +
            "\n" +
            "#include \"ShadowHelper.glsl\"\n" +
            "varying float v_posViewZ;\n" +
            "#ifdef RECEIVESHADOW\n" +
            "	#if defined(SHADOWMAP_PSSM2)||defined(SHADOWMAP_PSSM3)\n" +
            "		uniform mat4 u_lightShadowVP[4];\n" +
            "	#endif\n" +
            "	#ifdef SHADOWMAP_PSSM1 \n" +
            "		varying vec4 v_lightMVPPos;\n" +
            "	#endif\n" +
            "#endif\n" +
            "\n" +
            "void main_castShadow()\n" +
            "{\n" +
            "	//gl_FragColor=vec4(v_posViewZ,0.0,0.0,1.0);\n" +
            "	gl_FragColor=packDepth(v_posViewZ);\n" +
            "	#if defined(DIFFUSEMAP)&&defined(ALPHATEST)\n" +
            "		float alpha = texture2D(u_DiffuseTexture,v_Texcoord0).w;\n" +
            "		if( alpha < u_AlphaTestValue )\n" +
            "		{\n" +
            "			discard;\n" +
            "		}\n" +
            "	#endif\n" +
            "}\n" +
            "void main_normal()\n" +
            "{\n" +
            "	vec3 globalDiffuse=u_AmbientColor;\n" +
            "	#ifdef LIGHTMAP	\n" +
            "		globalDiffuse += DecodeLightmap(texture2D(u_LightMap, v_LightMapUV));\n" +
            "	#endif\n" +
            "	\n" +
            "	#if defined(DIRECTIONLIGHT)||defined(POINTLIGHT)||defined(SPOTLIGHT)||defined(INNER_GLOW)\n" +
            "		vec3 normal;\n" +
            "		#if (defined(DIRECTIONLIGHT)||defined(POINTLIGHT)||defined(SPOTLIGHT))&&defined(NORMALMAP)\n" +
            "			vec3 normalMapSample = texture2D(u_NormalTexture, v_Texcoord0).rgb;\n" +
            "			normal = normalize(NormalSampleToWorldSpace(normalMapSample, v_Normal, v_Tangent,v_Binormal));\n" +
            "		#else\n" +
            "			normal = normalize(v_Normal);\n" +
            "		#endif\n" +
            "		vec3 viewDir= normalize(v_ViewDir);\n" +
            "	#endif\n" +
            "	\n" +
            "	vec4 mainColor=u_DiffuseColor;\n" +
            "	#ifdef DIFFUSEMAP\n" +
            "		vec4 difTexColor=texture2D(u_DiffuseTexture, v_Texcoord0);\n" +
            "       difTexColor.rgb=difTexColor.rgb + difTexColor.rgb;\n" +//翻倍测试
            "		mainColor=mainColor*difTexColor;\n" +
            "	#endif \n" +
            "	#if defined(COLOR)&&defined(ENABLEVERTEXCOLOR)\n" +
            "		mainColor=mainColor*v_Color;\n" +
            "	#endif \n" +
            "    \n" +
            "	#ifdef ALPHATEST\n" +
            "		if(mainColor.a<u_AlphaTestValue)\n" +
            "			discard;\n" +
            "	#endif\n" +
            "  \n" +
            "	\n" +
            "	vec3 diffuse = vec3(0.0);\n" +
            "	vec3 specular= vec3(0.0);\n" +
            "	#if defined(DIRECTIONLIGHT)||defined(POINTLIGHT)||defined(SPOTLIGHT)\n" +
            "		vec3 dif,spe;\n" +
            "		#ifdef SPECULARMAP\n" +
            "			vec3 gloss=texture2D(u_SpecularTexture, v_Texcoord0).rgb;\n" +
            "		#else\n" +
            "			#ifdef DIFFUSEMAP\n" +
            "				vec3 gloss=vec3(difTexColor.a);\n" +
            "			#else\n" +
            "				vec3 gloss=vec3(1.0);\n" +
            "			#endif\n" +
            "		#endif\n" +
            "	#endif\n" +
            "\n" +
            "	\n" +
            "	#ifdef DIRECTIONLIGHT\n" +
            "		LayaAirBlinnPhongDiectionLight(u_MaterialSpecular,u_Shininess,normal,gloss,viewDir,u_DirectionLight,dif,spe);\n" +
            "		diffuse+=dif;\n" +
            "		specular+=spe;\n" +
            "	#endif\n" +
            " \n" +
            "	#ifdef POINTLIGHT\n" +
            "		LayaAirBlinnPhongPointLight(v_PositionWorld,u_MaterialSpecular,u_Shininess,normal,gloss,viewDir,u_PointLight,dif,spe);\n" +
            "		diffuse+=dif;\n" +
            "		specular+=spe;\n" +
            "	#endif\n" +
            "\n" +
            "	#ifdef SPOTLIGHT\n" +
            "		LayaAirBlinnPhongSpotLight(v_PositionWorld,u_MaterialSpecular,u_Shininess,normal,gloss,viewDir,u_SpotLight,dif,spe);\n" +
            "		diffuse+=dif;\n" +
            "		specular+=spe;\n" +
            "	#endif\n" +
            "\n" +
            "	#ifdef RECEIVESHADOW\n" +
            "		float shadowValue = 1.0;\n" +
            "		#ifdef SHADOWMAP_PSSM3\n" +
            "			shadowValue = getShadowPSSM3( u_shadowMap1,u_shadowMap2,u_shadowMap3,u_lightShadowVP,u_shadowPSSMDistance,u_shadowPCFoffset,v_PositionWorld,v_posViewZ,0.001);\n" +
            "		#endif\n" +
            "		#ifdef SHADOWMAP_PSSM2\n" +
            "			shadowValue = getShadowPSSM2( u_shadowMap1,u_shadowMap2,u_lightShadowVP,u_shadowPSSMDistance,u_shadowPCFoffset,v_PositionWorld,v_posViewZ,0.001);\n" +
            "		#endif \n" +
            "		#ifdef SHADOWMAP_PSSM1\n" +
            "			shadowValue = getShadowPSSM1( u_shadowMap1,v_lightMVPPos,u_shadowPSSMDistance,u_shadowPCFoffset,v_posViewZ,0.001);\n" +
            "		#endif\n" +
            "		gl_FragColor =vec4(mainColor.rgb*(globalDiffuse + diffuse)*shadowValue,mainColor.a);\n" +
            "	#else\n" +
            "		gl_FragColor =vec4(mainColor.rgb*(globalDiffuse + diffuse),mainColor.a);\n" +
            "	#endif\n" +
            "\n" +
            "	#if defined(DIRECTIONLIGHT)||defined(POINTLIGHT)||defined(SPOTLIGHT)\n" +
            "		#ifdef RECEIVESHADOW\n" +
            "			gl_FragColor.rgb+=specular*shadowValue;\n" +
            "		#else\n" +
            "			gl_FragColor.rgb+=specular;\n" +
            "		#endif\n" +
            "	#endif\n" +
            "	  \n" +
            "#if defined(INNER_GLOW)\n" +
            // "   vec3 normal=normalize(v_Normal);\n"+
            "   float Rim = 1.0 - max(0.0,dot(viewDir, normal));\n"+
            "   vec3 Emissive = 2.0 * u_DirectionLight.Color * u_marginalColor * pow(Rim,3.0);\n"+ 
            "   gl_FragColor = gl_FragColor + vec4(Emissive,1.0);\n"+
            "#endif\n" +
            "	#ifdef FOG\n" +
            "		float lerpFact=clamp((1.0/gl_FragCoord.w-u_FogStart)/u_FogRange,0.0,1.0);\n" +
            "		gl_FragColor.rgb=mix(gl_FragColor.rgb,u_FogColor,lerpFact);\n" +
            "	#endif\n" +
            "}\n" +
            "\n" +
            "void main()\n" +
            "{\n" +
            "	#ifdef CASTSHADOW		\n" +
            "		main_castShadow();\n" +
            "	#else\n" +
            "		main_normal();\n" +
            "	#endif  \n" +
            "}\n";
        CustomMaterial.init();
        var shader = Laya.Shader3D.add("customShader", attributeMap, uniformMap, Laya.SkinnedMeshSprite3D.shaderDefines, CustomMaterial.shaderDefines2);
        shader.addShaderPass(vs, ps);
        window["CustomMaterial"] = CustomMaterial;
       
        // var shaderComp: Laya.ShaderCompile3D = Laya.ShaderCompile3D.add(customShader, vs, ps, attributeMap, uniformMap);
        // Laya.BlinnPhongMaterial.init(shaderComp);
    }
}
