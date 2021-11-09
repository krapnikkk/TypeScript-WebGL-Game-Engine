/// <reference path = "ComponentManager.ts" />
namespace TSE{
    export class SpriteComponentData implements IComponentData{
        public name:string;
        public materialName:string;

        public setFromJson(json:any):void{
            if(json.name){
                this.name = json.name;
            }

            if(json.materialName){
                this.materialName = json.materialName;
            }
        }
    }

    export class SpriteComponentBuilder implements IComponentBuilder{
        public  get type():string{
            return "sprite";
        }

        public buildFromJson(json:any):IComponent{
            let data = new SpriteComponentData();
            data.setFromJson(json);
            return new SpriteComponent(data);
        }

    }

    export class SpriteComponent extends BaseComponent{
        private _sprite:Sprite;
        public constructor(data:SpriteComponentData){
            super(data);
            let {name,materialName} = data;
            this._sprite = new Sprite(name,materialName);
        }

        public load(){
            this._sprite.load();
        }

        public render(shader:Shader):void{
            this._sprite.draw(shader,this.owner.worldMatrix);
            super.render(shader);
        }

    }

    ComponentManager.registerBuilder(new SpriteComponentBuilder);
}