/// <reference path ="./zone.ts"/>
module TSE{
    export class TestZone extends Zone{
        private _testSprite:SpriteComponent;
        private _testObject:SimObject;
        public load():void{
            // this._sprite = new Sprite("test","create");
            // this._sprite.load();
            // this._sprite.position.x = 200;
            // this._sprite.position.y = 0;
            this._testObject = new SimObject(0,"test");
            this._testSprite = new SpriteComponent("test","create");
            this._testObject.addComponent(this._testSprite);

            this._testObject.transform.position.x = 100;
            this._testObject.transform.position.y = 100;
            this.scene.addObject(this._testObject);

            super.load();
        }
    }
}