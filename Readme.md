## Mongo Migrations

This small library works as friendly migration tool for mongodb databases.
Supports replicas and transactions.

### How it works

We use mongodb connector in order to create/delete/execute migrations scripts on mongodb databases.
Each script receives the mongodb client and a session only when replicaSet is setup in order to support transactional operations.

### Inspiration

We don't have a simple tool to migrate mongodb databases and this one keeps everything simple, we don't use anything else rather than the mongo connector.

### How to install

`npm i --save-dev mongo-migrations` or globally `npm i -g mongo-migrations`

Once installed you can execute the command as a terminal command.

### How to use it

Command Syntax: 
```
mongo-migrations config=<optional> action=<create/delete/init/status/up/down> <parameters:name=value>
```

Here are a list of available commands:

* `mongo-migrations action=create name=<some name>`: creates a new migration inside the configured migration folder.
* `mongo-migrations action=delete name=<some name>`: deletes the migration from the configured migration folder.
* `mongo-migrations action=down amount=<optional>`: executes a down operation on the latest amount of executed migrations (by default is only the latest one).
* `mongo-migrations action=up`: executes an up operation to migrate up all the pending migrations.
* `mongo-migrations action=status`: shows the migrations status on the db.
* `mongo-migrations action=init`: generates the initial configuration in order to use this program.
* In all the commands the param `config` can be set with a custom file path in order to load a different configuration.

You can always use `mongo-migrations --help` in order to see the available commands help.