const app = new PIXI.Application();

await app.init({
    width: window.innerWidth,
    height: window.innerHeight,
    resizeTo: document.body,
    backgroundColor: 0xffffff,
});

document.body.appendChild(app.canvas);


app.stage.scale.set(60);

const world = new PIXI.Container();
world.position.set(app.screen.width / 2 / app.stage.scale.x, app.screen.height / 2 / app.stage.scale.y);

app.stage.addChild(world);

function createSprite(x, y, width, height, color) {
    const sprite = new PIXI.Container();
    sprite.position.set(x,y);
    sprite.pivot.set(width/2, height/2);

    const graphics = new PIXI.Graphics;
    graphics.rect(0,0, width, height);
    graphics.fill(color);

    sprite.addChild(graphics);
    world.addChild(sprite);
}

const playerSprite = createSprite(0, 0, 1, 1, 0x0000ff)