#Atom Workshop

A single tool for all atom types.

## Running locally

You'll need the [AWS CLI](http://docs.aws.amazon.com/cli/latest/userguide/installing.html) installed, and credentials
for the composer AWS account from [janus](https://janus.gutools.co.uk). You'll also need to follow the
'Install SSL certificates' step in the [dev-nginx readme](https://github.com/guardian/dev-nginx). Then:

 - Fetch config from S3: `./fetch-config.sh`
 - Setup the nginx mapping by following the instructions in the
 [dev-nginx readme](https://github.com/guardian/dev-nginx#install-config-for-an-application).
 - Install Client Side Dependencies with `./scripts/setup.sh`
 - Run app with: `./scripts/start.sh`
 - Run using sbt: `sbt "run 9050"`. (For quick restart you should run `sbt` and then `run 9050`, so that you can exit
  the application without exiting sbt.)

## Compiling Client Side Dependencies

Requires Node 6, we recommend you use [nvm](https://github.com/creationix/nvm) to manage versions of node. We've included an `.nvmrc` file so you can use `nvm use` to switch to the correct version.
You can compile client side dependencies with `yarn build` or `npm run build`.
Alternatively to compile client side assets on change run `yarn build-dev` or `npm run build-dev`

There's a handy script to run both the server and watch for file changes `./scripts/start.sh`

## Hot Reloading

This app also supports Hot Module Reloading for both the React Components and Reducers (not the client side routes currently)

`./scripts/client-dev.sh`

Note: You may see an error regarding Routes on each change, this will be the case until React router v4 is released.

## The Publishing Process for Atoms
This is the publishing process for Atom Workshop and recommended best practices for other Tools that create Atoms

This project uses the [atom maker](https://github.com/guardian/atom-maker/) for publishing, reindexing and saving atoms in a
DynamoDB. As a result there is the concept of Drafts (atoms where all fields are optional) and Atoms where whether or not a
field is optional depends on the [thrift definition](https://github.com/guardian/content-atom).
### Publishing flow
1. Create atom
2. The atom is saved in Draft form in the DraftsDynamoDataStore while the user has not filled out all the fields required according to the thrift
definition. This enables the user to save their work at any point. At this point in the flow the atom is not in CAPI.
3. Every time an atom is saved to the DraftsDynamoDataStore atom workshop also checks if all the required fields have been
supplied. If they have the atom is put in PreviewDynamoDataStore and put into preview CAPI. This step is not visible to the user.
4. The atom is now in a publishable state the 'publish' button in the UI becomes active.
5. On selecting publish the atom is put in the PublishedDynamoDataStore and in live CAPI. Once published the atom can be embedded in
composer content.

### Editing Rules
When editing an atom what is saved where and when?
Note: When referring to automatic save, the save is automatic from the user's perspective. The only manual step for the user is publishing.
#### Scenario 1: An atom is in drafts only
Changes are automatically saved to DraftsDynamoDataStore. If the changes have made the atom valid according to the thrift definition,
i.e. all required fields are provided, the atom is also saved to PreviewDynamoDataStore and preview CAPI is updated
to include the atom. The user does not have to do anything to transition the atom from Drafts to Preview. It is possible to publish the atom.
#### Scenario 2: An atom is in preview and the edit process makes the atom invalid
If the changes make the atom invalid e.g. deleting the content of a required field the automatic save process will also remove the atom from
PreviewDynamoDataStore and preview CAPI. Changes are saved to DraftsDynamoDataStore only. It is not possible to publish the atom.
#### Scenario 3: An atom is in preview and after the edit process the atom is still valid
If the atom is still valid after editing changes are automatically saved in DraftsDynamoDataStore and PreviewDynamoDataStore. Preview CAPI
is updated to reflect the changes made. It is possible to publish the atom.
#### Scenario 4: An atom is live and the edit process makes the atom invalid
If the changes make the atom invalid e.g. deleting the content of a required field it will not be possible to republish the atom.
The atom will remain in live CAPI as it was before the edit took place. The automatic save process will will remove the atom from
PreviewDynamoDataStore and preview CAPI. The changes are saved to DraftsDynamoDataStore only. Further editing to make the atom
valid will be required before it is possible to republish.
#### Scenario 5: An atom is live and after the edit process the atom is still valid
If the atom is still valid after editing changes are automatically saved in DraftsDynamoDataStore and PreviewDynamoDataStore. Preview CAPI
is updated to reflect the changes made. To see the changes live the atom must be manually republished.