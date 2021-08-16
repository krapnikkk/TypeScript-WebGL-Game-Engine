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
    interface IAssetLoader {
        readonly supportedExtensions: string[];
        loadAsset(assetName: string): void;
    }
}
declare module TSE {
    interface IAsset {
        readonly name: string;
        readonly data: any;
    }
}
declare module TSE {
    const MESSAGE_ASSET_LOADED_ASSET_LOADED = "MESSAGE_ASSET_LOADED_ASSET_LOADED";
    class AssetManager {
        private static _loaders;
        private static _loaderAssets;
        private constructor();
        static initialize(): void;
        static registerLoader(loader: IAssetLoader): void;
        static loadAsset(assetName: string): void;
        static onAssetLoaded(asset: IAsset): void;
        static isAssetLoaded(assetName: string): boolean;
        static getAsset(assetName: string): IAsset;
    }
}
declare module TSE {
    class ImageAsset implements IAsset {
        readonly name: string;
        readonly data: HTMLImageElement;
        constructor(name: string, data: HTMLImageElement);
        get width(): number;
        get height(): number;
    }
    class ImageAssetLoader implements IAssetLoader {
        get supportedExtensions(): string[];
        loadAsset(assetName: string): void;
        private onImageLoaded;
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
        private _textureName;
        private _width;
        private _height;
        position: Vector3;
        private _buffer;
        private _texture;
        constructor(name: string, textureName: string, width?: number, height?: number);
        get name(): string;
        load(): void;
        update(time: number): void;
        draw(shader: Shader): void;
        destory(): void;
    }
}
declare module TSE {
    class Texture implements IMessageHandler {
        private _name;
        private _handle;
        private _isLoaded;
        private _width;
        private _height;
        constructor(name: string, width?: number, height?: number);
        onMessage(message: Message): void;
        get name(): string;
        get width(): number;
        get height(): number;
        get isLoaded(): boolean;
        bind(): void;
        unbind(): void;
        activateAndBind(textureUnit?: number): void;
        loadTextureFromAsset(asset: ImageAsset): void;
        private isPowerOf2;
        private isValuePowerOf2;
        destory(): void;
    }
}
declare module TSE {
    class TextureManager {
        private static _textures;
        private constructor();
        static getTexture(textureName: string): Texture;
        static releaseTexture(textureName: string): void;
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
    class Vector2 {
        private _x;
        private _y;
        constructor(x?: number, y?: number);
        get x(): number;
        set x(value: number);
        get y(): number;
        set y(value: number);
        toArray(): number[];
        toFloat32Array(): Float32Array;
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
declare module TSE {
    interface IMessageHandler {
        onMessage(message: Message): void;
    }
}
declare module TSE {
    enum MessagePriority {
        NORMAL = 0,
        HIGH = 1
    }
    class Message {
        code: string;
        context: any;
        sender: any;
        priority: MessagePriority;
        constructor(code: string, sender: any, context?: any, priority?: MessagePriority);
        static send(code: string, sender: any, context?: any): void;
        static sendPriorty(code: string, sender: any, context?: any): void;
        static subscribe(code: string, handler: IMessageHandler): void;
        static unsubscribe(code: string, handler: IMessageHandler): void;
    }
}
declare module TSE {
    class MessageBus {
        private static _subscriptions;
        private static _normalQueueMessagePerUpdate;
        private static _normalMessageQueue;
        private constructor();
        static addSubscription(code: string, handler: IMessageHandler): void;
        static removeSubscription(code: string, handler: IMessageHandler): void;
        static post(message: Message): void;
        static update(time: number): void;
    }
}
declare module TSE {
    class MessageSubscriptionNode {
        message: Message;
        handler: IMessageHandler;
        constructor(message: Message, handler: IMessageHandler);
    }
}
