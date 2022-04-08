"use strict";
cc._RF.push(module, '1d3092UE5JFUbiiQ9S4HGIj', 'Photon_Interface');
// scripts/Photon_Interface.js

"use strict";

var Photon = require('./Photon-Javascript_SDK');
/**
@namespace PhotonController
*/
// prevent globals renaming by closure compilier


var PhotonController;

(function (PhotonController) {
  /** 
     * 
     @class 
     */
  var PhotonIf = function () {
    /** 
        @constructor
        @param {Photon.ConnectionProtocol} protocol Connection protocol.
        @param {string} address Server address:port.
         */
    function PhotonIf(protocol, address) {
      this._ppr = new Photon.PhotonPeer(protocol, address, '', '');
    } //constructor function end

    /** 
        @設定peer的CallbackFunction
        @param {object} outsideObj The object who own callback function
        @param {Function} stcallback Photonpeer status callback function
        @param {Function} rspcallback Photon server response callback function
        @param {Function} srvevtcallback Photon server event callback function
        */


    PhotonIf.prototype.InitCallbackFunction = function (outsideObj, stcallback, rspcallback, eventcallback) {
      //status callback function
      this._ppr.addPeerStatusListener(Photon.PhotonPeer.StatusCodes.connecting, function () {
        stcallback(Photon.PhotonPeer.StatusCodes.connecting, outsideObj);
      });

      this._ppr.addPeerStatusListener(Photon.PhotonPeer.StatusCodes.connect, function () {
        stcallback(Photon.PhotonPeer.StatusCodes.connect, outsideObj);
      });

      this._ppr.addPeerStatusListener(Photon.PhotonPeer.StatusCodes.connectFailed, function () {
        stcallback(Photon.PhotonPeer.StatusCodes.connectFailed, outsideObj);
      });

      this._ppr.addPeerStatusListener(Photon.PhotonPeer.StatusCodes.disconnect, function () {
        stcallback(Photon.PhotonPeer.StatusCodes.disconnect, outsideObj);
      });

      this._ppr.addPeerStatusListener(Photon.PhotonPeer.StatusCodes.timeout, function () {
        stcallback(Photon.PhotonPeer.StatusCodes.timeout, outsideObj);
      });

      this._ppr.addPeerStatusListener(Photon.PhotonPeer.StatusCodes.error, function () {
        stcallback(Photon.PhotonPeer.StatusCodes.error, outsideObj);
      });

      this._ppr.addPeerStatusListener(Photon.PhotonPeer.StatusCodes.connectClosed, function () {
        stcallback(Photon.PhotonPeer.StatusCodes.connectClosed, outsideObj);
      }); //reponse callback function


      this._ppr.addResponseListener(1, function (data) {
        var jsonstr = JSON.stringify(data);
        var obj = JSON.parse(jsonstr);

        if (obj.errCode == 0) {
          rspcallback(obj.vals, outsideObj);
        } else {
          //something error
          console.log('errCode:' + obj.errCode + ', errMsg:' + obj.errMsg);
        }
      }); //event callback function


      this._ppr.addEventListener(2, function test(b) {
        var jsonstr = JSON.stringify(b);
        var obj = JSON.parse(jsonstr);
        eventcallback(obj.vals, outsideObj);
      });
    }; //connect to server


    PhotonIf.prototype.connect = function () {
      this._ppr.connect();
    }; //send data to server


    PhotonIf.prototype.sendData = function (nCmdId) {
      var op = [0, nCmdId];

      for (var i = 0; i < (arguments.length <= 1 ? 0 : arguments.length - 1); ++i) {
        op.push(i + 1, i + 1 < 1 || arguments.length <= i + 1 ? undefined : arguments[i + 1]);
      }

      console.log('send cmd' + op);

      this._ppr.sendOperation(1, op);
    };

    return PhotonIf;
  }(); //class end


  PhotonController.PhotonIf = PhotonIf;
})(PhotonController || (PhotonController = {})); //namespace end


module.exports = PhotonController;

cc._RF.pop();