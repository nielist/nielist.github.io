const currency_codes = ['CURRENCY'];
const etf_funds = ['VOO', 'QQQ', 'ARKK', 'ARKQ', 'ARKW', 'ARKG', 'ARKF'];
var etf_constituents = [];
var investment = {};
var results = {};

String.prototype.capitalize = function(){
  return this && this
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/*
//https://stackoverflow.com/questions/610406/javascript-equivalent-to-printf-string-format
// Method 1:
let soMany = 10;
console.log(`This is ${soMany} times easier!`);
// Method 2:
//"{0} is dead, but {1} is alive! {0} {2}".format("ASP", "ASP.NET")
String.prototype.format = function() {
  var args = arguments;
  return this.replace(/{(\d+)}/g, function(match, number) { 
    return typeof args[number] != 'undefined'
      ? args[number]
      : match
    ;
  });
};
// Method 3:
//String.format('{0} is dead, but {1} is alive! {0} {2}', 'ASP', 'ASP.NET');
String.format = function(format) {
  var args = Array.prototype.slice.call(arguments, 1);
  return format.replace(/{(\d+)}/g, function(match, number) { 
    return typeof args[number] != 'undefined'
      ? args[number] 
      : match
    ;
  });
};
*/

String.prototype.isNumber = function(){
  return /^\d+$/.test(this);
}

String.prototype.isInteger = function(){
  return /^-?\d+$/.test(this);
}

String.prototype.isFloat = function(){
  return /^-?\d+(?:[.,]\d*?)?$/.test(this);
}

String.prototype.toCsvQuotedField = function(){
  return this && (this.includes(',') ? ('"' + this + '"') : this);
}

Number.prototype.toOrdinal = function(){
  if (this <= 0) { return {'number':this, 'suffix':''}; }
  else if (this % 100 >= 11 && this % 100 <= 13) { return {'number':this, 'suffix':'th'}; }
  else if (this % 10 == 1) { return {'number':this, 'suffix':'st'}; }
  else if (this % 10 == 2) { return {'number':this, 'suffix':'nd'}; }
  else if (this % 10 == 3) { return {'number':this, 'suffix':'rd'}; }
  return {'number':this, 'suffix':'th'};
}

$(document).ready(function(){
  getVOOHtml(onReadyCsv);
  getQQQHtml(onReadyCsv);
  getARKKCsv(onReadyCsv);
  getARKQCsv(onReadyCsv);
  getARKWCsv(onReadyCsv);
  getARKGCsv(onReadyCsv);
  getARKFCsv(onReadyCsv);
  $("#Add").click(function(e){
    e.preventDefault();
    onClickAddNewStock();
  });
  $("form").submit(function(e){
    e.preventDefault();
    onClickCalculate();
  });
});

function onReadyCsv() {
  if (isAjaxDone(['VOO', 'QQQ', 'ARKK', 'ARKQ', 'ARKW', 'ARKG', 'ARKF'])) {
    setTimeout(function(){
      onReadyVOODataInit();
      onReadyQQQDataInit();
      onReadyARKKDataInit();
      onReadyARKQDataInit();
      onReadyARKWDataInit();
      onReadyARKGDataInit();
      onReadyARKFDataInit();
      //console.log(etf_constituents);

      for (const id of Object.values(etf_funds)) {
        if ($('#'+id).length <= 0) {
          $('input[type=text]#Code').val(id);
          onClickAddNewStock();
        }
      }
      for (const id of Object.values(currency_codes)) {
        if ($('#'+id).length <= 0) {
          $('input[type=text]#Code').val(id);
          onClickAddNewStock();
        }
      }
      let params = getUrlParams();
      for (const key of params.keys()) {
        if ($('#'+key).length <= 0) {
          $('input[type=text]#Code').val(key);
          onClickAddNewStock();
        }
      }
      for (const key of params.keys()) {
        if (params.has(key)) {
          let values = params.getAll(key);
          for (const value of values) {
            if (value.isFloat()) {
              $('#'+key).val(parseFloat(value));
            }
          }
        }
      }
      onClickCalculate();
    }, 0);
  }
}

function onReadyVOODataInit() {
  //console.log(csv_obj['VOO']);
  for (let i = 0; i < csv_obj['VOO'].length; i++) {
    let obj = {};
    obj['fund'] = 'VOO';
    obj['ticker'] = csv_obj['VOO'][i]['Symbol'];
    obj['company'] = csv_obj['VOO'][i]['Company'];
    obj['weight'] = csv_obj['VOO'][i]['Weight'];
    if (obj['ticker'] === '') {
      obj['ticker'] = obj['company'];
    }
    if (typeof obj['weight'] === 'undefined') {
      //console.log(obj);
    }
    if (obj['weight'] !== '' && typeof obj['weight'] !== 'undefined') {
      if (obj['weight'].isFloat()) {
        obj['weight'] = parseFloat(obj['weight']);
      }
      else {
        obj['weight'] = 0.0;
      }
      etf_constituents.push(obj);
    }
  }
}

function onReadyQQQDataInit() {
  //console.log(csv_obj['QQQ']);
  for (let i = 0; i < csv_obj['QQQ'].length; i++) {
    let obj = {};
    obj['fund'] = 'QQQ';
    obj['ticker'] = csv_obj['QQQ'][i]['Symbol'];
    obj['company'] = csv_obj['QQQ'][i]['Company'];
    obj['weight'] = csv_obj['QQQ'][i]['Weight'];
    if (obj['ticker'] === '') {
      obj['ticker'] = obj['company'];
    }
    if (typeof obj['weight'] === 'undefined') {
      //console.log(obj);
    }
    if (obj['weight'] !== '' && typeof obj['weight'] !== 'undefined') {
      if (obj['weight'].isFloat()) {
        obj['weight'] = parseFloat(obj['weight']);
      }
      else {
        obj['weight'] = 0.0;
      }
      etf_constituents.push(obj);
    }
  }
}

function onReadyARKKDataInit() {
  //console.log(csv_obj['ARKK']);
  for (let i = 0; i < csv_obj['ARKK'].length; i++) {
    let obj = {};
    obj['fund'] = csv_obj['ARKK'][i]['fund'];
    obj['ticker'] = csv_obj['ARKK'][i]['ticker'];
    obj['company'] = csv_obj['ARKK'][i]['company'];
    obj['weight'] = csv_obj['ARKK'][i]['weight(%)'];
    if (obj['ticker'] === '') {
      obj['ticker'] = obj['company'];
    }
    if (typeof obj['weight'] === 'undefined') {
      //console.log(obj);
    }
    if (obj['weight'] !== '' && typeof obj['weight'] !== 'undefined') {
      if (obj['weight'].isFloat()) {
        obj['weight'] = parseFloat(obj['weight']);
      }
      else {
        obj['weight'] = 0.0;
      }
      etf_constituents.push(obj);
    }
  }
}

function onReadyARKQDataInit() {
  //console.log(csv_obj['ARKQ']);
  for (let i = 0; i < csv_obj['ARKQ'].length; i++) {
    let obj = {};
    obj['fund'] = csv_obj['ARKQ'][i]['fund'];
    obj['ticker'] = csv_obj['ARKQ'][i]['ticker'];
    obj['company'] = csv_obj['ARKQ'][i]['company'];
    obj['weight'] = csv_obj['ARKQ'][i]['weight(%)'];
    if (obj['ticker'] === '') {
      obj['ticker'] = obj['company'];
    }
    if (typeof obj['weight'] === 'undefined') {
      //console.log(obj);
    }
    if (obj['weight'] !== '' && typeof obj['weight'] !== 'undefined') {
      if (obj['weight'].isFloat()) {
        obj['weight'] = parseFloat(obj['weight']);
      }
      else {
        obj['weight'] = 0.0;
      }
      etf_constituents.push(obj);
    }
  }
}

function onReadyARKWDataInit() {
  //console.log(csv_obj['ARKW']);
  for (let i = 0; i < csv_obj['ARKW'].length; i++) {
    let obj = {};
    obj['fund'] = csv_obj['ARKW'][i]['fund'];
    obj['ticker'] = csv_obj['ARKW'][i]['ticker'];
    obj['company'] = csv_obj['ARKW'][i]['company'];
    obj['weight'] = csv_obj['ARKW'][i]['weight(%)'];
    if (obj['ticker'] === '') {
      obj['ticker'] = obj['company'];
    }
    if (typeof obj['weight'] === 'undefined') {
      //console.log(obj);
    }
    if (obj['weight'] !== '' && typeof obj['weight'] !== 'undefined') {
      if (obj['weight'].isFloat()) {
        obj['weight'] = parseFloat(obj['weight']);
      }
      else {
        obj['weight'] = 0.0;
      }
      etf_constituents.push(obj);
    }
  }
}

function onReadyARKGDataInit() {
  //console.log(csv_obj['ARKG']);
  for (let i = 0; i < csv_obj['ARKG'].length; i++) {
    let obj = {};
    obj['fund'] = csv_obj['ARKG'][i]['fund'];
    obj['ticker'] = csv_obj['ARKG'][i]['ticker'];
    obj['company'] = csv_obj['ARKG'][i]['company'];
    obj['weight'] = csv_obj['ARKG'][i]['weight(%)'];
    if (obj['ticker'] === '') {
      obj['ticker'] = obj['company'];
    }
    if (typeof obj['weight'] === 'undefined') {
      //console.log(obj);
    }
    if (obj['weight'] !== '' && typeof obj['weight'] !== 'undefined') {
      if (obj['weight'].isFloat()) {
        obj['weight'] = parseFloat(obj['weight']);
      }
      else {
        obj['weight'] = 0.0;
      }
      etf_constituents.push(obj);
    }
  }
}

function onReadyARKFDataInit() {
  //console.log(csv_obj['ARKF']);
  for (let i = 0; i < csv_obj['ARKF'].length; i++) {
    let obj = {};
    obj['fund'] = csv_obj['ARKF'][i]['fund'];
    obj['ticker'] = csv_obj['ARKF'][i]['ticker'];
    obj['company'] = csv_obj['ARKF'][i]['company'];
    obj['weight'] = csv_obj['ARKF'][i]['weight(%)'];
    if (obj['ticker'] === '') {
      obj['ticker'] = obj['company'];
    }
    if (typeof obj['weight'] === 'undefined') {
      //console.log(obj);
    }
    if (obj['weight'] !== '' && typeof obj['weight'] !== 'undefined') {
      if (obj['weight'].isFloat()) {
        obj['weight'] = parseFloat(obj['weight']);
      }
      else {
        obj['weight'] = 0.0;
      }
      etf_constituents.push(obj);
    }
  }
}

function onReadyStockInfoDataInit() {
  console.log(stock_info);
}

function onClickAddNewStock() {
  let id = $('input[type=text]#Code').val();

  if (typeof id !== 'undefined' && id !== '') {
    id = id.toUpperCase();

    if (currency_codes.indexOf(id) < 0) {
      let assetClass = 'stocks';
      if (etf_funds.indexOf(id) >= 0) {
        assetClass = 'etf';
      }
      getStockInfoJson(id, assetClass, onReadyStockInfoDataInit);
    }

    if ($('#'+id).length <= 0) {
      let html = '';
      html += '<div class="progress">';
      html += '<div class="progress-bar progress-bar-striped progress-bar-animated stock-percent" id="' + id + '-percent" style="width:0%"></div>';
      html += '</div>';
      html += '<div class="input-group mb-3 input-group-lg">';
      html += '<div class="input-group-prepend">';
      html += '<span class="input-group-text">' + id + ' = </span>';
      html += '</div>';
      html += '<input type="number" step="0.01" min="0" value="0" data-value="0" class="form-control stock-shares" id="' + id + '" placeholder="Enter Shares (e.g. 123)">';
      html += '<div class="input-group-append">';
      html += '<span class="input-group-text"> = $<span class="stock-invest" id="' + id + '-invest">0.00</span></span>';
      html += '</div>';
      html += '</div>';

      $('input[type=text]#Code').parent().before(html);
    }
  }

  $('input[type=text]#Code').val('');
}

function onClickCalculate() {
  let params = {};
  $('input[type=number].stock-shares').each(function(){
    let id = $(this).attr('id');
    investment[id] = parseFloat($('#'+id).val());
    if (investment[id] > 0.0) {
      if (typeof params[id] === 'undefined') {
        params[id] = [];
      }
      params[id].push(''+investment[id]);
    }
  });
  updateUrl(params);
  investment['total'] = 0.0;
  $.each(investment, function(key, value) {
    if (key !== 'total') {
      investment['total'] += value;
    }
  });

  // Handling for Percentage Bar
  $.each(investment, function(key, value) {
    if (key !== 'total') {
      let percent = 100.0 * investment[key] / investment['total'];
      $('#'+key+'-percent').css('width',''+percent+'%');
      $('#'+key+'-percent').html(''+percent.toFixed(1)+'%');
      $('#'+key+'-percent').removeClass('bg-success');
      $('#'+key+'-percent').removeClass('bg-info');
      $('#'+key+'-percent').removeClass('bg-warning');
      $('#'+key+'-percent').removeClass('bg-danger');
      if (percent < 10.0) {
      }
      else if (percent < 20.0) {
        $('#'+key+'-percent').addClass('bg-success');
      }
      else if (percent < 30.0) {
        $('#'+key+'-percent').addClass('bg-info');
      }
      else if (percent < 40.0) {
        $('#'+key+'-percent').addClass('bg-warning');
      }
      else {
        $('#'+key+'-percent').addClass('bg-danger');
      }
    }
  });

  results = {};

  // Handling for Individual Stocks
  $('input[type=number].stock-shares').each(function(){
    let id = $(this).attr('id');
    if (id !== 'total' && etf_funds.indexOf(id) < 0) {
      results[id] = {'ticker':id, 'company':id, investment:{'total':investment[id]}};
      results[id].investment[id] = investment[id];
    }
  });

  // Handling for ETF Funds
  for (let i = 0; i < etf_constituents.length; i++) {
    let constituent = etf_constituents[i];

    if (typeof results[constituent.ticker] === 'undefined') {
      results[constituent.ticker] = {'ticker':'', 'company':'', investment:{'total':0.0}};
    }

    results[constituent.ticker].ticker = constituent.ticker;
    results[constituent.ticker].company = constituent.company;

    if (typeof results[constituent.ticker].investment[constituent.fund] === 'undefined') {
      results[constituent.ticker].investment[constituent.fund] = 0.0;
    }
    results[constituent.ticker].investment[constituent.fund] += 1.0 * investment[constituent.fund] * constituent.weight / 100.0;

    if (typeof results[constituent.ticker].investment.total === 'undefined') {
      results[constituent.ticker].investment.total = 0.0;
    }
    results[constituent.ticker].investment.total += results[constituent.ticker].investment[constituent.fund];
  }

  //console.log(results);
  refreshDataTable();
}

function refreshDataTable() {
  let html = constructDataTable();
  setTimeout(function(){
    $('.table').html($(html).hide().fadeIn(2000));
    $('.table').show();
  }, 100);
}

function constructDataTable() {
  let html = '';
  if (typeof investment.total !== 'undefined' && investment.total > 0.0) {
    html += '<thead>';
    html += '<tr>';
    html += '<th>Ticker / Company</th>';
    html += '<th style="width:60%">Investment = $' + investment.total.toFixed(2) + '</th>';
    html += '</tr>';
    html += '</thead>';
    html += '<tbody>';
    let sortedResults = Object.values(results).sort(function(a, b){return b.investment.total-a.investment.total});
    for (let i = 0; i < sortedResults.length; i++) {
      if (typeof sortedResults[i].investment.total !== 'undefined' && sortedResults[i].investment.total > 0.0) {
        html += '<tr>';
        html += '<td>';
        html += sortedResults[i].ticker;
        if (sortedResults[i].ticker !== sortedResults[i].company) {
          html += '<br/>(';
          html += sortedResults[i].company;
          html += ')';
        }
        html += '</td>';
        html += '<td>';
        html += (100.0 * sortedResults[i].investment.total / investment.total).toFixed(2) + '% = $';
        html += sortedResults[i].investment.total.toFixed(2);

        // Handling for Individual Stocks
        let individual_stocks = [];
        $.each(sortedResults[i].investment, function(key, value) {
          if (key !== 'total' && etf_funds.indexOf(key) < 0) {
            individual_stocks.push(key);
          }
        });

        for (let c = 0; c < individual_stocks.length; c++) {
          let fund = individual_stocks[c];
          if (typeof sortedResults[i].investment[fund] !== 'undefined' && sortedResults[i].investment[fund] > 0.0) {
            html += '<br/>(' + fund + ' = $';
            html += sortedResults[i].investment[fund].toFixed(2);
            html += ')';
          }
        }

        // Handling for ETF Funds
        for (let c = 0; c < etf_funds.length; c++) {
          let fund = etf_funds[c];
          if (typeof sortedResults[i].investment[fund] !== 'undefined' && sortedResults[i].investment[fund] > 0.0) {
            html += '<br/>(' + fund + ' = $';
            html += sortedResults[i].investment[fund].toFixed(2);
            html += ')';
          }
        }

        html += '</td>';
        html += '</tr>';
      }
    }
    html += '</tbody>';
  }
  return html;
}
