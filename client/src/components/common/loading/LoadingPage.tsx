/**
 * Loading.tsx — Nocturnal Atelier DS v3.2
 * Aesthetic: Neo-Tokyo Operational
 *            Japan × Sci-Fi × Modern
 *            Ghost in the Shell · NERV HUD · Wabi-Sabi space
 *
 * Fonts (add to next/font in layout.tsx):
 *   Inter 300/400/600 — DS rule (Latin)
 *   Noto Sans JP 300/400 — Japanese text
 *
 * In project: replace inline LaserFlow with import from ./LaserFlow
 */

import { useState, useEffect, useId, useRef } from "react";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";

/* ────────────────────────────────────────
   DS v3.2 TOKENS
──────────────────────────────────────── */
const C = {
  charcoal:       "#0A0F19",
  midnight:       "#1E233C",
  haze:           "#465078",
  hazeLight:      "#6B739A",
  cool:           "#878CB4",
  periwinkle:     "#C8CDEB",
  periwinklePale: "#E8EAF5",
  // sub-palette — effects only
  subFrench:      "#B8BED7",
  subCool:        "#AFAECC",
  subMount:       "#85758F",
  subEV1:         "#524E68",
  subEV2:         "#44405A",
};

/* DS Motion (Section 14 / 17) */
const EASE_SPRING = [0.22, 1, 0.36, 1];
const EASE_OUT    = [0.4,  0, 0.2,  1];

const V = {
  fadeUp: {
    hidden:  { opacity: 0, y: 18 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE_SPRING } },
  },
  fadeIn: {
    hidden:  { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.50, ease: "easeOut" } },
  },
  slideDown: {
    hidden:  { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE_SPRING } },
  },
  stagger: {
    hidden:  {},
    visible: { transition: { staggerChildren: 0.08, delayChildren: 0.20 } },
  },
};

/* Japanese phase labels */
const PHASES = [
  { en: "SYSTEM INIT",    jp: "システム初期化",    kanji: "起", min: 0   },
  { en: "LOADING ASSETS", jp: "アセット読込中",     kanji: "動", min: 18  },
  { en: "CALIBRATING",    jp: "キャリブレーション", kanji: "調", min: 52  },
  { en: "FINALIZING UI",  jp: "UI最終調整",         kanji: "整", min: 82  },
  { en: "COMPLETE",       jp: "完了",               kanji: "完", min: 100 },
];

/* ────────────────────────────────────────
   GLSL (LaserFlow shaders)
──────────────────────────────────────── */
const VERT = `precision highp float;attribute vec3 position;void main(){gl_Position=vec4(position,1.0);}`;
const FRAG = `
#ifdef GL_ES
#extension GL_OES_standard_derivatives : enable
#endif
precision highp float;precision mediump int;
uniform float iTime;uniform vec3 iResolution;uniform vec4 iMouse;
uniform float uWispDensity,uTiltScale,uFlowTime,uFogTime,uBeamXFrac,uBeamYFrac;
uniform float uFlowSpeed,uVLenFactor,uHLenFactor,uFogIntensity,uFogScale;
uniform float uWSpeed,uWIntensity,uFlowStrength,uDecay,uFalloffStart,uFogFallSpeed;
uniform vec3 uColor;uniform float uFade;
#define PI 3.14159265359
#define TWO_PI 6.28318530718
#define EPS 1e-6
#define EDGE_SOFT (DT_LOCAL*4.0)
#define DT_LOCAL 0.0038
#define TAP_RADIUS 6
#define R_H 150.0
#define R_V 150.0
#define FLARE_HEIGHT 16.0
#define FLARE_AMOUNT 8.0
#define FLARE_EXP 2.0
#define TOP_FADE_START 0.1
#define TOP_FADE_EXP 1.0
#define FLOW_PERIOD 0.5
#define FLOW_SHARPNESS 1.5
#define W_BASE_X 1.5
#define W_LAYER_GAP 0.25
#define W_LANES 10
#define W_SIDE_DECAY 0.5
#define W_HALF 0.01
#define W_AA 0.15
#define W_CELL 20.0
#define W_SEG_MIN 0.01
#define W_SEG_MAX 0.55
#define W_CURVE_AMOUNT 15.0
#define W_CURVE_RANGE (FLARE_HEIGHT-3.0)
#define W_BOTTOM_EXP 10.0
#define FOG_ON 1
#define FOG_CONTRAST 1.2
#define FOG_OCTAVES 5
#define FOG_BOTTOM_BIAS 0.8
#define FOG_TILT_MAX_X 0.35
#define FOG_TILT_SHAPE 1.5
#define FOG_BEAM_MIN 0.0
#define FOG_BEAM_MAX 0.75
#define FOG_MASK_GAMMA 0.5
#define FOG_EXPAND_SHAPE 12.2
#define FOG_EDGE_MIX 0.5
#define HFOG_EDGE_START 0.20
#define HFOG_EDGE_END 0.98
#define HFOG_EDGE_GAMMA 1.4
#define HFOG_Y_RADIUS 25.0
#define HFOG_Y_SOFT 60.0
#define EDGE_X0 0.22
#define EDGE_X1 0.995
#define EDGE_X_GAMMA 1.25
#define EDGE_LUMA_T0 0.0
#define EDGE_LUMA_T1 2.0
#define DITHER_STRENGTH 1.0
float g(float x){return x<=0.00031308?12.92*x:1.055*pow(x,1.0/2.4)-0.055;}
float bs(vec2 p,vec2 q,float w){float d=distance(p,q),f=w*uFalloffStart,r=(f*f)/(d*d+EPS);return w*min(1.0,r);}
float bsa(vec2 p,vec2 q,float w,vec2 s){vec2 d=p-q;float dd=(d.x*d.x)/(s.x*s.x)+(d.y*d.y)/(s.y*s.y),f=w*uFalloffStart,r=(f*f)/(dd+EPS);return w*min(1.0,r);}
float tri01(float x){float f=fract(x);return 1.0-abs(f*2.0-1.0);}
float tauWf(float t,float mn,float mx){float a=smoothstep(mn,mn+EDGE_SOFT,t),b=1.0-smoothstep(mx-EDGE_SOFT,mx,t);return max(0.0,a*b);}
float h21(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+34.123);return fract(p.x*p.y);}
float vnoise(vec2 p){vec2 i=floor(p),f=fract(p);float a=h21(i),b=h21(i+vec2(1,0)),c=h21(i+vec2(0,1)),d=h21(i+vec2(1,1));vec2 u=f*f*(3.0-2.0*f);return mix(mix(a,b,u.x),mix(c,d,u.x),u.y);}
float fbm2(vec2 p){float v=0.0,amp=0.6;mat2 m=mat2(0.86,0.5,-0.5,0.86);for(int i=0;i<FOG_OCTAVES;++i){v+=amp*vnoise(p);p=m*p*2.03+17.1;amp*=0.52;}return v;}
float rGate(float x,float l){float a=smoothstep(0.0,W_AA,x),b=1.0-smoothstep(l,l+W_AA,x);return max(0.0,a*b);}
float flareY(float y){float t=clamp(1.0-(clamp(y,0.0,FLARE_HEIGHT)/max(FLARE_HEIGHT,EPS)),0.0,1.0);return pow(t,FLARE_EXP);}
float vWisps(vec2 uv,float topF){
  float y=uv.y,yf=(y+uFlowTime*uWSpeed)/W_CELL;
  float dRaw=clamp(uWispDensity,0.0,2.0),d=dRaw<=0.0?1.0:dRaw;
  float lanesF=floor(float(W_LANES)*min(d,1.0)+0.5);int lanes=int(max(1.0,lanesF));
  float sp=min(d,1.0),ep=max(d-1.0,0.0);
  float fm=flareY(max(y,0.0)),rm=clamp(1.0-(y/max(W_CURVE_RANGE,EPS)),0.0,1.0),cm=fm*rm;
  const float G=0.05;float xS=1.0+(FLARE_AMOUNT*W_CURVE_AMOUNT*G)*cm;
  float sPix=clamp(y/R_V,0.0,1.0),bGain=pow(1.0-sPix,W_BOTTOM_EXP),sum=0.0;
  for(int s=0;s<2;++s){
    float sgn=s==0?-1.0:1.0;
    for(int i=0;i<W_LANES;++i){
      if(i>=lanes)break;
      float off=W_BASE_X+float(i)*W_LAYER_GAP,xc=sgn*(off*xS);
      float dx=abs(uv.x-xc),lat=1.0-smoothstep(W_HALF,W_HALF+W_AA,dx),amp=exp(-off*W_SIDE_DECAY);
      float seed=h21(vec2(off,sgn*17.0)),yf2=yf+seed*7.0,ci=floor(yf2),fy=fract(yf2);
      float seg=mix(W_SEG_MIN,W_SEG_MAX,h21(vec2(ci,off*2.3)));
      float spR=h21(vec2(ci,off+sgn*31.0)),seg1=rGate(fy,seg)*step(spR,sp);
      if(ep>0.0){float spR2=h21(vec2(ci*3.1+7.0,off*5.3+sgn*13.0));float f2=fract(fy+0.5);seg1+=rGate(f2,seg*0.9)*step(spR2,ep);}
      sum+=amp*lat*seg1;
    }
  }
  float span=smoothstep(-3.0,0.0,y)*(1.0-smoothstep(R_V-6.0,R_V,y));
  return uWIntensity*sum*topF*bGain*span;
}
void mainImage(out vec4 fc,in vec2 frag){
  vec2 C2=iResolution.xy*.5;float invW=1.0/max(C2.x,1.0);
  vec2 sc=(512.0/iResolution.xy)*.4;
  vec2 uv=(frag-C2)*sc,off=vec2(uBeamXFrac*iResolution.x*sc.x,uBeamYFrac*iResolution.y*sc.y);
  vec2 uvc=uv-off;float a=0.0,b=0.0;
  float basePhase=1.5*PI+uDecay*.5;float tauMin=basePhase-uDecay;float tauMax=basePhase;
  float cx=clamp(uvc.x/(R_H*uHLenFactor),-1.0,1.0),tH=clamp(TWO_PI-acos(cx),tauMin,tauMax);
  for(int k=-TAP_RADIUS;k<=TAP_RADIUS;++k){
    float tu=tH+float(k)*DT_LOCAL,wt=tauWf(tu,tauMin,tauMax);if(wt<=0.0)continue;
    float spd=max(abs(sin(tu)),0.02),u=clamp((basePhase-tu)/max(uDecay,EPS),0.0,1.0),env=pow(1.0-abs(u*2.0-1.0),0.8);
    vec2 p=vec2((R_H*uHLenFactor)*cos(tu),0.0);a+=wt*bs(uvc,p,env*spd);
  }
  float yPix=uvc.y,cy=clamp(-yPix/(R_V*uVLenFactor),-1.0,1.0),tV=clamp(TWO_PI-acos(cy),tauMin,tauMax);
  for(int k=-TAP_RADIUS;k<=TAP_RADIUS;++k){
    float tu=tV+float(k)*DT_LOCAL,wt=tauWf(tu,tauMin,tauMax);if(wt<=0.0)continue;
    float yb=(-R_V)*cos(tu),s=clamp(yb/R_V,0.0,1.0),spd=max(abs(sin(tu)),0.02);
    float env=pow(1.0-s,0.6)*spd;float cap=1.0-smoothstep(TOP_FADE_START,1.0,s);cap=pow(cap,TOP_FADE_EXP);env*=cap;
    float ph=s/max(FLOW_PERIOD,EPS)+uFlowTime*uFlowSpeed;float fl=pow(tri01(ph),FLOW_SHARPNESS);env*=mix(1.0-uFlowStrength,1.0,fl);
    float yp=(-R_V*uVLenFactor)*cos(tu),m=pow(smoothstep(FLARE_HEIGHT,0.0,yp),FLARE_EXP),wx=1.0+FLARE_AMOUNT*m;
    vec2 sig=vec2(wx,1.0),p=vec2(0.0,yp);float mask=step(0.0,yp);b+=wt*bsa(uvc,p,mask*env,sig);
  }
  float sPix=clamp(yPix/R_V,0.0,1.0),topA=pow(1.0-smoothstep(TOP_FADE_START,1.0,sPix),TOP_FADE_EXP);
  float L=a+b*topA;float w=vWisps(vec2(uvc.x,yPix),topA);float fog=0.0;
#if FOG_ON
  vec2 fuv=uvc*uFogScale;float mAct=step(1.0,length(iMouse.xy)),nx=((iMouse.x-C2.x)*invW)*mAct;
  float ax=abs(nx),stMag=mix(ax,pow(ax,FOG_TILT_SHAPE),0.35),st=sign(nx)*stMag*uTiltScale;
  st=clamp(st,-FOG_TILT_MAX_X,FOG_TILT_MAX_X);
  vec2 dir=normalize(vec2(st,1.0));fuv+=uFogTime*uFogFallSpeed*dir;
  vec2 prp=vec2(-dir.y,dir.x);fuv+=prp*(0.08*sin(dot(uvc,prp)*0.08+uFogTime*0.9));
  float n=fbm2(fuv+vec2(fbm2(fuv+vec2(7.3,2.1)),fbm2(fuv+vec2(-3.7,5.9)))*0.6);
  n=pow(clamp(n,0.0,1.0),FOG_CONTRAST);
  float pixW=1.0/max(iResolution.y,1.0);
#ifdef GL_OES_standard_derivatives
  float wL=max(fwidth(L),pixW);
#else
  float wL=pixW;
#endif
  float m0=pow(smoothstep(FOG_BEAM_MIN-wL,FOG_BEAM_MAX+wL,L),FOG_MASK_GAMMA);
  float bm=1.0-pow(1.0-m0,FOG_EXPAND_SHAPE);bm=mix(bm*m0,bm,FOG_EDGE_MIX);
  float yP=1.0-smoothstep(HFOG_Y_RADIUS,HFOG_Y_RADIUS+HFOG_Y_SOFT,abs(yPix));
  float nxF=abs((frag.x-C2.x)*invW),hE=1.0-smoothstep(HFOG_EDGE_START,HFOG_EDGE_END,nxF);hE=pow(clamp(hE,0.0,1.0),HFOG_EDGE_GAMMA);
  float hW=mix(1.0,hE,clamp(yP,0.0,1.0));float bBias=mix(1.0,1.0-sPix,FOG_BOTTOM_BIAS);
  float radialFade=1.0-smoothstep(0.0,0.7,length(uvc)/120.0);
  fog=n*(uFogIntensity*1.8)*bBias*bm*hW*radialFade;
#endif
  float LF=L+fog;float dith=(h21(frag)-0.5)*(DITHER_STRENGTH/255.0);
  float tone=g(LF+w);vec3 col=tone*uColor+dith;
  float alpha=clamp(g(L+w*0.6)+dith*0.6,0.0,1.0);
  float nxE=abs((frag.x-C2.x)*invW),xF=pow(clamp(1.0-smoothstep(EDGE_X0,EDGE_X1,nxE),0.0,1.0),EDGE_X_GAMMA);
  float scene=LF+max(0.0,w)*0.5,hi=smoothstep(EDGE_LUMA_T0,EDGE_LUMA_T1,scene);
  float eM=mix(xF,1.0,hi);col*=eM;alpha*=eM;col*=uFade;alpha*=uFade;
  fc=vec4(col,alpha);
}
void main(){vec4 fc;mainImage(fc,gl_FragCoord.xy);gl_FragColor=fc;}
`;

/* ────────────────────────────────────────
   HELPERS
──────────────────────────────────────── */
function hexToRGB(hex) {
  let c = hex.trim().replace(/^#/,"");
  if (c.length===3) c=c.split("").map(x=>x+x).join("");
  const n=parseInt(c,16)||0xffffff;
  return {r:((n>>16)&255)/255,g:((n>>8)&255)/255,b:(n&255)/255};
}

/* ────────────────────────────────────────
   LASERFLOW — inline (import ./LaserFlow in project)
──────────────────────────────────────── */
function LaserFlow({
  style,wispDensity=1,dpr,mouseSmoothTime=0.0,mouseTiltStrength=0.01,
  horizontalBeamOffset=0.1,verticalBeamOffset=0.0,
  flowSpeed=0.35,verticalSizing=2.0,horizontalSizing=0.5,
  fogIntensity=0.45,fogScale=0.3,wispSpeed=15.0,wispIntensity=5.0,
  flowStrength=0.25,decay=1.1,falloffStart=1.2,fogFallSpeed=0.6,color="#C8CDEB",
}) {
  const mountRef=useRef(null),rendererRef=useRef(null),uniformsRef=useRef(null);
  const hasFadedRef=useRef(false),rectRef=useRef(null);
  const baseDprRef=useRef(1),currentDprRef=useRef(1),lastSizeRef=useRef({width:0,height:0,dpr:0});
  const fpsSamplesRef=useRef([]),lastFpsCheckRef=useRef(performance.now()),emaDtRef=useRef(16.7);
  const pausedRef=useRef(false),inViewRef=useRef(true),mouseSmoothTimeRef=useRef(mouseSmoothTime);
  useEffect(()=>{mouseSmoothTimeRef.current=mouseSmoothTime;},[mouseSmoothTime]);
  useEffect(()=>{
    const mount=mountRef.current;
    const renderer=new THREE.WebGLRenderer({antialias:false,alpha:false,depth:false,stencil:false,powerPreference:"high-performance",premultipliedAlpha:false,preserveDrawingBuffer:false});
    rendererRef.current=renderer;
    baseDprRef.current=Math.min(dpr??(window.devicePixelRatio||1),2);
    currentDprRef.current=baseDprRef.current;
    renderer.setPixelRatio(currentDprRef.current);renderer.shadowMap.enabled=false;
    renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.setClearColor(0x0A0F19,1);
    const canvas=renderer.domElement;canvas.style.cssText="width:100%;height:100%;display:block;";
    mount.appendChild(canvas);
    const scene=new THREE.Scene(),camera=new THREE.OrthographicCamera(-1,1,1,-1,0,1);
    const geo=new THREE.BufferGeometry();
    geo.setAttribute("position",new THREE.BufferAttribute(new Float32Array([-1,-1,0,3,-1,0,-1,3,0]),3));
    const uniforms={
      iTime:{value:0},iResolution:{value:new THREE.Vector3(1,1,1)},iMouse:{value:new THREE.Vector4(0,0,0,0)},
      uWispDensity:{value:wispDensity},uTiltScale:{value:mouseTiltStrength},uFlowTime:{value:0},uFogTime:{value:0},
      uBeamXFrac:{value:horizontalBeamOffset},uBeamYFrac:{value:verticalBeamOffset},uFlowSpeed:{value:flowSpeed},
      uVLenFactor:{value:verticalSizing},uHLenFactor:{value:horizontalSizing},uFogIntensity:{value:fogIntensity},
      uFogScale:{value:fogScale},uWSpeed:{value:wispSpeed},uWIntensity:{value:wispIntensity},
      uFlowStrength:{value:flowStrength},uDecay:{value:decay},uFalloffStart:{value:falloffStart},
      uFogFallSpeed:{value:fogFallSpeed},uColor:{value:new THREE.Vector3(1,1,1)},uFade:{value:hasFadedRef.current?1:0},
    };
    uniformsRef.current=uniforms;
    const mat=new THREE.RawShaderMaterial({vertexShader:VERT,fragmentShader:FRAG,uniforms,transparent:false,depthTest:false,depthWrite:false,blending:THREE.NormalBlending});
    const mesh=new THREE.Mesh(geo,mat);mesh.frustumCulled=false;scene.add(mesh);
    const clock=new THREE.Clock();let prevTime=0,fade=hasFadedRef.current?1:0;
    const mT=new THREE.Vector2(0,0),mS=new THREE.Vector2(0,0);
    const setSize=()=>{
      const w=mount.clientWidth||1,h=mount.clientHeight||1,pr=currentDprRef.current;
      const last=lastSizeRef.current;
      if(Math.abs(w-last.width)<=0.5&&Math.abs(h-last.height)<=0.5&&Math.abs(pr-last.dpr)<=0.01)return;
      lastSizeRef.current={width:w,height:h,dpr:pr};
      renderer.setPixelRatio(pr);renderer.setSize(w,h,false);
      uniforms.iResolution.value.set(w*pr,h*pr,pr);rectRef.current=canvas.getBoundingClientRect();
      if(!pausedRef.current)renderer.render(scene,camera);
    };
    let rRaf=0;
    const sched=()=>{if(rRaf)cancelAnimationFrame(rRaf);rRaf=requestAnimationFrame(setSize);};
    setSize();
    const ro=new ResizeObserver(sched);ro.observe(mount);
    const io=new IntersectionObserver(es=>{inViewRef.current=es[0]?.isIntersecting??true;},{threshold:0});io.observe(mount);
    const onVis=()=>{pausedRef.current=document.hidden;};
    document.addEventListener("visibilitychange",onVis,{passive:true});
    const onMove=ev=>{const r=rectRef.current;if(!r)return;const ratio=currentDprRef.current;mT.set((ev.clientX-r.left)*ratio,(r.height*ratio)-(ev.clientY-r.top)*ratio);};
    const onLeave=()=>mT.set(0,0);
    canvas.addEventListener("pointermove",onMove,{passive:true});canvas.addEventListener("pointerdown",onMove,{passive:true});
    canvas.addEventListener("pointerenter",onMove,{passive:true});canvas.addEventListener("pointerleave",onLeave,{passive:true});
    const onCL=e=>{e.preventDefault();pausedRef.current=true;};
    const onCR=()=>{pausedRef.current=false;sched();};
    canvas.addEventListener("webglcontextlost",onCL,false);canvas.addEventListener("webglcontextrestored",onCR,false);
    let raf=0;const clV=(v,lo,hi)=>Math.max(lo,Math.min(hi,v));let lastDC=0;
    const adjDpr=now=>{
      const el=now-lastFpsCheckRef.current;if(el<750)return;
      const sa=fpsSamplesRef.current;if(!sa.length){lastFpsCheckRef.current=now;return;}
      const avg=sa.reduce((a,b)=>a+b,0)/sa.length;let next=currentDprRef.current;const base=baseDprRef.current;
      if(avg<50)next=clV(currentDprRef.current*0.85,0.6,base);
      else if(avg>58&&currentDprRef.current<base)next=clV(currentDprRef.current*1.1,0.6,base);
      if(Math.abs(next-currentDprRef.current)>0.01&&now-lastDC>2000){currentDprRef.current=next;lastDC=now;setSize();}
      fpsSamplesRef.current=[];lastFpsCheckRef.current=now;
    };
    const animate=()=>{
      raf=requestAnimationFrame(animate);if(pausedRef.current||!inViewRef.current)return;
      const t=clock.getElapsedTime(),dt=Math.max(0,t-prevTime);prevTime=t;
      const dtMs=dt*1000;emaDtRef.current=emaDtRef.current*0.9+dtMs*0.1;
      fpsSamplesRef.current.push(1000/Math.max(1,emaDtRef.current));
      uniforms.iTime.value=t;const cdt=Math.min(0.033,Math.max(0.001,dt));
      uniforms.uFlowTime.value+=cdt;uniforms.uFogTime.value+=cdt;
      if(!hasFadedRef.current){fade=Math.min(1,fade+cdt/1.2);uniforms.uFade.value=fade;if(fade>=1)hasFadedRef.current=true;}
      const tau=Math.max(1e-3,mouseSmoothTimeRef.current);
      mS.lerp(mT,1-Math.exp(-cdt/tau));uniforms.iMouse.value.set(mS.x,mS.y,0,0);
      renderer.render(scene,camera);adjDpr(performance.now());
    };
    animate();
    return()=>{
      cancelAnimationFrame(raf);if(rRaf)cancelAnimationFrame(rRaf);
      ro.disconnect();io.disconnect();document.removeEventListener("visibilitychange",onVis);
      canvas.removeEventListener("pointermove",onMove);canvas.removeEventListener("pointerdown",onMove);
      canvas.removeEventListener("pointerenter",onMove);canvas.removeEventListener("pointerleave",onLeave);
      canvas.removeEventListener("webglcontextlost",onCL);canvas.removeEventListener("webglcontextrestored",onCR);
      scene.clear();geo.dispose();mat.dispose();renderer.dispose();renderer.forceContextLoss();
      if(mount.contains(canvas))mount.removeChild(canvas);
    };
  },[dpr]);
  useEffect(()=>{
    const u=uniformsRef.current;if(!u)return;
    u.uWispDensity.value=wispDensity;u.uTiltScale.value=mouseTiltStrength;
    u.uBeamXFrac.value=horizontalBeamOffset;u.uBeamYFrac.value=verticalBeamOffset;
    u.uFlowSpeed.value=flowSpeed;u.uVLenFactor.value=verticalSizing;
    u.uHLenFactor.value=horizontalSizing;u.uFogIntensity.value=fogIntensity;
    u.uFogScale.value=fogScale;u.uWSpeed.value=wispSpeed;u.uWIntensity.value=wispIntensity;
    u.uFlowStrength.value=flowStrength;u.uDecay.value=decay;u.uFalloffStart.value=falloffStart;
    u.uFogFallSpeed.value=fogFallSpeed;
    const{r,g,b}=hexToRGB(color||"#FFFFFF");u.uColor.value.set(r,g,b);
  },[wispDensity,mouseTiltStrength,horizontalBeamOffset,verticalBeamOffset,flowSpeed,
     verticalSizing,horizontalSizing,fogIntensity,fogScale,wispSpeed,wispIntensity,
     flowStrength,decay,falloffStart,fogFallSpeed,color]);
  return <div ref={mountRef} style={{width:"100%",height:"100%",...style}} />;
}

/* ════════════════════════════════════════
   ATOMIC HUD COMPONENTS
════════════════════════════════════════ */

/* Corner targeting brackets — classic sci-fi HUD reticle */
function CornerBrackets({ size = 44, opacity = 0.30, visible = false }) {
  const id = useId();
  const path = `M2 ${size - 2} L2 2 L${size - 2} 2`;
  const corners = [
    { pos: { top: 22, left: 22 },    sx:  1, sy:  1 },
    { pos: { top: 22, right: 22 },   sx: -1, sy:  1 },
    { pos: { bottom: 22, left: 22 }, sx:  1, sy: -1 },
    { pos: { bottom: 22, right: 22 },sx: -1, sy: -1 },
  ];
  return (
    <>
      {corners.map((c, i) => (
        <motion.div key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: visible ? opacity : 0 }}
          transition={{ duration: 0.8, delay: 0.4 + i * 0.07, ease: "easeOut" }}
          style={{ position: "absolute", ...c.pos, pointerEvents: "none" }}
          aria-hidden="true"
        >
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none"
               style={{ display: "block", transform: `scale(${c.sx}, ${c.sy})` }}>
            <path d={path} stroke={C.periwinkle} strokeWidth="1" strokeLinecap="square" />
          </svg>
        </motion.div>
      ))}
    </>
  );
}

/* WaveformSVG — Mountbatten → EV1 (DS Section 15.4) */
function WaveformSVG({ active = true }) {
  const id = useId();
  const DELAYS = [0, 0.06, 0.11, 0.15, 0.20];
  return (
    <svg width={5*6} height={14} viewBox={`0 0 30 14`} aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-eq`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor={C.subMount} />
          <stop offset="100%" stopColor={C.subEV1}   />
        </linearGradient>
      </defs>
      {Array.from({length:5}).map((_,i)=>(
        <rect key={i} x={i*6} y="2" width="3" height="10" rx="1"
              fill={`url(#${id}-eq)`}
              style={active ? {animation:`na-eq .65s ease-in-out ${DELAYS[i]}s infinite alternate`} : undefined} />
      ))}
    </svg>
  );
}

/* Live Clock — JST/UTC */
function ClockDisplay() {
  const [time, setTime] = useState(() => {
    const d = new Date();
    return d.toLocaleTimeString("ja-JP", { hour12: false, hour:"2-digit", minute:"2-digit", second:"2-digit" });
  });
  useEffect(() => {
    const id = setInterval(() => {
      const d = new Date();
      setTime(d.toLocaleTimeString("ja-JP", { hour12:false, hour:"2-digit", minute:"2-digit", second:"2-digit" }));
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return <span style={{ fontVariantNumeric: "tabular-nums" }}>{time}</span>;
}

/* Aurora band divider */
function AuroraBand() {
  const id = useId();
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px" }} aria-hidden="true">
      <svg width="100%" height="1" style={{ flex: 1, display: "block" }}>
        <defs>
          <linearGradient id={`${id}-ab`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor={C.periwinkle} stopOpacity="0.00" />
            <stop offset="18%"  stopColor={C.periwinkle} stopOpacity="0.40" />
            <stop offset="62%"  stopColor={C.subMount}   stopOpacity="0.22" />
            <stop offset="100%" stopColor={C.midnight}   stopOpacity="0.00" />
          </linearGradient>
        </defs>
        <rect width="100%" height="1" fill={`url(#${id}-ab)`} />
      </svg>
      {/* HUD tick mark at end */}
      <span style={{ fontSize: "8px", color: `rgba(200,205,235,0.25)`, letterSpacing: 0, lineHeight: 1 }}>
        ›
      </span>
    </div>
  );
}

/* Progress bar — DS aurora gradient, 1.5px */
function ProgressBar({ progress }) {
  return (
    <div role="progressbar" aria-valuenow={Math.round(progress)}
         aria-valuemin={0} aria-valuemax={100} aria-label="Loading progress"
         style={{ width:"100%", height:"1.5px",
                  background:"rgba(200,205,235,0.07)",
                  borderRadius:"1px", position:"relative", overflow:"hidden" }}>
      <motion.div
        style={{
          position:"absolute", top:0, left:0, height:"100%", borderRadius:"1px",
          background:`linear-gradient(90deg, ${C.charcoal} 0%, ${C.haze} 35%, ${C.cool} 65%, ${C.periwinkle} 100%)`,
        }}
        initial={{ width:"0%" }}
        animate={{ width:`${progress}%` }}
        transition={{ duration: 0.5, ease: EASE_OUT }}
      />
    </div>
  );
}

/* Scan line — atmospheric sci-fi detail */
function ScanLine() {
  return (
    <div aria-hidden="true"
         style={{ position:"absolute", inset:0, overflow:"hidden", pointerEvents:"none", opacity:0.022 }}>
      <div style={{
        position:"absolute", left:0, right:0, height:"3px",
        background:`linear-gradient(to bottom, transparent, rgba(200,205,235,0.9), transparent)`,
        animation:"na-scan 14s linear infinite",
      }} />
    </div>
  );
}

/* ════════════════════════════════════════
   LOADING SCREEN
════════════════════════════════════════ */
export default function LoadingScreen({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [ready,    setReady   ] = useState(false);
  const [done,     setDone    ] = useState(false);
  const timerRef = useRef(null);

  /* Inject keyframes + Google Fonts (Noto Sans JP) */
  useEffect(() => {
    /* Fonts */
    if (!document.getElementById("__na-fonts")) {
      const link = document.createElement("link");
      link.id   = "__na-fonts";
      link.rel  = "stylesheet";
      link.href = "https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400&display=swap";
      document.head.appendChild(link);
    }
    /* Keyframes */
    if (!document.getElementById("__na-kf")) {
      const s = document.createElement("style");
      s.id = "__na-kf";
      s.textContent = `
        @keyframes na-eq    { from{height:3px;} to{height:11px;} }
        @keyframes na-scan  { 0%{top:-4px;} 100%{top:100%;} }
        @keyframes na-blink { 0%,100%{opacity:1;} 50%{opacity:0.12;} }
        @keyframes na-pulse { 0%,100%{opacity:0.55;transform:scale(1);}
                              50%{opacity:1;transform:scale(1.4);} }
        @keyframes na-glitch{
          0%,94%,100%{transform:translateX(0);}
          95%{transform:translateX(-2px);}
          97%{transform:translateX(2px);}
        }
      `;
      document.head.appendChild(s);
    }

    const rt = setTimeout(() => setReady(true), 80);

    /* Progress simulation */
    let p = 0;
    const tick = () => {
      const sp = p>90?0.25 : p>68?1.2 : p>38?2.4 : 4.0;
      p = Math.min(p + Math.random()*sp + 0.18, 100);
      setProgress(p);
      if (p >= 100) { setDone(true); if(onComplete) setTimeout(onComplete,720); return; }
      timerRef.current = setTimeout(tick, p>90?480 : p>68?240 : p>38?155:110);
    };
    timerRef.current = setTimeout(tick, 580);
    return () => { clearTimeout(rt); if(timerRef.current) clearTimeout(timerRef.current); };
  }, []);

  const phase = PHASES.reduce((acc,ph) => progress>=ph.min ? ph : acc, PHASES[0]);
  const pct   = Math.min(Math.round(progress), 100);

  /* Font stacks */
  const JP = '"Noto Sans JP", "Hiragino Kaku Gothic ProN", sans-serif';
  const EN = '"Inter", system-ui, sans-serif';

  return (
    <div role="status" aria-label="Loading" aria-busy={String(!done)}
         style={{ position:"fixed", inset:0, zIndex:9000,
                  background:C.charcoal, fontFamily:EN, overflow:"hidden" }}>

      {/* ── 1. LaserFlow WebGL ──────────────────────────────────── */}
      <div aria-hidden="true" style={{ position:"absolute", inset:0 }}>
        <LaserFlow
          color={C.periwinkle}
          horizontalBeamOffset={0}
          verticalBeamOffset={-0.02}
          verticalSizing={3.8}
          horizontalSizing={0.28}
          fogIntensity={0.35}
          fogScale={0.20}
          wispDensity={0.50}
          wispIntensity={3.5}
          wispSpeed={7}
          flowSpeed={0.22}
          flowStrength={0.22}
          decay={1.06}
          falloffStart={1.14}
          fogFallSpeed={0.38}
          mouseTiltStrength={0.06}
          mouseSmoothTime={0.20}
          style={{ width:"100%", height:"100%" }}
        />
      </div>

      {/* ── 2. Depth / atmosphere ───────────────────────────────── */}
      {/* Deep vignette */}
      <div aria-hidden="true" style={{
        position:"absolute", inset:0, pointerEvents:"none",
        background:"radial-gradient(ellipse 75% 75% at 50% 50%, transparent 25%, rgba(5,8,15,0.78) 100%)",
      }} />
      {/* Sub-palette nebula */}
      <div aria-hidden="true" style={{
        position:"absolute", inset:0, pointerEvents:"none",
        background:`
          radial-gradient(ellipse 55% 75% at 68% 38%, rgba(184,190,215,0.05), transparent 62%),
          radial-gradient(ellipse 40% 55% at 28% 72%, rgba(82,78,104,0.08),   transparent 56%)
        `,
      }} />

      {/* ── 3. Scan line ────────────────────────────────────────── */}
      <ScanLine />

      {/* ── 4. Corner targeting brackets ────────────────────────── */}
      <CornerBrackets visible={ready} />

      {/* ── 5. Top HUD bar ──────────────────────────────────────── */}
      <motion.div
        initial="hidden" animate={ready ? "visible" : "hidden"} variants={V.slideDown}
        style={{
          position:"absolute", top:0, left:0, right:0,
          display:"flex", alignItems:"center", justifyContent:"space-between",
          padding:"0 32px", height:"40px",
          borderBottom:"1px solid rgba(200,205,235,0.06)",
        }}
        aria-hidden="true"
      >
        {/* Left — system ID */}
        <div style={{ display:"flex", alignItems:"center", gap:"12px" }}>
          {/* Tri-dot sigil */}
          <div style={{ display:"flex", gap:"4px", alignItems:"center" }}>
            {[1,0.5,0.25].map((op,i) => (
              <div key={i} style={{ width:"3px", height:"3px", borderRadius:"50%",
                                    background:`rgba(200,205,235,${op})` }} />
            ))}
          </div>
          <span style={{ fontFamily:EN, fontSize:"0.58rem", fontWeight:600,
                         letterSpacing:"0.22em", textTransform:"uppercase",
                         color:`rgba(135,140,180,0.45)` }}>
            NA:SYS&nbsp;&nbsp;//&nbsp;&nbsp;起動シーケンス
          </span>
        </div>
        {/* Right — live clock + timezone */}
        <div style={{ display:"flex", alignItems:"center", gap:"8px",
                      fontFamily:EN, fontSize:"0.58rem", fontWeight:400,
                      letterSpacing:"0.12em", color:`rgba(135,140,180,0.38)` }}>
          <ClockDisplay />
          <span style={{ opacity:0.5 }}>//</span>
          <span>JST</span>
        </div>
      </motion.div>

      {/* ── 6. Main content ─────────────────────────────────────── */}
      <div style={{ position:"absolute", inset:0,
                    display:"flex", flexDirection:"column",
                    alignItems:"center", justifyContent:"center" }}>

        {/* Large atmospheric kanji 夜 (night) — 夜 = Nocturnal */}
        <div aria-hidden="true" style={{
          position:"absolute", top:"50%", left:"50%",
          transform:"translate(-50%, -60%)",
          fontSize:"clamp(240px,35vw,340px)",
          fontFamily:JP, fontWeight:300,
          color:C.periwinklePale,
          opacity:0.025,
          lineHeight:1, userSelect:"none", pointerEvents:"none",
          letterSpacing:"-0.05em",
          animation:"na-glitch 8s ease-in-out infinite",
        }}>
          夜
        </div>

        <motion.div
          initial="hidden"
          animate={ready ? "visible" : "hidden"}
          variants={V.stagger}
          style={{
            position:"relative", zIndex:1,
            width:"clamp(300px, 46vw, 520px)",
          }}
        >
          {/* ── Status row ─────────────────────────────────────── */}
          <motion.div variants={V.fadeIn}
            style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
                     marginBottom:"2.8rem" }}>
            {/* Left: pulse dot + JP status */}
            <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
              <span aria-hidden="true" style={{
                width:"5px", height:"5px", borderRadius:"50%", flexShrink:0,
                background: done ? C.periwinkle : C.subMount,
                animation: done ? "none" : "na-pulse 1.6s ease-in-out infinite",
              }} />
              <AnimatePresence mode="wait">
                <motion.span key={phase.jp}
                  initial={{opacity:0, x:-6}} animate={{opacity:1, x:0}} exit={{opacity:0, x:6}}
                  transition={{duration:0.3, ease:EASE_SPRING}}
                  style={{ fontFamily:JP, fontSize:"0.72rem", fontWeight:400,
                           color:`rgba(135,140,180,0.55)`, letterSpacing:"0.04em" }}>
                  {phase.jp}
                </motion.span>
              </AnimatePresence>
              {/* EN echo */}
              <span style={{ fontFamily:EN, fontSize:"0.56rem", fontWeight:400,
                             letterSpacing:"0.16em", textTransform:"uppercase",
                             color:`rgba(135,140,180,0.28)` }}>
                {phase.en}
              </span>
            </div>
            {/* Right: waveform */}
            <WaveformSVG active={!done} />
          </motion.div>

          {/* ── Headline block ─────────────────────────────────── */}
          <motion.div variants={V.fadeUp} style={{ marginBottom:"0.3rem" }}>
            {/* JP heading — Noto Sans JP, small, hazeLight */}
            <p style={{ margin:0, fontFamily:JP, fontSize:"1.05rem",
                        fontWeight:300, letterSpacing:"0.12em",
                        color:C.hazeLight, lineHeight:1.2 }}>
              ローディング
            </p>
          </motion.div>

          <motion.div variants={V.fadeUp} style={{ marginBottom:"0.5rem" }}>
            {/* EN heading — Inter 300, very large */}
            <h1 style={{ margin:0, fontFamily:EN,
                         fontSize:"clamp(3.2rem, 7vw, 5rem)",
                         fontWeight:300, letterSpacing:"-0.035em",
                         lineHeight:1.0, color:C.periwinklePale,
                         textShadow:"0 0 90px rgba(10,15,25,0.5)" }}>
              Loading
            </h1>
          </motion.div>

          {/* Sub-text — JP + EN */}
          <motion.div variants={V.fadeUp} style={{ marginBottom:"2.8rem" }}>
            <p style={{ margin:0, fontFamily:JP, fontSize:"0.72rem",
                        fontWeight:300, letterSpacing:"0.06em",
                        color:`rgba(135,140,180,0.50)`, lineHeight:1.8 }}>
              起動シーケンスを実行しています
              <span style={{ fontFamily:EN, fontSize:"0.68rem", fontWeight:300,
                             letterSpacing:"0.02em", marginLeft:"1em",
                             color:`rgba(135,140,180,0.30)` }}>
                — please wait.
              </span>
            </p>
          </motion.div>

          {/* ── Aurora band ─────────────────────────────────────── */}
          <motion.div variants={V.fadeIn} style={{ marginBottom:"1.6rem" }}>
            <AuroraBand />
          </motion.div>

          {/* ── Progress section ────────────────────────────────── */}
          <motion.div variants={V.fadeUp}>
            {/* Phase row */}
            <div style={{ display:"flex", justifyContent:"space-between",
                          alignItems:"baseline", marginBottom:"10px" }}>
              {/* Phase kanji accent */}
              <div style={{ display:"flex", alignItems:"baseline", gap:"8px" }}>
                <AnimatePresence mode="wait">
                  <motion.span key={phase.kanji}
                    initial={{opacity:0, y:6}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-6}}
                    transition={{duration:0.25, ease:EASE_SPRING}}
                    style={{ fontFamily:JP, fontSize:"0.9rem", fontWeight:300,
                             color:`rgba(200,205,235,0.25)`, letterSpacing:"0.08em" }}>
                    {phase.kanji}
                  </motion.span>
                </AnimatePresence>
                <AnimatePresence mode="wait">
                  <motion.span key={phase.jp + "2"}
                    initial={{opacity:0, x:-4}} animate={{opacity:1, x:0}} exit={{opacity:0, x:4}}
                    transition={{duration:0.28, ease:EASE_SPRING}}
                    style={{ fontFamily:EN, fontSize:"0.60rem", fontWeight:400,
                             letterSpacing:"0.18em", textTransform:"uppercase",
                             color:`rgba(135,140,180,0.40)` }}>
                    {phase.en}
                  </motion.span>
                </AnimatePresence>
              </div>
              {/* Percentage */}
              <span style={{ fontFamily:EN, fontSize:"0.88rem", fontWeight:300,
                             color: pct>=100 ? C.periwinklePale : `rgba(200,205,235,0.72)`,
                             fontVariantNumeric:"tabular-nums", letterSpacing:"0.02em",
                             transition:"color 0.4s ease" }}>
                {pct}
                <span style={{ fontSize:"0.60rem", fontWeight:300,
                               color:`rgba(200,205,235,0.40)`, marginLeft:"1px" }}>%</span>
              </span>
            </div>

            {/* Progress bar */}
            <ProgressBar progress={progress} />

            {/* Tick marks */}
            <div style={{ display:"flex", justifyContent:"space-between", marginTop:"7px" }}>
              {[0,25,50,75,100].map(m => (
                <span key={m} style={{
                  fontFamily:EN, fontSize:"0.55rem", fontWeight:400,
                  fontVariantNumeric:"tabular-nums",
                  color: progress>=m ? "rgba(200,205,235,0.22)" : "rgba(200,205,235,0.07)",
                  transition:"color 0.45s ease",
                }}>{m}</span>
              ))}
            </div>
          </motion.div>

          {/* ── Footer ─────────────────────────────────────────── */}
          <motion.div variants={V.fadeIn}
            style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
                     marginTop:"2.8rem",
                     paddingTop:"1.2rem",
                     borderTop:"1px solid rgba(200,205,235,0.06)" }}>
            <span style={{ fontFamily:JP, fontSize:"0.65rem", fontWeight:300,
                           letterSpacing:"0.08em",
                           color:`rgba(135,140,180,0.32)` }}>
              ノクターナル アトリエ
            </span>
            <span style={{ fontFamily:EN, fontSize:"0.56rem", fontWeight:400,
                           letterSpacing:"0.14em",
                           color:`rgba(135,140,180,0.24)` }}>
              DS&thinsp;v3.2
            </span>
          </motion.div>

        </motion.div>

        {/* ── Complete prompt ─────────────────────────────────── */}
        <AnimatePresence>
          {done && (
            <motion.div
              initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} exit={{opacity:0}}
              transition={{duration:0.55, ease:EASE_SPRING}}
              style={{ position:"absolute",
                       bottom:"clamp(32px,5.5vh,56px)",
                       display:"flex", flexDirection:"column",
                       alignItems:"center", gap:"4px" }}
            >
              <p style={{ margin:0, fontFamily:JP, fontSize:"0.70rem", fontWeight:300,
                          letterSpacing:"0.08em",
                          color:`rgba(135,140,180,0.40)`,
                          animation:"na-blink 2s ease-in-out infinite" }}>
                キーを押してください
              </p>
              <p style={{ margin:0, fontFamily:EN, fontSize:"0.58rem", fontWeight:400,
                          letterSpacing:"0.22em", textTransform:"uppercase",
                          color:`rgba(135,140,180,0.25)`,
                          animation:"na-blink 2s ease-in-out infinite 0.15s" }}>
                Press any key to continue
              </p>
            </motion.div>
          )}
        </AnimatePresence>

      </div>{/* /content */}

      {/* ── 7. Bottom HUD strip ─────────────────────────────────── */}
      <motion.div
        initial="hidden" animate={ready ? "visible" : "hidden"}
        variants={{ hidden:{opacity:0}, visible:{opacity:1,transition:{duration:0.6,delay:1.0,ease:"easeOut"}} }}
        style={{
          position:"absolute", bottom:0, left:0, right:0,
          display:"flex", alignItems:"center", justifyContent:"center",
          gap:"24px", height:"38px",
          borderTop:"1px solid rgba(200,205,235,0.05)",
        }}
        aria-hidden="true"
      >
        {["React 19", "Next.js 15", "Three.js r128"].map((label, i) => (
          <span key={i} style={{ fontFamily:EN, fontSize:"0.56rem", fontWeight:400,
                                  letterSpacing:"0.14em", textTransform:"uppercase",
                                  color:`rgba(135,140,180,0.22)` }}>
            {label}
          </span>
        ))}
      </motion.div>

    </div>
  );
}