module.exports = {
  development: {
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    host: process.env.POSTGRES_HOST,
    dialect: 'postgres',
    operatorsAliases: 'Op',
    seederStorage: 'sequelize',
  },
  test: {
    username: 'postgres',
    password: 'admin',
    database: 'squad-help-test',
    host: 'localhost',
    dialect: 'postgres',
    operatorsAliases: 'Op',
    seederStorage: 'sequelize',
  },
  production: {
    username: 'postgres',
    password: 'admin',
    database: 'squad-help-prod',
    host: 'localhost',
    dialect: 'postgres',
    operatorsAliases: 'Op',
    seederStorage: 'sequelize',
  },
};
