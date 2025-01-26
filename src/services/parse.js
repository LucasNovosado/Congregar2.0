import Parse from 'parse';

Parse.initialize(process.env.VUE_APP_PARSE_APP_ID, process.env.VUE_APP_PARSE_JS_KEY);
Parse.serverURL = process.env.VUE_APP_PARSE_SERVER_URL;

export default Parse;