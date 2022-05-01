float Noise21(vec2 p){
  p = fract(p * vec2(123.344314, 234.542341));
  p += dot(p, p + 23.4123);
  return fract(p.x * p.y);
}

vec4 getColor (vec2 inuv) {
  vec2 uv1 = inuv * 0.5 - 0.5;
  float scale = 1.0 + u_scale * 20.0;

  vec2 n = floor(uv1 * scale ) / scale + floor(inuv * 10.0 * sin(u_time));
  vec2 luv = fract(uv1 * scale ) / scale;

  float noise = Noise21(n);

  uv1 = n + noise + luv;

  vec4 col = texture(u_tex_ture, uv1);
  vec4 col2 = texture(u_tex_ture2, uv1);
  return mix(col, col2, noise);
}
