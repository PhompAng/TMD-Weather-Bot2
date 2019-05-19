module.exports = {
  root: true,
  "env": {
    "es6": true,
    "node": true
  },
  "extends": "standard",
  parser: 'babel-eslint',
  "parserOptions": {
    ecmaVersion: 2017,
    "sourceType": "module"
  },
  "plugins": ["promise"],
  "rules": {
    "no-unused-vars": [
      "error",
      {
        "varsIgnorePattern": "_$|^React$"
      }
    ],
    "indent": [
      "error",
      2
    ],
    "linebreak-style": [
      "error",
      "unix"
    ],
    // allow paren-less arrow functions
    'arrow-parens': 0,
    // allow async-await
    'generator-star-spacing': 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,

    // Return inside each then() to create readable and reusable Promise chains.
    // Forces developers to return console logs and http calls in promises.
    "promise/always-return": 2,

    //Enforces the use of catch() on un-returned promises
    "promise/catch-or-return": 2,

    // Warn against nested then() or catch() statements
    "promise/no-nesting": 1
  }
};