var fileInput = document.querySelector('#file-input');
var originalWidth, originalHeight;
var canvas = document.querySelector('#my-canvas');
const radiusSlider = document.querySelector('#radius-slider');
const bgColorPicker = document.querySelector('#color-picker');
const downloadButton = document.querySelector('#download-button');
const container = document.getElementById('image-container');
const ctx = canvas.getContext('2d');

// load image from file input and draw it on the canvas
fileInput.addEventListener('change', function (event) {
  const file = event.target.files[0];
  const reader = new FileReader();
  reader.onload = function () {
    const img = new Image();
    img.onload = function () {
      const maxWidth = 800;
      const maxHeight = 500;
      const width = img.width;
      const height = img.height;
      originalHeight = img.height;
      originalWidth = img.width;
      if (width > maxWidth || height > maxHeight) {
        if (width / height > maxWidth / maxHeight) {
          canvas.width = maxWidth;
          canvas.height = height * maxWidth / width;
        } else {
          canvas.width = width * maxHeight / height;
          canvas.height = maxHeight;
        }
      } else {
        canvas.width = width;
        canvas.height = height;
      }
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };
    img.src = reader.result;
  };
  reader.readAsDataURL(file);
});

// change the border radius of the canvas based on the value of the slider
radiusSlider.addEventListener('input', function () {
  var radius = this.value;
  canvas.style.borderRadius = radius + 'px';
});

// // change the background color of the container based on the value of the color picker
// bgColorPicker.addEventListener('input', function () {
//   const bgColorValue = this.value;
//   // document.querySelector('#image-container').style.backgroundColor ='transparent';
//   // canvas.style.backgroundColor = 'rgba(0, 0, 0, 0)';
// });

// download the modified canvas when the button is clicked
downloadButton.addEventListener('click', function () {
  html2canvas(document.querySelector('#my-canvas'), {
    backgroundColor: null,
    useCORS: true
  }).then(function (canvas) {
    const downloadCanvas = document.createElement('canvas');
    downloadWidth = originalWidth;
    downloadHeight = originalHeight;
    downloadCanvas.width = originalWidth;
    downloadCanvas.height = originalHeight;

    // draw the uploaded image onto the new canvas, using the original width and height of the image
    const downloadCtx = downloadCanvas.getContext('2d');
    downloadCtx.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, downloadWidth, downloadHeight);

    // get the base64-encoded data URL of the resized image
    const dataURL = downloadCanvas.toDataURL('image/png', 0.8);

    // create a link element with the download attribute set to the desired filename and the href attribute set to the data URL of the resized image
    const downloadLink = document.createElement('a');
    downloadLink.download = 'image.png';
    downloadLink.href = dataURL;

    // simulate a click on the link element to initiate the download
    downloadLink.click();
  });
});



/* exported gapiLoaded */
/* exported gisLoaded */
/* exported handleAuthClick */
/* exported handleSignoutClick */

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
const SCOPES = 'https://www.googleapis.com/auth/drive.metadata.readonly';

// TODO(developer): Set to client ID and API key from the Developer Console
var CLIENT_ID = '36271507132-99if5fq47omh6trfeb0van5j47c5goie.apps.googleusercontent.com';
var API_KEY = 'AIzaSyAJfKxKO6ysBH1ud2uCpALNtUaDmYYsTiY';
var image = document.getElementById('drive-image');
// TODO(developer): Replace with your own project number from console.developers.google.com.
const APP_ID = '36271507132';

let tokenClient;
let accessToken = null;
let pickerInited = false;
let gisInited = false;

/**
 * Callback after api.js is loaded.
 */
function gapiLoaded() {
  gapi.load('client:picker', initializePicker);
}

/**
 * Callback after the API client is loaded. Loads the
 * discovery doc to initialize the API.
 */
async function initializePicker() {
  await gapi.client.load('https://www.googleapis.com/discovery/v1/apis/drive/v3/rest');
  pickerInited = true;
  maybeEnableButtons();
}

/**
 * Callback after Google Identity Services are loaded.
 */
function gisLoaded() {
  tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: CLIENT_ID,
    scope: SCOPES,
    callback: '', // defined later
  });
  gisInited = true;
  maybeEnableButtons();
}

/**
 * Enables user interaction after all libraries are loaded.
 */
function maybeEnableButtons() {
  if (pickerInited && gisInited) {
    document.getElementById('drive-upload').style.visibility = 'visible';
  }
}

/**
 *  Sign in the user upon button click.
 */
function handleAuthClick() {
  tokenClient.callback = async (response) => {
    if (response.error !== undefined) {
      throw (response);
    }
    accessToken = response.access_token;
    document.getElementById('drive-upload').innerText = 'Refresh';
    await createPicker();
  };

  if (accessToken === null) {
    // Prompt the user to select a Google Account and ask for consent to share their data
    // when establishing a new session.
    tokenClient.requestAccessToken({ prompt: 'consent' });
  } else {
    // Skip display of account chooser and consent dialog for an existing session.
    tokenClient.requestAccessToken({ prompt: '' });
  }
}

/**
 *  Sign out the user upon button click.
 */
function handleSignoutClick() {
  if (accessToken) {
    accessToken = null;
    google.accounts.oauth2.revoke(accessToken);
    document.getElementById('content').innerText = '';
    document.getElementById('authorize_button').innerText = 'Authorize';
    document.getElementById('signout_button').style.visibility = 'hidden';
  }
}

/**
 *  Create and render a Picker object for searching images.
 */
function createPicker() {
  const view = new google.picker.View(google.picker.ViewId.DOCS);
  view.setMimeTypes('image/png,image/jpeg,image/jpg');
  const picker = new google.picker.PickerBuilder()
    .enableFeature(google.picker.Feature.NAV_HIDDEN)
    .enableFeature(google.picker.Feature.MULTISELECT_ENABLED)
    .setDeveloperKey(API_KEY)
    .setAppId(APP_ID)
    .setOAuthToken(accessToken)
    .addView(view)
    .addView(new google.picker.DocsUploadView())
    .setCallback(pickerCallback)
    .build();
  picker.setVisible(true);
}

/**
 * Displays the file details of the user's selection.
 * @param {object} data - Containers the user selection from the picker
 */
async function pickerCallback(data) {
  if (data.action == google.picker.Action.PICKED) {
    var fileId = data.docs[0].id;
    var imageURL = "https://drive.google.com/uc?id=" + fileId;
    var image = new Image();
    image.src = imageURL;
    image.onload = function () {
      let width, height;
      originalHeight = image.height;
      originalWidth = image.width;
      if (image.width > image.height) {
        var widthRatio = 500 / image.width;
        width = 500;
        height = image.height * widthRatio;
        if (height > 500) {
          var heightRatio = 500 / height;
          height = 500;
          width = width * heightRatio;
        }
      } else {
        var heightRatio = 500 / image.height;
        height = 500;
        width = image.width * heightRatio;
        if (width > 500) {
          var widthRatio = 500 / width;
          width = 500;
          height = height * widthRatio;
        }
      }
      canvas.width = width;
      canvas.height = height;
      console.log(width, height);
      container.style.height = height + 10 + "px";
      container.style.width = width + 10 + "px";
      ctx.drawImage(image, 0, 0, width, height);
      originalData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      //document.getElementById("image-container").appendChild(img);
    }
  }
}
