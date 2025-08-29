import type Camera from "./components/Camera";
import Mouse from "./Input/Mouse";
import type Scene from "./Scene";

class Game {
  private viewport: HTMLCanvasElement | null = null;
  private context: CanvasRenderingContext2D | null = null;
  private scene: Scene | null = null;
  private lastTime: number = performance.now();
  
  private resizeObserver = new ResizeObserver(this.handleResize.bind(this));

  public readonly Input = {
    Mouse: new Mouse(),
  } as const;

  private handleResize(entries: ResizeObserverEntry[]): void {
    for (const entry of entries) {
      const target = entry.target as HTMLCanvasElement;

      const width = target.clientWidth;
      const height = target.clientHeight;
      const dpr = window.devicePixelRatio || 1;

      target.width = width * dpr;
      target.height = height * dpr;

      this.render();
    }
  }

  // Viewport Management
  public setViewport(viewport: HTMLCanvasElement | null) {
    if (this.viewport === viewport) return;

    // Destroy
    this.Input.Mouse.destroy();
    if (this.viewport) this.resizeObserver.unobserve(this.viewport);

    this.viewport = viewport;

    // Setup
    this.context = this.viewport?.getContext("2d") || null;
    if (this.viewport) {
      this.Input.Mouse.initialize(this.viewport);
      this.resizeObserver.observe(this.viewport);
    }
  }

  public getViewport(): HTMLCanvasElement | null {
    return this.viewport;
  }

  public getContext(): CanvasRenderingContext2D | null {
    return this.context;
  }

  // Scene Management
  public setScene(scene: Scene | null): void {
    if (this.scene) this.scene.game = null;
    this.scene = scene;
    if (this.scene) this.scene.game = this;
  }

  public get activeCamera(): Camera | null {
    return this.scene?.activeCamera ?? null;
  }

  // Game Loop
  public start(): void {
    this.scene?.setup();

    this.lastTime = performance.now();
    requestAnimationFrame(this.loop.bind(this));
  }

  private loop(now: number): void {
    const deltaTime = (now - this.lastTime) / 1000;
    this.lastTime = now;

    if (!this.context || !this.scene) {
      requestAnimationFrame(this.loop.bind(this));
      return;
    }

    this.update(deltaTime);
    this.render();

    requestAnimationFrame(this.loop.bind(this));
  }

  private update(deltaTime: number): void {
    this.scene?.update(deltaTime);
  }

  private render(): void {
    const ctx = this.context;
    if (!ctx || !this.scene) return;

    ctx.resetTransform();
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    if (this.activeCamera) {
      ctx.save();
      this.activeCamera.getTransform()(ctx);
    }
    this.scene.render(ctx);
    if (this.activeCamera) ctx.restore();
  }
}

export default Game;
