// Add ui elements
var tabmenu = $('.tabmenu');
tabmenu.prepend('<li><a href="#" id="reddit_show_visited">Show hidden</li>');
tabmenu.prepend('<li><a href="#" id="reddit_hide_visited">Hide visited</li>');

$('#reddit_show_visited').click(function () {
  $('#reddit_show_visited').html('Show hidden (0)');
  $('a.title').parent().parent().parent().parent().show();
});

$('#reddit_hide_visited').click(function () {
  // Get all title urls
  var url_array = [];
  $('a.title').each(function () {
    url_array.push($(this).attr('href'));
  });
  
  // Send the title urls to the background script
  chrome.runtime.sendMessage({ url: url_array }, function (response) { });
});

// Wait till the background script answers
chrome.runtime.onMessage.addListener(function hideVisited(request, sender, sendResponse) {
  hidden = 0;
  
  // Process all urls
  for (i = 0; i != request.history_urls.length; i++) {
    
    visited = request.history_urls[i][0];
    url = request.history_urls[i][1];
    
    // replace reddit urls, since we added that in the background script
    url = url.replace('http://www.reddit.com', '');
    
    // hide url if the user visited it
    if (visited == "true") {
      $('a.title[href="' + url + '"]').parent().parent().parent().parent().hide();
      hidden++;
    }
    
  }
  
  // Update hidden counter
  $('#reddit_show_visited').html('Show hidden (' + hidden.toString() + ')')
  
});