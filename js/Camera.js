function Camera(logic, width, height, world, background) {
    PIXI.Container.call(this);
    this.viewWidth = width;
    this.viewHeight = height;
    this.world = world;
    this.background = background;
    this.name = "camera";
    this.logic = logic;
}

Camera.constructor = Camera;

Camera.prototype = Object.create(PIXI.Container.prototype);

Camera.prototype.follow = function(object) {
    this.world.position.x = this.viewWidth/2 - object.position.x;
    this.background.setViewportX(-this.world.position.x);
};
Camera.prototype.followX = function(x) {
    if (x < this.viewWidth/2)
        x = this.viewWidth/2;
    if (x > 1000-0.32*this.viewWidth/2) // ugly :/
        x = 1000-0.32*this.viewWidth/2;

    this.world.position.x = this.viewWidth/2 - x;
    this.background.setViewportX(-this.world.position.x);
};