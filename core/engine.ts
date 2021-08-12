module TSE {
    export class Engine {
        private _canvas: HTMLCanvasElement;
        public constructor() {

        }

        public start(): void {
            this._canvas = GLUtilities.initialize();
            gl.clearColor(0, 0, 0, 1);

            this.loop();
        }

        public resize():void{
            if(this._canvas!== undefined){
                this._canvas.width = window.innerWidth;
                this._canvas.height = window.innerHeight;
            }
        }

        private loop(): void {
            gl.clear(gl.COLOR_BUFFER_BIT);
            requestAnimationFrame(this.loop.bind(this));
        }
    }
}