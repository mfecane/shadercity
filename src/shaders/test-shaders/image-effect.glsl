float Noise21(vec2 p){
  p = fract(p * vec2(123.344314, 234.542341));
  p += dot(p, p + 23.4123);
  return fract(p.x * p.y);
}

vec4 getColor (vec2 inuv) {
  vec2 uv1 = inuv * 0.5 - 0.5;

  vec2 n = floor(uv1 * 10.0) / 10.0;
  vec2 luv = fract(uv1 * 10.0) / 10.0;

  float noise = Noise21(n);

  uv1 = n + noise + luv;

  vec4 col = texture(u_tex_ture, uv1);
  return col;
}
