float sdGyroid(vec3 p, float scale, float bias) {
  p *= scale;
  return abs(dot(sin(p), cos(p.zxy))) / scale - bias;
}

float sdSphere(vec3 p, float radius) {
  return (length(p) - radius);
}
