// Load the final image
var explode = new Image();
explode.src = 'assets/explode.gif';
var money = new Image();
money.src = 'assets/money.gif';
var reaper = new Image();
reaper.src = 'assets/reaper.gif';

// Function defs
var randomIntPair = function(low, high) {
  return {
    x: low + Math.floor(high * Math.random()), 
    y: low + Math.floor(high * Math.random())
  }
}
var key = function(x,y) { return '(' + x + ',' + y + ')' }

function Game(gridSize, numberOfBombs) {
  this.gridSize = gridSize;
  this.numberOfBombs = numberOfBombs;
  this.cells = {}
  this.bombCells = [];
  this.getCell = function(point) {
    return this.cells[key(point.x, point.y)]
  }

  this.build = function() {
    //Add cells
    for (var i = 1; i <= this.gridSize; i++) {
      for (var j = 1; j <= this.gridSize; j++) {
        this.cells[key(i,j)] = new Cell(i,j)
      }
    }
    //Get neighbor cells
    for (var i = 1; i <= this.gridSize; i++) {
      for (var j = 1; j <= this.gridSize; j++) {
        this.cells[key(i,j)].getNeighbors()
      }
    }
    this.bombsPlaced = false;    
    return true
  }

  this.placeBombs = function(cell) {
    var disAllowed = [cell.location]
    for (var n in cell.neighbors) {
      disAllowed.push(cell.neighbors[n].location);
    }
    for (var k = 0; k < this.numberOfBombs; k++) {
      coordinate = randomIntPair(1, game.gridSize);
      while ($.inArray(coordinate, disAllowed) > -1) {
        coordinate = randomIntPair(1, game.gridSize);
      }
      disAllowed.push(coordinate);
      var cell = this.getCell(coordinate)
      cell.setBomb();
      this.bombCells.push(cell);
    }
    this.bombsPlaced = true;
  }

  this.reconfigure = function(gridSize, numberOfBombs) {
    this.gridSize = gridSize;
    this.numberOfBombs = numberOfBombs;
  }
  
  this.template = function() { return '<table></table>' }

  this.sweepCells = function(cell) {
    if (cell.revealed) return
    cell.revealed = true

    // If any neighbors have bombs we're done
    if (cell.neighboringBomb) return

    //Look in neighboring cells
    for (var n in cell.neighbors) {
      this.sweepCells(cell.neighbors[n])
    }
  }
}

function Point(x,y) {
  this.x = x;
  this.y = y;
}

function Cell(x,y) {
  this.x = x;
  this.y = y;
  this.location = {x: this.x, y: this.y}
  this.has_bomb = false;
  this.revealed = false;
  this.neighboringBomb = false;
  this.numberOfNeighborBombs = function() {
    k = 0;
    for (var n in this.neighbors) {
      if (this.neighbors[n].has_bomb) k = k + 1
    }
    return k
  }

  this.neighbors = []

  this.getNeighbors =  function() {
    for (var i = this.x - 1; i <= this.x + 1; i++) {
      if ( i < 1 || i > game.gridSize) continue;  //Continue of out of grid bounds
      for (var j = this.y - 1; j <= this.y + 1; j++) {
        if ( j < 1 || j > game.gridSize || (this.x == i && this.y == j)) continue; //out of bounds and bomb itself
        this.neighbors.push(game.getCell({x:i, y:j}))
      }
    }
  }

  this.setBomb = function() {
    this.has_bomb = true;
    for (var n in this.neighbors) {
      this.neighbors[n].neighboringBomb = true;
    }     
  }
  this.template =  function() { return "    <td data-x='" + this.x + "' data-y='" + this.y + "'></td>" }
}       
    
function $Display() {
  this.flagCount = game.numberOfBombs;
  this.template = {
    winner:   "<h1 class='win'>YOU WIN!<br>Get a hazardous duty bonus.<br><img src='assets/money.gif'></h1>",
    boom:     "<h1 class='lose-boom'>KA-BOOM!<br>You've been vaporized.<br><img src='assets/explode.gif'></h1>",
    timesUp:  "<h1 class='times-up'>TIME'S UP!<br>Funeral arrangements have been made.<br><img src='assets/reaper.gif'></h1>"
  }
  this.build = function(game) {
    $('.time').text($('input#time').val());   
    $('td').animate({'width': '0px', 'height': '0px'});
    $('#stats .flags').empty();
    for (var k = 0; k < game.numberOfBombs; k++) {
      $('#stats .flags').append(FLAG_TEMPLATE);
    }
    $('#gameboard').fadeOut(function() {
      $('#gameboard').empty();
      $('#gameboard').append($(game.template()));
      var $layout = $('#gameboard').children().last();
    
      // Each row
      for (var j = 1; j <= GRID_SIZE; j++) {
        $layout.append('<tr></tr>');
        $row = $layout.children().last().children().last();
      
        // Each column
        for (var i = 1; i <= GRID_SIZE; i++) {
          $row.append(game.cells[key(i,j)].template());
        }
      }
      $('#gameboard').fadeIn();
      $('td').animate({'width': '30px', 'height': '30px'});
    });
  }
  this.getCellObject = function(cell) {
    return $("td[data-x='" + cell.x + "'][data-y='" + cell.y + "']")
  }
  
  this.getCell = function($td) {
    var point = $td.data();
    return game.getCell(point);
  }
  
  this.toggleBombs = function() {
    $("td[data-bomb='bomb']").toggleClass('show-bomb');
  }
  
  this.showAllCells = function() {
    $('td').removeClass('flagged')
    $("td[data-bomb='true']").addClass('show-bomb');
    $('td').addClass('revealed')
    $('td').text($(this).data('bomb-count'));
  }
  
  this.showCell = function($td) {
    var bombCount = this.getCell($td).numberOfNeighborBombs();
    $td.addClass("revealed");
    if ($td.data('bomb')) {
      $td.removeClass().addClass('show-bomb');
    } else if ( bombCount > 0 ) {
      $td.text(bombCount);
    }
  }
  
  this.clicked = function($clicked) {
    cell = this.getCell($clicked)
    if (!game.bombsPlaced) {
      game.placeBombs(cell);
      this.update();
    } 
    if (cell.has_bomb) this.endGame($clicked);  // End it if a bomb is clicked on
    game.sweepCells(cell);
    this.update();
  }
  
  this.toggleFlag = function($td) {
    if ($td.hasClass('flagged')) {
      $td.removeClass('flagged');
      this.flagCount = this.flagCount + 1;
      $('#stats .flags').append(FLAG_TEMPLATE);
    } else if (this.flagCount > 0) {
      $td.addClass('flagged');
      this.flagCount = this.flagCount - 1;
      $('#stats .flags').children().last().remove();
    }
  }
    
  this.endGame = function(arg) {
    if (typeof arg == 'object') {
      arg.addClass('show-bomb loser');
      $('#result .message').html(this.template.boom);
    } else {
      $('#result .message').html(this.template[arg]);
    }    
    $('#result').modal({ backdrop: false })
    timer.stop();
    this.showAllCells();
  }
  
  this.update = function() {
    for (var c in game.cells) {
      var cell = game.cells[c]
      if (cell.revealed) {
        $td = this.getCellObject(cell)
        $td.addClass('revealed');
        numBombs = cell.numberOfNeighborBombs()
        if ( numBombs > 0 ) $td.text(numBombs);
      }
      if (cell.has_bomb) {
        $td = this.getCellObject(cell)
        $td.attr('data-bomb', true);
      }
    }
  }
};


/*******  Start building the game ********/
FLAG_TEMPLATE     = "<span class='flag'><img src='assets/flag.png'/></span>";  
GRID_SIZE         = 10;
var numberOfBombs = 10;

var timer 
var game = new Game(GRID_SIZE, numberOfBombs);
game.build()

$(function() {
  
  // Timer defined inside jQuery for display updates
  function Timer(startValue) {
    this.startValue = parseInt(startValue) || 0;
    this.running = false;
    this.mode = (startValue == 0) ? 'countUp' : 'countDown';
    this.start = function() {
      this.running = true;
      var count = count || this.startValue
      var mode = this.mode
      this.timer = setInterval(function() {
        if (mode == 'countUp') {
          count = count + 1;
        } else {
          count = count - 1;
          if (count == 0) {
            this.stop();
            $display.endGame('timesUp');
          }
        }
        $('#stats .time').text(count);
      }, 1000);
    }
    this.stop = function() { clearInterval(this.timer) }
  }
  
  timer = new Timer($('#time').val());
  
  var $display = new $Display();
  $display.build(game)

  // START GAME
  // Handle a click
  $('#gameboard').on('click', 'td', function(e) {
    if (!timer.running) timer.start()
    if ($(this).data('bomb')) $display.endGame($(this))
    $display.clicked($(this));
    
    // See if the game has been won (nothing but bomb cells left to show)
    winner = true
    for (var c in game.cells) {
      winner = winner && game.cells[c].has_bomb || game.cells[c].revealed
      if (!winner) break;
    }
    if (winner) $display.endGame('winner');
  });

  // Handle a right click (setting a flag for possible bomb)
  $('#gameboard').on('contextmenu','td', function(e) {
    e.preventDefault();
    $display.toggleFlag($(this));
    
    // See if the game has been won (all bombs flagged correctly)
    if (game.bombsPlaced) {
      var winner = true;
      for (var c in game.bombCells) {
        winner = winner && $display.getCellObject(game.bombCells[c]).hasClass('flagged');
        if (!winner) break;
      }
      if (winner) $display.endGame('winner');
    }
  });
  
  
  // Rebuild game
  $('form').on('click', '#rebuild', function(e) {
    e.preventDefault();
    GRID_SIZE         = $('#grid-size').val();
    var numberOfBombs = $('#bombs').val();
    timer.stop()
    timer             = new Timer($('#time').val());
    $('#stats .time').text($('#time').val());
    game.reconfigure(GRID_SIZE, numberOfBombs);
    game.build()
    $display.build(game)
  });
  
  $('#result').on('show.bs.modal', function() {
    $('.modal-body', this).css({'height': 'auto', 'max-height': '100%' });
  });
});
