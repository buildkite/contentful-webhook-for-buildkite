# Contentful Webhook for Buildkite

A [Contentful](https://contentful.com/) webhook endpoint that creates [Buildkite](https://buildkite.com/) builds based on content events.

Your builds will be created with two pieces of meta-data:

* `type` - such as `Entry`, `ContentType` or `Asset`
* `action` - such as `publish`, `save`, etc.

You can use these to trigger a site build + deploy, for example:

```bash
#!/bin/bash

set -euo pipefail

content_type=$(buildkite-agent meta-data get 'type')
action=$(buildkite-agent meta-data get 'action')

if [[ $content_type == 'Entry' && $action == 'publish']]; then
  # Build and deploy
fi
```

## Usage

1. **Deploy it to Heroku** <br>[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)<br>You'll need a [Buildkite API Access Token](https://buildkite.com/user/api-access-tokens) with `write_builds` access.

2. **Set up the webhook:** In Contentful go to Webhooks → Add Webhook.<br>Add a new webhook pointing to your new Heroku app.<br>Add the username and password you set when setting up the Heroku app.<br>Add the header `buildkite-org` with the value of your Buildkite organization slug<br>Add the header `buildkite-pipeline` with the value of your Buildkite pipeline slug<br>You can optionally add the headers `buildkite-commit` (default `HEAD`) and `buildkite-branch` (default `master`).<br>Save your webhook.

4. **Make a change on Contentful** :tada: You'll now have a build on Buildkite!

## Debugging

See your Heroku webhook application's logs, or the Contentful webhook request log.

## License

See the [LICENSE](LICENSE.md) file for license rights and limitations (MIT).
