lib_lib
lib_distances

#define PI  3.14159265358
#define TAU 6.28318530718

#define MAX_STEPS 100
#define MAX_DIST 100.0
#define SURF_DIST 0.00001 // hit distance

#define R(p, a) p = cos(a) * p + sin(a) * vec2(p.y, -p.x)

float sceneDistance(vec3 point) {
  float sphereDist = sdSphere(point, 1.0 + u_radius * 0.5);
  float gyroid = sdGyroid(point, 1.0 + 3.0 * u_density, 0.1);
  float d = smin(sphereDist, gyroid * 0.9, -0.04 - 0.1 * u_smoothing);

  return d;
}

float rayMarch(vec3 ro, vec3 rd) {
  float dO = 0.0;

  for(int i = 0; i < MAX_STEPS; i++) {
    vec3 p = ro + rd * dO;
    float dS = sceneDistance(p);
    dO += dS;
    if (dO > MAX_DIST || abs(dS) < SURF_DIST) {
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
  const float mouseFactor = 0.1;
  vec3 rayDirection = normalize(vec3(inuv.x, inuv.y, 1.0));
  vec3 rayOrigin = vec3(0.0, 0.0, -1.0 - 2.0 * u_mouseScroll);
  vec3 col;

  vec2 rot = vec2(
    u_mouseY * mouseFactor * PI * 2.0,
    u_mouseX  * mouseFactor * PI * 2.0
  );

  R(rayDirection.yz, -rot.x);
  R(rayDirection.xz, rot.y);
  R(rayOrigin.yz, -rot.x);
  R(rayOrigin.xz, rot.y);
  float d = rayMarch(rayOrigin, rayDirection);


  if(d < MAX_DIST) {
      vec3 p = rayOrigin + rayDirection * d;
      vec3 n = GetNormal(p);
      vec3 r = reflect(rayDirection, n);

      float dif = dot(n, normalize(vec3(1.0, 2.0, 3.0))) * 0.5 + 0.5;
      col = vec3(dif);
  }

  return vec4(col, 1.0);
}
