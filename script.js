// Select the input file element
var fileInput = document.querySelector('#file-input');
var originalHeight, originalWidth;
// global variable to preserve original image data
// selecting the image canvas
var canvas = document.getElementById('my-image');
var ctx = canvas.getContext("2d");


var container = document.getElementById("imageContainer");
var slider = document.querySelector('#radius-slider');




slider.addEventListener('input', () => {
  var radius = slider.value; // convert percentage to pixels
  canvas.style.borderRadius = radius + 'px';
});


// onchage event on loading of a file which will draw image and canvas for
// original image
$('#file-input').change(function () {
  var file = this.files[0];
  var image = new Image();

  // Load the image into the canvas and resize it
  var reader = new FileReader();
  reader.onload = function (event) {
    image.src = event.target.result;
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
      container.style.height = height+10 + "px";
      container.style.width = width+10 + "px";
      ctx.drawImage(image, 0, 0, width, height);
      originalData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    };
  };
  reader.readAsDataURL(file);
});







//add eventListner to JPG download button
// add event listener to button
// document.getElementById("imageJPG").addEventListener("click", function () {
//   // Get the canvas and its background color
//   // Convert the temporary canvas to a PNG image and download it
//   var downloadLink = document.createElement('a');
//   downloadLink.download = 'my-image.jpg';
//   downloadLink.href = canvas.toDataURL('image/jpeg');
//   downloadLink.click();
// });


// // add eventListner to PNG download button
// // add event listener to button
// document.getElementById("imagePNG").addEventListener("click", function () {
//   // get the canvas data as a JPG image
//   if (canvas.height && canvas.width) {
//     // create a new canvas element with the original aspect ratio of the uploaded image
//     var downloadCanvas = document.createElement('canvas');
//     downloadWidth = originalWidth;
//     downloadHeight = originalHeight;
//     downloadCanvas.width = originalWidth;
//     downloadCanvas.height = originalHeight;
//     ctx.globalCompositeOperation="destination-over";
//     // draw the uploaded image onto the new canvas, using the original width and height of the image
//     var downloadCtx = downloadCanvas.getContext('2d');
//     downloadCtx.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, downloadWidth, downloadHeight);

//     // get the base64-encoded data URL of the resized image
//     var dataURL = downloadCanvas.toDataURL('image/png', 0.8);

//     // create a link element with the download attribute set to the desired filename and the href attribute set to the data URL of the resized image
//     var downloadLink = document.createElement('a');
//     downloadLink.download = 'image.png';
//     downloadLink.href = dataURL;

//     // simulate a click on the link element to initiate the download
//     downloadLink.click();
//   }
// });

//add eventListner to JPG and PNG download buttons
document.getElementById("imageJPG").addEventListener("click", downloadImage);
document.getElementById("imagePNG").addEventListener("click", downloadImage);

function downloadImage(event) {
  var modifiedCanvas = document.createElement('canvas');
  modifiedCanvas.width = originalWidth;
  modifiedCanvas.height = originalHeight;
  var modifiedCtx = modifiedCanvas.getContext('2d');
  modifiedCtx.drawImage(canvas, 0, 0, originalWidth, originalHeight);
  modifiedCtx.globalCompositeOperation = 'destination-in';
  modifiedCtx.rect(0, 0, originalWidth, originalHeight);
  modifiedCtx.fill();
  var downloadLink = document.createElement('a');
  if (event.target.id === 'imageJPG') {
    downloadLink.download = 'my-image.jpg';
    downloadLink.href = modifiedCanvas.toDataURL('image/jpeg');
  } else if (event.target.id === 'imagePNG') {
    downloadLink.download = 'my-image.png';
    downloadLink.href = modifiedCanvas.toDataURL('image/png');
  }
  downloadLink.click();


}
