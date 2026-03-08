import { CANVAS_W, PIPE_W, FLOOR_Y, PIPE_GAP, PIPE_SPEED } from './physics';

export function generatePipe() {
  const minPipeHeight = 50;
  // Floor Y is 400. So max space for top pipe is Floor - Gap - MinPipe.
  // Example: 400 - 100 - 50 = 250 (maxTop). Random range: 50 -> 250.
  const maxTopPipeHeight = FLOOR_Y - PIPE_GAP - minPipeHeight;
  
  const topHeight = Math.floor(Math.random() * (maxTopPipeHeight - minPipeHeight + 1)) + minPipeHeight;
  
  return {
    x: CANVAS_W,
    topHeight: topHeight, // This is the Y coordinate where top pipe ends
    passed: false,
    width: PIPE_W
  };
}

export function updatePipes(pipes) {
  // Move pipes left
  pipes.forEach(pipe => {
    pipe.x -= PIPE_SPEED;
  });

  // Remove pipes that are off screen
  return pipes.filter(pipe => pipe.x + PIPE_W > -50);
}
