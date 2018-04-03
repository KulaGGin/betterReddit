var visited = null;
var url_array;

// Get the urls to check
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  
  url_array = request.url;
  
  // Process the urls
  processArray(sender.tab.id, url_array);
  
  // Send some random response
  sendResponse({found: 'panckaes'});
});

// Process the urls
function processArray(tab_id, url_array) {
  
  // Use jquery to make the history check syncron
  $.when(makeResponseArray(url_array)).done(function (history_urls) {
    
    // Send the response to the tab
    chrome.tabs.get(tab_id, function (tab) {
      chrome.tabs.sendMessage(tab.id, {history_urls: history_urls}, function (response) {});
    });
    
  });
  
}

// Go through an array of urls and check if they are in the history
function makeResponseArray(url_array) {
  
  var make_sync2 = new jQuery.Deferred();
  var response_array = [];
  
  console.log('Fetched ' + url_array.length + ' Urls, checking in history');
  
  for (i = 0; i != url_array.length; i++) {
    
    url = url_array[i];
    
    // If the url has no schema, it is a url to reddit
    if (url.indexOf("://") == -1) {
      url = 'http://www.reddit.com' + url;
    }
    
    // Check if the single url is in history
    // (Also jquery for sync)
    $.when(isInHistory(url)).done(function (status) {
      
      // Add the response to the array
      response = status.split('###');
      response_array.push(response);
      
      if (response_array.length == url_array.length) {
        // If we are done return the complete response
        make_sync2.resolve(response_array);
      }
      
    });
  }
  
  return make_sync2.promise();
  
}

// Check if a single url is in the history
function isInHistory(url) {
  
  var make_sync = new jQuery.Deferred();
  
  chrome.history.getVisits({url: url}, function (results) {
    
    if (typeof results != 'undefined' && results.length > 0) {
      // user visited the page
      make_sync.resolve(true + '###' + url);
    } else {
      // user didn't visit the page
      make_sync.resolve(false + '###' + url);
    }
    
  });
  
  return make_sync.promise();
}