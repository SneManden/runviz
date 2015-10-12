function Logic(main, stage) {
    this.main = main;
    this.width = main.width;
    this.height = main.height;
    this.ratio = main.ratio;
    this.scale = main.scale;
    this.stage = stage;
    this.name = "logic";
    var self = this;

    // Background
    this.background = new Background(this, this.width, this.height);
    this.stage.addChild(this.background);
    
    // World
    this.world = new PIXI.Container();
    this.stage.addChild(this.world);

    // Camera
    this.camera = new Camera(this, this.width, this.height, this.world, this.background);
    this.stage.addChild(this.camera);
    this.background.setCamera(this.camera);

    // Add runners
    this.workouts = [ // dist in km, time in seconds
        {date: new Date(2015, 10-1, 11), dist: 15.15, time: 4144},
        {date: new Date(2015, 10-1,  9), dist:  7.38, time: 1935},
        {date: new Date(2015, 10-1,  8), dist:  5.51, time: 1557},
        {date: new Date(2015, 10-1,  6), dist:  7.40, time: 2029},
        {date: new Date(2015, 10-1,  4), dist: 21.23, time: 5278},
        {date: new Date(2015, 10-1,  2), dist:  8.40, time: 2197}
    ];
    this.runners = new PIXI.Container();
    var texture = PIXI.Texture.fromImage("assets/bunny.png");
    this.workouts.forEach(function(workout, index) {
        var runner = new PIXI.Sprite(texture);
        runner.anchor.x = 0.5;
        runner.anchor.y = 0.5;
        runner.position.x = 10;
        runner.position.y = self.height- 74 + (index/self.workouts.length)*37;
        runner.dist = 1000*workout.dist * self.ratio; // m => px
        runner.speed = self.setSpeed(workout);
        runner.stopped = false;
        runner.infobox = self.createInfobox(workout);
        runner.interactive = true;
        runner.logic = self;
        runner.on('mousedown',  self.selectRunner.bind(self, runner))
              .on('touchstart', self.selectRunner.bind(self, runner))
        self.runners.addChild(runner);

        console.log("  runner", index, "stops at", runner.dist/self.scale);
    });
    this.selected = null;
    this.world.addChild(this.runners);

    this.createDistSigns();

    // Timing
    this.last = (new Date).getTime();
}

Logic.prototype.createInfobox = function(workout) {
    var div = document.createElement("ul");
    div.className = "runner-infobox hidden";
    div.innerHTML = "<li class=\"date\">date: " + pDate(workout.date) + "</li>"
                  + "<li class=\"dist\">dist: " + pDist(workout.dist) + "</li>"
                  + "<li class=\"time\">time: " + pTime(workout.time) + "</li>";
    document.body.appendChild( div );
    return div;
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
    runner.tint = 0xffaaaa;
    this.selected = runner;
};

Logic.prototype.createDistSigns = function() {
    var maxDist = 0;
    for (workout of this.workouts)
        maxDist = (maxDist < workout.dist ? workout.dist : maxDist);
    var numSigns = Math.ceil(maxDist) + 1;

    this.signs = new PIXI.Container();
    var texture = PIXI.Texture.fromImage("assets/sign.png");
    var textStyle = {font: "bold 12px monospace"};
    for (var i=0; i<numSigns; i++) {
        var sign = new PIXI.Sprite(texture);
        sign.anchor.x = 0.5;
        sign.anchor.y = 0.5;
        sign.position.x = 1000*i * this.ratio / this.scale;
        sign.position.y = this.height - 32;
        this.signs.addChild(sign);
        console.log("  sign at", sign.position);
        // Add text
        var signText = new PIXI.Text(i, textStyle);
        signText.anchor.x = 0.5;
        signText.anchor.y = 0.5;
        signText.x = sign.position.x;
        signText.y = sign.position.y-2;
        this.signs.addChild(signText);
    }
    this.world.addChild(this.signs);
    console.log("Created " + numSigns + " signs");
};

// speed as px / ms
Logic.prototype.setSpeed = function(workout) {
    return ((1000*workout.dist)/(workout.time)) * this.ratio / 1000;
};

Logic.prototype.update = function() {
    var dt = ((new Date).getTime())-this.last; // in case dt is 0
    
    var self = this;
    // var argmax = 0;
    this.runners.children.forEach(function(runner, index) {
        runner.stopped = (runner.position.x >= runner.dist/self.scale);
        // Move non-stopped runners
        if (!runner.stopped)
            runner.position.x += runner.speed * dt;
        // Find furthest runner
        // if (runner.position.x > self.runners.children[argmax].position.x)
        //     argmax = index;
    });
    // Follow selected runner
    if (!this.background.dragging && this.selected) {
        this.camera.followX(this.selected.position.x);
        this.background.draggedPos.x = this.selected.position.x - this.width/2;
    }

    this.last = (new Date).getTime();
};
