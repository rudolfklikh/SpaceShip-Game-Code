const canvas = document.querySelector('#canvas'); // PlayGround
const ctx = canvas.getContext('2d'); // The dimension in which the game will be
const score = document.querySelector('#score');
const lost = document.querySelector('#lost');


const asteroidimg = new Image();
asteroidimg.src = 'img/astero.png';

const shipimg = new Image();
shipimg.src = 'img/ship01.png';

const fireimg = new Image();
fireimg.src = 'img/fire.png';

const boomimage = new Image();
boomimage.src = 'img/expl222.png';

const fonimg = new Image();
fonimg.src = 'img/fon.png';


let timer = 0; 
let count = 0;
let lostCount = 0;

let coordinate = [];
let shipCoordinate = { x: 300, y: 300 }; // Object with properties to render the ship
let fireCoordinate = []; 
let boomCoordinate = [];

boomimage.onload = function () { // When the background download is complete ,the game begins
    game();
}

/*
The main logic of the game,check on the keyCode depending on which arrow the user clicks,the object of the ship is modified,
and in particular its properties(coordinates) ,which will make it possible to draw it in another place ,
 if keyCode == 32 , then the array FireCoordinate is push 3 objects with properties : x Coordinate , Y coordinate , 
 the flight speed along the X and Y axis, respectively,all these objects will be drawn in the future
*/

document.addEventListener('keydown', (event) => {
    let code = event.keyCode;
    switch (code) {
        case 37:
            shipCoordinate.x = shipCoordinate.x - 15;

            if (shipCoordinate.x <= 0) {
                shipCoordinate.x = 0;
            } break;
        case 38:
            shipCoordinate.y = shipCoordinate.y - 15;

            if (shipCoordinate.y <= 0) {
                shipCoordinate.y = 0;
            } break;
        case 39:
            shipCoordinate.x = shipCoordinate.x + 15;

            if (shipCoordinate.x >= 550) {
                shipCoordinate.x = 550;
            } break;
        case 40:
            shipCoordinate.y = shipCoordinate.y + 15;

            if (shipCoordinate.y >= 570) {
                shipCoordinate.y = 570;
            } break;
        case 32:
            fireCoordinate.push({ x: shipCoordinate.x, y: shipCoordinate.y - 50, dx: 0, dy: -5 })
            fireCoordinate.push({ x: shipCoordinate.x + 50, y: shipCoordinate.y - 50, dx: 0, dy: -3 })
            fireCoordinate.push({ x: shipCoordinate.x - 50, y: shipCoordinate.y - 50, dx: 0, dy: -4 })
           
            break;
    }
});

// Using cross-browser solutions if the browser does not support this timer
const requestAnimationFrame = (function () { 
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (callback) {
            window.setTimeout(callback, 1000 / 20);
        };
})();
// Launch the game ,which first calls the updates,then the rendering calls itself recursively for cyclical repetition
function game() {
    update();
    render();
    requestAnimationFrame(game);
}


function update() {
    timer++;
    if (timer % 15 == 0) {  // If the conditions are triggered, an object with properties in the asteroid's coordinate array is pushed
        coordinate.push
            ({
                x: Math.random() * 550,
                y: -50,
                dx: Math.random() * 2 - 1,
                dy: Math.random() * 2 + 2,
                del: 0
            });
    }

    for (i in boomCoordinate) {
        boomCoordinate[i].animx = boomCoordinate[i].animx + 0.6;
        if (boomCoordinate[i].animx > 7) { // The logic of the sprite animation (the Animation of the explosion)
            boomCoordinate[i].animy++;
            boomCoordinate[i].animx = 0;
        }
        if (boomCoordinate[i].animy > 7) {
            boomCoordinate.splice(i, 1);
        }
    }
    for (i in fireCoordinate) { // The logic of the flight shot, adding each update,the shot is drawn with new coordinates
        fireCoordinate[i].x = fireCoordinate[i].x + fireCoordinate[i].dx;
        fireCoordinate[i].y = fireCoordinate[i].y + fireCoordinate[i].dy;
        if (fireCoordinate.y < 0) { // If the shot went outside,then there is the removal of the array ( memory )
            fireCoordinate.splice(i, 1);
        }
    }
    for (i in coordinate) { // The logic of the asteroid shot, adding each update,the shot is drawn with new coordinates
        coordinate[i].x = coordinate[i].x + coordinate[i].dx;
        coordinate[i].y = coordinate[i].y + coordinate[i].dy;

        if (coordinate[i].x >= 550 || coordinate[i].x < 0) {
            coordinate[i].dx = -coordinate[i].dx;
        }

        if (coordinate[i].y >= 600) {
            lostCount++;
            coordinate.splice(i, 1);
            lost.innerHTML = lostCount;
        }

        for (j in fireCoordinate) {
            // Check for hit in the asteroid,if there is a hit,then called the sprite ,which scrolls the animation, check the coordinates
            if (Math.abs(coordinate[i].x + 25 - fireCoordinate[j].x - 25) < 50 && Math.abs(coordinate[i].y - fireCoordinate[j].y) < 25) {
                boomCoordinate.push({ x: coordinate[i].x - 25, y: coordinate[i].y - 25, animx: 0, animy: 0 });
                coordinate[i].del = 1;
                break;
            }
        }
        if (coordinate[i].del == 1) {
            count++;
            coordinate.splice(i, 1);
            score.innerHTML = count;
        }
    }
}
function render() { // Render all of the elements of the game
    ctx.drawImage(fonimg, 0, 0, 600, 600);
    ctx.drawImage(shipimg, shipCoordinate.x, shipCoordinate.y);
    for (i in fireCoordinate) {
        ctx.drawImage(fireimg, fireCoordinate[i].x, fireCoordinate[i].y, 50, 50);
    }
    for (i in coordinate) {
        ctx.drawImage(asteroidimg, coordinate[i].x, coordinate[i].y, 50, 50);
    }
    for (i in boomCoordinate) {
        ctx.drawImage(boomimage, 128 * Math.floor(boomCoordinate[i].animx), 128 * Math.floor(boomCoordinate[i].animy), 128, 128, boomCoordinate[i].x, boomCoordinate[i].y, 100, 100);
    }
}

