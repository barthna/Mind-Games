function rand(max) {
    return Math.floor(Math.random() * max);
}

function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function changeBrightness(factor, sprite) {
    var virtCanvas = document.createElement("canvas");
    virtCanvas.width = 500;
    virtCanvas.height = 500;
    var context = virtCanvas.getContext("2d");
    context.drawImage(sprite, 0, 0, 500, 500);

    var imgData = context.getImageData(0, 0, 500, 500);

    for (let i = 0; i < imgData.data.length; i += 4) {
        imgData.data[i] = imgData.data[i] * factor;
        imgData.data[i + 1] = imgData.data[i + 1] * factor;
        imgData.data[i + 2] = imgData.data[i + 2] * factor;
    }
    context.putImageData(imgData, 0, 0);

    var spriteOutput = new Image();
    spriteOutput.src = virtCanvas.toDataURL();
    virtCanvas.remove();
    return spriteOutput;
}

function displayVictoryMess(moves) {
  // Store the current message HTML to restore later
  const messageHTML = document.getElementById("message").innerHTML;
  
  // Update the message content
  document.getElementById("message").innerHTML = `
      <h1>Congratulations!</h1>
      <p>You completed the maze in ${moves} moves!</p>
      <div class="difficulty-selector">
          <select id="victoryDiffSelect">
              <option value="10">Easy</option>
              <option value="15">Medium</option>
              <option value="25">Hard</option>
              <option value="38">Extreme</option>
          </select>
      </div>
      <div class="button-group">
          <input type="button" value="New Game" onclick="startNewGameFromVictory()">
      </div>
  `;
  
  // Set the current difficulty as selected
  document.getElementById("victoryDiffSelect").value = difficulty;
  
  toggleVisablity("Message-Container");
}


function toggleVisablity(id) {
    var element = document.getElementById(id);
    if (element.style.visibility == "visible") {
        element.style.visibility = "hidden";
    } else {
        element.style.visibility = "visible";
    }
}

// Maze generation functions
function Maze(Width, Height) {
    var mazeMap;
    var width = Width;
    var height = Height;
    var startCoord, endCoord;
    var dirs = ["n", "s", "e", "w"];
    var modDir = {
        n: { y: -1, x: 0, o: "s" },
        s: { y: 1, x: 0, o: "n" },
        e: { y: 0, x: 1, o: "w" },
        w: { y: 0, x: -1, o: "e" }
    };

    this.map = function() { return mazeMap; };
    this.startCoord = function() { return startCoord; };
    this.endCoord = function() { return endCoord; };

    function genMap() {
        mazeMap = new Array(height);
        for (y = 0; y < height; y++) {
            mazeMap[y] = new Array(width);
            for (x = 0; x < width; ++x) {
                mazeMap[y][x] = {
                    n: false, s: false, e: false, w: false,
                    visited: false, priorPos: null
                };
            }
        }
    }

    function defineMaze() {
        var isComp = false;
        var move = false;
        var cellsVisited = 1;
        var numLoops = 0;
        var maxLoops = 0;
        var pos = { x: 0, y: 0 };
        var numCells = width * height;
        
        while (!isComp) {
            move = false;
            mazeMap[pos.x][pos.y].visited = true;

            if (numLoops >= maxLoops) {
                shuffle(dirs);
                maxLoops = Math.round(rand(height / 8));
                numLoops = 0;
            }
            numLoops++;
            
            for (index = 0; index < dirs.length; index++) {
                var direction = dirs[index];
                var nx = pos.x + modDir[direction].x;
                var ny = pos.y + modDir[direction].y;

                if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                    if (!mazeMap[nx][ny].visited) {
                        mazeMap[pos.x][pos.y][direction] = true;
                        mazeMap[nx][ny][modDir[direction].o] = true;
                        mazeMap[nx][ny].priorPos = pos;
                        pos = { x: nx, y: ny };
                        cellsVisited++;
                        move = true;
                        break;
                    }
                }
            }

            if (!move) {
                pos = mazeMap[pos.x][pos.y].priorPos;
            }
            if (numCells == cellsVisited) {
                isComp = true;
            }
        }
    }

    function defineStartEnd() {
        switch (rand(4)) {
            case 0:
                startCoord = { x: 0, y: 0 };
                endCoord = { x: height - 1, y: width - 1 };
                break;
            case 1:
                startCoord = { x: 0, y: width - 1 };
                endCoord = { x: height - 1, y: 0 };
                break;
            case 2:
                startCoord = { x: height - 1, y: 0 };
                endCoord = { x: 0, y: width - 1 };
                break;
            case 3:
                startCoord = { x: height - 1, y: width - 1 };
                endCoord = { x: 0, y: 0 };
                break;
        }
    }

    genMap();
    defineStartEnd();
    defineMaze();
}

// Drawing functions
function DrawMaze(Maze, ctx, cellsize, endSprite = null) {
    var map = Maze.map();
    var cellSize = cellsize;
    var drawEndMethod;
    ctx.lineWidth = cellSize / 40;

    this.redrawMaze = function(size) {
        cellSize = size;
        ctx.lineWidth = cellSize / 50;
        drawMap();
        drawEndMethod();
    };

    function drawCell(xCord, yCord, cell) {
        var x = xCord * cellSize;
        var y = yCord * cellSize;

        if (cell.n == false) {
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x + cellSize, y);
            ctx.stroke();
        }
        if (cell.s === false) {
            ctx.beginPath();
            ctx.moveTo(x, y + cellSize);
            ctx.lineTo(x + cellSize, y + cellSize);
            ctx.stroke();
        }
        if (cell.e === false) {
            ctx.beginPath();
            ctx.moveTo(x + cellSize, y);
            ctx.lineTo(x + cellSize, y + cellSize);
            ctx.stroke();
        }
        if (cell.w === false) {
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x, y + cellSize);
            ctx.stroke();
        }
    }

    function drawMap() {
        for (x = 0; x < map.length; x++) {
            for (y = 0; y < map[x].length; y++) {
                drawCell(x, y, map[x][y]);
            }
        }
    }

    function drawEndFlag() {
        var coord = Maze.endCoord();
        var gridSize = 4;
        var fraction = cellSize / gridSize - 2;
        var colorSwap = true;
        for (let y = 0; y < gridSize; y++) {
            if (gridSize % 2 == 0) colorSwap = !colorSwap;
            for (let x = 0; x < gridSize; x++) {
                ctx.beginPath();
                ctx.rect(
                    coord.x * cellSize + x * fraction + 4.5,
                    coord.y * cellSize + y * fraction + 4.5,
                    fraction, fraction
                );
                ctx.fillStyle = colorSwap ? "rgba(0, 0, 0, 0.8)" : "rgba(255, 255, 255, 0.8)";
                ctx.fill();
                colorSwap = !colorSwap;
            }
        }
    }

    function drawEndSprite() {
        var offsetLeft = cellSize / 50;
        var offsetRight = cellSize / 25;
        var coord = Maze.endCoord();
        ctx.drawImage(
            endSprite, 0, 0, endSprite.width, endSprite.height,
            coord.x * cellSize + offsetLeft, coord.y * cellSize + offsetLeft,
            cellSize - offsetRight, cellSize - offsetRight
        );
    }

    function clear() {
        var canvasSize = cellSize * map.length;
        ctx.clearRect(0, 0, canvasSize, canvasSize);
    }

    drawEndMethod = endSprite != null ? drawEndSprite : drawEndFlag;
    clear();
    drawMap();
    drawEndMethod();
}

// Player functions
function Player(maze, c, _cellsize, onComplete, sprite = null) {
    var ctx = c.getContext("2d");
    var drawSprite = sprite != null ? drawSpriteImg : drawSpriteCircle;
    var moves = 0;
    var player = this;
    var map = maze.map();
    var cellCoords = { x: maze.startCoord().x, y: maze.startCoord().y };
    var cellSize = _cellsize;
    var halfCellSize = cellSize / 2;

    this.redrawPlayer = function(_cellsize) {
        cellSize = _cellsize;
        drawSpriteImg(cellCoords);
    };

    function drawSpriteCircle(coord) {
        ctx.beginPath();
        ctx.fillStyle = "#FFD700";
        ctx.arc(
            (coord.x + 1) * cellSize - halfCellSize,
            (coord.y + 1) * cellSize - halfCellSize,
            halfCellSize - 2, 0, 2 * Math.PI
        );
        ctx.fill();
        checkCompletion(coord);
    }

    function drawSpriteImg(coord) {
        var offsetLeft = cellSize / 50;
        var offsetRight = cellSize / 25;
        ctx.drawImage(
            sprite, 0, 0, sprite.width, sprite.height,
            coord.x * cellSize + offsetLeft, coord.y * cellSize + offsetLeft,
            cellSize - offsetRight, cellSize - offsetRight
        );
        checkCompletion(coord);
    }

    function checkCompletion(coord) {
        if (coord.x === maze.endCoord().x && coord.y === maze.endCoord().y) {
            onComplete(moves);
            player.unbindKeyDown();
        }
    }

    function removeSprite(coord) {
        var offsetLeft = cellSize / 50;
        var offsetRight = cellSize / 25;
        ctx.clearRect(
            coord.x * cellSize + offsetLeft,
            coord.y * cellSize + offsetLeft,
            cellSize - offsetRight,
            cellSize - offsetRight
        );
    }

    function check(e) {
        var cell = map[cellCoords.x][cellCoords.y];
        moves++;
        switch (e.keyCode) {
            case 65: case 37: // west
                if (cell.w) movePlayer(-1, 0); break;
            case 87: case 38: // north
                if (cell.n) movePlayer(0, -1); break;
            case 68: case 39: // east
                if (cell.e) movePlayer(1, 0); break;
            case 83: case 40: // south
                if (cell.s) movePlayer(0, 1); break;
        }
    }

    function movePlayer(xDiff, yDiff) {
        removeSprite(cellCoords);
        cellCoords = { x: cellCoords.x + xDiff, y: cellCoords.y + yDiff };
        drawSprite(cellCoords);
    }

    this.bindKeyDown = function() {
        window.addEventListener("keydown", check, false);
        $("#view").swipe({
            swipe: function(event, direction) {
                switch (direction) {
                    case "up": check({ keyCode: 38 }); break;
                    case "down": check({ keyCode: 40 }); break;
                    case "left": check({ keyCode: 37 }); break;
                    case "right": check({ keyCode: 39 }); break;
                }
            },
            threshold: 0
        });
    };

    this.unbindKeyDown = function() {
        window.removeEventListener("keydown", check, false);
        $("#view").swipe("destroy");
    };

    drawSprite(maze.startCoord());
    this.bindKeyDown();
}

// Game initialization
var mazeCanvas = document.getElementById("mazeCanvas");
var ctx = mazeCanvas.getContext("2d");
var sprite, finishSprite;
var maze, draw, player;
var cellSize, difficulty;

window.onload = function() {
    resizeCanvas();
    
    // Load sprites
    var spritesLoaded = 0;
    function checkSprites() {
        if (++spritesLoaded === 2) {
            document.getElementById("difficultyPopup").style.visibility = "visible";
        }
    }

    sprite = new Image();
    sprite.src = "https://raw.githubusercontent.com/TheCodeDepository/PickleRick-MazeGame/master/media/sprite.png";
    sprite.setAttribute("crossOrigin", " ");
    sprite.onload = function() {
        sprite = changeBrightness(1.2, sprite);
        checkSprites();
    };

    finishSprite = new Image();
    finishSprite.src = "https://raw.githubusercontent.com/TheCodeDepository/PickleRick-MazeGame/master/media/finishSprite.png";
    finishSprite.setAttribute("crossOrigin", " ");
    finishSprite.onload = function() {
        finishSprite = changeBrightness(1.1, finishSprite);
        checkSprites();
    };
};

window.onresize = function() {
    resizeCanvas();
    if (player) {
        cellSize = mazeCanvas.width / difficulty;
        draw.redrawMaze(cellSize);
        player.redrawPlayer(cellSize);
    }
};

function resizeCanvas() {
    let viewWidth = $("#view").width();
    let viewHeight = $("#view").height();
    if (viewHeight < viewWidth) {
        ctx.canvas.width = ctx.canvas.height = viewHeight - viewHeight / 100;
    } else {
        ctx.canvas.width = ctx.canvas.height = viewWidth - viewWidth / 100;
    }
}

function makeMaze() {
  if (player != undefined) {
      player.unbindKeyDown();
      player = null;
  }
  var e = document.getElementById("diffSelect");
  difficulty = e.options[e.selectedIndex].value;
  cellSize = mazeCanvas.width / difficulty;
  maze = new Maze(difficulty, difficulty);
  draw = new DrawMaze(maze, ctx, cellSize, finishSprite);
  player = new Player(maze, mazeCanvas, cellSize, displayVictoryMess, sprite);
  
  // Hide the difficulty popup
  document.getElementById("difficultyPopup").style.visibility = "hidden";
  
  // Show the maze
  if (document.getElementById("mazeContainer").style.opacity < "100") {
      document.getElementById("mazeContainer").style.opacity = "100";
  }
}

function startNewGameFromVictory() {
  // Get the selected difficulty from victory popup
  difficulty = document.getElementById("victoryDiffSelect").value;
  
  // Update the original difficulty selector to match
  document.getElementById("diffSelect").value = difficulty;
  
  makeMaze();
  toggleVisablity("Message-Container");
}