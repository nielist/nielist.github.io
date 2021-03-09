var url_prefix = ""; //"https://nielist.github.io/artbat/";
var timer_state = "reset";
var timer_minutes_default = 20;
var timer_seconds = 60 * timer_minutes_default;
var timer_object = null;
var words_adjectives = [];
var words_nouns = [];
var active_word_adjective = "";
var active_word_noun = "";
var random_words_timer_object = null;
var artbat_pastpaper = [];

function init() {
  updateTimer("reset");
  $("#timer-btn-start").click(function(event){
    if(!event.detail || event.detail == 1){
      updateTimer("start");
    }
  });
  $("#timer-btn-continue").click(function(event){
    if(!event.detail || event.detail == 1){
      updateTimer("continue");
    }
  });
  $("#timer-btn-pause").click(function(event){
    if(!event.detail || event.detail == 1){
      updateTimer("pause");
    }
  });
  $("#timer-btn-reset").click(function(event){
    if(!event.detail || event.detail == 1){
      updateTimer("reset");
    }
  });

  getWords();
  showWords("???", "???");
  $("#words-btn-random").click(function(event){
    //activate on first click only to avoid hiding again on multiple clicks
    //execute only once on multiple clicks
    if(!event.detail || event.detail == 1){
      $("#words-btn-random").addClass("disabled");
      shuffleWords();
      let counter = 10;
      let count = counter;
      random_words_timer_object = setInterval(function() {
        count--;
        if (count <= 0) {
          clearInterval(random_words_timer_object);
          $("#words-btn-random").removeClass("disabled");
        }
        showWords(words_adjectives[counter-count], words_nouns[counter-count]);
      }, 100);
    }
  });

  getArtbatPastpaperCsv();
}

function updateTimer(t_state) {
  timer_state = t_state;
  switch (timer_state) {
    case "start":
      setTimer();
      $("#timer-btn-start").addClass("disabled hide");
      $("#timer-btn-continue").addClass("disabled hide");
      $("#timer-btn-pause").removeClass("disabled hide");
      $("#timer-btn-reset").removeClass("disabled hide");
      break;
    case "continue":
      setTimer();
      $("#timer-btn-start").addClass("disabled hide");
      $("#timer-btn-continue").addClass("disabled hide");
      $("#timer-btn-pause").removeClass("disabled hide");
      $("#timer-btn-reset").removeClass("disabled hide");
      break;
    case "pause":
      clearTimer();
      $("#timer-btn-start").addClass("disabled hide");
      $("#timer-btn-continue").removeClass("disabled hide");
      $("#timer-btn-pause").addClass("disabled hide");
      $("#timer-btn-reset").removeClass("disabled hide");
      break;
    case "reset":
    default:
      timer_seconds = 60 * timer_minutes_default;
      clearTimer();
      $("#timer-btn-start").removeClass("disabled hide");
      $("#timer-btn-continue").addClass("disabled hide");
      $("#timer-btn-pause").addClass("disabled hide");
      $("#timer-btn-reset").addClass("disabled hide");
      break;
  }
}

function clearTimer() {
  clearInterval(timer_object);
  showTimerMessage();
}
function setTimer() {
  timer_object = setInterval(function() {
    timer_seconds--;
    if (timer_seconds < 0) {
      timer_seconds = 0;
    }
    if (timer_seconds <= 0) {
      updateTimer("pause");
    }
    showTimerMessage();
  }, 1000);
}
function showTimerMessage() {
  let minutes = Math.floor((timer_seconds % (60 * 60)) / 60);
  let seconds = Math.floor((timer_seconds % 60));
  $("#timer-txt").html("" + (minutes<10?'0':'') + minutes + ":" + (seconds<10?'0':'') + seconds);
  if (timer_seconds <= 0) {
    $("#timer-txt").html("finish!");
  }
}

function getWords() {
  $.getJSON(url_prefix + "data/adjectives.json", function(result){
    words_adjectives = result.data;
  });
  $.getJSON(url_prefix + "data/nouns.json", function(result){
    words_nouns = result.data;
  });
}
function shuffleWords() {
  words_adjectives.sort(function() { return 0.5 - Math.random() });
  words_nouns.sort(function() { return 0.5 - Math.random() });
}
function showWords(adjective, noun) {
  var active_word_adjective = adjective;
  var active_word_noun = noun;
  $("#words-txt-adjectives").html(active_word_adjective);
  $("#words-txt-nouns").html(active_word_noun);
}

function getArtbatPastpaperCsv() {
  $.ajax({
    type: "GET",
    url: url_prefix + "data/pastpaper.csv",
    dataType: "text",
    success: function(response)
    {
      artbat_pastpaper = $.csv.toObjects(response);
      showArtbatPastpaperTable(artbat_pastpaper);
    }
  });
}

function showArtbatPastpaperTable(data) {
  var html = '<table class="table table-condensed table-hover table-striped" id="table-pastpaper">';

  if(typeof(data[0]) === 'undefined') {
    return null;
  } else {
    data.reverse();
    $.each(data, function( index, row ) {
      if(index == 0) {
        html += '<thead>';
        html += '<tr>';
        html += '<th>';
        html += 'Date';
        html += '</th>';
        html += '<th>';
        html += 'Topic';
        html += '</th>';
        html += '</tr>';
        html += '</thead>';
        html += '<tbody>';
      }
      html += '<tr>';
      html += '<td>';
      html += row["date"];
      html += '</td>';
      html += '<td>';
      html += (row["word1"] == '' ? '' : row["word1"] + ' + ') + row["word2"];
      html += '</td>';
      html += '</tr>';
    });
    html += '</tbody>';
    html += '</table>';
    $('#wrapper-table-pastpaper').append(html);
  }
}
