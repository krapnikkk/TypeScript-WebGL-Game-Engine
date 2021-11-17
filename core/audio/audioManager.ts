namespace TSE {
    export class SoundEffect {
        public assetPath: string;
        private _player: HTMLAudioElement;

        public constructor(assetPath: string, loop: boolean) {
            this._player = new Audio(assetPath);
            this._player.loop = loop;
        }

        public get loop(): boolean {
            return this._player.loop;
        }

        public set loop(value: boolean) {
            this._player.loop = value;
        }

        public destroy(): void {
            this._player = null;
        }
        public play(): void {
            if(!this._player.paused){
                this.stop();
            }
            this._player.play();
        }

        public pause(): void {
            this._player.pause();
        }

        public stop(): void {
            this._player.pause();
            this._player.currentTime = 0;
        }
    }
    export class AudioManager {

        private static _soundEffects:{[name:string]:SoundEffect} = {};

        public static loadSoundFile(name:string,audioPath: string,loop:boolean): void {
            AudioManager._soundEffects[name] = new SoundEffect(audioPath,loop);
        }

        public static playSound(name:string){
            if(AudioManager._soundEffects[name]){
                AudioManager._soundEffects[name].play();
            }
        }

        public static stopSound(name:string):void{
            if(AudioManager._soundEffects[name]){
                AudioManager._soundEffects[name].stop();
            }
        }

        public static pauseSound(name:string):void{
            if(AudioManager._soundEffects[name]){
                AudioManager._soundEffects[name].pause();
            }
        }

        public static pauseAll():void{
            for(let name in AudioManager._soundEffects){
                AudioManager._soundEffects[name].pause();
            }
        }

        public static stopAll():void{
            for(let name in AudioManager._soundEffects){
                AudioManager._soundEffects[name].stop();
            }
        }
    }
}