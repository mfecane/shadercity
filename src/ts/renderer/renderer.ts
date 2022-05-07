import { ShaderModel, Uniform } from 'ts/model/shader-model'
import { getShaderParameter } from 'ts/model/shader-parameters'
import Shader from 'ts/webgl/shader'
import Texture from 'ts/webgl/texture'
import TextureCube from 'ts/webgl/texture-cube'

import { getMouseControl } from 'ts/renderer/orbit-control'
import { textures } from 'ts/resources/textures'
import { cubemaps } from 'ts/resources/cubemaps'

interface Options {
  vertexSource: string
  fragmentSource: string
  shaderModel: ShaderModel
}

const getTexture = function (gl: WebGL2RenderingContext) {
  let index = 0
  const text = [
    gl.TEXTURE1,
    gl.TEXTURE2,
    gl.TEXTURE3,
    gl.TEXTURE4,
    gl.TEXTURE5,
    gl.TEXTURE6,
    gl.TEXTURE7,
    gl.TEXTURE8,
    gl.TEXTURE9,
  ]

  return function (): [index: number, id: number] {
    const res: [index: number, id: number] = [index + 1, text[index]]
    index++
    return res
  }
}

export default class Renderer {
  width = 0
  height = 0
  vertexSource = ''
  fragmentSource = ''
  root: HTMLDivElement = null
  gl: WebGL2RenderingContext = null
  canvas: HTMLCanvasElement = null
  proj: number[] = null
  animId: number = null
  options: Options

  startTime = Date.now()
  time = this.startTime

  fpsHistory: number[] = []
  fps = 0.0
  fpsTime = Date.now()

  mainShader: Shader

  parameters = {}

  uniforms: Uniform[] = []
  textures: Texture[] = []
  cubemaps: TextureCube[] = []

  useMouseControls = false

  shaderModel: ShaderModel

  constructor(root: HTMLDivElement, options: Options) {
    this.options = options
    this.shaderModel = options.shaderModel
    this.root = root
    if (!this.root) return

    this.canvas = document.createElement(`canvas`)
    // this.canvas.id = 'canvas'

    this.gl = this.canvas.getContext('webgl2')

    this.setCanvasSize()

    window.addEventListener('resize', this.setCanvasSize.bind(this))
    window.addEventListener('resize-event', this.setCanvasSize.bind(this))
  }

  async init(): Promise<void> {
    this.vertexSource = this.options.vertexSource
    this.fragmentSource = this.options.fragmentSource

    this.mainShader = new Shader(this.gl)
    this.mainShader.createProgram(this.vertexSource, this.fragmentSource)

    this.createSquarePositions()

    this.mainShader.useProgram()
    this.mainShader.setPositions('aPos')

    this.initUniforms()
    await this.initTextures()
    await this.initCubemaps()
  }

  mount(active = false): void {
    this.canvas.classList.toggle('activeCanvas', active)
    this.root.appendChild(this.canvas)
  }

  createSquarePositions(): void {
    const vertexBuffer = this.gl.createBuffer()
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vertexBuffer)

    // prettier-ignore
    const positions = [
        -1.0, -1.0,
         1.0, -1.0,
         1.0,  1.0,
        -1.0,  1.0
      ];
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array(positions),
      this.gl.STATIC_DRAW
    )

    const indexBuffer = this.gl.createBuffer()
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, indexBuffer)

    // prettier-ignore
    const indices = [
        0, 1, 2,
        2, 3, 0
      ];

    this.gl.bufferData(
      this.gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array(indices),
      this.gl.STATIC_DRAW
    )
  }

  initTextures(): Promise<void[]> {
    const promises = this.shaderModel.textures.map(async (tex) => {
      const texture = new Texture(this.gl)
      const textureIndex = this.shaderModel.values[tex]
      const url = textures[textureIndex]

      await texture.fromUrl(url)
      this.textures.push(texture)
    })

    return Promise.all(promises)
  }

  initCubemaps(): Promise<void[]> {
    const promises = this.shaderModel.cubemaps.map(async (tex) => {
      const cubemap = new TextureCube(this.gl)
      const textureIndex = this.shaderModel.values[tex]

      if (typeof textureIndex === 'undefined') return

      const url = cubemaps[textureIndex]

      await cubemap.fromSources(url)
      this.cubemaps.push(cubemap)
    })

    return Promise.all(promises)
  }

  initUniforms(): void {
    this.mainShader.addUniform('u_MVP', '4fv')

    this.shaderModel.uniforms.forEach((uni) => {
      return this.mainShader.addUniform(`u_${uni}`, '1f')
    })

    this.shaderModel.textures.forEach((uni) => {
      return this.mainShader.addUniform(`u_${uni}`, '1i')
    })

    this.shaderModel.cubemaps.forEach((uni) => {
      return this.mainShader.addUniform(`u_${uni}`, '1i')
    })

    Object.keys(this.shaderModel.builtins).forEach((key) => {
      switch (key) {
        case 'time':
          return this.mainShader.addUniform('u_time', '1f')
        case 'mouse':
          this.mainShader.addUniform(`u_mouseX`, '1f')
          this.mainShader.addUniform(`u_mouseY`, '1f')
          this.mainShader.addUniform(`u_mouseScroll`, '1f')
          return
      }
    })
  }

  setUniforms(): void {
    this.time = (Date.now() - this.startTime) / 1000

    this.mainShader.setUniform('u_MVP', this.proj)

    const _getTexture = getTexture(this.gl)

    this.shaderModel.textures.forEach((tex, index) => {
      const tx = this.textures[index]
      if (tx) {
        const [textureIndex, textureID] = _getTexture()
        this.gl.activeTexture(textureID)
        this.gl.bindTexture(this.gl.TEXTURE_2D, tx.texture)
        return this.mainShader.setUniform(`u_${tex}`, textureIndex)
      }
    })

    this.shaderModel.cubemaps.forEach((tex, index) => {
      // FIX dumb hack
      index = index + 1
      const cb = this.cubemaps[index]
      if (cb) {
        const [textureIndex, textureID] = _getTexture()
        this.gl.activeTexture(textureID)
        this.gl.bindTexture(this.gl.TEXTURE_2D, cb.texture)
        return this.mainShader.setUniform(`u_${tex}`, textureIndex)
      }
    })

    this.shaderModel.uniforms.forEach((uni) => {
      return this.mainShader.setUniform(
        `u_${uni}`,
        this.shaderModel.getUniformValue(uni)
      )
    })

    Object.keys(this.shaderModel.builtins).forEach((key) => {
      switch (key) {
        case 'time':
          return this.mainShader.setUniform('u_time', this.time)
        case 'mouse': {
          const [mouseX, mouseY, scrollValue] = getMouseControl()

          this.mainShader.setUniform('u_mouseX', mouseX)
          this.mainShader.setUniform('u_mouseY', mouseY)
          this.mainShader.setUniform('u_mouseScroll', scrollValue)
          return
        }
      }
    })
  }

  renderFrame(): void {
    this.proj = this.calculateMVP(this.width, this.height)

    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null)
    this.setUniforms()

    this.gl.clearColor(0.0, 0.0, 0.0, 1.0)
    this.gl.clear(this.gl.COLOR_BUFFER_BIT)
    this.gl.drawElements(this.gl.TRIANGLES, 6, this.gl.UNSIGNED_SHORT, 0)
  }

  calculateMVP(width: number, height: number): number[] {
    const left = -width / height
    const right = width / height

    const bottom = -1.0
    const top = 1.0

    const near = -1.0
    const far = 1.0

    // prettier-ignore
    return [
      2 / (right - left),                   0,                 0,  -(right + left) / (right - left),
                       0,  2 / (top - bottom),                 0,  -(top + bottom) / (top - bottom),
                       0,                   0,  2 / (far - near),    -(far + near) /   (far - near),
                       0,                   0,                 0,                                 1,
    ];
  }

  setCanvasSize(): void {
    this.width = this.root.clientWidth
    this.height = this.root.clientHeight

    this.canvas.width = this.width
    this.canvas.height = this.height
    this.canvas.style.width = `${this.width}px`
    this.canvas.style.height = `${this.height}px`
    this.gl.viewport(0, 0, this.width, this.height)
  }

  updateFps(): void {
    const now = Date.now()
    if (now === this.fpsTime) {
      return
    }
    this.fpsHistory.push(1000.0 / (now - this.fpsTime))
    this.fpsTime = now
    if (this.fpsHistory.length < 10) {
      return
    }
    this.fps =
      Math.floor(
        this.fpsHistory.reduce((acc, cur) => {
          return (acc + cur) / 2
        }) * 100
      ) / 100
    this.fpsHistory.unshift()
  }

  animate(): void {
    this.renderFrame()
    this.updateFps()
    this.animId = requestAnimationFrame(this.animate.bind(this))
  }

  destroy(): void {
    if (this.root.contains(this.canvas)) {
      this.root.removeChild(this.canvas)
      window.removeEventListener('resize', this.setCanvasSize.bind(this))
      cancelAnimationFrame(this.animId)
    } else {
      console.info('Check: canvas is not child of root')
    }
  }
}

