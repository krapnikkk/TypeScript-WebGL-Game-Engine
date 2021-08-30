module TSE{
    export class TestZone extends Zone{
        private _sprite:Sprite;
        public load():void{
            this._sprite = new Sprite("test","create");
            this._sprite.load();
            this._sprite.position.x = 200;
            this._sprite.position.y = 100;

            super.load();
        }

        public render(shader:Shader):void{
            this._sprite.draw(shader);
            super.render(shader);
        }
    }
}