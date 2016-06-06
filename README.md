# Firebase Helpers

Angular 2 Helpers for Firebase SDK 3.x

*N.B.: This is in active development, and was originally intended to be a drop-in replacement for the [official angularfire2 library](https://github.com/angular/angularfire2/) until it is updated to [Firebase SDK 3.x](https://github.com/angular/angularfire2/issues/180). Use with care!*

### Overview

This library concentrates on reading data objects and arrays from Firebase 3.x SDK databases. The goal is to be simple to understand and easy to use, rather than provide a comprehensive Angular 2 implementation of the SDK.

#### Features
 - Type definitions for SDK 3.x
 - `FirebaseObject` class extending `Object`, instantiated from a reference.
 - `FirebaseArray` class extending `Array`, instantiated from a reference or query.


#### Left out (at least for now)
 - Writing data, e.g., set, update, push and remove, and two-way data binding.
 - Authorization
 - Storage

Much of this can be easily done (and is perhaps better done) via the SDK itself rather than Angular 2 abstractions. That said, I'm open to suggestions.

### Installation

These instructions are based on installing the library for an Angular 2 app built from the [angular2-webpack seed project](https://github.com/preboot/angular2-webpack). If your app uses another seed or build system, such as SystemJS, you will have to modify some of the following.

##### Set up your project
```bash
# clone the seed...
git clone git@github.com:preboot/angular2-webpack.git fb3-ng2-example
cd fb3-ng2-example

# install the seed dependencies...
npm i

# make sure it works...
npm start


# install firebase and fb3-ng2...
npm i firebase fb3-ng2 --save

```

##### Add the Firebase SDK 3.x typings

Until official typings are published to a registry, use the [typings found in this gist](https://gist.githubusercontent.com/cdcarson/28399c50b02bf6c507fbf5b7b30daa31/raw/fa089d231ca4253d4715f8161efc6af74c972dfa/firebase-sdk-3-typings.d.ts).  Open up `typings.json` and add the following line to `globalDependencies`.

```json   
"firebase": "https://gist.githubusercontent.com/cdcarson/28399c50b02bf6c507fbf5b7b30daa31/raw/fa089d231ca4253d4715f8161efc6af74c972dfa/firebase-sdk-3-typings.d.ts"
```

Then run:
```bash
typings i
```


##### Tell the build where to find the Firebase and fb3-ng2 libraries

If you've followed along with the example using the seed project and Webpack, just add the following to `src/vendor.ts`:

```
import 'firebase';
import 'fb3-ng2';
```

*Other build systems will require you to add paths/references/maps to the libraries in various other places.  Consult Google to figure out where.*


### Use it!

Add a `DEFAULT_FIREBASE_APP` provider in `src/main.ts`:

```ts
//other imports...

// Add these lines  up top...
import * as firebase from 'firebase';

// DEFAULT_FIREBASE_APP is an OpaqueToken that we can use to provide the app...
import {DEFAULT_FIREBASE_APP} from 'fb3-ng2';

// more imports and other stuff...

bootstrap(AppComponent, [
    // other providers...

    // add a factory for getting a firebase application instance...
    {
        provide: DEFAULT_FIREBASE_APP, useFactory: () => {
            let app: firebase.app.App;
            try {
                // this will work if the app already exists...
                app = firebase.app();
            } catch (e) {
              // the app does not yet exist, so...
                app = firebase.initializeApp({
                  // get this object from the firebase console...
                    apiKey: 'YOUR API KEY',
                    authDomain: '<your-firebase-app>.firebaseapp.com',
                    databaseURL: 'https://<your-firebase-app>.firebaseio.com',
                    storageBucket: '<your-firebase-app>.appspot.com'
                });
            }
            return app;
        }
    }
  ])
  .catch(err => console.error(err));

```

Then in a component, instantiate some data. In `src/app/home/home.component.ts`...

```ts
// add Inject here...
import { Component, OnInit, Inject } from '@angular/core';

// import firebase and fb3-ng2 stuff...
import * as firebase from 'firebase';
import { DEFAULT_FIREBASE_APP, FirebaseObject, FirebaseArray } from 'fb3-ng2';

@Component({
  selector: 'my-home',
  template: require('./home.component.html'),
  styles: [require('./home.component.scss')]
})
export class HomeComponent implements OnInit {

  //define some properties...
  public posts: FirebaseArray;
  public listOfScalars: FirebaseArray;
  public anObject: FirebaseObject;
  public doesntExist: FirebaseObject;
  public aScalar: FirebaseObject;


  //inject the app...
  constructor(@Inject(DEFAULT_FIREBASE_APP) private fbApp: any) {}

  ngOnInit() {
    // initialize the data...
    this.posts = new FirebaseArray(this.fbApp.database().ref('posts'));
    this.listOfScalars = new FirebaseArray(this.fbApp.database().ref('listOfScalars'));
    this.anObject = new FirebaseObject(this.fbApp.database().ref('anObject'));
    this.doesntExist = new FirebaseObject(this.fbApp.database().ref('doesntExist'));
    this.aScalar = new FirebaseObject(this.fbApp.database().ref('aScalar'));
  }

}

```

Finally, in `src/app/home/home.component.html`...

```html
<p>
  Home Works!
</p>

<h3>Posts</h3>
<pre>
{{ posts | json }}
</pre>

<h3>A list of scalars</h3>
<pre>
{{ listOfScalars | json }}
</pre>

<h3>An Object</h3>
<pre>
{{ anObject | json }}
</pre>

<h3>A Scalar</h3>
<pre>
{{ aScalar | json }}
</pre>

<h3>Does not exist</h3>
<pre>
{{ doesntExist | json }}
</pre>
```





### Contributing

```bash
# clone the repo...
git clone git@github.com:nowzoo/firebase-3-angular-2.git

# install dependencies...
npm install

# install typings globally if you need to..
#  npm i typings -g

# install typings...
typings install

# unit tests...
npm test

# build...
npm build
```
