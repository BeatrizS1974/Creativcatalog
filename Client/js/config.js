const hostname = window.location.hostname;

let indexURL;

if (hostname === 'localhost' || hostname === '127.0.0.1') {
  indexURL = 'http://localhost:3000';
} else {
  indexURL = `https://${hostname}`;
}
