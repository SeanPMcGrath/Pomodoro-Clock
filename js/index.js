//Initialize Variables

let defaultBreakLength = 5;
let defaultSessionLength = 25;
let breakLength = defaultBreakLength;
let sessionLength = defaultSessionLength;
let onBreak = false;
let running = false;
let timerVar = "";
let timeRemaining = sessionLength * 60;
let defaultTimerLabel = "Time Remaining";
let defaultPhaseLabel = "Currently: Ready to start session";
let sessionPhase = "Currently: In Session";
let breakPhase = "Currently: On Break";
let beepFile = $("#beep").get(0);

//Initialize display of interval lengths. Define and call function.
function initialSetting() {
  $("#break-length").html(breakLength);
  $("#session-length").html(sessionLength);
  minSecDisplay(timeRemaining);
  $("#timer-label").html(defaultTimerLabel);
  $("#currentPhase").html(defaultPhaseLabel);
}
initialSetting();

//function for counting down time
function countdown(startLength) {
  //Set current phase statement
  if (onBreak) {
    $("#currentPhase").html(breakPhase);
  } else {
    $("#currentPhase").html(sessionPhase);
  }
  timeRemaining = startLength;
  running = true;
  let d = new Date();
  let timeReference = d.getSeconds();

  //function compares previously gotten seconds from browser clock to current seconds on browser clock. If the browser clock has progressed, count down by one second.
  timerVar = setInterval(() => {
    d = new Date();
    if (d.getSeconds() !== timeReference) {
      timeReference = d.getSeconds();
      timeRemaining -= 1;
      minSecDisplay(timeRemaining);
    }
    //trigger alert font at less than one minute
    if (timeRemaining === 59) {
      $("#time-left").toggleClass("alertColor", true);
    }
    //Swith off alert font, play beep, switch between session and break, and show temporary switching message
    if (timeRemaining === 0) {
      $("#time-left").toggleClass("alertColor", false);
      beepFile.play();
      onBreak = !onBreak;
      if (onBreak) {
        timeRemaining = breakLength * 60;
        $("#timer-label").html("Break has started!");
        $("#currentPhase").html(breakPhase);
        defaultLabel();
      } else {
        timeRemaining = sessionLength * 60;
        $("#timer-label").html("Session has started!");
        $("#currentPhase").html(sessionPhase);
        defaultLabel();
      }
    }
  }, 333); //ms interval for comparing seconds
}

//Switches from session/break change notification back to normal text after indicated number of ms
function defaultLabel() {
  setTimeout(() => {
    $("#timer-label").html(defaultTimerLabel);
  }, 5000);
}

//Takes number of seconds left, converts to mm:ss format and displays
function minSecDisplay(currentRemaining) {
  let minutes = Math.floor(currentRemaining / 60);
  let seconds = currentRemaining % 60;
  let minDisplay = unitDisplay(minutes);
  let secDisplay = unitDisplay(seconds);

  $("#time-left").html(minDisplay + ":" + secDisplay);
}

//return units in two digit format
function unitDisplay(unit) {
  if (unit === 0) {
    return "00";
  } else if (unit < 10) {
    return "0" + unit.toString();
  } else {
    return unit.toString();
  }
}

//Start/Stop function
function startStop() {
  if (running) {
    beepReset(); //cuts beep short
    clearInterval(timerVar); //stops countdown function
    running = false;
    //display pause message
    if (onBreak) {
      $("#currentPhase").html(breakPhase + " (Paused)");
    } else {
      $("#currentPhase").html(sessionPhase + " (Paused)");
    }
  } else {//start countdown again
    running = true;
    countdown(timeRemaining);
  }
  defaultLabel(); //switches from session/break change notification to default
  activateIncrementors(running); //turns up/down buttons off while runnning
}

//Reset button function
function reset() {
  if (running) {
    clearInterval(timerVar);
    running = false;
  }
  $("#time-left").toggleClass("alertColor", false);
  onBreak = false;
  beepReset();
  //Return length settings to default and reset displays
  breakLength = defaultBreakLength;
  sessionLength = defaultSessionLength;
  timeRemaining = sessionLength * 60;
  activateIncrementors(running); //turn on up/down buttons
  initialSetting();
}

//Accepts boolean. Disables buttons if true (i.e. if running)
function activateIncrementors(buttonSwitch) {
  if (buttonSwitch) {
    $(".incrementor").prop("disabled", true);
  } else {
    $(".incrementor").prop("disabled", false);
  }
}

//Functions for increment length buttons
function breakDown() {
  if (breakLength > 1) {
    breakLength -= 1;
    $("#break-length").html(breakLength);
  }
}

function breakUp() {
  if (breakLength < 60) {
    breakLength += 1;
    $("#break-length").html(breakLength);
  }
}

function sessionDown() {
  if (sessionLength > 1) {
    sessionLength -= 1;
    $("#session-length").html(sessionLength);
    timeRemaining = sessionLength * 60;
    minSecDisplay(timeRemaining);
  }
}

function sessionUp() {
  if (sessionLength < 60) {
    sessionLength += 1;
    $("#session-length").html(sessionLength);
    timeRemaining = sessionLength * 60;
    minSecDisplay(timeRemaining);
  }
}

//cuts beep short and resets it
function beepReset() {
  beepFile.pause();
  beepFile.currentTime = 0;
}