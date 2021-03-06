{
	"version":"LAYASCENE3D:01",
	"data":{
		"type":"Scene3D",
		"props":{
			"name":"map001",
			"ambientColor":[
				0.2807093,
				0.3387871,
				0.4338235
			],
			"lightmaps":[],
			"enableFog":true,
			"fogStart":15,
			"fogRange":35,
			"fogColor":[
				0.2720588,
				0.2300498,
				0.2300498
			]
		},
		"child":[
			{
				"type":"Sprite3D",
				"props":{
					"name":"BG",
					"active":true,
					"isStatic":false,
					"layer":0,
					"position":[
						0.528253,
						0,
						6.7028
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
					]
				},
				"components":[],
				"child":[
					{
						"type":"MeshSprite3D",
						"props":{
							"name":"Wood Fence",
							"active":true,
							"isStatic":false,
							"layer":0,
							"position":[
								5.237057,
								0.05,
								-5.985925
							],
							"rotation":[
								0,
								-0.707106,
								0,
								-0.7071076
							],
							"scale":[
								1,
								1.5,
								1
							],
							"meshPath":"Assets/AceAsset/CommonResources/bg/Wood Fence/Meshes/Woodfence-woodenfence.lm",
							"enableRender":true,
							"materials":[
								{
									"type":"Laya.BlinnPhongMaterial",
									"path":"Assets/AceAsset/CommonResources/bg/Wood Fence/Materials/utd_woodenfence.lmat"
								}
							]
						},
						"components":[
							{
								"type":"PhysicsCollider",
								"restitution":0,
								"friction":0.5,
								"rollingFriction":0,
								"shapes":[
									{
										"type":"BoxColliderShape",
										"center":[
											-3.040773,
											1,
											0.002612107
										],
										"size":[
											6.081546,
											2,
											0.1164486
										]
									}
								],
								"isTrigger":false
							}
						],
						"child":[]
					},
					{
						"type":"MeshSprite3D",
						"props":{
							"name":"Wood Fence",
							"active":true,
							"isStatic":false,
							"layer":0,
							"position":[
								5.237057,
								0.05,
								-11.98592
							],
							"rotation":[
								0,
								-0.707106,
								0,
								-0.7071076
							],
							"scale":[
								1,
								1.5,
								1
							],
							"meshPath":"Assets/AceAsset/CommonResources/bg/Wood Fence/Meshes/Woodfence-woodenfence.lm",
							"enableRender":true,
							"materials":[
								{
									"type":"Laya.BlinnPhongMaterial",
									"path":"Assets/AceAsset/CommonResources/bg/Wood Fence/Materials/utd_woodenfence.lmat"
								}
							]
						},
						"components":[
							{
								"type":"PhysicsCollider",
								"restitution":0,
								"friction":0.5,
								"rollingFriction":0,
								"shapes":[
									{
										"type":"BoxColliderShape",
										"center":[
											-3.040773,
											1,
											0.002612107
										],
										"size":[
											6.081546,
											2,
											0.1164486
										]
									}
								],
								"isTrigger":false
							}
						],
						"child":[]
					},
					{
						"type":"MeshSprite3D",
						"props":{
							"name":"Wood Fence",
							"active":true,
							"isStatic":false,
							"layer":0,
							"position":[
								5.237057,
								0.05,
								-11.98592
							],
							"rotation":[
								0,
								0,
								0,
								-1
							],
							"scale":[
								1,
								1.5,
								1
							],
							"meshPath":"Assets/AceAsset/CommonResources/bg/Wood Fence/Meshes/Woodfence-woodenfence.lm",
							"enableRender":true,
							"materials":[
								{
									"type":"Laya.BlinnPhongMaterial",
									"path":"Assets/AceAsset/CommonResources/bg/Wood Fence/Materials/utd_woodenfence.lmat"
								}
							]
						},
						"components":[
							{
								"type":"PhysicsCollider",
								"restitution":0,
								"friction":0.5,
								"rollingFriction":0,
								"shapes":[
									{
										"type":"BoxColliderShape",
										"center":[
											-3.040773,
											1,
											0.002612107
										],
										"size":[
											6.081546,
											2,
											0.1164486
										]
									}
								],
								"isTrigger":false
							}
						],
						"child":[]
					},
					{
						"type":"MeshSprite3D",
						"props":{
							"name":"Wood Fence",
							"active":true,
							"isStatic":false,
							"layer":0,
							"position":[
								-0.7629433,
								0.05,
								-11.98592
							],
							"rotation":[
								0,
								0,
								0,
								-1
							],
							"scale":[
								1,
								1.5,
								1
							],
							"meshPath":"Assets/AceAsset/CommonResources/bg/Wood Fence/Meshes/Woodfence-woodenfence.lm",
							"enableRender":true,
							"materials":[
								{
									"type":"Laya.BlinnPhongMaterial",
									"path":"Assets/AceAsset/CommonResources/bg/Wood Fence/Materials/utd_woodenfence.lmat"
								}
							]
						},
						"components":[
							{
								"type":"PhysicsCollider",
								"restitution":0,
								"friction":0.5,
								"rollingFriction":0,
								"shapes":[
									{
										"type":"BoxColliderShape",
										"center":[
											-3.040773,
											1,
											0.002612107
										],
										"size":[
											6.081546,
											2,
											0.1164486
										]
									}
								],
								"isTrigger":false
							}
						],
						"child":[]
					},
					{
						"type":"MeshSprite3D",
						"props":{
							"name":"Ground",
							"active":true,
							"isStatic":false,
							"layer":0,
							"position":[
								-0.528253,
								0,
								0.7972002
							],
							"rotation":[
								0.008421977,
								-0.3826683,
								-0.002290057,
								-0.9238446
							],
							"scale":[
								100,
								0.1,
								100
							],
							"meshPath":"Library/unity default resources-Cube.lm",
							"enableRender":true,
							"materials":[
								{
									"type":"Laya.BlinnPhongMaterial",
									"path":"Assets/AceAsset/CommonResources/Terrains/Materials/Moss 01.lmat"
								}
							]
						},
						"components":[
							{
								"type":"PhysicsCollider",
								"restitution":0,
								"friction":0.5,
								"rollingFriction":0,
								"shapes":[
									{
										"type":"BoxColliderShape",
										"center":[
											0,
											0,
											0
										],
										"size":[
											1,
											1,
											1
										]
									}
								],
								"isTrigger":false
							}
						],
						"child":[]
					},
					{
						"type":"MeshSprite3D",
						"props":{
							"name":"Wood Fence",
							"active":true,
							"isStatic":false,
							"layer":0,
							"position":[
								5.237057,
								0.05,
								0.01407528
							],
							"rotation":[
								0,
								0,
								0,
								-1
							],
							"scale":[
								1,
								1.5,
								1
							],
							"meshPath":"Assets/AceAsset/CommonResources/bg/Wood Fence/Meshes/Woodfence-woodenfence.lm",
							"enableRender":true,
							"materials":[
								{
									"type":"Laya.BlinnPhongMaterial",
									"path":"Assets/AceAsset/CommonResources/bg/Wood Fence/Materials/utd_woodenfence.lmat"
								}
							]
						},
						"components":[
							{
								"type":"PhysicsCollider",
								"restitution":0,
								"friction":0.5,
								"rollingFriction":0,
								"shapes":[
									{
										"type":"BoxColliderShape",
										"center":[
											-3.040773,
											1,
											0.002612107
										],
										"size":[
											6.081546,
											2,
											0.1164486
										]
									}
								],
								"isTrigger":false
							}
						],
						"child":[]
					},
					{
						"type":"MeshSprite3D",
						"props":{
							"name":"Wood Fence",
							"active":true,
							"isStatic":false,
							"layer":0,
							"position":[
								-6.762943,
								0.05,
								-11.98592
							],
							"rotation":[
								0,
								-0.707106,
								0,
								-0.7071076
							],
							"scale":[
								1,
								1.5,
								1
							],
							"meshPath":"Assets/AceAsset/CommonResources/bg/Wood Fence/Meshes/Woodfence-woodenfence.lm",
							"enableRender":true,
							"materials":[
								{
									"type":"Laya.BlinnPhongMaterial",
									"path":"Assets/AceAsset/CommonResources/bg/Wood Fence/Materials/utd_woodenfence.lmat"
								}
							]
						},
						"components":[
							{
								"type":"PhysicsCollider",
								"restitution":0,
								"friction":0.5,
								"rollingFriction":0,
								"shapes":[
									{
										"type":"BoxColliderShape",
										"center":[
											-3.040773,
											1,
											0.002612107
										],
										"size":[
											6.081546,
											2,
											0.1164486
										]
									}
								],
								"isTrigger":false
							}
						],
						"child":[]
					},
					{
						"type":"MeshSprite3D",
						"props":{
							"name":"Wood Fence",
							"active":true,
							"isStatic":false,
							"layer":0,
							"position":[
								-6.762943,
								0.05,
								-5.985925
							],
							"rotation":[
								0,
								-0.707106,
								0,
								-0.7071076
							],
							"scale":[
								1,
								1.5,
								1
							],
							"meshPath":"Assets/AceAsset/CommonResources/bg/Wood Fence/Meshes/Woodfence-woodenfence.lm",
							"enableRender":true,
							"materials":[
								{
									"type":"Laya.BlinnPhongMaterial",
									"path":"Assets/AceAsset/CommonResources/bg/Wood Fence/Materials/utd_woodenfence.lmat"
								}
							]
						},
						"components":[
							{
								"type":"PhysicsCollider",
								"restitution":0,
								"friction":0.5,
								"rollingFriction":0,
								"shapes":[
									{
										"type":"BoxColliderShape",
										"center":[
											-3.040773,
											1,
											0.002612107
										],
										"size":[
											6.081546,
											2,
											0.1164486
										]
									}
								],
								"isTrigger":false
							}
						],
						"child":[]
					},
					{
						"type":"MeshSprite3D",
						"props":{
							"name":"Wood Fence",
							"active":true,
							"isStatic":false,
							"layer":0,
							"position":[
								-0.762943,
								0.05,
								0.01407528
							],
							"rotation":[
								0,
								0,
								0,
								-1
							],
							"scale":[
								1,
								1.5,
								1
							],
							"meshPath":"Assets/AceAsset/CommonResources/bg/Wood Fence/Meshes/Woodfence-woodenfence.lm",
							"enableRender":true,
							"materials":[
								{
									"type":"Laya.BlinnPhongMaterial",
									"path":"Assets/AceAsset/CommonResources/bg/Wood Fence/Materials/utd_woodenfence.lmat"
								}
							]
						},
						"components":[
							{
								"type":"PhysicsCollider",
								"restitution":0,
								"friction":0.5,
								"rollingFriction":0,
								"shapes":[
									{
										"type":"BoxColliderShape",
										"center":[
											-3.040773,
											1,
											0.002612107
										],
										"size":[
											6.081546,
											2,
											0.1164486
										]
									}
								],
								"isTrigger":false
							}
						],
						"child":[]
					}
				]
			},
			{
				"type":"Camera",
				"props":{
					"name":"Main Camera",
					"active":true,
					"isStatic":false,
					"layer":0,
					"position":[
						-0.01853788,
						4.273065,
						-6.211953
					],
					"rotation":[
						0,
						0.9659259,
						0.2588187,
						0
					],
					"scale":[
						1,
						1,
						1
					],
					"clearFlag":0,
					"orthographic":false,
					"fieldOfView":45,
					"nearPlane":0.3,
					"farPlane":1000,
					"viewport":[
						0,
						0,
						1,
						1
					],
					"clearColor":[
						0.2705882,
						0.2313726,
						0.2313726,
						0.003921569
					]
				},
				"components":[],
				"child":[
					{
						"type":"DirectionLight",
						"props":{
							"name":"Directional light",
							"active":true,
							"isStatic":false,
							"layer":0,
							"position":[
								0,
								0,
								0
							],
							"rotation":[
								0,
								1,
								0,
								0
							],
							"scale":[
								1,
								1,
								1
							],
							"intensity":0.2,
							"lightmapBakedType":1,
							"color":[
								1,
								1,
								1
							]
						},
						"components":[],
						"child":[]
					},
					{
						"type":"SpotLight",
						"props":{
							"name":"Directional light",
							"active":true,
							"isStatic":false,
							"layer":0,
							"position":[
								0,
								0,
								0
							],
							"rotation":[
								0,
								1,
								-1.884576E-07,
								0
							],
							"scale":[
								1,
								1,
								1
							],
							"intensity":7,
							"lightmapBakedType":1,
							"range":15,
							"spotAngle":45,
							"color":[
								1,
								1,
								1
							]
						},
						"components":[],
						"child":[]
					}
				]
			}
		]
	}
}