<template>
  <div class="card-vocab" :class="{ 'kids-card': isKids }">
    <div class="header pr-1">
      <div v-if="isKids" class="d-flex align-items-center">
        <h1 class="word m-0 mr-3">{{ vocab.word }}</h1>
      </div>
      <div class="action-speech">
        <button class="btn btn-circle" :disabled="isRecording" @click="record">
          <i
            class="fas fa-microphone"
            :class="isRecording ? 'micro-icon-recording' : 'micro-icon'"
          ></i>
        </button>
        <button class="btn btn-circle" @click="speechVocab">
          <i class="fas fa-volume-up audio-icon"></i>
        </button>
      </div>
    </div>
    <div
      v-tooltip="
        showDefinition
          ? 'click vocab to hide definition'
          : 'click vocab to show definition'
      "
      class="body _pointer-on-hover"
      :class="{ 'have-image': vocab.image }"
      @click="toggleDefinition"
    >
      <template v-if="!isKids">
        <h1 class="word">{{ vocab.word }}</h1>
        <p class="text-pos text-center">({{ vocab.partOfSpeech }})</p>
      </template>

      <div v-if="vocab.image" class="image-box">
        <img class="image-vocab" :src="vocab.image" alt="" />
      </div>
      <transition name="fade">
        <div
          v-if="showDefinition"
          class="text-definition"
          :class="isKids ? 'kids' : ''"
        >
          <p class="font-weight-bold definition">
            <span style="color: #ffb820;">({{ vocab.partOfSpeech }})</span>
            {{ vocab.definition }}
          </p>
        </div>
      </transition>
      <div class="text-record mt-3" :style="`color: ${text.color}`">
        <vue-element-loading
          spinner="bar-fade-scale"
          :active="isRecording"
          background-color="none"
          color="#f46500"
        />
        <strong v-show="!isRecording">
          {{ speechResult }} <i :class="`${text.icon}`"></i>
        </strong>
      </div>
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
    isKids: {
      type: Boolean,
      default: false
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
  text-align: center;
  border-radius: 1.25rem;
  box-shadow: 0 4px 5px rgba(0, 0, 0, 0.3);

  .header {
    position: relative;
    border-radius: 1.25rem 1.25rem 0 0;
    width: 100%;
    background-color: #f46500cf;
    display: flex;
    justify-content: flex-start;
    padding: 0.5rem 1.5rem;
    align-items: center;
    .action-speech {
      position: absolute;
      display: flex;
      justify-content: flex-end;
      right: 0;
    }
    @include media-breakpoint-up(sm) {
      justify-content: center;
    }
  }
  .body {
    position: relative;
    padding: 70px 10px 10px;
    display: flex;
    flex-direction: column;
    align-content: center;
    border-radius: 0 0 1.25rem 1.25rem;
    @include themed {
      background: tget("card-background");
    }

    .image-box {
      width: 100%;
      height: 200px;
      padding: 1rem;
      img {
        max-width: 100%;
        max-height: 100%;
      }
    }
    &.have-image {
      padding-top: 10px;
    }
    .text-definition {
      &.kids {
        position: absolute;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
        padding-right: 20px;
        .definition {
          min-width: 120px;
          border-radius: 12px;
          background: white;
          padding: 1rem;
          background: white;
          border: 4px solid #fba600;
          box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.1);
          color: #fba600;
        }
      }
    }
  }
  &.kids-card {
    font-size: 10px;
    max-height: 440px;
    .header {
      color: #ffb820;
      text-shadow: 2px 2px 8px $red;
      h1 {
        @include font-size(2.2rem);
      }
      p {
        @include font-size(1.6rem);
      }
    }
    .body {
      height: 50vh;
      max-height: 300px;
      .image-box {
        height: 40vh;
        max-height: 280px;
      }
      p {
        @include font-size(1.6rem);
      }
    }
  }
}
.text-record {
  height: 21px;
}
.btn-circle {
  // background: $orange;
  color: $orange;
  width: 38px;
  height: 38px;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 4px;
  background: none !important;
  box-shadow: none;
}
.micro-icon,
.audio-icon {
  font-size: 24px;
  /* padding: 10px; */
  color: #ffb820;
}

.micro-icon-recording {
  font-size: 24px;
  /* padding: 10px; */
  color: rgb(255, 219, 140);
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: #ffb820;
  color: $orange;
  // border-style: solid;
  // border-width: 3px;
  display: flex;
  justify-content: center;
  align-items: center;
  animation-name: pulse;
  animation-duration: 1.5s;
  animation-iteration-count: infinite;
  animation-timing-function: linear;
}
@keyframes pulse {
  0% {
    box-shadow: 0px 0px 3px 0px rgba(173, 0, 0, 0.3);
  }
  65% {
    box-shadow: 0px 0px 3px 5px rgba(173, 0, 0, 0.3);
  }
  90% {
    box-shadow: 0px 0px 3px 5px rgba(173, 0, 0, 0);
  }
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
