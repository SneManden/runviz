function Runner(spritesheet, logic) {
    this.logic = logic;

    var fw = 48, // frame width
        fh = 48; // frame height
    this.animation = {};
    this.animation.frames = [];
    this.animation.frameCurrent = 0;
    // Standing frame
    var texture = new PIXI.Texture(spritesheet);
    texture.frame = new PIXI.Rectangle(0, 0, fw-0.5, fh-0.5);
    this.animation.frames.push(texture.frame);
    PIXI.Sprite.call(this, texture);
    // Build running frames
    var runFramesOffsetY = 1;
    this.animation.running = {number: 6, offset: this.animation.frames.length};
    for (var i=0; i<this.animation.running.number; i++) {
        var fx = fw*i,
            fy = runFramesOffsetY*(fh+1);
        var frame = new PIXI.Rectangle(fx, fy, fw-0.5, fh-0.5);
        this.animation.frames.push(frame);
    }
    // Jumping
    var jumpFramesOffsetY = 2;
    this.animation.jump = this.animation.frames.length;
    var fx = 0,
        fy = jumpFramesOffsetY*(fh+1);
    var frame = new PIXI.Rectangle(fx, fy, fw-0.5, fh-0.5);
    this.animation.frames.push(frame);
    // Falling
    var fallFramesOffsetY = 3;
    this.animation.fall = this.animation.frames.length;
    var fx = 0,
        fy = fallFramesOffsetY*(fh+1);
    var frame = new PIXI.Rectangle(fx, fy, fw-0.5, fh-0.5);
    this.animation.frames.push(frame);

    // Misc
    this.anchor.x = 0.5;
    this.anchor.y = 0.5;
    this.velocity_y = 0.0;
    this.stopped = true;
    this.onGround = true;
    this.interactive = true;
    this.celebrating = false;
    this.runFrame = 0;
    this.randomInt = getRandomInt(0, 2);
}
Runner.constructor = Runner;
Runner.prototype = Object.create(PIXI.Sprite.prototype);

Runner.prototype.update = function(dt, scale) {
    this.runFrame += (0.08 + this.speed);

    // Stop when distances has been run
    if (this.position.x-this.startPosX >= this.dist/scale)
        this.stopped = true;

    // Move if not stopped
    var anim = this.animation;
    if (!this.stopped) {
        this.position.x += this.speed * dt;
        var frame = Math.round(this.runFrame) % anim.running.number;
        anim.frameCurrent = anim.running.offset + frame;
    } else 
        anim.frameCurrent = 0;

    // Following relevant if celebrating:
    if (this.celebrating) {
        this.velocity_y += this.logic.gravity; // gravity = 0.5
        this.position.y += this.velocity_y;
        // If we are on (or below) the ground => grounded
        if (this.position.y >= this.groundPos) {
            this.position.y = this.groundPos;
            this.velocity_y = 0.0;
            this.onGround = true;
        }
        this.jumpStart( 6.0*Math.random() + 6.0 );
        // Set proper jump/fall frame
        if (this.velocity_y != 0)
            anim.frameCurrent = (this.velocity_y<0) ? anim.jump : anim.fall;
    }

    // Set frame
    this.texture.frame = anim.frames[anim.frameCurrent];
};

Runner.prototype.jumpStart = function(force) {
    if (this.onGround) { // grounded
        this.velocity_y = -force;
        this.onGround = false;
    }
};

// speed: m/s => px/ms
Runner.prototype.setSpeed = function(workout, ratio) {
    return ((workout.dist)/(workout.time)) * ratio / 1000;
};

Runner.prototype.createInfobox = function(workout, speed) {
    var box = document.createElement("ul");
    box.className = "runner-infobox hidden";
    box.innerHTML = "<li class=\"date\">date: " + pDate(workout.date) + "</li>"
                  + "<li class=\"dist\">dist: " + pDist(workout.dist) + "</li>"
                  + "<li class=\"time\">time: " + pTime(workout.time) + "</li>"
                  + "<li class=\"time\">speed: "+ pSpeed(speed)       + "</li>";
    this.logic.main.container.appendChild( box );
    this.infobox = box;
};