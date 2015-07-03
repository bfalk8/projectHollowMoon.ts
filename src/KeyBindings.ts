module HollowMoon {

  /** Assign Default Keybindings here, they can be changed with changeKey func*/
  export var keyBindings = {
    moveLeft: Phaser.Keyboard.LEFT,
    moveRight: Phaser.Keyboard.RIGHT,
    jump: Phaser.Keyboard.UP,
    crouch: Phaser.Keyboard.DOWN,
    dodge: Phaser.Keyboard.CONTROL,
  };

  /**
   * Changes key bindings for use withing game.
   * @param {string} binding - The name of the binding to change
   * @param {number} key - The Phaser.Keyboard key to set binding to
   */
  export function changeKey(binding:string, key:number) {
    keyBindings[binding] = key;
  }
}
