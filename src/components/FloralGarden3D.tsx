import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as THREE from 'three';
import { CycleCalculationResult, CyclePhase } from '../types';
import {
  Flower2,
  Sparkles,
  Droplet,
  ChevronRight,
  Sun,
  Moon,
  Info,
  RotateCcw
} from 'lucide-react';

interface FloralGarden3DProps {
  stats: CycleCalculationResult;
  onOpenLogModal?: () => void;
  onQuickLogPeriodStart?: () => void;
  className?: string;
  showDetails?: boolean;
}

interface FlowerMeshInfo {
  group: THREE.Group;
  petals: Array<{
    mesh: THREE.Mesh;
    baseAngle: number;
    targetPitch: number;
    layer: number;
  }>;
  stamen: THREE.Mesh;
  glowLight?: THREE.PointLight;
  type: CyclePhase | 'main';
  label: string;
  bloomMultiplier: number;
}

export const FloralGarden3D: React.FC<FloralGarden3DProps> = ({
  stats,
  onOpenLogModal,
  onQuickLogPeriodStart,
  className = '',
  showDetails = true
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [selectedDay, setSelectedDay] = useState<number>(stats.currentDayOfCycle || 1);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [hoveredFlower, setHoveredFlower] = useState<string | null>(null);

  // Synchronize when stats update unless user is manually sliding
  useEffect(() => {
    if (!isSimulating) {
      setSelectedDay(stats.currentDayOfCycle || 1);
    }
  }, [stats.currentDayOfCycle, isSimulating]);

  const totalDays = stats.totalCycleLength || 28;
  const currentDay = Math.min(Math.max(1, selectedDay), totalDays);

  // Determine phase for the selected day
  const getPhaseForDay = (day: number): { phase: CyclePhase; label: string; desc: string; bloomTarget: number; skinAdvice: string } => {
    if (day <= stats.averagePeriodLength) {
      return {
        phase: 'menstrual',
        label: 'Phase Menstruelle • Repos & Régénération',
        desc: 'Les fleurs se recueillent en boutons protecteurs. Votre corps invite au cocooning, à l’hydratation et à la douceur.',
        bloomTarget: 0.22,
        skinAdvice: 'Hydratation apaisante et soins réconfortants riches en céramides.'
      };
    }
    const ovulationDay = Math.max(8, totalDays - 14);
    if (day >= ovulationDay - 5 && day < ovulationDay) {
      return {
        phase: 'fertile',
        label: 'Fenêtre Fertile • Éclosion & Énergie',
        desc: 'Les corolles s’ouvrent généreusement. Les œstrogènes grimpent, votre énergie et votre créativité s’épanouissent.',
        bloomTarget: 0.88,
        skinAdvice: 'Éclat maximal, teint lumineux, légers sérums à la vitamine C et niacinamide.'
      };
    }
    if (day === ovulationDay) {
      return {
        phase: 'ovulation',
        label: 'Ovulation • Pleine Floraison & Rayonnement',
        desc: 'Apogée du jardin : floraison éclatante et pistils d’or ! Pic hormonal, confiance et magnétisme naturel.',
        bloomTarget: 1.15,
        skinAdvice: 'Protection UV indispensable et nettoyage doux pour maintenir les pores nets.'
      };
    }
    if (day < ovulationDay - 5) {
      return {
        phase: 'follicular',
        label: 'Phase Folliculaire • Réveil du Jardin',
        desc: 'Les boutons s’étirent vers la lumière. Renouveau cellulaire, clarté mentale et dynamisme ascendant.',
        bloomTarget: 0.55,
        skinAdvice: 'Acide hyaluronique et lotions toniques fraîches pour stimuler la barrière cutanée.'
      };
    }
    return {
      phase: 'luteal',
      label: 'Phase Lutéale • Corolle Cocon & Écoute',
      desc: 'Les fleurs se referment avec délicatesse. Progestérone dominante, moment idéal pour ralentir et s’apaiser.',
      bloomTarget: 0.38,
      skinAdvice: 'Actifs purifiants doux (Zinc, Centella Asiatica) pour prévenir les imperfections.'
    };
  };

  const currentPhaseInfo = useMemo(() => getPhaseForDay(currentDay), [currentDay, totalDays, stats.averagePeriodLength]);

  // Ref to pass target bloom smoothly into Three.js render loop
  const targetBloomRef = useRef<number>(currentPhaseInfo.bloomTarget);
  targetBloomRef.current = currentPhaseInfo.bloomTarget;

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 360;
    const height = container.clientHeight || 340;

    // Detect software rendering
    const isSoftwareGl = (() => {
      try {
        const gl = document.createElement('canvas').getContext('webgl2');
        if (!gl) return true;
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param));
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return true;
      }
    })();

    // 1. Scene & Atmosphere
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0xFFF0F5, 0.04);

    // 2. Camera Setup
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 50);
    camera.position.set(0, 3.4, 6.2);
    camera.lookAt(0, 0.4, 0);

    // 3. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.setClearColor(0x000000, 0);

    container.appendChild(renderer.domElement);

    // 4. Lighting Rig (Rose pastel, golden sunbeam, warm ambient)
    const ambientLight = new THREE.AmbientLight(0xFFE8EE, 1.6);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xFFFFFF, 2.2);
    sunLight.position.set(5, 10, 6);
    scene.add(sunLight);

    const softPinkFill = new THREE.DirectionalLight(0xFFA6BA, 1.4);
    softPinkFill.position.set(-6, 3, -4);
    scene.add(softPinkFill);

    const gardenFloorLight = new THREE.PointLight(0xFFD1DC, 1.2, 10);
    gardenFloorLight.position.set(0, -0.5, 0);
    scene.add(gardenFloorLight);

    // 5. Garden Mound / Floating Island (Soft pastel hill)
    const gardenGroup = new THREE.Group();
    scene.add(gardenGroup);

    const islandGeo = new THREE.CylinderGeometry(2.8, 3.2, 0.45, 32);
    const islandMat = new THREE.MeshStandardMaterial({
      color: 0xF7E1E8,
      roughness: 0.8,
      metalness: 0.05
    });
    const islandMesh = new THREE.Mesh(islandGeo, islandMat);
    islandMesh.position.y = -0.25;
    gardenGroup.add(islandMesh);

    // Moss / Grass rim ring
    const grassRingGeo = new THREE.TorusGeometry(2.75, 0.2, 16, 36);
    const grassRingMat = new THREE.MeshStandardMaterial({
      color: 0xD8E8C5, // Soft sage green
      roughness: 0.65,
      metalness: 0.05
    });
    const grassRing = new THREE.Mesh(grassRingGeo, grassRingMat);
    grassRing.rotation.x = Math.PI / 2;
    grassRing.position.y = -0.05;
    gardenGroup.add(grassRing);

    // Mini decorative pearls & dew drops around garden edge
    const dewGeo = new THREE.SphereGeometry(0.06, 12, 12);
    const dewMat = new THREE.MeshStandardMaterial({
      color: 0xFFFFFF,
      roughness: 0.1,
      metalness: 0.1,
      transparent: true,
      opacity: 0.85
    });
    for (let i = 0; i < 18; i++) {
      const angle = (i / 18) * Math.PI * 2;
      const dew = new THREE.Mesh(dewGeo, dewMat);
      dew.position.set(Math.cos(angle) * 2.7, -0.02, Math.sin(angle) * 2.7);
      gardenGroup.add(dew);
    }

    // --- PROCEDURAL PETAL GEOMETRIES ---
    const createPetalGeometry = (curvature: number = 0.5) => {
      const shape = new THREE.Shape();
      shape.moveTo(0, 0);
      shape.bezierCurveTo(-0.35, 0.25, -0.55 * curvature, 0.8, -0.42, 1.4);
      shape.bezierCurveTo(-0.3, 1.9, 0, 2.2, 0, 2.3);
      shape.bezierCurveTo(0, 2.2, 0.3, 1.9, 0.42, 1.4);
      shape.bezierCurveTo(0.55 * curvature, 0.8, 0.35, 0.25, 0, 0);

      const geo = new THREE.ExtrudeGeometry(shape, {
        depth: 0.03,
        bevelEnabled: true,
        bevelSegments: 3,
        steps: 1,
        bevelSize: 0.02,
        bevelThickness: 0.02
      });
      geo.center();
      geo.translate(0, 1.0, 0); // Pivot at petal base
      return geo;
    };

    const queenPetalGeo = createPetalGeometry(1.0);
    const satellitePetalGeo = createPetalGeometry(0.85);

    // Shared Stems
    const stemMat = new THREE.MeshStandardMaterial({
      color: 0xB5CE9B, // Soft sage stem
      roughness: 0.6
    });

    const createStem = (height: number) => {
      const stemGeo = new THREE.CylinderGeometry(0.04, 0.06, height, 12);
      stemGeo.translate(0, height / 2, 0);
      return new THREE.Mesh(stemGeo, stemMat);
    };

    // Flower Collection
    const flowers: FlowerMeshInfo[] = [];

    // Helper to build a flower
    const buildFlower = (
      x: number,
      z: number,
      stemHeight: number,
      scale: number,
      petalColors: { outer: number; mid: number; inner: number; stamen: number },
      type: CyclePhase | 'main',
      label: string,
      bloomMultiplier: number = 1.0
    ): FlowerMeshInfo => {
      const group = new THREE.Group();
      group.position.set(x, 0, z);
      group.scale.set(scale, scale, scale);
      gardenGroup.add(group);

      // Add stem
      const stem = createStem(stemHeight);
      group.add(stem);

      // Blossom sub-group sitting on top of stem
      const blossomGroup = new THREE.Group();
      blossomGroup.position.y = stemHeight;
      group.add(blossomGroup);

      // Calyx (Green base holding petals)
      const calyxGeo = new THREE.ConeGeometry(0.25, 0.25, 8);
      calyxGeo.rotateX(Math.PI);
      const calyx = new THREE.Mesh(calyxGeo, stemMat);
      calyx.position.y = -0.05;
      blossomGroup.add(calyx);

      // Petal Materials
      const outerMat = new THREE.MeshStandardMaterial({
        color: petalColors.outer,
        roughness: 0.35,
        metalness: 0.05,
        side: THREE.DoubleSide
      });
      const midMat = new THREE.MeshStandardMaterial({
        color: petalColors.mid,
        roughness: 0.3,
        metalness: 0.06,
        side: THREE.DoubleSide
      });
      const innerMat = new THREE.MeshStandardMaterial({
        color: petalColors.inner,
        roughness: 0.25,
        metalness: 0.08,
        side: THREE.DoubleSide
      });

      const petals: FlowerMeshInfo['petals'] = [];
      const geo = type === 'main' ? queenPetalGeo : satellitePetalGeo;

      // Outer layer (8 petals)
      const countOuter = type === 'main' ? 8 : 6;
      for (let i = 0; i < countOuter; i++) {
        const angle = (i / countOuter) * Math.PI * 2;
        const mesh = new THREE.Mesh(geo, outerMat);
        mesh.scale.set(1.0, 1.0, 1.0);
        blossomGroup.add(mesh);
        petals.push({
          mesh,
          baseAngle: angle,
          targetPitch: 1.15,
          layer: 3
        });
      }

      // Mid layer (6 petals)
      const countMid = type === 'main' ? 6 : 5;
      for (let i = 0; i < countMid; i++) {
        const angle = (i / countMid) * Math.PI * 2 + 0.4;
        const mesh = new THREE.Mesh(geo, midMat);
        mesh.scale.set(0.85, 0.85, 0.85);
        blossomGroup.add(mesh);
        petals.push({
          mesh,
          baseAngle: angle,
          targetPitch: 0.82,
          layer: 2
        });
      }

      // Inner layer (5 petals)
      const countInner = type === 'main' ? 5 : 4;
      for (let i = 0; i < countInner; i++) {
        const angle = (i / countInner) * Math.PI * 2 + 0.8;
        const mesh = new THREE.Mesh(geo, innerMat);
        mesh.scale.set(0.65, 0.65, 0.65);
        blossomGroup.add(mesh);
        petals.push({
          mesh,
          baseAngle: angle,
          targetPitch: 0.5,
          layer: 1
        });
      }

      // Stamen (Core)
      const stamenGeo = new THREE.SphereGeometry(type === 'main' ? 0.32 : 0.22, 16, 16);
      const stamenMat = new THREE.MeshStandardMaterial({
        color: petalColors.stamen,
        emissive: 0xFFA000,
        emissiveIntensity: 0.5,
        roughness: 0.4
      });
      const stamen = new THREE.Mesh(stamenGeo, stamenMat);
      stamen.position.y = 0.22;
      blossomGroup.add(stamen);

      let glowLight: THREE.PointLight | undefined;
      if (type === 'main' || type === 'ovulation') {
        glowLight = new THREE.PointLight(0xFFE082, 0.9, 4);
        glowLight.position.y = 0.5;
        blossomGroup.add(glowLight);
      }

      return {
        group,
        petals,
        stamen,
        glowLight,
        type,
        label,
        bloomMultiplier
      };
    };

    // 1. MAIN QUEEN FLOWER (Center) - Represents the overall state
    flowers.push(
      buildFlower(
        0, 0, 1.1, 1.15,
        { outer: 0xFFA0B4, mid: 0xFF6B8B, inner: 0xFF4772, stamen: 0xFFD54F },
        'main',
        'Fleur Souveraine du Cycle'
      )
    );

    // 2. SATELLITE FLOWERS (Arranged in the garden surrounding the Queen)
    // - Menstruation (South-West)
    flowers.push(
      buildFlower(
        -1.4, 0.7, 0.75, 0.75,
        { outer: 0xEE929E, mid: 0xD96574, inner: 0xC1495A, stamen: 0xF6BDC0 },
        'menstrual',
        'Fleur de Rosée (Règles)',
        0.8
      )
    );

    // - Follicular (North-West)
    flowers.push(
      buildFlower(
        -1.3, -0.9, 0.85, 0.8,
        { outer: 0xFFB3C6, mid: 0xFF85A1, inner: 0xFF6B8B, stamen: 0xFFE082 },
        'follicular',
        'Fleur de l’Aube (Folliculaire)',
        1.0
      )
    );

    // - Fertile & Ovulation (North-East)
    flowers.push(
      buildFlower(
        1.3, -0.8, 1.0, 0.9,
        { outer: 0xFFA8E8, mid: 0xDF78EF, inner: 0xBA42E0, stamen: 0xFFE57F },
        'ovulation',
        'Fleur Solaire (Ovulation & Fertilité)',
        1.25
      )
    );

    // - Luteal (South-East)
    flowers.push(
      buildFlower(
        1.4, 0.8, 0.8, 0.78,
        { outer: 0xF8C0C8, mid: 0xEE9CA7, inner: 0xDE6B88, stamen: 0xFFD8BE },
        'luteal',
        'Fleur Cocon (Phase Lutéale)',
        0.9
      )
    );

    // 6. Floating Pollen & Rose Petals Particles (Ambient magic)
    const particleCount = 45;
    const particleGeo = new THREE.PlaneGeometry(0.18, 0.22);
    const particleMat = new THREE.MeshStandardMaterial({
      color: 0xFFC2D1,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.8,
      roughness: 0.3
    });

    const particles: Array<{
      mesh: THREE.Mesh;
      speedY: number;
      rotSpeedX: number;
      rotSpeedY: number;
      swayOffset: number;
    }> = [];

    for (let i = 0; i < particleCount; i++) {
      const p = new THREE.Mesh(particleGeo, particleMat);
      p.position.set(
        (Math.random() - 0.5) * 6.5,
        Math.random() * 5 - 0.5,
        (Math.random() - 0.5) * 6.5
      );
      scene.add(p);
      particles.push({
        mesh: p,
        speedY: 0.006 + Math.random() * 0.012,
        rotSpeedX: 0.01 + Math.random() * 0.02,
        rotSpeedY: 0.01 + Math.random() * 0.02,
        swayOffset: Math.random() * Math.PI * 2
      });
    }

    // 7. Golden Glow Pollen Sparkles (Points)
    const sparkleCount = 60;
    const sparkleGeo = new THREE.BufferGeometry();
    const sparklePos = new Float32Array(sparkleCount * 3);
    for (let i = 0; i < sparkleCount * 3; i += 3) {
      sparklePos[i] = (Math.random() - 0.5) * 5;
      sparklePos[i + 1] = Math.random() * 3.5 + 0.2;
      sparklePos[i + 2] = (Math.random() - 0.5) * 5;
    }
    sparkleGeo.setAttribute('position', new THREE.BufferAttribute(sparklePos, 3));
    const sparkleMat = new THREE.PointsMaterial({
      color: 0xFFE082,
      size: 0.08,
      transparent: true,
      opacity: 0.85
    });
    const sparklePoints = new THREE.Points(sparkleGeo, sparkleMat);
    scene.add(sparklePoints);

    // 8. Pointer Interaction & Orbit rotation
    let pointerX = 0;
    let pointerY = 0;
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let gardenRotY = -0.3;
    let gardenRotX = 0.15;

    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      isDragging = true;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      previousMousePosition = { x: clientX, y: clientY };
    };

    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      if (isDragging) {
        const deltaX = clientX - previousMousePosition.x;
        const deltaY = clientY - previousMousePosition.y;
        gardenRotY += deltaX * 0.008;
        gardenRotX = Math.max(-0.1, Math.min(0.4, gardenRotX + deltaY * 0.005));
        previousMousePosition = { x: clientX, y: clientY };
      }

      const rect = container.getBoundingClientRect();
      pointerX = ((clientX - rect.left) / rect.width) * 2 - 1;
      pointerY = -(((clientY - rect.top) / rect.height) * 2 - 1);
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    const domElement = renderer.domElement;
    domElement.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);

    domElement.addEventListener('touchstart', onPointerDown, { passive: true });
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('touchend', onPointerUp);

    // 9. Animation Loop
    let currentBloom = targetBloomRef.current;
    let clock = new THREE.Clock();
    let frameId = 0;

    const tick = () => {
      const delta = Math.min(0.05, clock.getDelta());
      const elapsed = clock.getElapsedTime();

      // Smooth lerp towards target bloom (smooth blooming animation)
      const target = Math.max(0.12, Math.min(1.25, targetBloomRef.current));
      currentBloom += (target - currentBloom) * (delta * 2.5);

      // Gentle auto-rotation when not dragging
      if (!isDragging) {
        gardenRotY += delta * 0.15;
      }
      gardenGroup.rotation.y = gardenRotY;
      gardenGroup.rotation.x = gardenRotX;

      // Update each flower's opening or closing based on cycle phase
      flowers.forEach((fl, idx) => {
        // Individual bloom level:
        // Queen flower follows overall cycle bloom directly.
        // Specific phase flowers bloom brightest when that phase is active!
        let bloomVal = currentBloom;
        if (fl.type !== 'main') {
          if (fl.type === currentPhaseInfo.phase) {
            bloomVal = Math.min(1.2, currentBloom * 1.3);
          } else {
            bloomVal = Math.max(0.18, currentBloom * 0.65);
          }
        }

        // Apply pitch to each petal
        fl.petals.forEach(p => {
          const pitch = p.targetPitch * bloomVal;
          p.mesh.rotation.set(0, 0, 0);
          p.mesh.rotation.y = p.baseAngle;
          p.mesh.rotation.x = pitch;

          // Gentle breathing motion
          const sway = Math.sin(elapsed * 1.8 + p.baseAngle + idx) * 0.025;
          p.mesh.rotation.x += sway;
        });

        // Pulsing core / Stamen emissive
        const pulse = (Math.sin(elapsed * 2.5 + idx) + 1) * 0.5;
        if (fl.glowLight) {
          fl.glowLight.intensity = 0.5 + pulse * 0.7 * bloomVal;
        }

        // Gentle flower stem sway
        fl.group.rotation.z = Math.sin(elapsed * 1.2 + idx * 1.5) * 0.04;
        fl.group.rotation.x = Math.cos(elapsed * 1.0 + idx) * 0.03;
      });

      // Animate floating petals
      particles.forEach(pt => {
        pt.mesh.position.y -= pt.speedY;
        pt.mesh.position.x += Math.sin(elapsed + pt.swayOffset) * 0.006;
        pt.mesh.rotation.x += pt.rotSpeedX;
        pt.mesh.rotation.y += pt.rotSpeedY;

        if (pt.mesh.position.y < -1.5) {
          pt.mesh.position.y = 4.5;
          pt.mesh.position.x = (Math.random() - 0.5) * 6.5;
        }
      });

      // Animate sparkles
      const posAttr = sparkleGeo.attributes.position as THREE.BufferAttribute;
      for (let i = 1; i < sparkleCount * 3; i += 3) {
        posAttr.array[i] += Math.sin(elapsed * 2 + i) * 0.003;
      }
      posAttr.needsUpdate = true;

      renderer.render(scene, camera);
      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);

    // Responsive resize
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 360;
      const h = container.clientHeight || 340;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(frameId);
      domElement.removeEventListener('mousedown', onPointerDown);
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('mouseup', onPointerUp);

      domElement.removeEventListener('touchstart', onPointerDown);
      window.removeEventListener('touchmove', onPointerMove);
      window.removeEventListener('touchend', onPointerUp);
      window.removeEventListener('resize', handleResize);

      // Dispose Geometries and Materials
      queenPetalGeo.dispose();
      satellitePetalGeo.dispose();
      islandGeo.dispose();
      grassRingGeo.dispose();
      dewGeo.dispose();
      particleGeo.dispose();
      sparkleGeo.dispose();

      islandMat.dispose();
      grassRingMat.dispose();
      dewMat.dispose();
      stemMat.dispose();
      particleMat.dispose();
      sparkleMat.dispose();
      renderer.dispose();

      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [currentPhaseInfo.phase]);

  // Jump to specific phase
  const handleJumpToPhase = (phase: CyclePhase) => {
    setIsSimulating(true);
    if (phase === 'menstrual') setSelectedDay(2);
    else if (phase === 'follicular') setSelectedDay(8);
    else if (phase === 'ovulation' || phase === 'fertile') setSelectedDay(Math.max(8, totalDays - 14));
    else if (phase === 'luteal') setSelectedDay(Math.min(totalDays - 4, totalDays));
  };

  const handleResetToToday = () => {
    setIsSimulating(false);
    setSelectedDay(stats.currentDayOfCycle || 1);
  };

  return (
    <div className={`relative flex flex-col items-center bg-linear-to-b from-rose-50/70 via-white to-pink-50/40 rounded-3xl p-4 sm:p-6 border border-rose-100/90 shadow-xs overflow-hidden ${className}`}>
      {/* Decorative ambient background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-80 bg-linear-to-tr from-rose-200/40 via-purple-100/30 to-pink-200/40 rounded-full blur-3xl pointer-events-none" />

      {/* Header bar of the Floral Garden Widget */}
      <div className="w-full flex items-center justify-between z-10 mb-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-rose-100/80 text-[#FF5B84] flex items-center justify-center shadow-2xs">
            <Flower2 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-black text-zinc-900 tracking-tight flex items-center gap-1.5">
              <span>Jardin Floral 3D</span>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-rose-100 text-[#FF5B84]">
                Hormone Sync
              </span>
            </h3>
            <span className="text-[11px] text-zinc-500 font-medium block">
              Floraison animée en harmonie avec ton cycle
            </span>
          </div>
        </div>

        {isSimulating && (
          <button
            type="button"
            onClick={handleResetToToday}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-100 hover:bg-rose-200 text-[#FF5B84] transition-all"
            title="Revenir au jour réel d'aujourd'hui"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Aujourd'hui</span>
          </button>
        )}
      </div>

      {/* 3D WebGL Canvas Container */}
      <div className="relative w-full h-[280px] sm:h-[320px] flex items-center justify-center my-1">
        <div
          ref={mountRef}
          className="w-full h-full cursor-grab active:cursor-grabbing"
          title="Faites glisser pour faire tourner le jardin floral 3D"
        />

        {/* Floating badge indicator for phase on top-left of canvas */}
        <div className="absolute top-2 left-2 z-10 flex flex-col gap-1 pointer-events-none">
          <div className="px-3 py-1.5 rounded-2xl bg-white/90 backdrop-blur-md border border-rose-200/80 shadow-2xs">
            <div className="flex items-center gap-1.5 text-xs font-black text-zinc-900">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF5B84] animate-pulse" />
              <span>Jour {currentDay}</span>
              <span className="text-zinc-400 font-normal">/{totalDays}</span>
            </div>
            <div className="text-[11px] font-bold text-[#FF5B84] mt-0.5">
              {currentPhaseInfo.phase === 'menstrual' && '🌸 Repos des pétales'}
              {currentPhaseInfo.phase === 'follicular' && '🌿 Éclosion matinale'}
              {(currentPhaseInfo.phase === 'fertile' || currentPhaseInfo.phase === 'ovulation') && '✨ Pleine floraison radieuse'}
              {currentPhaseInfo.phase === 'luteal' && '🌙 Corolle protectrice'}
            </div>
          </div>
        </div>

        {/* Floating gesture hint bottom-right */}
        <div className="absolute bottom-2 right-2 text-[10px] text-rose-400/90 bg-white/70 backdrop-blur-xs px-2.5 py-1 rounded-full pointer-events-none border border-rose-100 flex items-center gap-1">
          <span>Faites pivoter en 3D</span>
        </div>
      </div>

      {/* Phase Whisper Card (Explication poétique et bien-être de la floraison) */}
      <div className="w-full z-10 bg-white/90 backdrop-blur-md rounded-2xl p-3.5 border border-rose-100/80 shadow-2xs space-y-2 mt-1">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black text-rose-950">
            {currentPhaseInfo.label}
          </span>
          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
            {stats.isDelayed ? `Retard ${stats.daysDelayed}j` : `Règles dans ~${stats.daysUntilNextPeriod}j`}
          </span>
        </div>

        <p className="text-xs text-zinc-600 leading-relaxed">
          {currentPhaseInfo.desc}
        </p>

        <div className="flex items-start gap-2 pt-1 border-t border-rose-100/60 text-[11px] text-[#FF5B84] font-medium">
          <Sparkles className="w-3.5 h-3.5 shrink-0 mt-0.5 text-[#FF5B84]" />
          <span><strong>Soin éclat recommandé :</strong> {currentPhaseInfo.skinAdvice}</span>
        </div>
      </div>

      {/* Interactive Interactive Day Slider to explore garden blooming throughout the cycle */}
      <div className="w-full z-10 space-y-2 mt-4 pt-3 border-t border-rose-100/80">
        <div className="flex items-center justify-between text-xs font-bold text-zinc-700">
          <span className="flex items-center gap-1">
            <span>Explorer le cycle :</span>
            <span className="text-[#FF5B84]">Jour {currentDay}</span>
          </span>
          <span className="text-[11px] text-zinc-400 font-medium">
            Faites glisser pour observer l’éclosion
          </span>
        </div>

        <div className="relative flex items-center">
          <input
            type="range"
            min={1}
            max={totalDays}
            value={currentDay}
            onChange={e => {
              setIsSimulating(true);
              setSelectedDay(parseInt(e.target.value, 10));
            }}
            className="w-full h-2 bg-linear-to-r from-rose-200 via-pink-300 to-purple-200 rounded-lg appearance-none cursor-pointer accent-[#FF5B84]"
          />
        </div>

        {/* Phase jump chips */}
        <div className="flex items-center justify-between gap-1 pt-1 text-[11px]">
          <button
            type="button"
            onClick={() => handleJumpToPhase('menstrual')}
            className={`px-2 py-1 rounded-xl font-bold transition-all ${
              currentPhaseInfo.phase === 'menstrual'
                ? 'bg-rose-500 text-white shadow-2xs scale-105'
                : 'bg-rose-50 text-zinc-600 hover:bg-rose-100'
            }`}
          >
            Règles
          </button>
          <button
            type="button"
            onClick={() => handleJumpToPhase('follicular')}
            className={`px-2 py-1 rounded-xl font-bold transition-all ${
              currentPhaseInfo.phase === 'follicular'
                ? 'bg-[#FF5B84] text-white shadow-2xs scale-105'
                : 'bg-rose-50 text-zinc-600 hover:bg-rose-100'
            }`}
          >
            Folliculaire
          </button>
          <button
            type="button"
            onClick={() => handleJumpToPhase('ovulation')}
            className={`px-2 py-1 rounded-xl font-bold transition-all ${
              currentPhaseInfo.phase === 'ovulation' || currentPhaseInfo.phase === 'fertile'
                ? 'bg-purple-500 text-white shadow-2xs scale-105'
                : 'bg-rose-50 text-zinc-600 hover:bg-rose-100'
            }`}
          >
            Ovulation ✨
          </button>
          <button
            type="button"
            onClick={() => handleJumpToPhase('luteal')}
            className={`px-2 py-1 rounded-xl font-bold transition-all ${
              currentPhaseInfo.phase === 'luteal'
                ? 'bg-pink-500 text-white shadow-2xs scale-105'
                : 'bg-rose-50 text-zinc-600 hover:bg-rose-100'
            }`}
          >
            Lutéale
          </button>
        </div>
      </div>

      {/* Action buttons footer */}
      {showDetails && (
        <div className="w-full z-10 flex items-center justify-between gap-2 mt-4 pt-3 border-t border-rose-100">
          {onOpenLogModal && (
            <button
              type="button"
              onClick={onOpenLogModal}
              className="flex-1 py-2.5 px-3 rounded-2xl bg-white hover:bg-rose-50 text-[#FF5B84] border border-rose-200/90 text-xs font-bold shadow-2xs hover:shadow-xs transition-all flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Noter mes symptômes</span>
            </button>
          )}

          {onQuickLogPeriodStart && (
            <button
              type="button"
              onClick={onQuickLogPeriodStart}
              className="py-2.5 px-4 rounded-2xl bg-linear-to-r from-[#FF7A9C] to-[#FF4370] hover:opacity-95 text-white text-xs font-bold shadow-sm transition-transform active:scale-95 flex items-center gap-1.5"
            >
              <Droplet className="w-3.5 h-3.5" />
              <span>Mes règles</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};

// Backward-compatibility export so any existing CycleWheel import continues seamlessly
export const CycleWheel = FloralGarden3D;
export default FloralGarden3D;
