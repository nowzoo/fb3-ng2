"use strict";
var core_1 = require('@angular/core');
exports.DEFAULT_FIREBASE_CONFIG = new core_1.OpaqueToken('DEFAULT_FIREBASE_CONFIG');
exports.DEFAULT_FIREBASE_APP = new core_1.OpaqueToken('DEFAULT_FIREBASE_APP');
function firebaseAppFactory(config) {
}
exports.firebaseAppFactory = firebaseAppFactory;
