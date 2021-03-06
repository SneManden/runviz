function Logic(main, stage, resources) {
    this.main = main;
    this.width = main.width;
    this.height = main.height;
    this.ratio = main.ratio;
    this.scale = main.scale;
    this.maxrunners = main.maxrunners;
    this.gravity = 0.5;

    this.stage = stage;
    this.resources = resources;
    this.name = "logic";
    var self = this;

    // Background
    this.background = new Background(this, this.width, this.height);
    this.stage.addChild(this.background);
    // Ground
    this.ground = new PIXI.extras.TilingSprite(this.resources.ground.texture, main.width, 68);
    this.ground.position.y = main.height-68;
    this.ground.DELTA_X = 1.0;
    this.stage.addChild(this.ground);
    
    // World
    this.world = new PIXI.Container();
    this.stage.addChild(this.world);

    // Camera
    this.camera = new Camera(this, this.width, this.height, this.world, this.background);
    this.stage.addChild(this.camera);
    // Add other entities to background
    this.background.setCamera(this.camera);
    this.background.setGround(this.ground);

    var startOffset = 50;

    // Add runners
    console.log("Number of workouts:", this.resources.workouts.data.length);
    this.workouts = this.resources.workouts.data.filter(function(el, index){
        return index < self.maxrunners; // add up to #maxrunners
    });
    var n = 0;
    var maxDist = 0;
    this.runners = new PIXI.Container();
    this.workouts.forEach(function(workout, index) {
        workout.date = new Date(workout.date);
        var runner = new Runner(self.resources.male.texture, self);
        runner.startPosX = startOffset;
        runner.position.x = runner.startPosX;
        runner.groundPos = self.height -74 + (index/self.workouts.length)*37;
        runner.position.y = runner.groundPos;
        runner.dist = workout.dist * self.ratio; // m => px
        runner.maxDist = maxDist = (maxDist<runner.dist) ? runner.dist : maxDist;
        runner.speed = runner.setSpeed(workout, self.ratio);
        runner.name = "Runner #" + index + " (" + pDate(workout.date) + ")";
        runner.createInfobox(workout, runner.speed/self.ratio);
        runner.on('mousedown',  self.selectRunner.bind(self, runner))
              .on('touchstart', self.selectRunner.bind(self, runner))
        self.runners.addChild(runner);
        n++;
    });
    console.log("Created", n, "runners");
    this.maxDist = maxDist;
    this.selected = null;
    this.world.addChild(this.runners);

    this.createDistSigns(startOffset);

    // Timing
    this.events = [];
    this.started = false;
    this.gameOver = false;
    this.last = (new Date).getTime();
    this.start();
}

Logic.prototype.start = function() {
    for (runner of this.runners.children) {
        runner.position.x = runner.startPosX;
        runner.stopped = true;
        runner.celebrating = false;
    }
    this.selected = null;
    this.gameOver = false;

    var self = this;
    this.begin = (new Date).getTime();
    this.events.push({
        time:       (new Date(this.begin+3*1000)).getTime(),
        callback:   self.startRunners.bind(self)
    });
};

Logic.prototype.startRunners = function() {
    console.log("START!");
    this.started = true;
    for (runner of this.runners.children)
        runner.stopped = false;
};

Logic.prototype.endGame = function() {
    this.gameOver = true;
    // Criteria for winning: distance
    var bestrunner = this.runners.children[0];
    for (runner of this.runners.children) {
        runner.celebrating = true;
        bestrunner = (runner.position.x>bestrunner.position.x) ? runner : bestrunner;
    }
    bestrunner.selected = true;
    console.log("WE HAVE A WINNER:", bestrunner.name);
};

Logic.prototype.hideRunners = function() {
    for (runner of this.runners.children) {
        addClass(runner.infobox, "hidden");
        runner.tint = 0xFFFFFF;
    }
    this.selected = null;
};

Logic.prototype.selectRunner = function(runner) {
    if (this.selected == runner) {
        this.hideRunners()
        return;
    }

    this.hideRunners();
    removeClass(runner.infobox, "hidden");
    runner.tint = 0xaaaaaa;
    this.selected = runner;
};

Logic.prototype.createDistSigns = function(offsetX) {
    var numSigns = Math.ceil(this.maxDist/this.ratio/1000) + 1;

    this.signs = new PIXI.Container();
    var texture = this.resources.sign.texture;
    var textStyle = {font: "bold 12px monospace"};
    for (var i=0; i<numSigns; i++) {
        var sign = new PIXI.Sprite(texture);
        sign.anchor.x = 0.5;
        sign.anchor.y = 0.5;
        sign.position.x = offsetX + 1000*i * this.ratio / this.scale;
        sign.position.y = this.height - 16;
        this.signs.addChild(sign);
        // Add text
        var signText = new PIXI.Text(i, textStyle);
        signText.anchor.x = 0.5;
        signText.anchor.y = 0.5;
        signText.x = sign.position.x;
        signText.y = sign.position.y-2;
        this.signs.addChild(signText);
    }
    this.world.addChild(this.signs);
    console.log("Created", numSigns, "signs");
};

Logic.prototype.update = function() {
    var now = (new Date).getTime();
    var dt = now-this.last; // in case dt is 0
    
    var self = this;
    var allStopped = true;
    this.runners.children.forEach(function(runner, index) {
        runner.update.call(runner, dt, self.scale);

        allStopped &= runner.stopped;
    });
    // Follow selected runner
    if (!this.background.dragging && this.selected) {
        this.camera.followX(this.selected.position.x);
        this.background.draggedPos.x = this.selected.position.x - this.width/2;
    }

    if (allStopped && this.started && !this.gameOver)
        this.endGame(); // decide winner etc.

    // Check events
    this.events.forEach(function(e, index) {
        if (now >= e.time) { // dispatch event
            e.callback();
            self.events.splice(index, 1);
        }
    });

    this.last = (new Date).getTime();
};
