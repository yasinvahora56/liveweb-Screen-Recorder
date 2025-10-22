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