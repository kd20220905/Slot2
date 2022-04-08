
(function () {
var scripts = [{"deps":{"./assets/scripts/Photon-Javascript_SDK":12,"./assets/scripts/Photon_Interface":38,"./assets/scripts/PublicSetUp":4,"./assets/scripts/autoPlayButton":2,"./assets/scripts/buildSymbols":5,"./assets/scripts/co.cc":8,"./assets/scripts/connectToServer":3,"./assets/scripts/decBetButton":6,"./assets/scripts/getSymbolAnchor":9,"./assets/scripts/getSymbolSprite":10,"./assets/scripts/handleGameCommand":7,"./assets/scripts/historyButton":11,"./assets/scripts/homeButton":13,"./assets/scripts/incBetButton":15,"./assets/scripts/lineFrames":14,"./assets/scripts/login":36,"./assets/scripts/mainController":17,"./assets/scripts/maxBetButton":16,"./assets/scripts/menuButton":19,"./assets/scripts/menuController":18,"./assets/scripts/observable.cc":21,"./assets/scripts/pauseButton":20,"./assets/scripts/performanceController":22,"./assets/scripts/playAll":23,"./assets/scripts/playEffect":24,"./assets/scripts/playLine":25,"./assets/scripts/playSymbolCol":26,"./assets/scripts/playVideo":39,"./assets/scripts/readMeButton":27,"./assets/scripts/requestGameResult":28,"./assets/scripts/requestTableInfo":30,"./assets/scripts/shuffle":29,"./assets/scripts/soundOffButton":32,"./assets/scripts/soundOnButton":35,"./assets/scripts/symbolGridIndexMapping":34,"./assets/scripts/value-types.cc":33,"./assets/scripts/videoReady":31,"./assets/scripts/BaseCmdLogic":37,"./assets/scripts/LoginScene":1},"path":"preview-scripts/__qc_index__.js"},{"deps":{"PublicSetUp":4},"path":"preview-scripts/assets/scripts/LoginScene.js"},{"deps":{},"path":"preview-scripts/assets/scripts/autoPlayButton.js"},{"deps":{"./BaseCmdLogic":37,"./handleGameCommand":7,"./Photon_Interface":38},"path":"preview-scripts/assets/scripts/connectToServer.js"},{"deps":{},"path":"preview-scripts/assets/scripts/PublicSetUp.js"},{"deps":{"./getSymbolAnchor":9,"./getSymbolSprite":10},"path":"preview-scripts/assets/scripts/buildSymbols.js"},{"deps":{},"path":"preview-scripts/assets/scripts/decBetButton.js"},{"deps":{},"path":"preview-scripts/assets/scripts/handleGameCommand.js"},{"deps":{"./value-types.cc":33},"path":"preview-scripts/assets/scripts/co.cc.js"},{"deps":{},"path":"preview-scripts/assets/scripts/getSymbolAnchor.js"},{"deps":{},"path":"preview-scripts/assets/scripts/getSymbolSprite.js"},{"deps":{},"path":"preview-scripts/assets/scripts/historyButton.js"},{"deps":{},"path":"preview-scripts/assets/scripts/Photon-Javascript_SDK.js"},{"deps":{},"path":"preview-scripts/assets/scripts/homeButton.js"},{"deps":{},"path":"preview-scripts/assets/scripts/lineFrames.js"},{"deps":{},"path":"preview-scripts/assets/scripts/incBetButton.js"},{"deps":{},"path":"preview-scripts/assets/scripts/maxBetButton.js"},{"deps":{"./co.cc":8,"./connectToServer":3,"PublicSetUp":4},"path":"preview-scripts/assets/scripts/mainController.js"},{"deps":{"./co.cc":8},"path":"preview-scripts/assets/scripts/menuController.js"},{"deps":{},"path":"preview-scripts/assets/scripts/menuButton.js"},{"deps":{},"path":"preview-scripts/assets/scripts/pauseButton.js"},{"deps":{"./co.cc":8,"./value-types.cc":33},"path":"preview-scripts/assets/scripts/observable.cc.js"},{"deps":{"./buildSymbols":5,"./co.cc":8,"./playAll":23,"./shuffle":29,"./requestTableInfo":30,"./requestGameResult":28,"PublicSetUp":4},"path":"preview-scripts/assets/scripts/performanceController.js"},{"deps":{"./co.cc":8,"./playLine":25,"./playSymbolCol":26,"./playVideo":39,"PublicSetUp":4},"path":"preview-scripts/assets/scripts/playAll.js"},{"deps":{"./co.cc":8},"path":"preview-scripts/assets/scripts/playEffect.js"},{"deps":{"./co.cc":8,"./getSymbolAnchor":9,"./lineFrames":14,"./playEffect":24},"path":"preview-scripts/assets/scripts/playLine.js"},{"deps":{"./co.cc":8},"path":"preview-scripts/assets/scripts/playSymbolCol.js"},{"deps":{},"path":"preview-scripts/assets/scripts/readMeButton.js"},{"deps":{"./co.cc":8,"./buildSymbols":5},"path":"preview-scripts/assets/scripts/requestGameResult.js"},{"deps":{},"path":"preview-scripts/assets/scripts/shuffle.js"},{"deps":{},"path":"preview-scripts/assets/scripts/requestTableInfo.js"},{"deps":{},"path":"preview-scripts/assets/scripts/videoReady.js"},{"deps":{},"path":"preview-scripts/assets/scripts/soundOffButton.js"},{"deps":{},"path":"preview-scripts/assets/scripts/value-types.cc.js"},{"deps":{},"path":"preview-scripts/assets/scripts/symbolGridIndexMapping.js"},{"deps":{},"path":"preview-scripts/assets/scripts/soundOnButton.js"},{"deps":{"./connectToServer":3},"path":"preview-scripts/assets/scripts/login.js"},{"deps":{"./observable.cc":21,"./Photon-Javascript_SDK":12,"./Photon_Interface":38,"PublicSetUp":4},"path":"preview-scripts/assets/scripts/BaseCmdLogic.js"},{"deps":{"./Photon-Javascript_SDK":12},"path":"preview-scripts/assets/scripts/Photon_Interface.js"},{"deps":{"./co.cc":8,"PublicSetUp":4},"path":"preview-scripts/assets/scripts/playVideo.js"}];
var entries = ["preview-scripts/__qc_index__.js"];
var bundleScript = 'preview-scripts/__qc_bundle__.js';

/**
 * Notice: This file can not use ES6 (for IE 11)
 */
var modules = {};
var name2path = {};

// Will generated by module.js plugin
// var scripts = ${scripts};
// var entries = ${entries};
// var bundleScript = ${bundleScript};

if (typeof global === 'undefined') {
    window.global = window;
}

var isJSB = typeof jsb !== 'undefined';

function getXMLHttpRequest () {
    return window.XMLHttpRequest ? new window.XMLHttpRequest() : new ActiveXObject('MSXML2.XMLHTTP');
}

function downloadText(url, callback) {
    if (isJSB) {
        var result = jsb.fileUtils.getStringFromFile(url);
        callback(null, result);
        return;
    }

    var xhr = getXMLHttpRequest(),
        errInfo = 'Load text file failed: ' + url;
    xhr.open('GET', url, true);
    if (xhr.overrideMimeType) xhr.overrideMimeType('text\/plain; charset=utf-8');
    xhr.onload = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200 || xhr.status === 0) {
                callback(null, xhr.responseText);
            }
            else {
                callback({status:xhr.status, errorMessage:errInfo + ', status: ' + xhr.status});
            }
        }
        else {
            callback({status:xhr.status, errorMessage:errInfo + '(wrong readyState)'});
        }
    };
    xhr.onerror = function(){
        callback({status:xhr.status, errorMessage:errInfo + '(error)'});
    };
    xhr.ontimeout = function(){
        callback({status:xhr.status, errorMessage:errInfo + '(time out)'});
    };
    xhr.send(null);
};

function loadScript (src, cb) {
    if (typeof require !== 'undefined') {
        require(src);
        return cb();
    }

    // var timer = 'load ' + src;
    // console.time(timer);

    var scriptElement = document.createElement('script');

    function done() {
        // console.timeEnd(timer);
        // deallocation immediate whatever
        scriptElement.remove();
    }

    scriptElement.onload = function () {
        done();
        cb();
    };
    scriptElement.onerror = function () {
        done();
        var error = 'Failed to load ' + src;
        console.error(error);
        cb(new Error(error));
    };
    scriptElement.setAttribute('type','text/javascript');
    scriptElement.setAttribute('charset', 'utf-8');
    scriptElement.setAttribute('src', src);

    document.head.appendChild(scriptElement);
}

function loadScripts (srcs, cb) {
    var n = srcs.length;

    srcs.forEach(function (src) {
        loadScript(src, function () {
            n--;
            if (n === 0) {
                cb();
            }
        });
    })
}

function formatPath (path) {
    let destPath = window.__quick_compile_project__.destPath;
    if (destPath) {
        let prefix = 'preview-scripts';
        if (destPath[destPath.length - 1] === '/') {
            prefix += '/';
        }
        path = path.replace(prefix, destPath);
    }
    return path;
}

window.__quick_compile_project__ = {
    destPath: '',

    registerModule: function (path, module) {
        path = formatPath(path);
        modules[path].module = module;
    },

    registerModuleFunc: function (path, func) {
        path = formatPath(path);
        modules[path].func = func;

        var sections = path.split('/');
        var name = sections[sections.length - 1];
        name = name.replace(/\.(?:js|ts|json)$/i, '');
        name2path[name] = path;
    },

    require: function (request, path) {
        var m, requestScript;

        path = formatPath(path);
        if (path) {
            m = modules[path];
            if (!m) {
                console.warn('Can not find module for path : ' + path);
                return null;
            }
        }

        if (m) {
            let depIndex = m.deps[request];
            // dependence script was excluded
            if (depIndex === -1) {
                return null;
            }
            else {
                requestScript = scripts[ m.deps[request] ];
            }
        }
        
        let requestPath = '';
        if (!requestScript) {
            // search from name2path when request is a dynamic module name
            if (/^[\w- .]*$/.test(request)) {
                requestPath = name2path[request];
            }

            if (!requestPath) {
                if (CC_JSB) {
                    return require(request);
                }
                else {
                    console.warn('Can not find deps [' + request + '] for path : ' + path);
                    return null;
                }
            }
        }
        else {
            requestPath = formatPath(requestScript.path);
        }

        let requestModule = modules[requestPath];
        if (!requestModule) {
            console.warn('Can not find request module for path : ' + requestPath);
            return null;
        }

        if (!requestModule.module && requestModule.func) {
            requestModule.func();
        }

        if (!requestModule.module) {
            console.warn('Can not find requestModule.module for path : ' + path);
            return null;
        }

        return requestModule.module.exports;
    },

    run: function () {
        entries.forEach(function (entry) {
            entry = formatPath(entry);
            var module = modules[entry];
            if (!module.module) {
                module.func();
            }
        });
    },

    load: function (cb) {
        var self = this;

        var srcs = scripts.map(function (script) {
            var path = formatPath(script.path);
            modules[path] = script;

            if (script.mtime) {
                path += ("?mtime=" + script.mtime);
            }
            return path;
        });

        console.time && console.time('load __quick_compile_project__');
        // jsb can not analysis sourcemap, so keep separate files.
        if (bundleScript && !isJSB) {
            downloadText(formatPath(bundleScript), function (err, bundleSource) {
                console.timeEnd && console.timeEnd('load __quick_compile_project__');
                if (err) {
                    console.error(err);
                    return;
                }

                let evalTime = 'eval __quick_compile_project__ : ' + srcs.length + ' files';
                console.time && console.time(evalTime);
                var sources = bundleSource.split('\n//------QC-SOURCE-SPLIT------\n');
                for (var i = 0; i < sources.length; i++) {
                    if (sources[i]) {
                        window.eval(sources[i]);
                        // not sure why new Function cannot set breakpoints precisely
                        // new Function(sources[i])()
                    }
                }
                self.run();
                console.timeEnd && console.timeEnd(evalTime);
                cb();
            })
        }
        else {
            loadScripts(srcs, function () {
                self.run();
                console.timeEnd && console.timeEnd('load __quick_compile_project__');
                cb();
            });
        }
    }
};

// Polyfill for IE 11
if (!('remove' in Element.prototype)) {
    Element.prototype.remove = function () {
        if (this.parentNode) {
            this.parentNode.removeChild(this);
        }
    };
}
})();
    