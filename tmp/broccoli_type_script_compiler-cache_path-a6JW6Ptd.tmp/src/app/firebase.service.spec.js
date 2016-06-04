"use strict";
var testing_1 = require('@angular/core/testing');
var firebase = require('firebase');
var firebase_service_1 = require('./firebase.service');
var firebaseApp;
var firebaseDatabase;
var dbFixture = {
    posts: {
        abc: {
            title: 'My first post'
        },
        def: {
            title: 'My second post'
        },
        xyz: {
            title: 'My last post'
        }
    }
};
beforeEach(function (done) {
    firebaseApp = firebase.initializeApp({
        //this is a fake app -- we do tests offline
        apiKey: "foobar-dhjgdhgdkhgd",
        authDomain: "not-real.firebaseapp.com",
        databaseURL: "https://not-real.firebaseio.com",
        storageBucket: "not-real.appspot.com"
    });
    firebaseDatabase = firebaseApp.database();
    firebaseDatabase.goOffline();
    firebaseDatabase.ref().set(dbFixture);
    done();
});
afterEach(function (done) {
    firebaseApp.delete().then(done);
});
testing_1.describe('Proof of life', function () {
    testing_1.it('should be true that 1 === 1', function () {
        testing_1.expect(1 === 1).toBe(true);
    });
    testing_1.it('should be true that 2 !== 1', function () {
        testing_1.expect(2 === 1).not.toBe(true);
    });
});
testing_1.describe('FirebaseObject#constructor', function () {
    testing_1.it('should create an object', function () {
        var ref = firebaseDatabase.ref('posts');
        var posts = new firebase_service_1.FirebaseObject(ref);
        testing_1.expect(typeof posts).toBe('object');
    });
});
testing_1.describe('FirebaseArray#constructor', function () {
    testing_1.it('should create an object', function () {
        var ref = firebaseDatabase.ref('posts');
        var posts = new firebase_service_1.FirebaseArray(ref);
        testing_1.expect(typeof posts).toBe('object');
    });
    testing_1.it('should be array like', function () {
        var ref = firebaseDatabase.ref('posts');
        var posts = new firebase_service_1.FirebaseArray(ref);
        testing_1.expect(posts.length).toBeDefined();
        testing_1.expect(posts.length).toBe(3);
    });
});
//# sourceMappingURL=firebase.service.spec.js.map