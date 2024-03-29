var domain = [];
domain[0] = "https://ark-funds.com/wp-content/uploads/funds-etf-csv/";
var ajax_retry_times = 0;
var ajax_retry_times_max = domain.length - 1;

var unixtimestamp = Math.floor(Date.now() / 1000);
var unixtimestampper15mins = Math.floor(unixtimestamp / 1000);

var ajax_pending = {};
ajax_pending['VOO' ] = (1 << 0);
ajax_pending['QQQ' ] = (1 << 1);
ajax_pending['MOON'] = (1 << 2);
ajax_pending['ARKK'] = (1 << 3);
ajax_pending['ARKQ'] = (1 << 4);
ajax_pending['ARKW'] = (1 << 5);
ajax_pending['ARKG'] = (1 << 6);
ajax_pending['ARKF'] = (1 << 7);
ajax_pending['ARKX'] = (1 << 8);
ajax_pending['PRNT'] = (1 << 9);
ajax_pending['IZRL'] = (1 << 10);

var csv_obj = {};
csv_obj['VOO' ] = [];
csv_obj['QQQ' ] = [];
csv_obj['MOON'] = [];
csv_obj['ARKK'] = [];
csv_obj['ARKQ'] = [];
csv_obj['ARKW'] = [];
csv_obj['ARKG'] = [];
csv_obj['ARKF'] = [];
csv_obj['ARKX'] = [];
csv_obj['PRNT'] = [];
csv_obj['IZRL'] = [];

var stock_info = {};
stock_info['HKD'] = {};
stock_info['HKD']['symbol'] = 'HKD';
stock_info['HKD']['price'] = 1.0;
/*
// 'USD' should be ETF
stock_info['USD'] = {};
stock_info['USD']['symbol'] = 'USD';
stock_info['USD']['price'] = 1.0;
*/

function isAjaxDone(file_list) {
  let result = 0;
  for (let i = 0; i < file_list.length; i++) {
    result = result | ajax_pending[file_list[i]];
  }
  return (result == 0 && file_list.length > 0);
}

function onCompleteAjax(file_name) {
  ajax_pending[file_name] = 0;
}

/*
// Obsoleted
function getStockInfoJson(symbol, assetClass, callback) {
  if (typeof symbol === 'undefined' || symbol === '' ||
      typeof assetClass === 'undefined' || assetClass === '') {
    return;
  }
  symbol = symbol.toUpperCase();
  $.getJSON('https://api.allorigins.win/get?url=' +
            encodeURIComponent(`https://api.nasdaq.com/api/quote/${symbol}/info?assetclass=${assetClass}`), function (data) {
      let response = JSON.parse(data.contents);
      if (typeof response.status !== 'undefined' && response.status.rCode == 200) {
        let symbol = response.data.symbol.toUpperCase();
        stock_info[symbol] = {};
        stock_info[symbol]['symbol'] = symbol;
        stock_info[symbol]['company'] = response.data.companyName;
        stock_info[symbol]['price'] = parseFloat(response.data.primaryData.lastSalePrice.replace(/\$/g, ''));
        stock_info[symbol]['netChange'] = parseFloat(response.data.primaryData.netChange);
        stock_info[symbol]['percentageChange'] = parseFloat(response.data.primaryData.percentageChange.replace(/%/g, ''));
        stock_info[symbol]['volume'] = parseInt(response.data.keyStats.Volume.value.replace(/,/g, ''));
        callback();
      }
  });
}
*/

function getStockInfoJson(symbol, callback) {
  if (typeof symbol === 'undefined' || symbol === '') {
    return;
  }
  symbol = symbol.toUpperCase();
  $.getJSON('https://api.allorigins.win/get?url=' +
            encodeURIComponent(`https://query1.finance.yahoo.com/v8/finance/chart/${symbol}`), function (data) {
      let response = JSON.parse(data.contents);
      if (typeof response.chart !== 'undefined' && response.chart.error == null) {
        let symbol = response.chart.result[0].meta.symbol.toUpperCase();
        stock_info[symbol] = {};
        stock_info[symbol]['symbol'] = symbol;
        stock_info[symbol]['company'] = symbol;
        stock_info[symbol]['price'] = parseFloat(response.chart.result[0].meta.regularMarketPrice);
        stock_info[symbol]['netChange'] = parseFloat('0.0');
        stock_info[symbol]['percentageChange'] = parseFloat('0.0');
        stock_info[symbol]['volume'] = parseInt('0.0');
        callback();
      }
  });
}

function getVOOHtml(callback) {
  $.getJSON('https://api.allorigins.win/get?url=' +
            encodeURIComponent('https://www.slickcharts.com/sp500'), function (data) {
      let response = '';
      $(data.contents).find('div.table-responsive tr').each(function() {
        let tableData = $(this).find('th, td');
        if (tableData.length > 0) {
          tableData = tableData.map(function() { return ($(this).text().trim()); });
          tableData = Object.values(tableData);
          response = response + tableData.join() + '\n';
        }
      });
      csv_obj['VOO'] = $.csv.toObjects(response);
      if (csv_obj['VOO'].length > 0) {
        onCompleteAjax('VOO');
        callback();
      }
  });
}

function getQQQHtml(callback) {
  $.getJSON('https://api.allorigins.win/get?url=' +
            encodeURIComponent('https://www.slickcharts.com/nasdaq100'), function (data) {
      let response = '';
      $(data.contents).find('div.table-responsive tr').each(function() {
        let tableData = $(this).find('th, td');
        if (tableData.length > 0) {
          tableData = tableData.map(function() { return ($(this).text().trim()); });
          tableData = Object.values(tableData);
          response = response + tableData.join() + '\n';
        }
      });
      csv_obj['QQQ'] = $.csv.toObjects(response);
      if (csv_obj['QQQ'].length > 0) {
        onCompleteAjax('QQQ');
        callback();
      }
  });
}

function getMOONCsv(callback) {
  $.ajax({
    type: "GET",
    url: "https://api.allorigins.win/get?url=" +
         encodeURIComponent(
           "http://files.direxionfunds.com/DirexionWebsiteFiles/holdings_moon.csv?t=" + unixtimestampper15mins
         ),
    dataType: "json",
    cache: false,
    success: function(response)
    {
      response = response.contents;
      response = response.substring(response.indexOf("TradeDate,"));
      csv_obj['MOON'] = $.csv.toObjects(response);
      if (csv_obj['MOON'].length > 0) {
        onCompleteAjax('MOON');
        callback();
      }
    }
  });
}

function getARKKCsv(callback) {
  $.ajax({
    type: "GET",
    url: "https://api.allorigins.win/get?url=" +
         encodeURIComponent(
           domain[ajax_retry_times] + "ARK_INNOVATION_ETF_ARKK_HOLDINGS.csv?t=" + unixtimestampper15mins
         ),
    dataType: "json",
    //dataType: "text",
    //dataType: "jsonp",
    //jsonpCallback: callback,
    //crossDomain: true,
    cache: false,
    success: function(response)
    {
      response = response.contents;
      csv_obj['ARKK'] = $.csv.toObjects(response);
      if (csv_obj['ARKK'].length > 0) {
        onCompleteAjax('ARKK');
        callback();
      }
      // if no result
      else if (ajax_retry_times < ajax_retry_times_max) {
        ++ajax_retry_times;
        getARKKCsv(callback);
      }
    },
    error: function()
    {
      if (ajax_retry_times < ajax_retry_times_max) {
        ++ajax_retry_times;
        getARKKCsv(callback);
      }
    }
  });
}

function getARKQCsv(callback) {
  $.ajax({
    type: "GET",
    url: "https://api.allorigins.win/get?url=" +
         encodeURIComponent(
           domain[ajax_retry_times] + "ARK_INNOVATION_ETF_ARKQ_HOLDINGS.csv?t=" + unixtimestampper15mins
         ),
    dataType: "json",
    //dataType: "text",
    //dataType: "jsonp",
    //jsonpCallback: callback,
    //crossDomain: true,
    cache: false,
    success: function(response)
    {
      response = response.contents;
      csv_obj['ARKQ'] = $.csv.toObjects(response);
      if (csv_obj['ARKQ'].length > 0) {
        onCompleteAjax('ARKQ');
        callback();
      }
      // if no result
      else if (ajax_retry_times < ajax_retry_times_max) {
        ++ajax_retry_times;
        getARKQCsv(callback);
      }
    },
    error: function()
    {
      if (ajax_retry_times < ajax_retry_times_max) {
        ++ajax_retry_times;
        getARKQCsv(callback);
      }
    }
  });
}

function getARKWCsv(callback) {
  $.ajax({
    type: "GET",
    url: "https://api.allorigins.win/get?url=" +
         encodeURIComponent(
           domain[ajax_retry_times] + "ARK_INNOVATION_ETF_ARKW_HOLDINGS.csv?t=" + unixtimestampper15mins
         ),
    dataType: "json",
    //dataType: "text",
    //dataType: "jsonp",
    //jsonpCallback: callback,
    //crossDomain: true,
    cache: false,
    success: function(response)
    {
      response = response.contents;
      csv_obj['ARKW'] = $.csv.toObjects(response);
      if (csv_obj['ARKW'].length > 0) {
        onCompleteAjax('ARKW');
        callback();
      }
      // if no result
      else if (ajax_retry_times < ajax_retry_times_max) {
        ++ajax_retry_times;
        getARKWCsv(callback);
      }
    },
    error: function()
    {
      if (ajax_retry_times < ajax_retry_times_max) {
        ++ajax_retry_times;
        getARKWCsv(callback);
      }
    }
  });
}

function getARKGCsv(callback) {
  $.ajax({
    type: "GET",
    url: "https://api.allorigins.win/get?url=" +
         encodeURIComponent(
           domain[ajax_retry_times] + "ARK_INNOVATION_ETF_ARKG_HOLDINGS.csv?t=" + unixtimestampper15mins
         ),
    dataType: "json",
    //dataType: "text",
    //dataType: "jsonp",
    //jsonpCallback: callback,
    //crossDomain: true,
    cache: false,
    success: function(response)
    {
      response = response.contents;
      csv_obj['ARKG'] = $.csv.toObjects(response);
      if (csv_obj['ARKG'].length > 0) {
        onCompleteAjax('ARKG');
        callback();
      }
      // if no result
      else if (ajax_retry_times < ajax_retry_times_max) {
        ++ajax_retry_times;
        getARKGCsv(callback);
      }
    },
    error: function()
    {
      if (ajax_retry_times < ajax_retry_times_max) {
        ++ajax_retry_times;
        getARKGCsv(callback);
      }
    }
  });
}

function getARKFCsv(callback) {
  $.ajax({
    type: "GET",
    url: "https://api.allorigins.win/get?url=" +
         encodeURIComponent(
           domain[ajax_retry_times] + "ARK_INNOVATION_ETF_ARKF_HOLDINGS.csv?t=" + unixtimestampper15mins
         ),
    dataType: "json",
    //dataType: "text",
    //dataType: "jsonp",
    //jsonpCallback: callback,
    //crossDomain: true,
    cache: false,
    success: function(response)
    {
      response = response.contents;
      csv_obj['ARKF'] = $.csv.toObjects(response);
      if (csv_obj['ARKF'].length > 0) {
        onCompleteAjax('ARKF');
        callback();
      }
      // if no result
      else if (ajax_retry_times < ajax_retry_times_max) {
        ++ajax_retry_times;
        getARKFCsv(callback);
      }
    },
    error: function()
    {
      if (ajax_retry_times < ajax_retry_times_max) {
        ++ajax_retry_times;
        getARKFCsv(callback);
      }
    }
  });
}

function getARKXCsv(callback) {
  $.ajax({
    type: "GET",
    url: "https://api.allorigins.win/get?url=" +
         encodeURIComponent(
           domain[ajax_retry_times] + "ARK_INNOVATION_ETF_ARKX_HOLDINGS.csv?t=" + unixtimestampper15mins
         ),
    dataType: "json",
    //dataType: "text",
    //dataType: "jsonp",
    //jsonpCallback: callback,
    //crossDomain: true,
    cache: false,
    success: function(response)
    {
      response = response.contents;
      csv_obj['ARKX'] = $.csv.toObjects(response);
      if (csv_obj['ARKX'].length > 0) {
        onCompleteAjax('ARKX');
        callback();
      }
      // if no result
      else if (ajax_retry_times < ajax_retry_times_max) {
        ++ajax_retry_times;
        getARKXCsv(callback);
      }
    },
    error: function()
    {
      if (ajax_retry_times < ajax_retry_times_max) {
        ++ajax_retry_times;
        getARKXCsv(callback);
      }
    }
  });
}

function getPRNTCsv(callback) {
  $.ajax({
    type: "GET",
    url: "https://api.allorigins.win/get?url=" +
         encodeURIComponent(
           domain[ajax_retry_times] + "ARK_INNOVATION_ETF_PRNT_HOLDINGS.csv?t=" + unixtimestampper15mins
         ),
    dataType: "json",
    //dataType: "text",
    //dataType: "jsonp",
    //jsonpCallback: callback,
    //crossDomain: true,
    cache: false,
    success: function(response)
    {
      response = response.contents;
      csv_obj['PRNT'] = $.csv.toObjects(response);
      if (csv_obj['PRNT'].length > 0) {
        onCompleteAjax('PRNT');
        callback();
      }
      // if no result
      else if (ajax_retry_times < ajax_retry_times_max) {
        ++ajax_retry_times;
        getPRNTCsv(callback);
      }
    },
    error: function()
    {
      if (ajax_retry_times < ajax_retry_times_max) {
        ++ajax_retry_times;
        getPRNTCsv(callback);
      }
    }
  });
}

function getIZRLCsv(callback) {
  $.ajax({
    type: "GET",
    url: "https://api.allorigins.win/get?url=" +
         encodeURIComponent(
           domain[ajax_retry_times] + "ARK_INNOVATION_ETF_IZRL_HOLDINGS.csv?t=" + unixtimestampper15mins
         ),
    dataType: "json",
    //dataType: "text",
    //dataType: "jsonp",
    //jsonpCallback: callback,
    //crossDomain: true,
    cache: false,
    success: function(response)
    {
      response = response.contents;
      csv_obj['IZRL'] = $.csv.toObjects(response);
      if (csv_obj['IZRL'].length > 0) {
        onCompleteAjax('IZRL');
        callback();
      }
      // if no result
      else if (ajax_retry_times < ajax_retry_times_max) {
        ++ajax_retry_times;
        getIZRLCsv(callback);
      }
    },
    error: function()
    {
      if (ajax_retry_times < ajax_retry_times_max) {
        ++ajax_retry_times;
        getIZRLCsv(callback);
      }
    }
  });
}
