
const {google} = require('googleapis');
const {OAuth2} = google.auth;
const oAuthClient = new OAuth2(
    '706145537400-4nnurjjbalv58p16423nf2919aer35ae.apps.googleusercontent.com',
    'jPGIfrH3kQzpo_9wZW6Sude1'
);
oAuthClient.setCredentials({
    refresh_token: '1//042ExRvQd7qwICgYIARAAGAQSNwF-L9IrrjBfFtwz0EvoVjNY63IIcEcat7OGTX3Mvyrp-wNOIswSCZ6bG3UcSiSh3yk0Y2kbzAA',
});
const calendar = google.calendar({version: 'v3', auth: oAuthClient});


module.exports = calendar;
