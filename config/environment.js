const fs = require('fs');
const rfs = require('rotating-file-stream');
const path = require('path');

const logDirectory = path.join(__dirname, '../production_logs');
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

const accessLogStream = rfs.createStream('access.log', {
    size: '10M',
    interval: '1d',
    path: logDirectory
});

const development = {
    name: 'development',
    asset_path: './assets',
    session_cookie_key: 'blahsomething',
    db: 'codeial_development',
    mongoStore: 'codeial_development',
    smtp: {
        // service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: 'manastemp1999@gmail.com',
            pass: 'irlcdavkuvsdlary'
        }
    },
    google_clientID: "169062748545-r334v7d3hth7cv88ld05upjbgnuik9u6.apps.googleusercontent.com",
    google_clientSecret: "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",
    // google_callbackURL: "http://localhost:8000/users/auth/google/callback",
    google_callbackURL: "https://social-43wq.onrender.com/users/auth/google/callback",
    jwt_secret: 'codeial',
    morgan: {
        mode: 'dev',
        options: {stream: accessLogStream}
    }
}

const production = {
    name: process.env.CODEIAL_ENVIRONMENT,
    asset_path: process.env.CODEIAL_ASSET_PATH,
    session_cookie_key: process.env.CODEIAL_SESSION_COOKIE_KEY,
    db: process.env.CODEIAL_DB,
    mongoStore: 'codeial_production',
    smtp: {
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: 'manastemp1999@gmail.com',
            pass: 'Manastemp@123'
        }
    },
    google_clientID: process.env.CODEIAL_GOOGLE_CLIENT_ID,
    google_clientSecret: process.env.CODEIAL_GOOGLE_CLIENT_SECRET,
    google_callbackURL: process.env.CODEIAL_GOOGLE_CALLBACK_URL,
    jwt_secret: process.env.CODEIAL_JWT_SECRET,
    morgan: {
        mode: 'combined',
        options: {stream: accessLogStream}
    }
}

module.exports = eval(process.env.CODEIAL_ENVIRONMENT) === undefined ? development:eval(process.env.CODEIAL_ENVIRONMENT);