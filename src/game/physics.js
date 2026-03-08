export const CANVAS_W = 288;
export const CANVAS_H = 512;
export const BIRD_W = 34; // Bird width
export const BIRD_H = 34; // Make it square to fit the avatar faces perfectly
export const GRAVITY = 0.12; // Even slower falling
export const JUMP_FORCE = -3.4; // Softer jump
export const PIPE_SPEED = 1.2; // Even slower pipes
export const PIPE_W = 52;
export const PIPE_H = 320;
export const FLOOR_Y = 400; // Base is 112 tall, 512-112=400
export const PIPE_GAP = 140; // Wide gap for easy scoring

export function updateBirdPhysics(bird) {
  bird.velocity += GRAVITY;
  // Terminal velocity
  if (bird.velocity > 8) bird.velocity = 8;
  bird.y += bird.velocity;
}

export function jumpBird(bird) {
  bird.velocity = JUMP_FORCE;
}
