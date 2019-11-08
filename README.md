#Chordboard

[![song-viewer.png](https://i.postimg.cc/2SB25dnB/www-chordboard-co-songs-ae-E5-Wl4-Ehx-A8j-LC0c-GOj-1.png)](https://postimg.cc/LJ2zC1CH)

Chordboard is a web app that allows musicians to share setlists and chords.

Built using React, Firebase, Material-UI and friends.

## How it works

Create setlists, add songs, transpose songs in real-time, for your band, school, 

## Setting it up for yourself

This project is built using create-react-app and firebase. To get it running properly, you'll need to create your own firebase application and export your firebase configuration in a file at src/firebase-config.ts. The config should look something like this:

```js
// src/firebase-config.ts
const config = {
  apiKey: "myapikey",
  authDomain: "my-auth-domain.firebaseapp.com",
  databaseURL: "my-db-url.com",
  projectId: "my-pid",
  storageBucket: "my-storage-bucket",
  messagingSenderId: "my-sender-id",
  ALGOLIA_APP_ID: "my-app-id",
  ALGOLIA_USER_SEARCH_KEY: "my-user-search-key"
};

export default config;
```

You'll also need to install the local dependencies using Yarn or NPM.


```
npm i
```


You'll need to either deploy the code to a hosted server, or emulate them locally. Finally, you can run it:

```
npm start
```

## Deploying

Use firebase-cli to initalize a project in the root directory. Then build your project and deploy.

npm run build
firebase deploy


## About

This project is maintained by [https://github.com/justinlawrence](Justin Lawrence) and [https://github.com/brettsvoid](Brett Henderson)

## License

License: [https://creativecommons.org/licenses/by/3.0/](CC-BY)
