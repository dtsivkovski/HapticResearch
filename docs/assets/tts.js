// check if speech synthesis is enabled in localstorage
var ttsEnabled = localStorage.getItem('ttsEnabled');
if (ttsEnabled === null) {
    localStorage.setItem('ttsEnabled', 'true');
    ttsEnabled = true;
} else {
    ttsEnabled = (ttsEnabled === 'true');
}

// create speech synthesis object
var synth = window.speechSynthesis;
if (synth === undefined) {
    console.error('Speech synthesis not supported');
}

// function to toggle tts (checking for existence of tts button toggler)
if (document.getElementById('tts-toggler')) {
    document.getElementById('tts-toggler').addEventListener('click', function() {
        ttsEnabled = !ttsEnabled;
        localStorage.setItem('ttsEnabled', ttsEnabled);
        if (ttsEnabled) {
            document.getElementById('tts-toggler').innerHTML = '<i class="fa-solid fa-volume-high"></i>';
            document.getElementById('tts-toggler').title = 'Text to Speech is enabled';
            speak("Text to speech is enabled. Press 'H' for help.");
        } else {
            document.getElementById('tts-toggler').innerHTML = '<i class="fa-solid fa-volume-xmark"></i>';
            document.getElementById('tts-toggler').title = 'Text to Speech is disabled';
        }
    });

    // set initial state of tts button
    if (ttsEnabled) {
        document.getElementById('tts-toggler').innerHTML = '<i class="fa-solid fa-volume-high"></i>';
        document.getElementById('tts-toggler').title = 'Text to Speech is enabled';
    } else {
        document.getElementById('tts-toggler').innerHTML = '<i class="fa-solid fa-volume-xmark"></i>';
        document.getElementById('tts-toggler').title = 'Text to Speech is disabled';
    }
}
// function to speak given string
function speak(text) {
    if (!ttsEnabled) {
        return;
    }
    // if (synth.speaking) {
    //   console.error("speechSynthesis.speaking");
    //   return;
    // }
    if (text !== '') {
    var utterThis = new SpeechSynthesisUtterance(text);
    utterThis.onend = function (event) {
        console.log('SpeechSynthesisUtterance.onend');
    }
    utterThis.onerror = function (event) {
        console.error('SpeechSynthesisUtterance.onerror');
    }
    utterThis.lang = 'en-US';
    utterThis.pitch = 1;
    utterThis.rate = 1.5;
    synth.speak(utterThis);
    }
}