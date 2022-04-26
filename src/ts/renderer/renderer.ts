import { ShaderModel, Uniform } from 'ts/model/shader-model'
import { getShaderParameter } from 'ts/model/shader-parameters'
import Shader from 'ts/webgl/shader'
import Texture from 'ts/webgl/texture'
import TextureCube from 'ts/webgl/texture-cube'

import { getMouseControl } from 'ts/renderer/orbit-control'
import { textures } from 'ts/model/textures'

interface Options {
  vertexSource: string
  fragmentSource: string
}

export default class RendererCode {
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
  textureCubes: TextureCube[] = null

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

  init(): void {
    this.vertexSource = this.options.vertexSource
    this.fragmentSource = this.options.fragmentSource

    this.mainShader = new Shader(this.gl)
    this.mainShader.createProgram(this.vertexSource, this.fragmentSource)

    this.createSquarePositions()

    this.mainShader.useProgram()
    this.mainShader.setPositions('aPos')

    this.initUniforms()
    this.initTextures()
  }

  mount(): void {
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

  initTextures(): void {
    this.uniforms.forEach((uni) => {
      if (uni.type === 'texture' && uni.value) {
        const texture = new Texture(this.gl)
        const url = textures[uni.value]
        texture.fromUrl(url)
        this.textures.push(texture)
        uni.value = this.textures.length - 1
      }
    })
  }

  initUniforms(): void {
    this.mainShader.addUniform('u_MVP', '4fv')
    this.mainShader.addUniform('u_time', '1f')
    this.uniforms.forEach(({ type, name, token }) => {
      switch (type) {
        case 'texture':
          return this.mainShader.addUniform(`${token}`, '1i')
        case 'time':
          return this.mainShader.addUniform('u_time', '1f')
        case 'float':
          return this.mainShader.addUniform(`u_${name}`, '1f')
        case 'mouse':
          this.useMouseControls = true
          this.mainShader.addUniform(`u_mouseX`, '1f')
          this.mainShader.addUniform(`u_mouseY`, '1f')
          this.mainShader.addUniform(`u_mouseScroll`, '1f')
          return
      }
    })

    // this.mainShader.addUniform('u_mouseX', '1f')
    // this.mainShader.addUniform('u_mouseY', '1f')
    // this.mainShader.addUniform('u_scrollValue', '1f')
    // this.mainShader.addUniform('u_quality', '1f')

    // this.mainShader.addUniform('u_Sampler', '1i')
    // this.mainShader.addUniform('u_Sampler2', '1i')
  }

  addUniform(uni: Uniform): void {
    this.uniforms.push({ ...uni })
  }

  setUniformValue(name: string, value: number): void {
    const u = this.uniforms.find(({ name: n }) => n === name)
    u && (u.value = value)
  }

  setUniforms(): void {
    const [mouseX, mouseY, scrollValue] = getMouseControl()
    this.time = (Date.now() - this.startTime) / 1000

    this.mainShader.setUniform('u_MVP', this.proj)
    this.mainShader.setUniform('u_time', this.time)

    if (this.useMouseControls) {
      this.mainShader.setUniform('u_mouseX', mouseX)
      this.mainShader.setUniform('u_mouseY', mouseY)
      this.mainShader.setUniform('u_mouseScroll', scrollValue)
    }

    this.mainShader.setUniform('u_quality', 1.0)

    this.uniforms.forEach(({ type, name, token, value }) => {
      switch (type) {
        case 'texture': {
          const tex = this.textures[value as number]
          if (tex) {
            this.gl.activeTexture(this.gl.TEXTURE1)
            this.gl.bindTexture(
              this.gl.TEXTURE_2D,
              this.textures[value as number].texture
            )
            return this.mainShader.setUniform('u_Sampler', 1)
          }
        }

        case 'time':
          return this.mainShader.setUniform('u_time', this.time)

        case 'float': {
          // const value = getShaderParameter(token)
          return this.mainShader.setUniform(`u_${name}`, value)
        }
      }
    })

    // if (this.options.texture) {
    //   this.gl.activeTexture(this.gl.TEXTURE0)
    //   this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture.texture)
    //   this.mainShader.setUniform('u_Sampler', 0)
    // }

    // if (this.options.textureCube) {
    //   this.gl.activeTexture(this.gl.TEXTURE1)
    //   this.gl.bindTexture(this.gl.TEXTURE_CUBE_MAP, this.textureCube.texture)
    //   this.mainShader.setUniform('u_Sampler2', 1)
    // }

    // // TODO ::: should i do this every time?
    // this.gl.activeTexture(this.gl.TEXTURE0)
    // this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture.texture)
    // this.mainShader.setUniform('u_Sampler', 0)
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
