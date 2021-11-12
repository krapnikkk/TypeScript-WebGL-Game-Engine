namespace TSE{
    export class BehaviorManager{
        private static _registeredBuilders:{[type:string]:IBehaviorBuilder} = {};

        public static registerBuilder(builder:IBehaviorBuilder):void{
            BehaviorManager._registeredBuilders[builder.type] = builder;
        }

        public static extractBehavior(json:any):IBehavior{
            if(json.type){
                if(BehaviorManager._registeredBuilders[json.type]!==undefined){
                    return BehaviorManager._registeredBuilders[json.type].buildFromJson(json);
                }
                throw new Error("BehaviorManager error - type is missing or builder is not registered for this type.")
            }
        }
    }
}