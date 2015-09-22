module HollowMoon {

  /** Assign Default Keybindings here, they can be changed with changeKey func*/
  export var KeyBindings = {
    moveLeft: Phaser.Keyboard.LEFT,
    moveRight: Phaser.Keyboard.RIGHT,
    jump: Phaser.Keyboard.SPACEBAR,
    crouch: Phaser.Keyboard.DOWN,
    dodge: Phaser.Keyboard.CONTROL,
    openDoor: Phaser.Keyboard.UP
  };

  /**
   * Changes key bindings for use within game.
   * @param {string} binding - The name of the binding to change
   * @param {number} key - The Phaser.Keyboard key to set binding to
   */
  export function changeKey(binding:string, key:number) {
    KeyBindings[binding] = key;
  }

  export var ControllerBindings = {
    moveLeft: Phaser.Gamepad.XBOX360_DPAD_LEFT,
    moveRight: Phaser.Gamepad.XBOX360_DPAD_RIGHT,
    jump: Phaser.Gamepad.XBOX360_A,
    crouch: Phaser.Gamepad.XBOX360_DPAD_DOWN,
    dodge: Phaser.Gamepad.XBOX360_B,
    openDoor: Phaser.Gamepad.XBOX360_DPAD_UP
  }

}
