{
	"version":"LAYASCENE3D:01",
	"data":{
		"type":"Scene3D",
		"props":{
			"name":"test1",
			"ambientColor":[
				0.212,
				0.227,
				0.259
			],
			"lightmaps":[],
			"enableFog":false,
			"fogStart":0,
			"fogRange":300,
			"fogColor":[
				0.5,
				0.5,
				0.5
			]
		},
		"child":[
			
			
			{
				"type":"MeshSprite3D",
				"props":{
					"name":"Terrain",
					"active":true,
					"isStatic":true,
					"layer":0,
					"position":[
						0,
						0,
						0
					],
					"rotation":[
						0,
						0,
						0,
						-1
					],
					"scale":[
						1,
						1,
						1
					],
					"meshPath":"terrain/terrain_Terrain.lm",
					"materials":[
						{
							"type":"Laya.ExtendTerrainMaterial",
							"path":"terrain/terrain_Terrain.lmat"
						}
					]
				},
				"components":[],
				"child":[]
			}
		]
	}
}