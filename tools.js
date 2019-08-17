// Sort objects with name and price.
// Eg object:
// var objs = [
//     { first_nom: 'Lazslo', last_nom: 'Jamf'     },
//     { first_nom: 'Pig',    last_nom: 'Bodine'   },
//     { first_nom: 'Pirate', last_nom: 'Prentice' }
// ];

var platform = {};

platform.compare = function ( a, b ) {
  if ( a.last_nom < b.last_nom ){
    return -1;
  }
  if ( a.last_nom > b.last_nom ){
    return 1;
  }
  return 0;
};

module.exports = platform;  
