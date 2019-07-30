# Atom Workshop

A single tool for all atom types.

## Running locally

You'll need the [AWS CLI](http://docs.aws.amazon.com/cli/latest/userguide/installing.html) installed, and credentials
for both the composer and capi AWS accounts from [janus](https://janus.gutools.co.uk/multi-credentials?&permissionIds=capi-dev,composer-dev&tzOffset=1). You will then need to:

 - Fetch config from S3 `./fetch-config.sh`
 - If you get an error message saying that you requred AWS Signature Version 4, configure your aws cli by running `aws configure set default.s3.signature_version s3v4`
 - Install dependencies with `./scripts/setup.sh`
 - Run app with `./scripts/start.sh`
 - Alternatively, run with [Hot Reloading](https://github.com/guardian/atom-workshop#hot-reloading) using `.scripts/client-dev.sh`
 - Access the app by visiting https://atomworkshop.local.dev-gutools.co.uk (just make sure nginx is running on your machine)

## Compiling Client Side Dependencies

Requires Node 6, we recommend you use [nvm](https://github.com/creationix/nvm) to manage versions of node. We've included an `.nvmrc` file 
in this project so you can use `nvm use` to switch to the correct version.
You can compile client side dependencies with `yarn build` or `npm run build`.
Alternatively to compile client side assets on change run `yarn build-dev` or `npm run build-dev`

## Hot Reloading

This app also supports Hot Module Reloading for both the React Components and Reducers (not the client side routes currently)

`./scripts/client-dev.sh`

Note: You may see an error regarding Routes on each change, this will be the case until React router v4 is released.
