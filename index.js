// Set the API key and client ID
var API_KEY = 'AIzaSyAJfKxKO6ysBH1ud2uCpALNtUaDmYYsTiY';
var CLIENT_ID = '36271507132-99if5fq47omh6trfeb0van5j47c5goie.apps.googleusercontent.com';

// Array of API discovery doc URLs for different APIs
var DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'];

// Authorization scopes required by the API
var SCOPES = 'https://www.googleapis.com/auth/drive.photos.readonly';

// Initialize the API client library
function initClient() {
  gapi.client.init({
    apiKey: API_KEY,
    clientId: CLIENT_ID,
    discoveryDocs: DISCOVERY_DOCS,
    scope: SCOPES
  }).then(function () {
    console.log('Google Drive API client initialized');
  }, function (error) {
    console.error('Error initializing Google Drive API client', error);
  });
}

// Create and open the file picker
function openPicker() {
  gapi.load('picker', {'callback': function() {
    var picker = new google.picker.PickerBuilder()
        .addView(google.picker.ViewId.PHOTOS)
        .setOAuthToken(gapi.auth.getToken().access_token)
        .setDeveloperKey(API_KEY)
        .setCallback(pickerCallback)
        .build();
    picker.setVisible(true);
  }});
}

// A function to handle the file picker response
function pickerCallback(data) {
  if (data.action == google.picker.Action.PICKED) {
    var file = data.docs[0];
    var fileId = file.id;
    var request = gapi.client.drive.files.get({
      'fileId': fileId,
      'alt': 'media'
    });
    request.execute(function (response) {
      var imageUrl = response.webContentLink;
      var imageElement = document.getElementById('image');
      imageElement.src = imageUrl;
    });
  }
}

// Load the API client library
gapi.load('client:auth2', initClient);
