import { OpaqueToken, Provider, provide, Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscriber } from 'rxjs/Subscriber';

import * as firebase from 'firebase';


// Factory and provider for a default firebease app...
export const DEFAULT_FIREBASE_APP_CONFIG = new OpaqueToken('DEFAULT_FIREBASE_APP_CONFIG');
export const DEFAULT_FIREBASE_APP = new OpaqueToken('DEFAULT_FIREBASE_APP');

let defaultFirebaseAppFactory = (config: Object): firebase.app.App => {
    let app: firebase.app.App;
    try {
        return firebase.app();
    } catch(e) {
        app = firebase.initializeApp(config);
    }
    return app;
}

export let defaultFirebaseAppProvider = provide(DEFAULT_FIREBASE_APP, {
    useFactory: defaultFirebaseAppFactory,
    deps: [DEFAULT_FIREBASE_APP_CONFIG]
});


// An interface for data retrieved as a scalar, an object or an array element...
export interface FirebaseObjectRecord {
    $key: string,
    $ref(): firebase.database.Reference;
    $value: any;
}
function firebaseObjectRecordFactory(snap: firebase.database.DataSnapshot): FirebaseObjectRecord {
    let value = snap.val();
    if (value !== null && typeof value === 'object'){
        value.$key = snap.key;
        value.$ref = () => { return snap.ref; };
        value.$value = null;
    } else {
        value = {
            $key: snap.key,
            $ref: () => { return snap.ref; },
            $value: value
        };
    }
    return value;

}

// grab an observable on an object...
export function firebaseObjectObservableFactory(ref: firebase.database.Reference): Observable<FirebaseObjectRecord> {
    return Observable.create((subscriber: Subscriber<any>) => {
        let listenFn = ref.on('value', (snap: firebase.database.DataSnapshot) => {
            let value = firebaseObjectRecordFactory(snap);
            subscriber.next(value);
        }, err => {
              if (err) {
                  subscriber.error(err);
                  subscriber.complete();
              }
        });
        return () => {
            ref.off('value', listenFn);
        };
    });
}

// grab an observable on an array...
export function firebaseArrayObservableFactory(ref: firebase.database.Reference | firebase.database.Query): Observable<FirebaseObjectRecord[]> {

    return Observable.create((subscriber: Subscriber<any>) => {
        let listenFn = ref.on('value', (snap: firebase.database.DataSnapshot) => {
            let arr: Object[] = [];
            snap.forEach((child: firebase.database.DataSnapshot): boolean =>{
                let value = firebaseObjectRecordFactory(child);
                arr.push(value);
                return false;
            });
            subscriber.next(arr)
        }, err => {
              if (err) {
                  subscriber.error(err);
                  subscriber.complete();
              }
        });
        return () => {
            ref.off('value', listenFn);
        };
    });
}


@Injectable()
export class FirebaseObject extends Object  {
    public obs:any;
    constructor(ref: firebase.database.Reference){
        super();
        this['$key'] = ref.key;
        this['$ref'] = () => { return ref.ref; };
        this['$value'] = null;
        this.obs = firebaseObjectObservableFactory(ref);
        this.obs.subscribe(o => {
            let existingProps = Object.getOwnPropertyNames(this);
            existingProps.forEach((val, key) => {
                delete this[key];
            });
            Object.assign(this, o);
        });
    }
};



@Injectable()
export class FirebaseArray extends Array {
    public obs:any;
    constructor(ref: firebase.database.Reference | firebase.database.Query){
        super();
        this.obs = firebaseArrayObservableFactory(ref);
        this.obs.subscribe(items => {
            this.length = 0;
            Array.prototype.push.apply(this, items);
        });
    }
};
