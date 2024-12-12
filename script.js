var Obj = function(x, y) {
    this.x = x;
    this.y = y;
    this.moving = {
        left: false,
        right: false,
        up: false,
        down: false
    };
};

Obj.prototype.rysuj = function() {
    var objHtml = '<img src="vyvu.png">';
    this.objElement = $(objHtml);

    this.objElement.css({
        position: "absolute",
        left: this.x,
        top: this.y,
        height: "12%",
        width: "4%",
    });

    $("body").append(this.objElement);
};

Obj.prototype.wPrawo = function() {
    if (this.x + this.objElement.width() + 15 <= $(window).width()) {
        this.x += 15;
        this.objElement.css({ left: this.x, top: this.y });
    }
};

Obj.prototype.wLewo = function() {
    if (this.x - 15 >= 0) {
        this.x -= 15;
        this.objElement.css({ left: this.x, top: this.y });
    }
};

Obj.prototype.wGore = function() {
    if (this.y - 15 >= 0) {
        this.y -= 15;
        this.objElement.css({ left: this.x, top: this.y });
    }
};

Obj.prototype.wDol = function() {
    if (this.y + this.objElement.height() + 15 <= $(window).height()) {
        this.y += 15;
        this.objElement.css({ left: this.x, top: this.y });
    }
};

var keysPressed = {};

$(document).keydown(function(event) {
    keysPressed[event.which] = true;
    if (keysPressed[37]) fiat.moving.left = true; 
    if (keysPressed[38]) fiat.moving.up = true;
    if (keysPressed[39]) fiat.moving.right = true; 
    if (keysPressed[40]) fiat.moving.down = true; 

    event.preventDefault(); 
});

$(document).keyup(function(event) {
    delete keysPressed[event.which];

    if (event.which === 37) fiat.moving.left = false;
    if (event.which === 38) fiat.moving.up = false;
    if (event.which === 39) fiat.moving.right = false;
    if (event.which === 40) fiat.moving.down = false;
});

var Obj2 = function(x, y) {
    this.x = x;
    this.y = y;
    this.speed = 6;
    this.directionY = -1;
};

Obj2.prototype.rysuj = function() {
    var objHtml = '<img src="file.png">';
    this.objElement = $(objHtml);

    this.objElement.css({
        position: "absolute",
        left: this.x,
        top: this.y,
        width: "10%",
        height: "40%",
    });

    $("body").append(this.objElement);
};

Obj2.prototype.moveToTarget = function() {
    this.y += this.speed * this.directionY;

    if (this.y <= 0) {
        this.directionY = 1;
        this.y = 0;
    } else if (this.y + this.objElement.height() >= $(window).height()) {
        this.directionY = -1;
        this.y = $(window).height() - this.objElement.height();
    }

    this.objElement.css({ left: this.x, top: this.y });
};

function checkCollision(obj1, obj2) {
    var rect1 = obj1.objElement[0].getBoundingClientRect();
    var rect2 = obj2.objElement[0].getBoundingClientRect();

    return rect1.right > rect2.left && rect1.left < rect2.right &&
        rect1.bottom > rect2.top && rect1.top < rect2.bottom;
}

function showGameOver() {
    var gameOverText = $("<div>").text("Przegrałeś!").css({
        position: "absolute",
        top: "10%",
        left: "10%",
        fontSize: "60px",
        color: "black",
        fontWeight: "bold",
        zIndex: 1000
    });
    $("body").append(gameOverText);

    setTimeout(function() {
        gameOverText.remove();
        resetGame();
    }, 3000);
}

function resetGame() {
    fiat.x = 200;
    fiat.y = 200;
    audi.x = 810;
    audi.y = 980;

    fiat.objElement.css({ left: fiat.x, top: fiat.y });
    audi.objElement.css({ left: audi.x, top: audi.y });

    isGameOver = false;
}

var isGameOver = false;

function updateMovement() {
    if (isGameOver) return;

    if (fiat.moving.left) fiat.wLewo();
    if (fiat.moving.right) fiat.wPrawo();
    if (fiat.moving.up) fiat.wGore();
    if (fiat.moving.down) fiat.wDol();

    audi.moveToTarget();

    if (checkCollision(fiat, audi)) {
        isGameOver = true;
        showGameOver();
    }
}

function gameLoop() {
    updateMovement();
    requestAnimationFrame(gameLoop);
}

var fiat = new Obj(200, 200);
var audi = new Obj2(810, 980);

fiat.rysuj();
audi.rysuj();

gameLoop();
