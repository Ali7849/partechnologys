import { useThree } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import type { OrthographicCamera } from 'three';

import { EASE_FN } from '@/motion/easing';
import { gsap } from '@/motion/ticker';
import { useSceneStore } from '@/state/useSceneStore';
import { T } from '@/styles/tokens';

import { STATIONS } from './stations';

/**
 * The only way the camera moves. On a station change it tweens position, look-target, and
 * zoom for T.structural (640ms) on EASE.settle — interpolated, then LOCKED. No OrbitControls,
 * no drag, no idle auto-rotate, no mouse parallax. One station change per scroll section.
 */

export function CameraRig() {
  const camera = useThree((s) => s.camera) as OrthographicCamera;
  const invalidate = useThree((s) => s.invalidate);
  const station = useSceneStore((s) => s.station);
  const targetRef = useRef<[number, number, number]>([0, 0, 0]);

  // Tweens the camera to the named station whenever it changes; kills the tween on cleanup.
  useEffect(() => {
    const dest = STATIONS[station];
    const proxy = {
      px: camera.position.x,
      py: camera.position.y,
      pz: camera.position.z,
      tx: targetRef.current[0],
      ty: targetRef.current[1],
      tz: targetRef.current[2],
      zoom: camera.zoom,
    };

    const tween = gsap.to(proxy, {
      px: dest.position[0],
      py: dest.position[1],
      pz: dest.position[2],
      tx: dest.target[0],
      ty: dest.target[1],
      tz: dest.target[2],
      zoom: dest.zoom,
      duration: T.structural,
      ease: EASE_FN.settle,
      onUpdate: () => {
        camera.position.set(proxy.px, proxy.py, proxy.pz);
        camera.zoom = proxy.zoom;
        targetRef.current = [proxy.tx, proxy.ty, proxy.tz];
        camera.lookAt(proxy.tx, proxy.ty, proxy.tz);
        camera.updateProjectionMatrix();
        invalidate();
      },
    });

    return () => {
      tween.kill();
    };
  }, [station, camera, invalidate]);

  return null;
}
