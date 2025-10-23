    // Recording type selection

    recordingOptions.forEach(option => {

      option.addEventListener('click', () => {
        
        recordingOptions.forEach(opt => opt.classList.remove('selected'));

        option.classList.add('selected')

        selectedRecordingType = option.dataset.type

        // slide logic

        recordingTypeContainer.classList.remove('active')
        audioSetupContainer.classList.add('active');

        // if(selectedRecordingType === 'video'){
        //   beginRecordingBtn.textContent = 'Start Web Recording'
        // }else{
        //   beginRecordingBtn.textContent = 'Start Screen Recording'
        // }
      })
    });

    audioOptions.forEach(option => {
      option.addEventListener('click', () =>{
        audioOptions.forEach(opt => opt.classList.remove('selected'));
        option.classList.add('selected')
        selectedAudioSource = option.dataset.audio

        // Slide Logic
        audioSetupContainer.classList.remove('active')
        qualitySetupContainer.classList.add('active')

        if(selectedAudioSource === 'system' || selectedAudioSource === 'mic-system'){
          console.warn('System audio recording is complex and might not be supported on all browsers/OS.')
        }

      })
      
    });

    // Back Button
    backToTypeBtn.addEventListener('click', () => {
      audioSetupContainer.classList.remove('active')
      recordingTypeContainer.classList.remove('remove')
    })

    // Back Button
    backToAudioBtn.addEventListener('click', () => {
      qualitySetupContainer.classList.remove('active')
      audioSetupContainer.classList.add('active')
    })

    // Quality selection
    qualityOptions.forEach(option => {
      option.addEventListener('click', () => {
        qualityOptions.forEach(opt => opt.classList.remove('selected'));
        option.classList.add('selected');
        selectedQuality = option.dataset.quality;
      });
    });