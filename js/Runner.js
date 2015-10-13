function Runner(texture, logic) {
    PIXI.Sprite.call(this, texture);

    this.anchor.x = 0.5;
    this.anchor.y = 0.5;

    this.logic = logic;

    this.velocity_y = 0.0;
    this.stopped = true;
    this.onGround = true;
    this.interactive = true;
    this.celebrating = false;
}
Runner.constructor = Runner;
Runner.prototype = Object.create(PIXI.Sprite.prototype);

Runner.prototype.update = function(dt, scale) {
    // Stop when distances has been run
    if (this.position.x >= this.dist/scale)
        this.stopped = true;

    // Move if not stopped
    if (!this.stopped)
        this.position.x += this.speed * dt;

    // Following relevant if celebrating:
    if (!this.celebrating)
        return;
    this.velocity_y += this.logic.gravity; // gravity = 0.5
    this.position.y += this.velocity_y;
    // If we are on (or below) the ground => grounded
    if (this.position.y >= this.groundPos) {
        this.position.y = this.groundPos;
        this.velocity_y = 0.0;
        this.onGround = true;
    }
    this.jumpStart( 6.0*Math.random() + 6.0 );
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
    document.body.appendChild( box );
    this.infobox = box;
};