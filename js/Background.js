function Background(logic, width, height) {
    var texture = PIXI.Texture.fromImage("assets/background-tree-scaled.png");
    PIXI.extras.TilingSprite.call(this, texture, width, height);
    this.position.x = 0;
    this.position.y = 0;
    this.tilePosition.x = 0;
    this.tilePosition.y = 0;
    this.viewportX = 0;

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
}
Background.constructor = Background;

Background.prototype = Object.create(PIXI.extras.TilingSprite.prototype);

Background.DELTA_X = 1;//0.32;

Background.prototype.setViewportX = function(newViewportX) {
    var dist = newViewportX - this.viewportX;
    this.viewportX = newViewportX;
    this.tilePosition.x -= (dist * Background.DELTA_X);
};

Background.prototype.setCamera = function(camera) {
    this.camera = camera;
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