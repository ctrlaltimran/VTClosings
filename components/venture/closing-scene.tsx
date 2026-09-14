"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html, OrthographicCamera, OrbitControls } from "@react-three/drei";
import { useTheme } from "next-themes";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useInView } from "framer-motion";
import * as THREE from "three";

type Vec3 = [number, number, number];
type LightingProps = { dark: boolean; reduced: boolean };

function Block({ at, size, color = "#e9e6dc", rotation, metal = false }: {
  at: Vec3; size: Vec3; color?: string; rotation?: Vec3; metal?: boolean;
}) {
  return <mesh position={at} rotation={rotation} castShadow receiveShadow><boxGeometry args={size}/><meshStandardMaterial color={color} roughness={metal ? .35 : .82} metalness={metal ? .65 : 0}/></mesh>;
}

function WarmGlass({ dark, reduced }: LightingProps) {
  const material = useRef<THREE.MeshStandardMaterial>(null);
  const invalidate = useThree(state => state.invalidate);
  useLayoutEffect(() => { if (reduced && material.current) material.current.emissiveIntensity = dark ? 1.7 : 0; invalidate(); }, [dark, reduced, invalidate]);
  useFrame((_, delta) => {
    if (material.current && !reduced) material.current.emissiveIntensity = THREE.MathUtils.damp(material.current.emissiveIntensity, dark ? 1.7 : 0, 5, delta);
  });
  return <meshStandardMaterial ref={material} color={dark ? "#e5b771" : "#53656b"} emissive="#ffb34d" emissiveIntensity={0} roughness={.27} metalness={.12}/>;
}

function Window({ at, width, height, dark, reduced, side = false }: LightingProps & { at: Vec3; width: number; height: number; side?: boolean }) {
  return <group position={at} rotation={[0, side ? Math.PI / 2 : 0, 0]}>
    <Block at={[0,0,0]} size={[width+.12,height+.12,.1]} color="#483728"/>
    <mesh position={[0,0,.058]}><planeGeometry args={[width,height]}/><WarmGlass dark={dark} reduced={reduced}/></mesh>
    {[-1,1].map(s => <Block key={s} at={[s*(width/2-.065),0,.072]} size={[.09,height,.018]} color={dark ? "#d3b778" : "#a39b87"}/>)}
    <Block at={[0,0,.083]} size={[.042,height,.035]} color="#664329"/>
    <Block at={[0,-height/2-.07,.06]} size={[width+.24,.085,.2]} color="#ded9cb"/>
  </group>;
}

function RoofTiles({ slope }: { slope: number }) {
  const ref = useRef<THREE.InstancedMesh>(null);
  useLayoutEffect(() => {
    if (!ref.current) return;
    const dummy = new THREE.Object3D(); const color = new THREE.Color(); let n = 0;
    for (let row=0;row<5;row++) for(let col=0;col<14;col++) {
      dummy.position.set(-.47+row*.235,.035,-1.02+col*.157);
      dummy.rotation.set(0,0,Math.PI/2); dummy.updateMatrix();
      ref.current.setMatrixAt(n,dummy.matrix);
      color.setHSL(.047+(col%3)*.004,.51,.35+(row%3)*.023); ref.current.setColorAt(n++,color);
    }
    ref.current.instanceMatrix.needsUpdate=true;
  },[]);
  return <group position={[1.69+slope*.47,2.05,0]} rotation={[0,0,-slope*.58]}>
    <Block at={[0,0,0]} size={[1.17,.095,2.3]} color="#904c2c"/>
    <instancedMesh ref={ref} args={[undefined,undefined,70]} castShadow receiveShadow><cylinderGeometry args={[.078,.091,.26,8,1,true,0,Math.PI]}/><meshStandardMaterial color="#bb6238" roughness={.92}/></instancedMesh>
  </group>;
}

function Gable() {
  const shape = useMemo(() => {
    const outline = new THREE.Shape();
    outline.moveTo(-.72,0); outline.lineTo(.72,0); outline.lineTo(0,.61); outline.closePath();
    return outline;
  },[]);
  return <>{[-1.025,1.025].map(z => <mesh key={z} position={[1.69,1.775,z]} castShadow><shapeGeometry args={[shape]}/><meshStandardMaterial color="#deded4" roughness={.85} side={THREE.DoubleSide}/></mesh>)}</>;
}

function PlantBed({ at, width }: { at: Vec3; width: number }) {
  const ref = useRef<THREE.InstancedMesh>(null);
  useLayoutEffect(() => {
    if (!ref.current) return;
    const dummy = new THREE.Object3D(); const color = new THREE.Color();
    for(let i=0;i<45;i++) {
      dummy.position.set(Math.sin(i*7.17)*(width/2-.07),.23+(i%4)*.05,Math.cos(i*3.7)*.16);
      dummy.scale.set(.09+(i%3)*.018,.075,.07);dummy.updateMatrix();ref.current.setMatrixAt(i,dummy.matrix);
      color.setHSL(.22+(i%3)*.023,.3,.24+(i%5)*.035);ref.current.setColorAt(i,color);
    }
    ref.current.instanceMatrix.needsUpdate=true;
  },[width]);
  return <group position={at}><Block at={[0,.06,0]} size={[width,.25,.52]} color="#d9dbcd"/><Block at={[0,.19,0]} size={[width-.09,.02,.43]} color="#444336"/><instancedMesh ref={ref} args={[undefined,undefined,45]} castShadow><icosahedronGeometry args={[1,1]}/><meshStandardMaterial roughness={1}/></instancedMesh></group>;
}

function Sconce({ at, dark, reduced }: LightingProps & { at: Vec3 }) {
  return <group position={at}><Block at={[0,0,0]} size={[.1,.22,.09]} color="#343331" metal/><mesh position={[0,-.035,.055]}><boxGeometry args={[.053,.13,.03]}/><WarmGlass dark={dark} reduced={reduced}/></mesh></group>;
}

function HouseModel({ dark, reduced, toggle, showHint }: LightingProps & { toggle: () => void; showHint: boolean }) {
  return <group>
    <Block at={[0,-.19,0]} size={[5.3,.23,4.05]} color="#383d3c"/>
    <Block at={[0,-.055,0]} size={[5.18,.07,3.96]} color="#82905c"/>
    <Block at={[0,0,-.3]} size={[4.87,.07,3.1]} color="#c2bdb0"/>
    <Block at={[-.47,.9,0]} size={[3.07,1.75,2.05]} color="#c6c5bb"/>
    <Block at={[-.7,2.19,-.18]} size={[2.63,1.32,1.7]} color="#484d4c"/>
    <Block at={[1.65,.9,0]} size={[1.45,1.75,2.05]} color="#e3e1d9"/>
    {/* Timber-clad entrance and upper-floor wall, with individual board joints. */}
    <Block at={[-.3,.93,1.04]} size={[1.38,1.63,.085]} color="#95623b"/>
    <Block at={[-.9,2.32,.7]} size={[1.95,1.03,.075]} color="#95613b"/>
    {Array.from({length:15},(_,i) => <Block key={i} at={[-.3,.19+i*.104,1.091]} size={[1.38,.013,.01]} color="#67462e"/>)}
    {Array.from({length:9},(_,i) => <Block key={i} at={[-.9,1.89+i*.113,.75]} size={[1.96,.013,.012]} color="#67462e"/>)}
    {/* White structural frames, deep roof slabs, and recessed balcony. */}
    <Block at={[-.47,1.73,.12]} size={[3.3,.16,2.45]} color="#f1eee4"/>
    <Block at={[-.72,2.96,-.16]} size={[2.92,.15,2.01]} color="#ecece5"/>
    <Block at={[-1.92,2.28,.9]} size={[.16,1.39,.22]} color="#eeeae0"/>
    <Block at={[.48,2.28,.9]} size={[.15,1.39,.22]} color="#eeeae0"/>
    <Block at={[-.72,3.24,-.3]} size={[2.64,.17,1.92]} color="#484d50"/>
    <Block at={[-.72,3.17,-.3]} size={[2.39,.05,1.67]} color="#83898b"/>
    <Block at={[-.72,3.1,-1.23]} size={[2.64,.18,.07]} color="#3e4348"/>
    <Block at={[-.72,3.04,-.28]} size={[2.34,.12,1.65]} color="#9c653e"/>
    <Block at={[-.72,1.85,.99]} size={[2.51,.09,.67]} color="#d5d1c5"/>
    <mesh position={[-.72,2.09,1.32]}><boxGeometry args={[2.4,.43,.022]}/><meshPhysicalMaterial color="#809598" transparent opacity={.28} roughness={.15} metalness={.15} depthWrite={false}/></mesh>
    {[-1.94,-1.32,-.71,-.1,.51].map(x=><Block key={x} at={[x,2.09,1.34]} size={[.025,.5,.026]} color="#303736" metal/>)}
    <Block at={[-.72,2.34,1.34]} size={[2.48,.033,.035]} color="#303736" metal/>
    <Block at={[-.72,1.86,1.34]} size={[2.48,.035,.035]} color="#303736" metal/>
    <Block at={[-1.94,2.34,1.06]} size={[.03,.035,.56]} color="#303736" metal/>
    <Block at={[.51,2.34,1.06]} size={[.03,.035,.56]} color="#303736" metal/>
    <Gable/><RoofTiles slope={1}/><RoofTiles slope={-1}/>
    <Block at={[1.69,2.4,0]} size={[.1,.07,2.36]} color="#a75a32"/>
    <Window at={[-1.4,.91,1.05]} width={.77} height={.99} dark={dark} reduced={reduced}/>
    <Window at={[-.15,.95,1.11]} width={.72} height={1.24} dark={dark} reduced={reduced}/>
    <Window at={[-1.12,2.34,.79]} width={1.14} height={.98} dark={dark} reduced={reduced}/>
    <Window at={[.01,2.34,.7]} width={.39} height={.73} dark={dark} reduced={reduced}/>
    <Window at={[1.64,.95,1.05]} width={.82} height={.98} dark={dark} reduced={reduced}/>
    <Window at={[2.395,.96,-.06]} width={.71} height={.94} side dark={dark} reduced={reduced}/>
    <Block at={[-.12,.92,1.2]} size={[.045,1.23,.035]} color="#704625"/>
    <Block at={[-.015,.89,1.25]} size={[.02,.13,.035]} color="#cab486" metal/>
    {[-1.94,.52].map(x=><Sconce key={x} at={[x,1.2,1.16]} dark={dark} reduced={reduced}/>)}
    <Sconce at={[.42,2.69,.96]} dark={dark} reduced={reduced}/>
    {[0,1,2].map(i=><Block key={i} at={[-.15,.065+i*.075,1.79-i*.18]} size={[1.88,.075,.62-i*.12]} color={i===2?"#e0ddd3":"#c5c3b8"}/>)}
    <Block at={[-.15,-.005,2.0]} size={[2.0,.07,.67]} color="#d2cfc3"/>
    {[-.87,-.42,.03,.48].map(x=><Block key={x} at={[x,.036,2.05]} size={[.017,.005,.5]} color="#b3b3a8"/>)}
    <PlantBed at={[-1.88,.1,1.42]} width={1.1}/><PlantBed at={[1.79,.1,1.47]} width={1.33}/>
    {/* Stone courses, window trim, side balustrades, gutters and hardware. */}
    {Array.from({length:10},(_,i)=><Block key={i} at={[-1.49,.17+i*.147,1.031]} size={[1.02,.012,.011]} color="#9ea19b"/>)}
    {[-1.94,.51].map(x=><mesh key={x} position={[x,2.09,1.055]}><boxGeometry args={[.018,.42,.51]}/><meshPhysicalMaterial color="#899c9b" transparent opacity={.25} roughness={.16} depthWrite={false}/></mesh>)}
    <Block at={[2.55,1.75,0]} size={[.055,.075,2.33]} color="#5a5248" metal/>
    <Block at={[2.42,.91,-.98]} size={[.047,1.64,.047]} color="#71766e" metal/>
    {[.3,.87,1.48].map(y=><Block key={y} at={[2.425,y,-.98]} size={[.055,.027,.062]} color="#535c56" metal/>)}
    <Block at={[-1.4,1.5,1.1]} size={[1.03,.06,.23]} color="#444c4b"/>
    <Block at={[1.64,1.53,1.1]} size={[1.1,.06,.2]} color="#e7e5dc"/>
    <Block at={[-.015,.89,1.257]} size={[.056,.2,.014]} color="#806f4c" metal/>
    <Block at={[-.015,.9,1.283]} size={[.018,.14,.032]} color="#c2ad78" metal/>
    {[1.85,2.03,2.2].map(z=><Block key={z} at={[-.15,.036,z]} size={[1.96,.005,.012]} color="#abaea3"/>)}
    {/* The switch is actual geometry, flush to the wall and perspective-correct. */}
    <group position={[.64,.9,1.043]} scale={[1.25,1.25,1]}>
      <Block at={[0,0,0]} size={[.12,.18,.014]} color="#d8d8ce"/>
      <Block at={[0,0,.009]} size={[.098,.158,.008]} color="#b7b9af"/>
      <group position={[0,0,.018]} rotation={[dark?-.12:.12,0,0]}>
        <Block at={[0,0,0]} size={[.074,.127,.019]} color="#eeece2"/>
        <mesh position={[0,-.041,.011]}><boxGeometry args={[.017,.007,.003]}/><meshStandardMaterial color={dark?"#e6ba71":"#748277"} emissive="#efae4e" emissiveIntensity={dark?.8:0}/></mesh>
      </group>
      {[-.073,.073].map(y=><group key={y} position={[0,y,.01]}><mesh rotation={[Math.PI/2,0,0]}><cylinderGeometry args={[.0045,.0045,.003,10]}/><meshStandardMaterial color="#979a91" metalness={.7} roughness={.3}/></mesh><Block at={[0,0,.004]} size={[.006,.001,.001]} color="#55594f"/></group>)}
    </group>
    <Html position={[.64,.9,1.087]} transform distanceFactor={4} scale={.875} occlude zIndexRange={[15,0]}>
      <button className="house-wall-hit" role="switch" aria-checked={dark} aria-label={dark ? "Turn house lights off and enable light mode" : "Turn house lights on and enable dark mode"} title={dark ? "Lights off · Light mode" : "Lights on · Dark mode"} onPointerDown={event=>event.stopPropagation()} onClick={event => { event.stopPropagation(); toggle(); }}>
        <span className="sr-only">House light switch</span>
      </button>
    </Html>
    {showHint && <Html position={[.64,.9,1.09]} style={{pointerEvents:"none"}} zIndexRange={[14,0]} occlude>
      <div className="night-discovery" role="note"><span>Make it night.<small>Try the little wall switch</small></span><svg viewBox="0 0 200 150" fill="none" aria-hidden="true"><path d="M 168 23 C 200 80, 100 116, 4 145 M 4 145 L 17 126 M 4 145 L 28 145"/></svg></div>
    </Html>}
  </group>;
}

function Lighting({ dark, reduced }: LightingProps) {
  const ambient=useRef<THREE.AmbientLight>(null),sun=useRef<THREE.DirectionalLight>(null),porch=useRef<THREE.PointLight>(null),balcony=useRef<THREE.PointLight>(null);
  useFrame((_,delta) => {
    const amount=reduced?1:1-Math.exp(-4*delta);
    if(ambient.current) ambient.current.intensity=THREE.MathUtils.lerp(ambient.current.intensity,dark?.38:1.65,amount);
    if(sun.current) sun.current.intensity=THREE.MathUtils.lerp(sun.current.intensity,dark?.8:3,amount);
    if(porch.current) porch.current.intensity=THREE.MathUtils.lerp(porch.current.intensity,dark?1.8:0,amount);
    if(balcony.current) balcony.current.intensity=THREE.MathUtils.lerp(balcony.current.intensity,dark?.9:0,amount);
  });
  return <><ambientLight ref={ambient} intensity={dark?.38:1.65}/><directionalLight ref={sun} position={[-3,7,5]} intensity={dark?.8:3} color={dark?"#b0c9f0":"#fff3df"} castShadow shadow-mapSize={[1024,1024]} shadow-camera-left={-5} shadow-camera-right={5} shadow-camera-top={5} shadow-camera-bottom={-5} shadow-normalBias={.04}/><directionalLight position={[5,3,-3]} intensity={dark?.75:.55} color="#a3bdd4"/><pointLight ref={porch} position={[-.15,1.1,1.7]} color="#ffc06b" intensity={dark?1.8:0} distance={3.3} decay={2}/><pointLight ref={balcony} position={[-.8,2.3,1.25]} color="#ffc46c" intensity={dark?.9:0} distance={2.6} decay={2}/></>;
}

function Framing() {
  const { size }=useThree();
  return <OrthographicCamera makeDefault position={[6,4.7,8]} zoom={Math.min(size.width/8.1,size.height/7.1)} near={.1} far={100} onUpdate={camera=>{camera.lookAt(0,1.4,.15);camera.updateProjectionMatrix();camera.updateMatrixWorld();}}/>;
}

export default function ClosingScene({ reduced=false }: { reduced?: boolean }) {
  const { resolvedTheme,setTheme }=useTheme();const dark=resolvedTheme==="dark";
  const sceneRef=useRef<HTMLDivElement>(null);
  const inView=useInView(sceneRef,{amount:.45});
  const [dismissed,setDismissed]=useState(true);
  useEffect(()=>{try{setDismissed(sessionStorage.getItem("venture-night-discovered")==="yes");}catch{setDismissed(false);}},[]);
  const toggle=()=>{setDismissed(true);try{sessionStorage.setItem("venture-night-discovered","yes");}catch{}setTheme(dark?"light":"dark");};
  return <div ref={sceneRef} className="house-scene">
    <Canvas shadows={{type:THREE.PCFShadowMap}} dpr={[1,1.5]} frameloop={reduced?"demand":"always"} gl={{antialias:true,alpha:true}} fallback={<div className="scene-fallback">Your next beginning.<button onClick={()=>setTheme(dark?"light":"dark")}>Switch to {dark?"light":"dark"} mode</button></div>}>
      <Framing/><Lighting dark={dark} reduced={reduced}/><HouseModel dark={dark} reduced={reduced} toggle={toggle} showHint={inView&&!dismissed&&!dark}/>
      <OrbitControls makeDefault target={[0,1.4,.15]} enableZoom={false} enablePan={false} enableDamping={!reduced} dampingFactor={.12} rotateSpeed={.65} minAzimuthAngle={-.35} maxAzimuthAngle={1.15} minPolarAngle={.95} maxPolarAngle={1.4}/>
      <mesh position={[0,-.32,0]} rotation={[-Math.PI/2,0,0]} receiveShadow><planeGeometry args={[20,20]}/><shadowMaterial transparent opacity={dark?.35:.18}/></mesh>
    </Canvas>
    <div className="house-switch-hint"><span className={dark?"lights-on":""}/><span>Drag to explore · </span><button onClick={toggle} aria-pressed={dark}>{dark?"Turn lights off":"Turn lights on"}</button></div>
  </div>;
}
