import { BIRD_W, BIRD_H, FLOOR_Y, PIPE_GAP } from './physics';

export function checkCollision(bird, pipes) {
  // Hit Floor
  if (bird.y + BIRD_H >= FLOOR_Y) {
    return true;
  }
  
  for (let i = 0; i < pipes.length; i++) {
    const pipe = pipes[i];
    
    // Check horizontally
    if (bird.x + BIRD_W > pipe.x && bird.x < pipe.x + pipe.width) {
      // Top pipe collision
      if (bird.y < pipe.topHeight) {
        return true;
      }
      // Bottom pipe collision
      const bottomPipeY = pipe.topHeight + PIPE_GAP;
      if (bird.y + BIRD_H > bottomPipeY) {
        return true;
      }
    }
  }

  return false;
}
