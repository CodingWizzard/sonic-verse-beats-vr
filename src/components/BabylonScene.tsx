
import { useEffect, useRef } from 'react';
import { 
  Engine, Scene, Vector3, HemisphericLight, ArcRotateCamera, 
  MeshBuilder, StandardMaterial, Color3, Texture, Animation
} from '@babylonjs/core';
import { useMusicContext } from '../context/MusicContext';

const BabylonScene = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { currentSong, isPlaying } = useMusicContext();
  
  useEffect(() => {
    if (!canvasRef.current) return;
    
    // Initialize Babylon Scene
    const engine = new Engine(canvasRef.current, true);
    const scene = new Scene(engine);
    scene.clearColor = new Color3(0.01, 0.03, 0.1); // Dark blue background
    
    // Add a camera
    const camera = new ArcRotateCamera(
      "Camera", 
      -Math.PI / 2, 
      Math.PI / 2, 
      10, 
      Vector3.Zero(), 
      scene
    );
    camera.attachControl(canvasRef.current, true);
    camera.lowerRadiusLimit = 5;
    camera.upperRadiusLimit = 20;
    
    // Add lights
    const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);
    light.intensity = 0.7;
    
    // Create the bubbles background
    const createBubbles = () => {
      for (let i = 0; i < 50; i++) {
        const size = Math.random() * 1.5 + 0.5;
        const bubble = MeshBuilder.CreateSphere(`bubble${i}`, { diameter: size }, scene);
        
        // Position bubbles in a spherical pattern around the center
        const distance = Math.random() * 30 + 10;
        const alpha = Math.random() * Math.PI * 2;
        const beta = Math.random() * Math.PI * 2;
        
        bubble.position.x = distance * Math.cos(alpha) * Math.cos(beta);
        bubble.position.y = distance * Math.sin(beta);
        bubble.position.z = distance * Math.sin(alpha) * Math.cos(beta);
        
        // Create a semi-transparent blue material
        const material = new StandardMaterial(`bubbleMaterial${i}`, scene);
        material.alpha = 0.4;
        material.diffuseColor = new Color3(0, 0.5 + Math.random() * 0.5, 1);
        material.specularColor = new Color3(0.5, 0.5, 1);
        material.emissiveColor = new Color3(0, 0.2, 0.5);
        bubble.material = material;
        
        // Animate the bubble
        Animation.CreateAndStartAnimation(
          `bubbleAnimation${i}`,
          bubble,
          "position.y",
          30,
          120,
          bubble.position.y,
          bubble.position.y + (Math.random() * 2 - 1),
          Animation.ANIMATIONLOOPMODE_CYCLE
        );
      }
    };
    
    createBubbles();
    
    // Album cover plane
    let albumCoverPlane: any = null;
    
    // Update or create the album cover plane when a song is selected
    const updateAlbumCover = () => {
      if (currentSong) {
        if (albumCoverPlane) {
          scene.removeMesh(albumCoverPlane);
        }
        
        // Create a plane for the album cover
        albumCoverPlane = MeshBuilder.CreatePlane("albumCover", { width: 5, height: 5 }, scene);
        albumCoverPlane.position = new Vector3(0, 0, 0);
        
        // Create material with the album cover texture
        const albumMaterial = new StandardMaterial("albumMaterial", scene);
        albumMaterial.diffuseTexture = new Texture(currentSong.albumCover, scene);
        albumMaterial.emissiveColor = new Color3(0.5, 0.5, 0.5);
        albumCoverPlane.material = albumMaterial;
        
        // Animation for the album
        if (isPlaying) {
          Animation.CreateAndStartAnimation(
            "albumRotation",
            albumCoverPlane,
            "rotation.y",
            30,
            120,
            0,
            Math.PI * 2,
            Animation.ANIMATIONLOOPMODE_CYCLE
          );
        }
      }
    };
    
    updateAlbumCover();
    
    // Handle window resize
    window.addEventListener('resize', () => {
      engine.resize();
    });
    
    // Render loop
    engine.runRenderLoop(() => {
      scene.render();
    });
    
    // Cleanup
    return () => {
      engine.dispose();
    };
  }, [currentSong, isPlaying]);
  
  return (
    <canvas ref={canvasRef} className="vr-canvas-container" />
  );
};

export default BabylonScene;
