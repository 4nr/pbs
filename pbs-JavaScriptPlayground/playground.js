////////////////////////////////////////////////////////////////////////////////
// Scripts to drive the Execute window of the PBS JavaScript Playground       //
////////////////////////////////////////////////////////////////////////////////

/*
Copyright 2016 Bart Busschots

This file is part of the Programming By Stealth JavaScript Playground.

The Programming By Stealth JavaScript Playground is free software: you can redistribute it and/or modify it under the terms of version 3 of the GNU General Public License as published by the Free Software Foundation.

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
var pbs = {}; // will become the PBS namespace

//
// --- Define the PBS namespace --------------------------------------------- //
//
(function(window, pbs, $, undefined) {
  // -- Encapsulated Variables
  var $output;
  var codeEditor;
  var ANI_TIME = 250;

  // -- Function --
  // Purpose    : Initialize the interface
  // Returns    : VOID
  // Arguments  : 1) The code editor to read from
  //              2) the JQuery object to append output to
  // Throws     : NOTHING
  // Notes      :
  // See Also   :
  function init(ce, $out){
    // save the initialization variables
    if(isCodeMirrorObj(ce)){
      codeEditor = ce;
    }else{
      console.log(ce);
      throw new Error('first argument to pbs.init() not a CodeMirror object');
    }
    if(isJQueryObj($out)){
      $output =  $out;
    }else{
      throw new Error('second argument to pbs.init() not a JQuery object');
    }
  }

  // -- Function --
  // Purpose    : Add output to the output area
  // Returns    : VOID
  // Arguments  : 1) the data to print
  // Throws     : NOTHING
  // Notes      :
  // See Also   :
  function say(s){
  	if(typeof s === 'undefined'){
  		s = String(s);
  	}
    if(s === ''){ // make sure an empty string creates a blank line
      s = ' ';
    }
    $output.append($('<pre />').text(s));
  }

  // -- Function --
  // Purpose    : Execute current code in the code editor
  // Returns    : VOID
  // Arguments  : NONE
  // Throws     : NOTHING
  // Notes      :
  // See Also   :
  function exec(c){
    // blank the output region
    $output.empty();

    // get the new code to execute
    var c = '';
    try{
      c = codeEditor.getValue();
    }catch(err){
      sayError('System Error - failed to read code from parent window');
      throw err;
    }

    // make sure we actually got some code to execute
    if(c == ''){
      sayError('No Code to Execute!');
      return;
    }

    // try to execute the code
    try{
      eval(c);
    }catch(err){
      console.log(err);
      sayError(err.toString());
    }

    // resize the iFrame to fit the output
    //parent.$('#pbs_output_iframe').css('height', document.body.scrollHeight);
    parent.$('#pbs_output_iframe').css('height', ($('body').outerHeight() + 30) + 'px');
  }

  // -- Function --
  // Purpose    : get the value of the given input
  // Returns    : undefined if the input is empty, or a string
  // Arguments  : 1) the number of the input (1 to 3 inclusive)
  // Throws     : An error on invalid args
  // Notes      :
  // See Also   :
  function input(n){
    // make sure n is Valid
    if(!String(n).match(/^[1-3]$/)){
      throw new Error('invalid arguments - pbs.input() requires one argument - 1, 2, or 3');
    }

    var rawVal = parent.$('#pbs_input_' + n).val();
    if(rawVal.length){
      return rawVal;
    }
    return undefined;
  }

  // -- Function --
  // Purpose    : get all set input values as an array
  // Arguments  : NONE
  // Throws     : NOTHING
  // Notes      :
  // See Also   :
  function inputs(){
    var ans = [];
    [1, 2, 3].forEach(function(n){
      var val = input(n);
      if(typeof val !== 'undefined'){
        ans.push(val);
      }
    });
    return ans;
  }

  // -- Function --
  // Purpose    : Show an error message
  // Returns    : VOID
  // Arguments  : 1) the error message to render
  // Throws     : NOTHING
  // Notes      :
  // See Also   :
  function sayError(s){
    $output.append($('<pre />').text(s).addClass('error'));
  }

  // -- Function --
  // Purpose    : check if a given variable is a CodeMirror object
  // Returns    : true or false
  // Arguments  : 1) the value to test
  // Throws     : NOTHING
  // Notes      :
  // See Also   :
  function isCodeMirrorObj(o){
    return o instanceof parent.CodeMirror ? true : false;
  }

  // -- Function --
  // Purpose    : check if a given variable is a JQuery object
  // Returns    : true or false
  // Arguments  : 1) the value to test
  // Throws     : NOTHING
  // Notes      :
  // See Also   :
  function isJQueryObj(o){
    return o instanceof jQuery ? true : false;
  }

  // exports
  pbs.init = init;
  pbs.say = say;
  pbs.input = input;
  pbs.inputs = inputs;
  pbs.exec = exec;
})(window, pbs, $);

//
// --- Initialization Code -------------------------------------------------- //
//
$(document).ready(function(){
  // init the PBS object
  pbs.init(parent.codeEditor, $('#pbs_output'));

  // add an event handler to the close button
  $('#close_btn').click(function(){
    window.close();
  });

  // execute the code
  pbs.exec();
});
