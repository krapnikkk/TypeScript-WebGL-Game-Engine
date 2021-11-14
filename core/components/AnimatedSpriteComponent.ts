/// <reference path = "ComponentManager.ts" />
/// <reference path = "BaseComponent.ts" />
/// <reference path = "SpriteComponent.ts" />
namespace TSE{
    export class AnimatedSpriteComponentData extends SpriteComponentData implements IComponentData{
        frameWidth: number;
        frameHeight: number;
        frameCount: number;
        frameSequence: number[];
       
        public setFromJson(json:any):void{
            super.setFromJson(json);
            this.frameWidth = json.frameWidth;
            this.frameHeight = json.frameHeight;
            this.frameCount = json.frameCount;
            this.frameSequence = json.frameSequence;
        }
    }

    export class AnimatedSpriteComponentBuilder implements IComponentBuilder{
        public  get type():string{
            return "animatedSprite";
        }

        public buildFromJson(json:any):IComponent{
            let data = new AnimatedSpriteComponentData();
            data.setFromJson(json);
            return new AnimatedSpriteComponent(data);
        }

    }

    export class AnimatedSpriteComponent extends BaseComponent{
        private _sprite:AnimatedSprite;
        public constructor(data:AnimatedSpriteComponentData){
            super(data);
            let {name,materialName,frameCount,frameSequence,frameWidth,frameHeight} = data;
            this._sprite = new AnimatedSprite(name,materialName,frameWidth,frameHeight,frameWidth,frameHeight,frameCount,frameSequence);
        }

        public update(time:number){
            this._sprite.update(time);
            super.update(time);
        }

        public load(){
            this._sprite.load();
        }

        public render(shader:Shader):void{
            this._sprite.draw(shader,this.owner.worldMatrix);
            super.render(shader);
        }

    }

    ComponentManager.registerBuilder(new AnimatedSpriteComponentBuilder);
}