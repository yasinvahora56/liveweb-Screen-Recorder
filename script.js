 let mediaRecorder;
    let recordedChunks = [];
    let stream;
    let timeInterval;
    let seconds = 0;
    let selectedQuality = 'hd';

    // Elements
    const welcomeScreen = document.getElementById('welcomeScreen');
    const recordingScreen = document.getElementById('recordingScreen');
    const qualityOptions = document.querySelectorAll('.quality-option');
    const beginRecordingBtn = document.getElementById('beginRecording');
    const stopBtn = document.getElementById('stopBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const newRecordingBtn = document.getElementById('newRecordingBtn');
    const preview = document.getElementById('preview');
    const playback = document.getElementById('playback');
    const previewBtn = document.getElementById('previewBtn');
    const timer = document.getElementById('timer');
    const statusCard = document.getElementById('statusCard');
    const recordingDot = document.getElementById('recordingDot');
    const infoQuality = document.getElementById('infoQuality');
    const infoStatus = document.getElementById('infoStatus');

    // Quality selection
    qualityOptions.forEach(option => {
      option.addEventListener('click', () => {
        qualityOptions.forEach(opt => opt.classList.remove('selected'));
        option.classList.add('selected');
        selectedQuality = option.dataset.quality;
      });
    });

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
          downloadBtn.disabled = false;
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
      recordingScreen.classList.remove('active');
      welcomeScreen.classList.add('active');
      infoStatus.textContent = 'Ready';
    });

    // Timer functions
    function startTimer() {
      seconds = 0;
      timer.innerHTML = '00:00<span class="recording-indicator"></span>';
      timeInterval = setInterval(() => {
        seconds++;
        const min = String(Math.floor(seconds / 60)).padStart(2, '0');
        const sec = String(seconds % 60).padStart(2, '0');
        timer.innerHTML = `${min}:${sec}<span class="recording-indicator"></span>`;
      }, 1000);
    }

    function stopTimer() {
      clearInterval(timeInterval);
    }