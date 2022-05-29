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
		dictionary_list.sort((a, b) => (a.en.length > b.en.length) ? 1 : -1);
		console.log(dictionary_list);
      }
    }
  });
}

function onChangeSourceText() {
  let source_text = $("#source-text").val();
  let re = new RegExp("a|b", "gim");
  $("#target-text").val(source_text);
}
