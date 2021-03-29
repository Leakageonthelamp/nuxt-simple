<template>
  <div class="card card-vocab">
    <div class="row no-gutters">
      <div class="col-sm-5 img-area">
        <div class="header-voice-sm">
          <div
            v-if="!isRecording"
            class="speech-result mr-3"
            :style="`color: ${text.color}`"
          >
            <strong v-show="!isRecording">
              {{ speechResult }} <i :class="`${text.icon}`"></i>
            </strong>
          </div>
          <div v-if="isRecording" class="speech-activate mr-5">
            <vue-element-loading
              spinner="bar-fade-scale"
              :active="isRecording"
              background-color="none"
              color="#f46500"
            />
          </div>
          <div class="card-voice">
            <button class="btn mr-3" :disabled="isRecording" @click="record">
              <i class="fas fa-microphone fa-2x"></i>
            </button>
            <button class="btn" @click="speechVocab">
              <i class="fas fa-volume-up audio-icon fa-2x"></i>
            </button>
          </div>
        </div>
        <div class="img-box"><img :src="vocab.image" class="card-img" /></div>
      </div>
      <div class="col-sm-7 vocab-area">
        <div class="header-voice">
          <div
            v-if="!isRecording"
            class="speech-result mr-3"
            :style="`color: ${text.color}`"
          >
            <strong v-show="!isRecording">
              {{ speechResult }} <i :class="`${text.icon}`"></i>
            </strong>
          </div>
          <div v-if="isRecording" class="speech-activate mr-5">
            <vue-element-loading
              spinner="bar-fade-scale"
              :active="isRecording"
              background-color="none"
              color="#f46500"
            />
          </div>
          <div class="card-voice">
            <button class="btn mr-3" :disabled="isRecording" @click="record">
              <i class="fas fa-microphone fa-2x"></i>
            </button>
            <button class="btn" @click="speechVocab">
              <i class="fas fa-volume-up audio-icon fa-2x"></i>
            </button>
          </div>
        </div>
        <div class="body-vocab">
          <h1 class="vocab">{{ vocab.word }}</h1>
          <h5 class="part-of-speech">
            ({{ vocab.partOfSpeech }})
            {{ vocab.definition }}
          </h5>
        </div>
      </div>
    </div>
    <div v-if="current !== vocabLength - 1" class="review-btn-next">
      <button class="btn btn-next" @click="$emit('nextClick')">
        <i class="fas fa-arrow-right fa-2x"></i>
      </button>
    </div>
    <div
      v-if="current !== 0"
      class="review-btn-previous"
      @click="$emit('prevClick')"
    >
      <button class="btn btn-next">
        <i class="fas fa-arrow-left fa-2x"></i>
      </button>
    </div>
  </div>
</template>

<script>
import speech from "speech-js";
// import { speechToText } from "../../logic/speech";
export default {
  props: {
    vocab: {
      type: Object,
      required: true
    },
    vocabLength: {
      type: Number,
      required: true
    },
    current: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      showDefinition: false,
      speechResult: null,
      isRecording: false,
      text: {
        color: "black",
        icon: "fas"
      }
    };
  },
  methods: {
    toggleDefinition() {
      this.showDefinition = !this.showDefinition;
      if (this.showDefinition) {
        this.speechVocab();
      }
    },
    record() {
      console.log("record", this.vocab);
      this.speechToText(this.vocab.word);
    },
    speechVocab() {
      console.log("speechVocab", this.vocab);
      const res = this.vocab.word;
      speech.synthesis(res, "en-US", 1, 0.5, 1);
    },
    speechToText(text) {
      const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition ||
        window.mozSpeechRecognition ||
        window.msSpeechRecognitio;

      const SpeechGrammarList =
        window.SpeechGrammarList || window.webkitSpeechGrammarList;
      var grammar =
        "#JSGF V1.0; grammar phrase; public <phrase> = " + text + ";";
      const recognition = new SpeechRecognition();

      const speechRecognitionList = new SpeechGrammarList();
      speechRecognitionList.addFromString(grammar, 1);
      recognition.grammars = speechRecognitionList;
      recognition.lang = "en-US";
      recognition.interimResults = false;
      recognition.maxAlternatives = 5;
      // return recognition;
      recognition.start();
      this.isRecording = true;
      recognition.onresult = event => {
        // The SpeechRecognitionEvent results property returns a SpeechRecognitionResultList object
        // The SpeechRecognitionResultList object contains SpeechRecognitionResult objects.
        // It has a getter so it can be accessed like an array
        // The first [0] returns the SpeechRecognitionResult at position 0.
        // Each SpeechRecognitionResult object contains SpeechRecognitionAlternative objects that contain individual results.
        // These also have getters so they can be accessed like arrays.
        // The second [0] returns the SpeechRecognitionAlternative at position 0.
        // We then return the transcript property of the SpeechRecognitionAlternative object
        this.speechResult = event.results[0][0].transcript.toLowerCase();
        speech.synthesis(this.speechResult, "en-US", 1, 0.5, 1);
        console.log("Speech received: " + this.speechResult + ".");
        if (this.speechResult === text.toLowerCase()) {
          this.text.color = "#7ED321";
          this.text.icon = "fas fa-check-circle";
          console.log("SUCCESS: I heard the correct phrase!");
        } else {
          this.text.color = "#F35156";
          this.text.icon = "fas fa-times-circle";
          console.log("FAIL: That didn't sound right.");
        }

        console.log("Confidence: " + event.results[0][0].confidence);
      };

      recognition.onspeechend = function() {
        return "end";
      };

      recognition.onerror = event => {
        this.text.color = "#F35156";
        this.text.icon = "fas fa-times-circle";
        this.speechResult = event.error;
        console.log("Error occurred in recognition: " + event.error);
        // testBtn.disabled = false;
        // testBtn.textContent = "Start new test";
        // diagnosticPara.textContent =
        //   "Error occurred in recognition: " + event.error;
      };

      recognition.onaudiostart = event => {
        //Fired when the user agent has started to capture audio.
        console.log("SpeechRecognition.onaudiostart", event);
      };

      recognition.onaudioend = event => {
        //Fired when the user agent has finished capturing audio.
        console.log("SpeechRecognition.onaudioend", event);
      };

      recognition.onend = event => {
        recognition.stop();
        this.isRecording = false;
        //Fired when the speech recognition service has disconnected.
        console.log("SpeechRecognition.onend", event);
      };

      recognition.onnomatch = event => {
        //Fired when the speech recognition service returns a final result with no significant recognition. This may involve some degree of recognition, which doesn't meet or exceed the confidence threshold.
        console.log("SpeechRecognition.onnomatch", event);
      };

      recognition.onsoundstart = event => {
        //Fired when any sound — recognisable speech or not — has been detected.
        console.log("SpeechRecognition.onsoundstart", event);
      };

      recognition.onsoundend = event => {
        //Fired when any sound — recognisable speech or not — has stopped being detected.
        console.log("SpeechRecognition.onsoundend", event);
      };

      recognition.onspeechstart = event => {
        //Fired when sound that is recognised by the speech recognition service as speech has been detected.
        console.log("SpeechRecognition.onspeechstart", event);
      };
      recognition.onstart = event => {
        //Fired when the speech recognition service has begun listening to incoming audio with intent to recognize grammars associated with the current SpeechRecognition.
        console.log("SpeechRecognition.onstart", event);
      };
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~@/assets/scss/styles/variables";
@import "~@/assets/scss/styles/mixins";
.card-vocab {
  width: 100%;
  max-height: 360px;
  border-radius: 1.25rem;
  //   border: 8px solid #f46500;
  box-shadow: 0 4px 5px rgba(0, 0, 0, 0.3);
  justify-content: center;
  @include media-breakpoint-down(xs) {
    max-height: 600px;
  }

  .img-area {
    .header-voice-sm {
      display: flex;
      justify-content: flex-end;
      .card-voice {
        display: flex;
        margin-right: -2px;
        padding: 8px 24px;
        border-radius: 0 1.25rem;
        background: #f46500;
        box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.1);
        button {
          transition: 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          width: 52px;
          height: 52px;
          color: white;
          background: #ffb820;
          border: 3px solid #ffffff;
          box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.1);
          &:hover {
            transition: 0.2s;
            color: #f46500;
            box-shadow: inset 0 0 4px #4f4f4f;
          }
        }
      }
      .speech-result {
        align-items: center;
        display: flex;
        font-size: 18px;
      }
      @include media-breakpoint-up(sm) {
        display: none;
      }
    }

    .img-box {
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 1.5rem 0 1.5rem 3.5rem;
      width: 100%;
      height: 340px;
      img {
        max-width: 100%;
        max-height: 100%;
      }
      @include media-breakpoint-down(xs) {
        padding: 1.5rem;
      }
    }
  }

  .vocab-area {
    .header-voice {
      display: flex;
      justify-content: flex-end;
      .card-voice {
        display: flex;
        margin-right: -2px;
        padding: 8px 24px;
        border-radius: 0 1.25rem;
        background: #f46500;
        box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.1);
        button {
          transition: 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          width: 52px;
          height: 52px;
          color: white;
          background: #ffb820;
          border: 3px solid #ffffff;
          box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.1);
          &:hover {
            transition: 0.2s;
            color: #f46500;
            box-shadow: inset 0 0 4px #4f4f4f;
          }
        }
      }
      .speech-result {
        align-items: center;
        display: flex;
        font-size: 18px;
      }
      @include media-breakpoint-down(xs) {
        display: none;
      }
    }
    .body-vocab {
      display: flex;
      flex-direction: column;
      //   justify-content: center;
      align-items: center;
      padding: 3rem 3rem 1.5rem 0;
      width: 100%;
      height: 240px;
      .vocab {
        font-size: 36px;
      }
      .part-of-speech {
        font-size: 24px;
      }
      @include media-breakpoint-down(xs) {
        padding: 0 1.5rem 1.5rem 1.5rem;
        height: auto;
      }
    }
  }

  .review-btn-next {
    position: absolute;
    right: -5%;
    .btn-next {
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      width: 72px;
      height: 72px;
      color: white;
      transition: 0.5s;
      background: #ffb820;
      border: 3px solid #ffffff;
      box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.1);
      &:hover {
        transform: scale(1.2);
        transition: 0.5s;
        color: #f46500;
        box-shadow: inset 0 0 4px #4f4f4f;
      }
    }
  }
  .review-btn-previous {
    position: absolute;
    left: -5%;
    .btn-next {
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      width: 72px;
      height: 72px;
      color: white;
      background: #ffb820;
      border: 3px solid #ffffff;
      box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.1);
      &:hover {
        transform: scale(1.2);
        transition: 0.5s;
        color: #f46500;
        box-shadow: inset 0 0 4px #4f4f4f;
      }
    }
  }
}
</style>
