import { Observable } from 'rxjs/Observable';
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
export declare function firebaseRecordFactory(snap: firebase.database.DataSnapshot): FirebaseRecord;
/**
 * Grab an observable on an object from a reference.
 * @param  {firebase.database.Reference} ref
 * @return {Observable<FirebaseRecord>}
 */
export declare function firebaseObjectObservableFactory(ref: firebase.database.Reference): Observable<FirebaseRecord>;
export declare class FirebaseObject extends Object {
    obs: any;
    $key: string;
    $ref: any;
    $value: any;
    constructor(ref: firebase.database.Reference);
}
/**
 * Grab an observable on an array. This accepts both
 * plain vanilla references or a queries like
 * ref.orderByChild('foo').limitToFirst(25)
 *
 * @param  {firebase.database.Reference | firebase.database.Query} ref
 * @return {Observable<FirebaseRecord[]>}
 */
export declare function firebaseArrayObservableFactory(ref: firebase.database.Reference | firebase.database.Query): Observable<FirebaseRecord[]>;
export declare class FirebaseArray extends Array {
    obs: any;
    constructor(ref: firebase.database.Reference | firebase.database.Query);
}
