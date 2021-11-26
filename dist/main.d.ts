declare let engine: TSE.Engine;
declare namespace TSE {
    class Engine implements IMessageHandler {
        private _canvas;
        private _basicShader;
        private _projection;
        private _previousTime;
        constructor();
        onMessage(message: Message): void;
        start(): void;
        resize(): void;
        private loop;
        private update;
        private render;
    }
}
declare namespace TSE {
    interface IAssetLoader {
        readonly supportedExtensions: string[];
        loadAsset(assetName: string): void;
    }
}
declare namespace TSE {
    interface IAsset {
        readonly name: string;
        readonly data: any;
    }
}
declare namespace TSE {
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
declare namespace TSE {
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
declare namespace TSE {
    class JsonAsset implements IAsset {
        readonly name: string;
        readonly data: any;
        constructor(name: any, data: string);
    }
    class JsonAssetLoader implements IAssetLoader {
        get supportedExtensions(): string[];
        loadAsset(assetName: string): void;
        private onJsonLoaded;
    }
}
declare namespace TSE {
    class SoundEffect {
        assetPath: string;
        private _player;
        constructor(assetPath: string, loop: boolean);
        get loop(): boolean;
        set loop(value: boolean);
        destroy(): void;
        play(): void;
        pause(): void;
        stop(): void;
    }
    class AudioManager {
        private static _soundEffects;
        static loadSoundFile(name: string, audioPath: string, loop: boolean): void;
        static playSound(name: string): void;
        static stopSound(name: string): void;
        static pauseSound(name: string): void;
        static pauseAll(): void;
        static stopAll(): void;
    }
}
declare namespace TSE {
    class BehaviorManager {
        private static _registeredBuilders;
        static registerBuilder(builder: IBehaviorBuilder): void;
        static extractBehavior(json: any): IBehavior;
    }
}
declare namespace TSE {
    interface IBehavior {
        name: string;
        setOwner(owner: SimObject): void;
        update(time: number): void;
        apply(userData: any): void;
    }
}
declare namespace TSE {
    interface IBehaviorBuilder {
        readonly type: string;
        buildFromJson(json: any): IBehavior;
    }
}
declare namespace TSE {
    interface IBehaviorData {
        name: string;
        setFromJson(json: any): void;
    }
}
declare namespace TSE {
    abstract class BaseBehavior implements IBehavior {
        name: string;
        protected _data: IBehaviorData;
        protected _owner: SimObject;
        constructor(data: IBehaviorData);
        setOwner(owner: SimObject): void;
        update(time: number): void;
        apply(userData: any): void;
    }
}
declare namespace TSE {
    class KeybroadMovementBehaviorData implements IBehaviorData {
        name: string;
        speed: number;
        setFromJson(json: any): void;
    }
    class KeybroadMovementBehaviorBuilder implements IBehaviorBuilder {
        get type(): string;
        buildFromJson(json: any): IBehavior;
    }
    class KeybroadMovementBehavior extends BaseBehavior {
        speed: number;
        constructor(data: KeybroadMovementBehaviorData);
        update(time: number): void;
    }
}
declare namespace TSE {
    class RotationBehaviorData implements IBehaviorData {
        name: string;
        rotation: Vector3;
        setFromJson(json: any): void;
    }
    class RotationBehaviorBuilder implements IBehaviorBuilder {
        get type(): string;
        buildFromJson(json: any): IBehavior;
    }
    class RotationBehavior extends BaseBehavior {
        private _rotation;
        constructor(data: RotationBehaviorData);
        update(time: number): void;
    }
}
declare namespace TSE {
    class ComponentManager {
        private static _registeredBuilders;
        static registerBuilder(builder: IComponentBuilder): void;
        static extractComponent(json: any): IComponent;
    }
}
declare namespace TSE {
    abstract class BaseComponent implements IComponent {
        protected _owner: SimObject;
        name: string;
        protected _data: IComponentData;
        constructor(data: IComponentData);
        get owner(): SimObject;
        setOwner(owner: SimObject): void;
        load(): void;
        update(time: number): void;
        render(shader: Shader): void;
    }
}
declare namespace TSE {
    class SpriteComponentData implements IComponentData {
        name: string;
        materialName: string;
        origin: Vector3;
        setFromJson(json: any): void;
    }
    class SpriteComponentBuilder implements IComponentBuilder {
        get type(): string;
        buildFromJson(json: any): IComponent;
    }
    class SpriteComponent extends BaseComponent {
        private _sprite;
        constructor(data: SpriteComponentData);
        load(): void;
        render(shader: Shader): void;
    }
}
declare namespace TSE {
    class AnimatedSpriteComponentData extends SpriteComponentData implements IComponentData {
        frameWidth: number;
        frameHeight: number;
        frameCount: number;
        frameSequence: number[];
        setFromJson(json: any): void;
    }
    class AnimatedSpriteComponentBuilder implements IComponentBuilder {
        get type(): string;
        buildFromJson(json: any): IComponent;
    }
    class AnimatedSpriteComponent extends BaseComponent {
        private _sprite;
        constructor(data: AnimatedSpriteComponentData);
        update(time: number): void;
        load(): void;
        render(shader: Shader): void;
    }
}
declare namespace TSE {
    interface IComponent {
        name: string;
        readonly owner: SimObject;
        setOwner(owner: SimObject): void;
        load(): void;
        update(time: number): void;
        render(shader: Shader): void;
    }
}
declare namespace TSE {
    interface IComponentBuilder {
        readonly type: string;
        buildFromJson(json: any): IComponent;
    }
}
declare namespace TSE {
    interface IComponentData {
        name: string;
        setFromJson(json: any): void;
    }
}
declare namespace TSE {
    let gl: WebGLRenderingContext;
    class GLUtilities {
        static initialize(elementId?: string): HTMLCanvasElement;
    }
}
declare namespace TSE {
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
        constructor(dataType?: GLenum, targetBufferType?: GLenum, mode?: GLenum);
        bind(normalized?: boolean): void;
        unbind(): void;
        addAttributeLocation(info: AttributeInfo): void;
        setData(data: number[]): void;
        pushBackData(data: number[]): void;
        clearData(): void;
        upload(): void;
        draw(): void;
        destroy(): void;
    }
}
declare namespace TSE {
    abstract class Shader {
        private _name;
        private _program;
        private _attributes;
        private _uniforms;
        constructor(name: string);
        get name(): string;
        protected load(vertexSource: string, fragmentSource: string): void;
        private loadShader;
        private createProgram;
        use(): void;
        private detectAttributes;
        private detectUniforms;
        getAttributeLocation(name: string): number;
        getUniformLocation(name: string): WebGLUniformLocation;
    }
}
declare namespace TSE {
    class BasicShader extends Shader {
        constructor();
        private getVertexSource;
        private getFragmentSource;
    }
}
declare namespace TSE {
    class Sprite {
        protected _name: string;
        protected _width: number;
        protected _height: number;
        protected _origin: Vector3;
        protected _buffer: GLBuffer;
        protected _materialName: string;
        protected _material: Material;
        protected _vertices: Vertex[];
        constructor(name: string, materialName: string, width?: number, height?: number);
        get name(): string;
        get origin(): Vector3;
        set origin(value: Vector3);
        load(): void;
        protected calculateVertices(): void;
        protected recalculateVertices(): void;
        update(time: number): void;
        draw(shader: Shader, model: Martix4): void;
        destory(): void;
    }
}
declare namespace TSE {
    class AnimatedSprite extends Sprite implements IMessageHandler {
        private _frameWidth;
        private _frameHeight;
        private _frameCount;
        private _frameSequence;
        private _currentFrame;
        private _frameUVS;
        private _frameTime;
        private _currentTime;
        private _assetLoaded;
        private _assetWidth;
        private _assetHeight;
        constructor(name: string, materialName: string, width?: number, height?: number, frameWidth?: number, frameHeight?: number, frameCount?: number, frameSequence?: number[]);
        onMessage(message: Message): void;
        load(): void;
        calculateUVs(): void;
        update(time: number): void;
        destory(): void;
    }
}
declare namespace TSE {
    class Color {
        private _r;
        private _g;
        private _b;
        private _a;
        constructor(r?: number, g?: number, b?: number, a?: number);
        get r(): number;
        set r(value: number);
        get rFloat(): number;
        get g(): number;
        set g(value: number);
        get gFloat(): number;
        get b(): number;
        set b(value: number);
        get bFloat(): number;
        get a(): number;
        set a(value: number);
        get aFloat(): number;
        toArray(): number[];
        toFloatArray(): number[];
        toFloat32Array(): Float32Array;
        static black(): Color;
        static white(): Color;
        static red(): Color;
        static green(): Color;
        static blue(): Color;
    }
}
declare namespace TSE {
    class Material {
        private _name;
        private _diffuseTextureName;
        private _diffuseTexture;
        private _tint;
        constructor(name: string, diffuseTextureName: string, tint: Color);
        get tint(): Color;
        get name(): string;
        get diffuseTexture(): Texture;
        get diffuseTextureName(): string;
        set diffuseTextureName(value: string);
        destory(): void;
    }
}
declare namespace TSE {
    class MaterialManager {
        private static _materials;
        private constructor();
        static registerMaterial(material: Material): void;
        static getMaterial(materialName: string): Material;
        static releaseMaterial(materialName: string): void;
    }
}
declare namespace TSE {
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
declare namespace TSE {
    class TextureManager {
        private static _textures;
        private constructor();
        static getTexture(textureName: string): Texture;
        static releaseTexture(textureName: string): void;
    }
}
declare namespace TSE {
    class Vertex {
        position: Vector3;
        texCoords: Vector2;
        constructor(x?: number, y?: number, z?: number, tu?: number, tv?: number);
        toArray(): number[];
        toFloat32Array(): Float32Array;
    }
}
declare namespace TSE {
    interface IShape2D {
        position: Vector2;
        setFromJson(json: any): void;
        intersects(other: IShape2D): boolean;
        pointInShape(point: Vector2): boolean;
    }
}
declare namespace TSE {
    class Circle implements IShape2D {
        position: Vector2;
        radius: number;
        setFromJson(json: any): void;
        intersects(other: IShape2D): boolean;
        pointInShape(point: Vector2): boolean;
    }
}
declare namespace TSE {
    class Rectangle implements IShape2D {
        position: Vector2;
        width: number;
        height: number;
        setFromJson(json: any): void;
        intersects(other: IShape2D): boolean;
        pointInShape(point: Vector2): boolean;
    }
}
declare namespace TSE {
    enum Keys {
        LEFT = 37,
        UP = 38,
        RIGHT = 39,
        DOWN = 40
    }
    class MouseContent {
        leftDown: boolean;
        rightDown: boolean;
        position: Vector2;
        constructor(leftDown: boolean, rightDown: boolean, position: Vector2);
    }
    class InputManager {
        private static _key;
        private static _mouseX;
        private static _mouseY;
        private static _previousMouseX;
        private static _previousMouseY;
        private static _leftDown;
        private static _rightDown;
        static initialize(): void;
        static isKeyDown(key: Keys): boolean;
        static onKeyDown(event: KeyboardEvent): boolean;
        static onKeyUp(event: KeyboardEvent): boolean;
        static getMousePosition(): Vector2;
        static onMouseMove(event: MouseEvent): void;
        static onMouseDown(event: MouseEvent): void;
        static onMouseUp(event: MouseEvent): void;
    }
}
declare namespace TSE {
    class Martix4 {
        private _data;
        private constructor();
        get data(): number[];
        static identity(): Martix4;
        static orthographic(left: number, right: number, bottom: number, top: number, nearClip: number, farCLip: number): Martix4;
        static translation(position: Vector3): Martix4;
        static rotationX(angleInRadians: number): Martix4;
        static rotationY(angleInRadians: number): Martix4;
        static rotationZ(angleInRadians: number): Martix4;
        static rotationXYZ(xRadians: number, yRadians: number, zRadians: number): Martix4;
        static multiply(a: Martix4, b: Martix4): Martix4;
        toFloat32Array(): Float32Array;
        static scale(scale: Vector3): Martix4;
        copyFrom(m: Martix4): void;
    }
}
declare namespace TSE {
    class Transform {
        position: Vector3;
        rotation: Vector3;
        scale: Vector3;
        copyFrom(transform: Transform): void;
        getTransformationMatrix(): Martix4;
        setFromJson(json: any): void;
    }
}
declare namespace TSE {
    class Vector2 {
        private _x;
        private _y;
        constructor(x?: number, y?: number);
        get x(): number;
        set x(value: number);
        get y(): number;
        set y(value: number);
        static get zero(): Vector2;
        static get one(): Vector2;
        copyFrom(vector2: Vector2): void;
        toArray(): number[];
        toFloat32Array(): Float32Array;
        set(x?: number, y?: number): void;
        add(v: Vector2): Vector2;
        subtract(v: Vector2): Vector2;
        multiply(v: Vector2): Vector2;
        divide(v: Vector2): Vector2;
        static distance(a: Vector2, b: Vector2): number;
    }
}
declare namespace TSE {
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
        equals(v: Vector3): boolean;
        toArray(): number[];
        toFloat32Array(): Float32Array;
        static get zero(): Vector3;
        static get one(): Vector3;
        set(x?: number, y?: number, z?: number): void;
        copyFrom(vector3: Vector3): void;
        setFromJson(json: any): void;
        add(v: Vector3): Vector3;
        subtract(v: Vector3): Vector3;
        multiply(v: Vector3): Vector3;
        divide(v: Vector3): Vector3;
        static distance(a: Vector3, b: Vector3): number;
    }
}
declare namespace TSE {
    interface IMessageHandler {
        onMessage(message: Message): void;
    }
}
declare namespace TSE {
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
declare namespace TSE {
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
declare namespace TSE {
    class MessageSubscriptionNode {
        message: Message;
        handler: IMessageHandler;
        constructor(message: Message, handler: IMessageHandler);
    }
}
declare namespace TSE {
    class Scene {
        private _root;
        constructor();
        get root(): SimObject;
        get isLoaded(): boolean;
        addObject(object: SimObject): void;
        getObject(name: string): SimObject;
        load(): void;
        update(time: number): void;
        render(shader: Shader): void;
    }
}
declare namespace TSE {
    class SimObject {
        private _id;
        private _children;
        private _parent;
        private _isLoaded;
        private _scene;
        private _components;
        private _behaviors;
        private _localMatrix;
        private _worldMatrix;
        name: string;
        transform: Transform;
        constructor(id: number, name: string, scene?: Scene);
        get id(): number;
        get parent(): SimObject;
        get worldMatrix(): Martix4;
        get isLoaded(): boolean;
        addChild(child: SimObject): void;
        removeChild(child: SimObject): void;
        getObjectByName(name: string): SimObject;
        addComponent(component: IComponent): void;
        addBehavior(behaviors: IBehavior): void;
        load(): void;
        update(time: number): void;
        render(shader: Shader): void;
        onAdded(scene: Scene): void;
        private updateWorldMatrix;
    }
}
declare namespace TSE {
    enum ZoneState {
        UNINITALIZED = 0,
        LOADING = 1,
        UPDATEING = 2
    }
    class Zone {
        private _id;
        private _name;
        private _description;
        private _scene;
        private _globalId;
        private _state;
        constructor(id: number, name: string, description: string);
        get id(): number;
        get name(): string;
        get description(): string;
        get scene(): Scene;
        initialize(zoneData: any): void;
        load(): void;
        unload(): void;
        update(time: number): void;
        render(shader: Shader): void;
        onActivated(): void;
        onDeactivated(): void;
        private loadSimObject;
    }
}
declare namespace TSE {
    class ZoneManager implements IMessageHandler {
        private static _globalZoneID;
        private static _registeredZones;
        private static _activeZone;
        private static _inst;
        private constructor();
        onMessage(message: Message): void;
        static initialize(): void;
        static changeZone(id: number): void;
        static loadZone(asset: JsonAsset): void;
        static update(time: number): void;
        static render(shader: Shader): void;
    }
}
