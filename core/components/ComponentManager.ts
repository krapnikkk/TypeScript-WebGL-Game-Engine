namespace TSE{
    export class ComponentManager{
        private static _registeredBuilders:{[type:string]:IComponentBuilder} = {};

        public static registerBuilder(builder:IComponentBuilder):void{
            ComponentManager._registeredBuilders[builder.type] = builder;
        }

        public static extractComponent(json:any):IComponent{
            if(json.type){
                if(ComponentManager._registeredBuilders[json.type]!==undefined){
                    return ComponentManager._registeredBuilders[json.type].buildFromJson(json);
                }
            }
            throw new Error("ComponentManager error - type is missing or builder is not registered for this type.")
        }
    }
}