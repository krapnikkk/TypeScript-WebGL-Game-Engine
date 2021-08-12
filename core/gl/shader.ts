module TSE {
    export class Shader {
        public constructor(vertexSource: string, fragmentSource: string) {
            let vertexShader = this.loadShader(vertexSource,gl.VERTEX_SHADER);
            let fragmentShader = this.loadShader(fragmentSource,gl.FRAGMENT_SHADER);
        }

        private loadShader(source: string, shaderType: number) {
            let shader = gl.createShader(shaderType);
            gl.shaderSource(shader, source);
            gl.compileShader(shader);
            let error = gl.getShaderInfoLog(shader);
            if (error !== undefined) {
                throw new Error("Error compiling shader:" + error);
            }
            return shader;
        }
    }
}