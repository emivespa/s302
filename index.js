const AWS = require('aws-sdk')
const s3 = new AWS.S3()
require('dotenv').config()

const {
  BUCKET,
  KEY,
} = process.env

exports.handler = async (event) => {
  const alias = event.pathParameters.alias
  try {
    const text = await s3.getObject({ Bucket: BUCKET, Key: KEY }).promise()
    const lines = text.Body.toString('utf-8').split('\n')
    for (const link of lines) {
      const [aliasCandidate, url] = link.split(/[ \t]+/)
      if (aliasCandidate === alias) {
        return {
          statusCode: 302,
          headers: { Location: url },
          body: ''
        }
      }
    }
    return { statusCode: 404 }
  } catch (err) {
    console.log(err)
    return { statusCode: 500 }
  }
}

