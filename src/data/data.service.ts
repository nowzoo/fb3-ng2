import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscriber } from 'rxjs/Subscriber';



/**
 * A normalization of scalar/non-scalar/empty snapshots...
 */
export interface FirebaseRecord {

    /**
     * The key
     * @type {string}
     */
    $key: string;

    /**
     * A place to stick a scalar value, if the snap is scalar.
     * This will be null if the snap is null or is an object
     * @type {any}
     */
    $value: any;

    /**
     * A function returning the snap's ref.
     * We wrap it in a function because
     * JSON representations complain about
     * circularity if we provide the raw object.
     * @return {firebase.database.Reference} [description]
     */
    $ref(): firebase.database.Reference;


}

/**
 * Factory for creating a FirebaseObjectRecord from a snapshot
 * @param  {firebase.database.DataSnapshot} snap
 * @return {FirebaseObjectRecord}
 */
export function firebaseRecordFactory(snap: firebase.database.DataSnapshot): FirebaseRecord {
    let value = snap.val();
    if (value !== null && typeof value === 'object') {
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

};

/**
 * Grab an observable on an object from a reference.
 * @param  {firebase.database.Reference} ref
 * @return {Observable<FirebaseRecord>}
 */
export function firebaseObjectObservableFactory(ref: firebase.database.Reference): Observable<FirebaseRecord> {
    return Observable.create((subscriber: Subscriber<any>) => {
        let listenFn = ref.on('value', (snap: firebase.database.DataSnapshot) => {
            let value = firebaseRecordFactory(snap);
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

@Injectable()
export class FirebaseObject extends Object  {
    public $key: string;
    public $ref: any;
    public $value: any;
    constructor(ref: firebase.database.Reference) {
        super();
        let obs: any;
        this.$key = ref.key;
        this.$ref = () => { return ref.ref; };
        this.$value = null;
        obs = firebaseObjectObservableFactory(ref);
        obs.subscribe((o: any) => {
            let existingProps = Object.getOwnPropertyNames(this);
            existingProps.forEach((val: string) => {
                delete this[val];
            });
            Object.assign(this, o);
        });
    }
};


/**
 * Grab an observable on an array. This accepts both
 * plain vanilla references or a queries like
 * ref.orderByChild('foo').limitToFirst(25)
 *
 * @param  {firebase.database.Reference | firebase.database.Query} ref
 * @return {Observable<FirebaseRecord[]>}
 */
export function firebaseArrayObservableFactory(ref: firebase.database.Reference | firebase.database.Query): Observable<FirebaseRecord[]> {

    return Observable.create((subscriber: Subscriber<any>) => {
        let listenFn = ref.on('value', (snap: firebase.database.DataSnapshot) => {
            let arr: Object[] = [];
            snap.forEach((child: firebase.database.DataSnapshot): boolean => {
                let value = firebaseRecordFactory(child);
                arr.push(value);
                return false;
            });
            subscriber.next(arr);
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
export class FirebaseArray extends Array {
    constructor(ref: firebase.database.Reference | firebase.database.Query) {
        super();
        let obs: any;
        obs = firebaseArrayObservableFactory(ref);
        obs.subscribe((items: any) => {
            this.length = 0;
            Array.prototype.push.apply(this, items);
        });
    }
};
