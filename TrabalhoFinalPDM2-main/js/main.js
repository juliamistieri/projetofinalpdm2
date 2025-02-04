import { salvaFoto } from './db.js';

//Registrando a service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      let reg = await navigator.serviceWorker.register('/sw.js', { type: "module" });
      console.log('Service worker registrada! 😎', reg);
    } catch (err) {
      console.log('😥 Service worker registro falhou: ', err);
    }
  });
}

//Configurando as constraintes do video stream
var constraints = { video: { facingMode: "user" }, audio: false };

//Capturando os elementos em tela
const cameraView = document.querySelector("#camera--view"),
cameraOutput = document.querySelector("#camera--output"),
cameraSensor = document.querySelector("#camera--sensor"),
cameraTrigger = document.querySelector("#camera--trigger");

//Estabelecendo o acesso a camera e inicializando a visualização
function cameraStart() {
  navigator.mediaDevices
  .getUserMedia(constraints)
  .then(function (stream) {
    cameraView.srcObject = stream;
  })
  .catch(function (error) {
    console.error("Ocorreu um erro.", error);
  });
}

//Função para tirar foto
cameraTrigger.onclick = function () {
  cameraSensor.width = cameraView.videoWidth;
  cameraSensor.height = cameraView.videoHeight;
  cameraSensor.getContext("2d").drawImage(cameraView, 0, 0);
  cameraOutput.src = cameraSensor.toDataURL("image/webp");
  cameraOutput.classList.add("taken");

  //Salvando no db
  const imageData = cameraSensor.toDataURL("image/webp");
  salvaFoto(imageData);
};

// Carrega imagem da câmera quando a janela carregar
window.addEventListener("load", cameraStart, false);


window.onload = () => {
  "use strict"; 
  if ("serviceWorker" in navigator){ 
      navigator.serviceWorker.register("./sw.js"); 
  }
};