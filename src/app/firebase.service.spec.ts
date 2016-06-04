import {
  beforeEachProviders,
  describe,
  expect,
  it,
  inject
} from '@angular/core/testing';
import {
    provide,
    ReflectiveInjector
} from '@angular/core';
import * as firebase from 'firebase';
import {
    FirebaseObject,
    FirebaseArray
}  from './firebase.service';

let firebaseApp: any;
let firebaseDatabase: any;
let dbFixture = {
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
}




beforeEach((done:any) => {
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
 afterEach((done: any) => {
     firebaseApp.delete().then(done);
 });



describe('Proof of life', () => {
    it('should be true that 1 === 1', () => {
        expect(1 === 1).toBe(true);
    });
    it('should be true that 2 !== 1', () => {
        expect(2 === 1).not.toBe(true);
    });
});

describe('FirebaseObject#constructor', () => {
    it ('should create an object', () => {
        let ref = firebaseDatabase.ref('posts');
        let posts = new FirebaseObject(ref);
        expect(typeof posts).toBe('object');
    })
});
describe('FirebaseArray#constructor', () => {
    it ('should create an object', () => {
        let ref = firebaseDatabase.ref('posts');
        let posts = new FirebaseArray(ref);
        expect(typeof posts).toBe('object');
    });
    it ('should be array like', () => {
        let ref = firebaseDatabase.ref('posts');
        let posts = new FirebaseArray(ref);
        expect(posts.length).toBeDefined();
        expect(posts.length).toBe(3);

    })
})
