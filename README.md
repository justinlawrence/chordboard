### Installation

```yarn install```

#### Enable cors
Copied from https://github.com/pouchdb/add-cors-to-couchdb

```npm install -g add-cors-to-couchdb```

```add-cors-to-couchdb```


```ln -s conf/chordboard.apache.conf /etc/apache/sites-available/chordboard```


### Setup the cloudenode repository

```cd /var/www```
```git clone https://git.cloudno.de/git/justinlawrence/4562-6808553a425b8153640c8a2b9816afe4.git```
```mv 4562-6808553a425b8153640c8a2b9816afe4 chordboard-cloudnode```
```cd chordboard```
```yarn deploy-cloudnode```
```cd ../chordboard-cloudnode/```
```git add .```
```git commit -m "Initial commit"```
```git push origin master```

### Run the project

```yarn start```


### Deploy the project

```yarn deploy```
