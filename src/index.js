const bugfixes = require('bugfixes')
const libs = require('chewedfeed')

const bugfunctions = bugfixes.functions

module.exports = (event, context, callback) => {
  let body = JSON.parse(event.Records[0].Sns.Message)

  bugfixes.info('body', body)

  let store = libs.store
  store.feedId = body.feedId
  store.url = body.url
  store.title = body.title
  store.imageDetails = body.imageDetails

  store.cacheCheck((error, result) => {
    if (error) {

      bugfixes.error('CacheCheck Error', error)
      return callback(null, bugfunctions.lambdaError(301, {
        error: error,
        success: false
      }))
    }

    if (result.skip === false) {
      store.insert((error, result) => {
        if (error) {
          bugfixes.error('Storage Error', error)

          return callback(null, bugfunctions.lambdaError(303, {
            error: error,
            success: false
          }))
        }

        return callback(null, bugfunctions.lambdaResult(304, {
          success: true
        }))
      })
    }

    return callback(null, bugfunctions.lambdaResult(302, {
      success: false
    }))
  })
}
