
import { Scene, WebXRDefaultExperience } from '@babylonjs/core';

export const setupVRExperience = async (scene: Scene) => {
  try {
    // Initialize WebXR
    const xrHelper = await WebXRDefaultExperience.CreateAsync(scene);
    
    // Configure the experience
    const xrSessionManager = xrHelper.baseExperience.sessionManager;
    const featuresManager = xrHelper.baseExperience.featuresManager;
    
    // Make the experience immersive
    xrSessionManager.updateSessionOptionsOnXRFrame({
      optional: [
        'local-floor',
        'bounded-floor',
        'hand-tracking',
        'layers',
        'anchors'
      ]
    });
    
    return xrHelper;
  } catch (error) {
    console.log("WebXR not available or not supported:", error);
    return null;
  }
};
