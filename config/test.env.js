'use strict'
const merge = require('webpack-merge')
const devEnv = require('./dev.env')

module.exports = merge(devEnv, {
  NODE_ENV: '"testing"',
  BACKEND_URL: '"http://kg-edu-backend-44-review-modify-int-nskg6i.env.bdaa.pro/v1"'
})
