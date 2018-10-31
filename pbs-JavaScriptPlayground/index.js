////////////////////////////////////////////////////////////////////////////////
// Scripts to drive the PBS JavaScript Playground Interface                   //
////////////////////////////////////////////////////////////////////////////////

/*
Copyright 2016 Bart Busschots

This file is part of the Programming By Stealth JavaScript Playground.

The Programming By Stealth JavaScript Playground is free software: you can redistribute it and/or modify it under the terms of version 3 of the GNU General Public License as published by the Free Software Foundation.

The Programming By Stealth JavaScript Playground is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along withThe Programming By Stealth Positioning Playground. If not, see <http://www.gnu.org/licenses/>.
*/

//
// --- Global Variables ----------------------------------------------------- //
//

// the relative URL to the playground
var PLAGROUND_URL = 'playground.html';

//
// --- Initialization Code -------------------------------------------------- //
//
$(document).ready(function(){
  // add an event handler to the run button
  $('#run_btn').click(function(){
    // if the iFrame has no source, set it, otherwise reload it
    var $iframe =   $('#pbs_output_iframe');
    if($iframe.prop('src')){
      $iframe.get()[0].contentWindow.location.reload();
    }else{
      $iframe.prop('src', PLAGROUND_URL);
    }
  });

  // add a load hander to the iFrame to auto-size it
  //$('#pbs_output_iframe');
});

//
// --- Destructor Code ------------------------------------------------------ //
//
//$(window).unload(function(){
//});

//
// --- Helper Functions ----------------------------------------------------- //
//

//
// --- Validation Functions ------------------------------------------------- //
//
