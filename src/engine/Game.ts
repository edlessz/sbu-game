import type Camera from "./components/Camera";
import type Scene from "./Scene";

class Game {
  private viewport: HTMLCanvasElement | null = null;
  private context: CanvasRenderingContext2D | null = null;

  public resizeViewport(): void {
    if (!this.viewport || !this.context) return;

    const width = this.viewport.clientWidth;
    const height = this.viewport.clientHeight;
    const dpr = window.devicePixelRatio || 1;

    if (
      this.viewport.width === width * dpr &&
      this.viewport.height === height * dpr
    )
      return;

    this.viewport.width = width * dpr;
    this.viewport.height = height * dpr;
  }
  public setViewport(viewport: HTMLCanvasElement | null) {
    this.viewport = viewport;
    this.context = this.viewport?.getContext("2d") || null;
  }
  public getViewport(): HTMLCanvasElement | null {
    return this.viewport;
  }
  public getContext(): CanvasRenderingContext2D | null {
    return this.context;
  }

  private scene: Scene | null = null;
  public setScene(scene: Scene | null) {
    if (this.scene) this.scene.game = null;
    this.scene = scene;
    if (this.scene) this.scene.game = this;
  }

  get activeCamera(): Camera | null {
    return this.scene?.activeCamera ?? null;
  }

  private lastTime: number = performance.now();
  public start(): void {
    this.lastTime = performance.now();
    requestAnimationFrame(this.loop.bind(this));
  }
  private loop(now: number): void {
    const deltaTime = (now - this.lastTime) / 1000;
    this.lastTime = now;

    this.resizeViewport();

    if (!this.context || !this.scene) {
      requestAnimationFrame(this.loop.bind(this));
      return;
    }

    this.scene.update(deltaTime);

    const ctx = this.context;
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    if (this.activeCamera) {
      ctx.save();
      this.activeCamera.getTransform()(ctx);
    }
    this.scene.render(ctx);
    if (this.activeCamera) ctx.restore();

    requestAnimationFrame(this.loop.bind(this));
  }
}

export default Game;
