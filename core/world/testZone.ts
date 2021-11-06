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
            console.log(this._testObject.transform);
            this._testObject.transform.position.x = 20;
            this._testObject.transform.position.y = 20;
            // console.log(this._testObject.transform.position);
            this.scene.addObject(this._testObject);
            console.log(this.scene);
            super.load();
        }
    }
}