const start = Date.now();
var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");
var img = document.getElementById("dog");
var w = document.getElementById("dog").clientWidth;  //lungimea imaginii
var h = document.getElementById("dog").clientHeight;  //inaltimea imaginii
img.crossOrigin = "Anonymous";


function myCanvas() {

  w = document.getElementById("dog").clientWidth;  //lungimea imaginii
  h = document.getElementById("dog").clientHeight;  //inaltimea imaginii
  c.height = h;
  c.width = w;
  ctx.drawImage(img, 0, 0, w, h);
  const img1 = ctx.getImageData(0, 0, w, h);
  console.log(img1);
  var scannedImage = img1.data;
  console.log(scannedImage);
  
  //inversam imaginea prin mutarea pixelilor de la stanga la dreapta
  for (var y = 0; y < h; y++) {
    for (var x = 0; x < w / 2; x++) {
      var index1 = (y * w + x) * 4;
      var index2 = (y * w + w - x - 1) * 4;

      var red = scannedImage[index1];
      var green = scannedImage[index1 + 1];
      var blue = scannedImage[index1 + 2];
      var alpha = scannedImage[index1 + 3];

      scannedImage[index1] = scannedImage[index2];
      scannedImage[index1 + 1] = scannedImage[index2 + 1];
      scannedImage[index1 + 2] = scannedImage[index2 + 2];
      scannedImage[index1 + 3] = scannedImage[index2 + 3];

      scannedImage[index2] = red;
      scannedImage[index2 + 1] = green;
      scannedImage[index2 + 2] = blue;
      scannedImage[index2 + 3] = alpha;
    }
  }

  ctx.putImageData(img1, 0, 0);
  timeout = setTimeout(normalizeColors, 5000); 
  const millis = Date.now() - start;
  console.log(millis);   //setam un timp de afisare pana aplicam filtrul de normalizare imaginii
  console.log("s a pus filtrul");

}


async function refresh() {     //pentru butonul de refresh al paginii
  let url = "https://dog.ceo/api/breeds/image/random";
  try {
    let result = await fetch(url);
    return await result.json();
  }
  catch (error) {
    console.log(error);
  }


}

async function refreshPage() {

  //pentru butonul de refresh al paginii
  let dogs = await refresh();
  fetch('https://dog.ceo/api/breeds/image/random')
    .then(response => response.json())
    .then(data => {
      console.log(data);
      img.src = dogs.message;

    })

}

function normalizeColors() {
  crossOrigin = "ANONYMOUS";
  var ImageData = ctx.getImageData(0, 0, w, h);     //luam imaginea inversata
  const data = ImageData.data;                          //obtinem valorile RGB
  for (let i = 0; i < data.length; i += 4) {

    var r = data[i];             //valoarea rosu
    var g = data[i + 1];           //valoarea vrede
    var b = data[i + 2];          //valoarea albastru
    var sum = r + b + g;
    data[i] = r / sum * 255;        //normalizam rosu
    data[i + 1] = g / sum * 255;      //normalizam verde
    data[i + 2] = b / sum * 255;      //normalizam albastru
  }
  console.log(ImageData);
  ctx.putImageData(ImageData, 0, 0);    //afisam imaginea modificata
  //console.log(r);
  //console.log(g);
  //console.log(b);
  //console.log(ImageData);

  //ctx.drawImage(img, 0, 0, 200, 300, -200, 0, 200, 300  );
  console.log("s a pus");
  ctx.restore();
}

function myStopFunction() {
  clearTimeout(timeout);
}