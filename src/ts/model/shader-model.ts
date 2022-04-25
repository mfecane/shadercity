// TODO add tests

import RendererCode from 'ts/renderer/renderer'
import vertexSource from 'shaders/square.vert'
import fragmentSourceTemplate from 'shaders/shader-template.frag'

const defaultUniforms = ['u_time']

vertexSource as string

export interface Uniform {
  type: 'float' | 'mouse' | 'time' | 'texture' | 'cubemap'
  name?: string
  value?: number
  token: string
}

export class ShaderModel {
  uniforms: Uniform[] = []
  renderer: RendererCode
  code: string
  source: string

  setSource(code: string): void {
    if (!code || !(typeof code === 'string')) throw new Error('Invalid code')
    this.source = code
    this.parseTokens(code)
    this.source = this.prepareSource(code)
  }

  validate(): string {
    const canvas = document.createElement(`canvas`)
    canvas.id = 'tmp'

    const gl = canvas.getContext('webgl2')
    const fragShader = gl.createShader(gl.FRAGMENT_SHADER)
    gl.shaderSource(fragShader, this.source)
    gl.compileShader(fragShader)
    if (!gl.getShaderParameter(fragShader, gl.COMPILE_STATUS)) {
      const error = gl.getShaderInfoLog(fragShader).replace(/\x00/g, '').trim()
      return error
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
    src = src.replace('[getColor]', code)

    return src
  }

  // get uniforms from source
  parseTokens(code: string): void {
    const tokens = code.match(/[a-zA-Z0-9_]+/g)
    tokens.forEach((tok) => {
      // if (new RegExp('[^a-z0-9_]', 'g').exec(tok))
      //   throw new Error('invalid token')

      const index = this.uniforms.findIndex((uni) => uni.token === tok)
      if (index !== -1) return

      if (tok.startsWith('u_cube_')) {
        const match = new RegExp('u_(cube[[a-z]_]+)', 'g').exec(tok)
        // console.log('u_tex_ match', match[1])
        this.uniforms.push({ token: tok, type: 'texture', name: match[1] })
        return
      }

      if (tok.startsWith('u_tex_')) {
        const match = new RegExp('u_(tex[a-z_]+)', 'g').exec(tok)
        // console.log('u_tex_ match', match[1])
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
