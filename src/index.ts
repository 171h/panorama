// import * as THREE from 'three'
// import * as Nodes from 'three/nodes'

// import WebGPU from 'three/examples/jsm/capabilities/WebGPU.js'
// import WebGPURenderer from 'three/examples/jsm/renderers/webgpu/WebGPURenderer.js'

// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
// import { RGBMLoader } from 'three/examples/jsm/loaders/RGBMLoader.js'

// import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'
// import Stats from 'three/examples/jsm/libs/stats.module.js'

// // let camera, scene, renderer, stats
// // let cube, sphere, torus, material

// // let cubeCamera, cubeRenderTarget

// // let controls

// // init()

// export function init(document: any) {
//   if (WebGPU.isAvailable() === false) {
//     document.body.appendChild(WebGPU.getErrorMessage())

//     throw new Error('No WebGPU support')
//   }

//   const renderer = new WebGPURenderer({ antialias: true })
//   renderer.setPixelRatio(document.window.devicePixelRatio)
//   renderer.setSize(document.window.innerWidth, document.window.innerHeight)
//   renderer.setAnimationLoop(animation)
//   renderer.toneMapping = THREE.ACESFilmicToneMapping
//   document.body.appendChild(renderer.domElement)

//   document.window.addEventListener('resize', onWindowResized)

//   const stats = new Stats()
//   document.body.appendChild(stats.dom)

//   const camera = new THREE.PerspectiveCamera(60, document.window.innerWidth / document.window.innerHeight, 1, 1000)
//   camera.position.z = 75

//   const scene = new THREE.Scene()

//   const uvTexture = new THREE.TextureLoader().load('./textures/uv_grid_opengl.jpg')

//   const rgbmUrls = ['px.png', 'nx.png', 'py.png', 'ny.png', 'pz.png', 'nz.png']
//   const texture = new RGBMLoader()
//     .setMaxRange(16)
//     .setPath('./textures/cube/pisaRGBM16/')
//     .loadCubemap(rgbmUrls)

//   texture.name = 'pisaRGBM16'
//   texture.minFilter = THREE.LinearMipmapLinearFilter
//   texture.magFilter = THREE.LinearFilter

//   scene.background = texture
//   scene.environment = texture

//   //

//   const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(256)
//   cubeRenderTarget.texture.type = THREE.HalfFloatType
//   cubeRenderTarget.texture.minFilter = THREE.LinearMipmapLinearFilter
//   cubeRenderTarget.texture.magFilter = THREE.LinearFilter
//   cubeRenderTarget.texture.generateMipmaps = true

//   const cubeCamera = new THREE.CubeCamera(1, 1000, cubeRenderTarget)

//   //

//   const material = new Nodes.MeshStandardNodeMaterial({
//     envMap: cubeRenderTarget.texture,
//     roughness: 0.05,
//     metalness: 1,
//   })

//   const gui = new GUI()
//   gui.add(material, 'roughness', 0, 1)
//   gui.add(material, 'metalness', 0, 1)
//   gui.add(renderer, 'toneMappingExposure', 0, 2).name('exposure')

//   const sphere = new THREE.Mesh(new THREE.IcosahedronGeometry(15, 8), material)
//   scene.add(sphere)

//   const material2 = new THREE.MeshStandardMaterial({
//     map: uvTexture,
//     roughness: 0.1,
//     metalness: 0,
//   })

//   const cube = new THREE.Mesh(new THREE.BoxGeometry(15, 15, 15), material2)
//   scene.add(cube)

//   const torus = new THREE.Mesh(new THREE.TorusKnotGeometry(8, 3, 128, 16), material2)
//   scene.add(torus)

//   //

//   const controls = new OrbitControls(camera, renderer.domElement)
//   controls.autoRotate = true
// }

// function onWindowResized() {
//   renderer.setSize(document.window.innerWidth, document.window.innerHeight)

//   camera.aspect = document.window.innerWidth / document.window.innerHeight
//   camera.updateProjectionMatrix()
// }

// function animation(msTime) {
//   const time = msTime / 1000

//   cube.position.x = Math.cos(time) * 30
//   cube.position.y = Math.sin(time) * 30
//   cube.position.z = Math.sin(time) * 30

//   cube.rotation.x += 0.02
//   cube.rotation.y += 0.03

//   torus.position.x = Math.cos(time + 10) * 30
//   torus.position.y = Math.sin(time + 10) * 30
//   torus.position.z = Math.sin(time + 10) * 30

//   torus.rotation.x += 0.02
//   torus.rotation.y += 0.03

//   material.visible = false

//   cubeCamera.update(renderer, scene)

//   material.visible = true

//   controls.update()

//   renderer.render(scene, camera)

//   stats.update()
// }
