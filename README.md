# Firebase Helpers

Angular 2 Helpers for Firebase SDK 3.x

*N.B.: This library is in development, and perhaps may soon be eclipsed by the official [angularfire2 implementation of Firebase SDK 3.x](https://github.com/angular/angularfire2/issues/180). Use with care!*

### Overview

This library concentrates on reading data objects and arrays from
Firebase 3.x SDK databases. The goal is to be simple to understand
and easy to use, rather than provide a comprehensive implementation of the SDK.

#### Features
 - Type definitions for SDK 3.x
 - `FirebaseObject` class extending `Object`, instantiated from a reference.
 - `FirebaseArray` class extending `Array`, instantiated from a reference or query.


#### Left out (at least for now)
 - Writing data, e.g., set, update, push and remove, and two-way data binding.
 - Authorization
 - Storage

 Much of this can be easily (and is perhaps better) done via the SDK itself rather than Angular 2 abstractions. 

 ### Installation




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
