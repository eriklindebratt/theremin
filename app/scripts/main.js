'use strict';

var settings = {
  maxFrequency: 523.251, // upper C
  minFrequency: 261.626,  // lower C
  defaultVolume: 0.5
};
settings.defaultFrequency =
  (settings.maxFrequency - settings.minFrequency) / 2;

var getAudioContext = function() {
  if ('webkitAudioContext' in window) {
    return new webkitAudioContext();  // jshint ignore:line

  } else if ('AudioContext' in window) {
    return new AudioContext();  // jshint ignore:line

  } else {
    throw new Error('Nor webkitAudioContext or AudioContext supported');
  }
};

var context = getAudioContext();
var oscillator = context.createOscillator();
var gainNode = context.createGain();

oscillator.frequency.value = settings.defaultFrequency;
oscillator.connect(context.destination);
oscillator.connect(gainNode);

gainNode.connect(context.destination);

var play = function() {
  oscillator.start(0);
};

var stop = function() {
  oscillator.stop(0);
};

var setFrequency = function(value) {
  console.log('setFrequency: ', value);

  if (typeof(value) !== 'number') {
    value = Number(value);
  }
  if (!value || isNaN(value)) {
    value = settings.defaultFrequency;
  }

  oscillator.frequency.value = value;
};

var setVolume = function(value) {
  console.log('setVolume: ', value);

  if (typeof(value) !== 'number') {
    value = Number(value);
  }
  if (!value || isNaN(value)) {
    value = settings.defaultVolume;
  }

  gainNode.gain.value = value;
};

var onFuffrConnected = function() {
  console.log('onFuffrConnected');
  fuffr.log('onFuffrConnected');

  fuffr.isConnected = true;
  fuffr.enableSides(fuffr.FFRSideRight | fuffr.FFRSideLeft, 1);  // jshint ignore:line
};

var onFuffrDisconnected = function() {
  console.log('onFuffrDisconnected');
  fuffr.log('onFuffrDisconnected');

  fuffr.isConnected = false;
};

var onFuffrTouch = function(touches) {
  //console.log('onFuffrTouch: ', touches);
  fuffr.log('onFuffrTouch');

  //if (!touches || !touches.length) {
    //return;
  //}

  for (var i in touches) {
    var touch = touches[i];


    if (touch.side === fuffr.FFRSideLeft) {
      setVolume(-1 * touch.normy);
    }

    if (touch.side === fuffr.FFRSideRight) {
      setFrequency(settings.maxFrequency * (1 - touch.normy));
    }
  }
};

// deplendency on https://github.com/kzokm/eyetribe-websocket
var eye = function($debug){
  EyeTribe.loop(function(frame) {
    var pos = frame.average;
    var volume = pos.y / window.screen.height - 1 ;
    var frequency = pos.x / window.screen.width * settings.maxFrequency;
    $debug.css('top', pos.y + 'px');
    $debug.css('left', pos.x + 'px');
    $debug.html(frequency + " <br> " + volume);

    setVolume(volume);
    setFrequency(frequency);

  });
};



var init = function() {
  $('body')
    .on('click', '.js-start', function() {
      console.log('start');
      play();
    })
    .on('click', '.js-stop', function() {
      console.log('stop');
      stop();
    });

  //setupFuffr();
};

$(function() {
  init();

  if(true){
    eye($('.debug'));

  } else {
    $('.debug').hide();
    fuffr.on.connected = onFuffrConnected;
    fuffr.on.disconnected = onFuffrDisconnected;
    fuffr.on.touchesBegan = onFuffrTouch;
    fuffr.on.touchesMoved = onFuffrTouch;
    fuffr.on.touchesEnded = onFuffrTouch;
  }
});
