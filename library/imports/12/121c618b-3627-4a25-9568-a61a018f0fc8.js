"use strict";
cc._RF.push(module, '121c6GLNidKJZVophoBjw/I', 'manualPlayButton');
// scripts/manualPlayButton.js

"use strict";

var PublicSetUp = require('PublicSetUp');

cc.Class({
  "extends": cc.Component,
  properties: {},
  onLoad: function onLoad() {
    var button = this.node.getComponent(cc.Button);
    button.node.on('click', function () {
      cc.store.auto = true;
      var AutoPlayButton = cc.find('Canvas/Game/Machine/UI/AutoPlayButton');
      AutoPlayButton.active = true;
      var ManuaPlayButton = cc.find('Canvas/Game/Machine/UI/ManuaPlayButton');
      ManuaPlayButton.active = false;
    });
  }
});

cc._RF.pop();