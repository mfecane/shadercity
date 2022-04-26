import RendererCode from 'ts/renderer/renderer'
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

export class ShaderModel {
  renderer: RendererCode
  name = ''
  code = ''
  source = ''
  id = ''
  user: UserState = null
  likes: string[] = []
  updated: FieldValue = null

  // tokens
  uniforms: string[] = []
  libararies: string[] = []
  textures: string[] = []
  cubemaps: string[] = []
  builtins: Builtins = {}
  values: ShaderValues = {}

  constructor(data: ShaderState) {
    this.name = data.name
    this.code = data.code
    this.user = data.user as UserState
    this.likes = data.likes
    this.updated = data.updated
    this.id = data.id
    this.values = { ...data.values }

    this.setSource(this.code)
    // this.setValuesMap(data.uniforms)
  }

  clone(): ShaderModel {
    const newmodel = new ShaderModel({
      id: this.id,
      name: this.name,
      code: this.code,
      user: this.user,
      likes: this.likes,
      updated: this.updated,
      values: this.values,
    })

    return newmodel
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
    }
    return res
  }

  updateShader(data: ShaderState): void {
    this.name = data.name
    this.code = data.code
    this.user = data.user as UserState
    this.likes = data.likes
    this.updated = data.updated
    this.id = data.id

    this.setSource(this.code)
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

  validate(): string[] {
    const canvas = document.createElement(`canvas`)
    canvas.id = 'tmp'
    const gl = canvas.getContext('webgl2')
    const fragShader = gl.createShader(gl.FRAGMENT_SHADER)
    gl.shaderSource(fragShader, this.source)
    gl.compileShader(fragShader)
    if (!gl.getShaderParameter(fragShader, gl.COMPILE_STATUS)) {
      const error = gl.getShaderInfoLog(fragShader).replace(/\x00/g, '').trim()
      return error.split('\n')
    }
    return null
  }

  createRenerer(root: HTMLDivElement): RendererCode {
    const options = {
      vertexSource,
      fragmentSource: this.source,
      shaderModel: this,
    }

    try {
      this.renderer = new RendererCode(root, options)
      this.renderer.init()
    } catch (e) {
      console.error('Error creating renderer ', e)
      this.renderer.destroy()
      return
    }

    this.renderer.mount()
    return this.renderer
  }

  // add uniforms to source
  prepareSource(code: string): string {
    let src = fragmentSourceTemplate as string

    const librariesSrc = this.libararies
      .map((lib) => {
        if (libs[lib]) {
          code = code.replace(`lib_${lib}`, '')
          return `${libs[lib]}`
        }
      })
      .join('\n')

    let uniformSrc = this.uniforms
      .map((uni) => {
        return `uniform float u_${uni};\n`
      })
      .join('\n')

    uniformSrc +=
      this.textures.map((tex) => `uniform sampler2D u_${tex};`).join('\n') +
      '\n'

    uniformSrc +=
      this.cubemaps.map((tex) => `uniform samplerCube u_${tex};`).join('\n') +
      '\n'

    Object.keys(this.builtins).forEach((bui) => {
      switch (bui) {
        case 'mouse':
          uniformSrc += `uniform float u_mouseX;
            uniform float u_mouseY;
            uniform float u_mouseScroll;\n`
          return
        case 'time':
          uniformSrc += `uniform float u_time;`
          return
      }
    })

    src = src.replace('[uniforms]', uniformSrc)
    src = src.replace('[libs]', librariesSrc)
    src = src.replace('[getColor]', code)

    return src
  }

  setShaderParameter(token: string, value: number): void {
    this.values[token] = value
  }

  parseTokens(code: string): void {
    const tokens = code.match(/[a-zA-Z0-9_]+/g)

    this.libararies = []
    this.uniforms = []
    this.cubemaps = []
    this.textures = []
    this.builtins = {}

    tokens.forEach((tok) => {
      const index = this.uniforms.findIndex((uni) => uni.token === tok)
      if (index !== -1) return

      if (tok.startsWith('lib_')) {
        const name = tok.slice(4) as keyof typeof libs
        this.libararies.push(name)
        return
      }

      if (tok.startsWith('u_cube_')) {
        const match = new RegExp('u_(cube[0-9A-Za-z_]+)', 'g').exec(tok)
        this.cubemaps.push(match[1])
        return
      }

      if (tok.startsWith('u_tex_')) {
        const match = new RegExp('u_(tex[0-9A-Za-z_]+)', 'g').exec(tok)
        this.textures.push(match[1])
        return
      }

      if (tok === 'u_time') {
        return (this.builtins.time = true)
      }

      if (tok === 'u_mouseX' || tok === 'u_mouseY' || tok === 'u_mouseScroll') {
        return (this.builtins.mouse = true)
      }

      if (tok.startsWith('u_')) {
        return this.uniforms.push(tok.slice(2))
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
    return this.values[name]
  }

  destroy(): void {
    this.renderer.destroy()
  }
}
