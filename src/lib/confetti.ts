import confetti from 'canvas-confetti';

export function fireCelebrationConfetti() {
  const count = 200;
  const defaults = {
    origin: { y: 0.7 }
  };

  function fire(particleRatio: number, opts: confetti.Options) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio)
    });
  }

  fire(0.25, {
    spread: 26,
    startVelocity: 55,
    colors: ['#06b6d4', '#a855f7', '#10b981']
  });
  fire(0.2, {
    spread: 60,
    colors: ['#3b82f6', '#ec4899', '#f59e0b']
  });
  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    colors: ['#06b6d4', '#ffffff']
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 45,
  });
}

export const triggerConfetti = fireCelebrationConfetti;

