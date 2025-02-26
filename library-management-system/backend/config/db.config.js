module.exports = {
    HOST: "localhost",
    USER: "your_username",
    PASSWORD: "your_password",
    DB: "library_management_system",
    dialect: "mysql",
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
};