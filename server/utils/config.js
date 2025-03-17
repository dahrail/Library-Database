const config = {
    db: {
      host: "localhost",
      user: "root",
      password: "",
      database: "library_management_system"
    },
    server: {
      port: 5000
    },
    jwt: {
      secret: "your_jwt_secret",
      expiresIn: "1h"
    },
    roles: {
      student: "student",
      faculty: "faculty",
      admin: "admin"
    },
    borrowingLimits: {
      student: {
        maxItems: 3,
        maxDays: 14,
        finePerDay: 1
      },
      faculty: {
        maxItems: 5,
        maxDays: 30,
        finePerDay: 0.5
      }
    }
  };
  
  module.exports = config;