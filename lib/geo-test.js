window.log=function(){if(this.console){console.log(Array.prototype.slice.call(arguments))}};

function runTest(type){
  $('.result').remove();
  switch (type) {
    case 'existence':
      existenceTest();
      break;
    case 'current':
      getCurrentPositionTest();
      break;
    case 'watch':
      watchPositionTest();
      break;
    default:
      log('error: test of type "' + type + '" does not exist');
  }
}

function existenceTest(){
  log('running existence test');
  var tests = ['geolocation', 'getCurrentPosition', 'watchPosition'];
  var $geo = $('#geolocation'),
      $gcp = $('#get-current-position'),
      $wp  = $('#watch-position');

  $.each(tests, function(){
    log('testing: ' + this);
    if (exists(this)) {
      $('<p class="result"/>')
        .text(this + ' exists.').addClass('pass')
        .appendTo( $('#' + this) );
      log('pass');
    } else {
      $('<p class="result"/>')
        .text(this + ' does not exist.').addClass('fail')
        .appendTo( $('#' + this) );
      log('fail');
    }
  });

  function exists(query){
    var exists;
    if (query == 'geolocation') {
      exists = !!navigator[query];
    } else {
      exists = !!navigator.geolocation[query];
    }
    if (exists) return true;
    else return false;
  }
}

function getCurrentPositionTest(){
  log('running getCurrentPosition test');
  var g, success, error, options, $el = $('#getCurrentPosition');
  var g = navigator.geolocation;
  if (!g) {
    log('geolocation not supported');
    return false;
  }
  log('geolocation supported');
  if (!g.getCurrentPosition) {
    log('getCurrentPosition not supported');
    return false;
  }
  log('getCurrentPosition supported');

  success = function(position){
    var d = (new Date()).toLocaleTimeString(),
        lat = position.coords.latitude,
        lng = position.coords.longitude;
    $('<p class="result"/>').text(d + ' -- ' + lat + ', ' + lng)
      .addClass('pass').appendTo($el);
    log('position', position);
  };

  error = function(error){
    var text = 'error code: ' + error.code;
    text += ', message: ' + error.message;
    $('<p class="result"/>').text(text).addClass('fail').appendTo($el);
    log('error', error);
  }

  log('trying getCurrentPosition');
  g.getCurrentPosition(success, error, {
    enableHighAccuracy: true,
    maximumAge: 5000
  });
}

function watchPositionTest(){
  log('running watchPosition test');
  var g, success, error, options, $el = $('#watchPosition');
  var g = navigator.geolocation;
  if (!g) {
    log('geolocation not supported');
    return false;
  }
  log('geolocation supported');
  if (!g.watchPosition) {
    log('watchPosition not supported');
    return false;
  }
  log('watchPosition supported');

  success = function(position){
    var d = (new Date()).toLocaleTimeString(),
        lat = position.coords.latitude,
        lng = position.coords.longitude;
    $('<p class="result"/>').text(d + ' -- ' + lat + ', ' + lng)
      .addClass('pass').appendTo($el);
    log('position', position);
  };

  error = function(error){
    var text = 'error code: ' + error.code;
    text += ', message: ' + error.message;
    $('<p class="result"/>').text(text).addClass('fail').appendTo($el);
    log('error', error);
  }

  log('trying watchPosition');
  window.watchID = g.watchPosition(success, error, {
    enableHighAccuracy: true,
    maximumAge: 5000
  });
}

$(function(){
  $('button.test').click(function(){
    if (window.watchID) {
      navigator.geolocation.clearWatch(window.watchID);
      log('cleared watchID');
    }
    runTest( $(this).attr('id') );
  });
});
