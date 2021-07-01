const COLOR_PINK = "#FF0085";
const COLOR_RED = "#FF0000";
const COLOR_YELLOW = "#FFEB00";
const COLOR_GREEN = "#009E00";
const COLOR_LIGHTBLUE = "#00ABFF";
const COLOR_BLUE = "#000085";

var url_prefix = ""; //"https://nielist.github.io/artbat/";

var timer_state = "reset";
var timer_minutes_default = 20;
var timer_seconds = 60 * timer_minutes_default;
var timer_object = null;

var dict_colors = [COLOR_PINK, COLOR_RED, COLOR_YELLOW, COLOR_GREEN, COLOR_LIGHTBLUE, COLOR_BLUE];
var dict_adjectives = [];
var dict_nouns = [];
var dict_pastpaper = [];
var pending_spin_adjectives = [];
var pending_spin_nouns = [];
var active_adjective = "";
var active_noun = "";
var spin_timer_object = null;

function init() {
  updateTimer("reset");
  $("#btn_timer_start").click(function(event){
    if(!event.detail || event.detail == 1){
      updateTimer("start");
    }
  });
  $("#btn_timer_continue").click(function(event){
    if(!event.detail || event.detail == 1){
      updateTimer("continue");
    }
  });
  $("#btn_timer_pause").click(function(event){
    if(!event.detail || event.detail == 1){
      updateTimer("pause");
    }
  });
  $("#btn_timer_reset").click(function(event){
    if(!event.detail || event.detail == 1){
      updateTimer("reset");
    }
  });

  getWords();
  showWords("???", "???");
  $("#btn_spin").click(function(event){
    //activate on first click only to avoid hiding again on multiple clicks
    //execute only once on multiple clicks
    if(!event.detail || event.detail == 1){
      $("#btn_spin").addClass("disabled");
      shuffleWords();
      let counter = 10;
      let count = counter;
      spin_timer_object = setInterval(function() {
        count--;
        if (count <= 0) {
          clearInterval(spin_timer_object);
          $("#btn_spin").removeClass("disabled");
        }
        showWords(dict_adjectives[counter-count], dict_nouns[counter-count]);
      }, 100);
    }
  });

  getPastpaperCsv();
}

function onClickAddNewColor() {
  let id = $('input[type=text]#Code').val();

  if (typeof id !== 'undefined' && id !== '') {
    if ($('#'+id).length <= 0) {
      let html = '';
      html += '';

      $('input[type=text]#Code').parent().before(html);
    }
  }

  $('input[type=text]#Code').val('');
}

function onClickAddNewAdjective() {
}

function onClickAddNewNoun() {
}

function updateTimer(t_state) {
  timer_state = t_state;
  switch (timer_state) {
    case "start":
      setTimer();
      $("#btn_timer_start").addClass("disabled hide");
      $("#btn_timer_continue").addClass("disabled hide");
      $("#btn_timer_pause").removeClass("disabled hide");
      $("#btn_timer_reset").removeClass("disabled hide");
      break;
    case "continue":
      setTimer();
      $("#btn_timer_start").addClass("disabled hide");
      $("#btn_timer_continue").addClass("disabled hide");
      $("#btn_timer_pause").removeClass("disabled hide");
      $("#btn_timer_reset").removeClass("disabled hide");
      break;
    case "pause":
      clearTimer();
      $("#btn_timer_start").addClass("disabled hide");
      $("#btn_timer_continue").removeClass("disabled hide");
      $("#btn_timer_pause").addClass("disabled hide");
      $("#btn_timer_reset").removeClass("disabled hide");
      break;
    case "reset":
    default:
      timer_seconds = 60 * timer_minutes_default;
      clearTimer();
      $("#btn_timer_start").removeClass("disabled hide");
      $("#btn_timer_continue").addClass("disabled hide");
      $("#btn_timer_pause").addClass("disabled hide");
      $("#btn_timer_reset").addClass("disabled hide");
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
  $("#div_timer_display").html("" + (minutes<10?'0':'') + minutes + ":" + (seconds<10?'0':'') + seconds);
  if (timer_seconds <= 0) {
    $("#div_timer_display").html("finish!");
  }
}

function getWords() {
  $.getJSON(url_prefix + "data/adjectives.json", function(result){
    dict_adjectives = result.data;
  });
  $.getJSON(url_prefix + "data/nouns.json", function(result){
    dict_nouns = result.data;
  });
}
function shuffleWords() {
  dict_adjectives.sort(function() { return 0.5 - Math.random() });
  dict_nouns.sort(function() { return 0.5 - Math.random() });
}
function showWords(adjective, noun) {
  var active_adjective = adjective;
  var active_noun = noun;
  $("#lbl_adjt").html(active_adjective);
  $("#lbl_noun").html(active_noun);
}

function getPastpaperCsv() {
  $.ajax({
    type: "GET",
    url: url_prefix + "data/pastpaper.csv",
    dataType: "text",
    success: function(response)
    {
      dict_pastpaper = $.csv.toObjects(response);
      showPastpaperTable(dict_pastpaper);
    }
  });
}

function showPastpaperTable(data) {
  var html = '<table class="table table-condensed table-hover table-striped" id="tbl_pastpaper">';

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
    $('#div_pastpaper_display').append(html);
  }
}
