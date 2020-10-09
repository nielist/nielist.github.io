var etf_constituent_list = [];
var investment = {};
var results = {};

String.prototype.capitalize = function(){
  return this && this
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

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
      //console.log(etf_constituent_list);
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
      etf_constituent_list.push(obj);
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
      etf_constituent_list.push(obj);
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
      etf_constituent_list.push(obj);
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
      etf_constituent_list.push(obj);
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
      etf_constituent_list.push(obj);
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
      etf_constituent_list.push(obj);
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
      etf_constituent_list.push(obj);
    }
  }
}

function onClickCalculate() {
  investment['VOO'] = parseFloat($('#VOO').val());
  investment['QQQ'] = parseFloat($('#QQQ').val());
  investment['ARKK'] = parseFloat($('#ARKK').val());
  investment['ARKQ'] = parseFloat($('#ARKQ').val());
  investment['ARKW'] = parseFloat($('#ARKW').val());
  investment['ARKG'] = parseFloat($('#ARKG').val());
  investment['ARKF'] = parseFloat($('#ARKF').val());
  investment['total'] = investment['VOO'] + investment['QQQ'] + investment['ARKK'] + investment['ARKQ'] + investment['ARKW'] + investment['ARKG'] + investment['ARKF'];

  results = {};
  for (let i = 0; i < etf_constituent_list.length; i++) {
    if (typeof results[etf_constituent_list[i].ticker] === 'undefined') {
      results[etf_constituent_list[i].ticker] = {'ticker':'', 'company':'', investment:{'total':0.0, 'VOO':0.0, 'QQQ':0.0, 'ARKK':0.0, 'ARKQ':0.0, 'ARKW':0.0, 'ARKG':0.0, 'ARKF':0.0}};
    }
    results[etf_constituent_list[i].ticker].ticker = etf_constituent_list[i].ticker;
    results[etf_constituent_list[i].ticker].company = etf_constituent_list[i].company;
    results[etf_constituent_list[i].ticker].investment[etf_constituent_list[i].fund] += 1.0 * investment[etf_constituent_list[i].fund] * etf_constituent_list[i].weight / 100.0;
    results[etf_constituent_list[i].ticker].investment.total += results[etf_constituent_list[i].ticker].investment[etf_constituent_list[i].fund];
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
  if (investment.total > 0.0) {
    html += '<thead>';
    html += '<tr>';
    html += '<th style="width:50%">Ticker / Company</th>';
    html += '<th style="width:50%">Investment ($' + investment.total.toFixed(2) + ')</th>';
    html += '</tr>';
    html += '</thead>';
    html += '<tbody>';
    let sortedResults = Object.values(results).sort(function(a, b){return b.investment.total-a.investment.total});
    for (let i = 0; i < sortedResults.length; i++) {
      if (sortedResults[i].investment.total > 0.0) {
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
        if (sortedResults[i].investment.VOO > 0.0) {
          html += '<br/>(VOO = $';
          html += sortedResults[i].investment.VOO.toFixed(2);
          html += ')';
        }
        if (sortedResults[i].investment.QQQ > 0.0) {
          html += '<br/>(QQQ = $';
          html += sortedResults[i].investment.QQQ.toFixed(2);
          html += ')';
        }
        if (sortedResults[i].investment.ARKK > 0.0) {
          html += '<br/>(ARKK = $';
          html += sortedResults[i].investment.ARKK.toFixed(2);
          html += ')';
        }
        if (sortedResults[i].investment.ARKQ > 0.0) {
          html += '<br/>(ARKQ = $';
          html += sortedResults[i].investment.ARKQ.toFixed(2);
          html += ')';
        }
        if (sortedResults[i].investment.ARKW > 0.0) {
          html += '<br/>(ARKW = $';
          html += sortedResults[i].investment.ARKW.toFixed(2);
          html += ')';
        }
        if (sortedResults[i].investment.ARKG > 0.0) {
          html += '<br/>(ARKG = $';
          html += sortedResults[i].investment.ARKG.toFixed(2);
          html += ')';
        }
        if (sortedResults[i].investment.ARKF > 0.0) {
          html += '<br/>(ARKF = $';
          html += sortedResults[i].investment.ARKF.toFixed(2);
          html += ')';
        }
        html += '</td>';
        html += '</tr>';
      }
    }
    html += '</tbody>';
  }
  return html;
}
