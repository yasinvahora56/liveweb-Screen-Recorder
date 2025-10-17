let mediaRecorder;
let recordedChunks = [];
let stream;
let timeInterval, seconds =0; 

const startBtn = document.getElementById("startbtn")
const stoptbtn = document.getElementById("stoptbtn")
const downloadebtn = document.getElementById("downloadebtn")
const preview = document.getElementById("preview")
const timer = document.getElementById("timer")


startBtn.onclick = async () => {
    const quality = document.getElementById("quality").ariaValueMax
    let videoConstraint

    if (quality === "sd"){
        videoConstraint = {width:640, height:360}
    }else if(quality === "hd"){
        videoConstraint = {width:1280, height:720}
    }else if(quality === "4k"){
        videoConstraint = {width:3840, height:2160}
    }

    try {
        stream = await navigator.mediaDevices.getDisplayMedia({video : true, audio : true})
        preview.srcObject = stream
        mediaRecorder = new MediaRecorder(stream)
    } catch (error) {
        alert("Unable to Start Screen Recording: " + error.message)
    }
}

