# Strapi Social Simply

A simplified aproach to login using **CMS Strapi** via social network.

## Dependencies

The plugin has dependencies on fb and axios, so before anything run the commands:
 - `npm i fb --save`
 - `npm i fb --save`

Using yarn:

 - `yarn add fb`
 - `yarn add axios`
 
## Getting started

 1. Go to your strapi project
 2. Open the project `/extensions` folder
 3. Clone the folder `/social` inside the folder
4. Open the file `/extensions/social/config/custom.json` and insert your facebook id and secret.
> **Note**: If you want to different api credentials for each environment, you can use environment variables to do so.

You are ready to go!

## Usage
When you make a request to google or facebook, get the access token and send through:

 - POST - `/social/facebook` BODY `{access_key: Ajsu.fi4s9uS...}`
to access using facebook token

or:

 - POST - `/social/google` BODY `{access_key: s5Kj.8sEo...}`
to access using facebook token

> WARNING: New users that are created will look for the role with name Authenticated. if there are no roles with this name, the plugin will crash. To use custom role names, you may do so editing the the `Auth.js` inside the `controllers` folder.

Happy Coding!
