
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/scripts/BaseCmdLogic.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, 'a7b33Aw/vZIZ6OEZyILO7+Z', 'BaseCmdLogic');
// scripts/BaseCmdLogic.js

"use strict";

var _require = require('./observable.cc'),
    Observable = _require.Observable;

var Photon = require('./Photon-Javascript_SDK');

var PhotonController = require('./Photon_Interface');

var PublicSetUp = require('PublicSetUp');
/**
@namespace BaseCmdLogic
處理登入、入局等底層訊息用
*/
// prevent globals renaming by closure compilier


var BaseCmdLogic;

(function (BaseCmdLogic) {
  var observable = Observable();
  /** 
    * 
    @class MainSrvCmdLogic
    */

  var MainSrvCmdLogic = function () {
    /** 
        @constructor
        @param {PhotonController.PhotonIf} pi photon interface
        */
    function MainSrvCmdLogic(pi) {
      this._pi = pi;
      this._lbSrvObj = null;
      this._account = '';
      this._password = '';
    } //constructor function end
    //login


    MainSrvCmdLogic.prototype.RunLogin = function (account, password, type) {
      this._account = account;
      this._password = password;
      this._type = type;

      this._pi.InitCallbackFunction(this, this.PeerStatusCallback, this.ResponseCallback, this.EventCallback);

      this._pi.connect(); //對main server做連線

    }; //set lobby server command logic


    MainSrvCmdLogic.prototype.SetLbSrvCmdLogicObj = function (lbSrvCmdLogicObj) {
      this._lbSrvObj = lbSrvCmdLogicObj;
    }; //photon peer status callback function


    MainSrvCmdLogic.prototype.PeerStatusCallback = function (st, selfObj) {
      switch (st) {
        case Photon.PhotonPeer.StatusCodes.connect:
          //已經連上 main server
          selfObj._pi.sendData(101, selfObj._account, selfObj._password, selfObj._type, 0, '', 999); //送出帳密


          break;
      }
    }; //photon peer reponse callback function


    MainSrvCmdLogic.prototype.ResponseCallback = function (vals, selfObj) {
      switch (vals[0]) {
        case 101:
          //server端登入回傳訊息
          if (vals[1] == 1) {//成功
            //直接等server通知 lobby server 資訊再做連線
          } else {
            switch (vals[1] //（0：失敗, 2：版本錯誤, 3：維護中, 4:重複登入, 5:之前遊戲局尚未結束 6：沒有進行遊戲的權限（洽客服））
            ) {
              case 0:
                console.log('登入Main Srv失敗');
                break;

              case 2:
                console.log('登入Main Srv版本錯誤');
                break;

              case 3:
                console.log('Main Srv維護中');
                break;

              case 4:
                console.log('Main Srv重複登入');
                break;

              case 5:
                console.log('之前遊戲局尚未結束');
                break;

              case 6:
                console.log('沒有進行遊戲的權限');
                break;
            } //cc.director.loadScene('Login');

          }

          break;
      } //console.log("ms response:"+vals);

    }; //photon peer event callback function


    MainSrvCmdLogic.prototype.EventCallback = function (vals, selfObj) {
      switch (vals[0]) {
        case 102:
          //由 main server通知的 lobby server 資訊
          //vals[1]:loginID
          //vals[2]:loginKey
          //vals[3]:protocol(0:Unknown 1:Udp 2:Tcp 3:WebSocket 4:Http 5:SecureWebSocket)
          //vals[4]:ip
          //vals[5]:port
          selfObj._lbSrvObj.ConnectToServer(vals[1], vals[2], vals[3], vals[4], vals[5]);

          break;
      } //console.log("ms event:"+evt);

    };

    return MainSrvCmdLogic;
  }(); //class end


  BaseCmdLogic.MainSrvCmdLogic = MainSrvCmdLogic;
  /** 
    * 
    @class LobbySrvCmdLogic
    */

  var LobbySrvCmdLogic = function () {
    /** 
        @constructor
        */
    function LobbySrvCmdLogic(gameid, versioncode) {
      this._pi = null;
      this._gameid = gameid;
      this._versioncode = versioncode;
      this._loginId = 0;
      this._loginKey = 0;
      this._gameSrvObj = null;
      this._protocolType = 0;
    } //constructor function end
    //connect to lobby server


    LobbySrvCmdLogic.prototype.ConnectToServer = function (loginId, loginKey, protocolType, ip, port) {
      this._loginId = loginId;
      this._loginKey = loginKey;
      this._protocolType = protocolType; //目前只會有 WebSocket 或 SecureWebSocket 兩種 protocol

      if (protocolType == 3) {
        //WebSocket
        this._pi = new PhotonController.PhotonIf(Photon.ConnectionProtocol.Ws, ip + ':' + port);
      } else if (protocolType == 5) {
        //SecureWebSocket
        this._pi = new PhotonController.PhotonIf(Photon.ConnectionProtocol.Wss, ip + ':' + port);
      }

      if (this._pi != null) {
        //設定 Photon Interface 物件的 Callback Function
        this._pi.InitCallbackFunction(this, this.PeerStatusCallback, this.ResponseCallback, this.EventCallback);

        this._pi.connect();
      }
    }; //set game server command logic


    LobbySrvCmdLogic.prototype.SetGameSrvCmdLogicObj = function (gameSrvCmdLogicObj) {
      this._gameSrvObj = gameSrvCmdLogicObj;
    }; //photon peer status callback function


    LobbySrvCmdLogic.prototype.PeerStatusCallback = function (st, selfObj) {
      switch (st) {
        case Photon.PhotonPeer.StatusCodes.connect:
          //已經連上 lobby server
          selfObj._pi.sendData(101, selfObj._loginId, selfObj._loginKey); //送出login id 與 key


          break;
      }
    }; //photon peer reponse callback function


    LobbySrvCmdLogic.prototype.ResponseCallback = function (vals, selfObj) {
      switch (vals[0]) {
        case 102:
          //登入狀態回覆
          if (vals[1] == 1) {
            ////狀態代碼（0：失敗, 1：成功, 2：版本錯誤, 3：維護中）
            //加入遊戲局（this._gameid）
            selfObj._pi.sendData(103, selfObj._gameid, -1, -1, selfObj._versioncode);
          } else {
            switch (vals[1]) {
              case 0:
                console.log('登入LB Srv 失敗');
                break;

              case 2:
                console.log('登入LB Srv版本錯誤');
                break;

              case 3:
                console.log('LB Srv 維護中');
                break;
            }
          }

          break;

        case 103:
          //server送回的game server連線資訊
          //vals[1]:loginID
          //vals[2]:loginKey
          //vals[3]:ip
          //vals[4]:port
          //vals[5]:result
          if (vals[5] == 1) {
            selfObj._gameSrvObj.ConnectToServer(vals[1], vals[2], selfObj._protocolType, vals[3], vals[4]);
          } else {
            switch (vals[5] //0：錯誤 1：成功 2:遊戲維護中 3:版本錯誤
            ) {
              case 0:
                console.log('加入game server遊戲局錯誤');
                break;

              case 2:
                console.log('Game Srv 遊戲維護中');
                break;

              case 3:
                console.log('要求加入Game Srv 版本錯誤');
                break;
            }
          }

          break;

        case 104:
          //加入game server遊戲局結果回覆(因為可能會被game server強制斷線，所以由lobby server進行回覆)
          if (vals[1] != 1) {
            //-1：建立房間失敗 0：錯誤 1:成功 2：點數不足 3：沒有進行遊戲的權限（洽客服） ], 4：無可用房間, 5：此玩家之前遊戲局未結束
            switch (vals[1]) {
              case -1:
                console.log('建立房間失敗');
                break;

              case 0:
                console.log('加入遊戲錯誤');
                break;

              case 2:
                console.log('點數不足');
                break;

              case 3:
                console.log('沒有進行遊戲的權限');
                break;

              case 4:
                console.log('無可用房間');
                break;

              case 5:
                console.log('此玩家之前遊戲局未結束');
                break;
            }
          }

          break;
      }

      console.log('ls response, cmd:' + vals[0]);
    }; //photon peer event callback function


    LobbySrvCmdLogic.prototype.EventCallback = function (vals, selfObj) {
      console.log('ls event, cmd:' + vals[0]);
    };

    return LobbySrvCmdLogic;
  }(); //class end


  BaseCmdLogic.LobbySrvCmdLogic = LobbySrvCmdLogic;
  /** 
    * 
    @class GameSrvBaseCmdLogic
    */

  var GameSrvBaseCmdLogic = function () {
    /** 
        @constructor
        */
    function GameSrvBaseCmdLogic(GameObj) {
      this._pi = null;
      this._GameCmdFuncObj = null;
      this._loginId = 0;
      this._loginKey = 0;
      this._GameObj = GameObj;
    } //constructor function end
    //connect to game server


    GameSrvBaseCmdLogic.prototype.ConnectToServer = function (loginId, loginKey, protocolType, ip, port) {
      console.log('connect to gs loginId:' + loginId + ', loginKey:' + loginKey + ', protocolType:' + protocolType + ', ip:' + ip + ', port:' + port);
      this._loginId = loginId;
      this._loginKey = loginKey; //目前只會有 WebSocket 或 SecureWebSocket 兩種 protocol

      if (protocolType == 3) {
        //WebSocket
        this._pi = new PhotonController.PhotonIf(Photon.ConnectionProtocol.Ws, ip + ':' + port);
      } else if (protocolType == 5) {
        //SecureWebSocket
        this._pi = new PhotonController.PhotonIf(Photon.ConnectionProtocol.Wss, ip + ':' + port);
      }

      if (this._pi != null) {
        //設定 Photon Interface 物件的 Callback Function
        this._pi.InitCallbackFunction(this, this.PeerStatusCallback, this.ResponseCallback, this.EventCallback);

        this._pi.connect();
      }
    }; //photon peer status callback function


    GameSrvBaseCmdLogic.prototype.PeerStatusCallback = function (st, selfObj) {
      switch (st) {
        case Photon.PhotonPeer.StatusCodes.connect:
          //已經連上 game server
          selfObj._pi.sendData(101, selfObj._loginId, selfObj._loginKey); //送出login id 與 key


          break;
      }
    }; //photon peer reponse callback function


    GameSrvBaseCmdLogic.prototype.ResponseCallback = function (vals, selfObj) {
      console.log('gs response, cmd:' + vals[0]);

      switch (vals[0]) {
        case 111:
          //收到game遊戲局已經準備完成的訊息（只會有一次）
          selfObj._pi.sendData(3161); //送出3161，取得本桌的資訊(通知server前端遊戲已經準備就緒)
          //押注為3162


          break;
        // case 3072: //　回傳本桌的資訊
        //   break;
        // case 3073: //　回傳押注結果資訊
        //   break;
        // case 3074: //　通知遊戲端免費遊戲結束
        //   break;

        default:
          selfObj._GameCmdFuncObj(vals, selfObj._pi, selfObj._GameObj);

          break;
      }
    }; //photon peer event callback function


    GameSrvBaseCmdLogic.prototype.EventCallback = function (vals, selfObj) {
      console.log('gs event, cmd:' + vals[0]);
    }; //set game cmd function


    GameSrvBaseCmdLogic.prototype.SetGameCmdFunc = function (FuncObj) {
      this._GameCmdFuncObj = FuncObj;
    }; //Get Photon Interface object


    GameSrvBaseCmdLogic.prototype.GetPI = function () {
      return this._pi;
    };

    return GameSrvBaseCmdLogic;
  }(); //class end


  BaseCmdLogic.GameSrvBaseCmdLogic = GameSrvBaseCmdLogic;
})(BaseCmdLogic || (BaseCmdLogic = {})); //namespace end


module.exports = BaseCmdLogic;
/*
    //優先處理底層server event，未處理的封包會透過 default 傳給外部物件
    PhotonIf.prototype.BaseEventCallback = function(vals, outObj){
        console.log("BaseEventCallback");
        switch(vals[0]){
            case 102:
                break;
            default:
                this._outEventCallback(vals, outObj);
                break;
        }
    }

    //處理 main server的封包訊息
    PhotonIf.prototype.ProcMainSrvResponse = function(vals, outObj){
        console.log("ProcMainSrvResponse, cmd id:"+vals[0]);
        switch(vals[0]){
            case 101:
                //console.log("vals 1:"+vals[1]);
                break;
            default:
                this._outRspCallback(vals, outObj);
                break;
        }
    };

    //處理 lobby server的封包訊息
    PhotonIf.prototype.ProcLobbySrvResponse = function(vals, outObj){
        console.log("ProcLobbySrvResponse, cmd id:"+vals[0]);
        switch(vals[0]){
            case 101:
                //console.log("vals 1:"+vals[1]);
                break;
            default:
                this._outRspCallback(vals, outObj);
                break;
        }
    };

    //處理 game server的封包訊息
    PhotonIf.prototype.ProcGameSrvResponse = function(vals, outObj){
        console.log("ProcGameSrvResponse, cmd id:"+vals[0]);
        switch(vals[0]){
            case 101:
                //console.log("vals 1:"+vals[1]);
                break;
            default:
                this._outRspCallback(vals, outObj);
                break;
        }
    };
*/

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcc2NyaXB0c1xcQmFzZUNtZExvZ2ljLmpzIl0sIm5hbWVzIjpbInJlcXVpcmUiLCJPYnNlcnZhYmxlIiwiUGhvdG9uIiwiUGhvdG9uQ29udHJvbGxlciIsIlB1YmxpY1NldFVwIiwiQmFzZUNtZExvZ2ljIiwib2JzZXJ2YWJsZSIsIk1haW5TcnZDbWRMb2dpYyIsInBpIiwiX3BpIiwiX2xiU3J2T2JqIiwiX2FjY291bnQiLCJfcGFzc3dvcmQiLCJwcm90b3R5cGUiLCJSdW5Mb2dpbiIsImFjY291bnQiLCJwYXNzd29yZCIsInR5cGUiLCJfdHlwZSIsIkluaXRDYWxsYmFja0Z1bmN0aW9uIiwiUGVlclN0YXR1c0NhbGxiYWNrIiwiUmVzcG9uc2VDYWxsYmFjayIsIkV2ZW50Q2FsbGJhY2siLCJjb25uZWN0IiwiU2V0TGJTcnZDbWRMb2dpY09iaiIsImxiU3J2Q21kTG9naWNPYmoiLCJzdCIsInNlbGZPYmoiLCJQaG90b25QZWVyIiwiU3RhdHVzQ29kZXMiLCJzZW5kRGF0YSIsInZhbHMiLCJjb25zb2xlIiwibG9nIiwiQ29ubmVjdFRvU2VydmVyIiwiTG9iYnlTcnZDbWRMb2dpYyIsImdhbWVpZCIsInZlcnNpb25jb2RlIiwiX2dhbWVpZCIsIl92ZXJzaW9uY29kZSIsIl9sb2dpbklkIiwiX2xvZ2luS2V5IiwiX2dhbWVTcnZPYmoiLCJfcHJvdG9jb2xUeXBlIiwibG9naW5JZCIsImxvZ2luS2V5IiwicHJvdG9jb2xUeXBlIiwiaXAiLCJwb3J0IiwiUGhvdG9uSWYiLCJDb25uZWN0aW9uUHJvdG9jb2wiLCJXcyIsIldzcyIsIlNldEdhbWVTcnZDbWRMb2dpY09iaiIsImdhbWVTcnZDbWRMb2dpY09iaiIsIkdhbWVTcnZCYXNlQ21kTG9naWMiLCJHYW1lT2JqIiwiX0dhbWVDbWRGdW5jT2JqIiwiX0dhbWVPYmoiLCJTZXRHYW1lQ21kRnVuYyIsIkZ1bmNPYmoiLCJHZXRQSSIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsZUFBdUJBLE9BQU8sQ0FBQyxpQkFBRCxDQUE5QjtBQUFBLElBQVFDLFVBQVIsWUFBUUEsVUFBUjs7QUFDQSxJQUFNQyxNQUFNLEdBQUdGLE9BQU8sQ0FBQyx5QkFBRCxDQUF0Qjs7QUFDQSxJQUFNRyxnQkFBZ0IsR0FBR0gsT0FBTyxDQUFDLG9CQUFELENBQWhDOztBQUNBLElBQUlJLFdBQVcsR0FBQ0osT0FBTyxDQUFDLGFBQUQsQ0FBdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFDQSxJQUFJSyxZQUFKOztBQUVBLENBQUMsVUFBVUEsWUFBVixFQUF3QjtBQUN2QixNQUFNQyxVQUFVLEdBQUdMLFVBQVUsRUFBN0I7QUFDQTtBQUNGO0FBQ0E7QUFDQTs7QUFDRSxNQUFJTSxlQUFlLEdBQUksWUFBWTtBQUNqQztBQUNKO0FBQ0E7QUFDQTtBQUNJLGFBQVNBLGVBQVQsQ0FBeUJDLEVBQXpCLEVBQTZCO0FBQzNCLFdBQUtDLEdBQUwsR0FBV0QsRUFBWDtBQUNBLFdBQUtFLFNBQUwsR0FBaUIsSUFBakI7QUFDQSxXQUFLQyxRQUFMLEdBQWdCLEVBQWhCO0FBQ0EsV0FBS0MsU0FBTCxHQUFpQixFQUFqQjtBQUNELEtBVmdDLENBVS9CO0FBRUY7OztBQUNBTCxJQUFBQSxlQUFlLENBQUNNLFNBQWhCLENBQTBCQyxRQUExQixHQUFxQyxVQUFVQyxPQUFWLEVBQW1CQyxRQUFuQixFQUE0QkMsSUFBNUIsRUFBa0M7QUFDckUsV0FBS04sUUFBTCxHQUFnQkksT0FBaEI7QUFDQSxXQUFLSCxTQUFMLEdBQWlCSSxRQUFqQjtBQUNBLFdBQUtFLEtBQUwsR0FBYUQsSUFBYjs7QUFDQSxXQUFLUixHQUFMLENBQVNVLG9CQUFULENBQThCLElBQTlCLEVBQW9DLEtBQUtDLGtCQUF6QyxFQUE2RCxLQUFLQyxnQkFBbEUsRUFBb0YsS0FBS0MsYUFBekY7O0FBQ0EsV0FBS2IsR0FBTCxDQUFTYyxPQUFULEdBTHFFLENBS2pEOztBQUNyQixLQU5ELENBYmlDLENBcUJqQzs7O0FBQ0FoQixJQUFBQSxlQUFlLENBQUNNLFNBQWhCLENBQTBCVyxtQkFBMUIsR0FBZ0QsVUFBVUMsZ0JBQVYsRUFBNEI7QUFDMUUsV0FBS2YsU0FBTCxHQUFpQmUsZ0JBQWpCO0FBQ0QsS0FGRCxDQXRCaUMsQ0EwQmpDOzs7QUFDQWxCLElBQUFBLGVBQWUsQ0FBQ00sU0FBaEIsQ0FBMEJPLGtCQUExQixHQUErQyxVQUFVTSxFQUFWLEVBQWNDLE9BQWQsRUFBdUI7QUFDcEUsY0FBUUQsRUFBUjtBQUNFLGFBQUt4QixNQUFNLENBQUMwQixVQUFQLENBQWtCQyxXQUFsQixDQUE4Qk4sT0FBbkM7QUFBNEM7QUFDMUNJLFVBQUFBLE9BQU8sQ0FBQ2xCLEdBQVIsQ0FBWXFCLFFBQVosQ0FBcUIsR0FBckIsRUFBMEJILE9BQU8sQ0FBQ2hCLFFBQWxDLEVBQTRDZ0IsT0FBTyxDQUFDZixTQUFwRCxFQUErRGUsT0FBTyxDQUFDVCxLQUF2RSxFQUE4RSxDQUE5RSxFQUFpRixFQUFqRixFQUFxRixHQUFyRixFQURGLENBQzZGOzs7QUFDM0Y7QUFISjtBQUtELEtBTkQsQ0EzQmlDLENBbUNqQzs7O0FBQ0FYLElBQUFBLGVBQWUsQ0FBQ00sU0FBaEIsQ0FBMEJRLGdCQUExQixHQUE2QyxVQUFVVSxJQUFWLEVBQWdCSixPQUFoQixFQUF5QjtBQUNwRSxjQUFRSSxJQUFJLENBQUMsQ0FBRCxDQUFaO0FBQ0UsYUFBSyxHQUFMO0FBQVU7QUFDUixjQUFJQSxJQUFJLENBQUMsQ0FBRCxDQUFKLElBQVcsQ0FBZixFQUFrQixDQUNoQjtBQUNBO0FBRUQsV0FKRCxNQUlPO0FBQ0wsb0JBQ0VBLElBQUksQ0FBQyxDQUFELENBRE4sQ0FDVTtBQURWO0FBR0UsbUJBQUssQ0FBTDtBQUNFQyxnQkFBQUEsT0FBTyxDQUFDQyxHQUFSLENBQVksY0FBWjtBQUNBOztBQUNGLG1CQUFLLENBQUw7QUFDRUQsZ0JBQUFBLE9BQU8sQ0FBQ0MsR0FBUixDQUFZLGdCQUFaO0FBQ0E7O0FBQ0YsbUJBQUssQ0FBTDtBQUNFRCxnQkFBQUEsT0FBTyxDQUFDQyxHQUFSLENBQVksYUFBWjtBQUNBOztBQUNGLG1CQUFLLENBQUw7QUFDRUQsZ0JBQUFBLE9BQU8sQ0FBQ0MsR0FBUixDQUFZLGNBQVo7QUFDQTs7QUFDRixtQkFBSyxDQUFMO0FBQ0VELGdCQUFBQSxPQUFPLENBQUNDLEdBQVIsQ0FBWSxXQUFaO0FBQ0E7O0FBQ0YsbUJBQUssQ0FBTDtBQUNFRCxnQkFBQUEsT0FBTyxDQUFDQyxHQUFSLENBQVksV0FBWjtBQUNBO0FBcEJKLGFBREssQ0F1Qkw7O0FBQ0Q7O0FBQ0Q7QUEvQkosT0FEb0UsQ0FrQ3BFOztBQUNELEtBbkNELENBcENpQyxDQXlFakM7OztBQUNBMUIsSUFBQUEsZUFBZSxDQUFDTSxTQUFoQixDQUEwQlMsYUFBMUIsR0FBMEMsVUFBVVMsSUFBVixFQUFnQkosT0FBaEIsRUFBeUI7QUFDakUsY0FBUUksSUFBSSxDQUFDLENBQUQsQ0FBWjtBQUNFLGFBQUssR0FBTDtBQUFVO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBSixVQUFBQSxPQUFPLENBQUNqQixTQUFSLENBQWtCd0IsZUFBbEIsQ0FBa0NILElBQUksQ0FBQyxDQUFELENBQXRDLEVBQTJDQSxJQUFJLENBQUMsQ0FBRCxDQUEvQyxFQUFvREEsSUFBSSxDQUFDLENBQUQsQ0FBeEQsRUFBNkRBLElBQUksQ0FBQyxDQUFELENBQWpFLEVBQXNFQSxJQUFJLENBQUMsQ0FBRCxDQUExRTs7QUFDQTtBQVJKLE9BRGlFLENBV2pFOztBQUNELEtBWkQ7O0FBY0EsV0FBT3hCLGVBQVA7QUFDRCxHQXpGcUIsRUFBdEIsQ0FOdUIsQ0ErRmpCOzs7QUFDTkYsRUFBQUEsWUFBWSxDQUFDRSxlQUFiLEdBQStCQSxlQUEvQjtBQUVBO0FBQ0Y7QUFDQTtBQUNBOztBQUNFLE1BQUk0QixnQkFBZ0IsR0FBSSxZQUFZO0FBQ2xDO0FBQ0o7QUFDQTtBQUNJLGFBQVNBLGdCQUFULENBQTBCQyxNQUExQixFQUFrQ0MsV0FBbEMsRUFBK0M7QUFDN0MsV0FBSzVCLEdBQUwsR0FBVyxJQUFYO0FBQ0EsV0FBSzZCLE9BQUwsR0FBZUYsTUFBZjtBQUNBLFdBQUtHLFlBQUwsR0FBb0JGLFdBQXBCO0FBQ0EsV0FBS0csUUFBTCxHQUFnQixDQUFoQjtBQUNBLFdBQUtDLFNBQUwsR0FBaUIsQ0FBakI7QUFDQSxXQUFLQyxXQUFMLEdBQW1CLElBQW5CO0FBQ0EsV0FBS0MsYUFBTCxHQUFxQixDQUFyQjtBQUNELEtBWmlDLENBWWhDO0FBRUY7OztBQUNBUixJQUFBQSxnQkFBZ0IsQ0FBQ3RCLFNBQWpCLENBQTJCcUIsZUFBM0IsR0FBNkMsVUFBVVUsT0FBVixFQUFtQkMsUUFBbkIsRUFBNkJDLFlBQTdCLEVBQTJDQyxFQUEzQyxFQUErQ0MsSUFBL0MsRUFBcUQ7QUFDaEcsV0FBS1IsUUFBTCxHQUFnQkksT0FBaEI7QUFDQSxXQUFLSCxTQUFMLEdBQWlCSSxRQUFqQjtBQUNBLFdBQUtGLGFBQUwsR0FBcUJHLFlBQXJCLENBSGdHLENBSWhHOztBQUNBLFVBQUlBLFlBQVksSUFBSSxDQUFwQixFQUF1QjtBQUNyQjtBQUNBLGFBQUtyQyxHQUFMLEdBQVcsSUFBSU4sZ0JBQWdCLENBQUM4QyxRQUFyQixDQUE4Qi9DLE1BQU0sQ0FBQ2dELGtCQUFQLENBQTBCQyxFQUF4RCxFQUE0REosRUFBRSxHQUFHLEdBQUwsR0FBV0MsSUFBdkUsQ0FBWDtBQUNELE9BSEQsTUFHTyxJQUFJRixZQUFZLElBQUksQ0FBcEIsRUFBdUI7QUFDNUI7QUFDQSxhQUFLckMsR0FBTCxHQUFXLElBQUlOLGdCQUFnQixDQUFDOEMsUUFBckIsQ0FBOEIvQyxNQUFNLENBQUNnRCxrQkFBUCxDQUEwQkUsR0FBeEQsRUFBNkRMLEVBQUUsR0FBRyxHQUFMLEdBQVdDLElBQXhFLENBQVg7QUFDRDs7QUFDRCxVQUFJLEtBQUt2QyxHQUFMLElBQVksSUFBaEIsRUFBc0I7QUFDcEI7QUFDQSxhQUFLQSxHQUFMLENBQVNVLG9CQUFULENBQThCLElBQTlCLEVBQW9DLEtBQUtDLGtCQUF6QyxFQUE2RCxLQUFLQyxnQkFBbEUsRUFBb0YsS0FBS0MsYUFBekY7O0FBQ0EsYUFBS2IsR0FBTCxDQUFTYyxPQUFUO0FBQ0Q7QUFDRixLQWpCRCxDQWZrQyxDQWtDbEM7OztBQUNBWSxJQUFBQSxnQkFBZ0IsQ0FBQ3RCLFNBQWpCLENBQTJCd0MscUJBQTNCLEdBQW1ELFVBQVVDLGtCQUFWLEVBQThCO0FBQy9FLFdBQUtaLFdBQUwsR0FBbUJZLGtCQUFuQjtBQUNELEtBRkQsQ0FuQ2tDLENBdUNsQzs7O0FBQ0FuQixJQUFBQSxnQkFBZ0IsQ0FBQ3RCLFNBQWpCLENBQTJCTyxrQkFBM0IsR0FBZ0QsVUFBVU0sRUFBVixFQUFjQyxPQUFkLEVBQXVCO0FBQ3JFLGNBQVFELEVBQVI7QUFDRSxhQUFLeEIsTUFBTSxDQUFDMEIsVUFBUCxDQUFrQkMsV0FBbEIsQ0FBOEJOLE9BQW5DO0FBQTRDO0FBQzFDSSxVQUFBQSxPQUFPLENBQUNsQixHQUFSLENBQVlxQixRQUFaLENBQXFCLEdBQXJCLEVBQTBCSCxPQUFPLENBQUNhLFFBQWxDLEVBQTRDYixPQUFPLENBQUNjLFNBQXBELEVBREYsQ0FDa0U7OztBQUNoRTtBQUhKO0FBS0QsS0FORCxDQXhDa0MsQ0FnRGxDOzs7QUFDQU4sSUFBQUEsZ0JBQWdCLENBQUN0QixTQUFqQixDQUEyQlEsZ0JBQTNCLEdBQThDLFVBQVVVLElBQVYsRUFBZ0JKLE9BQWhCLEVBQXlCO0FBQ3JFLGNBQVFJLElBQUksQ0FBQyxDQUFELENBQVo7QUFDRSxhQUFLLEdBQUw7QUFBVTtBQUNSLGNBQUlBLElBQUksQ0FBQyxDQUFELENBQUosSUFBVyxDQUFmLEVBQWtCO0FBQ2hCO0FBQ0E7QUFDQUosWUFBQUEsT0FBTyxDQUFDbEIsR0FBUixDQUFZcUIsUUFBWixDQUFxQixHQUFyQixFQUEwQkgsT0FBTyxDQUFDVyxPQUFsQyxFQUEyQyxDQUFDLENBQTVDLEVBQStDLENBQUMsQ0FBaEQsRUFBbURYLE9BQU8sQ0FBQ1ksWUFBM0Q7QUFFRCxXQUxELE1BS087QUFDTCxvQkFBUVIsSUFBSSxDQUFDLENBQUQsQ0FBWjtBQUNFLG1CQUFLLENBQUw7QUFDRUMsZ0JBQUFBLE9BQU8sQ0FBQ0MsR0FBUixDQUFZLGFBQVo7QUFDQTs7QUFDRixtQkFBSyxDQUFMO0FBQ0VELGdCQUFBQSxPQUFPLENBQUNDLEdBQVIsQ0FBWSxjQUFaO0FBQ0E7O0FBQ0YsbUJBQUssQ0FBTDtBQUNFRCxnQkFBQUEsT0FBTyxDQUFDQyxHQUFSLENBQVksWUFBWjtBQUNBO0FBVEo7QUFZRDs7QUFDRDs7QUFFRixhQUFLLEdBQUw7QUFBVTtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFJRixJQUFJLENBQUMsQ0FBRCxDQUFKLElBQVcsQ0FBZixFQUFrQjtBQUNoQkosWUFBQUEsT0FBTyxDQUFDZSxXQUFSLENBQW9CUixlQUFwQixDQUFvQ0gsSUFBSSxDQUFDLENBQUQsQ0FBeEMsRUFBNkNBLElBQUksQ0FBQyxDQUFELENBQWpELEVBQXNESixPQUFPLENBQUNnQixhQUE5RCxFQUE2RVosSUFBSSxDQUFDLENBQUQsQ0FBakYsRUFBc0ZBLElBQUksQ0FBQyxDQUFELENBQTFGO0FBRUQsV0FIRCxNQUdPO0FBQ0wsb0JBQ0VBLElBQUksQ0FBQyxDQUFELENBRE4sQ0FDVTtBQURWO0FBR0UsbUJBQUssQ0FBTDtBQUNFQyxnQkFBQUEsT0FBTyxDQUFDQyxHQUFSLENBQVksb0JBQVo7QUFDQTs7QUFDRixtQkFBSyxDQUFMO0FBQ0VELGdCQUFBQSxPQUFPLENBQUNDLEdBQVIsQ0FBWSxnQkFBWjtBQUNBOztBQUNGLG1CQUFLLENBQUw7QUFDRUQsZ0JBQUFBLE9BQU8sQ0FBQ0MsR0FBUixDQUFZLG1CQUFaO0FBQ0E7QUFYSjtBQWNEOztBQUNEOztBQUVGLGFBQUssR0FBTDtBQUFVO0FBQ1IsY0FBSUYsSUFBSSxDQUFDLENBQUQsQ0FBSixJQUFXLENBQWYsRUFBa0I7QUFDaEI7QUFDQSxvQkFBUUEsSUFBSSxDQUFDLENBQUQsQ0FBWjtBQUNFLG1CQUFLLENBQUMsQ0FBTjtBQUNFQyxnQkFBQUEsT0FBTyxDQUFDQyxHQUFSLENBQVksUUFBWjtBQUNBOztBQUNGLG1CQUFLLENBQUw7QUFDRUQsZ0JBQUFBLE9BQU8sQ0FBQ0MsR0FBUixDQUFZLFFBQVo7QUFDQTs7QUFDRixtQkFBSyxDQUFMO0FBQ0VELGdCQUFBQSxPQUFPLENBQUNDLEdBQVIsQ0FBWSxNQUFaO0FBQ0E7O0FBQ0YsbUJBQUssQ0FBTDtBQUNFRCxnQkFBQUEsT0FBTyxDQUFDQyxHQUFSLENBQVksV0FBWjtBQUNBOztBQUNGLG1CQUFLLENBQUw7QUFDRUQsZ0JBQUFBLE9BQU8sQ0FBQ0MsR0FBUixDQUFZLE9BQVo7QUFDQTs7QUFDRixtQkFBSyxDQUFMO0FBQ0VELGdCQUFBQSxPQUFPLENBQUNDLEdBQVIsQ0FBWSxhQUFaO0FBQ0E7QUFsQko7QUFxQkQ7O0FBQ0Q7QUEzRUo7O0FBNkVBRCxNQUFBQSxPQUFPLENBQUNDLEdBQVIsQ0FBWSxzQkFBc0JGLElBQUksQ0FBQyxDQUFELENBQXRDO0FBQ0QsS0EvRUQsQ0FqRGtDLENBa0lsQzs7O0FBQ0FJLElBQUFBLGdCQUFnQixDQUFDdEIsU0FBakIsQ0FBMkJTLGFBQTNCLEdBQTJDLFVBQVVTLElBQVYsRUFBZ0JKLE9BQWhCLEVBQXlCO0FBQ2xFSyxNQUFBQSxPQUFPLENBQUNDLEdBQVIsQ0FBWSxtQkFBbUJGLElBQUksQ0FBQyxDQUFELENBQW5DO0FBQ0QsS0FGRDs7QUFJQSxXQUFPSSxnQkFBUDtBQUNELEdBeElzQixFQUF2QixDQXRHdUIsQ0E4T2pCOzs7QUFDTjlCLEVBQUFBLFlBQVksQ0FBQzhCLGdCQUFiLEdBQWdDQSxnQkFBaEM7QUFFQTtBQUNGO0FBQ0E7QUFDQTs7QUFDRSxNQUFJb0IsbUJBQW1CLEdBQUksWUFBWTtBQUNyQztBQUNKO0FBQ0E7QUFDSSxhQUFTQSxtQkFBVCxDQUE2QkMsT0FBN0IsRUFBc0M7QUFDcEMsV0FBSy9DLEdBQUwsR0FBVyxJQUFYO0FBQ0EsV0FBS2dELGVBQUwsR0FBdUIsSUFBdkI7QUFDQSxXQUFLakIsUUFBTCxHQUFnQixDQUFoQjtBQUNBLFdBQUtDLFNBQUwsR0FBaUIsQ0FBakI7QUFDQSxXQUFLaUIsUUFBTCxHQUFnQkYsT0FBaEI7QUFDRCxLQVZvQyxDQVVuQztBQUVGOzs7QUFDQUQsSUFBQUEsbUJBQW1CLENBQUMxQyxTQUFwQixDQUE4QnFCLGVBQTlCLEdBQWdELFVBQVVVLE9BQVYsRUFBbUJDLFFBQW5CLEVBQTZCQyxZQUE3QixFQUEyQ0MsRUFBM0MsRUFBK0NDLElBQS9DLEVBQXFEO0FBQ25HaEIsTUFBQUEsT0FBTyxDQUFDQyxHQUFSLENBQVksMkJBQTJCVyxPQUEzQixHQUFxQyxhQUFyQyxHQUFxREMsUUFBckQsR0FBZ0UsaUJBQWhFLEdBQW9GQyxZQUFwRixHQUFtRyxPQUFuRyxHQUE2R0MsRUFBN0csR0FBa0gsU0FBbEgsR0FBOEhDLElBQTFJO0FBQ0EsV0FBS1IsUUFBTCxHQUFnQkksT0FBaEI7QUFDQSxXQUFLSCxTQUFMLEdBQWlCSSxRQUFqQixDQUhtRyxDQUluRzs7QUFDQSxVQUFJQyxZQUFZLElBQUksQ0FBcEIsRUFBdUI7QUFDckI7QUFDQSxhQUFLckMsR0FBTCxHQUFXLElBQUlOLGdCQUFnQixDQUFDOEMsUUFBckIsQ0FBOEIvQyxNQUFNLENBQUNnRCxrQkFBUCxDQUEwQkMsRUFBeEQsRUFBNERKLEVBQUUsR0FBRyxHQUFMLEdBQVdDLElBQXZFLENBQVg7QUFDRCxPQUhELE1BR08sSUFBSUYsWUFBWSxJQUFJLENBQXBCLEVBQXVCO0FBQzVCO0FBQ0EsYUFBS3JDLEdBQUwsR0FBVyxJQUFJTixnQkFBZ0IsQ0FBQzhDLFFBQXJCLENBQThCL0MsTUFBTSxDQUFDZ0Qsa0JBQVAsQ0FBMEJFLEdBQXhELEVBQTZETCxFQUFFLEdBQUcsR0FBTCxHQUFXQyxJQUF4RSxDQUFYO0FBQ0Q7O0FBQ0QsVUFBSSxLQUFLdkMsR0FBTCxJQUFZLElBQWhCLEVBQXNCO0FBQ3BCO0FBQ0EsYUFBS0EsR0FBTCxDQUFTVSxvQkFBVCxDQUE4QixJQUE5QixFQUFvQyxLQUFLQyxrQkFBekMsRUFBNkQsS0FBS0MsZ0JBQWxFLEVBQW9GLEtBQUtDLGFBQXpGOztBQUNBLGFBQUtiLEdBQUwsQ0FBU2MsT0FBVDtBQUNEO0FBQ0YsS0FqQkQsQ0FicUMsQ0FnQ3JDOzs7QUFDQWdDLElBQUFBLG1CQUFtQixDQUFDMUMsU0FBcEIsQ0FBOEJPLGtCQUE5QixHQUFtRCxVQUFVTSxFQUFWLEVBQWNDLE9BQWQsRUFBdUI7QUFDeEUsY0FBUUQsRUFBUjtBQUNFLGFBQUt4QixNQUFNLENBQUMwQixVQUFQLENBQWtCQyxXQUFsQixDQUE4Qk4sT0FBbkM7QUFBNEM7QUFDMUNJLFVBQUFBLE9BQU8sQ0FBQ2xCLEdBQVIsQ0FBWXFCLFFBQVosQ0FBcUIsR0FBckIsRUFBMEJILE9BQU8sQ0FBQ2EsUUFBbEMsRUFBNENiLE9BQU8sQ0FBQ2MsU0FBcEQsRUFERixDQUNrRTs7O0FBQ2hFO0FBSEo7QUFLRCxLQU5ELENBakNxQyxDQXlDckM7OztBQUNBYyxJQUFBQSxtQkFBbUIsQ0FBQzFDLFNBQXBCLENBQThCUSxnQkFBOUIsR0FBaUQsVUFBVVUsSUFBVixFQUFnQkosT0FBaEIsRUFBeUI7QUFDeEVLLE1BQUFBLE9BQU8sQ0FBQ0MsR0FBUixDQUFZLHNCQUFzQkYsSUFBSSxDQUFDLENBQUQsQ0FBdEM7O0FBQ0EsY0FBUUEsSUFBSSxDQUFDLENBQUQsQ0FBWjtBQUNFLGFBQUssR0FBTDtBQUFVO0FBQ1JKLFVBQUFBLE9BQU8sQ0FBQ2xCLEdBQVIsQ0FBWXFCLFFBQVosQ0FBcUIsSUFBckIsRUFERixDQUM4QjtBQUM1Qjs7O0FBQ0E7QUFFRjtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7O0FBRUE7QUFDRUgsVUFBQUEsT0FBTyxDQUFDOEIsZUFBUixDQUF3QjFCLElBQXhCLEVBQThCSixPQUFPLENBQUNsQixHQUF0QyxFQUEyQ2tCLE9BQU8sQ0FBQytCLFFBQW5EOztBQUNBO0FBakJKO0FBbUJELEtBckJELENBMUNxQyxDQWdFckM7OztBQUNBSCxJQUFBQSxtQkFBbUIsQ0FBQzFDLFNBQXBCLENBQThCUyxhQUE5QixHQUE4QyxVQUFVUyxJQUFWLEVBQWdCSixPQUFoQixFQUF5QjtBQUNyRUssTUFBQUEsT0FBTyxDQUFDQyxHQUFSLENBQVksbUJBQW1CRixJQUFJLENBQUMsQ0FBRCxDQUFuQztBQUNELEtBRkQsQ0FqRXFDLENBcUVyQzs7O0FBQ0F3QixJQUFBQSxtQkFBbUIsQ0FBQzFDLFNBQXBCLENBQThCOEMsY0FBOUIsR0FBK0MsVUFBVUMsT0FBVixFQUFtQjtBQUNoRSxXQUFLSCxlQUFMLEdBQXVCRyxPQUF2QjtBQUNELEtBRkQsQ0F0RXFDLENBMEVyQzs7O0FBQ0FMLElBQUFBLG1CQUFtQixDQUFDMUMsU0FBcEIsQ0FBOEJnRCxLQUE5QixHQUFzQyxZQUFZO0FBQ2hELGFBQU8sS0FBS3BELEdBQVo7QUFDRCxLQUZEOztBQUlBLFdBQU84QyxtQkFBUDtBQUNELEdBaEZ5QixFQUExQixDQXJQdUIsQ0FxVWpCOzs7QUFDTmxELEVBQUFBLFlBQVksQ0FBQ2tELG1CQUFiLEdBQW1DQSxtQkFBbkM7QUFDRCxDQXZVRCxFQXVVR2xELFlBQVksS0FBS0EsWUFBWSxHQUFHLEVBQXBCLENBdlVmLEdBdVV5Qzs7O0FBRXpDeUQsTUFBTSxDQUFDQyxPQUFQLEdBQWlCMUQsWUFBakI7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZVJvb3QiOiIvIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgeyBPYnNlcnZhYmxlIH0gPSByZXF1aXJlKCcuL29ic2VydmFibGUuY2MnKTtcclxuY29uc3QgUGhvdG9uID0gcmVxdWlyZSgnLi9QaG90b24tSmF2YXNjcmlwdF9TREsnKTtcclxuY29uc3QgUGhvdG9uQ29udHJvbGxlciA9IHJlcXVpcmUoJy4vUGhvdG9uX0ludGVyZmFjZScpO1xyXG5sZXQgUHVibGljU2V0VXA9cmVxdWlyZSgnUHVibGljU2V0VXAnKTtcclxuLyoqXHJcbkBuYW1lc3BhY2UgQmFzZUNtZExvZ2ljXHJcbuiZleeQhueZu+WFpeOAgeWFpeWxgOetieW6leWxpOioiuaBr+eUqFxyXG4qL1xyXG4vLyBwcmV2ZW50IGdsb2JhbHMgcmVuYW1pbmcgYnkgY2xvc3VyZSBjb21waWxpZXJcclxudmFyIEJhc2VDbWRMb2dpYztcclxuXHJcbihmdW5jdGlvbiAoQmFzZUNtZExvZ2ljKSB7XHJcbiAgY29uc3Qgb2JzZXJ2YWJsZSA9IE9ic2VydmFibGUoKTtcclxuICAvKiogXHJcbiAgICAqIFxyXG4gICAgQGNsYXNzIE1haW5TcnZDbWRMb2dpY1xyXG4gICAgKi9cclxuICB2YXIgTWFpblNydkNtZExvZ2ljID0gKGZ1bmN0aW9uICgpIHtcclxuICAgIC8qKiBcclxuICAgICAgICBAY29uc3RydWN0b3JcclxuICAgICAgICBAcGFyYW0ge1Bob3RvbkNvbnRyb2xsZXIuUGhvdG9uSWZ9IHBpIHBob3RvbiBpbnRlcmZhY2VcclxuICAgICAgICAqL1xyXG4gICAgZnVuY3Rpb24gTWFpblNydkNtZExvZ2ljKHBpKSB7XHJcbiAgICAgIHRoaXMuX3BpID0gcGk7XHJcbiAgICAgIHRoaXMuX2xiU3J2T2JqID0gbnVsbDtcclxuICAgICAgdGhpcy5fYWNjb3VudCA9ICcnO1xyXG4gICAgICB0aGlzLl9wYXNzd29yZCA9ICcnO1xyXG4gICAgfSAvL2NvbnN0cnVjdG9yIGZ1bmN0aW9uIGVuZFxyXG5cclxuICAgIC8vbG9naW5cclxuICAgIE1haW5TcnZDbWRMb2dpYy5wcm90b3R5cGUuUnVuTG9naW4gPSBmdW5jdGlvbiAoYWNjb3VudCwgcGFzc3dvcmQsdHlwZSkge1xyXG4gICAgICB0aGlzLl9hY2NvdW50ID0gYWNjb3VudDtcclxuICAgICAgdGhpcy5fcGFzc3dvcmQgPSBwYXNzd29yZDtcclxuICAgICAgdGhpcy5fdHlwZSA9IHR5cGU7XHJcbiAgICAgIHRoaXMuX3BpLkluaXRDYWxsYmFja0Z1bmN0aW9uKHRoaXMsIHRoaXMuUGVlclN0YXR1c0NhbGxiYWNrLCB0aGlzLlJlc3BvbnNlQ2FsbGJhY2ssIHRoaXMuRXZlbnRDYWxsYmFjayk7XHJcbiAgICAgIHRoaXMuX3BpLmNvbm5lY3QoKTsgLy/lsI1tYWluIHNlcnZlcuWBmumAo+e3mlxyXG4gICAgfTtcclxuXHJcbiAgICAvL3NldCBsb2JieSBzZXJ2ZXIgY29tbWFuZCBsb2dpY1xyXG4gICAgTWFpblNydkNtZExvZ2ljLnByb3RvdHlwZS5TZXRMYlNydkNtZExvZ2ljT2JqID0gZnVuY3Rpb24gKGxiU3J2Q21kTG9naWNPYmopIHtcclxuICAgICAgdGhpcy5fbGJTcnZPYmogPSBsYlNydkNtZExvZ2ljT2JqO1xyXG4gICAgfTtcclxuXHJcbiAgICAvL3Bob3RvbiBwZWVyIHN0YXR1cyBjYWxsYmFjayBmdW5jdGlvblxyXG4gICAgTWFpblNydkNtZExvZ2ljLnByb3RvdHlwZS5QZWVyU3RhdHVzQ2FsbGJhY2sgPSBmdW5jdGlvbiAoc3QsIHNlbGZPYmopIHtcclxuICAgICAgc3dpdGNoIChzdCkge1xyXG4gICAgICAgIGNhc2UgUGhvdG9uLlBob3RvblBlZXIuU3RhdHVzQ29kZXMuY29ubmVjdDogLy/lt7LntpPpgKPkuIogbWFpbiBzZXJ2ZXJcclxuICAgICAgICAgIHNlbGZPYmouX3BpLnNlbmREYXRhKDEwMSwgc2VsZk9iai5fYWNjb3VudCwgc2VsZk9iai5fcGFzc3dvcmQsIHNlbGZPYmouX3R5cGUsIDAsICcnLCA5OTkpOyAvL+mAgeWHuuW4s+WvhlxyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgLy9waG90b24gcGVlciByZXBvbnNlIGNhbGxiYWNrIGZ1bmN0aW9uXHJcbiAgICBNYWluU3J2Q21kTG9naWMucHJvdG90eXBlLlJlc3BvbnNlQ2FsbGJhY2sgPSBmdW5jdGlvbiAodmFscywgc2VsZk9iaikge1xyXG4gICAgICBzd2l0Y2ggKHZhbHNbMF0pIHtcclxuICAgICAgICBjYXNlIDEwMTogLy9zZXJ2ZXLnq6/nmbvlhaXlm57lgrPoqIrmga9cclxuICAgICAgICAgIGlmICh2YWxzWzFdID09IDEpIHtcclxuICAgICAgICAgICAgLy/miJDlip9cclxuICAgICAgICAgICAgLy/nm7TmjqXnrYlzZXJ2ZXLpgJrnn6UgbG9iYnkgc2VydmVyIOizh+ioiuWGjeWBmumAo+e3mlxyXG5cclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHN3aXRjaCAoXHJcbiAgICAgICAgICAgICAgdmFsc1sxXSAvL++8iDDvvJrlpLHmlZcsIDLvvJrniYjmnKzpjK/oqqQsIDPvvJrntq3orbfkuK0sIDQ66YeN6KSH55m75YWlLCA1OuS5i+WJjemBiuaIsuWxgOWwmuacque1kOadnyA277ya5rKS5pyJ6YCy6KGM6YGK5oiy55qE5qyK6ZmQ77yI5rS95a6i5pyN77yJ77yJXHJcbiAgICAgICAgICAgICkge1xyXG4gICAgICAgICAgICAgIGNhc2UgMDpcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCfnmbvlhaVNYWluIFNyduWkseaVlycpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgY2FzZSAyOlxyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ+eZu+WFpU1haW4gU3J254mI5pys6Yyv6KqkJyk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICBjYXNlIDM6XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnTWFpbiBTcnbntq3orbfkuK0nKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgIGNhc2UgNDpcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdNYWluIFNydumHjeikh+eZu+WFpScpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgY2FzZSA1OlxyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ+S5i+WJjemBiuaIsuWxgOWwmuacque1kOadnycpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgY2FzZSA2OlxyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ+aykuaciemAsuihjOmBiuaIsueahOasiumZkCcpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy9jYy5kaXJlY3Rvci5sb2FkU2NlbmUoJ0xvZ2luJyk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgICAvL2NvbnNvbGUubG9nKFwibXMgcmVzcG9uc2U6XCIrdmFscyk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8vcGhvdG9uIHBlZXIgZXZlbnQgY2FsbGJhY2sgZnVuY3Rpb25cclxuICAgIE1haW5TcnZDbWRMb2dpYy5wcm90b3R5cGUuRXZlbnRDYWxsYmFjayA9IGZ1bmN0aW9uICh2YWxzLCBzZWxmT2JqKSB7XHJcbiAgICAgIHN3aXRjaCAodmFsc1swXSkge1xyXG4gICAgICAgIGNhc2UgMTAyOiAvL+eUsSBtYWluIHNlcnZlcumAmuefpeeahCBsb2JieSBzZXJ2ZXIg6LOH6KiKXHJcbiAgICAgICAgICAvL3ZhbHNbMV06bG9naW5JRFxyXG4gICAgICAgICAgLy92YWxzWzJdOmxvZ2luS2V5XHJcbiAgICAgICAgICAvL3ZhbHNbM106cHJvdG9jb2woMDpVbmtub3duIDE6VWRwIDI6VGNwIDM6V2ViU29ja2V0IDQ6SHR0cCA1OlNlY3VyZVdlYlNvY2tldClcclxuICAgICAgICAgIC8vdmFsc1s0XTppcFxyXG4gICAgICAgICAgLy92YWxzWzVdOnBvcnRcclxuICAgICAgICAgIHNlbGZPYmouX2xiU3J2T2JqLkNvbm5lY3RUb1NlcnZlcih2YWxzWzFdLCB2YWxzWzJdLCB2YWxzWzNdLCB2YWxzWzRdLCB2YWxzWzVdKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcbiAgICAgIC8vY29uc29sZS5sb2coXCJtcyBldmVudDpcIitldnQpO1xyXG4gICAgfTtcclxuXHJcbiAgICByZXR1cm4gTWFpblNydkNtZExvZ2ljO1xyXG4gIH0pKCk7IC8vY2xhc3MgZW5kXHJcbiAgQmFzZUNtZExvZ2ljLk1haW5TcnZDbWRMb2dpYyA9IE1haW5TcnZDbWRMb2dpYztcclxuXHJcbiAgLyoqIFxyXG4gICAgKiBcclxuICAgIEBjbGFzcyBMb2JieVNydkNtZExvZ2ljXHJcbiAgICAqL1xyXG4gIHZhciBMb2JieVNydkNtZExvZ2ljID0gKGZ1bmN0aW9uICgpIHtcclxuICAgIC8qKiBcclxuICAgICAgICBAY29uc3RydWN0b3JcclxuICAgICAgICAqL1xyXG4gICAgZnVuY3Rpb24gTG9iYnlTcnZDbWRMb2dpYyhnYW1laWQsIHZlcnNpb25jb2RlKSB7XHJcbiAgICAgIHRoaXMuX3BpID0gbnVsbDtcclxuICAgICAgdGhpcy5fZ2FtZWlkID0gZ2FtZWlkO1xyXG4gICAgICB0aGlzLl92ZXJzaW9uY29kZSA9IHZlcnNpb25jb2RlO1xyXG4gICAgICB0aGlzLl9sb2dpbklkID0gMDtcclxuICAgICAgdGhpcy5fbG9naW5LZXkgPSAwO1xyXG4gICAgICB0aGlzLl9nYW1lU3J2T2JqID0gbnVsbDtcclxuICAgICAgdGhpcy5fcHJvdG9jb2xUeXBlID0gMDtcclxuICAgIH0gLy9jb25zdHJ1Y3RvciBmdW5jdGlvbiBlbmRcclxuXHJcbiAgICAvL2Nvbm5lY3QgdG8gbG9iYnkgc2VydmVyXHJcbiAgICBMb2JieVNydkNtZExvZ2ljLnByb3RvdHlwZS5Db25uZWN0VG9TZXJ2ZXIgPSBmdW5jdGlvbiAobG9naW5JZCwgbG9naW5LZXksIHByb3RvY29sVHlwZSwgaXAsIHBvcnQpIHtcclxuICAgICAgdGhpcy5fbG9naW5JZCA9IGxvZ2luSWQ7XHJcbiAgICAgIHRoaXMuX2xvZ2luS2V5ID0gbG9naW5LZXk7XHJcbiAgICAgIHRoaXMuX3Byb3RvY29sVHlwZSA9IHByb3RvY29sVHlwZTtcclxuICAgICAgLy/nm67liY3lj6rmnIPmnIkgV2ViU29ja2V0IOaIliBTZWN1cmVXZWJTb2NrZXQg5YWp56iuIHByb3RvY29sXHJcbiAgICAgIGlmIChwcm90b2NvbFR5cGUgPT0gMykge1xyXG4gICAgICAgIC8vV2ViU29ja2V0XHJcbiAgICAgICAgdGhpcy5fcGkgPSBuZXcgUGhvdG9uQ29udHJvbGxlci5QaG90b25JZihQaG90b24uQ29ubmVjdGlvblByb3RvY29sLldzLCBpcCArICc6JyArIHBvcnQpO1xyXG4gICAgICB9IGVsc2UgaWYgKHByb3RvY29sVHlwZSA9PSA1KSB7XHJcbiAgICAgICAgLy9TZWN1cmVXZWJTb2NrZXRcclxuICAgICAgICB0aGlzLl9waSA9IG5ldyBQaG90b25Db250cm9sbGVyLlBob3RvbklmKFBob3Rvbi5Db25uZWN0aW9uUHJvdG9jb2wuV3NzLCBpcCArICc6JyArIHBvcnQpO1xyXG4gICAgICB9XHJcbiAgICAgIGlmICh0aGlzLl9waSAhPSBudWxsKSB7XHJcbiAgICAgICAgLy/oqK3lrpogUGhvdG9uIEludGVyZmFjZSDnianku7bnmoQgQ2FsbGJhY2sgRnVuY3Rpb25cclxuICAgICAgICB0aGlzLl9waS5Jbml0Q2FsbGJhY2tGdW5jdGlvbih0aGlzLCB0aGlzLlBlZXJTdGF0dXNDYWxsYmFjaywgdGhpcy5SZXNwb25zZUNhbGxiYWNrLCB0aGlzLkV2ZW50Q2FsbGJhY2spO1xyXG4gICAgICAgIHRoaXMuX3BpLmNvbm5lY3QoKTtcclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICAvL3NldCBnYW1lIHNlcnZlciBjb21tYW5kIGxvZ2ljXHJcbiAgICBMb2JieVNydkNtZExvZ2ljLnByb3RvdHlwZS5TZXRHYW1lU3J2Q21kTG9naWNPYmogPSBmdW5jdGlvbiAoZ2FtZVNydkNtZExvZ2ljT2JqKSB7XHJcbiAgICAgIHRoaXMuX2dhbWVTcnZPYmogPSBnYW1lU3J2Q21kTG9naWNPYmo7XHJcbiAgICB9O1xyXG5cclxuICAgIC8vcGhvdG9uIHBlZXIgc3RhdHVzIGNhbGxiYWNrIGZ1bmN0aW9uXHJcbiAgICBMb2JieVNydkNtZExvZ2ljLnByb3RvdHlwZS5QZWVyU3RhdHVzQ2FsbGJhY2sgPSBmdW5jdGlvbiAoc3QsIHNlbGZPYmopIHtcclxuICAgICAgc3dpdGNoIChzdCkge1xyXG4gICAgICAgIGNhc2UgUGhvdG9uLlBob3RvblBlZXIuU3RhdHVzQ29kZXMuY29ubmVjdDogLy/lt7LntpPpgKPkuIogbG9iYnkgc2VydmVyXHJcbiAgICAgICAgICBzZWxmT2JqLl9waS5zZW5kRGF0YSgxMDEsIHNlbGZPYmouX2xvZ2luSWQsIHNlbGZPYmouX2xvZ2luS2V5KTsgLy/pgIHlh7psb2dpbiBpZCDoiIcga2V5XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICAvL3Bob3RvbiBwZWVyIHJlcG9uc2UgY2FsbGJhY2sgZnVuY3Rpb25cclxuICAgIExvYmJ5U3J2Q21kTG9naWMucHJvdG90eXBlLlJlc3BvbnNlQ2FsbGJhY2sgPSBmdW5jdGlvbiAodmFscywgc2VsZk9iaikge1xyXG4gICAgICBzd2l0Y2ggKHZhbHNbMF0pIHtcclxuICAgICAgICBjYXNlIDEwMjogLy/nmbvlhaXni4DmhYvlm57opoZcclxuICAgICAgICAgIGlmICh2YWxzWzFdID09IDEpIHtcclxuICAgICAgICAgICAgLy8vL+eLgOaFi+S7o+eivO+8iDDvvJrlpLHmlZcsIDHvvJrmiJDlip8sIDLvvJrniYjmnKzpjK/oqqQsIDPvvJrntq3orbfkuK3vvIlcclxuICAgICAgICAgICAgLy/liqDlhaXpgYrmiLLlsYDvvIh0aGlzLl9nYW1laWTvvIlcclxuICAgICAgICAgICAgc2VsZk9iai5fcGkuc2VuZERhdGEoMTAzLCBzZWxmT2JqLl9nYW1laWQsIC0xLCAtMSwgc2VsZk9iai5fdmVyc2lvbmNvZGUpO1xyXG5cclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHN3aXRjaCAodmFsc1sxXSkge1xyXG4gICAgICAgICAgICAgIGNhc2UgMDpcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCfnmbvlhaVMQiBTcnYg5aSx5pWXJyk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICBjYXNlIDI6XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygn55m75YWlTEIgU3J254mI5pys6Yyv6KqkJyk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICBjYXNlIDM6XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnTEIgU3J2IOe2reitt+S4rScpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgY2FzZSAxMDM6IC8vc2VydmVy6YCB5Zue55qEZ2FtZSBzZXJ2ZXLpgKPnt5ros4foqIpcclxuICAgICAgICAgIC8vdmFsc1sxXTpsb2dpbklEXHJcbiAgICAgICAgICAvL3ZhbHNbMl06bG9naW5LZXlcclxuICAgICAgICAgIC8vdmFsc1szXTppcFxyXG4gICAgICAgICAgLy92YWxzWzRdOnBvcnRcclxuICAgICAgICAgIC8vdmFsc1s1XTpyZXN1bHRcclxuICAgICAgICAgIGlmICh2YWxzWzVdID09IDEpIHtcclxuICAgICAgICAgICAgc2VsZk9iai5fZ2FtZVNydk9iai5Db25uZWN0VG9TZXJ2ZXIodmFsc1sxXSwgdmFsc1syXSwgc2VsZk9iai5fcHJvdG9jb2xUeXBlLCB2YWxzWzNdLCB2YWxzWzRdKTtcclxuXHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBzd2l0Y2ggKFxyXG4gICAgICAgICAgICAgIHZhbHNbNV0gLy8w77ya6Yyv6KqkIDHvvJrmiJDlip8gMjrpgYrmiLLntq3orbfkuK0gMzrniYjmnKzpjK/oqqRcclxuICAgICAgICAgICAgKSB7XHJcbiAgICAgICAgICAgICAgY2FzZSAwOlxyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ+WKoOWFpWdhbWUgc2VydmVy6YGK5oiy5bGA6Yyv6KqkJyk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICBjYXNlIDI6XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnR2FtZSBTcnYg6YGK5oiy57at6K235LitJyk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICBjYXNlIDM6XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygn6KaB5rGC5Yqg5YWlR2FtZSBTcnYg54mI5pys6Yyv6KqkJyk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICBjYXNlIDEwNDogLy/liqDlhaVnYW1lIHNlcnZlcumBiuaIsuWxgOe1kOaenOWbnuimhijlm6Dngrrlj6/og73mnIPooqtnYW1lIHNlcnZlcuW8t+WItuaWt+e3mu+8jOaJgOS7peeUsWxvYmJ5IHNlcnZlcumAsuihjOWbnuimhilcclxuICAgICAgICAgIGlmICh2YWxzWzFdICE9IDEpIHtcclxuICAgICAgICAgICAgLy8tMe+8muW7uueri+aIv+mWk+WkseaVlyAw77ya6Yyv6KqkIDE65oiQ5YqfIDLvvJrpu57mlbjkuI3otrMgM++8muaykuaciemAsuihjOmBiuaIsueahOasiumZkO+8iOa0veWuouacje+8iSBdLCA077ya54Sh5Y+v55So5oi/6ZaTLCA177ya5q2k546p5a625LmL5YmN6YGK5oiy5bGA5pyq57WQ5p2fXHJcbiAgICAgICAgICAgIHN3aXRjaCAodmFsc1sxXSkge1xyXG4gICAgICAgICAgICAgIGNhc2UgLTE6XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygn5bu656uL5oi/6ZaT5aSx5pWXJyk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICBjYXNlIDA6XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygn5Yqg5YWl6YGK5oiy6Yyv6KqkJyk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICBjYXNlIDI6XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygn6bue5pW45LiN6LazJyk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICBjYXNlIDM6XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygn5rKS5pyJ6YCy6KGM6YGK5oiy55qE5qyK6ZmQJyk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICBjYXNlIDQ6XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygn54Sh5Y+v55So5oi/6ZaTJyk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICBjYXNlIDU6XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygn5q2k546p5a625LmL5YmN6YGK5oiy5bGA5pyq57WQ5p2fJyk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcbiAgICAgIGNvbnNvbGUubG9nKCdscyByZXNwb25zZSwgY21kOicgKyB2YWxzWzBdKTtcclxuICAgIH07XHJcblxyXG4gICAgLy9waG90b24gcGVlciBldmVudCBjYWxsYmFjayBmdW5jdGlvblxyXG4gICAgTG9iYnlTcnZDbWRMb2dpYy5wcm90b3R5cGUuRXZlbnRDYWxsYmFjayA9IGZ1bmN0aW9uICh2YWxzLCBzZWxmT2JqKSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKCdscyBldmVudCwgY21kOicgKyB2YWxzWzBdKTtcclxuICAgIH07XHJcblxyXG4gICAgcmV0dXJuIExvYmJ5U3J2Q21kTG9naWM7XHJcbiAgfSkoKTsgLy9jbGFzcyBlbmRcclxuICBCYXNlQ21kTG9naWMuTG9iYnlTcnZDbWRMb2dpYyA9IExvYmJ5U3J2Q21kTG9naWM7XHJcblxyXG4gIC8qKiBcclxuICAgICogXHJcbiAgICBAY2xhc3MgR2FtZVNydkJhc2VDbWRMb2dpY1xyXG4gICAgKi9cclxuICB2YXIgR2FtZVNydkJhc2VDbWRMb2dpYyA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICAvKiogXHJcbiAgICAgICAgQGNvbnN0cnVjdG9yXHJcbiAgICAgICAgKi9cclxuICAgIGZ1bmN0aW9uIEdhbWVTcnZCYXNlQ21kTG9naWMoR2FtZU9iaikge1xyXG4gICAgICB0aGlzLl9waSA9IG51bGw7XHJcbiAgICAgIHRoaXMuX0dhbWVDbWRGdW5jT2JqID0gbnVsbDtcclxuICAgICAgdGhpcy5fbG9naW5JZCA9IDA7XHJcbiAgICAgIHRoaXMuX2xvZ2luS2V5ID0gMDtcclxuICAgICAgdGhpcy5fR2FtZU9iaiA9IEdhbWVPYmo7XHJcbiAgICB9IC8vY29uc3RydWN0b3IgZnVuY3Rpb24gZW5kXHJcblxyXG4gICAgLy9jb25uZWN0IHRvIGdhbWUgc2VydmVyXHJcbiAgICBHYW1lU3J2QmFzZUNtZExvZ2ljLnByb3RvdHlwZS5Db25uZWN0VG9TZXJ2ZXIgPSBmdW5jdGlvbiAobG9naW5JZCwgbG9naW5LZXksIHByb3RvY29sVHlwZSwgaXAsIHBvcnQpIHtcclxuICAgICAgY29uc29sZS5sb2coJ2Nvbm5lY3QgdG8gZ3MgbG9naW5JZDonICsgbG9naW5JZCArICcsIGxvZ2luS2V5OicgKyBsb2dpbktleSArICcsIHByb3RvY29sVHlwZTonICsgcHJvdG9jb2xUeXBlICsgJywgaXA6JyArIGlwICsgJywgcG9ydDonICsgcG9ydCk7XHJcbiAgICAgIHRoaXMuX2xvZ2luSWQgPSBsb2dpbklkO1xyXG4gICAgICB0aGlzLl9sb2dpbktleSA9IGxvZ2luS2V5O1xyXG4gICAgICAvL+ebruWJjeWPquacg+aciSBXZWJTb2NrZXQg5oiWIFNlY3VyZVdlYlNvY2tldCDlhannqK4gcHJvdG9jb2xcclxuICAgICAgaWYgKHByb3RvY29sVHlwZSA9PSAzKSB7XHJcbiAgICAgICAgLy9XZWJTb2NrZXRcclxuICAgICAgICB0aGlzLl9waSA9IG5ldyBQaG90b25Db250cm9sbGVyLlBob3RvbklmKFBob3Rvbi5Db25uZWN0aW9uUHJvdG9jb2wuV3MsIGlwICsgJzonICsgcG9ydCk7XHJcbiAgICAgIH0gZWxzZSBpZiAocHJvdG9jb2xUeXBlID09IDUpIHtcclxuICAgICAgICAvL1NlY3VyZVdlYlNvY2tldFxyXG4gICAgICAgIHRoaXMuX3BpID0gbmV3IFBob3RvbkNvbnRyb2xsZXIuUGhvdG9uSWYoUGhvdG9uLkNvbm5lY3Rpb25Qcm90b2NvbC5Xc3MsIGlwICsgJzonICsgcG9ydCk7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKHRoaXMuX3BpICE9IG51bGwpIHtcclxuICAgICAgICAvL+ioreWumiBQaG90b24gSW50ZXJmYWNlIOeJqeS7tueahCBDYWxsYmFjayBGdW5jdGlvblxyXG4gICAgICAgIHRoaXMuX3BpLkluaXRDYWxsYmFja0Z1bmN0aW9uKHRoaXMsIHRoaXMuUGVlclN0YXR1c0NhbGxiYWNrLCB0aGlzLlJlc3BvbnNlQ2FsbGJhY2ssIHRoaXMuRXZlbnRDYWxsYmFjayk7XHJcbiAgICAgICAgdGhpcy5fcGkuY29ubmVjdCgpO1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIC8vcGhvdG9uIHBlZXIgc3RhdHVzIGNhbGxiYWNrIGZ1bmN0aW9uXHJcbiAgICBHYW1lU3J2QmFzZUNtZExvZ2ljLnByb3RvdHlwZS5QZWVyU3RhdHVzQ2FsbGJhY2sgPSBmdW5jdGlvbiAoc3QsIHNlbGZPYmopIHtcclxuICAgICAgc3dpdGNoIChzdCkge1xyXG4gICAgICAgIGNhc2UgUGhvdG9uLlBob3RvblBlZXIuU3RhdHVzQ29kZXMuY29ubmVjdDogLy/lt7LntpPpgKPkuIogZ2FtZSBzZXJ2ZXJcclxuICAgICAgICAgIHNlbGZPYmouX3BpLnNlbmREYXRhKDEwMSwgc2VsZk9iai5fbG9naW5JZCwgc2VsZk9iai5fbG9naW5LZXkpOyAvL+mAgeWHumxvZ2luIGlkIOiIhyBrZXlcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIC8vcGhvdG9uIHBlZXIgcmVwb25zZSBjYWxsYmFjayBmdW5jdGlvblxyXG4gICAgR2FtZVNydkJhc2VDbWRMb2dpYy5wcm90b3R5cGUuUmVzcG9uc2VDYWxsYmFjayA9IGZ1bmN0aW9uICh2YWxzLCBzZWxmT2JqKSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKCdncyByZXNwb25zZSwgY21kOicgKyB2YWxzWzBdKTtcclxuICAgICAgc3dpdGNoICh2YWxzWzBdKSB7XHJcbiAgICAgICAgY2FzZSAxMTE6IC8v5pS25YiwZ2FtZemBiuaIsuWxgOW3sue2k+a6luWCmeWujOaIkOeahOioiuaBr++8iOWPquacg+acieS4gOasoe+8iVxyXG4gICAgICAgICAgc2VsZk9iai5fcGkuc2VuZERhdGEoMzE2MSk7IC8v6YCB5Ye6MzE2Me+8jOWPluW+l+acrOahjOeahOizh+ioiijpgJrnn6VzZXJ2ZXLliY3nq6/pgYrmiLLlt7LntpPmupblgpnlsLHnt5IpXHJcbiAgICAgICAgICAvL+aKvOazqOeCujMxNjJcclxuICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAvLyBjYXNlIDMwNzI6IC8v44CA5Zue5YKz5pys5qGM55qE6LOH6KiKXHJcbiAgICAgICAgLy8gICBicmVhaztcclxuXHJcbiAgICAgICAgLy8gY2FzZSAzMDczOiAvL+OAgOWbnuWCs+aKvOazqOe1kOaenOizh+ioilxyXG4gICAgICAgIC8vICAgYnJlYWs7XHJcblxyXG4gICAgICAgIC8vIGNhc2UgMzA3NDogLy/jgIDpgJrnn6XpgYrmiLLnq6/lhY3osrvpgYrmiLLntZDmnZ9cclxuICAgICAgICAvLyAgIGJyZWFrO1xyXG5cclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgc2VsZk9iai5fR2FtZUNtZEZ1bmNPYmoodmFscywgc2VsZk9iai5fcGksIHNlbGZPYmouX0dhbWVPYmopO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuICAgIH07XHJcbiAgICAvL3Bob3RvbiBwZWVyIGV2ZW50IGNhbGxiYWNrIGZ1bmN0aW9uXHJcbiAgICBHYW1lU3J2QmFzZUNtZExvZ2ljLnByb3RvdHlwZS5FdmVudENhbGxiYWNrID0gZnVuY3Rpb24gKHZhbHMsIHNlbGZPYmopIHtcclxuICAgICAgY29uc29sZS5sb2coJ2dzIGV2ZW50LCBjbWQ6JyArIHZhbHNbMF0pO1xyXG4gICAgfTtcclxuXHJcbiAgICAvL3NldCBnYW1lIGNtZCBmdW5jdGlvblxyXG4gICAgR2FtZVNydkJhc2VDbWRMb2dpYy5wcm90b3R5cGUuU2V0R2FtZUNtZEZ1bmMgPSBmdW5jdGlvbiAoRnVuY09iaikge1xyXG4gICAgICB0aGlzLl9HYW1lQ21kRnVuY09iaiA9IEZ1bmNPYmo7XHJcbiAgICB9O1xyXG5cclxuICAgIC8vR2V0IFBob3RvbiBJbnRlcmZhY2Ugb2JqZWN0XHJcbiAgICBHYW1lU3J2QmFzZUNtZExvZ2ljLnByb3RvdHlwZS5HZXRQSSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgcmV0dXJuIHRoaXMuX3BpO1xyXG4gICAgfTtcclxuXHJcbiAgICByZXR1cm4gR2FtZVNydkJhc2VDbWRMb2dpYztcclxuICB9KSgpOyAvL2NsYXNzIGVuZFxyXG4gIEJhc2VDbWRMb2dpYy5HYW1lU3J2QmFzZUNtZExvZ2ljID0gR2FtZVNydkJhc2VDbWRMb2dpYztcclxufSkoQmFzZUNtZExvZ2ljIHx8IChCYXNlQ21kTG9naWMgPSB7fSkpOyAvL25hbWVzcGFjZSBlbmRcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQmFzZUNtZExvZ2ljO1xyXG5cclxuLypcclxuICAgIC8v5YSq5YWI6JmV55CG5bqV5bGkc2VydmVyIGV2ZW5077yM5pyq6JmV55CG55qE5bCB5YyF5pyD6YCP6YGOIGRlZmF1bHQg5YKz57Wm5aSW6YOo54mp5Lu2XHJcbiAgICBQaG90b25JZi5wcm90b3R5cGUuQmFzZUV2ZW50Q2FsbGJhY2sgPSBmdW5jdGlvbih2YWxzLCBvdXRPYmope1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiQmFzZUV2ZW50Q2FsbGJhY2tcIik7XHJcbiAgICAgICAgc3dpdGNoKHZhbHNbMF0pe1xyXG4gICAgICAgICAgICBjYXNlIDEwMjpcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgdGhpcy5fb3V0RXZlbnRDYWxsYmFjayh2YWxzLCBvdXRPYmopO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8v6JmV55CGIG1haW4gc2VydmVy55qE5bCB5YyF6KiK5oGvXHJcbiAgICBQaG90b25JZi5wcm90b3R5cGUuUHJvY01haW5TcnZSZXNwb25zZSA9IGZ1bmN0aW9uKHZhbHMsIG91dE9iail7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJQcm9jTWFpblNydlJlc3BvbnNlLCBjbWQgaWQ6XCIrdmFsc1swXSk7XHJcbiAgICAgICAgc3dpdGNoKHZhbHNbMF0pe1xyXG4gICAgICAgICAgICBjYXNlIDEwMTpcclxuICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coXCJ2YWxzIDE6XCIrdmFsc1sxXSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgIHRoaXMuX291dFJzcENhbGxiYWNrKHZhbHMsIG91dE9iaik7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIC8v6JmV55CGIGxvYmJ5IHNlcnZlcueahOWwgeWMheioiuaBr1xyXG4gICAgUGhvdG9uSWYucHJvdG90eXBlLlByb2NMb2JieVNydlJlc3BvbnNlID0gZnVuY3Rpb24odmFscywgb3V0T2JqKXtcclxuICAgICAgICBjb25zb2xlLmxvZyhcIlByb2NMb2JieVNydlJlc3BvbnNlLCBjbWQgaWQ6XCIrdmFsc1swXSk7XHJcbiAgICAgICAgc3dpdGNoKHZhbHNbMF0pe1xyXG4gICAgICAgICAgICBjYXNlIDEwMTpcclxuICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coXCJ2YWxzIDE6XCIrdmFsc1sxXSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgIHRoaXMuX291dFJzcENhbGxiYWNrKHZhbHMsIG91dE9iaik7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIC8v6JmV55CGIGdhbWUgc2VydmVy55qE5bCB5YyF6KiK5oGvXHJcbiAgICBQaG90b25JZi5wcm90b3R5cGUuUHJvY0dhbWVTcnZSZXNwb25zZSA9IGZ1bmN0aW9uKHZhbHMsIG91dE9iail7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJQcm9jR2FtZVNydlJlc3BvbnNlLCBjbWQgaWQ6XCIrdmFsc1swXSk7XHJcbiAgICAgICAgc3dpdGNoKHZhbHNbMF0pe1xyXG4gICAgICAgICAgICBjYXNlIDEwMTpcclxuICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coXCJ2YWxzIDE6XCIrdmFsc1sxXSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgIHRoaXMuX291dFJzcENhbGxiYWNrKHZhbHMsIG91dE9iaik7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG4qL1xyXG4iXX0=