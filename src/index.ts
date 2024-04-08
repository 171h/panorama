/* eslint-disable ts/no-use-before-define */
import * as THREE from 'three'
import Stats from 'three/addons/libs/stats.module.js'
import { GUI } from 'three/addons/libs/lil-gui.module.min.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { EXRLoader } from 'three/addons/loaders/EXRLoader.js'
import { defu } from 'defu'

export function panorama($el: HTMLElement, options?: any) {
  const panorama = new Panorama($el, options)
  const animate = () => {
    requestAnimationFrame(animate)
    panorama.stats.begin()
    panorama.render()
    panorama.stats.end()
  }
  animate()
}

class Panorama {
  params = {
    envMap: 'PNG',
    roughness: 0.0,
    metalness: 0.0,
    exposure: 1.0,
    debug: false,
  }

  el: HTMLElement
  container!: HTMLElement
  stats!: Stats
  camera!: THREE.PerspectiveCamera
  scene!: THREE.Scene
  renderer!: THREE.WebGLRenderer
  controls!: OrbitControls
  torusMesh!: THREE.Mesh
  planeMesh!: THREE.Mesh
  pngCubeRenderTarget!: any
  exrCubeRenderTarget!: any
  pngBackground!: any
  exrBackground!: any

  constructor(el: HTMLElement, options?: any) {
    this.el = el
    this.params = defu(options, this.params)
    this.init()
  }

  init() {
    this.camera = new THREE.PerspectiveCamera(40, this.el.offsetWidth / this.el.offsetHeight, 1, 1000)
    this.camera.position.set(0, 0, 120)

    this.scene = new THREE.Scene()

    this.renderer = new THREE.WebGLRenderer()
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setSize(this.el.offsetWidth, this.el.offsetHeight)

    this.el.appendChild(this.renderer.domElement)

    this.renderer.toneMapping = THREE.ACESFilmicToneMapping

    //

    const torusGeometry = new THREE.TorusKnotGeometry(18, 8, 150, 20)
    const torusMaterial = new THREE.MeshStandardMaterial({
      metalness: this.params.metalness,
      roughness: this.params.roughness,
      envMapIntensity: 1.0,
    })

    this.torusMesh = new THREE.Mesh(torusGeometry, torusMaterial)
    this.scene.add(this.torusMesh)

    const geometry = new THREE.PlaneGeometry(200, 200)
    const material = new THREE.MeshBasicMaterial()

    this.planeMesh = new THREE.Mesh(geometry, material)
    this.planeMesh.position.y = -50
    this.planeMesh.rotation.x = -Math.PI * 0.5
    this.scene.add(this.planeMesh)
    THREE.DefaultLoadingManager.onLoad = function () {
      pmremGenerator.dispose()
    }

    new EXRLoader().load('../piz_compressed.exr', (texture) => {
      texture.mapping = THREE.EquirectangularReflectionMapping

      this.exrCubeRenderTarget = pmremGenerator.fromEquirectangular(texture)
      this.exrBackground = texture
    })

    new THREE.TextureLoader().load('DJI_0917.JPG', (texture) => {
      texture.mapping = THREE.EquirectangularReflectionMapping
      texture.colorSpace = THREE.SRGBColorSpace

      this.pngCubeRenderTarget = pmremGenerator.fromEquirectangular(texture)
      this.pngBackground = texture
    })

    const pmremGenerator = new THREE.PMREMGenerator(this.renderer)
    pmremGenerator.compileEquirectangularShader()

    this.stats = new Stats()
    this.el.appendChild(this.stats.dom)

    this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    this.controls.minDistance = 50
    this.controls.maxDistance = 300

    this.el.addEventListener('resize', this.onWindowResize)

    const gui = new GUI()

    gui.add(this.params, 'envMap', ['EXR', 'PNG'])
    gui.add(this.params, 'roughness', 0, 1, 0.01)
    gui.add(this.params, 'metalness', 0, 1, 0.01)
    gui.add(this.params, 'exposure', 0, 2, 0.01)
    gui.add(this.params, 'debug')
    gui.open()
  }

  onWindowResize() {
    const width = this.el.offsetWidth
    const height = this.el.offsetHeight

    this.camera.aspect = width / height
    this.camera.updateProjectionMatrix()

    this.renderer.setSize(width, height)
  }

  animate() {
    requestAnimationFrame(() => this.animate)

    this.stats.begin()
    this.render()
    this.stats.end()
  }

  render() {
    this.torusMesh.material.roughness = this.params.roughness
    this.torusMesh.material.metalness = this.params.metalness

    let newEnvMap = this.torusMesh.material.envMap
    let background = this.scene.background

    switch (this.params.envMap) {
      case 'EXR':
        newEnvMap = this.exrCubeRenderTarget ? this.exrCubeRenderTarget.texture : null
        background = this.exrBackground
        break
      case 'PNG':
        newEnvMap = this.pngCubeRenderTarget ? this.pngCubeRenderTarget.texture : null
        background = this.pngBackground
        break
    }

    if (newEnvMap !== this.torusMesh.material.envMap) {
      this.torusMesh.material.envMap = newEnvMap
      this.torusMesh.material.needsUpdate = true

      this.planeMesh.material.map = newEnvMap
      this.planeMesh.material.needsUpdate = true
    }

    this.torusMesh.rotation.y += 0.005
    this.planeMesh.visible = this.params.debug

    this.scene.background = background
    this.renderer.toneMappingExposure = this.params.exposure

    this.renderer.render(this.scene, this.camera)
  }
}
