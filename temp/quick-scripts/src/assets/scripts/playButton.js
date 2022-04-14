"use strict";
cc._RF.push(module, '76aa8jOmu5JA4RZCc/i6S0E', 'playButton');
// scripts/playButton.js

"use strict";

cc.Class({
  "extends": cc.Component,
  onLoad: function onLoad() {
    var button = this.node.getComponent(cc.Button);
    button.node.on('click', function () {
      if (cc.store.canPlay() === true && cc.store.playing === false) {
        cc.store.playing = true;
        var AutoPlayButton = cc.find('Canvas/Game/Machine/UI/playButton');
        AutoPlayButton.active = false;
        var ManuaPlayButton = cc.find('Canvas/Game/Machine/UI/PauseButton');
        ManuaPlayButton.active = true;
      }
    });
  }
});

cc._RF.pop();