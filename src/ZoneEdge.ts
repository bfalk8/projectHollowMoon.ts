module HollowMoon {
  export class ZoneEdge extends Phaser.Rectangle {
    name: string;

    constructor(x:number, y:number, width:number, height:number, name: string) {
      super(x, y, width, height);
      this.name = name;
    }
  }
}