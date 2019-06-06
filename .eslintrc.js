const path = require('path');
const moduleAliases = require('./tools/moduleAliases');

module.exports = {
  'extends': 'airbnb',
  'env': {
    'es6': true,
    'browser': true,
    'node': true,
  },
  parser: 'babel-eslint',
  plugins: ['babel'],
  parserOptions: {
    ecmaVersion: 7,
    ecmaFeatures: {
      experimentalDecorators: true,
    },
  },
  settings: {
    'import/resolver': {
      'babel-module': {
        root: moduleAliases.babel.root,
        alias: moduleAliases.babel.alias
      }
    }
  },
  'rules': {
    'no-plusplus': ['error', { 'allowForLoopAfterthoughts': true }],
    'no-unused-expressions': ['error', { 'allowShortCircuit': true }],
    'class-methods-use-this': 'warn',
    'no-underscore-dangle': 'warn',
    'no-lonely-if': 'warn',
    'react/prop-types': 'off',
    'react/no-multi-comp': 'warn',
    'react/jsx-closing-tag-location': 'off',
    'react/prefer-stateless-function': 'off',
    'jsx-a11y/click-events-have-key-events': 'off',
    'jsx-a11y/no-static-element-interactions': 'off',
    'jsx-a11y/anchor-is-valid': 'off',
    'jsx-a11y/no-noninteractive-element-interactions': 'warn',
    'import/no-extraneous-dependencies': 'off',
    'react/no-array-index-key': 'off',
    'camelcase': 'warn',
    'no-param-reassign': 'warn',
    'jsx-a11y/label-has-for': 'warn',
    'jsx-a11y/label-has-associated-control': 'warn',
    'react/destructuring-assignment': 'off',
    'react/no-access-state-in-setstate': 'warn',
  }
};
