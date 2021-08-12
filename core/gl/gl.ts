module TSE {
    export let gl: WebGLRenderingContext;
    /**
     * 创建一个WebGL渲染环境
     */
    export class GLUtilities {
        /**
         * 
         * @param elementId 
         * @returns 
         */
        static initialize(elementId?: string): HTMLCanvasElement {
            let canvas: HTMLCanvasElement;
            if (elementId !== undefined) {
                canvas = document.getElementById(elementId) as HTMLCanvasElement;
                if (canvas === undefined) {
                    throw new Error("Cannot find a canvas element named:" + elementId);
                }
            } else {
                canvas = document.createElement("canvas");
                canvas.id = "engine";
                document.body.appendChild(canvas);
            }

            gl = canvas.getContext("webgl");
            if (gl === undefined) {
                throw new Error("Unable to initialize WebGL!");
            }

            return canvas;

        }
    }
}