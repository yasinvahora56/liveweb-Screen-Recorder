
    // Download video
    downloadBtn.addEventListener('click', () => {
      const blob = new Blob(recordedChunks, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Screen-Recording-${Date.now()}.webm`;
      a.click();
      URL.revokeObjectURL(url);
    });

    // Preview video
    previewBtn.addEventListener('click', () => {
      const blob = new Blob(recordedChunks, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      playback.src = url;
      playback.classList.add('active');
      preview.style.display = 'none';
      previewBtn.textContent = 'Hide Preview';
      
      if (previewBtn.textContent === 'Hide Preview') {
        previewBtn.addEventListener('click', () => {
          playback.classList.remove('active');
          preview.style.display = 'block';
          previewBtn.textContent = 'Show Preview';
        }, { once: true });
      }
    });

    uploadBtn.addEventListener('click', () => {
      const blob = new Blob(recordedChunks, { type: 'video/webm' });
      uploadToCloudinary(blob);
    })

    function uploadToCloudinary(videoBlob) {
      const CLOUD_NAME = CLOUDINARY_CONFIG.CLOUD_NAME;
      const UPLOAD_PRESET = CLOUDINARY_CONFIG.UPLOAD_PRESET;
      const formData = new FormData();
      formData.append('file', videoBlob, `Screen-Recording-${Date.now()}.webm`);
      formData.append('upload_preset', UPLOAD_PRESET);

    

    // Status update karein
  infoStatus.textContent = 'Uploading...';
  uploadBtn.disabled = true;
  uploadBtn.textContent = 'Uploading...';

  const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/video/upload`;

  fetch(url, {
    method: 'POST',
    body: formData
  })
  .then(response => response.json())
  .then(data => {
    if (data.secure_url) {
      console.log('Upload successful:', data.secure_url);
      infoStatus.textContent = 'Uploaded!';
      uploadBtn.textContent = 'Uploaded!';
      // Aap yahan user ko uploaded URL dikha sakte hain
      alert('Video successfully uploaded! URL: ' + data.secure_url);
    } else {
      throw new Error('Upload failed. Response: ' + JSON.stringify(data));
    }
  })
  .catch(error => {
    console.error('Error uploading to Cloudinary:', error);
    infoStatus.textContent = 'Upload Failed';
    uploadBtn.textContent = 'Upload to Cloud';
    uploadBtn.disabled = false;
    alert('Sorry, there was an error uploading the video.');
  });

}

    // New recording
    newRecordingBtn.addEventListener('click', () => {
      recordedChunks = [];
      seconds = 0;
      timer.textContent = '00:00';
      downloadBtn.disabled = true;
      stopBtn.disabled = false;
      previewBtn.classList.remove('active');
      playback.classList.remove('active');
      playback.src = '';
      preview.style.display = 'block';
      recordingScreen.style.display = 'none'
      welcomeScreen.style.display = 'block'
      infoStatus.textContent = 'Ready';
      uploadBtn.textContent = '⬆ Upload to Cloud';


     qualitySetupContainer.classList.remove('active');
  audioSetupContainer.classList.remove('active');
  recordingTypeContainer.classList.add('active');

  recordingOptions.forEach(opt => opt.classList.remove('selected'));
  audioOptions.forEach(opt => opt.classList.remove('selected'));
    });


 