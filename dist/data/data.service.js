"use strict";
var core_1 = require('@angular/core');
var Observable_1 = require('rxjs/Observable');
/**
 * Factory for creating a FirebaseObjectRecord from a snapshot
 * @param  {firebase.database.DataSnapshot} snap
 * @return {FirebaseObjectRecord}
 */
function firebaseRecordFactory(snap) {
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
exports.firebaseRecordFactory = firebaseRecordFactory;
;
/**
 * Grab an observable on an object from a reference.
 * @param  {firebase.database.Reference} ref
 * @return {Observable<FirebaseRecord>}
 */
function firebaseObjectObservableFactory(ref) {
    return Observable_1.Observable.create(function (subscriber) {
        var listenFn = ref.on('value', function (snap) {
            var value = firebaseRecordFactory(snap);
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
var FirebaseObject = (function (_super) {
    __extends(FirebaseObject, _super);
    function FirebaseObject(ref) {
        var _this = this;
        _super.call(this);
        this.$key = ref.key;
        this.$ref = function () { return ref.ref; };
        this.$value = null;
        this.obs = firebaseObjectObservableFactory(ref);
        this.obs.subscribe(function (o) {
            var existingProps = Object.getOwnPropertyNames(_this);
            existingProps.forEach(function (val) {
                delete _this[val];
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
/**
 * Grab an observable on an array. This accepts both
 * plain vanilla references or a queries like
 * ref.orderByChild('foo').limitToFirst(25)
 *
 * @param  {firebase.database.Reference | firebase.database.Query} ref
 * @return {Observable<FirebaseRecord[]>}
 */
function firebaseArrayObservableFactory(ref) {
    return Observable_1.Observable.create(function (subscriber) {
        var listenFn = ref.on('value', function (snap) {
            var arr = [];
            snap.forEach(function (child) {
                var value = firebaseRecordFactory(child);
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
