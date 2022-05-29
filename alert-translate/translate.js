var url_prefix = "https://nielist.github.io/alert-translate/";

var dictionary_list = [];

$(document).ready(function(){
  getDictionaryCsv();
  $("#source-text").change(function(e){
    e.preventDefault();
    onChangeSourceText();
  });
});

function getDictionaryCsv() {
  $.ajax({
    type: "GET",
    url: url_prefix + "dictionary.csv",
    dataType: "text",
    success: function(response)
    {
      let csv_obj = $.csv.toObjects(response);
      if (csv_obj.length > 0) {
        dictionary_list = csv_obj;
		dictionary_list.sort((a, b) => (a.en.length < b.en.length) ? 1 : -1);
		//console.log(dictionary_list);
      }
    }
  });
}

function onChangeSourceText() {
  let source_text = $("#source-text").val();
  let target_text = source_text;
  for (let i = 0; i < dictionary_list.length; i++) {
    let en = dictionary_list[i].en;
    let tc = dictionary_list[i].tc;
    let re = new RegExp(en, "gim");
    target_text = target_text.replace(re, tc);
  }
  $("#target-text").val(target_text);
}
