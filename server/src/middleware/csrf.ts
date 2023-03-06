const csrf = require('csurf');
const bodyParser = require('body-parser');

export const csrfProtection = csrf({ cookie: false });
export const parseForm = bodyParser.urlencoded({ extended: false });
