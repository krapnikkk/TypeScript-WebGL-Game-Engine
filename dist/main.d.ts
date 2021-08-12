declare let engine: TSE.Engine;
declare module TSE {
    class Engine {
        private _canvas;
        constructor();
        start(): void;
        resize(): void;
        private loop;
    }
}
declare module TSE {
    let gl: WebGLRenderingContext;
    class GLUtilities {
        static initialize(elementId?: string): HTMLCanvasElement;
    }
}
