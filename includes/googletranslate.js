// Google Translate for Weibo Extension
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
// @name           Google Translate for Sina Weibo
// @version        0.1
// @namespace      http://my.opera.com/richtr/weibo_extension
// @description    Modifies the Google Translate application for use in Weibo Translate For The World
// @include        http://translate.google.com/?weibo_translate*
// @include        https://translate.google.com/?weibo_translate*
// ==/UserScript==

// Changelog:

// v0.1 (2012-04-01)
// - Initial version

(function( window, undefined ) {
  
  var document = window.document;
  
  function hideElement(elId) {
    if(!elId) return;
    var el = document.getElementById(elId);
    if(el && el.style) {
      el.style.visibility = "hidden";
    } 
  }
  
  function getParameterByName(name)
  {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regexS = "[\\?&]" + name + "=([^&#]*)";
    var regex = new window.RegExp(regexS);
    var results = regex.exec(window.location.search);
    if(results == null)
      return "";
    else
      return window.decodeURIComponent(results[1].replace(/\+/g, " "));
  }
  
  // Extra check to ensure we should apply this script
  if(getParameterByName("weibo_translate")==="") return;
  
  // XHR wrapper
  var _XMLHTTPREQUEST_open = window.XMLHttpRequest.prototype.open;    

  // always rewrite outbound translate XHR to simplified chinese language
  window.XMLHttpRequest.prototype.open = function( method, url, async, user, pass ) {
    url = url.replace(new window.RegExp("(&|\\?)tl=[^\&]*"), "$1tl=zh-CN");
    _XMLHTTPREQUEST_open.call( this, method, url, async, user, pass );
  };
  
  function run() {

    // update app name
    var appName = document.getElementById("gt-appname");
    appName.textContent = "Translate to Chinese";
    appName.style.paddingRight = "40px";
    
    // hide language controls
    hideElement("gt-lang-swap");
    hideElement("gt-lang-tgt");
    hideElement("gt-lang-submit");
    hideElement("gt-tgt-lang-sugg");
    
    hideElement("gt-src-tools");
    hideElement("gt-res-tools");
    
    hideElement("gt-alpha");
    hideElement("tts_button");
    
    var tooltip = document.getElementById("select_document");
    if(tooltip) tooltip.textContent = "Type text above to translate to Chinese (Simplified)."
    
    var resultBox = document.getElementById("result_box");
    
    // Add 'post to weibo' button
    
    var submitBtn = document.createElement("div");
    submitBtn.setAttribute("class", "goog-inline-block goog-flat-menu-button je goog-flat-menu-button-hover goog-flat-menu-button-focused");
    submitBtn.setAttribute("aria-expanded", "false");
    submitBtn.setAttribute("aria-haspopup", "false");
    submitBtn.setAttribute("unselectable", "on");
    submitBtn.setAttribute("role", "button");
    submitBtn.setAttribute("tabindex", "0");
    
    submitBtn.style.margin = "5px";
    submitBtn.style.fontWeight = "bold";
    submitBtn.innerHTML = "Post to Weibo (and close this window) &raquo;";
    
    // on submit, post the translated message back to the callee    
    submitBtn.addEventListener("click", function() {
      
      opera.extension.postMessage({
       action: "deliverTransaction",
       elementId: getParameterByName("weibo_element_id"),
       translatedValue: resultBox.textContent
      });
      
      window.close();
      
    }, true);
    
    // Add 'cancel' button
    
    var cancelBtn = document.createElement("div");
    cancelBtn.setAttribute("class", "goog-inline-block goog-flat-menu-button je goog-flat-menu-button-hover goog-flat-menu-button-focused");
    cancelBtn.setAttribute("aria-expanded", "false");
    cancelBtn.setAttribute("aria-haspopup", "false");
    cancelBtn.setAttribute("unselectable", "on");
    cancelBtn.setAttribute("role", "button");
    cancelBtn.setAttribute("tabindex", "0");
    
    cancelBtn.style.margin = "5px";
    cancelBtn.style.fontWeight = "bold";
    cancelBtn.innerHTML = "&laquo; Discard input (and close this window)";
    
    cancelBtn.addEventListener("click", function() {
      
      window.close();
      
    }, true);
    
    // Append submit & cancel to document
    var appBar = document.getElementById("gt-src-c");
    
    if(appBar) { 
      appBar.appendChild(cancelBtn);
      appBar.appendChild(submitBtn);
    } else { 
      document.body.appendChild(cancelBtn);
      document.body.appendChild(submitBtn);
    }
  
  }
  
  window.addEventListener("load", run, true);
  
})( window );