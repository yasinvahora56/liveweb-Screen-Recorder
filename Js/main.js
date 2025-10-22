 let mediaRecorder;
    let recordedChunks = [];
    let stream;
    let timeInterval;
    let seconds = 0;
    let selectedRecordingType = 'screen';
    let selectedQuality = 'hd';
    let selectedAudioSource = 'silent';

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
    const uploadBtn = document.getElementById('uploadBtn');
    const recordingTypeContainer = document.getElementById('recordingTypeContainer');
    const qualitySetupContainer = document.getElementById('qualitySetupContainer');
    const recordingOptions = document.querySelectorAll('.recording-option');
    // script.js (Elements section)
    const audioSetupContainer = document.getElementById('audioSetupContainer');
    const audioOptions = document.querySelectorAll('.audio-option');
    const backToTypeBtn = document.getElementById('backToTypeBtn');
    const backToAudioBtn = document.getElementById('backToAudioBtn');
