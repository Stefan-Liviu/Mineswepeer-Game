// variables for table game
let table = [];
let rows = 16;
let cols = 16;

// bombs on table

let bombs = 40;
let positionBombs = [];

// check game
let gameOver = false;
let countClickedTile = 0;

//counter flags
let counterFlags = 0;

//time countert 
let startTime = false;
let time = setInterval(countTimer, 1000);
let countSeconds = 0;

function countTimer() {
    
    if (startTime == true) {
        ++countSeconds;
    let hour = Math.floor(countSeconds / 3600);
    let minute = Math.floor((countSeconds - hour * 3600) / 60);
    let seconds = countSeconds - (hour * 3600 + minute * 60);

    if (hour < 10) {
        hour = "0"+hour;
    }
    if (minute < 10) {
        minute = "0"+minute;
    }       
    if (seconds < 10) {
        seconds = "0"+seconds;
    }
    document.getElementById("timer").innerHTML = minute + ":" + seconds;
    }    
}

window.onload = function() {      
    
    for (let x = 0; x < rows; ++x) {
        let row =[];
        for (let y = 0; y < cols; ++y) {
            let tile = document.createElement("div");
            tile.id = x.toString() + "-" + y.toString();
            tile.addEventListener("click", leftClick);
            tile.addEventListener("contextmenu", rightClick);
            document.getElementById("gameBox").appendChild(tile);
            row.push(tile);
        }
        table.push(row);
    }
    console.log(table);
    addBombs();
}

//add flags on table
 function rightClick(e) { 
      
     let tile = this;

     if (tile.innerText == "") {
        tile.innerText = "🚩";
        ++counterFlags;
        document.getElementById("flagLeft").innerHTML = counterFlags;
     } else if (tile.innerText == "🚩") {
        tile.innerText ="";
        --counterFlags;
        document.getElementById("flagLeft").innerHTML = counterFlags;
     }
      e.preventDefault(); 
}


// add bombs on table
function addBombs() {

    let bombsLeft = bombs;

    while (bombsLeft > 0) {
        let x = Math.floor(Math.random() * rows);
        let y = Math.floor(Math.random() * cols);
        let id = x.toString() + "-" + y.toString();

        if (!positionBombs.includes(id)) {
            positionBombs.push(id);
            bombsLeft -= 1;
        }
    }
}

// click left to open tile
function leftClick() {
    startTime = true;
    
    if (gameOver || this.classList.contains("tileCliked")) {
        return;
    }

    let clickTile = this;
    if (positionBombs.includes(clickTile.id)) {
        gameOver = true;
        document.getElementById("message").innerText = "Game Lost!";
        document.getElementById("newGame").innerHTML ="&#128524";   
        clearInterval(time);
        showMines();
        return;
    }

    let position = clickTile.id.split("-");
    let x = parseInt(position[0]);
    let y = parseInt(position[1]);
    checkBomb(x, y);

}

// show mines on the table
function showMines() {
    for (let x = 0; x < rows; ++x) {
        for (let y = 0; y < cols; ++y) {
            let tile = table[x][y];
            if (positionBombs.includes(tile.id)) {
                tile.innerText ="💣";
                tile.style.backgroundColor = "grey";
            }
        }
    }
}

function checkBomb(x, y) {
    if (x < 0 || x >= rows || y < 0 || y >= cols) {
        return;
    }

    if (table[x][y].classList.contains("tileClicked")) {
        return;
    }
    table[x][y].classList.add("tileClicked");
    countClickedTile += 1;

    let bombsfind = 0;

    for (let i = x - 1; i <= x + 1; ++i) {
        for (let j = y - 1; j <= y + 1; ++j) {
            bombsfind += checkTile(i, j);
        }
    }

    if (bombsfind > 0) {
        table[x][y].innerText = bombsfind;
        table[x][y].classList.add("colorNumber" + bombsfind.toString());
    } else  {
        for (let i = x - 1; i <= x + 1; ++i) {
            for (let j = y - 1; j <= y + 1; ++j) {
                checkBomb(i, j);
            }
        }
    }

    if (countClickedTile == rows * cols - bombs) {
        document.getElementById("message").innerText = "Game Won!";
        clearInterval(time);
        gameOver = true;
     
    }
}

function checkTile(x, y) {
    if (x < 0 || x >= rows || y < 0 || y >= cols) {
        return 0;
    }
    if (positionBombs.includes(x.toString() + "-" + y.toString())) {
        return 1;
    }
    return 0;
}
