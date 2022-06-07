//var glossary_json_url = "https://www.infosec.gov.hk/json/glossary.json";
var glossary_json_url = "https://nielist.github.io/glossary/glossary.json";

var glossary_list = [];

$(document).ready(function(){
  getGlossary();
  $("#source-text").change(function(e){
    e.preventDefault();
    onChangeSourceText();
  });
});

function getGlossary() {
  $.getJSON(glossary_json_url, function(result){
    glossary_list = result;
  });
}

function onChangeSourceText() {
  let source_text = $("#source-text").val();
  let target_text = source_text;
  glossary_list.sort((a, b) => (a.name_en.length < b.name_en.length) ? 1 : -1);
  for (let i = 0; i < glossary_list.length; i++) {
    let name_en = glossary_list[i].name_en;
    let re = new RegExp(`\\b${name_en}\\b`, "gi");
    target_text = target_text.replace(re, "<mark>"+name_en+"</mark>");
  }
  glossary_list.sort((a, b) => (a.name_tc.length < b.name_tc.length) ? 1 : -1);
  for (let i = 0; i < glossary_list.length; i++) {
    let name_tc = glossary_list[i].name_tc;
    let re = new RegExp(`\\b${name_tc}\\b`, "gi");
    target_text = target_text.replace(re, "<mark>"+name_tc+"</mark>");
  }
  glossary_list.sort((a, b) => (a.name_sc.length < b.name_sc.length) ? 1 : -1);
  for (let i = 0; i < glossary_list.length; i++) {
    let name_sc = glossary_list[i].name_sc;
    let re = new RegExp(`\\b${name_sc}\\b`, "gi");
    target_text = target_text.replace(re, "<mark>"+name_sc+"</mark>");
  }
  $("#target-text").html(target_text);
}
