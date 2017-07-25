const url = window.location.hash;
const accessToken = url.match(/\#(?:access_token)\=([\S\s]*?)\&/)[1];
const oneNoteApiUrl = 'https://www.onenote.com/api/v1.0/me/notes/pages';
var request = new XMLHttpRequest();
request.open('POST', oneNoteApiUrl, true);
request.setRequestHeader('Authorization', 'Bearer ' + accessToken);
request.setRequestHeader('Content-Type', 'text/html');
request.send(decodeURIComponent(document.getElementById('payload').value));