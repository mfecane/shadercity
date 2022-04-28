#define PI  3.14159265358
#define TAU 6.28318530718

#define MAX_STEPS 128
#define MAX_DIST 15.0
#define SURF_DIST 0.0005 // hit distance

lib_lib
lib_distances
lib_simplex_noise
lib_color

#define R(p, a) p = cos(a) * p + sin(a) * vec2(p.y, -p.x)

vec3 hash33(vec3 p) {
    float n = sin(dot(p , vec3(7, 157, 113)));
    return fract(vec3(2097152, 262144, 32768)*n);
}

float hash21(vec2 p){
  p = fract(p * vec2(123.344314, 234.542341) * sin(floor(u_time / 2.0)));
  p += dot(p, p + 23.4123);
  return fract(p.x * p.y);
}

float hash21_2(vec2 p){
  return fract(sin(p.x + p.y + u_time / 5.0) * cos(p.y * 2.1554 + u_time / 5.0));
}

float dPlane(vec3 point) {
  float dist = point.y + 0.8;
  return dist;
}

float dBigSphere(vec3 point, float radius) {
  float dist = length(point + vec3(0.0, radius + 0.8, 0.0)) - radius;
  return dist;
}

float dSphere(vec3 point, float radius) {
  // point -= vec3(0.0, 0.5, 0.0);
  float dist = length(point) - radius;
  return dist;
}

float sceneDistance(vec3 point) {
  vec3 p1 = point + vec3(0.0, 0.7 * (0.5 + 0.5 * sin(u_time / 10.0)), 0.0);

  float g1 = sdGyroid2(p1 * 8.0, 0.7456 + 0.7674 * u_gyrdens1, 0.2 + 0.8 * u_thick);
  float g2 = sdGyroid3(p1 * 8.0, 0.6324, 0.2 + 0.8 * u_thick);
  float sph = dSphere(p1, 1.2);
  // float pl = dPlane(point);
  float sph2 = dBigSphere(point, 20.0);

  float d = smin(g1, g2, -0.2) / 10.0;
  d = smin(d, sph, -0.1);
  d = smin(d, sph2, 0.08);

  return d;
}

float sceneMaterial(vec3 point) {
  vec3 p1 = point + vec3(0.0, 0.7 * (0.5 + 0.5 * sin(u_time / 10.0)), 0.0);

  float g1 = sdGyroid2(p1 * 8.0, 0.7456 + 0.7674 * u_gyrdens1, 0.2 + 0.8 * u_thick);
  float g2 = sdGyroid3(p1 * 8.0, 0.6324, 0.2 + 0.8 * u_thick);
  float sph = dSphere(p1, 1.2);
  // float pl = dPlane(point);
  float sph2 = dBigSphere(point, 20.0);

  float d = max(g1, g2) / 10.0;
  d = max(d, sph);
  d = min(d - 0.03, sph2);

  if(d == sph2) {
    return 0.0;
  }

  return 1.0;
}

float rayMarch(vec3 ro, vec3 rd) {
  float dO = 0.0;
  for(int i = 0; i < MAX_STEPS; i++) {
    vec3 p = ro + rd * dO;
    float dS = sceneDistance(p);
    dO += dS;
    if (abs(dS) < SURF_DIST || dO > MAX_DIST) {
      break;
    }
  }
  return dO;
}

vec3 GetNormal(vec3 p) {
  float d = sceneDistance(p);
  vec2 e = vec2(0.001, 0.0);
  vec3 n = d - vec3(
    sceneDistance(p - e.xyy),
    sceneDistance(p - e.yxy),
    sceneDistance(p - e.yyx)
  );

  return normalize(n);
}

vec4 getColor(vec2 inuv) {
  const float mouseFactor = 0.0005;
  vec3 rayDirection = normalize(vec3(inuv.x, inuv.y, 1.0));
	vec3 rayOrigin = vec3(-0.4, 0.0, -0.5 - u_mouseScroll * 1.0);
  float mouseY1 = max(u_mouseY, -70.0);


  vec2 rot = vec2(
    mouseY1 * mouseFactor * PI * 2.0,
    u_mouseX * mouseFactor * PI * 2.0
  );

  R(rayDirection.yz, -rot.x);
  R(rayDirection.xz, rot.y);
  R(rayOrigin.yz, -rot.x);
  R(rayOrigin.xz, rot.y);

  float d = rayMarch(rayOrigin, rayDirection);

  vec3 col;
  float dif;
  float dif1;

  // vec4 samp = SampleCubeBlur(rayDirection);
  vec4 samp = texture(u_cube_sm, rayDirection);
  col = samp.rgb * 0.3;

  if (d < MAX_DIST) {
    vec3 p = rayOrigin + rayDirection * d;
    vec3 n = GetNormal(p);
    float mat = sceneMaterial(p);
    vec3 shiftpoint = (p +
      vec3(
        cos(u_time / 20.0 + 1.3255),
        u_time / 20.0,
        sin(u_time / 20.0 + 2.5342)
      ));
    vec3 r = reflect(rayDirection, n) + vec3(pbm_simplex_noise3(shiftpoint * 5.0)) * 0.2 * (1.0 - mat);
    dif = dot(n, normalize(vec3(-1.0, 2.0, -2.0))) * 0.6 + 0.6;

    vec4 samp = texture(u_cube_sm, r);
    col = samp.rgb * dif + 0.05 * dif * dot(n, vec3(0.0, 1.0, 0.0));

    vec3 reflectDirection = normalize(r);
    vec3 reflectOrigin = p + reflectDirection * SURF_DIST  + 0.02;

    float d1 = rayMarch(reflectOrigin, reflectDirection);

    if (d1 < MAX_DIST) {
      vec3 p1 = reflectOrigin + reflectDirection * d1;
      vec3 n1 = GetNormal(p1);
      vec3 r1 = reflect(reflectDirection, n1);
      vec4 samp = texture(u_cube_sm, r1);
      col += samp.rgb / 2.0;
    }

    if (mat == 0.0) {
      col *= 0.8 * smoothstep(3.0, 0.0, length(p.xz));
    } else {
      col = 1.2 * mix(
        col,
        vec3( 0.0, -3.5, 0.5) * col.zyx,
        smoothstep(0.8, 0.1, abs(dot(n, -rayDirection - vec3(0.0, -0.1, 0.0))))
      );
    }
  }

  col *= 1.0 - 0.9 *
    (0.5  + sin(uv.y * 900.0)) *
    smoothstep(-0.2, 1.0, uv.y * uv.y) *
    u_vignette;

  // dim
  float norm = clamp(length(col), 0.0, 1.0);
  col = vec3(
    blendColor(
      col * (1.0 - u_dim * 0.2),
      vec3(50.0 / 255.0, 59.0 / 255.0, 74.0 / 255.0),
      u_dim * u_dim
    )
  ) * (1.0 - norm * norm * u_dim * 0.4);

  return vec4(col, 1.0);
}
