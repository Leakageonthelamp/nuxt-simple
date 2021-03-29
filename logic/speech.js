const synth = window.speechSynthesis;
const SpeechRecognition =
  window.SpeechRecognition ||
  window.webkitSpeechRecognition ||
  window.mozSpeechRecognition ||
  window.msSpeechRecognitio;

const SpeechGrammarList =
  window.SpeechGrammarList || window.webkitSpeechGrammarList;

export const textToSpeech = text => {
  const utterThis = new SpeechSynthesisUtterance(text);
  synth.speak(utterThis);
};

export const speechToText = text => {
  var grammar = "#JSGF V1.0; grammar phrase; public <phrase> = " + text + ";";
  const recognition = new SpeechRecognition();
  // speech;

  const speechRecognitionList = new SpeechGrammarList();
  speechRecognitionList.addFromString(grammar, 1);
  recognition.grammars = speechRecognitionList;
  recognition.lang = "en-US";
  recognition.interimResults = false;
  recognition.maxAlternatives = 5;
  // return recognition;
  recognition.start();
  recognition.onresult = function(event) {
    // The SpeechRecognitionEvent results property returns a SpeechRecognitionResultList object
    // The SpeechRecognitionResultList object contains SpeechRecognitionResult objects.
    // It has a getter so it can be accessed like an array
    // The first [0] returns the SpeechRecognitionResult at position 0.
    // Each SpeechRecognitionResult object contains SpeechRecognitionAlternative objects that contain individual results.
    // These also have getters so they can be accessed like arrays.
    // The second [0] returns the SpeechRecognitionAlternative at position 0.
    // We then return the transcript property of the SpeechRecognitionAlternative object
    var speechResult = event.results[0][0].transcript.toLowerCase();
    console.log("Speech received: " + speechResult + ".");
    if (speechResult === text) {
      console.log("SUCCESS: I heard the correct phrase!");
    } else {
      console.log("FAIL: That didn't sound right.");
    }

    console.log("Confidence: " + event.results[0][0].confidence);
  };

  recognition.onspeechend = function() {
    return "end";
  };

  recognition.onerror = function(event) {
    console.log("Error occurred in recognition: " + event.error);
    // testBtn.disabled = false;
    // testBtn.textContent = "Start new test";
    // diagnosticPara.textContent =
    //   "Error occurred in recognition: " + event.error;
  };

  recognition.onaudiostart = function(event) {
    //Fired when the user agent has started to capture audio.
    console.log("SpeechRecognition.onaudiostart", event);
  };

  recognition.onaudioend = function(event) {
    //Fired when the user agent has finished capturing audio.
    console.log("SpeechRecognition.onaudioend", event);
  };

  recognition.onend = function(event) {
    //Fired when the speech recognition service has disconnected.
    console.log("SpeechRecognition.onend", event);
  };

  recognition.onnomatch = function(event) {
    //Fired when the speech recognition service returns a final result with no significant recognition. This may involve some degree of recognition, which doesn't meet or exceed the confidence threshold.
    console.log("SpeechRecognition.onnomatch", event);
  };

  recognition.onsoundstart = function(event) {
    //Fired when any sound — recognisable speech or not — has been detected.
    console.log("SpeechRecognition.onsoundstart", event);
  };

  recognition.onsoundend = function(event) {
    //Fired when any sound — recognisable speech or not — has stopped being detected.
    console.log("SpeechRecognition.onsoundend", event);
  };

  recognition.onspeechstart = function(event) {
    //Fired when sound that is recognised by the speech recognition service as speech has been detected.
    console.log("SpeechRecognition.onspeechstart", event);
  };
  recognition.onstart = function(event) {
    //Fired when the speech recognition service has begun listening to incoming audio with intent to recognize grammars associated with the current SpeechRecognition.
    console.log("SpeechRecognition.onstart", event);
  };
};
