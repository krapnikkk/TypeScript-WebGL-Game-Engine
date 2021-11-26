var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var engine;
window.onload = function () {
    engine = new TSE.Engine();
    engine.start();
};
window.onresize = function () {
    engine.resize();
};
var TSE;
(function (TSE) {
    var Engine = (function () {
        function Engine() {
            this._previousTime = 0;
        }
        Engine.prototype.onMessage = function (message) {
            if (message.code == "MOUSE_UP") {
                var context = message.context;
                console.log(context.position);
                TSE.AudioManager.playSound("flap");
            }
        };
        Engine.prototype.start = function () {
            this._canvas = TSE.GLUtilities.initialize();
            TSE.AssetManager.initialize();
            TSE.InputManager.initialize();
            TSE.ZoneManager.initialize();
            TSE.Message.subscribe("MOUSE_UP", this);
            TSE.gl.clearColor(0, 0, 0, 1);
            TSE.gl.enable(TSE.gl.BLEND);
            TSE.gl.blendFunc(TSE.gl.SRC_ALPHA, TSE.gl.ONE_MINUS_SRC_ALPHA);
            this._basicShader = new TSE.BasicShader();
            this._basicShader.use();
            TSE.MaterialManager.registerMaterial(new TSE.Material("sky", "./assets/texture/sky.jpeg", TSE.Color.white()));
            TSE.MaterialManager.registerMaterial(new TSE.Material("duck", "./assets/texture/duck.png", TSE.Color.white()));
            TSE.AudioManager.loadSoundFile("flap", "./assets/audio/flap.mp3", false);
            TSE.ZoneManager.changeZone(0);
            this._projection = TSE.Martix4.orthographic(0, this._canvas.width, this._canvas.height, 0, -100.0, 100.0);
            this.resize();
            this.loop();
        };
        Engine.prototype.resize = function () {
            if (this._canvas !== undefined) {
                this._canvas.width = window.innerWidth;
                this._canvas.height = window.innerHeight;
                this._projection = TSE.Martix4.orthographic(0, this._canvas.width, this._canvas.height, 0, -100.0, 100.0);
                TSE.gl.viewport(0, 0, TSE.gl.canvas.width, TSE.gl.canvas.height);
            }
        };
        Engine.prototype.loop = function () {
            this.update();
            this.render();
        };
        Engine.prototype.update = function () {
            var delta = performance.now() - this._previousTime;
            TSE.MessageBus.update(delta);
            TSE.ZoneManager.update(delta);
            this._previousTime = performance.now();
        };
        Engine.prototype.render = function () {
            TSE.gl.clear(TSE.gl.COLOR_BUFFER_BIT);
            TSE.ZoneManager.render(this._basicShader);
            var projectionPosition = this._basicShader.getUniformLocation("u_projection");
            TSE.gl.uniformMatrix4fv(projectionPosition, false, new Float32Array(this._projection.data));
            requestAnimationFrame(this.loop.bind(this));
        };
        return Engine;
    }());
    TSE.Engine = Engine;
})(TSE || (TSE = {}));
var TSE;
(function (TSE) {
    TSE.MESSAGE_ASSET_LOADED_ASSET_LOADED = "MESSAGE_ASSET_LOADED_ASSET_LOADED";
    var AssetManager = (function () {
        function AssetManager() {
        }
        AssetManager.initialize = function () {
            AssetManager._loaders.push(new TSE.ImageAssetLoader());
            AssetManager._loaders.push(new TSE.JsonAssetLoader());
        };
        AssetManager.registerLoader = function (loader) {
            AssetManager._loaders.push(loader);
        };
        AssetManager.loadAsset = function (assetName) {
            var extension = assetName.split(".").pop().toLowerCase();
            for (var _i = 0, _a = AssetManager._loaders; _i < _a.length; _i++) {
                var l = _a[_i];
                if (l.supportedExtensions.indexOf(extension) !== -1) {
                    l.loadAsset(assetName);
                    return;
                }
            }
            console.warn("Unable to load asset with extension " + extension + "because there is no loader associated with it.");
        };
        AssetManager.onAssetLoaded = function (asset) {
            AssetManager._loaderAssets[asset.name] = asset;
            TSE.Message.send(TSE.MESSAGE_ASSET_LOADED_ASSET_LOADED + asset.name, this, asset);
        };
        AssetManager.isAssetLoaded = function (assetName) {
            return AssetManager._loaderAssets[assetName] !== undefined;
        };
        AssetManager.getAsset = function (assetName) {
            if (AssetManager._loaderAssets[assetName] != undefined) {
                return AssetManager._loaderAssets[assetName];
            }
            else {
                AssetManager.loadAsset(assetName);
            }
            return undefined;
        };
        AssetManager._loaders = [];
        AssetManager._loaderAssets = {};
        return AssetManager;
    }());
    TSE.AssetManager = AssetManager;
})(TSE || (TSE = {}));
var TSE;
(function (TSE) {
    var ImageAsset = (function () {
        function ImageAsset(name, data) {
            this.data = data;
            this.name = name;
        }
        Object.defineProperty(ImageAsset.prototype, "width", {
            get: function () {
                return this.data.width;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(ImageAsset.prototype, "height", {
            get: function () {
                return this.data.height;
            },
            enumerable: false,
            configurable: true
        });
        return ImageAsset;
    }());
    TSE.ImageAsset = ImageAsset;
    var ImageAssetLoader = (function () {
        function ImageAssetLoader() {
        }
        Object.defineProperty(ImageAssetLoader.prototype, "supportedExtensions", {
            get: function () {
                return ["png", "jpg", "jpeg"];
            },
            enumerable: false,
            configurable: true
        });
        ImageAssetLoader.prototype.loadAsset = function (assetName) {
            var image = new Image();
            image.onload = this.onImageLoaded.bind(this, assetName, image);
            image.src = assetName;
        };
        ImageAssetLoader.prototype.onImageLoaded = function (assetName, image) {
            console.log("onImageLoaded:", assetName, image);
            var asset = new ImageAsset(assetName, image);
            TSE.AssetManager.onAssetLoaded(asset);
        };
        return ImageAssetLoader;
    }());
    TSE.ImageAssetLoader = ImageAssetLoader;
})(TSE || (TSE = {}));
var TSE;
(function (TSE) {
    var JsonAsset = (function () {
        function JsonAsset(name, data) {
            this.data = data;
            this.name = name;
        }
        return JsonAsset;
    }());
    TSE.JsonAsset = JsonAsset;
    var JsonAssetLoader = (function () {
        function JsonAssetLoader() {
        }
        Object.defineProperty(JsonAssetLoader.prototype, "supportedExtensions", {
            get: function () {
                return ["json"];
            },
            enumerable: false,
            configurable: true
        });
        JsonAssetLoader.prototype.loadAsset = function (assetName) {
            var request = new XMLHttpRequest();
            request.open("GET", assetName);
            request.addEventListener("load", this.onJsonLoaded.bind(this, assetName, request));
            request.send();
        };
        JsonAssetLoader.prototype.onJsonLoaded = function (assetName, request) {
            console.log("onImageLoaded:", assetName, request);
            if (request.readyState === request.DONE) {
                var json = JSON.parse(request.responseText);
                var asset = new JsonAsset(assetName, json);
                TSE.AssetManager.onAssetLoaded(asset);
            }
        };
        return JsonAssetLoader;
    }());
    TSE.JsonAssetLoader = JsonAssetLoader;
})(TSE || (TSE = {}));
var TSE;
(function (TSE) {
    var SoundEffect = (function () {
        function SoundEffect(assetPath, loop) {
            this._player = new Audio(assetPath);
            this._player.loop = loop;
        }
        Object.defineProperty(SoundEffect.prototype, "loop", {
            get: function () {
                return this._player.loop;
            },
            set: function (value) {
                this._player.loop = value;
            },
            enumerable: false,
            configurable: true
        });
        SoundEffect.prototype.destroy = function () {
            this._player = null;
        };
        SoundEffect.prototype.play = function () {
            if (!this._player.paused) {
                this.stop();
            }
            this._player.play();
        };
        SoundEffect.prototype.pause = function () {
            this._player.pause();
        };
        SoundEffect.prototype.stop = function () {
            this._player.pause();
            this._player.currentTime = 0;
        };
        return SoundEffect;
    }());
    TSE.SoundEffect = SoundEffect;
    var AudioManager = (function () {
        function AudioManager() {
        }
        AudioManager.loadSoundFile = function (name, audioPath, loop) {
            AudioManager._soundEffects[name] = new SoundEffect(audioPath, loop);
        };
        AudioManager.playSound = function (name) {
            if (AudioManager._soundEffects[name]) {
                AudioManager._soundEffects[name].play();
            }
        };
        AudioManager.stopSound = function (name) {
            if (AudioManager._soundEffects[name]) {
                AudioManager._soundEffects[name].stop();
            }
        };
        AudioManager.pauseSound = function (name) {
            if (AudioManager._soundEffects[name]) {
                AudioManager._soundEffects[name].pause();
            }
        };
        AudioManager.pauseAll = function () {
            for (var name_1 in AudioManager._soundEffects) {
                AudioManager._soundEffects[name_1].pause();
            }
        };
        AudioManager.stopAll = function () {
            for (var name_2 in AudioManager._soundEffects) {
                AudioManager._soundEffects[name_2].stop();
            }
        };
        AudioManager._soundEffects = {};
        return AudioManager;
    }());
    TSE.AudioManager = AudioManager;
})(TSE || (TSE = {}));
var TSE;
(function (TSE) {
    var BehaviorManager = (function () {
        function BehaviorManager() {
        }
        BehaviorManager.registerBuilder = function (builder) {
            BehaviorManager._registeredBuilders[builder.type] = builder;
        };
        BehaviorManager.extractBehavior = function (json) {
            if (json.type) {
                if (BehaviorManager._registeredBuilders[json.type] !== undefined) {
                    return BehaviorManager._registeredBuilders[json.type].buildFromJson(json);
                }
                throw new Error("BehaviorManager error - type is missing or builder is not registered for this type.");
            }
        };
        BehaviorManager._registeredBuilders = {};
        return BehaviorManager;
    }());
    TSE.BehaviorManager = BehaviorManager;
})(TSE || (TSE = {}));
var TSE;
(function (TSE) {
    var BaseBehavior = (function () {
        function BaseBehavior(data) {
            this._data = data;
            this.name = this._data.name;
        }
        BaseBehavior.prototype.setOwner = function (owner) {
            this._owner = owner;
        };
        BaseBehavior.prototype.update = function (time) {
        };
        BaseBehavior.prototype.apply = function (userData) {
        };
        return BaseBehavior;
    }());
    TSE.BaseBehavior = BaseBehavior;
})(TSE || (TSE = {}));
var TSE;
(function (TSE) {
    var KeybroadMovementBehaviorData = (function () {
        function KeybroadMovementBehaviorData() {
            this.speed = 0.1;
        }
        KeybroadMovementBehaviorData.prototype.setFromJson = function (json) {
            if (json.name == undefined) {
                throw new Error("Name must be defined in behavior data.");
            }
            this.name = json.name;
            if (json.speed == undefined) {
                throw new Error("speed must be defined in behavior data.");
            }
            this.speed = json.speed;
        };
        return KeybroadMovementBehaviorData;
    }());
    TSE.KeybroadMovementBehaviorData = KeybroadMovementBehaviorData;
    var KeybroadMovementBehaviorBuilder = (function () {
        function KeybroadMovementBehaviorBuilder() {
        }
        Object.defineProperty(KeybroadMovementBehaviorBuilder.prototype, "type", {
            get: function () {
                return "keybroadMovement";
            },
            enumerable: false,
            configurable: true
        });
        ;
        KeybroadMovementBehaviorBuilder.prototype.buildFromJson = function (json) {
            var data = new KeybroadMovementBehaviorData();
            data.setFromJson(json);
            return new KeybroadMovementBehavior(data);
        };
        return KeybroadMovementBehaviorBuilder;
    }());
    TSE.KeybroadMovementBehaviorBuilder = KeybroadMovementBehaviorBuilder;
    var KeybroadMovementBehavior = (function (_super) {
        __extends(KeybroadMovementBehavior, _super);
        function KeybroadMovementBehavior(data) {
            var _this = _super.call(this, data) || this;
            _this.speed = 0.1;
            _this.speed = data.speed;
            return _this;
        }
        KeybroadMovementBehavior.prototype.update = function (time) {
            if (TSE.InputManager.isKeyDown(TSE.Keys.LEFT)) {
                this._owner.transform.position.x -= this.speed;
            }
            if (TSE.InputManager.isKeyDown(TSE.Keys.RIGHT)) {
                this._owner.transform.position.x += this.speed;
            }
            if (TSE.InputManager.isKeyDown(TSE.Keys.UP)) {
                this._owner.transform.position.y -= this.speed;
            }
            if (TSE.InputManager.isKeyDown(TSE.Keys.DOWN)) {
                this._owner.transform.position.y += this.speed;
            }
            _super.prototype.update.call(this, time);
        };
        return KeybroadMovementBehavior;
    }(TSE.BaseBehavior));
    TSE.KeybroadMovementBehavior = KeybroadMovementBehavior;
    TSE.BehaviorManager.registerBuilder(new KeybroadMovementBehaviorBuilder);
})(TSE || (TSE = {}));
var TSE;
(function (TSE) {
    var RotationBehaviorData = (function () {
        function RotationBehaviorData() {
            this.rotation = TSE.Vector3.zero;
        }
        RotationBehaviorData.prototype.setFromJson = function (json) {
            if (json.name == undefined) {
                throw new Error("Name must be defined in behavior data.");
            }
            this.name = json.name;
            if (json.rotation !== undefined) {
                this.rotation.setFromJson(json.rotation);
            }
        };
        return RotationBehaviorData;
    }());
    TSE.RotationBehaviorData = RotationBehaviorData;
    var RotationBehaviorBuilder = (function () {
        function RotationBehaviorBuilder() {
        }
        Object.defineProperty(RotationBehaviorBuilder.prototype, "type", {
            get: function () {
                return "rotation";
            },
            enumerable: false,
            configurable: true
        });
        ;
        RotationBehaviorBuilder.prototype.buildFromJson = function (json) {
            var data = new RotationBehaviorData();
            data.setFromJson(json);
            return new RotationBehavior(data);
        };
        return RotationBehaviorBuilder;
    }());
    TSE.RotationBehaviorBuilder = RotationBehaviorBuilder;
    var RotationBehavior = (function (_super) {
        __extends(RotationBehavior, _super);
        function RotationBehavior(data) {
            var _this = _super.call(this, data) || this;
            _this._rotation = data.rotation;
            return _this;
        }
        RotationBehavior.prototype.update = function (time) {
            this._owner.transform.rotation.add(this._rotation);
            _super.prototype.update.call(this, time);
        };
        return RotationBehavior;
    }(TSE.BaseBehavior));
    TSE.RotationBehavior = RotationBehavior;
    TSE.BehaviorManager.registerBuilder(new RotationBehaviorBuilder);
})(TSE || (TSE = {}));
var TSE;
(function (TSE) {
    var ComponentManager = (function () {
        function ComponentManager() {
        }
        ComponentManager.registerBuilder = function (builder) {
            ComponentManager._registeredBuilders[builder.type] = builder;
        };
        ComponentManager.extractComponent = function (json) {
            if (json.type) {
                if (ComponentManager._registeredBuilders[json.type] !== undefined) {
                    return ComponentManager._registeredBuilders[json.type].buildFromJson(json);
                }
            }
            throw new Error("ComponentManager error - type is missing or builder is not registered for this type.");
        };
        ComponentManager._registeredBuilders = {};
        return ComponentManager;
    }());
    TSE.ComponentManager = ComponentManager;
})(TSE || (TSE = {}));
var TSE;
(function (TSE) {
    var BaseComponent = (function () {
        function BaseComponent(data) {
            this._data = data;
            this.name = data.name;
        }
        ;
        Object.defineProperty(BaseComponent.prototype, "owner", {
            get: function () {
                return this._owner;
            },
            enumerable: false,
            configurable: true
        });
        BaseComponent.prototype.setOwner = function (owner) {
            this._owner = owner;
        };
        BaseComponent.prototype.load = function () {
        };
        BaseComponent.prototype.update = function (time) {
        };
        ;
        BaseComponent.prototype.render = function (shader) {
        };
        ;
        return BaseComponent;
    }());
    TSE.BaseComponent = BaseComponent;
})(TSE || (TSE = {}));
var TSE;
(function (TSE) {
    var SpriteComponentData = (function () {
        function SpriteComponentData() {
            this.origin = TSE.Vector3.zero;
        }
        SpriteComponentData.prototype.setFromJson = function (json) {
            if (json.name) {
                this.name = json.name;
            }
            if (json.materialName) {
                this.materialName = json.materialName;
            }
            if (json.origin) {
                this.origin.setFromJson(json.origin);
            }
        };
        return SpriteComponentData;
    }());
    TSE.SpriteComponentData = SpriteComponentData;
    var SpriteComponentBuilder = (function () {
        function SpriteComponentBuilder() {
        }
        Object.defineProperty(SpriteComponentBuilder.prototype, "type", {
            get: function () {
                return "sprite";
            },
            enumerable: false,
            configurable: true
        });
        SpriteComponentBuilder.prototype.buildFromJson = function (json) {
            var data = new SpriteComponentData();
            data.setFromJson(json);
            return new SpriteComponent(data);
        };
        return SpriteComponentBuilder;
    }());
    TSE.SpriteComponentBuilder = SpriteComponentBuilder;
    var SpriteComponent = (function (_super) {
        __extends(SpriteComponent, _super);
        function SpriteComponent(data) {
            var _this = _super.call(this, data) || this;
            var name = data.name, materialName = data.materialName;
            _this._sprite = new TSE.Sprite(name, materialName);
            if (!data.origin.equals(TSE.Vector3.zero)) {
                _this._sprite.origin.copyFrom(data.origin);
            }
            return _this;
        }
        SpriteComponent.prototype.load = function () {
            this._sprite.load();
        };
        SpriteComponent.prototype.render = function (shader) {
            this._sprite.draw(shader, this.owner.worldMatrix);
            _super.prototype.render.call(this, shader);
        };
        return SpriteComponent;
    }(TSE.BaseComponent));
    TSE.SpriteComponent = SpriteComponent;
    TSE.ComponentManager.registerBuilder(new SpriteComponentBuilder);
})(TSE || (TSE = {}));
var TSE;
(function (TSE) {
    var AnimatedSpriteComponentData = (function (_super) {
        __extends(AnimatedSpriteComponentData, _super);
        function AnimatedSpriteComponentData() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        AnimatedSpriteComponentData.prototype.setFromJson = function (json) {
            _super.prototype.setFromJson.call(this, json);
            this.frameWidth = json.frameWidth;
            this.frameHeight = json.frameHeight;
            this.frameCount = json.frameCount;
            this.frameSequence = json.frameSequence;
        };
        return AnimatedSpriteComponentData;
    }(TSE.SpriteComponentData));
    TSE.AnimatedSpriteComponentData = AnimatedSpriteComponentData;
    var AnimatedSpriteComponentBuilder = (function () {
        function AnimatedSpriteComponentBuilder() {
        }
        Object.defineProperty(AnimatedSpriteComponentBuilder.prototype, "type", {
            get: function () {
                return "animatedSprite";
            },
            enumerable: false,
            configurable: true
        });
        AnimatedSpriteComponentBuilder.prototype.buildFromJson = function (json) {
            var data = new AnimatedSpriteComponentData();
            data.setFromJson(json);
            return new AnimatedSpriteComponent(data);
        };
        return AnimatedSpriteComponentBuilder;
    }());
    TSE.AnimatedSpriteComponentBuilder = AnimatedSpriteComponentBuilder;
    var AnimatedSpriteComponent = (function (_super) {
        __extends(AnimatedSpriteComponent, _super);
        function AnimatedSpriteComponent(data) {
            var _this = _super.call(this, data) || this;
            var name = data.name, materialName = data.materialName, frameCount = data.frameCount, frameSequence = data.frameSequence, frameWidth = data.frameWidth, frameHeight = data.frameHeight;
            _this._sprite = new TSE.AnimatedSprite(name, materialName, frameWidth, frameHeight, frameWidth, frameHeight, frameCount, frameSequence);
            return _this;
        }
        AnimatedSpriteComponent.prototype.update = function (time) {
            this._sprite.update(time);
            _super.prototype.update.call(this, time);
        };
        AnimatedSpriteComponent.prototype.load = function () {
            this._sprite.load();
        };
        AnimatedSpriteComponent.prototype.render = function (shader) {
            this._sprite.draw(shader, this.owner.worldMatrix);
            _super.prototype.render.call(this, shader);
        };
        return AnimatedSpriteComponent;
    }(TSE.BaseComponent));
    TSE.AnimatedSpriteComponent = AnimatedSpriteComponent;
    TSE.ComponentManager.registerBuilder(new AnimatedSpriteComponentBuilder);
})(TSE || (TSE = {}));
var TSE;
(function (TSE) {
    var CollisionComponentData = (function () {
        function CollisionComponentData() {
        }
        CollisionComponentData.prototype.setFromJson = function (json) {
            if (json.name) {
                this.name = json.name;
            }
            if (json.shape) {
                var shapeType = json.shape.type;
                switch (shapeType) {
                    case "circle":
                        this.shape = new TSE.Circle();
                        break;
                    case "rectangle":
                        this.shape = new TSE.Rectangle();
                        break;
                }
                this.shape.setFromJson(json.shape);
            }
        };
        return CollisionComponentData;
    }());
    TSE.CollisionComponentData = CollisionComponentData;
    var CollisionComponentBuilder = (function () {
        function CollisionComponentBuilder() {
        }
        Object.defineProperty(CollisionComponentBuilder.prototype, "type", {
            get: function () {
                return "collision";
            },
            enumerable: false,
            configurable: true
        });
        CollisionComponentBuilder.prototype.buildFromJson = function (json) {
            var data = new CollisionComponentData();
            data.setFromJson(json);
            return new CollisionComponent(data);
        };
        return CollisionComponentBuilder;
    }());
    TSE.CollisionComponentBuilder = CollisionComponentBuilder;
    var CollisionComponent = (function (_super) {
        __extends(CollisionComponent, _super);
        function CollisionComponent(data) {
            var _this = _super.call(this, data) || this;
            _this._shape = data.shape;
            return _this;
        }
        Object.defineProperty(CollisionComponent.prototype, "shape", {
            get: function () {
                return this._shape;
            },
            enumerable: false,
            configurable: true
        });
        CollisionComponent.prototype.render = function (shader) {
            _super.prototype.render.call(this, shader);
        };
        return CollisionComponent;
    }(TSE.BaseComponent));
    TSE.CollisionComponent = CollisionComponent;
    TSE.ComponentManager.registerBuilder(new CollisionComponentBuilder);
})(TSE || (TSE = {}));
var TSE;
(function (TSE) {
    var GLUtilities = (function () {
        function GLUtilities() {
        }
        GLUtilities.initialize = function (elementId) {
            var canvas;
            if (elementId !== undefined) {
                canvas = document.getElementById(elementId);
                if (canvas === undefined) {
                    throw new Error("Cannot find a canvas element named:" + elementId);
                }
            }
            else {
                canvas = document.createElement("canvas");
                canvas.id = "engine";
                document.body.appendChild(canvas);
            }
            TSE.gl = canvas.getContext("webgl");
            if (TSE.gl === undefined) {
                throw new Error("Unable to initialize WebGL!");
            }
            return canvas;
        };
        return GLUtilities;
    }());
    TSE.GLUtilities = GLUtilities;
})(TSE || (TSE = {}));
var TSE;
(function (TSE) {
    var AttributeInfo = (function () {
        function AttributeInfo() {
            this.offset = 0;
        }
        return AttributeInfo;
    }());
    TSE.AttributeInfo = AttributeInfo;
    var GLBuffer = (function () {
        function GLBuffer(dataType, targetBufferType, mode) {
            if (dataType === void 0) { dataType = TSE.gl.FLOAT; }
            if (targetBufferType === void 0) { targetBufferType = TSE.gl.ARRAY_BUFFER; }
            if (mode === void 0) { mode = TSE.gl.TRIANGLES; }
            this._hasAttributeLocation = false;
            this._data = [];
            this._attributes = [];
            this._elementSize = 0;
            this._dataType = dataType;
            this._targetBufferType = targetBufferType;
            this._mode = mode;
            switch (this._dataType) {
                case TSE.gl.FLOAT:
                case TSE.gl.INT:
                case TSE.gl.UNSIGNED_INT:
                    this._typeSize = 4;
                    break;
                case TSE.gl.SHORT:
                case TSE.gl.UNSIGNED_SHORT:
                    this._typeSize = 2;
                    break;
                case TSE.gl.BYTE:
                case TSE.gl.UNSIGNED_BYTE:
                    this._typeSize = 1;
                    break;
                default:
                    throw new Error("Unrecognized data type:" + dataType.toString());
            }
            this._buffer = TSE.gl.createBuffer();
        }
        GLBuffer.prototype.bind = function (normalized) {
            if (normalized === void 0) { normalized = false; }
            TSE.gl.bindBuffer(this._targetBufferType, this._buffer);
            if (this._hasAttributeLocation) {
                for (var _i = 0, _a = this._attributes; _i < _a.length; _i++) {
                    var it = _a[_i];
                    TSE.gl.vertexAttribPointer(it.location, it.size, this._dataType, normalized, this._stride, it.offset * this._typeSize);
                    TSE.gl.enableVertexAttribArray(it.location);
                }
            }
        };
        GLBuffer.prototype.unbind = function () {
            for (var _i = 0, _a = this._attributes; _i < _a.length; _i++) {
                var it = _a[_i];
                TSE.gl.disableVertexAttribArray(it.location);
            }
            TSE.gl.bindBuffer(this._targetBufferType, null);
        };
        GLBuffer.prototype.addAttributeLocation = function (info) {
            this._hasAttributeLocation = true;
            info.offset = this._elementSize;
            this._attributes.push(info);
            this._elementSize += info.size;
            this._stride = this._elementSize * this._typeSize;
        };
        GLBuffer.prototype.setData = function (data) {
            this.clearData();
            this.pushBackData(data);
        };
        GLBuffer.prototype.pushBackData = function (data) {
            for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
                var d = data_1[_i];
                this._data.push(d);
            }
        };
        GLBuffer.prototype.clearData = function () {
            this._data.length = 0;
        };
        GLBuffer.prototype.upload = function () {
            TSE.gl.bindBuffer(this._targetBufferType, this._buffer);
            var bufferData;
            switch (this._dataType) {
                case TSE.gl.FLOAT:
                    bufferData = new Float32Array(this._data);
                    break;
                case TSE.gl.INT:
                    bufferData = new Int32Array(this._data);
                    break;
                case TSE.gl.UNSIGNED_INT:
                    bufferData = new Uint32Array(this._data);
                    break;
                case TSE.gl.SHORT:
                    bufferData = new Int16Array(this._data);
                    break;
                case TSE.gl.UNSIGNED_SHORT:
                    bufferData = new Uint16Array(this._data);
                    break;
                case TSE.gl.BYTE:
                    bufferData = new Int8Array(this._data);
                    break;
                case TSE.gl.UNSIGNED_BYTE:
                    bufferData = new Uint8Array(this._data);
                    break;
            }
            TSE.gl.bufferData(this._targetBufferType, bufferData, TSE.gl.STATIC_DRAW);
        };
        GLBuffer.prototype.draw = function () {
            if (this._targetBufferType === TSE.gl.ARRAY_BUFFER) {
                TSE.gl.drawArrays(this._mode, 0, this._data.length / this._elementSize);
            }
            else if (this._targetBufferType === TSE.gl.ELEMENT_ARRAY_BUFFER) {
                TSE.gl.drawElements(this._mode, this._data.length, this._dataType, 0);
            }
        };
        GLBuffer.prototype.destroy = function () {
            TSE.gl.deleteBuffer(this._buffer);
        };
        return GLBuffer;
    }());
    TSE.GLBuffer = GLBuffer;
})(TSE || (TSE = {}));
var TSE;
(function (TSE) {
    var Shader = (function () {
        function Shader(name) {
            this._attributes = {};
            this._uniforms = {};
            this._name = name;
        }
        Object.defineProperty(Shader.prototype, "name", {
            get: function () {
                return this._name;
            },
            enumerable: false,
            configurable: true
        });
        Shader.prototype.load = function (vertexSource, fragmentSource) {
            var vertexShader = this.loadShader(vertexSource, TSE.gl.VERTEX_SHADER);
            var fragmentShader = this.loadShader(fragmentSource, TSE.gl.FRAGMENT_SHADER);
            this.createProgram(vertexShader, fragmentShader);
            this.detectAttributes();
            this.detectUniforms();
        };
        Shader.prototype.loadShader = function (source, shaderType) {
            var shader = TSE.gl.createShader(shaderType);
            TSE.gl.shaderSource(shader, source);
            TSE.gl.compileShader(shader);
            var error = TSE.gl.getShaderInfoLog(shader);
            if (error !== "") {
                throw new Error("Error compiling shader:" + error);
            }
            return shader;
        };
        Shader.prototype.createProgram = function (vertexShader, fragmentShader) {
            this._program = TSE.gl.createProgram();
            TSE.gl.attachShader(this._program, vertexShader);
            TSE.gl.attachShader(this._program, fragmentShader);
            TSE.gl.linkProgram(this._program);
            var error = TSE.gl.getProgramInfoLog(this._program);
            if (error !== "") {
                throw new Error("Error linking shader " + this._name + ":" + error);
            }
        };
        Shader.prototype.use = function () {
            TSE.gl.useProgram(this._program);
        };
        Shader.prototype.detectAttributes = function () {
            var attributeCount = TSE.gl.getProgramParameter(this._program, TSE.gl.ACTIVE_ATTRIBUTES);
            for (var i = 0; i < attributeCount; i++) {
                var attributeInfo = TSE.gl.getActiveAttrib(this._program, i);
                if (!attributeInfo) {
                    break;
                }
                var name_3 = attributeInfo.name;
                this._attributes[name_3] = TSE.gl.getAttribLocation(this._program, name_3);
            }
        };
        Shader.prototype.detectUniforms = function () {
            var attributeCount = TSE.gl.getProgramParameter(this._program, TSE.gl.ACTIVE_UNIFORMS);
            for (var i = 0; i < attributeCount; i++) {
                var uniformInfo = TSE.gl.getActiveUniform(this._program, i);
                if (!uniformInfo) {
                    break;
                }
                var name_4 = uniformInfo.name;
                this._uniforms[name_4] = TSE.gl.getUniformLocation(this._program, name_4);
            }
        };
        Shader.prototype.getAttributeLocation = function (name) {
            var attribute = this._attributes[name];
            if (attribute === undefined) {
                throw new Error("Unable to find attribute named " + name + " in shader named '" + this._name + "'");
            }
            return attribute;
        };
        Shader.prototype.getUniformLocation = function (name) {
            var uniform = this._uniforms[name];
            if (uniform === undefined) {
                throw new Error("Unable to find uniform named " + name + " in shader named '" + this._name + "'");
            }
            return uniform;
        };
        return Shader;
    }());
    TSE.Shader = Shader;
})(TSE || (TSE = {}));
var TSE;
(function (TSE) {
    var BasicShader = (function (_super) {
        __extends(BasicShader, _super);
        function BasicShader() {
            var _this = _super.call(this, "basic") || this;
            _this.load(_this.getVertexSource(), _this.getFragmentSource());
            return _this;
        }
        BasicShader.prototype.getVertexSource = function () {
            return "\n                attribute vec3 a_position;\n                attribute vec2 a_texCoord;\n                uniform mat4 u_projection;\n                uniform mat4 u_model;\n                varying vec2 v_texCoord;\n                void main(){\n                    v_texCoord = a_texCoord;\n                    gl_Position = u_projection * u_model * vec4(a_position,1.0);\n                }\n             ";
        };
        BasicShader.prototype.getFragmentSource = function () {
            return "\n                precision mediump float;\n                uniform vec4 u_color;\n                uniform sampler2D u_diffuse;\n                uniform vec4 u_tint;\n                varying vec2 v_texCoord;\n                void main(){\n                    gl_FragColor = u_tint * texture2D(u_diffuse,v_texCoord);\n                }\n         ";
        };
        return BasicShader;
    }(TSE.Shader));
    TSE.BasicShader = BasicShader;
})(TSE || (TSE = {}));
var TSE;
(function (TSE) {
    var Sprite = (function () {
        function Sprite(name, materialName, width, height) {
            if (width === void 0) { width = 100; }
            if (height === void 0) { height = 100; }
            this._origin = TSE.Vector3.zero;
            this._vertices = [];
            this._name = name;
            this._width = width;
            this._height = height;
            this._materialName = materialName;
            this._material = TSE.MaterialManager.getMaterial(materialName);
        }
        Object.defineProperty(Sprite.prototype, "name", {
            get: function () {
                return this._name;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Sprite.prototype, "origin", {
            get: function () {
                return this._origin;
            },
            set: function (value) {
                this._origin = value;
                this.recalculateVertices();
            },
            enumerable: false,
            configurable: true
        });
        Sprite.prototype.load = function () {
            this._buffer = new TSE.GLBuffer();
            var positionAttribute = new TSE.AttributeInfo();
            positionAttribute.location = 0;
            positionAttribute.size = 3;
            this._buffer.addAttributeLocation(positionAttribute);
            var textCoordAttribute = new TSE.AttributeInfo();
            textCoordAttribute.location = 1;
            textCoordAttribute.size = 2;
            this._buffer.addAttributeLocation(textCoordAttribute);
            this.calculateVertices();
        };
        Sprite.prototype.calculateVertices = function () {
            var minX = -(this._width * this.origin.x);
            var maxX = this._width * (1.0 - this.origin.x);
            var minY = -(this._height * this.origin.y);
            var maxY = this._height * (1.0 - this.origin.y);
            this._vertices = [
                new TSE.Vertex(minX, minY, 0, 0, 0),
                new TSE.Vertex(minX, maxY, 0, 0, 1.0),
                new TSE.Vertex(maxX, maxY, 0, 1.0, 1.0),
                new TSE.Vertex(maxX, maxY, 0, 1.0, 1.0),
                new TSE.Vertex(maxX, minY, 0, 1.0, 0),
                new TSE.Vertex(minX, minY, 0, 0, 0)
            ];
            for (var _i = 0, _a = this._vertices; _i < _a.length; _i++) {
                var v = _a[_i];
                this._buffer.pushBackData(v.toArray());
            }
            this._buffer.upload();
            this._buffer.unbind();
        };
        Sprite.prototype.recalculateVertices = function () {
            var minX = -(this._width * this.origin.x);
            var maxX = this._width * (1.0 - this.origin.x);
            var minY = -(this._height * this.origin.y);
            var maxY = this._height * (1.0 - this.origin.y);
            this._vertices[0].position.set(minX, minY);
            this._vertices[1].position.set(minX, maxY);
            this._vertices[2].position.set(maxX, maxY);
            this._vertices[3].position.set(maxX, maxY);
            this._vertices[4].position.set(maxY, minY);
            this._vertices[5].position.set(minX, minY);
            for (var _i = 0, _a = this._vertices; _i < _a.length; _i++) {
                var v = _a[_i];
                this._buffer.pushBackData(v.toArray());
            }
            this._buffer.upload();
            this._buffer.unbind();
        };
        Sprite.prototype.update = function (time) {
        };
        Sprite.prototype.draw = function (shader, model) {
            var colorLocation = shader.getUniformLocation("u_tint");
            TSE.gl.uniform4fv(colorLocation, this._material.tint.toFloat32Array());
            var modelLocation = shader.getUniformLocation("u_model");
            TSE.gl.uniformMatrix4fv(modelLocation, false, model.toFloat32Array());
            if (this._material.diffuseTexture) {
                this._material.diffuseTexture.activateAndBind(0);
                var diffuseLocation = shader.getUniformLocation("u_diffuse");
                TSE.gl.uniform1i(diffuseLocation, 0);
            }
            this._buffer.bind();
            this._buffer.draw();
        };
        Sprite.prototype.destory = function () {
            this._buffer.destroy();
            TSE.MaterialManager.releaseMaterial(this._materialName);
            this._material = null;
        };
        return Sprite;
    }());
    TSE.Sprite = Sprite;
})(TSE || (TSE = {}));
var TSE;
(function (TSE) {
    var UVInfo = (function () {
        function UVInfo(min, max) {
            this.min = min;
            this.max = max;
        }
        return UVInfo;
    }());
    var AnimatedSprite = (function (_super) {
        __extends(AnimatedSprite, _super);
        function AnimatedSprite(name, materialName, width, height, frameWidth, frameHeight, frameCount, frameSequence) {
            if (width === void 0) { width = 100; }
            if (height === void 0) { height = 100; }
            if (frameWidth === void 0) { frameWidth = 100; }
            if (frameHeight === void 0) { frameHeight = 100; }
            if (frameCount === void 0) { frameCount = 1; }
            if (frameSequence === void 0) { frameSequence = []; }
            var _this = _super.call(this, name, materialName, width, height) || this;
            _this._currentFrame = 0;
            _this._frameUVS = [];
            _this._frameTime = 333;
            _this._currentTime = 0;
            _this._assetLoaded = false;
            _this._frameHeight = frameHeight;
            _this._frameWidth = frameWidth;
            _this._frameCount = frameCount;
            _this._frameSequence = frameSequence;
            TSE.Message.subscribe(TSE.MESSAGE_ASSET_LOADED_ASSET_LOADED + _this._material.diffuseTextureName, _this);
            return _this;
        }
        AnimatedSprite.prototype.onMessage = function (message) {
            if (message.code == TSE.MESSAGE_ASSET_LOADED_ASSET_LOADED + this._material.diffuseTextureName) {
                this._assetLoaded = true;
                console.log(this._assetLoaded);
                var asset = message.context;
                this._assetWidth = asset.width;
                this._assetHeight = asset.height;
                this.calculateUVs();
            }
        };
        AnimatedSprite.prototype.load = function () {
            _super.prototype.load.call(this);
        };
        AnimatedSprite.prototype.calculateUVs = function () {
            var totalWidth = 0;
            var yValue = 0;
            for (var i = 0; i < this._frameCount; i++) {
                totalWidth += i * this._frameWidth;
                if (totalWidth > this._assetWidth) {
                    yValue++;
                    totalWidth = 0;
                }
                var u = (i * this._frameWidth) / this._assetWidth;
                var v = (yValue * this._frameHeight) / this._assetHeight;
                var min = new TSE.Vector2(u, v);
                var uMax = ((i * this._frameWidth) + this._frameWidth) / this._assetWidth;
                var vMax = ((yValue * this._frameHeight) + this._frameHeight) / this._assetHeight;
                var max = new TSE.Vector2(uMax, vMax);
                this._frameUVS.push(new UVInfo(min, max));
            }
        };
        AnimatedSprite.prototype.update = function (time) {
            if (!this._assetLoaded) {
                return;
            }
            this._currentTime += time;
            if (this._currentTime > this._frameTime) {
                this._currentFrame++;
                this._currentTime = 0;
                if (this._currentFrame >= this._frameSequence.length) {
                    this._currentFrame = 0;
                }
                var frameUVs = this._frameSequence[this._currentFrame];
                this._vertices[0].texCoords.copyFrom(this._frameUVS[frameUVs].min);
                this._vertices[1].texCoords = new TSE.Vector2(this._frameUVS[frameUVs].min.x, this._frameUVS[frameUVs].max.y);
                this._vertices[2].texCoords.copyFrom(this._frameUVS[frameUVs].max);
                this._vertices[3].texCoords.copyFrom(this._frameUVS[frameUVs].max);
                this._vertices[4].texCoords = new TSE.Vector2(this._frameUVS[frameUVs].max.x, this._frameUVS[frameUVs].min.y);
                this._vertices[5].texCoords.copyFrom(this._frameUVS[frameUVs].min);
                this._buffer.clearData();
                for (var _i = 0, _a = this._vertices; _i < _a.length; _i++) {
                    var v = _a[_i];
                    this._buffer.pushBackData(v.toArray());
                }
                this._buffer.upload();
                this._buffer.unbind();
            }
            _super.prototype.update.call(this, time);
        };
        AnimatedSprite.prototype.destory = function () {
            _super.prototype.destory.call(this);
        };
        return AnimatedSprite;
    }(TSE.Sprite));
    TSE.AnimatedSprite = AnimatedSprite;
})(TSE || (TSE = {}));
var TSE;
(function (TSE) {
    var Color = (function () {
        function Color(r, g, b, a) {
            if (r === void 0) { r = 255; }
            if (g === void 0) { g = 255; }
            if (b === void 0) { b = 255; }
            if (a === void 0) { a = 255; }
            this._r = r;
            this._g = g;
            this._b = b;
            this._a = a;
        }
        Object.defineProperty(Color.prototype, "r", {
            get: function () {
                return this._r;
            },
            set: function (value) {
                this._r = value;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Color.prototype, "rFloat", {
            get: function () {
                return this._r / 255.0;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Color.prototype, "g", {
            get: function () {
                return this._g;
            },
            set: function (value) {
                this._g = value;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Color.prototype, "gFloat", {
            get: function () {
                return this._g / 255.0;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Color.prototype, "b", {
            get: function () {
                return this._b;
            },
            set: function (value) {
                this._b = value;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Color.prototype, "bFloat", {
            get: function () {
                return this._b / 255.0;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Color.prototype, "a", {
            get: function () {
                return this._a;
            },
            set: function (value) {
                this._a = value;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Color.prototype, "aFloat", {
            get: function () {
                return this._a / 255.0;
            },
            enumerable: false,
            configurable: true
        });
        Color.prototype.toArray = function () {
            return [this._r, this._g, this._b, this._a];
        };
        Color.prototype.toFloatArray = function () {
            return [this._r / 255.0, this._g / 255.0, this._b / 255.0, this._a / 255.0];
        };
        Color.prototype.toFloat32Array = function () {
            return new Float32Array(this.toFloatArray());
        };
        Color.black = function () {
            return new Color(0, 0, 0, 255);
        };
        Color.white = function () {
            return new Color(255, 255, 255, 255);
        };
        Color.red = function () {
            return new Color(255, 0, 0, 255);
        };
        Color.green = function () {
            return new Color(0, 255, 0, 255);
        };
        Color.blue = function () {
            return new Color(0, 0, 255, 255);
        };
        return Color;
    }());
    TSE.Color = Color;
})(TSE || (TSE = {}));
var TSE;
(function (TSE) {
    var Material = (function () {
        function Material(name, diffuseTextureName, tint) {
            this._name = name;
            this._diffuseTextureName = diffuseTextureName;
            this._tint = tint;
            if (this._diffuseTextureName !== undefined) {
                this._diffuseTexture = TSE.TextureManager.getTexture(this._diffuseTextureName);
            }
        }
        Object.defineProperty(Material.prototype, "tint", {
            get: function () {
                return this._tint;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Material.prototype, "name", {
            get: function () {
                return this._name;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Material.prototype, "diffuseTexture", {
            get: function () {
                return this._diffuseTexture;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Material.prototype, "diffuseTextureName", {
            get: function () {
                return this._diffuseTextureName;
            },
            set: function (value) {
                if (this._diffuseTextureName !== undefined && this._diffuseTextureName != value) {
                    TSE.TextureManager.releaseTexture(this._diffuseTextureName);
                }
                this._diffuseTextureName = value;
                this._diffuseTexture = TSE.TextureManager.getTexture(this._diffuseTextureName);
            },
            enumerable: false,
            configurable: true
        });
        Material.prototype.destory = function () {
            TSE.TextureManager.releaseTexture(this._name);
            this._diffuseTexture = undefined;
        };
        return Material;
    }());
    TSE.Material = Material;
})(TSE || (TSE = {}));
var TSE;
(function (TSE) {
    var MaterialReferenceNode = (function () {
        function MaterialReferenceNode(material) {
            this.referenceCount = 1;
            this.material = material;
        }
        return MaterialReferenceNode;
    }());
    var MaterialManager = (function () {
        function MaterialManager() {
        }
        MaterialManager.registerMaterial = function (material) {
            if (MaterialManager._materials[material.name] === undefined) {
                MaterialManager._materials[material.name] = new MaterialReferenceNode(material);
            }
        };
        MaterialManager.getMaterial = function (materialName) {
            if (MaterialManager._materials[materialName] === undefined) {
                return null;
            }
            else {
                MaterialManager._materials[materialName].referenceCount++;
                return MaterialManager._materials[materialName].material;
            }
        };
        MaterialManager.releaseMaterial = function (materialName) {
            if (MaterialManager._materials[materialName] === undefined) {
                console.warn("Cannot release a material which has not been registered");
            }
            else {
                MaterialManager._materials[materialName].referenceCount--;
                if (MaterialManager._materials[materialName].referenceCount < 1) {
                    MaterialManager._materials[materialName].material.destory();
                    MaterialManager._materials[materialName].material = null;
                    delete MaterialManager._materials[materialName];
                }
            }
        };
        MaterialManager._materials = {};
        return MaterialManager;
    }());
    TSE.MaterialManager = MaterialManager;
})(TSE || (TSE = {}));
var TSE;
(function (TSE) {
    var LEVEL = 0;
    var BORDER = 0;
    var TEMP_IMAGE_DATA = new Uint8Array([255, 255, 255, 255]);
    var Texture = (function () {
        function Texture(name, width, height) {
            if (width === void 0) { width = 1; }
            if (height === void 0) { height = 1; }
            this._isLoaded = false;
            this._name = name;
            this._width = width;
            this._height = height;
            this._handle = TSE.gl.createTexture();
            this.bind();
            TSE.gl.texImage2D(TSE.gl.TEXTURE_2D, LEVEL, TSE.gl.RGBA, 1, 1, BORDER, TSE.gl.RGBA, TSE.gl.UNSIGNED_BYTE, TEMP_IMAGE_DATA);
            var asset = TSE.AssetManager.getAsset(this.name);
            if (asset !== undefined) {
                this.loadTextureFromAsset(asset);
            }
            else {
                TSE.Message.subscribe(TSE.MESSAGE_ASSET_LOADED_ASSET_LOADED + this._name, this);
            }
        }
        Texture.prototype.onMessage = function (message) {
            if (message.code === TSE.MESSAGE_ASSET_LOADED_ASSET_LOADED + this._name) {
                this.loadTextureFromAsset(message.context);
            }
        };
        Object.defineProperty(Texture.prototype, "name", {
            get: function () {
                return this._name;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Texture.prototype, "width", {
            get: function () {
                return this._width;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Texture.prototype, "height", {
            get: function () {
                return this._height;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Texture.prototype, "isLoaded", {
            get: function () {
                return this._isLoaded;
            },
            enumerable: false,
            configurable: true
        });
        Texture.prototype.bind = function () {
            TSE.gl.bindTexture(TSE.gl.TEXTURE_2D, this._handle);
        };
        Texture.prototype.unbind = function () {
            TSE.gl.bindTexture(TSE.gl.TEXTURE_2D, null);
        };
        Texture.prototype.activateAndBind = function (textureUnit) {
            if (textureUnit === void 0) { textureUnit = 0; }
            TSE.gl.activeTexture(TSE.gl.TEXTURE0 + textureUnit);
            this.bind();
        };
        Texture.prototype.loadTextureFromAsset = function (asset) {
            this._width = asset.width;
            this._height = asset.height;
            this.bind();
            TSE.gl.texImage2D(TSE.gl.TEXTURE_2D, LEVEL, TSE.gl.RGBA, TSE.gl.RGBA, TSE.gl.UNSIGNED_BYTE, asset.data);
            if (this.isPowerOf2()) {
                TSE.gl.generateMipmap(TSE.gl.TEXTURE_2D);
            }
            else {
                TSE.gl.texParameteri(TSE.gl.TEXTURE_2D, TSE.gl.TEXTURE_WRAP_S, TSE.gl.CLAMP_TO_EDGE);
                TSE.gl.texParameteri(TSE.gl.TEXTURE_2D, TSE.gl.TEXTURE_WRAP_T, TSE.gl.CLAMP_TO_EDGE);
            }
            TSE.gl.texParameteri(TSE.gl.TEXTURE_2D, TSE.gl.TEXTURE_MIN_FILTER, TSE.gl.NEAREST);
            TSE.gl.texParameteri(TSE.gl.TEXTURE_2D, TSE.gl.TEXTURE_MAG_FILTER, TSE.gl.NEAREST);
            this._isLoaded = true;
        };
        Texture.prototype.isPowerOf2 = function () {
            return this.isValuePowerOf2(this._width) && this.isValuePowerOf2(this._height);
        };
        Texture.prototype.isValuePowerOf2 = function (value) {
            return (value & (value - 1)) === 0;
        };
        Texture.prototype.destory = function () {
            TSE.gl.deleteTexture(this._handle);
        };
        return Texture;
    }());
    TSE.Texture = Texture;
})(TSE || (TSE = {}));
var TSE;
(function (TSE) {
    var TextureReference = (function () {
        function TextureReference(texture) {
            this.referenceCount = 1;
            this.texture = texture;
        }
        return TextureReference;
    }());
    var TextureManager = (function () {
        function TextureManager() {
        }
        TextureManager.getTexture = function (textureName) {
            if (TextureManager._textures[textureName] === undefined) {
                var texture = new TSE.Texture(textureName);
                TextureManager._textures[textureName] = new TextureReference(texture);
            }
            else {
                TextureManager._textures[textureName].referenceCount++;
            }
            return TextureManager._textures[textureName].texture;
        };
        TextureManager.releaseTexture = function (textureName) {
            if (TextureManager._textures[textureName] === undefined) {
                console.warn("A texture named " + textureName + " does not exist and therefore cannot be released.");
            }
            else {
                TextureManager._textures[textureName].referenceCount--;
                if (TextureManager._textures[textureName].referenceCount < 1) {
                    TextureManager._textures[textureName].texture.destory();
                    TextureManager._textures[textureName] = null;
                    delete TextureManager._textures[textureName];
                }
            }
        };
        TextureManager._textures = {};
        return TextureManager;
    }());
    TSE.TextureManager = TextureManager;
})(TSE || (TSE = {}));
var TSE;
(function (TSE) {
    var Vertex = (function () {
        function Vertex(x, y, z, tu, tv) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            if (z === void 0) { z = 0; }
            if (tu === void 0) { tu = 0; }
            if (tv === void 0) { tv = 0; }
            this.position = TSE.Vector3.zero;
            this.texCoords = TSE.Vector2.zero;
            this.position.x = x;
            this.position.y = y;
            this.position.z = z;
            this.texCoords.x = tu;
            this.texCoords.y = tv;
        }
        Vertex.prototype.toArray = function () {
            var array = [];
            array = array.concat(this.position.toArray());
            array = array.concat(this.texCoords.toArray());
            return array;
        };
        Vertex.prototype.toFloat32Array = function () {
            return new Float32Array(this.toArray());
        };
        return Vertex;
    }());
    TSE.Vertex = Vertex;
})(TSE || (TSE = {}));
var TSE;
(function (TSE) {
    var Circle = (function () {
        function Circle() {
            this.position = TSE.Vector2.zero;
        }
        Circle.prototype.setFromJson = function (json) {
            if (json.position) {
                this.setFromJson(json.position);
            }
        };
        Circle.prototype.intersects = function (other) {
            if (other instanceof Circle) {
                var distance = Math.abs(TSE.Vector2.distance(other.position, this.position));
                var radiusLengths = this.radius + other.radius;
                if (distance <= radiusLengths) {
                    return true;
                }
            }
            return false;
        };
        Circle.prototype.pointInShape = function (point) {
            var absDistance = Math.abs(TSE.Vector2.distance(this.position, point));
            if (absDistance < this.radius) {
                return true;
            }
            return false;
        };
        return Circle;
    }());
    TSE.Circle = Circle;
})(TSE || (TSE = {}));
var TSE;
(function (TSE) {
    var Rectangle = (function () {
        function Rectangle() {
            this.position = TSE.Vector2.zero;
        }
        Rectangle.prototype.setFromJson = function (json) {
            if (json.position) {
                this.setFromJson(json.position);
            }
            if (json.width) {
                this.width = +json.width;
            }
            if (json.height) {
                this.height = +json.height;
            }
        };
        Rectangle.prototype.intersects = function (other) {
            if (other instanceof Rectangle) {
                if (this.pointInShape(other.position) ||
                    this.pointInShape(new TSE.Vector2(other.position.x + other.width, other.position.y)) ||
                    this.pointInShape(new TSE.Vector2(other.position.x + other.width, other.position.y + other.height)) ||
                    this.pointInShape(new TSE.Vector2(other.position.x, other.position.y + other.height))) {
                    return true;
                }
            }
            if (other instanceof TSE.Circle) {
                if (other.pointInShape(this.position) ||
                    other.pointInShape(new TSE.Vector2(this.position.x + this.width, this.position.y)) ||
                    other.pointInShape(new TSE.Vector2(this.position.x + this.width, this.position.y + this.height)) ||
                    other.pointInShape(new TSE.Vector2(this.position.x, this.position.y + this.height))) {
                    return true;
                }
            }
            return false;
        };
        Rectangle.prototype.pointInShape = function (point) {
            if (point.x >= this.position.x && point.x <= this.position.x + this.width) {
                if (point.y >= this.position.y && point.y <= this.position.y + this.height) {
                    return true;
                }
            }
            return false;
        };
        return Rectangle;
    }());
    TSE.Rectangle = Rectangle;
})(TSE || (TSE = {}));
var TSE;
(function (TSE) {
    var Keys;
    (function (Keys) {
        Keys[Keys["LEFT"] = 37] = "LEFT";
        Keys[Keys["UP"] = 38] = "UP";
        Keys[Keys["RIGHT"] = 39] = "RIGHT";
        Keys[Keys["DOWN"] = 40] = "DOWN";
    })(Keys = TSE.Keys || (TSE.Keys = {}));
    var MouseContent = (function () {
        function MouseContent(leftDown, rightDown, position) {
            this.leftDown = leftDown;
            this.rightDown = rightDown;
            this.position = position;
        }
        return MouseContent;
    }());
    TSE.MouseContent = MouseContent;
    var InputManager = (function () {
        function InputManager() {
        }
        InputManager.initialize = function () {
            for (var i = 0; i < 255; i++) {
                InputManager._key[i] = false;
            }
            window.addEventListener("keydown", InputManager.onKeyDown);
            window.addEventListener("keyup", InputManager.onKeyUp);
            window.addEventListener("mousemove", InputManager.onMouseMove);
            window.addEventListener("mousedown", InputManager.onMouseDown);
            window.addEventListener("mouseup", InputManager.onMouseUp);
        };
        InputManager.isKeyDown = function (key) {
            return InputManager._key[key];
        };
        InputManager.onKeyDown = function (event) {
            InputManager._key[event.keyCode] = true;
            event.preventDefault();
            event.stopPropagation();
            return false;
        };
        InputManager.onKeyUp = function (event) {
            InputManager._key[event.keyCode] = false;
            return true;
        };
        InputManager.getMousePosition = function () {
            return new TSE.Vector2(this._mouseX, this._mouseY);
        };
        InputManager.onMouseMove = function (event) {
            InputManager._previousMouseX = InputManager._mouseX;
            InputManager._previousMouseY = InputManager._mouseY;
            InputManager._mouseX = event.clientX;
            InputManager._mouseY = event.clientY;
        };
        InputManager.onMouseDown = function (event) {
            if (event.button == 0) {
                this._leftDown = true;
            }
            else if (event.button == 2) {
                this._rightDown = true;
            }
            TSE.Message.send("MOUSE_DOWN", this, new MouseContent(InputManager._leftDown, InputManager._rightDown, InputManager.getMousePosition()));
        };
        InputManager.onMouseUp = function (event) {
            if (event.button == 0) {
                this._leftDown = false;
            }
            else if (event.button == 2) {
                this._rightDown = false;
            }
            TSE.Message.send("MOUSE_UP", this, new MouseContent(InputManager._leftDown, InputManager._rightDown, InputManager.getMousePosition()));
        };
        InputManager._key = [];
        InputManager._leftDown = false;
        InputManager._rightDown = false;
        return InputManager;
    }());
    TSE.InputManager = InputManager;
})(TSE || (TSE = {}));
var TSE;
(function (TSE) {
    var Martix4 = (function () {
        function Martix4() {
            this._data = [];
            this._data = [
                1, 0, 0, 0,
                0, 1, 0, 0,
                0, 0, 1, 0,
                0, 0, 0, 1
            ];
        }
        Object.defineProperty(Martix4.prototype, "data", {
            get: function () {
                return this._data;
            },
            enumerable: false,
            configurable: true
        });
        Martix4.identity = function () {
            return new Martix4();
        };
        Martix4.orthographic = function (left, right, bottom, top, nearClip, farCLip) {
            var m = new Martix4();
            var lr = 1.0 / (left - right);
            var bt = 1.0 / (bottom - top);
            var nf = 1.0 / (nearClip - farCLip);
            m._data[0] = -2.0 * lr;
            m._data[5] = -2.0 * bt;
            m._data[10] = 2.0 * nf;
            m._data[12] = (left + right) * lr;
            m._data[13] = (top + bottom) * bt;
            m._data[14] = (farCLip + nearClip) * nf;
            return m;
        };
        Martix4.translation = function (position) {
            var m = new Martix4();
            m._data[12] = position.x;
            m._data[13] = position.y;
            m._data[14] = position.z;
            return m;
        };
        Martix4.rotationX = function (angleInRadians) {
            var m = new Martix4();
            var c = Math.cos(angleInRadians);
            var s = Math.sin(angleInRadians);
            m._data[5] = c;
            m._data[6] = s;
            m._data[9] = -s;
            m._data[10] = c;
            return m;
        };
        Martix4.rotationY = function (angleInRadians) {
            var m = new Martix4();
            var c = Math.cos(angleInRadians);
            var s = Math.sin(angleInRadians);
            m._data[0] = c;
            m._data[2] = -s;
            m._data[8] = s;
            m._data[10] = c;
            return m;
        };
        Martix4.rotationZ = function (angleInRadians) {
            var m = new Martix4();
            var c = Math.cos(angleInRadians);
            var s = Math.sin(angleInRadians);
            m._data[0] = c;
            m._data[1] = s;
            m._data[4] = -s;
            m._data[5] = c;
            return m;
        };
        Martix4.rotationXYZ = function (xRadians, yRadians, zRadians) {
            var rx = Martix4.rotationX(xRadians);
            var ry = Martix4.rotationY(yRadians);
            var rz = Martix4.rotationZ(zRadians);
            return Martix4.multiply(Martix4.multiply(rz, ry), rx);
        };
        Martix4.multiply = function (a, b) {
            var m = new Martix4();
            var b00 = b._data[0 * 4 + 0];
            var b01 = b._data[0 * 4 + 1];
            var b02 = b._data[0 * 4 + 2];
            var b03 = b._data[0 * 4 + 3];
            var b10 = b._data[1 * 4 + 0];
            var b11 = b._data[1 * 4 + 1];
            var b12 = b._data[1 * 4 + 2];
            var b13 = b._data[1 * 4 + 3];
            var b20 = b._data[2 * 4 + 0];
            var b21 = b._data[2 * 4 + 1];
            var b22 = b._data[2 * 4 + 2];
            var b23 = b._data[2 * 4 + 3];
            var b30 = b._data[3 * 4 + 0];
            var b31 = b._data[3 * 4 + 1];
            var b32 = b._data[3 * 4 + 2];
            var b33 = b._data[3 * 4 + 3];
            var a00 = a._data[0 * 4 + 0];
            var a01 = a._data[0 * 4 + 1];
            var a02 = a._data[0 * 4 + 2];
            var a03 = a._data[0 * 4 + 3];
            var a10 = a._data[1 * 4 + 0];
            var a11 = a._data[1 * 4 + 1];
            var a12 = a._data[1 * 4 + 2];
            var a13 = a._data[1 * 4 + 3];
            var a20 = a._data[2 * 4 + 0];
            var a21 = a._data[2 * 4 + 1];
            var a22 = a._data[2 * 4 + 2];
            var a23 = a._data[2 * 4 + 3];
            var a30 = a._data[3 * 4 + 0];
            var a31 = a._data[3 * 4 + 1];
            var a32 = a._data[3 * 4 + 2];
            var a33 = a._data[3 * 4 + 3];
            m._data[0] = b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30;
            m._data[1] = b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31;
            m._data[2] = b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32;
            m._data[3] = b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33;
            m._data[4] = b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30;
            m._data[5] = b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31;
            m._data[6] = b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32;
            m._data[7] = b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33;
            m._data[8] = b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30;
            m._data[9] = b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31;
            m._data[10] = b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32;
            m._data[11] = b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33;
            m._data[12] = b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30;
            m._data[13] = b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31;
            m._data[14] = b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32;
            m._data[15] = b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33;
            return m;
        };
        Martix4.prototype.toFloat32Array = function () {
            return new Float32Array(this._data);
        };
        Martix4.scale = function (scale) {
            var m = new Martix4();
            m.data[0] = scale.x;
            m.data[5] = scale.y;
            m.data[10] = scale.z;
            return m;
        };
        Martix4.prototype.copyFrom = function (m) {
            for (var i = 0; i < 16; i++) {
                this._data[i] = m._data[i];
            }
        };
        return Martix4;
    }());
    TSE.Martix4 = Martix4;
})(TSE || (TSE = {}));
var TSE;
(function (TSE) {
    var Transform = (function () {
        function Transform() {
            this.position = TSE.Vector3.zero;
            this.rotation = TSE.Vector3.zero;
            this.scale = TSE.Vector3.one;
        }
        Transform.prototype.copyFrom = function (transform) {
            this.position.copyFrom(transform.position);
            this.rotation.copyFrom(transform.rotation);
            this.scale.copyFrom(transform.scale);
        };
        Transform.prototype.getTransformationMatrix = function () {
            var translation = TSE.Martix4.translation(this.position);
            var rotation = TSE.Martix4.rotationXYZ(this.rotation.x, this.rotation.y, this.rotation.z);
            var scale = TSE.Martix4.scale(this.scale);
            return TSE.Martix4.multiply(TSE.Martix4.multiply(translation, rotation), scale);
        };
        Transform.prototype.setFromJson = function (json) {
            var position = json.position, scale = json.scale, rotation = json.rotation;
            if (position !== undefined) {
                this.position.setFromJson(position);
            }
            if (scale !== undefined) {
                this.scale.setFromJson(scale);
            }
            if (rotation !== undefined) {
                this.rotation.setFromJson(rotation);
            }
        };
        return Transform;
    }());
    TSE.Transform = Transform;
})(TSE || (TSE = {}));
var TSE;
(function (TSE) {
    var Vector2 = (function () {
        function Vector2(x, y) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            this._x = x;
            this._y = y;
        }
        Object.defineProperty(Vector2.prototype, "x", {
            get: function () {
                return this._x;
            },
            set: function (value) {
                this._x = value;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Vector2.prototype, "y", {
            get: function () {
                return this._y;
            },
            set: function (value) {
                this._y = value;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Vector2, "zero", {
            get: function () {
                return new Vector2();
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Vector2, "one", {
            get: function () {
                return new Vector2(1, 1);
            },
            enumerable: false,
            configurable: true
        });
        Vector2.prototype.copyFrom = function (vector2) {
            this._x = vector2.x;
            this._y = vector2.y;
        };
        Vector2.prototype.toArray = function () {
            return [this._x, this._y];
        };
        Vector2.prototype.toFloat32Array = function () {
            return new Float32Array(this.toArray());
        };
        Vector2.prototype.set = function (x, y) {
            if (x) {
                this._x = x;
            }
            if (y) {
                this._y = y;
            }
        };
        Vector2.prototype.add = function (v) {
            var x = v.x, y = v.y;
            this.x += x;
            this.y += y;
            return this;
        };
        Vector2.prototype.subtract = function (v) {
            this._x -= v._x;
            this._y -= v._y;
            return this;
        };
        Vector2.prototype.multiply = function (v) {
            this._x *= v._x;
            this._y *= v._y;
            return this;
        };
        Vector2.prototype.divide = function (v) {
            this._x /= v._x;
            this._y /= v._y;
            return this;
        };
        Vector2.distance = function (a, b) {
            var diff = a.subtract(b);
            return Math.sqrt(diff.x * diff.x + diff.y * diff.y);
        };
        return Vector2;
    }());
    TSE.Vector2 = Vector2;
})(TSE || (TSE = {}));
var TSE;
(function (TSE) {
    var Vector3 = (function () {
        function Vector3(x, y, z) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            if (z === void 0) { z = 0; }
            this._x = x;
            this._y = y;
            this._z = z;
        }
        Object.defineProperty(Vector3.prototype, "x", {
            get: function () {
                return this._x;
            },
            set: function (value) {
                this._x = value;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Vector3.prototype, "y", {
            get: function () {
                return this._y;
            },
            set: function (value) {
                this._y = value;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Vector3.prototype, "z", {
            get: function () {
                return this._z;
            },
            set: function (value) {
                this._z = value;
            },
            enumerable: false,
            configurable: true
        });
        Vector3.prototype.equals = function (v) {
            return this.x == v.x && this.y == v.y && this.z == v.z;
        };
        Vector3.prototype.toArray = function () {
            return [this._x, this._y, this._z];
        };
        Vector3.prototype.toFloat32Array = function () {
            return new Float32Array(this.toArray());
        };
        Object.defineProperty(Vector3, "zero", {
            get: function () {
                return new Vector3();
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Vector3, "one", {
            get: function () {
                return new Vector3(1, 1, 1);
            },
            enumerable: false,
            configurable: true
        });
        Vector3.prototype.set = function (x, y, z) {
            if (x) {
                this._x = x;
            }
            if (y) {
                this._y = y;
            }
            if (z) {
                this._z = z;
            }
        };
        Vector3.prototype.copyFrom = function (vector3) {
            this._x = vector3.x;
            this._y = vector3.y;
            this._z = vector3.z;
        };
        Vector3.prototype.setFromJson = function (json) {
            var x = json.x, y = json.y, z = json.z;
            this._x = +x || 0;
            this._y = +y || 0;
            this._z = +z || 0;
        };
        Vector3.prototype.add = function (v) {
            var x = v.x, y = v.y, z = v.z;
            this.x += x;
            this.y += y;
            this.z += z;
            return this;
        };
        Vector3.prototype.subtract = function (v) {
            this._x -= v._x;
            this._y -= v._y;
            this._z -= v._z;
            return this;
        };
        Vector3.prototype.multiply = function (v) {
            this._x *= v._x;
            this._y *= v._y;
            this._z *= v._z;
            return this;
        };
        Vector3.prototype.divide = function (v) {
            this._x /= v._x;
            this._y /= v._y;
            this._z /= v._z;
            return this;
        };
        Vector3.distance = function (a, b) {
            var diff = a.subtract(b);
            return Math.sqrt(diff.x * diff.x + diff.y * diff.y + diff.z * diff.z);
        };
        return Vector3;
    }());
    TSE.Vector3 = Vector3;
})(TSE || (TSE = {}));
var TSE;
(function (TSE) {
    var MessagePriority;
    (function (MessagePriority) {
        MessagePriority[MessagePriority["NORMAL"] = 0] = "NORMAL";
        MessagePriority[MessagePriority["HIGH"] = 1] = "HIGH";
    })(MessagePriority = TSE.MessagePriority || (TSE.MessagePriority = {}));
    var Message = (function () {
        function Message(code, sender, context, priority) {
            if (priority === void 0) { priority = MessagePriority.NORMAL; }
            this.code = code;
            this.sender = sender;
            this.context = context;
            this.priority = priority;
        }
        Message.send = function (code, sender, context) {
            TSE.MessageBus.post(new Message(code, sender, context, MessagePriority.NORMAL));
        };
        Message.sendPriorty = function (code, sender, context) {
            TSE.MessageBus.post(new Message(code, sender, context, MessagePriority.HIGH));
        };
        Message.subscribe = function (code, handler) {
            TSE.MessageBus.addSubscription(code, handler);
        };
        Message.unsubscribe = function (code, handler) {
            TSE.MessageBus.removeSubscription(code, handler);
        };
        return Message;
    }());
    TSE.Message = Message;
})(TSE || (TSE = {}));
var TSE;
(function (TSE) {
    var MessageBus = (function () {
        function MessageBus() {
        }
        MessageBus.addSubscription = function (code, handler) {
            if (MessageBus._subscriptions[code] === undefined) {
                MessageBus._subscriptions[code] = [];
            }
            if (MessageBus._subscriptions[code].indexOf(handler) !== -1) {
                console.warn("Attempting to add a duplicate handler to code: " + code + ".Subscription not added.");
            }
            else {
                MessageBus._subscriptions[code].push(handler);
            }
        };
        MessageBus.removeSubscription = function (code, handler) {
            if (MessageBus._subscriptions[code] === undefined) {
                console.warn("Cannot unsubscribe handler form code: " + code + ".Because that code is not subscribed to.");
                return;
            }
            var nodeIndex = MessageBus._subscriptions[code].indexOf(handler);
            if (nodeIndex !== -1) {
                MessageBus._subscriptions[code].splice(nodeIndex, 1);
            }
        };
        MessageBus.post = function (message) {
            console.log("Message posted:", message);
            var handlers = MessageBus._subscriptions[message.code];
            if (handlers === undefined) {
                return;
            }
            for (var _i = 0, handlers_1 = handlers; _i < handlers_1.length; _i++) {
                var h = handlers_1[_i];
                if (message.priority === TSE.MessagePriority.HIGH) {
                    h.onMessage(message);
                }
                else {
                    MessageBus._normalMessageQueue.push(new TSE.MessageSubscriptionNode(message, h));
                }
            }
        };
        MessageBus.update = function (time) {
            if (MessageBus._normalMessageQueue.length === 0) {
                return;
            }
            var messageLimit = Math.min(MessageBus._normalQueueMessagePerUpdate, MessageBus._normalMessageQueue.length);
            for (var i = 0; i < messageLimit; i++) {
                var node = MessageBus._normalMessageQueue.pop();
                node.handler.onMessage(node.message);
            }
        };
        MessageBus._subscriptions = {};
        MessageBus._normalQueueMessagePerUpdate = 10;
        MessageBus._normalMessageQueue = [];
        return MessageBus;
    }());
    TSE.MessageBus = MessageBus;
})(TSE || (TSE = {}));
var TSE;
(function (TSE) {
    var MessageSubscriptionNode = (function () {
        function MessageSubscriptionNode(message, handler) {
            this.message = message;
            this.handler = handler;
        }
        return MessageSubscriptionNode;
    }());
    TSE.MessageSubscriptionNode = MessageSubscriptionNode;
})(TSE || (TSE = {}));
var TSE;
(function (TSE) {
    var Scene = (function () {
        function Scene() {
            this._root = new TSE.SimObject(0, "__ROOT__", this);
        }
        Object.defineProperty(Scene.prototype, "root", {
            get: function () {
                return this._root;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Scene.prototype, "isLoaded", {
            get: function () {
                return this._root.isLoaded;
            },
            enumerable: false,
            configurable: true
        });
        Scene.prototype.addObject = function (object) {
            this._root.addChild(object);
        };
        Scene.prototype.getObject = function (name) {
            return this._root.getObjectByName(name);
        };
        Scene.prototype.load = function () {
            this._root.load();
        };
        Scene.prototype.update = function (time) {
            this._root.update(time);
        };
        Scene.prototype.render = function (shader) {
            this._root.render(shader);
        };
        return Scene;
    }());
    TSE.Scene = Scene;
})(TSE || (TSE = {}));
var TSE;
(function (TSE) {
    var SimObject = (function () {
        function SimObject(id, name, scene) {
            this._children = [];
            this._isLoaded = false;
            this._components = [];
            this._behaviors = [];
            this._localMatrix = TSE.Martix4.identity();
            this._worldMatrix = TSE.Martix4.identity();
            this.transform = new TSE.Transform();
            this._id = id;
            this.name = name;
            this._scene = scene;
        }
        Object.defineProperty(SimObject.prototype, "id", {
            get: function () {
                return this._id;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(SimObject.prototype, "parent", {
            get: function () {
                return this._parent;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(SimObject.prototype, "worldMatrix", {
            get: function () {
                return this._worldMatrix;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(SimObject.prototype, "isLoaded", {
            get: function () {
                return this._isLoaded;
            },
            enumerable: false,
            configurable: true
        });
        SimObject.prototype.addChild = function (child) {
            child._parent = this;
            this._children.push(child);
            child.onAdded(this._scene);
        };
        SimObject.prototype.removeChild = function (child) {
            var index = this._children.indexOf(child);
            if (index !== -1) {
                child._parent = null;
                this._children.splice(index, 1);
            }
        };
        SimObject.prototype.getObjectByName = function (name) {
            if (this.name === name) {
                return this;
            }
            for (var _i = 0, _a = this._children; _i < _a.length; _i++) {
                var child = _a[_i];
                var result = child.getObjectByName(name);
                if (result !== undefined) {
                    return result;
                }
            }
            return null;
        };
        SimObject.prototype.addComponent = function (component) {
            this._components.push(component);
            component.setOwner(this);
        };
        SimObject.prototype.addBehavior = function (behaviors) {
            this._behaviors.push(behaviors);
            behaviors.setOwner(this);
        };
        SimObject.prototype.load = function () {
            this._isLoaded = true;
            for (var _i = 0, _a = this._children; _i < _a.length; _i++) {
                var child = _a[_i];
                child.load();
            }
            for (var _b = 0, _c = this._components; _b < _c.length; _b++) {
                var component = _c[_b];
                component.load();
            }
        };
        SimObject.prototype.update = function (time) {
            this._localMatrix = this.transform.getTransformationMatrix();
            this.updateWorldMatrix((this.parent !== undefined) ? this._parent.worldMatrix : undefined);
            for (var _i = 0, _a = this._children; _i < _a.length; _i++) {
                var child = _a[_i];
                child.update(time);
            }
            for (var _b = 0, _c = this._components; _b < _c.length; _b++) {
                var component = _c[_b];
                component.update(time);
            }
            for (var _d = 0, _e = this._behaviors; _d < _e.length; _d++) {
                var behavior = _e[_d];
                behavior.update(time);
            }
        };
        SimObject.prototype.render = function (shader) {
            for (var _i = 0, _a = this._children; _i < _a.length; _i++) {
                var child = _a[_i];
                child.render(shader);
            }
            for (var _b = 0, _c = this._components; _b < _c.length; _b++) {
                var component = _c[_b];
                component.render(shader);
            }
        };
        SimObject.prototype.onAdded = function (scene) {
            this._scene = scene;
        };
        SimObject.prototype.updateWorldMatrix = function (parentWorldMatrix) {
            if (parentWorldMatrix !== undefined) {
                this._worldMatrix = TSE.Martix4.multiply(parentWorldMatrix, this._localMatrix);
            }
            else {
                this._worldMatrix.copyFrom(this._localMatrix);
            }
        };
        return SimObject;
    }());
    TSE.SimObject = SimObject;
})(TSE || (TSE = {}));
var TSE;
(function (TSE) {
    var ZoneState;
    (function (ZoneState) {
        ZoneState[ZoneState["UNINITALIZED"] = 0] = "UNINITALIZED";
        ZoneState[ZoneState["LOADING"] = 1] = "LOADING";
        ZoneState[ZoneState["UPDATEING"] = 2] = "UPDATEING";
    })(ZoneState = TSE.ZoneState || (TSE.ZoneState = {}));
    var Zone = (function () {
        function Zone(id, name, description) {
            this._globalId = -1;
            this._state = ZoneState.UNINITALIZED;
            this._id = id;
            this._name = name;
            this._description = description;
            this._scene = new TSE.Scene();
        }
        Object.defineProperty(Zone.prototype, "id", {
            get: function () {
                return this._id;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Zone.prototype, "name", {
            get: function () {
                return this._name;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Zone.prototype, "description", {
            get: function () {
                return this._description;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Zone.prototype, "scene", {
            get: function () {
                return this._scene;
            },
            enumerable: false,
            configurable: true
        });
        Zone.prototype.initialize = function (zoneData) {
            if (zoneData.objects === undefined) {
                throw new Error("Zone initialization error:objects not present.");
            }
            for (var object in zoneData.objects) {
                var obj = zoneData.objects[object];
                this.loadSimObject(obj, this._scene.root);
            }
        };
        Zone.prototype.load = function () {
            this._state = ZoneState.LOADING;
            this.scene.load();
            this._state = ZoneState.UPDATEING;
        };
        Zone.prototype.unload = function () {
        };
        Zone.prototype.update = function (time) {
            if (this._state === ZoneState.UPDATEING) {
                this._scene.update(time);
            }
        };
        Zone.prototype.render = function (shader) {
            if (this._state === ZoneState.UPDATEING) {
                this._scene.render(shader);
            }
        };
        Zone.prototype.onActivated = function () {
        };
        Zone.prototype.onDeactivated = function () {
        };
        Zone.prototype.loadSimObject = function (dataSection, parent) {
            var name;
            if (dataSection.name !== undefined) {
                name = dataSection.name;
            }
            this._globalId++;
            var simObjet = new TSE.SimObject(this._globalId, name, this._scene);
            if (dataSection.transform !== undefined) {
                simObjet.transform.setFromJson(dataSection.transform);
            }
            if (dataSection.components !== undefined) {
                for (var _i = 0, _a = dataSection.components; _i < _a.length; _i++) {
                    var element = _a[_i];
                    var component = TSE.ComponentManager.extractComponent(element);
                    simObjet.addComponent(component);
                }
            }
            if (dataSection.behaviors !== undefined) {
                for (var _b = 0, _c = dataSection.behaviors; _b < _c.length; _b++) {
                    var element = _c[_b];
                    var behavior = TSE.BehaviorManager.extractBehavior(element);
                    simObjet.addBehavior(behavior);
                }
            }
            if (dataSection.children !== undefined) {
                for (var _d = 0, _e = dataSection.children; _d < _e.length; _d++) {
                    var object = _e[_d];
                    this.loadSimObject(object, simObjet);
                }
            }
            if (parent !== undefined) {
                parent.addChild(simObjet);
            }
        };
        return Zone;
    }());
    TSE.Zone = Zone;
})(TSE || (TSE = {}));
var TSE;
(function (TSE) {
    var ZoneManager = (function () {
        function ZoneManager() {
        }
        ZoneManager.prototype.onMessage = function (message) {
            if (message.code.indexOf(TSE.MESSAGE_ASSET_LOADED_ASSET_LOADED) != -1) {
                var asset = message.context;
                ZoneManager.loadZone(asset);
            }
        };
        ZoneManager.initialize = function () {
            ZoneManager._inst = new ZoneManager();
            ZoneManager._registeredZones[0] = "./assets/zones/testZone.json";
        };
        ZoneManager.changeZone = function (id) {
            if (ZoneManager._activeZone !== undefined) {
                ZoneManager._activeZone.onDeactivated();
                ZoneManager._activeZone.unload();
                ZoneManager._activeZone = undefined;
            }
            if (ZoneManager._registeredZones[id] !== undefined) {
                if (TSE.AssetManager.isAssetLoaded(ZoneManager._registeredZones[id])) {
                    var asset = TSE.AssetManager.getAsset(ZoneManager._registeredZones[id]);
                    this.loadZone(asset);
                }
                else {
                    TSE.Message.subscribe(TSE.MESSAGE_ASSET_LOADED_ASSET_LOADED + ZoneManager._registeredZones[id], ZoneManager._inst);
                    TSE.AssetManager.loadAsset(ZoneManager._registeredZones[id]);
                }
            }
            else {
                throw new Error("Zone id:" + id.toString() + " does not exist.");
            }
        };
        ZoneManager.loadZone = function (asset) {
            var zoneData = asset.data;
            var zoneId;
            if (zoneData.id == undefined) {
                throw new Error("zone id no present");
            }
            else {
                zoneId = +zoneData.id;
            }
            var zoneName = zoneData.name;
            var zoneDescription = zoneData.description;
            ZoneManager._activeZone = new TSE.Zone(zoneId, zoneName, zoneDescription);
            ZoneManager._activeZone.initialize(zoneData);
            ZoneManager._activeZone.onActivated();
            ZoneManager._activeZone.load();
        };
        ZoneManager.update = function (time) {
            if (ZoneManager._activeZone !== undefined) {
                ZoneManager._activeZone.update(time);
            }
        };
        ZoneManager.render = function (shader) {
            if (ZoneManager._activeZone !== undefined) {
                ZoneManager._activeZone.render(shader);
            }
        };
        ZoneManager._globalZoneID = -1;
        ZoneManager._registeredZones = {};
        return ZoneManager;
    }());
    TSE.ZoneManager = ZoneManager;
})(TSE || (TSE = {}));
