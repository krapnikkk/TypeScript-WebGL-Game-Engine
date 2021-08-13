module TSE {
    export class Shader {
        private _name: string;
        private _program: WebGLProgram;
        /**
         * 
         * @param name the name of this shader
         * @param vertexSource the source of the vertex shader
         * @param fragmentSource the source of the fragment shader
         */
        public constructor(name: string, vertexSource: string, fragmentSource: string) {
            this._name = name;
            let vertexShader = this.loadShader(vertexSource, gl.VERTEX_SHADER);
            let fragmentShader = this.loadShader(fragmentSource, gl.FRAGMENT_SHADER);

            this._program = this.createProgram(vertexShader, fragmentShader);
        }

        public get name(): string {
            return this._name;
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

        private createProgram(vertexShader: WebGLShader, fragmentShader: WebGLShader): WebGLProgram {
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
            return this._program;
        }

        public use(): void {
            gl.useProgram(this._program);
        }
    }
}