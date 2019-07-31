const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));

const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');

const PORT = process.env.PORT || 3000;

var jsonData = [];

app.get('/movieinfo', (req, res) => {
	console.log('/movieinfo request');
	res.send(JSON.stringify(jsonData));
})

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';

function getMovieInfo() {
	// Load client secrets from a local file.
	fs.readFile('credentials.json', (err, content) => {
		if (err) return console.log('Error loading client secret file:', err);
		// Authorize a client with credentials, then call the Google Sheets API.
		authorize(JSON.parse(content), listMovies)
	});
}

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
	const { client_secret, client_id, redirect_uris } = credentials.installed;
	const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

	// Check if we have previously stored a token.
	fs.readFile(TOKEN_PATH, (err, token) => {
		if (err) return getNewToken(oAuth2Client, callback);
		oAuth2Client.setCredentials(JSON.parse(token));
		callback(oAuth2Client);
	});
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getNewToken(oAuth2Client, callback) {
	const authUrl = oAuth2Client.generateAuthUrl({
		access_type: 'offline',
		scope: SCOPES,
	});
	console.log('Authorize this app by visiting this url:', authUrl);
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
	});
	rl.question('Enter the code from that page here: ', (code) => {
		rl.close();
		oAuth2Client.getToken(code, (err, token) => {
			if (err) return console.error('Error while trying to retrieve access token', err);
			oAuth2Client.setCredentials(token);
			// Store the token to disk for later program executions
			fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
				if (err) return console.error(err);
				console.log('Token stored to', TOKEN_PATH);
			});
			callback(oAuth2Client)
		});
	});
}

/**
 * Prints the movie information:
 * @see https://docs.google.com/spreadsheets/d/1kAOwMtCsUHy7eRs2ycghyL24imtVpKbl2Gl_CY6rKtw/edit
 * @param {google.auth.OAuth2} auth The authenticated Google OAuth client.
 */
function listMovies(auth) {
	const sheets = google.sheets({ version: 'v4', auth });
	sheets.spreadsheets.values.get({
		spreadsheetId: '1kAOwMtCsUHy7eRs2ycghyL24imtVpKbl2Gl_CY6rKtw',
		range: 'A1:J',
	}, (err, res) => {
		if (err) return console.log('The API returned an error: ' + err);
		const rows = res.data.values;
		if (rows.length) {
			// Print columns A through J

			rows.map((row) => {
				var data = {
					"rank": `${row[0]}`,
					"name": `${row[1]}`,
					"studio": `${row[2]}`,
					"worldwide": `${row[3]}`,
					"year": `${row[4]}`,
					"image": `${row[5]}`,
					"genre": `${row[6]}`,
					"runtime": `${row[7]}`,
					"rating": `${row[8]}`,
					"budget": `${row[9]}`
				};
				jsonData.push(data);
				//console.log(`${row[0]}, ${row[1]}, ${row[2]}, ${row[3]}, ${row[4]}, ${row[5]}`);
			});
		} else {
			console.log('No data found.');
		}
	});
}

getMovieInfo();