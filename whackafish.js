var context = document.querySelector('canvas').getContext('2d');
context.canvas.width = 500;
context.canvas.height = 300;

class Entity {
    constructor(position,size,color) {
        this.position = position;
        this.size = size;
        this.color = color;
    }

    Start() {

    }

    Update() {

    }
}

function RemoveEntity(entity) {
    entities.forEach(element => {
        if(element == entity) {
            entities.filter()
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

function GameRender() {
    context.fillStyle = "#202020";
    context.fillRect(0,0,canvas.width,canvas.height);   
    entities.forEach(element => {
        context.fillStyle = element.color;
        context.fillRect(element.position.x,element.position.y, element.size.x, element.size.y);
    });
}

class Vector2 {
    constructor(x,y) {
        this.x = x;
        this.y = y;
    }
}

class Player extends Entity {
    constructor(position, waitTime) {
        super(position);
        this.size = new Vector2(100,100);
        this.color = "#8F30A2";
        this.waitTime = 100;
        this.wait = this.waitTime;
    }

    Start() {
        setTimeout(function () {
            this.color = "black";
            console.log('hello');
        }, 1000)
    }
    
    Update() {
        this.wait--;

        if (this.wait <= 0) {
            this.color = "black"
            this.wait = this.waitTime;
        }
    }
}

AddEntity(new Player(new Vector2(100,100), 100))

function loop(timestamp) {
    var progress = timestamp - lastRender;

    GameUpdate(progress);
    GameRender();

    lastRender = timestamp;
    window.requestAnimationFrame(loop);
}
var lastRender = 0;
window.requestAnimationFrame(loop);