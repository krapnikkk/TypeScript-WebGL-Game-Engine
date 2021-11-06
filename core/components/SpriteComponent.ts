module TSE{
    export class SpriteComponent extends BaseComponent{
        private _sprite:Sprite;
        public constructor(name:string,materialName:string){
            super(name);
            this._sprite = new Sprite(name,materialName);
        }

        public load(){
            this._sprite.load();
        }

        public render(shader:Shader):void{
            this._sprite.draw(shader);
            super.render(shader);
        }

    }
}