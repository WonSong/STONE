(function () {

  const url = window.location.hash;
  const accessToken = url.match(/\#(?:access_token)\=([\S\s]*?)\&/)[1];
  const oneNoteApiUrl = 'https://www.onenote.com/api/v1.0/me/notes/pages';
  const payload = decodeURIComponent(document.getElementById('payload').value);

  document.getElementById('preview').innerHTML = payload;

  const request = new XMLHttpRequest();
  request.open('POST', oneNoteApiUrl, true);
  request.setRequestHeader('Authorization', 'Bearer ' + accessToken);
  request.setRequestHeader('Content-Type', 'text/html');
  request.send(payload);

  request.onreadystatechange = () => {
    if (request.readyState === XMLHttpRequest.DONE && request.status === 201) {
      const response = JSON.parse(request.responseText);
      document.getElementById('app-link').setAttribute('href', response.links.oneNoteClientUrl.href);
    }
  }
})();