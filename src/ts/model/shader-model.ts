import RendererCode from 'ts/renderer/renderer'
import { ShaderState, UserState } from 'ts/hooks/use-store'
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

const defaultUniforms = ['u_time']

const libs = {
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
  type: 'float' | 'mouse' | 'time' | 'texture' | 'cubemap'
  name?: string
  value?: number
  token: string
}

export interface Libarary {
  name?: keyof typeof libs
  token: string
}

export class ShaderModel {
  uniforms: Uniform[] = []
  libararies: Libarary[] = []
  renderer: RendererCode
  name = ''
  code = ''
  source = ''
  id = ''
  user: UserState = null
  likes: string[] = []
  updated: FieldValue = null

  constructor(data: ShaderState) {
    this.name = data.name
    this.code = data.code
    this.user = data.user as UserState
    this.likes = data.likes
    this.updated = data.updated
    this.id = data.id

    this.setSource(this.code)
  }

  clone(): ShaderModel {
    return new ShaderModel({
      id: this.id,
      name: this.name,
      code: this.code,
      user: this.user,
      likes: this.likes,
      updated: this.updated,
    })
  }

  toState(): ShaderState {
    return {
      id: this.id,
      name: this.name,
      code: this.code,
      user: this.user,
      likes: this.likes,
      updated: this.updated,
    }
  }

  updateShader(data) {
    this.name = data.name
    this.code = data.code
    this.user = data.user as UserState
    this.likes = data.likes
    this.updated = data.updated
    this.id = data.id

    this.setSource(this.code)
  }

  setSource(code: string): void {
    if (!code || !(typeof code === 'string')) throw new Error('Invalid code')
    this.code = code
    this.parseTokens(this.code)
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
    }

    try {
      this.renderer = new RendererCode(root, options)
      this.uniforms.forEach((uni) => {
        this.renderer.addUniform(uni)
      })
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
        if (libs[lib.name]) {
          code = code.replace(lib.token, '')
          return libs[lib.name]
        }
      })
      .join('\n')

    // TODO  Refactor this shit
    let addMouseControls = true

    let uniformSrc = this.uniforms
      .map((uni) => {
        switch (uni.type) {
          case 'float':
            return `uniform float ${uni.token as string};`
          case 'time':
            return `uniform float u_time;`
          case 'mouse':
            addMouseControls = true
            return
        }
      })
      .join('\n')

    if (addMouseControls) {
      uniformSrc += `uniform float u_mouseX;
        uniform float u_mouseY;
        uniform float u_mouseScroll;\n`
    }

    src = src.replace('[uniforms]', uniformSrc)
    src = src.replace('[libs]', librariesSrc)
    src = src.replace('[getColor]', code)

    return src
  }

  parseTokens(code: string): void {
    const tokens = code.match(/[a-zA-Z0-9_]+/g)

    this.libararies = []
    this.uniforms = []

    tokens.forEach((tok) => {
      const index = this.uniforms.findIndex((uni) => uni.token === tok)
      if (index !== -1) return

      if (tok.startsWith('lib_')) {
        const name = tok.slice(4) as keyof typeof libs
        this.libararies.push({ token: tok, name: name })
        return
      }

      if (tok.startsWith('u_cube_')) {
        const match = new RegExp('u_(cube[[A-Za-z]_]+)', 'g').exec(tok)
        this.uniforms.push({ token: tok, type: 'texture', name: match[1] })
        return
      }

      if (tok.startsWith('u_tex_')) {
        const match = new RegExp('u_(tex[A-Za-z_]+)', 'g').exec(tok)
        this.uniforms.push({ token: tok, type: 'texture', name: match[1] })
        return
      }

      if (tok === 'u_time') {
        return this.uniforms.push({ token: tok, type: 'time', name: 'time' })
      }

      if (tok === 'u_mouseX') {
        return this.uniforms.push({ token: tok, type: 'mouse', name: 'mouseX' })
      }

      if (tok === 'u_mouseY') {
        return this.uniforms.push({ token: tok, type: 'mouse', name: 'mouseY' })
      }

      if (tok === 'u_mouseScroll') {
        return this.uniforms.push({
          token: tok,
          type: 'mouse',
          name: 'mouseScroll',
        })
      }

      if (tok.startsWith('u_')) {
        const name = tok.slice(2)
        if (!defaultUniforms.includes(tok)) {
          this.uniforms.push({ token: tok, type: 'float', name: name })
        }
      }
    })
  }

  destroy(): void {
    this.renderer.destroy()
  }
}
