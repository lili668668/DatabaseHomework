var config = {
    user: process.env.npm_package_config_dbUser,
    password: process.env.npm_package_config_dbPasswd,
    server: process.env.npm_package_config_dbServer,
    database: process.env.npm_package_config_dbName,
    port: process.env.npm_package_config_dbPort,

    options: {
        encrypt: true
    }
}

module.exports = config;
