import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function DataNetwork3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || 600;

    // 1. Scene, Camera, Renderer Setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x030712, 0.002);

    const camera = new THREE.PerspectiveCamera(55, width / height, 1, 1000);
    camera.position.z = 240;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 2. Main Crystalline Core (Conceptualizing compiled high-performance structures)
    const coreGroup = new THREE.Group();
    scene.add(coreGroup);

    // A. Inner Tech Crystal Core (Icosahedron)
    const innerGeo = new THREE.IcosahedronGeometry(35, 1);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
    });
    const innerCrystal = new THREE.Mesh(innerGeo, innerMat);
    coreGroup.add(innerCrystal);

    // B. Outer Engineering cage (Dodecahedron or bigger Icosahedron)
    const outerGeo = new THREE.IcosahedronGeometry(75, 1);
    const outerMat = new THREE.MeshBasicMaterial({
      color: 0x6366f1,
      wireframe: true,
      transparent: true,
      opacity: 0.18,
      blending: THREE.AdditiveBlending,
    });
    const outerCage = new THREE.Mesh(outerGeo, outerMat);
    coreGroup.add(outerCage);

    // C. Vertex Points for both structures to create structural "Node" look
    const createPoints = (geometry: THREE.BufferGeometry, color: number, size: number) => {
      const texture = createGlowTexture(color);
      const material = new THREE.PointsMaterial({
        size: size,
        map: texture,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      return new THREE.Points(geometry, material);
    };

    const innerPoints = createPoints(innerGeo, 0x00f0ff, 6);
    const outerPoints = createPoints(outerGeo, 0x8b5cf6, 4.5);
    coreGroup.add(innerPoints);
    coreGroup.add(outerPoints);

    // D. Outer Orbiting Ring / Spiral Particles (Concept of High-Throughput Streams)
    const particleCount = 200;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    // Define mathematical orbiting parameters for high-speed flows
    const orbits: Array<{
      radius: number;
      speed: number;
      angle: number;
      yScale: number;
      phase: number;
      color: THREE.Color;
    }> = [];

    const colorCyan = new THREE.Color(0x00f0ff);
    const colorIndigo = new THREE.Color(0x6366f1);
    const colorNeon = new THREE.Color(0xd946ef);

    for (let i = 0; i < particleCount; i++) {
      const radius = 90 + Math.random() * 60;
      const speed = (0.2 + Math.random() * 0.4) * (Math.random() > 0.5 ? 1 : -1);
      const angle = Math.random() * Math.PI * 2;
      const yScale = (Math.random() - 0.5) * 0.7; // Tilted orbits
      const phase = Math.random() * Math.PI * 2;
      
      let randColor = colorCyan;
      const roll = Math.random();
      if (roll > 0.6) randColor = colorIndigo;
      else if (roll > 0.85) randColor = colorNeon;

      orbits.push({ radius, speed, angle, yScale, phase, color: randColor });

      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius * yScale;
      const z = Math.sin(angle) * radius;

      particlePositions[i * 3] = x;
      particlePositions[i * 3 + 1] = y;
      particlePositions[i * 3 + 2] = z;

      particleColors[i * 3] = randColor.r;
      particleColors[i * 3 + 1] = randColor.g;
      particleColors[i * 3 + 2] = randColor.b;
    }

    particleGeometry.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
    particleGeometry.setAttribute("color", new THREE.BufferAttribute(particleColors, 3));

    const particleMaterial = new THREE.PointsMaterial({
      size: 4.5,
      map: createGlowTexture(0xffffff),
      vertexColors: true,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // Helper canvas generator for sharp glowing physical particle nodes
    function createGlowTexture(colorHex: number): THREE.CanvasTexture {
      const canvas = document.createElement("canvas");
      canvas.width = 32;
      canvas.height = 32;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        const color = new THREE.Color(colorHex);
        const r = Math.floor(color.r * 255);
        const g = Math.floor(color.g * 255);
        const b = Math.floor(color.b * 255);

        const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
        gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
        gradient.addColorStop(0.2, `rgba(${r}, ${g}, ${b}, 0.95)`);
        gradient.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, 0.35)`);
        gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(16, 16, 16, 0, Math.PI * 2);
        ctx.fill();
      }
      return new THREE.CanvasTexture(canvas);
    }

    // E. Dynamic Connection Lines spanning core vertices matching the High-speed network
    const connectionGeometry = new THREE.BufferGeometry();
    const maxConnections = 120;
    const connectionPositions = new Float32Array(maxConnections * 2 * 3);
    const connectionColors = new Float32Array(maxConnections * 2 * 3);
    
    connectionGeometry.setAttribute("position", new THREE.BufferAttribute(connectionPositions, 3));
    connectionGeometry.setAttribute("color", new THREE.BufferAttribute(connectionColors, 3));

    const connectionMaterial = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.25,
      blending: THREE.AdditiveBlending,
    });

    const connectionLines = new THREE.LineSegments(connectionGeometry, connectionMaterial);
    scene.add(connectionLines);


    // 3. User Interaction Metrics & Mouse Tracking
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    let impactEnergy = 0;

    const handleMouseMove = (event: MouseEvent) => {
      // Scale mouse position to central coordinates
      const targetX = (event.clientX / window.innerWidth) * 2 - 1;
      const targetY = -(event.clientY / window.innerHeight) * 2 + 1;
      
      // Shift slightly right on desktops to align with empty hero column
      mouse.targetX = targetX;
      mouse.targetY = targetY;
    };

    const handleTouchMove = (event: TouchEvent) => {
      if (event.touches.length > 0) {
        mouse.targetX = (event.touches[0].clientX / window.innerWidth) * 2 - 1;
        mouse.targetY = -(event.touches[0].clientY / window.innerHeight) * 2 + 1;
      }
    };

    const handleButtonClick3D = () => {
      impactEnergy = 2.8; // Triggers immediate high speed physics boost!
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("btn-click-3d", handleButtonClick3D);


    // 4. Kinetic Animation Loop
    let animationId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationId = requestAnimationFrame(animate);

      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Smooth mouse easing with spring feel
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      // Exponential decay of 3D button click physical impact energy
      impactEnergy += (0 - impactEnergy) * 0.07;

      // Kinetic scaling and visual vibration pulse calculations
      const coreSpeedMultiplier = 1.0 + impactEnergy * 5.0;
      const coreScale = 1.0 + impactEnergy * 0.16;

      innerCrystal.scale.set(coreScale, coreScale, coreScale);
      outerCage.scale.set(coreScale, coreScale, coreScale);
      innerPoints.scale.set(coreScale, coreScale, coreScale);
      outerPoints.scale.set(coreScale, coreScale, coreScale);

      // Animate core systems
      innerCrystal.rotation.y = time * 0.12 + impactEnergy * 1.5;
      innerCrystal.rotation.x = time * 0.06 + impactEnergy * 0.8;
      innerPoints.rotation.y = time * 0.12 + impactEnergy * 1.5;
      innerPoints.rotation.x = time * 0.06 + impactEnergy * 0.8;

      outerCage.rotation.y = -time * 0.05 - impactEnergy * 1.0;
      outerCage.rotation.z = time * 0.08 + impactEnergy * 1.2;
      outerPoints.rotation.y = -time * 0.05 - impactEnergy * 1.0;
      outerPoints.rotation.z = time * 0.08 + impactEnergy * 1.2;

      // Dynamic mouse tracking rotation effect
      coreGroup.rotation.y = mouse.x * 0.45;
      coreGroup.rotation.x = -mouse.y * 0.45;

      // Orbiting particles logic
      const posAttr = particleGeometry.getAttribute("position") as THREE.BufferAttribute;
      const array = posAttr.array as Float32Array;

      for (let i = 0; i < particleCount; i++) {
        const orbit = orbits[i];
        
        // Advance angle dynamically (click expands orbits & surges speeds)
        orbit.angle += orbit.speed * delta * (coreSpeedMultiplier + Math.abs(mouse.x + mouse.y) * 1.5);
        
        // Micro-fluctuation (breathing orbit + elastic recoil of tap energy)
        const pulse = Math.sin(time + orbit.phase) * 3.5 + impactEnergy * 20.0 * Math.cos(time * 8 + orbit.phase);
        const radius = orbit.radius + pulse;

        // Space 3D coordinates
        array[i * 3] = Math.cos(orbit.angle) * radius;
        array[i * 3 + 1] = Math.sin(orbit.angle) * radius * orbit.yScale + Math.cos(time * 0.5 + orbit.phase) * 12;
        array[i * 3 + 2] = Math.sin(orbit.angle) * radius;
      }
      posAttr.needsUpdate = true;

      // Draw connection spark lines from inner core to random outer orbiting particles to simulate structured energy discharge
      let connectionCount = 0;
      const connPosAttr = connectionGeometry.getAttribute("position") as THREE.BufferAttribute;
      const connArray = connPosAttr.array as Float32Array;

      const connColAttr = connectionGeometry.getAttribute("color") as THREE.BufferAttribute;
      const connColorsArray = connColAttr.array as Float32Array;

      // Inner structure vertices array source
      const innerPositions = innerGeo.attributes.position.array as Float32Array;
      const innerVerticesCount = innerPositions.length / 3;

      for (let k = 0; k < maxConnections; k++) {
        // Pick a dynamic vertex inside the inner core, and connect to a close orbiting particles
        const vertexIndex = Math.floor(Math.sin(time * 0.1 + k) * 0.5 + 0.5 * innerVerticesCount);
        const idx = vertexIndex * 3;

        // Transform inner coordinate to matches group rotation
        const vxLocal = new THREE.Vector3(innerPositions[idx], innerPositions[idx+1], innerPositions[idx+2]);
        vxLocal.applyEuler(innerCrystal.rotation);
        vxLocal.applyEuler(coreGroup.rotation);

        // Map particle coord
        const pIndex = Math.floor((k * 1.7) % particleCount);
        const px = array[pIndex * 3];
        const py = array[pIndex * 3 + 1];
        const pz = array[pIndex * 3 + 2];

        const particlePos = new THREE.Vector3(px, py, pz);
        const distance = vxLocal.distanceTo(particlePos);

        // Connect only if they are relatively close, creating lightning/spark grid network
        if (distance < 140 && connectionCount < maxConnections) {
          const arrIdx = connectionCount * 2 * 3;

          connArray[arrIdx] = vxLocal.x;
          connArray[arrIdx + 1] = vxLocal.y;
          connArray[arrIdx + 2] = vxLocal.z;

          connArray[arrIdx + 3] = px;
          connArray[arrIdx + 4] = py;
          connArray[arrIdx + 5] = pz;

          // Assign glow gradient colors
          connColorsArray[arrIdx] = 0.0;     // cyan r
          connColorsArray[arrIdx+1] = 0.94;  // cyan g
          connColorsArray[arrIdx+2] = 1.0;   // cyan b

          connColorsArray[arrIdx+3] = orbits[pIndex].color.r;
          connColorsArray[arrIdx+4] = orbits[pIndex].color.g;
          connColorsArray[arrIdx+5] = orbits[pIndex].color.b;

          connectionCount++;
        }
      }

      connectionGeometry.setDrawRange(0, connectionCount * 2);
      connPosAttr.needsUpdate = true;
      connColAttr.needsUpdate = true;

      // Camera organic float with mouse offset
      camera.position.x += (mouse.x * 70 - camera.position.x) * 0.05;
      camera.position.y += (mouse.y * 70 - camera.position.y) * 0.05;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    animate();


    // 5. Responsive Resize Handlers
    const handleResize = () => {
      const newWidth = container.clientWidth || window.innerWidth;
      const newHeight = container.clientHeight || 600;

      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();

      renderer.setSize(newWidth, newHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });
    resizeObserver.observe(container);


    // 6. Cleanup
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("btn-click-3d", handleButtonClick3D);
      resizeObserver.disconnect();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      innerGeo.dispose();
      innerMat.dispose();
      outerGeo.dispose();
      outerMat.dispose();
      innerPoints.geometry.dispose();
      outerPoints.geometry.dispose();
      
      const ipMat = innerPoints.material as THREE.Material;
      const opMat = outerPoints.material as THREE.Material;
      if (ipMat) {
        if (ipMat instanceof Array) ipMat.forEach((m) => m.dispose());
        else ipMat.dispose();
      }
      if (opMat) {
        if (opMat instanceof Array) opMat.forEach((m) => m.dispose());
        else opMat.dispose();
      }

      particleGeometry.dispose();
      particleMaterial.dispose();
      connectionGeometry.dispose();
      connectionMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 w-full h-full pointer-events-none"
      id="threejs-data-network"
    />
  );
}
