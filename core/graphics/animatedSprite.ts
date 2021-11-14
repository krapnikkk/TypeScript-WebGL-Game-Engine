/// <reference path = "sprite.ts" />
namespace TSE {
    class UVInfo {
        public min: Vector2;
        public max: Vector2;
        public constructor(min: Vector2, max: Vector2) {
            this.min = min;
            this.max = max;
        }
    }
    export class AnimatedSprite extends Sprite implements IMessageHandler{
        private _frameWidth: number;
        private _frameHeight: number;
        private _frameCount: number;
        private _frameSequence: number[];

        private _currentFrame: number = 0;
        private _frameUVS: UVInfo[] = [];

        private _frameTime: number = 333;
        private _currentTime: number = 0;
        private _assetLoaded:boolean = false;
        private _assetWidth:number;
        private _assetHeight:number;


        public constructor(name: string, materialName: string, width: number = 100, height: number = 100, frameWidth: number = 100,
            frameHeight: number = 100, frameCount: number = 1, frameSequence: number[] = []) {
            super(name, materialName, width, height);
            this._frameHeight = frameHeight;
            this._frameWidth = frameWidth;
            this._frameCount = frameCount;
            this._frameSequence = frameSequence;

            Message.subscribe(MESSAGE_ASSET_LOADED_ASSET_LOADED+this._material.diffuseTextureName,this);
        }
        onMessage(message: Message): void {
            if(message.code == MESSAGE_ASSET_LOADED_ASSET_LOADED + this._material.diffuseTextureName){
                this._assetLoaded = true;
                console.log(this._assetLoaded);
                let asset = message.context as ImageAsset;
                this._assetWidth = asset.width;
                this._assetHeight = asset.height;
                this.calculateUVs();
            }
        }

        public load(): void {
            super.load();
            
        }

        public calculateUVs():void{
            let totalWidth: number = 0;
            let yValue: number = 0;
            for (let i = 0; i < this._frameCount; i++) {
                totalWidth += i * this._frameWidth;
                if (totalWidth > this._assetWidth) {
                    yValue++;
                    totalWidth = 0;
                }
                let u = (i * this._frameWidth) / this._assetWidth;
                let v = (yValue * this._frameHeight) / this._assetHeight;
                let min: Vector2 = new Vector2(u, v);

                let uMax = ((i * this._frameWidth) + this._frameWidth) / this._assetWidth;
                let vMax = ((yValue * this._frameHeight) + this._frameHeight) / this._assetHeight;
                let max: Vector2 = new Vector2(uMax, vMax);

                this._frameUVS.push(new UVInfo(min,max));
            }
        }

        public update(time: number): void {
            if(!this._assetLoaded){
                return;
            }
            this._currentTime += time;
            if (this._currentTime > this._frameTime) {
                this._currentFrame++;
                this._currentTime = 0;
                if (this._currentFrame >= this._frameSequence.length) {
                    this._currentFrame = 0;
                }
                let frameUVs = this._frameSequence[this._currentFrame];
                this._vertices[0].texCoords.copyFrom(this._frameUVS[frameUVs].min); 
                this._vertices[1].texCoords = new Vector2(this._frameUVS[frameUVs].min.x,this._frameUVS[frameUVs].max.y);
                this._vertices[2].texCoords.copyFrom(this._frameUVS[frameUVs].max); 
                this._vertices[3].texCoords.copyFrom(this._frameUVS[frameUVs].max); 
                this._vertices[4].texCoords = new Vector2(this._frameUVS[frameUVs].max.x,this._frameUVS[frameUVs].min.y);
                this._vertices[5].texCoords.copyFrom(this._frameUVS[frameUVs].min); 

                this._buffer.clearData();
                for(let v of this._vertices){
                    this._buffer.pushBackData(v.toArray());
                }
                this._buffer.upload();
                this._buffer.unbind();
            }
            super.update(time);
        }

        public destory(): void {
            super.destory();
        }
    }
}