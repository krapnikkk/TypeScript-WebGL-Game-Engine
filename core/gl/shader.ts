namespace TSE {
    export abstract class Shader {
        private _name: string;
        private _program: WebGLProgram;
        private _attributes: { [name: string]: number } = {};
        private _uniforms: { [name: string]: WebGLUniformLocation } = {};
        /**
         * 
         * @param name the name of this shader
         * @param vertexSource the source of the vertex shader
         * @param fragmentSource the source of the fragment shader
         */
        public constructor(name: string ) {
            this._name = name;
        }

        public get name(): string {
            return this._name;
        }

        protected load(vertexSource: string, fragmentSource: string){
            let vertexShader = this.loadShader(vertexSource, gl.VERTEX_SHADER);
            let fragmentShader = this.loadShader(fragmentSource, gl.FRAGMENT_SHADER);

            this.createProgram(vertexShader, fragmentShader);

            this.detectAttributes();
            this.detectUniforms();
        }

        private loadShader(source: string, shaderType: number) {
            let shader = gl.createShader(shaderType);
            gl.shaderSource(shader, source);
            gl.compileShader(shader);
            // if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS)){
            let error = gl.getShaderInfoLog(shader);
            if (error !== "") {
                throw new Error("Error compiling shader:" + error);
            }
            // }

            return shader;
        }

        private createProgram(vertexShader: WebGLShader, fragmentShader: WebGLShader): void {
            this._program = gl.createProgram();

            gl.attachShader(this._program, vertexShader);
            gl.attachShader(this._program, fragmentShader);

            gl.linkProgram(this._program);
            // if (!gl.getProgramParameter(this._program, gl.LINK_STATUS)) {
            let error = gl.getProgramInfoLog(this._program);
            if (error !== "") {
                throw new Error("Error linking shader " + this._name + ":" + error);
            }
            // }
        }

        public use(): void {
            gl.useProgram(this._program);
        }

        private detectAttributes(): void {
            let attributeCount = gl.getProgramParameter(this._program, gl.ACTIVE_ATTRIBUTES);
            for (let i = 0; i < attributeCount; i++) {
                let attributeInfo: WebGLActiveInfo = gl.getActiveAttrib(this._program, i);
                if (!attributeInfo) {
                    break;
                }
                let name = attributeInfo.name;
                this._attributes[name] = gl.getAttribLocation(this._program, name);

            }
        }

        private detectUniforms(): void {
            let attributeCount = gl.getProgramParameter(this._program, gl.ACTIVE_UNIFORMS);
            for (let i = 0; i < attributeCount; i++) {
                let uniformInfo: WebGLActiveInfo = gl.getActiveUniform(this._program, i);
                if (!uniformInfo) {
                    break;
                }
                let name = uniformInfo.name;
                this._uniforms[name] = gl.getUniformLocation(this._program, name);

            }
        }

        public getAttributeLocation(name: string): number {
            let attribute = this._attributes[name];
            if (attribute === undefined) {
                throw new Error(`Unable to find attribute named ${name} in shader named '${this._name}'`)
            }
            return attribute;
        }

        public getUniformLocation(name: string): WebGLUniformLocation {
            let uniform = this._uniforms[name];
            if (uniform === undefined) {
                throw new Error(`Unable to find uniform named ${name} in shader named '${this._name}'`)
            }
            return uniform;
        }
    }
}