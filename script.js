let mediaRecorder;
    let recordedChunks = [];
    let stream;
    let timeInterval, seconds = 0;

    const startBtn = document.getElementById("startbtn");
    const stopBtn = document.getElementById("stoptbtn");
    const downloadBtn = document.getElementById("downloadebtn");
    const preview = document.getElementById("preview");
    const timer = document.getElementById("timer");

    stopBtn.disabled = true;
    downloadBtn.disabled = true;

    startBtn.onclick = async () => {
        const quality = document.getElementById("quality").value;
        let videoConstraint;

        if (quality === "sd") {
            videoConstraint = { width: 640, height: 360 };
        } else if (quality === "hd") {
            videoConstraint = { width: 1280, height: 720 };
        } else if (quality === "4k") {
            videoConstraint = { width: 3840, height: 2160 };
        }

        try {
            stream = await navigator.mediaDevices.getDisplayMedia({
                video: videoConstraint,
                audio: true
            });

            preview.srcObject = stream;

            mediaRecorder = new MediaRecorder(stream);
            recordedChunks = [];

            mediaRecorder.ondataavailable = event => {
                if (event.data.size > 0) recordedChunks.push(event.data);
            };

            mediaRecorder.onstop = () => {
                stopTimer();
                downloadBtn.disabled = false;
            };

            mediaRecorder.start();
            startTimer();

            startBtn.disabled = true;
            stopBtn.disabled = false;
        } catch (error) {
            alert("Unable to Start Screen Recording: " + error.message);
        }
    };

    stopBtn.onclick = () => {
        if (mediaRecorder && mediaRecorder.state !== "inactive") {
            mediaRecorder.stop();
        }
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }
        stopBtn.disabled = true;
        startBtn.disabled = false;
    };

    downloadBtn.onclick = () => {
        const blob = new Blob(recordedChunks, { type: "video/webm" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "Screen-Recording-Liveweb.webm";
        a.click();
        URL.revokeObjectURL(url);
        downloadBtn.disabled = true;
    };

    function startTimer() {
        seconds = 0;
        timer.textContent = "00:00";
        timeInterval = setInterval(() => {
            seconds++;
            const min = String(Math.floor(seconds / 60)).padStart(2, "0");
            const sec = String(seconds % 60).padStart(2, "0");
            timer.textContent = `${min}:${sec}`;
        }, 1000);
    }

    function stopTimer() {
        clearInterval(timeInterval);
    }