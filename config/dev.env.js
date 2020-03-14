'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  BACKEND_URL: '"http://kg-edu-backend-44-review-modify-int-nskg6i.env.bdaa.pro/v1"'
})
