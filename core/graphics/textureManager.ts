namespace TSE {
    class TextureReference {
        public texture: Texture;
        public referenceCount: number = 1;
        constructor(texture: Texture) {
            this.texture = texture;
        }
    }

    export class TextureManager {
        private static _textures:{[name:string]:TextureReference} = {};
        private constructor(){

        }

        public static getTexture(textureName:string):Texture{
            if(TextureManager._textures[textureName]===undefined){
                let texture = new Texture(textureName);
                TextureManager._textures[textureName] = new TextureReference(texture);
            }else{
                TextureManager._textures[textureName].referenceCount++;
            }
            return TextureManager._textures[textureName].texture;
        }

        public static releaseTexture(textureName:string):void{
            if(TextureManager._textures[textureName]===undefined){
                console.warn(`A texture named ${textureName} does not exist and therefore cannot be released.`)
            }else{
                TextureManager._textures[textureName].referenceCount--;
                if(TextureManager._textures[textureName].referenceCount<1){
                    TextureManager._textures[textureName].texture.destory();
                    TextureManager._textures[textureName] = null;
                    delete TextureManager._textures[textureName];
                }
            }
        }
    }
}