# Contentful Webhook for Buildkite

A [Contentful](https://contentful.com/) webhook endpoint that creates [Buildkite](https://buildkite.com/) builds based on content events.

## Usage

1. **Deploy it to Heroku** <br>[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy) You'll need a [Buildkite API Access Token](https://buildkite.com/user/api-access-tokens) with `write_builds` access.

2. **Set up the webhook:** In Contentful go to Webhooks → Add Webhook and add a new webhook pointing to your new Heroku app. Add the username and password you set when setting up the Heroku app, as well two headers: `buildkite-org` and `buildkite-pipeline` that are the slugs for your Buildkite organization and pipeline you want to trigger. You can optionally set `buildkite-commit` (default `HEAD`) and `buildkite-branch` (default `master`).

4. **Make a change on Contentful** :tada:

You'll now have a build with two pieces of meta-data:

* `type` - such as `Entry`, `ContentType` or `Asset`
* `action` - such as `publish`, `save`, etc.

You can retrieve them in your build script like so:

```bash
#!/bin/bash

set -euo pipefail

echo "Type: $(buildkite-agent meta-data get type)"
echo "Action: $(buildkite-agent meta-data get action)"
```

## Debugging

See your Heroku webhook application's logs, or the Contentful webhook request log.

## License

See the [LICENSE](LICENSE.md) file for license rights and limitations (MIT).
