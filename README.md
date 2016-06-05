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
The package is not yet in NPM, so install from the GitHub repo...

```js
//your package.json...
{
    //stuff
    "dependencies": {
      //other deps...

      //the Firebase SDK...
      "firebase": "^3.0.3",
      //this library from git...
      "firebase-helpers": "git://github.com/nowzoo/firebase-helpers.git#master"
    },
    //more stuff
}
```

```bash
npm install
```



 ### Usage

 Create a Firebase application




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
