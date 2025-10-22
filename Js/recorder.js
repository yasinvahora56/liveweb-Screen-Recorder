// Start recording flow
    beginRecordingBtn.addEventListener('click', async () => {
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

      try {
        stream = await navigator.mediaDevices.getDisplayMedia({
          video: videoConstraint,
          audio: true
        });

        preview.srcObject = stream;
        welcomeScreen.style.display = 'none';
        recordingScreen.style.display = 'grid';

        mediaRecorder = new MediaRecorder(stream);
        recordedChunks = [];

        mediaRecorder.ondataavailable = event => {
          if (event.data.size > 0) recordedChunks.push(event.data);
        };

        mediaRecorder.onstop = () => {
          stopTimer();
          stopBtn.disabled= true;
          downloadBtn.disabled = false;
          uploadBtn.disabled = false;
          infoStatus.textContent = 'Stopped';
          statusCard.classList.remove('recording');
          recordingDot.style.display = 'none';
        };

        mediaRecorder.start();
        startTimer();
        statusCard.classList.add('recording');
      } catch (error) {
        alert("Unable to start screen recording: " + error.message);
      }
    });
    // Stop recording
    stopBtn.addEventListener('click', () => {
      if (mediaRecorder && mediaRecorder.state !== 'inactive') {
        mediaRecorder.stop();
      }
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      preview.srcObject = null;
      stopBtn.disabled = true;
      previewBtn.classList.add('active');
    });