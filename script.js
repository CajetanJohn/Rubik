// Define colors and pieces
var colors = ['blue', 'green', 'white', 'yellow', 'orange', 'red'];
var pieces = document.getElementsByClassName('piece');

// Initialize variables
var moves = loadFromLocalStorage()? loadFromLocalStorage(): [];
var startTime = 0;
alert(moves)

// Function to scramble the cube
function scrambleCube() {
  var scrambleMoves = [
    { face: 0, cw: 1 }, { face: 0, cw: 0 }, { face: 1, cw: 1 }, { face: 1, cw: 0 },
    { face: 2, cw: 1 }, { face: 2, cw: 0 }, { face: 3, cw: 1 }, { face: 3, cw: 0 },
    { face: 4, cw: 1 }, { face: 4, cw: 0 }, { face: 5, cw: 1 }, { face: 5, cw: 0 }
  ];
  var i = 0;
  
  // Set an interval for scrambling the cube
  var scrambleInterval = setInterval(function() {
    if (i < 20) {
      var randomMove = scrambleMoves[Math.floor(Math.random() * scrambleMoves.length)];
      recordMove(randomMove); // Record the move
      animateRotation(randomMove.face, randomMove.cw, Date.now()); // Animate the rotation
      i++;
      
    } else {
      startTime = Date.now();
      clearInterval(scrambleInterval); // Stop the interval when done
    }
  }, 250); // Interval between rotations
}



// Function to calculate piece mapping
function mx(i, j) {
  return ([2, 4, 3, 5][j % 4 | 0] + i % 2 * ((j | 0) % 4 * 2 + 3) + 2 * (i / 2 | 0)) % 6;
}

// Function to get rotation axis
function getAxis(face) {
  return String.fromCharCode('X'.charCodeAt(0) + face / 2);
}

// Function to assemble the cube
function assembleCube() {
  function moveto(face) {
    id = id + (1 << face);
    pieces[i].children[face].appendChild(document.createElement('div'))
      .setAttribute('class', 'sticker ' + colors[face]);
    return 'translate' + getAxis(face) + '(' + (face % 2 * 4 - 2) + 'em)';
  }

  for (var id, x, i = 0; id = 0, i < 26; i++) {
    x = mx(i, i % 18);
    pieces[i].style.transform = 'rotateX(0deg)' + moveto(i % 6) +
      (i > 5 ? moveto(x) + (i > 17 ? moveto(mx(x, x + 2)) : '') : '');
    pieces[i].setAttribute('id', 'piece' + id);
  }
}

// Function to get a piece by its face, index, and corner
function getPieceBy(face, index, corner) {
  return document.getElementById('piece' +
    ((1 << face) + (1 << mx(face, index)) + (1 << mx(face, index + 1)) * corner));
}

// Function to swap pieces' stickers
function swapPieces(face, times) {
  for (var i = 0; i < 6 * times; i++) {
    var piece1 = getPieceBy(face, i / 2, i % 2),
      piece2 = getPieceBy(face, i / 2 + 1, i % 2);
    for (var j = 0; j < 5; j++) {
      var sticker1 = piece1.children[j < 4 ? mx(face, j) : face].firstChild,
        sticker2 = piece2.children[j < 4 ? mx(face, j + 1) : face].firstChild,
        className = sticker1 ? sticker1.className : '';
      if (className) {
        sticker1.className = sticker2.className;
        sticker2.className = className;
      }
    }
  }
}

// Function to animate rotation
function animateRotation(face, cw, currentTime) {
  var k = 0.3 * (face % 2 * 2 - 1) * (2 * cw - 1),
    qubes = Array(9).fill(pieces[face]).map(function(value, index) {
      return index ? getPieceBy(face, index / 2, index % 2) : value;
    });

  (function rotatePieces() {
    var passed = Date.now() - currentTime,
      style = 'rotate' + getAxis(face) + '(' + k * passed * (passed < 300) + 'deg)';
    qubes.forEach(function(piece) {
      piece.style.transform = piece.style.transform.replace(/rotate.\(\S+\)/, style);
    });

    if (passed >= 300) {
      swapPieces(face, 3 - 2 * cw);
    } else {
      requestAnimationFrame(rotatePieces);
    }
  })();
}

function mousedown(md_e) {
    var startXY = pivot.style.transform.match(/-?\d+\.?\d*/g).map(Number),
        element = md_e.target.closest('.element'),
        face = [].indexOf.call((element || cube).parentNode.children, element);

    function mousemove(mm_e) {
        if (element) {
            var gid = /\d/.exec(document.elementFromPoint(mm_e.pageX, mm_e.pageY).id);
            if (gid && gid.input.includes('anchor')) {
                mouseup();
                var e = element.parentNode.children[mx(face, Number(gid) + 3)].hasChildNodes();
                animateRotation(mx(face, Number(gid) + 1 + 2 * e), e, Date.now());
                recordMove({ face: mx(face, Number(gid) + 1 + 2 * e), cw: e, timestamp: Date.now() });
            }
        } else pivot.style.transform =
            'rotateY(' + (startXY[0] - (mm_e.pageY - md_e.pageY) / 2) + 'deg)' +
            'rotateX(' + (startXY[1] + (mm_e.pageX - md_e.pageX) / 2) + 'deg)';
    }

    function mouseup() {
        document.body.appendChild(guide);
        scene.removeEventListener('mousemove', mousemove);
        document.removeEventListener('mouseup', mouseup);
        scene.addEventListener('mousedown', mousedown);
    }

    (element || document.body).appendChild(guide);
    scene.addEventListener('mousemove', mousemove);
    document.addEventListener('mouseup', mouseup);
    scene.removeEventListener('mousedown', mousedown);
}

function touchstart(ts_e) {
    var startXY = pivot.style.transform.match(/-?\d+\.?\d*/g).map(Number),
        element = ts_e.target.closest('.element'),
        face = [].indexOf.call((element || cube).parentNode.children, element);

    function touchmove(tm_e) {
              if (element) {
            var gid = /\d/.exec(document.elementFromPoint(tm_e.touches[0].pageX, tm_e.touches[0].pageY).id);
            if (gid && gid.input.includes('anchor')) {
                touchend();
                var e = element.parentNode.children[mx(face, Number(gid) + 3)].hasChildNodes();
                animateRotation(mx(face, Number(gid) + 1 + 2 * e), e, Date.now());
                recordMove({ face: mx(face, Number(gid) + 1 + 2 * e), cw: e, timestamp: Date.now() });
            }
        } else pivot.style.transform =
            'rotateX(' + (startXY[0] - (tm_e.touches[0].pageY - ts_e.touches[0].pageY) / 2) + 'deg)' +
            'rotateY(' + (startXY[1] + (tm_e.touches[0].pageX - ts_e.touches[0].pageX) / 2) + 'deg)';
    }

    function touchend() {
        document.body.appendChild(guide);
        scene.removeEventListener('touchmove', touchmove);
        scene.removeEventListener('touchend', touchend);
        scene.addEventListener('touchstart', touchstart);
    }

    (element || document.body).appendChild(guide);
    scene.addEventListener('touchmove', touchmove);
    scene.addEventListener('touchend', touchend);
    scene.removeEventListener('touchstart', touchstart);
}

document.ondragstart = function () {
    return false;
};

window.addEventListener('load', assembleCube);
scene.addEventListener('mousedown', mousedown);
scene.addEventListener('touchstart', touchstart);


// Function to record player's moves
function recordMove(move) {
  moves.push({ face: move.face, cw: move.cw ? 1 : 0 });
  updateMovesDisplay();
  saveToLocalStorage();
}

//function to updatemovesdisplay
function updateMovesDisplay(savedData) {
    var movesDisplay = document.getElementById('movesDisplay');
    movesDisplay.textContent = moves.map(function(move) {
        return move.face + (move.cw ? "A" : "C");
    }).join(" ");
}


// Function to reverse player's moves and solve the cube
function reverseMoves() {
  var reversedMoves = moves.slice().reverse();
  var i = 0;
  
  // Set an interval to animate solving
  var solveInterval = setInterval(function() {
    if (i < reversedMoves.length) {
      var move = reversedMoves[i];
      var face = move.face;
      var cw = move.cw === 1 ? 0 : 1; // Swap direction
      animateRotation(face, cw, Date.now());
      i++;
    } else {
      clearInterval(solveInterval);
      moves = [];
      updateMovesDisplay();
      localStorage.clear("cube_data");
    }
  }, 300);
}

//function to update the timer in dom

function updateTimerDisplay() {
    var currentTime = startTime ? Date.now() - startTime : 0;

    var timeUnits = [
        { divisor: 604800000, label: 'week' },
        { divisor: 86400000, label: 'day' },
        { divisor: 3600000, label: 'hour' },
        { divisor: 60000, label: 'minute' },
        { divisor: 1000, label: 'second' },
        { divisor: 1, label: 'millisecond' }
    ];

    var displayText = '';
    for (var i = 0; i < timeUnits.length; i++) {
        var unit = timeUnits[i];
        var count = Math.floor(currentTime / unit.divisor);
        currentTime %= unit.divisor;

        if (count > 0) {
            var label = unit.label;
            if (count > 1) {
                label += 's';
            }
            displayText += count + ' ' + label + ' ';
        }
    }

    timeDisplay.textContent = displayText.trim();
}

// Set an interval to update timer display
var timerInterval = setInterval(updateTimerDisplay, 1);

// Function to save data to local storage
function saveToLocalStorage() {
  var savedData = {
    moves: moves,
    startTime: startTime
  };
  localStorage.setItem('cube_data', JSON.stringify(savedData));
}

// Function to load data from local storage
function loadFromLocalStorage() {
  var savedData = localStorage.getItem('cube_data');
  var derivedMoves = [];

  if (savedData) {
    savedData = JSON.parse(savedData);
    moves = savedData.moves;
    startTime = savedData.startTime;
    updateMovesDisplay(savedData);
    return moves;
  } else {
    alert("No saved data found. Starting a new game.");
    return null;
  }
}

// Call the loadFromLocalStorage function to load data on page load
loadFromLocalStorage();

// Call the loadFromLocalStorage function to load data on page load

function updateFromSave() {
  var i = 0; var animateInterval = setInterval(function() { if (i < moves.length) { var move = moves[i]; animateRotation(move.face, move.cw, Date.now()); i++; } else {
    clearInterval(animateInterval); } 
  }, 200);
  // Interval between rotations 
}
// Call the function to animate the cube from loaded moves
updateFromSave();
