declare let engine: TSE.Engine;
declare module TSE {
    class Engine {
        private _canvas;
        private _shader;
        private _projection;
        private _sprite;
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
    class AttributeInfo {
        location: number;
        size: number;
        offset: number;
    }
    class GLBuffer {
        private _hasAttributeLocation;
        private _elementSize;
        private _stride;
        private _buffer;
        private _targetBufferType;
        private _dataType;
        private _mode;
        private _typeSize;
        private _data;
        private _attributes;
        constructor(elementSize: number, dataType?: GLenum, targetBufferType?: GLenum, mode?: GLenum);
        bind(normalized?: boolean): void;
        unbind(): void;
        addAttributeLocation(info: AttributeInfo): void;
        pushBackData(data: number[]): void;
        upload(): void;
        draw(): void;
        destroy(): void;
    }
}
declare module TSE {
    class Shader {
        private _name;
        private _program;
        private _attributes;
        private _uniforms;
        constructor(name: string, vertexSource: string, fragmentSource: string);
        get name(): string;
        private loadShader;
        private createProgram;
        use(): void;
        private detectAttributes;
        private detectUniforms;
        getAttributeLocation(name: string): number;
        getUniformLocation(name: string): WebGLUniformLocation;
    }
}
declare module TSE {
    class Sprite {
        private _name;
        private _width;
        private _height;
        position: Vector3;
        private _buffer;
        constructor(name: string, width?: number, height?: number);
        load(): void;
        update(time: number): void;
        draw(): void;
    }
}
declare module TSE {
    class Martix4 {
        private _data;
        private constructor();
        get data(): number[];
        static identity(): Martix4;
        static orthographic(left: number, right: number, bottom: number, top: number, nearClip: number, farCLip: number): Martix4;
        static tranlstion(position: Vector3): Martix4;
    }
}
declare module TSE {
    class Vector3 {
        private _x;
        private _y;
        private _z;
        constructor(x?: number, y?: number, z?: number);
        get x(): number;
        set x(value: number);
        get y(): number;
        set y(value: number);
        get z(): number;
        set z(value: number);
        toArray(): number[];
        toFloat32Array(): Float32Array;
    }
}
