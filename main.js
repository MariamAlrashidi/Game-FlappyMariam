        // Inital game from phaser library
var game = new Phaser.Game(890, 400, Phaser.AUTO, 'FlappyMariam');

var FlappyMariam = {
    preload: function() {  
        // set color for background
        game.stage.backgroundColor = '#fcf4fa';
        // Load image
        game.load.image('mariam', 'images/mariam.png'); 
        game.load.image('candy', 'images/candy.png');  
        // Load audio
        game.load.audio('jump', 'sounds/jump.mp3');  
        game.load.audio('blop', 'sounds/blop.mp3');  
        game.load.audio('jab', 'sounds/jab.mp3');  
    },

    create: function() {  
        // Arcade Physics related collision, overlap and motion 
        game.physics.startSystem(Phaser.Physics.ARCADE);
        // Add the main character 
        this.mariam = this.game.add.sprite(100, 245, 'mariam');
        // Set the position of character 
        this.mariam.anchor.setTo(-0.2, 0.5); 
        // Enable phisics to the character 
        game.physics.arcade.enable(this.mariam);
        // Set the gravity value to 1000 
        this.mariam.body.gravity.y = 1000;  
        // Create a space key
        var spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        // If submit SPACE then start JUMP function
        spaceKey.onDown.add(this.jump, this);  
        // Create a group to candys
        this.candys = game.add.group(); 
        // Enable body to game object
        this.candys.enableBody = true; 
        // Create multiple candies
        this.candys.createMultiple(20, 'candy');
        // Create candies every 1.5 seconds
        this.timer = game.time.events.loop(1500, this.addRowOfcandys, this);  
        this.score = 0;  
        this.level = 1;  
        this.goal = 5;  
        this.speed = 400;  
        // Set a text label score: 0
        this.labelScore = game.add.text(20, 20, "Score: 0", { font: "20px Tahoma", fill: "#f287cd" });
        // Set a text label level: 0
        this.labelLevel = game.add.text(20, 50, "Level: 1", { font: "20px Tahoma", fill: "#da6db4" });  
    },

    update: function() {  
         // Charactel angel movement
        if (this.mariam.angle < 20){
            this.mariam.angle += 1;
        }
         // if character dead then restart the game
        if (this.mariam.inWorld == false){
            this.restartGame();
        }
        // If you don't require separation then use #overlap instead.
        game.physics.arcade.overlap(this.mariam, this.candys, this.hitcandy, null, this);  
    },

    jump: function() {  
            // when die return the start
        if (this.mariam.alive == false){
            return;
        }
        // Jump function with play jump sound and start animation
           this.mariam.body.velocity.y = -300; 
        var animation = game.add.tween(this.mariam);
        //when jumping the character angle changes
        animation.to({angle: -20}, 100);
        animation.start();  
        game.sound.play('jump');
    },

    restartGame: function() {  
                // Restart game
        game.state.start('FlappyMariam');
    },
    
    addOnecandy: function(x, y) {  
        // Add one candy 
    var candy = this.candys.getFirstDead();
    candy.reset(x, y);
    candy.body.velocity.x = -this.speed; 
    candy.checkWorldBounds = true;
    candy.outOfBoundsKill = true;
    },
    
    addRowOfcandys: function() {  
                // Add multiple candy as row  
    var hole = Math.floor(Math.random() * 5) + 1;
    for (var i = 0; i < 8; i++)
        if (i != hole && i != hole + 1) 
            this.addOnecandy(850, i * 60 + 10);   
            // Increase a score
    this.score += 1;  
    if(this.score > 1){
                        // Play sound if pass candies 
    game.sound.play('blop');
    }
    this.labelScore.text = "Score: " + this.score;  
    if(this.score >= this.goal){
        // Increase level and speed every level passed 
    this.level += 1;  
    this.goal += 5;
    this.speed += 100;
    this.labelLevel.text = "Level: " + this.level;  
    }
    if(this.score >= 15){
        // If score more than 15 then win 
        alert("You win, congrats");
        if (this.mariam.alive == false){
            return;
        }
        // Die and restart everything 
        this.mariam.alive = false;
        game.time.events.remove(this.timer);
        this.candys.forEachAlive(function(p){
            p.body.velocity.x = 0;
        }, this);
    }
},   
    
    hitcandy: function() {  
    if (this.mariam.alive == false){
        return;
    }
    // If hit a candy then die and restart with playing a sound 
    game.sound.play('jab');
    this.mariam.alive = false;
    game.time.events.remove(this.timer);
    this.candys.forEachAlive(function(p){
        p.body.velocity.x = 0;
    }, this);
    },
};

var started = false;

function start(){
    if(started == false){
        // If click on start button then add game and start it 
        started = true; 
        game.state.add('FlappyMariam', FlappyMariam);  
        game.state.start('FlappyMariam');  
    }
}

function help(){
    alert("Just click [SPACE] in your keyboard to jump, have fun");
}

function stop(){
    // Refersh page 
    location.reload();
}



