"use strict";
cc._RF.push(module, 'e02d9OJjyVMHKLjOi0uiNE1', 'heart');
// scripts/heart.js

"use strict";

var PublicSetUp = require('PublicSetUp');

var heartcnt = [];
var statue = [];
var pos = [[570, 292], [570, 196], [570, 98], [570, 0], [570, -103]];
cc.Class({
  "extends": cc.Component,
  properties: {// foo: {
    //     // ATTRIBUTES:
    //     default: null,        // The default value will be used only when the component attaching
    //                           // to a node for the first time
    //     type: cc.SpriteFrame, // optional, default is typeof default
    //     serializable: true,   // optional, default is true
    // },
    // bar: {
    //     get () {
    //         return this._bar;
    //     },
    //     set (value) {
    //         this._bar = value;
    //     }
    // },
  },
  // LIFE-CYCLE CALLBACKS:
  // onLoad () {},
  start: function start() {
    for (var i = 0; i < 5; i++) {
      heartcnt[i] = cc.find("Canvas/Game/heartPanel/" + (i + 1));
    }

    for (var _i = 0; _i < 6; _i++) {
      statue[_i] = cc.find("Canvas/Game/AVGirl/" + (_i + 1));
    }

    this.closeHeart();
  },
  show: function show(cnt) {
    if (cnt != 0) {
      if (heartcnt[cnt - 1].active == false) {
        if (PublicSetUp.sound == 1) {
          cc.audioEngine.playEffect(PublicSetUp.audio["0012"], false);
        }

        heartcnt[cnt - 1].active = true;
        cc.tween(heartcnt[cnt - 1]).to(0, {
          scale: 0.5,
          position: cc.v2(-117, -23)
        }).to(1, {
          scale: 1,
          position: cc.v2(pos[cnt - 1][0], pos[cnt - 1][1])
        }).start();
      }

      for (var i = 0; i < 6; i++) {
        statue[i].active = false;
      }

      if (cnt <= 5) {
        statue[cnt - 1].active = true;
      } else {
        statue[5].active = true;
      }
    } else {
      this.closeHeart();
    }
  },
  closeHeart: function closeHeart() {
    for (var i = 0; i < 5; i++) {
      heartcnt[i].active = false;
      heartcnt[i].setPosition(-177, -23, 0);
    }

    for (var _i2 = 0; _i2 < 6; _i2++) {
      statue[_i2].active = false;
    }

    statue[5].active = true;
  } // update (dt) {},

});

cc._RF.pop();