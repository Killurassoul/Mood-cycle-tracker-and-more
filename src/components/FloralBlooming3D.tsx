import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface FloralBlooming3DProps {
  bloomProgress?: number; // 0 (bud) to 1 (full bloom)
  className?: string;
  interactive?: boolean;
}

export const FloralBlooming3D: React.FC<FloralBlooming3DProps> = ({
  bloomProgress = 1,
  className = '',
  interactive = true
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const targetBloomRef = useRef<number>(bloomProgress);
  targetBloomRef.current = bloomProgress;

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 320;
    const height = container.clientHeight || 320;

    // Detect software WebGL
    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    // Scene & Camera
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0xFFF0F5, 0.05);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 50);
    camera.position.set(0, 3.2, 5.8);
    camera.lookAt(0, 0.2, 0);

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
    renderer.setClearColor(0x000000, 0); // Transparent background to blend into light pink app

    container.appendChild(renderer.domElement);

    // Lighting (Warm pink, golden center, soft skylight)
    const ambientLight = new THREE.AmbientLight(0xFFE4E9, 1.4);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xFFFFFF, 2.0);
    keyLight.position.set(4, 8, 5);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xFF7597, 1.6);
    rimLight.position.set(-4, -2, -4);
    scene.add(rimLight);

    const coreLight = new THREE.PointLight(0xFFD166, 1.2, 8);
    coreLight.position.set(0, 0.6, 0);
    scene.add(coreLight);

    // Root flower group
    const flowerGroup = new THREE.Group();
    scene.add(flowerGroup);

    // --- PROCEDURAL PETAL SHAPE ---
    const petalShape = new THREE.Shape();
    petalShape.moveTo(0, 0);
    petalShape.bezierCurveTo(-0.4, 0.3, -0.65, 0.9, -0.5, 1.5);
    petalShape.bezierCurveTo(-0.35, 2.1, 0, 2.4, 0, 2.5);
    petalShape.bezierCurveTo(0, 2.4, 0.35, 2.1, 0.5, 1.5);
    petalShape.bezierCurveTo(0.65, 0.9, 0.4, 0.3, 0, 0);

    const petalGeometry = new THREE.ExtrudeGeometry(petalShape, {
      depth: 0.04,
      bevelEnabled: true,
      bevelSegments: 3,
      steps: 1,
      bevelSize: 0.03,
      bevelThickness: 0.03
    });
    petalGeometry.center();
    // Shift pivot to bottom of petal
    petalGeometry.translate(0, 1.1, 0);

    // Petal Materials (Soft pinks, gradient translucent look)
    const outerMaterial = new THREE.MeshStandardMaterial({
      color: 0xFFA6BA,
      roughness: 0.35,
      metalness: 0.05,
      side: THREE.DoubleSide
    });

    const midMaterial = new THREE.MeshStandardMaterial({
      color: 0xFF7A9C,
      roughness: 0.3,
      metalness: 0.08,
      side: THREE.DoubleSide
    });

    const innerMaterial = new THREE.MeshStandardMaterial({
      color: 0xFF547E,
      roughness: 0.25,
      metalness: 0.1,
      side: THREE.DoubleSide
    });

    interface PetalInstance {
      mesh: THREE.Mesh;
      baseAngle: number;
      targetPitch: number;
      layer: number;
      scale: number;
    }

    const petalInstances: PetalInstance[] = [];

    // Outer Layer (8 petals)
    const outerCount = 8;
    for (let i = 0; i < outerCount; i++) {
      const angle = (i / outerCount) * Math.PI * 2;
      const mesh = new THREE.Mesh(petalGeometry, outerMaterial);
      const scale = 1.0;
      mesh.scale.set(scale, scale, scale);
      flowerGroup.add(mesh);
      petalInstances.push({
        mesh,
        baseAngle: angle,
        targetPitch: 1.15, // Unfolds wide
        layer: 3,
        scale
      });
    }

    // Middle Layer (6 petals, offset)
    const midCount = 6;
    for (let i = 0; i < midCount; i++) {
      const angle = (i / midCount) * Math.PI * 2 + 0.35;
      const mesh = new THREE.Mesh(petalGeometry, midMaterial);
      const scale = 0.82;
      mesh.scale.set(scale, scale, scale);
      flowerGroup.add(mesh);
      petalInstances.push({
        mesh,
        baseAngle: angle,
        targetPitch: 0.85,
        layer: 2,
        scale
      });
    }

    // Inner Layer (5 petals, tighter bud)
    const innerCount = 5;
    for (let i = 0; i < innerCount; i++) {
      const angle = (i / innerCount) * Math.PI * 2 + 0.7;
      const mesh = new THREE.Mesh(petalGeometry, innerMaterial);
      const scale = 0.62;
      mesh.scale.set(scale, scale, scale);
      flowerGroup.add(mesh);
      petalInstances.push({
        mesh,
        baseAngle: angle,
        targetPitch: 0.52,
        layer: 1,
        scale
      });
    }

    // Central Flower Heart (Golden stamen/pistil sphere)
    const heartGeo = new THREE.SphereGeometry(0.35, 16, 16);
    const heartMat = new THREE.MeshStandardMaterial({
      color: 0xFFCC00,
      emissive: 0xFFA500,
      emissiveIntensity: 0.45,
      roughness: 0.4
    });
    const heartMesh = new THREE.Mesh(heartGeo, heartMat);
    heartMesh.position.y = 0.25;
    flowerGroup.add(heartMesh);

    // Floating Ambient Falling Petals (Particles)
    const floatingCount = 35;
    const floatingGeo = new THREE.PlaneGeometry(0.25, 0.35);
    const floatingMat = new THREE.MeshStandardMaterial({
      color: 0xFFB3C6,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.75,
      roughness: 0.4
    });

    const floatingPetals: Array<{
      mesh: THREE.Mesh;
      speedY: number;
      rotSpeedX: number;
      rotSpeedY: number;
      swayOffset: number;
    }> = [];

    for (let i = 0; i < floatingCount; i++) {
      const pMesh = new THREE.Mesh(floatingGeo, floatingMat);
      pMesh.position.set(
        (Math.random() - 0.5) * 7,
        Math.random() * 6 - 1,
        (Math.random() - 0.5) * 6
      );
      scene.add(pMesh);
      floatingPetals.push({
        mesh: pMesh,
        speedY: 0.008 + Math.random() * 0.012,
        rotSpeedX: 0.01 + Math.random() * 0.02,
        rotSpeedY: 0.01 + Math.random() * 0.02,
        swayOffset: Math.random() * Math.PI * 2
      });
    }

    // Mouse / Pointer interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetRotY = 0;
    let targetRotX = 0;

    const handlePointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouseX = x;
      mouseY = y;
    };

    if (interactive) {
      window.addEventListener('mousemove', handlePointerMove);
    }

    // Animation Loop
    let currentBloom = 0.2; // Start closed and bloom outward
    let clock = new THREE.Clock();
    let frameId = 0;

    const tick = () => {
      const delta = Math.min(0.05, clock.getDelta());
      const elapsed = clock.getElapsedTime();

      // Smooth bloom animation toward target
      const target = Math.max(0.1, Math.min(1.2, targetBloomRef.current));
      currentBloom += (target - currentBloom) * (delta * 2.8);

      // Rotate whole flower gently
      flowerGroup.rotation.y += delta * 0.4;

      // Pointer tilt
      targetRotY = mouseX * 0.45;
      targetRotX = -mouseY * 0.35;
      flowerGroup.rotation.x += (targetRotX - flowerGroup.rotation.x) * 0.08;
      flowerGroup.rotation.z += (targetRotY - flowerGroup.rotation.z) * 0.08;

      // Update each petal's blooming opening angle
      petalInstances.forEach(p => {
        const pitch = p.targetPitch * currentBloom;
        p.mesh.rotation.set(0, 0, 0); // reset
        p.mesh.rotation.y = p.baseAngle;
        p.mesh.rotation.x = pitch;

        // Subtle gentle breathing motion
        const breathe = Math.sin(elapsed * 2 + p.baseAngle) * 0.03;
        p.mesh.rotation.x += breathe;
      });

      // Animate floating falling petals
      floatingPetals.forEach(fp => {
        fp.mesh.position.y -= fp.speedY;
        fp.mesh.position.x += Math.sin(elapsed + fp.swayOffset) * 0.005;
        fp.mesh.rotation.x += fp.rotSpeedX;
        fp.mesh.rotation.y += fp.rotSpeedY;

        // Recycle if below view
        if (fp.mesh.position.y < -2) {
          fp.mesh.position.y = 5;
          fp.mesh.position.x = (Math.random() - 0.5) * 7;
        }
      });

      renderer.render(scene, camera);
      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);

    // Responsive resize
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 320;
      const h = container.clientHeight || 320;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(frameId);
      if (interactive) {
        window.removeEventListener('mousemove', handlePointerMove);
      }
      window.removeEventListener('resize', handleResize);

      // Dispose Three.js objects
      petalGeometry.dispose();
      heartGeo.dispose();
      floatingGeo.dispose();
      outerMaterial.dispose();
      midMaterial.dispose();
      innerMaterial.dispose();
      heartMat.dispose();
      floatingMat.dispose();
      renderer.dispose();

      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [interactive]);

  return (
    <div
      ref={mountRef}
      className={`relative w-full h-full min-h-[300px] flex items-center justify-center overflow-hidden pointer-events-auto ${className}`}
    />
  );
};
