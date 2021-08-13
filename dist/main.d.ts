declare let engine: TSE.Engine;
declare module TSE {
    class Engine {
        private _canvas;
        private _shader;
        constructor();
        start(): void;
        resize(): void;
        private loop;
        private loadShaders;
    }
}
declare module TSE {
    let gl: WebGLRenderingContext;
    class GLUtilities {
        static initialize(elementId?: string): HTMLCanvasElement;
    }
}
declare module TSE {
    class Shader {
        private _name;
        private _program;
        constructor(name: string, vertexSource: string, fragmentSource: string);
        get name(): string;
        private loadShader;
        private createProgram;
        use(): void;
    }
}
