#version 300 es

precision highp float;

out vec4 FragColor;
in vec2 uv;

[uniforms]

#define PI 3.14159265358
#define TAU 6.28318530718
#define EXP 2.71828

[libs]

[getColor]

void main()
{
  FragColor = getColor(uv);
}
