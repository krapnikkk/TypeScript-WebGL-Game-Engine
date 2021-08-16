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
        }
        Engine.prototype.start = function () {
            this._canvas = TSE.GLUtilities.initialize();
            TSE.AssetManager.initialize();
            TSE.gl.clearColor(0, 0, 0, 1);
            this.loadShaders();
            this._shader.use();
            this._projection = TSE.Martix4.orthographic(0, this._canvas.width, 0, this._canvas.height, -100.0, 100.0);
            this._sprite = new TSE.Sprite("test", "./assets/texture/sky.jpeg");
            this._sprite.load();
            this._sprite.position.x = 200;
            this.resize();
            this.loop();
        };
        Engine.prototype.resize = function () {
            if (this._canvas !== undefined) {
                this._canvas.width = window.innerWidth;
                this._canvas.height = window.innerHeight;
                TSE.gl.viewport(-1, 1, 1, -1);
            }
        };
        Engine.prototype.loop = function () {
            TSE.MessageBus.update(0);
            TSE.gl.clear(TSE.gl.COLOR_BUFFER_BIT);
            var colorPosition = this._shader.getUniformLocation("u_tint");
            TSE.gl.uniform4f(colorPosition, 1, 1, 1, 1);
            var projectionPosition = this._shader.getUniformLocation("u_projection");
            TSE.gl.uniformMatrix4fv(projectionPosition, false, new Float32Array(this._projection.data));
            var modelPosition = this._shader.getUniformLocation("u_model");
            TSE.gl.uniformMatrix4fv(modelPosition, false, new Float32Array(TSE.Martix4.tranlstion(this._sprite.position).data));
            this._sprite.draw(this._shader);
            requestAnimationFrame(this.loop.bind(this));
        };
        Engine.prototype.loadShaders = function () {
            var vertexShaderSource = "\n                attribute vec3 a_position;\n                attribute vec2 a_texCoord;\n                uniform mat4 u_projection;\n                uniform mat4 u_model;\n                varying vec2 v_texCoord;\n                void main(){\n                    v_texCoord = a_texCoord;\n                    gl_Position = u_projection * u_model * vec4(a_position,1.0);\n                }\n             ";
            var fragmentShaderSource = "\n                precision mediump float;\n                uniform vec4 u_color;\n                uniform sampler2D u_diffuse;\n                uniform vec4 u_tint;\n                varying vec2 v_texCoord;\n                void main(){\n                    gl_FragColor = u_tint * texture2D(u_diffuse,v_texCoord);\n                }\n             ";
            this._shader = new TSE.Shader("basic", vertexShaderSource, fragmentShaderSource);
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
            TSE.Message.send(TSE.MESSAGE_ASSET_LOADED_ASSET_LOADED + "::" + asset.name, this, asset);
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
        }
        return AttributeInfo;
    }());
    TSE.AttributeInfo = AttributeInfo;
    var GLBuffer = (function () {
        function GLBuffer(elementSize, dataType, targetBufferType, mode) {
            if (dataType === void 0) { dataType = TSE.gl.FLOAT; }
            if (targetBufferType === void 0) { targetBufferType = TSE.gl.ARRAY_BUFFER; }
            if (mode === void 0) { mode = TSE.gl.TRIANGLES; }
            this._hasAttributeLocation = false;
            this._data = [];
            this._attributes = [];
            this._elementSize = elementSize;
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
            this._stride = this._elementSize * this._typeSize;
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
            this._attributes.push(info);
        };
        GLBuffer.prototype.pushBackData = function (data) {
            for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
                var d = data_1[_i];
                this._data.push(d);
            }
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
        function Shader(name, vertexSource, fragmentSource) {
            this._attributes = {};
            this._uniforms = {};
            this._name = name;
            var vertexShader = this.loadShader(vertexSource, TSE.gl.VERTEX_SHADER);
            var fragmentShader = this.loadShader(fragmentSource, TSE.gl.FRAGMENT_SHADER);
            this.createProgram(vertexShader, fragmentShader);
            this.detectAttributes();
            this.detectUniforms();
        }
        Object.defineProperty(Shader.prototype, "name", {
            get: function () {
                return this._name;
            },
            enumerable: false,
            configurable: true
        });
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
                var name_1 = attributeInfo.name;
                this._attributes[name_1] = TSE.gl.getAttribLocation(this._program, name_1);
            }
        };
        Shader.prototype.detectUniforms = function () {
            var attributeCount = TSE.gl.getProgramParameter(this._program, TSE.gl.ACTIVE_UNIFORMS);
            for (var i = 0; i < attributeCount; i++) {
                var uniformInfo = TSE.gl.getActiveUniform(this._program, i);
                if (!uniformInfo) {
                    break;
                }
                var name_2 = uniformInfo.name;
                this._uniforms[name_2] = TSE.gl.getUniformLocation(this._program, name_2);
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
    var Sprite = (function () {
        function Sprite(name, textureName, width, height) {
            if (width === void 0) { width = 100; }
            if (height === void 0) { height = 100; }
            this.position = new TSE.Vector3();
            this._name = name;
            this._width = width;
            this._height = height;
            this._textureName = textureName;
            this._texture = TSE.TextureManager.getTexture(textureName);
        }
        Object.defineProperty(Sprite.prototype, "name", {
            get: function () {
                return this._name;
            },
            enumerable: false,
            configurable: true
        });
        Sprite.prototype.load = function () {
            this._buffer = new TSE.GLBuffer(5);
            var positionAttribute = new TSE.AttributeInfo();
            positionAttribute.location = 0;
            positionAttribute.offset = 0;
            positionAttribute.size = 3;
            this._buffer.addAttributeLocation(positionAttribute);
            var textCoordAttribute = new TSE.AttributeInfo();
            textCoordAttribute.location = 1;
            textCoordAttribute.offset = 3;
            textCoordAttribute.size = 2;
            this._buffer.addAttributeLocation(textCoordAttribute);
            var vertices = [
                0, 0, 0, 0, 0,
                0, this._height, 0, 0, 1.0,
                this._width, this._height, 0, 1.0, 1.0,
                this._width, this._height, 0, 1.0, 1.0,
                this._width, 0, 0, 1.0, 0,
                0, 0, 0, 0, 0
            ];
            this._buffer.pushBackData(vertices);
            this._buffer.upload();
            this._buffer.unbind();
        };
        Sprite.prototype.update = function (time) {
        };
        Sprite.prototype.draw = function (shader) {
            this._texture.activateAndBind(0);
            var diffuseLocation = shader.getUniformLocation("u_diffuse");
            TSE.gl.uniform1i(diffuseLocation, 0);
            this._buffer.bind();
            this._buffer.draw();
        };
        Sprite.prototype.destory = function () {
            this._buffer.destroy();
            TSE.TextureManager.releaseTexture(this._textureName);
        };
        return Sprite;
    }());
    TSE.Sprite = Sprite;
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
            TSE.Message.subscribe(TSE.MESSAGE_ASSET_LOADED_ASSET_LOADED + "::" + this._name, this);
            this.bind();
            TSE.gl.texImage2D(TSE.gl.TEXTURE_2D, LEVEL, TSE.gl.RGBA, 1, 1, BORDER, TSE.gl.RGBA, TSE.gl.UNSIGNED_BYTE, TEMP_IMAGE_DATA);
            var asset = TSE.AssetManager.getAsset(this.name);
            if (asset !== undefined) {
                this.loadTextureFromAsset(asset);
            }
        }
        Texture.prototype.onMessage = function (message) {
            if (message.code === TSE.MESSAGE_ASSET_LOADED_ASSET_LOADED + "::" + this._name) {
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
        };
        Texture.prototype.loadTextureFromAsset = function (asset) {
            this._width = asset.width;
            this._height = asset.height;
            this.bind();
            TSE.gl.pixelStorei(TSE.gl.UNPACK_FLIP_Y_WEBGL, 1);
            TSE.gl.texImage2D(TSE.gl.TEXTURE_2D, LEVEL, TSE.gl.RGBA, TSE.gl.RGBA, TSE.gl.UNSIGNED_BYTE, asset.data);
            if (this.isPowerOf2()) {
                TSE.gl.generateMipmap(TSE.gl.TEXTURE_2D);
            }
            else {
                TSE.gl.texParameteri(TSE.gl.TEXTURE_2D, TSE.gl.TEXTURE_WRAP_S, TSE.gl.CLAMP_TO_EDGE);
                TSE.gl.texParameteri(TSE.gl.TEXTURE_2D, TSE.gl.TEXTURE_WRAP_T, TSE.gl.CLAMP_TO_EDGE);
                TSE.gl.texParameteri(TSE.gl.TEXTURE_2D, TSE.gl.TEXTURE_MIN_FILTER, TSE.gl.LINEAR);
            }
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
        Martix4.tranlstion = function (position) {
            var m = new Martix4();
            m._data[12] = position.x;
            m._data[13] = position.y;
            m._data[14] = position.z;
            return m;
        };
        return Martix4;
    }());
    TSE.Martix4 = Martix4;
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
        Vector2.prototype.toArray = function () {
            return [this._x, this.y];
        };
        Vector2.prototype.toFloat32Array = function () {
            return new Float32Array(this.toArray());
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
        Vector3.prototype.toArray = function () {
            return [this._x, this.y, this.z];
        };
        Vector3.prototype.toFloat32Array = function () {
            return new Float32Array(this.toArray());
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
