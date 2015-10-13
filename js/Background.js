function Background(logic, width, height) {
    var texture = logic.resources.back_greenlands.texture;
    PIXI.extras.TilingSprite.call(this, texture, width, height);
    this.position.x = 0;
    this.position.y = -68;
    this.tilePosition.x = 0;
    this.tilePosition.y = 0;
    this.viewportX = 0;
    this.sourceWidth = logic.resources.back_greenlands.texture.width; // 1000
    this.sourceHeight = logic.resources.back_greenlands.texture.height; // 563

    this.logic = logic;
    this.width = width;
    this.height = height;

    this.camera = null;
    this.dragPosStart = new PIXI.Point(0,0);
    this.dragPosEnd = new PIXI.Point(0,0);
    this.draggedPos = new PIXI.Point(0,0);

    this.interactive = true;
    this
        // events for drag start
        .on('mousedown',        this.onDragStart )
        .on('touchstart',       this.onDragStart )
        // events for drag end
        .on('mouseup',          this.onDragEnd )
        .on('mouseupoutside',   this.onDragEnd )
        .on('touchend',         this.onDragEnd )
        .on('touchendoutside',  this.onDragEnd )
        // events for drag move
        .on('mousemove',        this.onDragMove )
        .on('touchmove',        this.onDragMove );

    this.name = "background";

    this.DELTA_X = 0.32;
}
Background.constructor = Background;

Background.prototype = Object.create(PIXI.extras.TilingSprite.prototype);

// Background.DELTA_X = 0.32;

Background.prototype.setViewportX = function(newViewportX) {
    var dist = newViewportX - this.viewportX;
    this.viewportX = newViewportX;
    this.tilePosition.x -= (dist * this.DELTA_X);
    this.ground.tilePosition.x -= (dist * this.ground.DELTA_X);
};

Background.prototype.setCamera = function(camera) {
    this.camera = camera;
};
Background.prototype.setGround = function(ground) {
    this.ground = ground;
};

Background.prototype.onDragStart = function(event) {
    this.data = event.data;
    this.dragging = true;

    this.data.getLocalPosition(this.parent, this.dragPosStart);
};

Background.prototype.onDragEnd = function() {
    if (!this.data)
        return;

    this.dragging = false;

    this.data.getLocalPosition(this.parent, this.dragPosEnd);
    this.draggedPos.x += (this.dragPosEnd.x - this.dragPosStart.x);

    this.data = null;

    // If the drag is more like a press / touch
    if (Math.abs(this.dragPosEnd.x-this.dragPosStart.x) < 3)
        this.logic.hideRunners();
};

Background.prototype.onDragMove = function() {
    if (this.dragging) {
        this.camera.followX(
            this.draggedPos.x + (this.width/2 - this.dragPosStart.x)
                              + this.data.getLocalPosition(this.parent).x
        );
    }
};