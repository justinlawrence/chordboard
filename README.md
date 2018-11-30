### Installation

```yarn install```

#### Enable cors
Copied from https://github.com/pouchdb/add-cors-to-couchdb

```npm install -g add-cors-to-couchdb```

```add-cors-to-couchdb```


```ln -s conf/chordboard.apache.conf /etc/apache/sites-available/chordboard```


### Setup the cloudenode repository

```cd /var/www```
```git clone https://git.cloudno.de/git/justinlawrence/4562-6808553a425b8153640c8a2b9816afe4.git chordboard-cloudnode```
```cd chordboard```
```yarn deploy-cloudnode```

### Run the project

```yarn start```


### Deploy the project

```yarn deploy```

### Why ChordBoard?

* Centralised song database
* No duplication
* For everyone: No iPad
* Mailed out setlists with youtube links and practice links
####Later:
* Spontaneous
  - Linked songs
    - Songs that work in this key with similar themes
    - Songs that work in this key with similar structures
* Tablature
* Nashville chord colouring
* Remote control


### TODO
* Remove PouchDB
* Remove Sass
* Move project into create-react-app skeleton
