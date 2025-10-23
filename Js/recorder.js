// js/recorder.js

// Start recording flow
beginRecordingBtn.addEventListener('click', async () => {
  // Quality constraints set karein
  let videoConstraint;
  if (selectedQuality === 'sd') {
    videoConstraint = { width: 640, height: 360 };
    infoQuality.textContent = 'SD (640x360)';
  } else if (selectedQuality === 'hd') {
    videoConstraint = { width: 1280, height: 720 };
    infoQuality.textContent = 'HD (1280x720)';
  } else if (selectedQuality === '4k') {
    videoConstraint = { width: 3840, height: 2160 };
    infoQuality.textContent = '4K (3840x2160)';
  }

  // UI Update karein
  welcomeScreen.style.display = 'none';
  recordingScreen.style.display = 'grid';

  try {
    // --- STEP 1: Audio Config Set Karein ---
    // Decide karein ki getDisplayMedia ke saath audio request karna hai ya nahi
    let gdmAudio = (selectedAudioSource === 'system') || (selectedAudioSource === 'mic-system');

    // --- STEP 2: Video Stream Haasil Karein ---
    videoStream = null;
    if (selectedRecordingType === 'screen' || selectedRecordingType === 'screen-video') {
      videoStream = await navigator.mediaDevices.getDisplayMedia({
        video: videoConstraint,
        audio: gdmAudio // YEH HAI MAIN CHANGE
      });
    } else if (selectedRecordingType === 'video') {
      videoStream = await navigator.mediaDevices.getUserMedia({
        video: videoConstraint,
        audio: false // Webcam ke saath system audio nahi le sakte
      });
    }

    // --- STEP 3: Audio Stream Haasil Karein ---
    audioStream = null;
    if (selectedAudioSource === 'mic') {
      // Sirf Mic
      audioStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
    } else if (selectedAudioSource === 'mic-system') {
      // Mic + System
      const micStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      const systemAudioTracks = videoStream.getAudioTracks();
      
      if (systemAudioTracks.length === 0) {
        throw new Error("Aapne system audio share nahi kiya. Please 'Share system audio' checkbox ko check karein.");
      }
      
      audioStream = new MediaStream([
        ...micStream.getAudioTracks(),
        ...systemAudioTracks
      ]);
    } else if (selectedAudioSource === 'system') {
      // Sirf System
      const systemAudioTracks = videoStream.getAudioTracks();
      if (systemAudioTracks.length === 0) {
        throw new Error("Aapne system audio share nahi kiya. Please 'Share system audio' checkbox ko check karein.");
      }
      audioStream = new MediaStream(systemAudioTracks);
    }
    // 'silent' ke liye audioStream null hi rahega

    // --- STEP 4: Sabhi Streams Ko Combine Karein ---
    stream = new MediaStream();
    if (videoStream) {
      videoStream.getVideoTracks().forEach(track => stream.addTrack(track));
    }
    if (audioStream) {
      audioStream.getAudioTracks().forEach(track => stream.addTrack(track));
    }

    if (stream.getTracks().length === 0) {
      throw new Error('Record karne ke liye koi source nahi mila.');
    }

    // --- STEP 5: MediaRecorder Setup Karein ---
    preview.srcObject = videoStream; 
    
    mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm; codecs=vp8,opus'
    });
    recordedChunks = [];

    mediaRecorder.ondataavailable = event => {
      if (event.data.size > 0) recordedChunks.push(event.data);
    };

    mediaRecorder.onstop = () => {
      stopTimer();
      stopBtn.disabled = true;
      downloadBtn.disabled = false;
      uploadBtn.disabled = false;
      infoStatus.textContent = 'Stopped';
      statusCard.classList.remove('recording');
      recordingDot.style.display = 'none';

      // Sabhi original streams ko stop karein
      if (videoStream) videoStream.getTracks().forEach(track => track.stop());
      if (audioStream) audioStream.getAudioTracks().forEach(track => track.stop());
      if (stream) stream.getTracks().forEach(track => track.stop());

      preview.srcObject = null;
      previewBtn.classList.add('active');
    };

    // --- STEP 6: Recording Shuru Karein ---
    mediaRecorder.start();
    startTimer();
    stopBtn.disabled = false; 
    statusCard.classList.add('recording');
    infoStatus.textContent = 'Recording';

  } catch (error) {
    console.error("Recording error:", error);
    
    // Zaroori Error Handling
    if (error.name === 'NotFoundError') {
      alert('Error: Device nahi mila. Agar mic select kiya hai, toh check karein ki mic connected hai ya nahi.');
    } else if (error.name === 'NotAllowedError') {
      alert('Error: Aapne permission deny kar di hai. Please allow karke phir try karein.');
    } else {
      alert("Recording shuru nahi ho saki: " + error.message);
    }
    
    // UI ko reset karein
    welcomeScreen.style.display = 'block';
    recordingScreen.style.display = 'none';
    
    if (videoStream) videoStream.getTracks().forEach(track => track.stop());
    if (audioStream) audioStream.getTracks().forEach(track => track.stop());
  }
});

// Stop recording
stopBtn.addEventListener('click', () => {
  if (mediaRecorder && mediaRecorder.state !== 'inactive') {
    mediaRecorder.stop();
  }
});