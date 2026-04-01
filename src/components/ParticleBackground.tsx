import { useEffect, useRef } from 'react';

interface ParticleConfig {
    color: string;
    size: number;
    stepRange: [number, number];
    speedRange: [number, number];
    parallaxStrength: number;
}

class Particle {
    x: number;
    y: number;
    startX: number;
    startY: number;
    targetX: number;
    targetY: number;
    t: number;
    duration: number;
    offsetX: number;
    offsetY: number;
    startOffsetX: number;
    startOffsetY: number;
    targetOffsetX: number;
    targetOffsetY: number;
    parallaxT: number;
    parallaxDuration: number;
    
    color: string;
    size: number;
    stepRange: [number, number];
    speedRange: [number, number];
    parallaxStrength: number;
    canvasObj: ParticleCanvasInstance;

    constructor(config: ParticleConfig, canvasObj: ParticleCanvasInstance) {
        this.color = config.color;
        this.size = config.size * canvasObj.rem;
        this.stepRange = config.stepRange;
        this.speedRange = config.speedRange;
        this.parallaxStrength = config.parallaxStrength;
        this.canvasObj = canvasObj;

        const { width, height } = canvasObj;
        this.x = Math.random() * width;
        this.y = Math.random() * height;

        this.startX = this.x;
        this.startY = this.y;
        this.targetX = this.x;
        this.targetY = this.y;
        this.t = 0;
        this.duration = 1;

        this.offsetX = 0;
        this.offsetY = 0;
        this.startOffsetX = 0;
        this.startOffsetY = 0;
        this.targetOffsetX = 0;
        this.targetOffsetY = 0;
        this.parallaxT = 1;
        this.parallaxDuration = 0.6;

        this.setNewTarget();
    }

    setNewTarget() {
        const [minStep, maxStep] = this.stepRange;
        const dx = (Math.random() - 0.5) * (maxStep - minStep) + (Math.random() > 0.5 ? minStep : -minStep);
        const dy = (Math.random() - 0.5) * (maxStep - minStep) + (Math.random() > 0.5 ? minStep : -minStep);

        const { width, height } = this.canvasObj;
        this.startX = this.x;
        this.startY = this.y;
        this.targetX = Math.max(0, Math.min(this.x + dx, width));
        this.targetY = Math.max(0, Math.min(this.y + dy, height));
        this.t = 0;

        const [minSpeed, maxSpeed] = this.speedRange;
        this.duration = Math.random() * (maxSpeed - minSpeed) + minSpeed;
    }

    update(dt: number) {
        this.t += dt / this.duration;
        const t = Math.min(this.t, 1);
        this.x = this.startX + (this.targetX - this.startX) * t;
        this.y = this.startY + (this.targetY - this.startY) * t;

        if (t >= 1) this.setNewTarget();

        const { width, height, mouse } = this.canvasObj;
        const centerX = width / 2;
        const centerY = height / 2;
        const newOffsetX = ((mouse.x - centerX) / centerX) * this.parallaxStrength;
        const newOffsetY = ((mouse.y - centerY) / centerY) * this.parallaxStrength;

        if (
            Math.abs(this.targetOffsetX - newOffsetX) > 0.5 ||
            Math.abs(this.targetOffsetY - newOffsetY) > 0.5
        ) {
            this.startOffsetX = this.offsetX;
            this.startOffsetY = this.offsetY;
            this.targetOffsetX = newOffsetX;
            this.targetOffsetY = newOffsetY;
            this.parallaxT = 0;
        }

        if (this.parallaxT < 1) {
            this.parallaxT += dt / this.parallaxDuration;
            const pt = Math.min(this.parallaxT, 1);
            const eased = Math.sin((pt * Math.PI) / 2);
            this.offsetX = this.startOffsetX + (this.targetOffsetX - this.startOffsetX) * eased;
            this.offsetY = this.startOffsetY + (this.targetOffsetY - this.startOffsetY) * eased;
        }
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.arc(this.x + this.offsetX, this.y + this.offsetY, this.size / 2, 0, 2 * Math.PI);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
}

class ParticleCanvasInstance {
    container: HTMLElement;
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    rem: number;
    width: number;
    height: number;
    mouse: { x: number; y: number };
    particles: Particle[];
    lastTime: number;
    running: boolean;
    customParticleCount: number | null;
    resizeHandler: () => void;
    mouseMoveHandler: (e: MouseEvent) => void;
    requestRef: number;

    constructor(container: HTMLElement, customParticleCount: number | null = null) {
        this.container = container;
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d')!;

        this.canvas.style.position = 'absolute';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '0';

        this.container.appendChild(this.canvas);

        this.rem = 16;
        if (typeof window !== 'undefined') {
            this.rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
        }

        this.width = this.container.clientWidth;
        this.height = this.container.clientHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;

        this.mouse = { x: this.width / 2, y: this.height / 2 };
        this.particles = [];
        this.lastTime = performance.now();
        this.running = true;
        this.customParticleCount = customParticleCount;

        this.resizeHandler = () => this.onResize();
        this.mouseMoveHandler = (e: MouseEvent) => this.onMouseMove(e);

        window.addEventListener("resize", this.resizeHandler);
        document.addEventListener("mousemove", this.mouseMoveHandler);

        this.initParticles();
        this.requestRef = requestAnimationFrame((t) => this.animate(t));
    }

    initParticles() {
        const layers: { numParticles: number }[] & Omit<ParticleConfig, 'numParticles'>[] = [
            {
                numParticles: 150,
                color: 'rgba(255, 255, 255, 0.15)',
                size: 0.15,
                speedRange: [10, 20],
                stepRange: [80, 140],
                parallaxStrength: 10
            },
            {
                numParticles: 50,
                color: 'rgba(255, 255, 255, 0.3)',
                size: 0.235,
                speedRange: [5, 10],
                stepRange: [100, 200],
                parallaxStrength: 30
            }
        ];

        if (this.customParticleCount) {
            const totalDefault = layers.reduce((sum, l) => sum + (l as { numParticles: number }).numParticles, 0);
            const scale = this.customParticleCount / totalDefault;

            layers.forEach(layer => {
                (layer as { numParticles: number }).numParticles = Math.round((layer as { numParticles: number }).numParticles * scale);
            });
        }

        layers.forEach(layer => {
            for (let i = 0; i < (layer as { numParticles: number }).numParticles; i++) {
                this.particles.push(new Particle(layer as unknown as ParticleConfig, this));
            }
        });
    }

    onResize() {
        if (!this.container) return;
        this.rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
        this.width = this.container.clientWidth;
        this.height = this.container.clientHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
    }

    onMouseMove(e: MouseEvent) {
        if (!this.container) return;
        const rect = this.container.getBoundingClientRect();
        this.mouse.x = e.clientX - rect.left;
        this.mouse.y = e.clientY - rect.top;
    }

    animate(currentTime: number) {
        if (!this.running) return;
        const delta = (currentTime - this.lastTime) / 1000;
        this.lastTime = currentTime;

        this.ctx.clearRect(0, 0, this.width, this.height);
        this.particles.forEach(p => {
            p.update(delta);
            p.draw(this.ctx);
        });

        this.requestRef = requestAnimationFrame((t) => this.animate(t));
    }

    destroy() {
        this.running = false;
        cancelAnimationFrame(this.requestRef);
        window.removeEventListener("resize", this.resizeHandler);
        document.removeEventListener("mousemove", this.mouseMoveHandler);
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
    }
}

const ParticleBackground = ({ count = 200 }: { count?: number }) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        const instance = new ParticleCanvasInstance(containerRef.current, count);

        return () => {
            instance.destroy();
        };
    }, [count]);

    return <div ref={containerRef} className="absolute inset-0 z-0 pointer-events-none overflow-hidden" />;
};

export default ParticleBackground;
