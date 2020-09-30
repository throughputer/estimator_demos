// Copyright © ThroughPuter, Inc. Patents issued and pending. All rights reserved.

// A Rock-Paper-Scissors demo game.

class RPS extends Vue {
  constructor(arg) {
    super(arg);

    // To utilize your access to a ThroughPuter Estimator microservice, provide your secret key here, HOWEVER...
    // IMPORTANT!!! It is your responsibility to keep your secret key secret. This code is visible in a user's web browser,
    //              and this demo is not intended to be hosted publicly with your private key.
    this.estimator_ws = `wss://estimatorlab.com/ws/<your-key-here-for private hosting>`;

    let rps = this;

    // The depth of the human play history used to make predictions (# X variables for predictor).
    this.HISTORY_DEPTH = 4;
    // History of plays made by AI, for all of time. (Human history is this.prediction.history.)
    // [0] is the first play, and so on.
    // Note that the next AI play is determined immediately once the human makes a play, so the AI is
    // generally ahead by one play.
    this.ai_history = [];
    // Running totals.
    this.wins = {
      human: 0,
      ai: 0,
      tie: 0
    }
    this.winner_message = {
      human: "You WIN!!!",
      ai: "You Lose",
      tie: "Tie"
    }


    // ****************************
    // DEBUG
    //
    // Automated human plays for debug.
    this.auto_play = [
      /*
      0,0,0,0,0,0,0,0,0,0,
      1,1,1,1,1,1,1,1,1,1,
      2,2,2,2,2,2,2,2,2,2
      */
    ];

    let wsReady = function () {
      // Websocket is ready. Start doing stuff.

      rps.makePrediction();


      // JQuery bindings.

      $("#reveal").change(function() {
        if (this.checked) {
          $("#AI-player").addClass("reveal");
        } else {
          $("#AI-player").removeClass("reveal");
        }
      });

      $("#human-player .hand-container").click(
        function(evt) {
          if (rps.ready) {
            $("#human-player .hand-container").removeClass("selected");
            $(".hand-selected-img", this).parent().addClass("selected");

            rps.determineWinner(parseInt(this.getAttribute("data-hand-index")));
            rps.makePrediction();
          }
        }
      )
    }

    let predictionCB = (preds, info) => {
      rps.predictionCB(preds, info);
    }

    this.prediction = new Premonition(4, true, this.estimator_ws, predictionCB, wsReady);

    //wsReady();
  }

  // Return a random hand index.
  randomHandIndex() {
    return Math.floor(Math.random() * 3);
  }

  // Determine winning play against opponent's play.
  winningIndex(index) {
    return (index + 1) % 3;
  }
  // Return human", "ai", or "tie" for a contest.
  winner(human_index, ai_index) {
    return (human_index == ai_index)                    ? "tie" :
           (human_index == this.winningIndex(ai_index)) ? "human" :
                                                          "ai";
  }

  // The human has played. Conduct the contest.
  determineWinner(human_index) {
    // Update state.
    this.prediction.pushValue(human_index);
    let ai_index = this.ai_history[this.ai_history.length - 1];
    let winner = this.winner(human_index, ai_index);
    this.wins[winner]++;
    // Reflect AI play in DOM.
    $(`#${winner}-score`).text(this.wins[winner].toString());
    $("#AI-player .hand-container").removeClass("selected");
    $(`#AI-player .hand-container[data-hand-index=${ai_index}]`).addClass("selected");
    $("#winner-message").text(this.winner_message[winner]);
    console.log(`Contest: Human: ${human_index}; AI: ${ai_index}. ${this.winner_message[winner]}`);
  }

  predictionCB(preds, info) {
    let pred_index = preds[0].est;
    // Determine AI play to win against the prediction.
    var ai_play_index = this.winningIndex(pred_index);
    this.ai_history.push(ai_play_index);
    // Ready to play, but introduce a minimum delay while the DOM conveys the result of the previous battle.
    $('.probabilities').text('');  // Clear old predictions in DOM.
    window.setTimeout(() => {
      // Reflect selection in DOM.
      $(`#AI-player .hand-container[data-hand-index=${ai_play_index}]`).addClass("chosen");
      preds.forEach((pred, index) => {
        $(`.probability[index=${this.winningIndex(pred.est)}]`).text(`${(pred.num / pred.denom).toFixed(2)}`);
      });
      console.log(`Prediction: ${JSON.stringify(preds)}`);
      if (this.auto_play.length > 0) {
        // Make a "human" play automatically (without enabling GUI play).
        this.determineWinner(this.auto_play.shift());
        this.makePrediction();
      } else {
        // Ready for the next interactive prediction.
        this.ready = true;
      }
    }, 300);
  }

  // Make the given prediction.
  _manufacturedPrediction(index) {
      return [{est: index,           num: 1, denom: 3},
              {est: (index + 1) % 3, num: 1, denom: 3},
              {est: (index + 2) % 3, num: 1, denom: 3}];
  }

  // Predict the human's next play, and, based on that, the AI's next play.
  // Also reflect this in the state and in the DOM.
  makePrediction() {
    // Reflect no-prediction.
    this.ready = false;
    $("#AI-player .hand-container").removeClass("chosen");
    // Predict human play.
    if (! this.prediction.predict()) {
      this.predictionCB(this._manufacturedPrediction(this.randomHandIndex()), null);
    }
  }

}



$( document ).ready(function() {
  var rps_app = new RPS({
    el: '#body',
    data: {
      players: [
        { name: "human" },
        { name: "AI" }
      ],
      hands: [
        { index: 0,
          name: "rock"
        },
        { index: 1,
          name: "paper"
        },
        { index: 2,
          name: "scissors"
        }
      ],
      ready: false
    }
  })
})
