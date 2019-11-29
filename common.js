/* Copyright (C) 2014-2017 InBasic
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Home: http://add0n.com/bookmarks-manager.html
 * GitHub: https://github.com/inbasic/bookmarks-manager/
*/

'use strict';

chrome.omnibox.onInputEntered.addListener(function(text) {
  // Encode user input for special characters , / ? : @ & = + $ #
  // var newURL = 'https://www.google.com/search?q=' + encodeURIComponent(text);
  
  // /s?k=bag&ref=nb_sb_noss_2        :   Amazon

  var str_keywords = localStorage.getItem('ss_keywords');
  var keywords = JSON.parse(str_keywords);

  console.log("ss_search", text);

  var space_index = text.search(' ');

  // if there is only one keyword without space
  if (space_index == -1) {
      // if the text is the same as one of the keyword - list
      var flag = 0;
      for (var i = 0; i < keywords.length; i = i + 1) {
        if (keywords[i].Key == text) {
          var newURL = keywords[i].Site.substring(0, keywords[i].Site.substring(8).search('/') + 8);
          chrome.tabs.create({ url: newURL });
          flag = 1;
        }
      }

      // please change this content so it perfom search action using default search engine
      // if it doesn't matched in omnibox
      if (flag == 0) {
        var ss_engine = localStorage.getItem('ss_engine');
        var newURL = '';
        if (ss_engine == undefined) {
          newURL = 'https://www.google.com/search?hl=en&q=' + encodeURIComponent(text);
        } else {
          for (var i = 0; i < keywords.length; i = i + 1) {
            if ('ss_key_' + keywords[i].id == ss_engine) {
              newURL = keywords[i].Site.replace('%key%', encodeURIComponent(text));
            }
          }
        }        
        chrome.tabs.create({ url: newURL });
      }
  } else { // if there are at least 2 keyword, first can be space also
    var prefix, suffix;
    var flag = 0;
    prefix = text.substring(0, space_index);            

    for (var i = 0; i < keywords.length; i = i + 1) {
      if (keywords[i].Key == prefix) {
        suffix = text.substring(space_index);          
        var newURL = keywords[i].Site.replace('%key%', encodeURIComponent(suffix));
        chrome.tabs.create({ url: newURL });
        flag = 1;
      }
    }

    // please change this content so it perfom search action using default search engine
    // if it doesn't matched in omnibox
    if (flag == 0) {
      var newURL = 'https://www.google.com/search?hl=en&q=' + encodeURIComponent(text);
      chrome.tabs.create({ url: newURL });
    }
  }
});

chrome.runtime.onInstalled.addListener(function() {
  var str_keywords = localStorage.getItem('ss_keywords');
  var keywords = JSON.parse(str_keywords);
  if (keywords != undefined) {
    keywords.forEach(keyword => {
      chrome.contextMenus.create({
        id: "cm_" + keyword.id,
        title: keyword.Name,
        type: 'normal',
        contexts: ['selection']
      });
    });    
  }  
});

chrome.contextMenus.onClicked.addListener(function(item, tab) {
  var str_keywords = localStorage.getItem('ss_keywords');
  var keywords = JSON.parse(str_keywords);

  keywords.forEach(keyword => {
    if ("cm_" + keyword.id == item.menuItemId) {
      let url = keyword.Site.replace('%key%', item.selectionText);
      chrome.tabs.create({url: url, index: tab.index + 1});
    }
  });

  
});

window.addEventListener("storage", function () {
  chrome.contextMenus.removeAll();

  var str_keywords = localStorage.getItem('ss_keywords');
  var keywords = JSON.parse(str_keywords);
  keywords.forEach(keyword => {
    chrome.contextMenus.create({
      id: "cm_" + keyword.id,
      title: keyword.Name,
      type: 'normal',
      contexts: ['selection']
    });
  }); 
});