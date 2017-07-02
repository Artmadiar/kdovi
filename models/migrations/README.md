# Sequelize migrations

* alter tables in DB and create track of your changes
* existing models do have to be updated manually

### Dependencies

```npm install -g sequelize-cli```

## Create new migration

Check [documentation](http://docs.sequelizejs.com/en/latest/docs/migrations/) to find out how to define new migration.

New migration is initialized by:

`sequelize migration:create --migrations-path models/migrations/ --config configs/migrations.js --env --name newColumn`

## Execute migration / Update your models

```sequelize db:migrate --migrations-path models/migrations/ --config configs/migrations.js --env```

## Execute undo last migration

```sequelize db:migrate:undo --migrations-path models/migrations/ --config configs/migrations.js --env```
