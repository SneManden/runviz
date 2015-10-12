var WIDTH  = 567, // 851,
    HEIGHT = 284, // 210, // 315,
    RATIO = (37/1.75), // = 21.14 (px/m)
    SCALE = 100,
    OPTIONS = {backgroundColor : 0x1099bb};

function Main(width, height, ratio, scale, options) {
    this.width = width;
    this.height = height;
    this.ratio = ratio;
    this.scale = scale;
    this.name = "main";
    this.stage = new PIXI.Container();
    this.renderer = new PIXI.autoDetectRenderer(width, height, options);
    document.body.appendChild(this.renderer.view);
    this.loadAssets();
    // Add FPS stats
    this.stats = new Stats();
    document.body.appendChild( this.stats.domElement );
    this.stats.domElement.style.position = "absolute";
    this.stats.domElement.style.top = "0px";
}

Main.prototype.loadAssets = function() {
    console.log("Loading assets");
    var assets = [
        // https://github.com/pixijs/examples/blob/gh-pages/_assets/basics/bunny.png
        {name:"bunny", data:"assets/bunny.png"},
        // http://mmantas.deviantart.com/art/Pixel-Forest-Background-530794166
        {name:"trees", data:"assets/background-tree-scaled.png"},
        // Own work
        {name:"sign", data:"assets/sign.png"}
    ];
    var loader = PIXI.loader;
    for (asset of assets)
        loader.add(asset.name, asset.data);
    loader.once("complete", this.assetsLoaded.bind(this));
    loader.load();
};

Main.prototype.assetsLoaded = function() {
    console.log("Assets loaded");
    this.logic = new Logic(this, this.stage);
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