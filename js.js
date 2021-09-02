// Nahravac videa z webkamery do MP4
// Zdroj: https://www.antopiras.dev/blog/2021-05-15-using-the-mediastream-web-api-to-record-screen-camera-and-audio/

// Objekt HTML5 videa
const video = document.querySelector("#video");
// Objekt rekorderu
let rekorder = null;

// Ziskej stream z pripojene kamery a zvuk z mikrofonu
// s temito parametry
async function ziskejStream(parametry = {
    video: {
      width: 1280,
      height: 720
    },
    audio: {
      echoCancellation: true,
      noiseSuppression: true,
      sampleRate: 44100
    }
  }) {
  const stream = await navigator.mediaDevices.getUserMedia(parametry);
  
  video.src = src;
  video.srcObject = stream;
  video.muted = true;
  
  return stream;
}

// Po klepnuti na tlacitko Nahravat
// Zacni nahravat video
async function nahravej() {
  const stream = await ziskejStream();
  
  video.src = src;
  video.srcObject = stream;
  video.muted = true;
  
  rekorder = new MediaRecorder(stream);
  
  // Pole cunku/dilku videa
  let chunks = [];

  // Pri novem chunku jej pridej do pole 
  rekorder.ondataavailable = event => {
    if (event.data.size > 0) {
      chunks.push(event.data);
    }
  }
  
  // Pri zastaveni nahravani sloz cunky do blobu
  // Blob je univerzalni datovy typ pro velka data
  // Blob bude mit datovy typ video/MP4
  rekorder.onstop = () => {
    const blob = new Blob(chunks, {
      type: "video/mp4"
    })
    
    // Smaz pole cunku
    chunks = [];
    
    // Vytvor z blobu URL
    // a nastv jej jako zdroj objektu HTML5 videa
    const blobUrl = URL.createObjectURL(blob);
    video.srcObject = null;
    video.src = blobUrl;
    video.muted = false;
   }
   
   // Zacni nahravat
  rekorder.start();
}

// Po klepnuti na tlacitko Zastavit nahravani
// Ukonci nahravani
function zastavit() {
 rekorder.stream.getTracks().forEach(track => track.stop())
}