var WIDTH  = 851, // 567, // 851,
    HEIGHT = 560, // 284, // 210, // 315,
    RATIO = (48/1.75), // = 21.14 (px/m)
    SCALE = 500,
    MAXRUNNERS = 150,
    OPTIONS = {backgroundColor : 0x1099bb};

function Main(container) {
    this.container = document.querySelectorAll(container)[0];
    this.width = WIDTH;
    this.height = HEIGHT;
    this.ratio = RATIO;
    this.scale = SCALE;
    this.maxrunners = MAXRUNNERS;
    this.name = "main";
    // Add renderer to container
    this.stage = new PIXI.Container();
    this.renderer = new PIXI.autoDetectRenderer(WIDTH, HEIGHT, OPTIONS);
    this.container.appendChild(this.renderer.view);
    this.container.style.width = WIDTH+"px";
    this.loadAssets();
    // Add FPS stats
    this.stats = new Stats();
    this.container.appendChild(this.stats.domElement );
    this.stats.domElement.style.position = "absolute";
    this.stats.domElement.style.top = "0px";
}

Main.prototype.loadAssets = function() {
    var self = this;
    console.log("Loading assets");
    var assets = [
        // By Zeyu Ren 任泽宇
        {name:"back_greenlands", data:"assets/back_greenlands-scaled.png"},
        {name:"back_rocks", data:"assets/back_rocks.png"},
        {name:"back_city", data:"assets/back_city.png"},
        // Own work
        {name:"sign", data:"assets/sign.png"},
        {name:"male", data:"assets/male_custom.png"},
        {name:"ground", data:"assets/back_ground.png"},
        // Workouts
        {name:"workouts", data:"js/workouts.json"}
    ];
    var loader = PIXI.loader;
    for (asset of assets)
        loader.add(asset.name, asset.data);
    loader.load(function(loader, resources) {
        self.resources = resources;
        self.assetsLoaded.call(self);
    });
};

Main.prototype.assetsLoaded = function() {
    console.log("Assets loaded");
    this.logic = new Logic(this, this.stage, this.resources);
    this.animate();
};

Main.prototype.update = function() {
    this.logic.update();
};

Main.prototype.animate = function() {
    this.stats.begin();
    this.update();
    this.renderer.render(this.stage);
    requestAnimationFrame(this.animate.bind(this));
    this.stats.end();
};