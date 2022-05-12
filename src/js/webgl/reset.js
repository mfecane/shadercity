export default function resetToInitialState(ctx) {
  var isWebGL2RenderingContext = !!ctx.createTransformFeedback

  if (isWebGL2RenderingContext) {
    ctx.bindVertexArray(null)
  }

  var numAttribs = ctx.getParameter(ctx.MAX_VERTEX_ATTRIBS)
  var tmp = ctx.createBuffer()
  ctx.bindBuffer(ctx.ARRAY_BUFFER, tmp)
  for (var ii = 0; ii < numAttribs; ++ii) {
    ctx.disableVertexAttribArray(ii)
    ctx.vertexAttribPointer(ii, 4, ctx.FLOAT, false, 0, 0)
    ctx.vertexAttrib1f(ii, 0)
    if (isWebGL2RenderingContext) {
      ctx.vertexAttribDivisor(ii, 0)
    }
  }
  ctx.deleteBuffer(tmp)

  var numTextureUnits = ctx.getParameter(ctx.MAX_TEXTURE_IMAGE_UNITS)
  for (var ii = 0; ii < numTextureUnits; ++ii) {
    ctx.activeTexture(ctx.TEXTURE0 + ii)
    ctx.bindTexture(ctx.TEXTURE_CUBE_MAP, null)
    ctx.bindTexture(ctx.TEXTURE_2D, null)
    if (isWebGL2RenderingContext) {
      ctx.bindTexture(ctx.TEXTURE_2D_ARRAY, null)
      ctx.bindTexture(ctx.TEXTURE_3D, null)
      ctx.bindSampler(ii, null)
    }
  }

  ctx.activeTexture(ctx.TEXTURE0)
  ctx.useProgram(null)
  ctx.bindBuffer(ctx.ARRAY_BUFFER, null)
  ctx.bindBuffer(ctx.ELEMENT_ARRAY_BUFFER, null)
  ctx.bindFramebuffer(ctx.FRAMEBUFFER, null)
  ctx.bindRenderbuffer(ctx.RENDERBUFFER, null)
  ctx.disable(ctx.BLEND)
  ctx.disable(ctx.CULL_FACE)
  ctx.disable(ctx.DEPTH_TEST)
  ctx.disable(ctx.DITHER)
  ctx.disable(ctx.SCISSOR_TEST)
  ctx.blendColor(0, 0, 0, 0)
  ctx.blendEquation(ctx.FUNC_ADD)
  ctx.blendFunc(ctx.ONE, ctx.ZERO)
  ctx.clearColor(0, 0, 0, 0)
  ctx.clearDepth(1)
  ctx.clearStencil(-1)
  ctx.colorMask(true, true, true, true)
  ctx.cullFace(ctx.BACK)
  ctx.depthFunc(ctx.LESS)
  ctx.depthMask(true)
  ctx.depthRange(0, 1)
  ctx.frontFace(ctx.CCW)
  ctx.hint(ctx.GENERATE_MIPMAP_HINT, ctx.DONT_CARE)
  ctx.lineWidth(1)
  ctx.pixelStorei(ctx.PACK_ALIGNMENT, 4)
  ctx.pixelStorei(ctx.UNPACK_ALIGNMENT, 4)
  ctx.pixelStorei(ctx.UNPACK_FLIP_Y_WEBGL, false)
  ctx.pixelStorei(ctx.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false)
  // TODO: Delete this IF.
  if (ctx.UNPACK_COLORSPACE_CONVERSION_WEBGL) {
    ctx.pixelStorei(
      ctx.UNPACK_COLORSPACE_CONVERSION_WEBGL,
      ctx.BROWSER_DEFAULT_WEBGL
    )
  }
  ctx.polygonOffset(0, 0)
  ctx.sampleCoverage(1, false)
  ctx.scissor(0, 0, ctx.canvas.width, ctx.canvas.height)
  ctx.stencilFunc(ctx.ALWAYS, 0, 0xffffffff)
  ctx.stencilMask(0xffffffff)
  ctx.stencilOp(ctx.KEEP, ctx.KEEP, ctx.KEEP)
  ctx.viewport(0, 0, ctx.canvas.width, ctx.canvas.height)
  ctx.clear(
    ctx.COLOR_BUFFER_BIT | ctx.DEPTH_BUFFER_BIT | ctx.STENCIL_BUFFER_BIT
  )

  if (isWebGL2RenderingContext) {
    ctx.drawBuffers([ctx.BACK])
    ctx.readBuffer(ctx.BACK)
    ctx.bindBuffer(ctx.COPY_READ_BUFFER, null)
    ctx.bindBuffer(ctx.COPY_WRITE_BUFFER, null)
    ctx.bindBuffer(ctx.PIXEL_PACK_BUFFER, null)
    ctx.bindBuffer(ctx.PIXEL_UNPACK_BUFFER, null)
    var numTransformFeedbacks = ctx.getParameter(
      ctx.MAX_TRANSFORM_FEEDBACK_SEPARATE_ATTRIBS
    )
    for (var ii = 0; ii < numTransformFeedbacks; ++ii) {
      ctx.bindBufferBase(ctx.TRANSFORM_FEEDBACK_BUFFER, ii, null)
    }
    var numUBOs = ctx.getParameter(ctx.MAX_UNIFORM_BUFFER_BINDINGS)
    for (var ii = 0; ii < numUBOs; ++ii) {
      ctx.bindBufferBase(ctx.UNIFORM_BUFFER, ii, null)
    }
    ctx.disable(ctx.RASTERIZER_DISCARD)
    ctx.pixelStorei(ctx.UNPACK_IMAGE_HEIGHT, 0)
    ctx.pixelStorei(ctx.UNPACK_SKIP_IMAGES, 0)
    ctx.pixelStorei(ctx.UNPACK_ROW_LENGTH, 0)
    ctx.pixelStorei(ctx.UNPACK_SKIP_ROWS, 0)
    ctx.pixelStorei(ctx.UNPACK_SKIP_PIXELS, 0)
    ctx.pixelStorei(ctx.PACK_ROW_LENGTH, 0)
    ctx.pixelStorei(ctx.PACK_SKIP_ROWS, 0)
    ctx.pixelStorei(ctx.PACK_SKIP_PIXELS, 0)
    ctx.hint(ctx.FRAGMENT_SHADER_DERIVATIVE_HINT, ctx.DONT_CARE)
  }

  // TODO: This should NOT be needed but Firefox fails with 'hint'
  while (ctx.getError());
}
