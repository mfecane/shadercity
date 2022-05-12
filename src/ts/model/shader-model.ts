import Renderer from 'ts/renderer/renderer'
import { ShaderState, ShaderValues, UserState } from 'ts/hooks/use-store'
import { FieldValue } from '@google-cloud/firestore'

import vertexSource from 'shaders/square.vert'
import fragmentSourceTemplate from 'shaders/shader-template.frag'

import libSource from 'shaders/chunks/lib.glsl'
import distancesSource from 'shaders/chunks/distances.glsl'
import colorSource from 'shaders/chunks/color.glsl'
import simplexSource from 'shaders/chunks/simplex.glsl'
import spaceSource from 'shaders/chunks/space.glsl'
import spiralNoiseSource from 'shaders/chunks/spiral-noise.glsl'
import hashSource from 'shaders/chunks/hash.glsl'
import simplexNoise from 'shaders/chunks/simplex_noise.glsl'

const libs: {
  [key: string]: string
} = {
  lib: libSource,
  distances: distancesSource,
  color: colorSource,
  simplex: simplexSource,
  space: spaceSource,
  spiralNoise: spiralNoiseSource,
  hash: hashSource,
  simplex_noise: simplexNoise,
}

const pushUniq = <T>(arr: T[], value: T): void => {
  if (arr.includes(value)) return
  arr.push(value)
}

vertexSource as string

export interface Uniform {
  name?: string
  token: string
}

export interface Texture {
  name?: string
  token: string
}

export interface Cubemap {
  name?: string
  token: string
}

export interface Builtins {
  [key: string]: any
}

export interface Libarary {
  name?: keyof typeof libs
  token: string
}

export interface ShaderError {
  line: number
  text: string
}

export class ShaderModel {
  renderer: Renderer
  name = ''
  code = ''
  source = ''
  sourceOffset = 0
  id = ''
  user: UserState = null
  likes: string[] = []
  updated: FieldValue = null
  featured: boolean
  daily: boolean
  steps: string[] = []

  values: ShaderValues = {}

  // tokens
  uniforms: string[] = []
  libararies: string[] = []
  textures: string[] = []
  cubemaps: string[] = []
  builtins: Builtins = {}

  constructor(data: ShaderState) {
    this.name = data.name
    this.code = data.code
    this.user = data.user as UserState
    this.likes = data.likes
    this.updated = data.updated
    this.id = data.id
    this.featured = data.featured
    this.daily = data.daily
    this.id = data.id
    this.steps = data.steps || []
    this.values = { ...data.values }
    this.setSource(this.code)
    // this.setValuesMap(data.uniforms)
  }

  clone(): ShaderModel {
    return new ShaderModel(this.toState())
  }

  setStep(step?: number): number {
    if (!this.steps.length) return

    if (typeof step === 'number' && step < this.steps.length) {
      this.code = this.steps[step]
    }
  }

  addStep(): void {
    this.steps.push(this.code)
  }

  removeStep(index: number): void {
    this.steps.splice(index, 1)
  }

  toState(): ShaderState {
    // store values
    // const uniformValues = this.getValuesMap()
    const res = {
      id: this.id,
      name: this.name,
      code: this.code,
      user: this.user,
      likes: this.likes,
      updated: this.updated,
      values: this.values,
      daily: this.daily,
      featured: this.featured,
      steps: this.steps,
    }
    return res
  }

  cleanValues(): void {
    Object.keys(this.values).forEach((key) => {
      if (
        this.uniforms.includes(key) ||
        this.textures.includes(key) ||
        this.cubemaps.includes(key)
      )
        return

      delete this.values[key]
    })
  }

  setSource(code: string): void {
    if (!code || !(typeof code === 'string')) throw new Error('Invalid code')
    this.code = code
    this.parseTokens(this.code)
    this.cleanValues()
    this.source = this.prepareSource(this.code)
  }

  validate(): ShaderError[] {
    const canvas = document.createElement(`canvas`)
    canvas.id = 'tmp'
    const gl = canvas.getContext('webgl2')
    const fragShader = gl.createShader(gl.FRAGMENT_SHADER)
    gl.shaderSource(fragShader, this.source)
    gl.compileShader(fragShader)
    if (!gl.getShaderParameter(fragShader, gl.COMPILE_STATUS)) {
      return this.parseErrors(gl, fragShader)
    }
    return null
  }

  parseErrors(gl: WebGL2RenderingContext, shader: WebGLShader): ShaderError[] {
    const re = RegExp('ERROR:\\s+\\d+:(\\d+)\\:\\s+(.*)', 'g')
    // eslint-disable-next-line
    const error = gl.getShaderInfoLog(shader).replace(/\x00/g, '').trim()
    let res
    const errors: ShaderError[] = []
    while ((res = re.exec(error))) {
      if (res && res[1]) {
        let line = parseInt(res[1], 10) - 2
        line -= this.sourceOffset
        if (!isNaN(line)) {
          errors.push({ line: line, text: res[2] })
        }
      }
    }
    return errors
  }

  async createRenerer(root: HTMLDivElement, active = false): Promise<Renderer> {
    const options = {
      vertexSource,
      fragmentSource: this.source,
      shaderModel: this,
    }

    let renderer: Renderer

    try {
      renderer = new Renderer(root, options)
      await renderer.init()
    } catch (e) {
      console.error('Error creating renderer ', e)
      renderer.destroy()
      renderer = null
      return
    }

    renderer.mount(active)
    return renderer
  }

  // add uniforms to source
  prepareSource(code: string): string {
    let src = fragmentSourceTemplate as string
    let sourceOffset = 14

    let arr: string[] = []
    this.libararies.forEach((lib) => {
      if (libs[lib]) {
        code = code.replace(`lib_${lib}`, '')
        arr = arr.concat(libs[lib].split('\n'))
      }
    })
    sourceOffset += arr.length
    const librariesSrc = arr.join('\n')

    arr = this.uniforms.map((uni) => {
      return `uniform float u_${uni};\n`
    })
    sourceOffset += arr.length
    let uniformSrc = arr.join('\n')

    arr = this.textures.map((tex) => `uniform sampler2D u_${tex};`)
    sourceOffset += arr.length
    uniformSrc += arr.join('\n')

    arr = this.cubemaps.map((tex) => `uniform samplerCube u_${tex};`)
    sourceOffset += arr.length
    uniformSrc += arr.join('\n')

    Object.keys(this.builtins).forEach((bui) => {
      switch (bui) {
        case 'mouse':
          uniformSrc += `uniform float u_mouseX;
            uniform float u_mouseY;
            uniform float u_mouseScroll;\n`
          sourceOffset += 3
          return
        case 'time':
          uniformSrc += `uniform float u_time;`
          sourceOffset++
          return
      }
    })

    src = src.replace('[uniforms]', uniformSrc)
    src = src.replace('[libs]', librariesSrc)
    src = src.replace('[getColor]', code)

    this.sourceOffset = sourceOffset
    return src
  }

  setShaderParameter(token: string, value: number): void {
    this.values[token] = value
  }

  hasMouseControls(): boolean {
    return 'mouse' in this.builtins
  }

  parseTokens(code: string): void {
    const tokens = code.match(/[a-zA-Z0-9_]+/g)

    this.libararies = []
    this.uniforms = []
    this.cubemaps = []
    this.textures = []
    this.builtins = {}

    tokens.forEach((tok) => {
      if (tok.startsWith('lib_')) {
        const name = tok.slice(4) as keyof typeof libs
        pushUniq(this.libararies, name)
        return
      }

      if (tok.startsWith('u_cube_')) {
        const match = new RegExp('u_(cube[0-9A-Za-z_]+)', 'g').exec(tok)
        pushUniq(this.cubemaps, match[1])
        return
      }

      if (tok.startsWith('u_tex_')) {
        const match = new RegExp('u_(tex[0-9A-Za-z_]+)', 'g').exec(tok)
        pushUniq(this.textures, match[1])
        return
      }

      if (tok === 'u_time') {
        return (this.builtins.time = true)
      }

      if (tok === 'u_mouseX' || tok === 'u_mouseY' || tok === 'u_mouseScroll') {
        return (this.builtins.mouse = true)
      }

      if (tok.startsWith('u_')) {
        pushUniq(this.uniforms, tok.slice(2))
      }
    })
  }

  getUniformList(): { name: string; type: string }[] {
    return [
      ...this.uniforms.map((el) => ({ name: el, type: 'float' })),
      ...this.textures.map((el) => ({ name: el, type: 'texture' })),
      ...this.cubemaps.map((el) => ({ name: el, type: 'cubemap' })),
    ]
  }

  getUniformValue(name: string): number {
    return this.values[name] || 0.5
  }

  // destroy(): void {
  //   renderer.destroy()
  //   renderer = null
  // }
}
