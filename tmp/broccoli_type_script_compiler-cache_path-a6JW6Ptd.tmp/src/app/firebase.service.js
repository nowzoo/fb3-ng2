"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var Observable_1 = require('rxjs/Observable');
var firebase = require('firebase');
// Factory and provider for a default firebease app...
exports.DEFAULT_FIREBASE_APP_CONFIG = new core_1.OpaqueToken('DEFAULT_FIREBASE_APP_CONFIG');
exports.DEFAULT_FIREBASE_APP = new core_1.OpaqueToken('DEFAULT_FIREBASE_APP');
var defaultFirebaseAppFactory = function (config) {
    var app;
    try {
        return firebase.app();
    }
    catch (e) {
        app = firebase.initializeApp(config);
    }
    return app;
};
exports.defaultFirebaseAppProvider = core_1.provide(exports.DEFAULT_FIREBASE_APP, {
    useFactory: defaultFirebaseAppFactory,
    deps: [exports.DEFAULT_FIREBASE_APP_CONFIG]
});
function firebaseObjectRecordFactory(snap) {
    var value = snap.val();
    if (value !== null && typeof value === 'object') {
        value.$key = snap.key;
        value.$ref = function () { return snap.ref; };
        value.$value = null;
    }
    else {
        value = {
            $key: snap.key,
            $ref: function () { return snap.ref; },
            $value: value
        };
    }
    return value;
}
// grab an observable on an object...
function firebaseObjectObservableFactory(ref) {
    return Observable_1.Observable.create(function (subscriber) {
        var listenFn = ref.on('value', function (snap) {
            var value = firebaseObjectRecordFactory(snap);
            subscriber.next(value);
        }, function (err) {
            if (err) {
                subscriber.error(err);
                subscriber.complete();
            }
        });
        return function () {
            ref.off('value', listenFn);
        };
    });
}
exports.firebaseObjectObservableFactory = firebaseObjectObservableFactory;
// grab an observable on an array...
function firebaseArrayObservableFactory(ref) {
    return Observable_1.Observable.create(function (subscriber) {
        var listenFn = ref.on('value', function (snap) {
            var arr = [];
            snap.forEach(function (child) {
                var value = firebaseObjectRecordFactory(child);
                arr.push(value);
                return false;
            });
            subscriber.next(arr);
        }, function (err) {
            if (err) {
                subscriber.error(err);
                subscriber.complete();
            }
        });
        return function () {
            ref.off('value', listenFn);
        };
    });
}
exports.firebaseArrayObservableFactory = firebaseArrayObservableFactory;
var FirebaseObject = (function (_super) {
    __extends(FirebaseObject, _super);
    function FirebaseObject(ref) {
        var _this = this;
        _super.call(this);
        this['$key'] = ref.key;
        this['$ref'] = function () { return ref.ref; };
        this['$value'] = null;
        this.obs = firebaseObjectObservableFactory(ref);
        this.obs.subscribe(function (o) {
            var existingProps = Object.getOwnPropertyNames(_this);
            existingProps.forEach(function (val, key) {
                delete _this[key];
            });
            Object.assign(_this, o);
        });
    }
    FirebaseObject = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [Object])
    ], FirebaseObject);
    return FirebaseObject;
}(Object));
exports.FirebaseObject = FirebaseObject;
;
var FirebaseArray = (function (_super) {
    __extends(FirebaseArray, _super);
    function FirebaseArray(ref) {
        var _this = this;
        _super.call(this);
        this.obs = firebaseArrayObservableFactory(ref);
        this.obs.subscribe(function (items) {
            _this.length = 0;
            Array.prototype.push.apply(_this, items);
        });
    }
    FirebaseArray = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [Object])
    ], FirebaseArray);
    return FirebaseArray;
}(Array));
exports.FirebaseArray = FirebaseArray;
;
//# sourceMappingURL=firebase.service.js.map