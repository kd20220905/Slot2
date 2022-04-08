
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/scripts/handleGameCommand.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, '547502AtRxEfq8fxpX3tzx8', 'handleGameCommand');
// scripts/handleGameCommand.js

"use strict";

exports.__esModule = true;
exports["default"] = void 0;

var handleGameCommand = function () {
  var first3072 = true;
  return function handleGameCommand(vals, pi, gameObj) {
    switch (vals[0]) {
      case 3072:
        //　回傳本桌的資訊
        if (first3072 === true) {
          first3072 = false;
          cc.store.userPoints = vals[4];
          cc.find('Canvas/Game/Machine/UI/GamePoint/Value').getComponent(cc.Label).string = cc.store.userPoints;
          cc.store.maxBet = vals[2];
          cc.store.minBet = cc.store.currentBet = vals[3];
          cc.store.gameResult.iGrid = vals[8];
          cc.find('Canvas/Game/Machine/UI/BetPanel/Value').getComponent(cc.Label).string = cc.store.currentBet; // console.log(vals[8]);
          // hide login
          // play bg music

          cc.find('Canvas/Game').active = true;
        }

        cc.store.freeGameCnts = vals[9];
        break;

      case 3073:
        //　回傳押注結果資訊
        if (cc.store.gameResultGotStatus === 1) {
          var gameResult = cc.store.gameResult;
          gameResult.type = vals[1];
          gameResult.iGrid = vals[2];
          gameResult.iLine = vals[3];
          gameResult.iFrame = vals[4];
          gameResult.freeGameNCnts = vals[5];
          gameResult.WinPointLine = vals[6];
          gameResult.WinTotalPoint = vals[7];
          cc.store.userPoints = vals[8]; // console.log(vals[2]);
          // console.log(vals[3]);
          // console.log(vals[4]);

          if (gameResult.iGrid.some(function (val) {
            return val === -1;
          }) === false) {
            cc.store.gameResultGotStatus = 2;
          }
        }

        break;

      case 3074:
        //　通知遊戲端免費遊戲結束
        cc.store.FreeTotalPoint = vals[1];
        cc.store.userPoints = vals[2];
        break;
    }
  };
}();

var _default = handleGameCommand;
exports["default"] = _default;
module.exports = exports["default"];

cc._RF.pop();
                    }
                    if (nodeEnv) {
                        __define(__module.exports, __require, __module);
                    }
                    else {
                        __quick_compile_project__.registerModuleFunc(__filename, function () {
                            __define(__module.exports, __require, __module);
                        });
                    }
                })();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcc2NyaXB0c1xcaGFuZGxlR2FtZUNvbW1hbmQuanMiXSwibmFtZXMiOlsiaGFuZGxlR2FtZUNvbW1hbmQiLCJmaXJzdDMwNzIiLCJ2YWxzIiwicGkiLCJnYW1lT2JqIiwiY2MiLCJzdG9yZSIsInVzZXJQb2ludHMiLCJmaW5kIiwiZ2V0Q29tcG9uZW50IiwiTGFiZWwiLCJzdHJpbmciLCJtYXhCZXQiLCJtaW5CZXQiLCJjdXJyZW50QmV0IiwiZ2FtZVJlc3VsdCIsImlHcmlkIiwiYWN0aXZlIiwiZnJlZUdhbWVDbnRzIiwiZ2FtZVJlc3VsdEdvdFN0YXR1cyIsInR5cGUiLCJpTGluZSIsImlGcmFtZSIsImZyZWVHYW1lTkNudHMiLCJXaW5Qb2ludExpbmUiLCJXaW5Ub3RhbFBvaW50Iiwic29tZSIsInZhbCIsIkZyZWVUb3RhbFBvaW50Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLElBQU1BLGlCQUFpQixHQUFJLFlBQVk7QUFDckMsTUFBSUMsU0FBUyxHQUFHLElBQWhCO0FBRUEsU0FBTyxTQUFTRCxpQkFBVCxDQUEyQkUsSUFBM0IsRUFBaUNDLEVBQWpDLEVBQXFDQyxPQUFyQyxFQUE4QztBQUNuRCxZQUFRRixJQUFJLENBQUMsQ0FBRCxDQUFaO0FBQ0UsV0FBSyxJQUFMO0FBQVc7QUFDVCxZQUFJRCxTQUFTLEtBQUssSUFBbEIsRUFBd0I7QUFDdEJBLFVBQUFBLFNBQVMsR0FBRyxLQUFaO0FBRUFJLFVBQUFBLEVBQUUsQ0FBQ0MsS0FBSCxDQUFTQyxVQUFULEdBQXNCTCxJQUFJLENBQUMsQ0FBRCxDQUExQjtBQUNBRyxVQUFBQSxFQUFFLENBQUNHLElBQUgsQ0FBUSx3Q0FBUixFQUFrREMsWUFBbEQsQ0FBK0RKLEVBQUUsQ0FBQ0ssS0FBbEUsRUFBeUVDLE1BQXpFLEdBQWtGTixFQUFFLENBQUNDLEtBQUgsQ0FBU0MsVUFBM0Y7QUFFQUYsVUFBQUEsRUFBRSxDQUFDQyxLQUFILENBQVNNLE1BQVQsR0FBa0JWLElBQUksQ0FBQyxDQUFELENBQXRCO0FBQ0FHLFVBQUFBLEVBQUUsQ0FBQ0MsS0FBSCxDQUFTTyxNQUFULEdBQWtCUixFQUFFLENBQUNDLEtBQUgsQ0FBU1EsVUFBVCxHQUFzQlosSUFBSSxDQUFDLENBQUQsQ0FBNUM7QUFDQUcsVUFBQUEsRUFBRSxDQUFDQyxLQUFILENBQVNTLFVBQVQsQ0FBb0JDLEtBQXBCLEdBQTRCZCxJQUFJLENBQUMsQ0FBRCxDQUFoQztBQUVBRyxVQUFBQSxFQUFFLENBQUNHLElBQUgsQ0FBUSx1Q0FBUixFQUFpREMsWUFBakQsQ0FBOERKLEVBQUUsQ0FBQ0ssS0FBakUsRUFBd0VDLE1BQXhFLEdBQWlGTixFQUFFLENBQUNDLEtBQUgsQ0FBU1EsVUFBMUYsQ0FWc0IsQ0FZdEI7QUFFQTtBQUdBOztBQUdBVCxVQUFBQSxFQUFFLENBQUNHLElBQUgsQ0FBUSxhQUFSLEVBQXVCUyxNQUF2QixHQUFnQyxJQUFoQztBQUNEOztBQUNEWixRQUFBQSxFQUFFLENBQUNDLEtBQUgsQ0FBU1ksWUFBVCxHQUF3QmhCLElBQUksQ0FBQyxDQUFELENBQTVCO0FBQ0E7O0FBRUYsV0FBSyxJQUFMO0FBQVc7QUFDVCxZQUFJRyxFQUFFLENBQUNDLEtBQUgsQ0FBU2EsbUJBQVQsS0FBaUMsQ0FBckMsRUFBd0M7QUFDdEMsY0FBUUosVUFBUixHQUF1QlYsRUFBRSxDQUFDQyxLQUExQixDQUFRUyxVQUFSO0FBQ0FBLFVBQUFBLFVBQVUsQ0FBQ0ssSUFBWCxHQUFrQmxCLElBQUksQ0FBQyxDQUFELENBQXRCO0FBQ0FhLFVBQUFBLFVBQVUsQ0FBQ0MsS0FBWCxHQUFtQmQsSUFBSSxDQUFDLENBQUQsQ0FBdkI7QUFDQWEsVUFBQUEsVUFBVSxDQUFDTSxLQUFYLEdBQW1CbkIsSUFBSSxDQUFDLENBQUQsQ0FBdkI7QUFDQWEsVUFBQUEsVUFBVSxDQUFDTyxNQUFYLEdBQW9CcEIsSUFBSSxDQUFDLENBQUQsQ0FBeEI7QUFDQWEsVUFBQUEsVUFBVSxDQUFDUSxhQUFYLEdBQXlCckIsSUFBSSxDQUFDLENBQUQsQ0FBN0I7QUFDQWEsVUFBQUEsVUFBVSxDQUFDUyxZQUFYLEdBQTBCdEIsSUFBSSxDQUFDLENBQUQsQ0FBOUI7QUFDQWEsVUFBQUEsVUFBVSxDQUFDVSxhQUFYLEdBQTJCdkIsSUFBSSxDQUFDLENBQUQsQ0FBL0I7QUFFQUcsVUFBQUEsRUFBRSxDQUFDQyxLQUFILENBQVNDLFVBQVQsR0FBc0JMLElBQUksQ0FBQyxDQUFELENBQTFCLENBVnNDLENBWXRDO0FBQ0E7QUFDQTs7QUFFQSxjQUFJYSxVQUFVLENBQUNDLEtBQVgsQ0FBaUJVLElBQWpCLENBQXNCLFVBQUFDLEdBQUc7QUFBQSxtQkFBSUEsR0FBRyxLQUFLLENBQUMsQ0FBYjtBQUFBLFdBQXpCLE1BQTZDLEtBQWpELEVBQXdEO0FBQ3REdEIsWUFBQUEsRUFBRSxDQUFDQyxLQUFILENBQVNhLG1CQUFULEdBQStCLENBQS9CO0FBQ0Q7QUFDRjs7QUFDRDs7QUFFRixXQUFLLElBQUw7QUFBVztBQUNUZCxRQUFBQSxFQUFFLENBQUNDLEtBQUgsQ0FBU3NCLGNBQVQsR0FBd0IxQixJQUFJLENBQUMsQ0FBRCxDQUE1QjtBQUNBRyxRQUFBQSxFQUFFLENBQUNDLEtBQUgsQ0FBU0MsVUFBVCxHQUFzQkwsSUFBSSxDQUFDLENBQUQsQ0FBMUI7QUFDQTtBQXJESjtBQXVERCxHQXhERDtBQXlERCxDQTVEeUIsRUFBMUI7O2VBOERlRiIsInNvdXJjZVJvb3QiOiIvIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgaGFuZGxlR2FtZUNvbW1hbmQgPSAoZnVuY3Rpb24gKCkge1xyXG4gIGxldCBmaXJzdDMwNzIgPSB0cnVlO1xyXG5cclxuICByZXR1cm4gZnVuY3Rpb24gaGFuZGxlR2FtZUNvbW1hbmQodmFscywgcGksIGdhbWVPYmopIHtcclxuICAgIHN3aXRjaCAodmFsc1swXSkge1xyXG4gICAgICBjYXNlIDMwNzI6IC8v44CA5Zue5YKz5pys5qGM55qE6LOH6KiKXHJcbiAgICAgICAgaWYgKGZpcnN0MzA3MiA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgZmlyc3QzMDcyID0gZmFsc2U7XHJcblxyXG4gICAgICAgICAgY2Muc3RvcmUudXNlclBvaW50cyA9IHZhbHNbNF07XHJcbiAgICAgICAgICBjYy5maW5kKCdDYW52YXMvR2FtZS9NYWNoaW5lL1VJL0dhbWVQb2ludC9WYWx1ZScpLmdldENvbXBvbmVudChjYy5MYWJlbCkuc3RyaW5nID0gY2Muc3RvcmUudXNlclBvaW50cztcclxuXHJcbiAgICAgICAgICBjYy5zdG9yZS5tYXhCZXQgPSB2YWxzWzJdO1xyXG4gICAgICAgICAgY2Muc3RvcmUubWluQmV0ID0gY2Muc3RvcmUuY3VycmVudEJldCA9IHZhbHNbM107XHJcbiAgICAgICAgICBjYy5zdG9yZS5nYW1lUmVzdWx0LmlHcmlkID0gdmFsc1s4XTtcclxuXHJcbiAgICAgICAgICBjYy5maW5kKCdDYW52YXMvR2FtZS9NYWNoaW5lL1VJL0JldFBhbmVsL1ZhbHVlJykuZ2V0Q29tcG9uZW50KGNjLkxhYmVsKS5zdHJpbmcgPSBjYy5zdG9yZS5jdXJyZW50QmV0O1xyXG5cclxuICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHZhbHNbOF0pO1xyXG5cclxuICAgICAgICAgIC8vIGhpZGUgbG9naW5cclxuXHJcblxyXG4gICAgICAgICAgLy8gcGxheSBiZyBtdXNpY1xyXG5cclxuXHJcbiAgICAgICAgICBjYy5maW5kKCdDYW52YXMvR2FtZScpLmFjdGl2ZSA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNjLnN0b3JlLmZyZWVHYW1lQ250cyA9IHZhbHNbOV07XHJcbiAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICBjYXNlIDMwNzM6IC8v44CA5Zue5YKz5oq85rOo57WQ5p6c6LOH6KiKXHJcbiAgICAgICAgaWYgKGNjLnN0b3JlLmdhbWVSZXN1bHRHb3RTdGF0dXMgPT09IDEpIHtcclxuICAgICAgICAgIGNvbnN0IHsgZ2FtZVJlc3VsdCB9ID0gY2Muc3RvcmU7XHJcbiAgICAgICAgICBnYW1lUmVzdWx0LnR5cGUgPSB2YWxzWzFdO1xyXG4gICAgICAgICAgZ2FtZVJlc3VsdC5pR3JpZCA9IHZhbHNbMl07XHJcbiAgICAgICAgICBnYW1lUmVzdWx0LmlMaW5lID0gdmFsc1szXTtcclxuICAgICAgICAgIGdhbWVSZXN1bHQuaUZyYW1lID0gdmFsc1s0XTtcclxuICAgICAgICAgIGdhbWVSZXN1bHQuZnJlZUdhbWVOQ250cz12YWxzWzVdO1xyXG4gICAgICAgICAgZ2FtZVJlc3VsdC5XaW5Qb2ludExpbmUgPSB2YWxzWzZdO1xyXG4gICAgICAgICAgZ2FtZVJlc3VsdC5XaW5Ub3RhbFBvaW50ID0gdmFsc1s3XTtcclxuXHJcbiAgICAgICAgICBjYy5zdG9yZS51c2VyUG9pbnRzID0gdmFsc1s4XTtcclxuXHJcbiAgICAgICAgICAvLyBjb25zb2xlLmxvZyh2YWxzWzJdKTtcclxuICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHZhbHNbM10pO1xyXG4gICAgICAgICAgLy8gY29uc29sZS5sb2codmFsc1s0XSk7XHJcblxyXG4gICAgICAgICAgaWYgKGdhbWVSZXN1bHQuaUdyaWQuc29tZSh2YWwgPT4gdmFsID09PSAtMSkgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgIGNjLnN0b3JlLmdhbWVSZXN1bHRHb3RTdGF0dXMgPSAyO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBicmVhaztcclxuXHJcbiAgICAgIGNhc2UgMzA3NDogLy/jgIDpgJrnn6XpgYrmiLLnq6/lhY3osrvpgYrmiLLntZDmnZ9cclxuICAgICAgICBjYy5zdG9yZS5GcmVlVG90YWxQb2ludD12YWxzWzFdO1xyXG4gICAgICAgIGNjLnN0b3JlLnVzZXJQb2ludHMgPSB2YWxzWzJdO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgfVxyXG4gIH07XHJcbn0pKCk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBoYW5kbGVHYW1lQ29tbWFuZDtcclxuIl19