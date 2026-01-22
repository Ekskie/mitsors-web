'use client';

import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

type Coin = {
  x: number;
  y: number;
  targetY: number;
  vy: number;
  active: boolean;
  landed: boolean;
  bounceCount: number;
};

type Pig = {
  x: number;
  y: number;
  width: number;
  height: number;
  legAngle: number;
  isEating: boolean;
};

type SmoothPigAnimationProps = {
  className?: string;
};

export function SmoothPigAnimation({ className }: SmoothPigAnimationProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const requestRef = useRef<number | null>(null);
  const PIG_SCALE = 0.84;
  const COIN_SCALE = 0.8;
  const COIN_SIZE = 14;

  const playCoinSound = () => {};

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return undefined;

    const GROUND_OFFSET = 60;
    const PIG_SPEED = 0.7;
    const COIN_SPAWN_RATE = 70;

    let frameCount = 0;

    const pig: Pig = {
      x: -100,
      y: 0,
      width: 80,
      height: 50,
      legAngle: 0,
      isEating: false,
    };

    let coins: Coin[] = [];
    let nextCoinX = 50;

    const drawCoin = (x: number, y: number, size = 10, scale = 1) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.scale(scale, scale);

      ctx.beginPath();
      ctx.arc(0, 0, size, 0, Math.PI * 2);
      ctx.fillStyle = '#FFD700';
      ctx.fill();
      ctx.strokeStyle = '#DAA520';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(-3, -3, 2, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.fill();

      ctx.fillStyle = '#DAA520';
      ctx.font = 'bold 12px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('₱', 0, 1);

      ctx.restore();
    };

    const drawPig = (x: number, y: number, legAngle: number, scale = 1) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.scale(scale, scale);

      const bodyWidth = 60;
      const bodyHeight = 40;

      ctx.fillStyle = '#DDDDDD';
      [-10, 10].forEach((offset, index) => {
        ctx.save();
        ctx.translate(offset, bodyHeight / 2 - 5);
        const angle = index === 0 ? Math.sin(legAngle) : Math.cos(legAngle);
        ctx.rotate(angle * 0.4);
        ctx.beginPath();
        ctx.roundRect(-4, 0, 8, 18, 4);
        ctx.fill();
        ctx.restore();
      });

      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.ellipse(0, 0, bodyWidth / 2, bodyHeight / 2, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.arc(bodyWidth / 2 - 5, -8, 22, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#FFD1DC';
      ctx.beginPath();
      ctx.ellipse(bodyWidth / 2 + 12, -5, 10, 7, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#8B4513';
      ctx.beginPath();
      ctx.arc(bodyWidth / 2 + 15, -6, 2, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.moveTo(bodyWidth / 2 - 5, -20);
      ctx.lineTo(bodyWidth / 2 + 5, -35);
      ctx.lineTo(bodyWidth / 2 + 15, -18);
      ctx.fill();

      ctx.fillStyle = '#000';
      ctx.beginPath();
      ctx.arc(bodyWidth / 2 + 2, -12, 2.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#FFFFFF';
      [-10, 10].forEach((offset, index) => {
        ctx.save();
        ctx.translate(offset, bodyHeight / 2 - 2);
        const angle = index === 0 ? -Math.sin(legAngle) : -Math.cos(legAngle);
        ctx.rotate(angle * 0.4);
        ctx.beginPath();
        ctx.roundRect(-4, 0, 8, 18, 4);
        ctx.fill();
        ctx.restore();
      });

      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(-bodyWidth / 2, -5);
      ctx.bezierCurveTo(-bodyWidth / 2 - 15, -15, -bodyWidth / 2 - 15, 5, -bodyWidth / 2 - 5, 0);
      ctx.stroke();

      ctx.restore();
    };

    const update = () => {
      const width = canvas.width;
      const height = canvas.height;
      const floorY = height - GROUND_OFFSET;

      if (width === 0) return;

      ctx.clearRect(0, 0, width, height);

      if (frameCount % COIN_SPAWN_RATE === 0) {
        const spawnX = Math.max(pig.x + 100 + Math.random() * 100, nextCoinX);
        nextCoinX = spawnX + 30;

        if (nextCoinX > width + 100) nextCoinX = width + 50;

        coins.push({
          x: spawnX,
          y: -30,
          targetY: floorY - 8,
          vy: 6,
          active: true,
          landed: false,
          bounceCount: 0,
        });
      }

      coins.forEach((coin) => {
        if (!coin.active) return;

        if (!coin.landed) {
          coin.y += coin.vy;
          if (coin.y >= coin.targetY) {
            coin.y = coin.targetY;
            if (coin.bounceCount < 2) {
              coin.vy = -coin.vy * 0.4;
              coin.bounceCount += 1;
            } else {
              coin.landed = true;
            }
          } else {
            coin.vy += 0.5;
          }
        }
      });

      if (pig.x > width + 60) {
        pig.x = -80;
        coins = [];
        nextCoinX = 50;

        coins.push({
          x: 80,
          y: floorY - 8,
          targetY: floorY - 8,
          vy: 0,
          active: true,
          landed: true,
          bounceCount: 2,
        });
      }

      const targetCoin = coins.find((coin) => coin.active && coin.x > pig.x - 10);
      let moving = false;

      if (targetCoin) {
        const dx = targetCoin.x - (pig.x + 30);

        if (dx > 5) {
          moving = true;
          pig.x += PIG_SPEED;
        } else if (dx < -5) {
          moving = true;
          pig.x += PIG_SPEED * 0.5;
        }

        const dist = Math.abs(dx);
        if (dist < 15 && targetCoin.landed) {
          targetCoin.active = false;
          playCoinSound();
        }
      } else {
        pig.x += PIG_SPEED;
        moving = true;
      }

      pig.legAngle += moving ? 0.15 : 0;

      const shadowScale = PIG_SCALE;
      ctx.fillStyle = 'rgba(0,0,0,0.1)';
      ctx.beginPath();
      ctx.ellipse(pig.x, floorY + 8 * shadowScale, 30 * shadowScale, 5 * shadowScale, 0, 0, Math.PI * 2);
      ctx.fill();

      coins = coins.filter((coin) => coin.active || coin.y < floorY + 100);

      coins.forEach((coin) => {
        if (coin.active) drawCoin(coin.x, coin.y, COIN_SIZE, COIN_SCALE);
      });

      drawPig(pig.x, floorY - 20, pig.legAngle, PIG_SCALE);

      frameCount += 1;
      requestRef.current = window.requestAnimationFrame(update);
    };

    const handleResize = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    requestRef.current = window.requestAnimationFrame(update);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (requestRef.current) {
        window.cancelAnimationFrame(requestRef.current);
      }
    };
  }, []);

  return <canvas ref={canvasRef} className={cn('block h-full w-full pointer-events-none', className)} />;
}

export default SmoothPigAnimation;