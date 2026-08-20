import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/* Icosahedron displaced by simplex noise in the vertex shader —
   the abstract centerpiece sculpture. */

const vertex = /* glsl */ `
uniform float uTime;
uniform float uStrength;
varying float vDisp;
varying vec3 vNormal;

vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1.0/6.0,1.0/3.0);
  const vec4 D=vec4(0.0,0.5,1.0,2.0);
  vec3 i=floor(v+dot(v,C.yyy));
  vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);
  vec3 l=1.0-g;
  vec3 i1=min(g.xyz,l.zxy);
  vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;
  vec3 x2=x0-i2+C.yyy;
  vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
  float n_=0.142857142857;
  vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.0*floor(p*ns.z*ns.z);
  vec4 x_=floor(j*ns.z);
  vec4 y_=floor(j-7.0*x_);
  vec4 x=x_*ns.x+ns.yyyy;
  vec4 y=y_*ns.x+ns.yyyy;
  vec4 h=1.0-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);
  vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.0+1.0;
  vec4 s1=floor(b1)*2.0+1.0;
  vec4 sh=-step(h,vec4(0.0));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;
  vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);
  vec3 p1=vec3(a0.zw,h.y);
  vec3 p2=vec3(a1.xy,h.z);
  vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);
  m=m*m;
  return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}

void main(){
  float n = snoise(position*1.4 + uTime*0.25);
  vDisp = n;
  vNormal = normalMatrix * normal;
  vec3 pos = position + normal * n * uStrength;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos,1.0);
}
`

const fragment = /* glsl */ `
uniform float uTime;
varying float vDisp;
varying vec3 vNormal;

void main(){
  vec3 base = vec3(0.045,0.05,0.06);
  vec3 blue = vec3(0.27,0.53,1.0);
  vec3 amber = vec3(1.0,0.66,0.2);

  float fres = pow(1.0 - abs(normalize(vNormal).z), 2.2);
  vec3 col = base;
  col += blue * fres * 1.6;
  col += amber * smoothstep(0.25, 0.9, vDisp) * 0.55;
  col += blue * smoothstep(-0.9, -0.35, -vDisp) * 0.25;

  gl_FragColor = vec4(col, 1.0);
}
`

export function HeroSculpture() {
  const mesh = useRef<THREE.Mesh>(null!)
  const uniforms = useMemo(
    () => ({ uTime: { value: 0 }, uStrength: { value: 0.35 } }),
    [],
  )

  useFrame(({ clock, pointer }) => {
    uniforms.uTime.value = clock.elapsedTime
    if (!mesh.current) return
    mesh.current.rotation.y = clock.elapsedTime * 0.12 + pointer.x * 0.3
    mesh.current.rotation.x = Math.sin(clock.elapsedTime * 0.08) * 0.2 + pointer.y * 0.15
  })

  return (
    <mesh ref={mesh} position={[0, 0, 0]} scale={2.2}>
      <icosahedronGeometry args={[1, 48]} />
      <shaderMaterial uniforms={uniforms} vertexShader={vertex} fragmentShader={fragment} />
    </mesh>
  )
}
