////////////////////////////////////////////////////////////////////////////////
// Scripts to drive the PBS 8 Box Positioning Playground                      //
////////////////////////////////////////////////////////////////////////////////

/*
Copyright 2016 Bart Busschots

This file is part of the Programming By Stealth CSS Positioning Playground.

The Programming By Stealth CSS Positioning Playground. is free software: you can
redistribute it and/or modify it under the terms of version 3 of the GNU General
Public  License as published by the Free Software Foundation.

The Programming By Stealth CSS Positioning Playground is distributed in the hope
that it will be useful, but WITHOUT ANY WARRANTY; without even the implied
warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
General Public License for more details.

You should have received a copy of the GNU General Public License along with
The Programming By Stealth Positioning Playground.  If not, see
<http://www.gnu.org/licenses/>.
*/

//
// --- Global Variables ------------------------------------------------------//
//

// a reference to the popup window containing the boxes being manipulated
var playground = null; // will be populated when the start button is clicked
var numBoxes = 5; // the number of boxes to play with
var boxDimensions = [ // the dimensions to add text boxes for
  'width',
  'height',
  'min-width',
  'min-height',
  'top',
  'right',
  'bottom',
  'left',
  'margin-top',
  'margin-right',
  'margin-bottom',
  'margin-left',
  'z-index'
];

//
// --- Initialisation Code ---------------------------------------------------//
//
$(document).ready(function(){
    // add the event handler to the start button
    $('#start_btn').click(function(){
      playground = window.open('playground.html', '_blank', 'location=no,menubar=no,resizable=yes,toolbar=no,scrollbars=yes,width=500');
    });
});

//
// --- Destructor Code -------------------------------------------------------//
//
$(window).unload(function(){
  if(playground){
    playground.close();
  }
});

//
// --- Helper Functions ------------------------------------------------------//
//

// -- Function --
// Purpose    : Initialise the control panel region
// Returns    : VOID
// Arguments  : NONE
// Throws     :
// Notes      : This function cannot be executed until the popup window has
//              loaded
// See Also   :
function initControlPanel(){
  // get a reference to the form container
  var $container = $('#box_controls_container');

  // empty the container
  $container.empty();

  // build the forms for controlling the boxes and add them to the control panel
  for(var i = 1; i <= numBoxes; i++){
    $container.append(generateBoxController(i));
  }

  // load in the current values
  renderCurrentBoxStates();

  // show the control panel, and hide the init instructions
  $('#initiailiser').hide(250);
  $('#main_interface').show(250);
}

// -- Function --
// Purpose    : Generate a set of controlls for a box
// Returns    : A reference to the generated fieldset as a JQuery object
// Arguments  : 1) the index of the box (an integer between 1 and 4)
// Throws     : An error if passed invalid arguments
// Notes      :
// See Also   :
function generateBoxController(bi){
  // make sure we got a valid index
  var boxIndex = parseInt(bi);
  if(boxIndex < 1 || boxIndex > numBoxes){
    throw new Error("Invalid Box Index - must be and integer between 1 and 4 (inclusive))");
  }

  // get a reference for the box being controlled (for use in event handlers and data attributes)
  var $box = $('#box' + boxIndex, playground.document);

  // start with a blank fieldset, and add a caption
  var $ctl = $('<fieldset />').attr('id', 'box' + boxIndex + '_controller').addClass('controller');
  $ctl.append($('<legend />').text('Box ' + boxIndex));

  // add the controlls for the box
  var $position = $('<select />').attr('id', 'box' + boxIndex + '_position');
  $position.append($('<option />').val('static').text('static'));
  $position.append($('<option />').val('fixed').text('fixed'));
  $position.append($('<option />').val('absolute').text('absolute'));
  $position.append($('<option />').val('relative').text('relative'));
  $position.addClass('property_controller');
  $position.data('box', $box);
  $position.data('property', 'position');
  $position.change(function(){
    var $pos = $(this);
    $pos.data('box').css('position', $pos.val());
    renderCurrentBoxStates();
  });
  $ctl.append($('<label />').text('position:').append($position));
  boxDimensions.forEach(function(d){
    // build the input
    var $dimension = $('<input />').attr('type', 'text').attr('size', 6).attr('autocomplete', 'off');
    $dimension.attr('id', 'box' + boxIndex + '_' + d);
    $dimension.addClass('property_controller');
    $dimension.data('box', $box);
    $dimension.data('property', d);

    // build the save button
    var $saveBtn = $('<img />').attr('src', 'contrib/icon_save.png').attr('alt', 'Apply').attr('title', 'Apply');
    $saveBtn.attr('id', 'box' + boxIndex + '_' + d + '_save');
    $saveBtn.addClass('property_save_btn');

    // attach event handlers
    $dimension.keyup(function(){
      var $dim = $(this);

      // see if the current value matches the value in the actual CSS property
      if($dim.val() == $dim.data('box').css($dim.data('property'))){
        // the value is as saved, so remove all styles and hide the save button
        $dim.removeClass('valid').removeClass('invalid');
        $saveBtn.hide(250);
      }else{
        // the value in the text box is not the same as the value in the DOM
        // validate it before deciding what to do
        if(isValidCSSDimension($dim.val())){
          // is valid, so show in green and show the save button
          $dim.removeClass('invalid').addClass('valid');
          $saveBtn.show(250);
        }else{
          // is not valid, show in red and hide the save button
          $dim.addClass('invalid').removeClass('valid');
          $saveBtn.hide(250);
        }
      }
    });
    $dimension.change(function(){
      var $dim = $(this);
      var dimVal = $dim.val();
      if(isValidCSSDimension(dimVal) && $dim.data('box').css($dim.data('property')) != dimVal){
        // replace the blank string with auto
        if(dimVal == ''){
          dimVal = 'auto';
        }
        $dim.data('box').css($dim.data('property'), dimVal);
        renderCurrentBoxStates();
      }
    });
    $saveBtn.click(function(){
      $dimension.change();
    });

    // append to the control panel inside an appropriate label
    $ctl.append($('<label />').text(d + ':').append($dimension).append($saveBtn.hide()));
  });

  // return the controller
  return $ctl;
}

// -- Function --
// Purpose    : update the rendering of the state of the boxes from the DOM
// Returns    : VOID
// Arguments  : NONE
// Throws     : NOTHING
// Notes      :
// See Also   :
function renderCurrentBoxStates(){
  $('.property_controller', $('#controls')).each(function(){
    var $prop = $(this);
    $prop.val($prop.data('box').css($prop.data('property'))).keyup();
  });
}

// -- Function --
// Purpose    : Reset the interface
// Returns    : VOID
// Arguments  : NONE
// Throws     : NOTHING
// Notes      :
// See Also   :
function resetInterface(){
  // hide the control panel and show the initiailiser
  $('#main_interface').hide(250);
  $('#initiailiser').show(250);
}

//
// --- Validation Functions --------------------------------------------------//
//

// -- Function --
// Purpose    : Determine if a value is valid for a CSS dimension
// Returns    : true if the value is a valid CSS dimension, false otherwise
// Arguments  : 1) the value to test
// Throws     : NOTHING
// Notes      : Valid value are percentages, pixel values, and em values, e.g.
//              35%, 45px, and 3.5em
// See Also   :
function isValidCSSDimension(d){
  // convert the passed argument to a string to be sure regexes work
  var dim = String(d);

  // allow empty string and auto
  if(dim == '' || dim == 'auto'){
    return true;
  }

  // see if we are a valid pixel value
  if(dim.match(/^\d+px$/)){
    return true;
  }

  // see if we are a valid percentage value
  if(dim.match(/^\d+([.]\d+)?[%]$/)){
    return true;
  }

  // see of we are a valid em value
  if(dim.match(/^\d+([.]\d+)?em$/)){
    return true;
  }

  // if we got here we are not valid, so return false
  return false;
}
