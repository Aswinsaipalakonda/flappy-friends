import React, { useRef, useEffect, useState, useCallback } from 'react';
import { updateBirdPhysics, jumpBird, CANVAS_W, CANVAS_H, BIRD_W, BIRD_H, FLOOR_Y, PIPE_W, PIPE_H, PIPE_GAP, PIPE_SPEED, JUMP_FORCE } from '../game/physics';
import { generatePipe, updatePipes } from '../game/pipes';
import { checkCollision } from '../game/collision';

const STATE_READY = 0;
const STATE_PLAYING = 1;
const STATE_GAMEOVER = 2;

function GameCanvas({ character, onReturnToMenu }) {
  const canvasRef = useRef(null);
  
  const gameStateRef = useRef(STATE_READY);
  
  const birdRef = useRef({ x: 50, y: 200, velocity: 0, rotation: 0 });
  const pipesRef = useRef([]);
  const scoreRef = useRef(0);
  const framesRef = useRef(0);
  const flashRef = useRef(0); 
  const bgXRef = useRef(0);
  
  const frameIdRef = useRef();
  const [imagesLoaded, setImagesLoaded] = useState(false);
  
  // Audio assets
  const sfxWing = useRef(typeof Audio !== 'undefined' ? new Audio('/assets/sfx_wing.wav') : null);
  const sfxPoint = useRef(typeof Audio !== 'undefined' ? new Audio('/assets/sfx_point.wav') : null);
  const sfxHit = useRef(typeof Audio !== 'undefined' ? new Audio('/assets/sfx_hit.wav') : null);
  const sfxSwoosh = useRef(typeof Audio !== 'undefined' ? new Audio('/assets/sfx_swooshing.wav') : null);
  
  // Storage for loaded images
  const imgs = useRef({});

  useEffect(() => {
    const assetFiles = [
      { name: 'bird', src: character.image },
      { name: 'bg', src: '/assets/background-day.png' },
      { name: 'base', src: '/assets/base.png' },
      { name: 'pipe', src: '/assets/pipe-green.png' },
      { name: 'msg', src: '/assets/message.png' },
      { name: 'gameover', src: '/assets/gameover.png' },
      { name: 'scoreboard', src: '/assets/scoreboard.png' },
      { name: 'playbtn', src: '/assets/button_play.png' },
      ...[...Array(10)].map((_, i) => ({ name: `n${i}`, src: `/assets/${i}.png` }))
    ];

    let loadedCount = 0;
    
    assetFiles.forEach(asset => {
      const img = new Image();
      img.src = asset.src;
      img.onload = () => {
        imgs.current[asset.name] = img;
        loadedCount++;
        if (loadedCount === assetFiles.length) setImagesLoaded(true);
      };
      // For character image, it might fail if they gave a bad image
      img.onerror = () => {
        imgs.current[asset.name] = img; // store broken image or we can set fallback
        loadedCount++;
        if (loadedCount === assetFiles.length) setImagesLoaded(true);
      };
    });
  }, [character]);

  const initGame = useCallback(() => {
    birdRef.current = { x: 60, y: 220, velocity: 0, rotation: 0 };
    pipesRef.current = [];
    scoreRef.current = 0;
    framesRef.current = 0;
    flashRef.current = 0;
    gameStateRef.current = STATE_READY;
    if (sfxSwoosh.current) {
      sfxSwoosh.current.currentTime = 0;
      sfxSwoosh.current.play().catch(()=>{});
    }
  }, []);

  const playJumpSound = () => {
    if (sfxWing.current) {
      sfxWing.current.currentTime = 0;
      sfxWing.current.play().catch(()=>{});
    }
  };

  const handleInput = useCallback((e) => {
    if (e.type !== 'mousedown' && e.type !== 'touchstart' && e.code !== 'Space') return;
    if (e.cancelable) e.preventDefault();
    
    if (!imagesLoaded) return;

    switch (gameStateRef.current) {
      case STATE_READY:
        gameStateRef.current = STATE_PLAYING;
        jumpBird(birdRef.current);
        playJumpSound();
        break;
      case STATE_PLAYING:
        jumpBird(birdRef.current);
        playJumpSound();
        break;
      case STATE_GAMEOVER:
        // Accept any click after short delay
        if (framesRef.current > 30) {
           let isChange = false;
           if (e.type === 'mousedown' || e.type === 'touchstart') {
             const rect = canvasRef.current.getBoundingClientRect();
             const clientX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
             const clientY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;
             
             // Convert client coordinates to canvas game space
             const scaleY = CANVAS_H / rect.height;
             const y = (clientY - rect.top) * scaleY;
             
             // If clicked roughly where the CHANGE button is (y > 340)
             if (y > 340 && y < 400) {
                isChange = true;
             }
           }
           
           if (isChange) {
              if (sfxSwoosh.current) {
                 sfxSwoosh.current.currentTime = 0;
                 sfxSwoosh.current.play().catch(()=>{});
              }
              onReturnToMenu();
           } else {
              initGame();
           }
        }
        break;
    }
  }, [imagesLoaded, initGame, onReturnToMenu]);

  useEffect(() => {
    // Add global listeners
    window.addEventListener('keydown', handleInput, { passive: false });
    window.addEventListener('mousedown', handleInput, { passive: false });
    window.addEventListener('touchstart', handleInput, { passive: false });

    return () => {
      window.removeEventListener('keydown', handleInput);
      window.removeEventListener('mousedown', handleInput);
      window.removeEventListener('touchstart', handleInput);
      cancelAnimationFrame(frameIdRef.current);
    };
  }, [handleInput]);

  const drawScore = (ctx, score, x, y) => {
    const scoreStr = score.toString();
    // width of numbers is 24, padding 2
    const totalW = scoreStr.length * 26;
    let currX = x - totalW / 2;
    for (let i = 0; i < scoreStr.length; i++) {
      const img = imgs.current[`n${scoreStr[i]}`];
      if (img && img.complete && img.naturalWidth) {
        ctx.drawImage(img, currX, y, 24, 36);
      }
      currX += 26; // spacing
    }
  };

  const gameLoop = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Logic updates
    const st = gameStateRef.current;
    framesRef.current++;

    if (st === STATE_PLAYING) {
      // Background and floor movement
      bgXRef.current = (bgXRef.current - PIPE_SPEED) % 336; // 336 is base image width
      
      updateBirdPhysics(birdRef.current);
      
      // Calculate rotation
      if (birdRef.current.velocity >= JUMP_FORCE) {
        birdRef.current.rotation = Math.min(Math.PI / 4, birdRef.current.rotation + 0.1);
        if (birdRef.current.velocity < 0) {
            birdRef.current.rotation = -0.3; // Tilt up heavily while actively jumping
        }
      }

      // Spawn pipes every 130 frames (approx 2.1s at 60fps) to map perfectly to slower speed
      if (framesRef.current % 130 === 0) {
        pipesRef.current.push(generatePipe());
      }

      pipesRef.current = updatePipes(pipesRef.current);

      // Scoring
      pipesRef.current.forEach(pipe => {
        if (!pipe.passed && birdRef.current.x > pipe.x + PIPE_W) {
          pipe.passed = true;
          scoreRef.current += 1;
          if (sfxPoint.current) {
            sfxPoint.current.currentTime = 0;
            sfxPoint.current.play().catch(()=>{});
          }
        }
      });

      // Collision Check
      if (checkCollision(birdRef.current, pipesRef.current)) {
        gameStateRef.current = STATE_GAMEOVER;
        framesRef.current = 0; // reset frame counter for game over delays
        flashRef.current = 10; // flash white for 10 frames
        if (sfxHit.current) {
          sfxHit.current.currentTime = 0;
          sfxHit.current.play().catch(()=>{});
        }
      }
    } else if (st === STATE_READY) {
      // Bobbing
      bgXRef.current = (bgXRef.current - PIPE_SPEED) % 336;
      birdRef.current.y = 220 + Math.cos(framesRef.current * 0.1) * 5;
      birdRef.current.rotation = 0;
    } else if (st === STATE_GAMEOVER) {
      // Fall to ground
      if (birdRef.current.y + BIRD_H < FLOOR_Y) {
         updateBirdPhysics(birdRef.current);
         birdRef.current.rotation = Math.min(Math.PI / 2, birdRef.current.rotation + 0.2);
         if (birdRef.current.y + BIRD_H >= FLOOR_Y) {
            birdRef.current.y = FLOOR_Y - BIRD_H;
         }
      }
      if (flashRef.current > 0) flashRef.current--;
    }

    // --- Rendering ---
    
    ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

    const iBg = imgs.current['bg'];
    const iBase = imgs.current['base'];
    const iPipe = imgs.current['pipe'];
    const iBird = imgs.current['bird'];

    // 1. Draw BG (stretch height, center width or repeat)
    if (iBg && iBg.complete) {
      ctx.drawImage(iBg, 0, 0, CANVAS_W, CANVAS_H);
    } else {
      ctx.fillStyle = '#4ec0ca';
      ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
    }

    // 2. Draw Pipes
    if (iPipe && iPipe.complete && iPipe.naturalWidth) {
      pipesRef.current.forEach(pipe => {
        // Bottom pipe (normal)
        const bottomY = pipe.topHeight + PIPE_GAP;
        ctx.drawImage(iPipe, pipe.x, bottomY, PIPE_W, PIPE_H);
        
        // Top pipe (flipped)
        ctx.save();
        ctx.translate(pipe.x + PIPE_W / 2, pipe.topHeight);
        ctx.scale(1, -1); // flip Y
        ctx.drawImage(iPipe, -PIPE_W / 2, 0, PIPE_W, PIPE_H);
        ctx.restore();
      });
    } else {
      // Fallbacks
      ctx.fillStyle = 'green';
      pipesRef.current.forEach(pipe => {
        ctx.fillRect(pipe.x, 0, PIPE_W, pipe.topHeight);
        ctx.fillRect(pipe.x, pipe.topHeight + PIPE_GAP, PIPE_W, CANVAS_H);
      });
    }

    // 3. Draw Floor
    if (iBase && iBase.complete) {
      // Draw twice for seamless loop
      ctx.drawImage(iBase, bgXRef.current, FLOOR_Y, 336, 112);
      ctx.drawImage(iBase, bgXRef.current + 336, FLOOR_Y, 336, 112);
    } else {
      ctx.fillStyle = '#ded895';
      ctx.fillRect(0, FLOOR_Y, CANVAS_W, 112);
    }

    // 4. Draw Bird
    if (iBird && iBird.complete && iBird.naturalWidth) {
      ctx.save();
      ctx.translate(birdRef.current.x + BIRD_W / 2, birdRef.current.y + BIRD_H / 2);
      ctx.rotate(birdRef.current.rotation);
      ctx.drawImage(iBird, -BIRD_W / 2, -BIRD_H / 2, BIRD_W, BIRD_H);
      ctx.restore();
    } else {
      ctx.fillStyle = 'yellow';
      ctx.fillRect(birdRef.current.x, birdRef.current.y, BIRD_W, BIRD_H);
    }

    // 5. Overlays (Ready, Game Over, Score)
    if (st === STATE_READY) {
      const iMsg = imgs.current['msg'];
      if (iMsg && iMsg.complete) {
        ctx.drawImage(iMsg, CANVAS_W / 2 - 92, Math.min(CANVAS_H / 2 - 130, 100), 184, 267);
      }
    }

    if (st === STATE_PLAYING) {
      drawScore(ctx, scoreRef.current, CANVAS_W / 2, 50);
    }

    if (st === STATE_GAMEOVER) {
      // Flash
      if (flashRef.current > 0) {
         ctx.fillStyle = `rgba(255, 255, 255, ${flashRef.current / 10})`;
         ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
      }

      // Draw game over screen after a bit
      if (framesRef.current > 15) {
        const iGO = imgs.current['gameover'];
        const iBoard = imgs.current['scoreboard'];
        const iPlay = imgs.current['playbtn'];

        if (iGO && iGO.complete) ctx.drawImage(iGO, CANVAS_W / 2 - 96, 100, 192, 42);
        
        // Draw board
        const boardY = 160;
        ctx.fillStyle = '#ded895'; // Classic board color
        ctx.strokeStyle = '#543847';
        ctx.lineWidth = 4;
        ctx.beginPath();
        if (ctx.roundRect) {
            ctx.roundRect(CANVAS_W/2 - 100, boardY, 200, 110, 10);
        } else {
            ctx.rect(CANVAS_W/2 - 100, boardY, 200, 110);
        }
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#543847';
        ctx.font = 'bold 20px monospace';
        ctx.textAlign = 'right';
        ctx.fillText('SCORE', CANVAS_W/2 + 80, boardY + 30);
        ctx.fillText('BEST', CANVAS_W/2 + 80, boardY + 75);

        // Final score
        ctx.textAlign = 'right';
        ctx.font = 'bold 24px monospace';
        ctx.fillStyle = '#fff';
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.strokeText(scoreRef.current, CANVAS_W/2 + 80, boardY + 55);
        ctx.fillText(scoreRef.current, CANVAS_W/2 + 80, boardY + 55);
        
        const hs = localStorage.getItem('fb_hs_' + character.id) || 0;
        const best = Math.max(hs, scoreRef.current);
        localStorage.setItem('fb_hs_' + character.id, best);
        
        ctx.strokeText(best, CANVAS_W/2 + 80, boardY + 100);
        ctx.fillText(best, CANVAS_W/2 + 80, boardY + 100);

        // Draw play text instead of sprite
        const btnY = boardY + 125;
        
        ctx.fillStyle = '#e86101';
        ctx.strokeStyle = '#fff';
        ctx.beginPath();
        if(ctx.roundRect) ctx.roundRect(CANVAS_W/2 - 50, btnY, 100, 36, 5);
        else ctx.rect(CANVAS_W/2 - 50, btnY, 100, 36);
        ctx.fill();
        ctx.stroke();
        
        ctx.fillStyle = '#fff';
        ctx.textAlign = 'center';
        ctx.font = 'bold 18px monospace';
        ctx.fillText('PLAY', CANVAS_W/2, btnY + 24);
        
        // Draw Change Character button below Play
        const changeY = btnY + 44;
        ctx.fillStyle = '#4ec0ca';
        ctx.strokeStyle = '#fff';
        ctx.beginPath();
        if(ctx.roundRect) ctx.roundRect(CANVAS_W/2 - 75, changeY, 150, 36, 5);
        else ctx.rect(CANVAS_W/2 - 75, changeY, 150, 36);
        ctx.fill();
        ctx.stroke();
        
        ctx.fillStyle = '#fff';
        ctx.fillText('CHANGE FRIEND', CANVAS_W/2, changeY + 24);
      }
    }

    frameIdRef.current = requestAnimationFrame(gameLoop);
  }, []);

  const startGameLoop = useCallback(() => {
    cancelAnimationFrame(frameIdRef.current);
    frameIdRef.current = requestAnimationFrame(gameLoop);
  }, [gameLoop]);

  // Handle initialization once images load
  useEffect(() => {
    if (imagesLoaded) {
      initGame();
      startGameLoop();
    }
  }, [imagesLoaded, initGame, startGameLoop]);

  return (
    <div className="game-container">
      <canvas ref={canvasRef} width={CANVAS_W} height={CANVAS_H} />
      
      {!imagesLoaded && (
        <div style={{ position: 'absolute', color: 'white', fontSize: '1.2rem', fontFamily: 'monospace' }}>
          Loading...
        </div>
      )}
      
      {/* Return button */}
      <button 
        className="btn-back"
        onClick={() => {
          if (sfxSwoosh.current) {
             sfxSwoosh.current.currentTime = 0;
             sfxSwoosh.current.play().catch(()=>{});
          }
          onReturnToMenu();
        }}
      >
        <span className="back-icon">←</span> BACK
      </button>
    </div>
  );
}

export default GameCanvas;
