////////////////////////////////////////////////////////////////////////////////
// Scripts to drive the PBS JavaScript Playground Interface                   //
////////////////////////////////////////////////////////////////////////////////

/*
Copyright 2016 Bart Busschots

This file is part of the Programming By Stealth JavaScript Playground.

The Programming By Stealth JavaScript Playground is free software: you can
redistribute it and/or modify it under the terms of version 3 of the GNU General
Public License as published by the Free Software Foundation.

The Programming By Stealth JavaScript Playground is distributed in the hope
that it will be useful, but WITHOUT ANY WARRANTY; without even the implied
warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
General Public License for more details.

You should have received a copy of the GNU General Public License along with
The Programming By Stealth Positioning Playground. If not, see
<http://www.gnu.org/licenses/>.
*/

//
// --- Global Variables ----------------------------------------------------- //
//

var PLAYGROUND = null; // will be populated when the start button is clicked

//
// --- Initialization Code -------------------------------------------------- //
//
$(document).ready(function(){
  // add an event handler to the run button
  $('#run_btn').click(function(){
    // if an output window exists, run the code, if not, create one
    if(PLAYGROUND){
      PLAYGROUND.focus();
      PLAYGROUND.pbs.exec();
    }else{
      PLAYGROUND = window.open('playground.html', '_blank', 'location=no,menubar=no,resizable=yes,toolbar=no,scrollbars=yes,width=500');
    }
  });
});

//
// --- Destructor Code ------------------------------------------------------ //
//
$(window).unload(function(){
  if(PLAYGROUND){
    PLAYGROUND.close();
  }
});

//
// --- Helper Functions ----------------------------------------------------- //
//

//
// --- Validation Functions ------------------------------------------------- //
//
