import { useEffect, useRef } from 'react';
import * as THREE from 'three';

type SceneConfig = {
    pcs: number;
    servers: number;
    cameras: number;
    phones: number;
    printers: number;
    switchCount: number;
    rackUnits: number;
};

export default function NetworkScene3D({ config }: { config: SceneConfig }) {
    const mountRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const mount = mountRef.current;
        if (!mount) return;

        const W = mount.clientWidth;
        const H = mount.clientHeight;

        // escena
        const scene    = new THREE.Scene();
        const camera   = new THREE.PerspectiveCamera(60, W / H, 0.1, 100);
        camera.position.set(0, 4, 10);
        camera.lookAt(0, 0, 0);

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(W, H);
        renderer.setPixelRatio(window.devicePixelRatio);
        mount.appendChild(renderer.domElement);

        // luces
        scene.add(new THREE.AmbientLight(0xffffff, 0.4));
        const dir = new THREE.DirectionalLight(0x00d9ff, 1.2);
        dir.position.set(5, 8, 5);
        scene.add(dir);
        const dir2 = new THREE.DirectionalLight(0xa855f7, 0.6);
        dir2.position.set(-5, 3, -5);
        scene.add(dir2);

        // helpers
        function box(w: number, h: number, d: number, color: number) {
            const mat = new THREE.MeshStandardMaterial({ color, metalness: 0.6, roughness: 0.3 });
            return new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
        }

        function addLabel() { /* labels via CSS overlay */ }

        // rack central
        const rackGroup = new THREE.Group();

        // cuerpo del rack
        const rackBody = box(1.2, 4, 0.8, 0x1e293b);
        rackGroup.add(rackBody);

        // bordes del rack
        const edges = new THREE.EdgesGeometry(new THREE.BoxGeometry(1.2, 4, 0.8));
        const edgeMat = new THREE.LineBasicMaterial({ color: 0x00d9ff, linewidth: 1 });
        rackGroup.add(new THREE.LineSegments(edges, edgeMat));

        // servidores dentro del rack
        const serverColors = [0x22c55e, 0x16a34a, 0x15803d, 0x166534];
        for (let i = 0; i < Math.min(config.servers, 4); i++) {
            const srv = box(1.0, 0.3, 0.6, serverColors[i] ?? 0x22c55e);
            srv.position.set(0, 1.5 - i * 0.5, 0.05);
            rackGroup.add(srv);

            // led del servidor
            const led = new THREE.Mesh(
                new THREE.SphereGeometry(0.04),
                new THREE.MeshStandardMaterial({ color: 0x00ff88, emissive: 0x00ff88, emissiveIntensity: 2 })
            );
            led.position.set(0.45, 1.5 - i * 0.5, 0.42);
            rackGroup.add(led);
        }

        // switch dentro del rack
        const sw = box(1.0, 0.15, 0.6, 0x0ea5e9);
        sw.position.set(0, -0.5, 0.05);
        rackGroup.add(sw);

        // ups
        const ups = box(1.0, 0.5, 0.6, 0x7c3aed);
        ups.position.set(0, -1.6, 0.05);
        rackGroup.add(ups);

        scene.add(rackGroup);

        // función para colocar dispositivos en círculo
        function placeDevices(
            count: number,
            color: number,
            radius: number,
            angleStart: number,
            angleEnd: number,
            y: number = 0,
        ) {
            const total = Math.min(count, 8);
            const group: THREE.Mesh[] = [];

            for (let i = 0; i < total; i++) {
                const angle = total === 1
                    ? (angleStart + angleEnd) / 2
                    : angleStart + (i / (total - 1)) * (angleEnd - angleStart);
                const rad = (angle * Math.PI) / 180;

                const mesh = box(0.4, 0.25, 0.3, color);
                mesh.position.set(
                    Math.cos(rad) * radius,
                    y,
                    Math.sin(rad) * radius,
                );
                scene.add(mesh);
                group.push(mesh);

                // línea al rack
                const points = [
                    new THREE.Vector3(0, y, 0),
                    mesh.position.clone(),
                ];
                const line = new THREE.Line(
                    new THREE.BufferGeometry().setFromPoints(points),
                    new THREE.LineBasicMaterial({ color, opacity: 0.3, transparent: true }),
                );
                scene.add(line);
            }
            return group;
        }

        const pcsGroup      = placeDevices(config.pcs,      0x94a3b8, 4.5, 200, 340,  0);
        const serversGroup  = placeDevices(config.servers,  0x22c55e, 3.5, 340, 380,  0.3);
        const camerasGroup  = placeDevices(config.cameras,  0xf59e0b, 4,    10,  80,  0);
        const phonesGroup   = placeDevices(config.phones,   0xa855f7, 4,    90, 160,  0);
        const printersGroup = placeDevices(config.printers, 0xef4444, 3.5, 165, 195,  0);

        // grilla del suelo
        const grid = new THREE.GridHelper(20, 20, 0x1e293b, 0x0f172a);
        grid.position.y = -2.1;
        scene.add(grid);

        // rotación con mouse
        let isDragging = false;
        let prevX = 0;
        let rotY = 0;

        const onDown = (e: MouseEvent) => { isDragging = true; prevX = e.clientX; };
        const onUp   = () => { isDragging = false; };
        const onMove = (e: MouseEvent) => {
            if (!isDragging) return;
            const dx = e.clientX - prevX;
            rotY += dx * 0.01;
            prevX = e.clientX;
        };

        mount.addEventListener('mousedown', onDown);
        window.addEventListener('mouseup', onUp);
        window.addEventListener('mousemove', onMove);

        // animación
        let frameId: number;
        const clock = new THREE.Clock();

        function animate() {
            frameId = requestAnimationFrame(animate);
            const t = clock.getElapsedTime();

            // rotación suave del grupo rack
            rackGroup.rotation.y = rotY;
            scene.rotation.y = rotY;

            // flotación suave de dispositivos
            [...pcsGroup, ...serversGroup, ...camerasGroup, ...phonesGroup, ...printersGroup]
                .forEach((m, i) => {
                    m.position.y = Math.sin(t * 0.8 + i * 0.5) * 0.1;
                });

            renderer.render(scene, camera);
        }

        animate();

        // resize
        const onResize = () => {
            if (!mount) return;
            const w = mount.clientWidth;
            const h = mount.clientHeight;
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h);
        };
        window.addEventListener('resize', onResize);

        // cleanup
        return () => {
            frameId && cancelAnimationFrame(frameId);
            mount.removeEventListener('mousedown', onDown);
            window.removeEventListener('mouseup', onUp);
            window.removeEventListener('mousemove', onMove);
            window.removeEventListener('resize', onResize);
            mount.removeChild(renderer.domElement);
            renderer.dispose();
        };

    }, [config.pcs, config.servers, config.cameras, config.phones, config.printers]);

    return (
        <div
            ref={mountRef}
            style={{ width: '100%', height: '100%', cursor: 'grab' }}
        />
    );
}