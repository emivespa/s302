const AWS = require('aws-sdk')
const s3 = new AWS.S3()
require('dotenv').config()

const BUCKET_NAME = process.env.BUCKET_NAME
const LINKS_FILE_KEY = process.env.LINKS_FILE_KEY

exports.handler = async (event) => {
  const alias = event.pathParameters.alias
  try {
    const text = await s3.getObject({ Bucket: BUCKET_NAME, Key: LINKS_FILE_KEY }).promise()
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

