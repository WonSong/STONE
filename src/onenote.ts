import * as request from 'request';

export default class OneNote {

  oneNoteApiUrl: string

  constructor() {
    this.oneNoteApiUrl = 'https://www.onenote.com/api/v1.0/me/notes/pages';
  }

  sendToOneNote(accessToken, payload) {
    return new Promise<Object>((resolve, reject) => {
      var options = {
        url: this.oneNoteApiUrl,
        headers: { 'Authorization': 'Bearer ' + accessToken, 'Content-Type': 'text/html' },
        body: payload
      };
      request.post(options, (err, response, body) => {
        resolve(response);
      });
    });
  }

}