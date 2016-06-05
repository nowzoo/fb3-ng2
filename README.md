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

These instructions are based on installing the present library for an Angular 2 app built with the [Angular CLI](https://cli.angular.io/), which uses SystemJS. If your app uses another seed and build system, such as Webpack, you will have to modify some of the following.

Define Firebase and this library as dependencies. The package is not yet in NPM, so install from the GitHub repo. Add the following two lines to `dependencies` in `package.json`...
```js
{
    "dependencies": {
      "firebase": "^3.0.3",
      "firebase-helpers": "git://github.com/nowzoo/firebase-helpers.git#master"
    }
}
```

```bash
npm install
```
Install the typings. For now, the Firebase SDK 3.x typings are included as a file in the current package, rather than in a registry. Add the line

```js
"firebase": "file:./node_modules/firebase-helpers/firebase-typings.d.ts"
```
 to `typings.json`. The file (for Angular CLI/SystemJS apps) should look something like this:

```js
{
  "globalDevDependencies": {
    "angular-protractor": "registry:dt/angular-protractor#1.5.0+20160425143459",
    "jasmine": "registry:dt/jasmine#2.2.0+20160412134438",
    "selenium-webdriver": "registry:dt/selenium-webdriver#2.44.0+20160317120654"
  },
  "globalDependencies": {
    "es6-shim": "registry:dt/es6-shim#0.31.2+20160317120654",
    "firebase": "file:./node_modules/firebase-helpers/firebase-typings.d.ts"
  }
}
```
Then run...
```bash
typings install
```

Tell the build about the new dependencies. For Angular CLI/SystemJS apps this is done in `angular-cli-build.js`. Add Firebase and this package:

```js
/* global require, module */

var Angular2App = require('angular-cli/lib/broccoli/angular2-app');

module.exports = function(defaults) {
  return new Angular2App(defaults, {
    vendorNpmFiles: [
      'systemjs/dist/system-polyfills.js',
      'systemjs/dist/system.src.js',
      'zone.js/dist/*.js',
      'es6-shim/es6-shim.js',
      'reflect-metadata/*.js',
      'rxjs/**/*.js',
      '@angular/**/*.js',

      //add the following...
      'firebase/**/*.js',
      'firebase-helpers/dist/app/firebase-service.js'
    ]
  });
};

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
