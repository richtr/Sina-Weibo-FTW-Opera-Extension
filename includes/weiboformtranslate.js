// Sina Weibo From Translate
// v0.1

// Copyright (C) 2012 by Rich Tibbett (rich.tibbett@gmail.com)

// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

// ==UserScript==
// @name           Sina Weibo Form Translate
// @version        0.1
// @namespace      http://my.opera.com/richtr/weibo_extension
// @description    Makes certain text input controls redirect to Google Translate from Sina Weibo
// @include        http://weibo.com/*
// @include        http://*.weibo.com/*
// ==/UserScript==

// Changelog:

// v0.1 (2012-04-01)
// - Initial version

(function(window, undefined) {
  
  var document = window.document;
  
  var transactions = {};
  
  window.addEventListener('click', function(event) {
    
    var el = event.target;
    
    if((el.tagName == "INPUT" && el.type == "text") || el.tagName == "TEXTAREA") {
      
      // create new transaction
      var transId = Math.floor(Math.random()*1E16);

      // register transaction locally
      transactions[transId] = el;
      
      // register transaction with background process
      opera.extension.postMessage({
        action: "registerTransaction",
        id: transId
      });
    
      // open translate
      window.open("http://translate.google.com/?weibo_translate&id=" + transId, "weiboTranslateWin");      
      
    }
    
  }, true);
  
  opera.extension.addEventListener('message', function(msg) {
    if(!msg.data || !msg.data.action) return;
    
    if(msg.data.action == "deliverTransaction") {
      
      if(transactions[msg.data.id]) {
        
        transactions[msg.data.id].value = msg.data.translatedValue;
        transactions[msg.data.id].focus();
        
        delete transactions[msg.data.id];
        
      }
      
    } 
    
  }, false);
  
})(window);