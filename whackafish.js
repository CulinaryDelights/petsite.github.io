var context = document.querySelector('canvas').getContext('2d');
context.canvas.width = 500;
context.canvas.height = 500;

var mouseDown = false;
var mouseX = 0;
var mouseY = 0;

var start = false;
var end = false;
var timer = 0;

var player = document.getElementById("gameChinchilla");
var hammer = document.getElementById("gameHammer");

var timeCounter = document.getElementById("whackPointCounter");
var cover = document.getElementById("whackGameCover");
var endCover = document.getElementById("whackGameEndCover");
var endText = document.getElementById("whackTimeText");

class Entity {
    constructor(position,size,color,tag,type) {
        this.position = position;
        this.size = size;
        this.color = color;
        this.tag = tag;
        this.type = type;
    }

    Start() {

    }

    Update() {

    }
}

function Start() {
    var controller = CheckArrayTag(entities,"moleController");
    controller.clearAll();
    timer = 0;
    cover.remove();
    endCover.style.display = 'none';
    start = true;
    end = false;
}

function RemoveEntity(entity) {
    entities.forEach(element => {
        if(element == entity) {
            entities.splice(CheckArrayEntity(entities,entity),1);
        }
    });
}

function AddEntity(entity) {
    entity.Start();
    entities.push(entity);
}

entities = [];

function GameUpdate(progress) {
    entities.forEach(element => {
        element.Update()
    });
}

function CollisionDetection(xPos,yPos,xWidth,yWidth,otherXPos,otherYPos,otherXWidth,otherYWidth) {
    if(xPos - otherXWidth < otherXPos && xPos + xWidth > otherXPos && yPos - otherYWidth < otherYPos && yPos + yWidth > otherYPos) {
        return true;
    }
    return false;
}

function CheckArrayTag(array,tag) {
    for(var i = 0; i < array.length; i++) {
        entity = array[i];
        if(entity.tag == tag) {
            return entity;
        }
    }
}

function CheckArrayEntity(array,entity) {
    for(var i = 0; i < array.length; i++) {
        entityOn = array[i];
        if(entityOn == entity) {
            return i;
        }
    }
}

function CheckArrayTags(array,tag) {
    entityList = [];

    for(var i = 0; i < array.length; i++) {
        entity = array[i];
        if(entity.tag == tag) {
            entityList.push(entity);
        }
    }
    return entityList;
}

function GameRender() {
    context.fillStyle = "saddlebrown";
    context.fillRect(0,0,canvas.width,canvas.height);   
    entities.forEach(element => {
        context.fillStyle = element.color;
        if(element.type == "rectangle") {
            context.fillRect(element.position.x,element.position.y, element.size.x, element.size.y);
        }
        else if(element.type == "ellipse") {
            context.beginPath();
            context.ellipse(element.position.x,element.position.y,element.size.x,element.size.y,0,0,Math.PI * 2,false);
            context.fill();
        }
        else if(element.type == "image") {
            context.drawImage(element.color,element.position.x,element.position.y,element.size.x,element.size.y);
        }
    });
}

class Vector2 {
    constructor(x,y) {
        this.x = x;
        this.y = y;
    }
}

class Mole extends Entity {
    constructor(position) {
        super(position);
        this.size = new Vector2(65,65);
        this.ogColor = "#352315";
        this.color = this.ogColor;

        this.tag = "Mole";
        this.type = "ellipse";
        this.controller = entities[1];

        this.waitTime = 40;
        this.wait = this.waitTime;
        this.collided = false;
        this.added = null;
    }

    Start() {

    }
    
    Update() {
        this.controller = CheckArrayTag(entities,"moleController");

        if(CollisionDetection(this.position.x - this.size.x / 1.25,this.position.y - this.size.y / 1.25,this.size.x * 1.75,this.size.y * 1.75,mouseX,mouseY,0,0) && mouseDown && this.wait <= this.waitTime - 1) {
            this.wait = -this.waitTime * 1.5;
            this.collided = true;
        }
        
        if(this.wait == this.waitTime || this.wait == this.waitTime - 1) {
            this.changeColorBack();
        }

        if(this.wait == 0) {
            this.changeColor();
        }

        if(this.wait <= -this.waitTime * 1.5 && this.collided) {
            this.changeColorBack();
            this.wait = this.waitTime;
            this.controller.changeHole();
            this.collided = false;
        }
        
        if(this.wait <= -this.waitTime * 1.5 && !this.collided) {
            start = false;
            end = true;
        }
    }

    changeColor() {
        this.added = new MoleImage(new Vector2(this.position.x - this.size.x / 1.5,this.position.y - this.size.y / 1.5));
        AddEntity(this.added);
    }

    changeColorBack() {
        RemoveEntity(this.added);
    }
}

class MoleImage extends Entity {
    constructor(position) {
        super(position);
        this.size = new Vector2(100,100);
        
        this.color = player;
        this.tag = "moleImage";
        this.type = "image";
    }

    Update() {
        
    }
}

AddEntity(new Mole(new Vector2(250,100)));
AddEntity(new Mole(new Vector2(400,100)));
AddEntity(new Mole(new Vector2(100,100)));
AddEntity(new Mole(new Vector2(250,250)));
AddEntity(new Mole(new Vector2(400,250)));
AddEntity(new Mole(new Vector2(100,250)));
AddEntity(new Mole(new Vector2(250,400)));
AddEntity(new Mole(new Vector2(400,400)));
AddEntity(new Mole(new Vector2(100,400)));

class Controller extends Entity {
    constructor(position) {
        super(position)
        this.size = new Vector2(0,0);
        this.color = "rgba(0,0,0,0)";
        this.tag = "moleController";
        this.type = "rectangle";

        this.holeArray = CheckArrayTags(entities,"Mole");
        this.minMaxHoleAmount = [1,2]
        this.holeAmount = Math.floor((Math.random() * (this.minMaxHoleAmount[1] - this.minMaxHoleAmount[0] + 1)) + 1);
        this.holesChosen = [];

        this.moleImages = CheckArrayTags(entities,"moleImage");
    }

    Start() {
        this.changeHole();
    }

    Update() {
        this.holesChosen.forEach(element => {
            element.wait--;
        });
    }

    changeHole() {
        this.holeAmount = Math.floor((Math.random() * 2) + 1);
        this.holesChosen = [];
        for(var i = 0; i < this.holeAmount; i++) {
            this.holesChosen.push(this.holeArray[Math.floor(Math.random() * this.holeArray.length)])
        }
    }

    clearAll() {
        this.holeArray.forEach(element => {
            element.wait = element.waitTime;
            element.changeColorBack();
        });
    }
}

window.setInterval(function() {
    if(start) {
        timer += 1;  
    }
}, 1000);

AddEntity(new Controller(new Vector2(0,0)));

function loop(timestamp) {
    var progress = timestamp - lastRender;

    if(start) {
        GameRender();
        GameUpdate(progress);
    }

    if(end) {
        endCover.style.display = 'block';
        endText.innerHTML = "Seconds: " + timer;
    }

    canvas.addEventListener('mousedown', e => {
        mouseDown = true;
    });

    canvas.addEventListener('mouseup', e => {
        mouseDown = false;
    });
    
    canvas.addEventListener('mousemove', e => {
        mouseX = e.offsetX;
        mouseY = e.offsetY;
    });

    if(mouseDown) {
        context.drawImage(hammer,mouseX - 50,mouseY - 50,100,100);
    }

    timeCounter.innerHTML = "Seconds: " + timer;

    lastRender = timestamp;
    window.requestAnimationFrame(loop);
}
var lastRender = 0;
window.requestAnimationFrame(loop);