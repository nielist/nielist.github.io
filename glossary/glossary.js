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
  for (let i = 0; i < glossary_list.length; i++) {
    let name_en = glossary_list[i].name_en;
    let name_tc = glossary_list[i].name_tc;
    let name_sc = glossary_list[i].name_sc;
    let re = new RegExp(name_en, "gim");
    target_text = target_text.replace(re, "<mark>"+name_en+"</mark>");
    re = new RegExp(name_tc, "gim");
    target_text = target_text.replace(re, "<mark>"+name_tc+"</mark>");
    re = new RegExp(name_sc, "gim");
    target_text = target_text.replace(re, "<mark>"+name_sc+"</mark>");
  }
  $("#target-text").html(target_text);
}
