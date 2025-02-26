const key = new Map();
window.addEventListener("keydown", (e) => {
  key.set(e.code, true);
});
window.addEventListener("keyup", (e) => {
  key.set(e.code, false);
});


const app = new PIXI.Application();

await app.init({
  width: window.innerWidth,
  height: window.innerHeight,
  resizeTo: document.body,
  backgroundColor: 0xfced92,
});

document.body.appendChild(app.canvas);


app.stage.scale.set(60);

const world = new PIXI.Container();
world.position.set(app.screen.width / 2 / app.stage.scale.x, app.screen.height / 2 / app.stage.scale.y);

app.stage.addChild(world);

function createSprite(x, y, width, height, color) {
  const sprite = new PIXI.Container();
  sprite.position.set(x, y);
  sprite.pivot.set(width / 2, height / 2);

  const graphics = new PIXI.Graphics;
  graphics.rect(0, 0, width, height);
  graphics.fill(color);

  sprite.addChild(graphics);
  world.addChild(sprite);

  return sprite;
}

const playerSprite = createSprite(0, 0, 1, 1, 0x2dc455)

function update({ deltaTime, deltaMS }) {
  // playerSprite.rotation += 0.05 * deltaTime;

  let playerDirection = new PIXI.Point(0, 0);
  
  if (key.get("KeyW")) {
    playerDirection.y = -1;
  }
  if (key.get("KeyA")) {
    playerDirection.x = -1;
  }
  if (key.get("KeyS")) {
    playerDirection.y = 1;
  }
  if (key.get("KeyD")) {
    playerDirection.x = 1;
  }

  if (playerDirection.magnitude()) {
    playerDirection = playerDirection.normalize();
    playerSprite.position = playerSprite.position.add(playerDirection.multiplyScalar(0.2 * deltaTime));
  }
}



app.ticker.add(update);

