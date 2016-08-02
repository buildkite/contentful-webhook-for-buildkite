const apiToken = process.env.BUILDKITE_API_TOKEN;

const https = require('https');
const express = require('express');
const bodyParser = require('body-parser');
const basicAuth = require('basic-auth-connect');

const app = express();
app.use(bodyParser.json());
app.use(basicAuth(process.env.AUTH_USERNAME, process.env.AUTH_PASSWORD));

app.post('/', (req, res) => {
  console.log('Received POST', req.headers, req.body);

  const org = req.headers['buildkite-org'];
  if (!org) return res.status(500).send({error:'No buildkite-org webhook header set'});

  const pipeline = req.headers['buildkite-pipeline'];
  if (!pipeline) return res.status(500).send({error:'No buildkite-pipeline webhook header set'});

  const commit = (req.headers['buildkite-commit'] || 'HEAD');
  const branch = (req.headers['buildkite-branch'] || 'master');

  // "ContentManagement.[Type].[Action]"
  const topic = req.headers['x-contentful-topic'];
  const topicParts = topic.split('.');
  const topicType = topicParts[1];
  const topicAction = topicParts[2];

  // https://buildkite.com/docs/api/builds#create-a-build
  const buildParams = {
    commit: commit,
    branch: branch,
    message: `${topicType} ${topicAction}`,
    meta_data: { type: topicType, action: topicAction }
  }

  buildkiteApi(apiToken, 'POST', `/v2/organizations/${org}/pipelines/${pipeline}/builds`, buildParams, (apiResponse) => {
    apiResponse.on("data", (data) => {
      const responseBody = data.toString();
      res.status(apiResponse.statusCode).send(responseBody);
    })
  })
})

app.listen(process.env.PORT || 3000, function() {
  console.log('Express listening on port', this.address().port);
});

function buildkiteApi(apiToken, method, path, params, callback) {
  const body = JSON.stringify(params);
  console.log("Posting to Buildkite", path, body);

  const req = https.request({
    hostname: 'api.buildkite.com',
    port: 443,
    path: path,
    method: method,
    headers: {
      "Content-type":   "application/json",
      "Connection":     "close",
      "Content-length": body.length,
      "Authorization":  "Bearer " + apiToken,
    }
  }, callback);

  req.write(body);
  req.end();
}