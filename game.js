function Retry() {
    document.getElementById('dogGameEndCover').style.display = 'none';
    seconds = 30;
    end = false;
    points = 0;
    treats = [];
    Start();
}

function Start() {
    const clock = document.getElementById('clockTreat');
    const pizza = document.getElementById('pizzaTreat');
    const pepPizza = document.getElementById('peppizzaTreat');
    const dog = document.getElementById('playerLeft');
    const dogRight = document.getElementById('playerRight');

    document.getElementById('dogGameCover').remove();

    var context, controller, player;

    context = document.querySelector("canvas").getContext("2d");

    context.canvas.width = 500;
    context.canvas.height = 300;

    treats = [];
    seconds = 30;
    end = false;
    points = 0;
    setInterval(function(){
        seconds -= 1
    }, 1000)

    player = {
        height: 38,
        width: 62, 
        x: 250,
        xVelocity: 0,
        y: 200,
        spd: 0.25,
        image: dog,
    };

    function spawnTreat() {
        var treat = {
            height: 24,
            width: 24,
            x: Math.floor((Math.random() * 500) + 0),
            y: 0,
            gravity: 0.75,
            pickColor: Math.floor((Math.random() * 14) + 1),
            picture: pizza,
            pointAmount: 1,
            timeAmount: 0,
        }
        treats.push(treat);
    }

    controller = {
        left: false,
        right: false,
        keyListener:function(event) {
            var keyState = (event.type == "keydown")?true:false;

            switch(event.keyCode) {

                case 37:
                    controller.left = keyState;
                break;
                case 39:
                    controller.right = keyState;
                break;
            }

        }
    };

    spawnTreat()
    var spawnTimer = window.setInterval(spawnTreat,1000);
    loop = function() {
        
        if(controller.left) {
            player.xVelocity -= player.spd;
            player.image = dog;
        }
        
        if(controller.right) {
            player.xVelocity += player.spd;
            player.image = dogRight;
        }

        if(player.x <= 5) {
            player.x = 5;
        }
        else if(player.x >= 495 - player.width) {
            player.x = 495 - player.width;
        }

        player.x += player.xVelocity;
        player.xVelocity *= 0.9;

        context.fillStyle = "#87DFEB";
        context.fillRect(0,0,canvas.width,canvas.height);
        context.beginPath();
        context.drawImage(player.image,player.x,player.y,player.width,player.height);
        context.fill();
        context.beginPath();
        for(var i = 0; i < treats.length; i++) {
            var treat = treats[i];
            if (player.x - treat.width < treat.x && player.x + player.width > treat.x && player.y - treat.height / 2 < treat.y && player.y + player.height > treat.y)
            {
                treat.x = 1000;
                if(end == false) {
                    points += treat.pointAmount;
                    seconds += treat.timeAmount;
                }
            }
            treat.y += treat.gravity
            if(treat.pickColor == 1) {
                //3 Second Treat
                treat.timeAmount = 3;
                treat.pointAmount = 0;
                treat.picture = clock;
            }
            else if(treat.pickColor == 2){
                //2 Point Treat
                treat.pointAmount = 2;
                treat.timeAmount = 0;
                treat.picture = pepPizza;
            }
            else {
                //Default Treat
                treat.timeAmount = 0;
                treat.pointAmount = 1;
            }

            if(treat.x != 1000) {
                context.fillStyle = treat.color;
                context.drawImage(treat.picture,treat.x,treat.y,treat.width,treat.height);
                context.fill();
                context.beginPath();
            }

            document.getElementById('pointCounter').innerHTML = 'Points: ' + points;
            document.getElementById('timeCounter').innerHTML = 'Seconds Left: ' + seconds;
        }
        context.fillStyle = "#743E0C";
        context.fillRect(0,240,500,60);
        context.fillStyle = "#00FF00"
        context.fillRect(0,238,500,20);
        window.requestAnimationFrame(loop);

        if(seconds <= 0) {
            document.getElementById('dogGameEndCover').style.display = 'block';
            document.getElementById('endPointsText').innerHTML = "Score: " + points;
            end = true;
        }
    };

    window.addEventListener("keydown",controller.keyListener)
    window.addEventListener("keyup", controller.keyListener)
    window.requestAnimationFrame(loop);
}