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


const engine = Matter.Engine.create({
  gravity: {
    x: 0,
    y: 0.1,

  },
});

const world = new PIXI.Container();
world.position.set(app.screen.width / 2 / app.stage.scale.x, app.screen.height / 2 / app.stage.scale.y);

app.stage.addChild(world);

function createSprite(x, y, width, height, color, physicsOptions = { isStatic: false, frictionAir: 0.01, group: 0, isSensor: false}, angle = 0) {
  const sprite = new PIXI.Container();
  sprite.position.set(x, y);
  sprite.pivot.set(width / 2, height / 2);

  const graphics = new PIXI.Graphics;
  graphics.rect(0, 0, width, height);
  graphics.fill(color);

  sprite.addChild(graphics);
  world.addChild(sprite);

  let body = null;
  if (physicsOptions) {
    body= Matter.Bodies.rectangle(x, y, width, height, {
      ...physicsOptions, // compression mehtod
      collisionFilter: {
        group: physicsOptions.group,
      },
    });

    console.log(angle);
    Matter.Body.setAngle(body, angle);
    Matter.World.add(engine.world, body);

    Matter.Events.on(engine, "beforeUpdate", () => {
      sprite.position.set(body.position.x, body.position.y);
      sprite.rotation = body.angle;
    });
  }

  return [sprite, body];
}

const [playerSprite, playerBody] = createSprite(0, 0, 1, 1, 0x1f781a);
let canDoubleJump = false;

createSprite(0, 3, 8, 1, 0x1a781b, {isStatic: true, group: 1});

function isOnFloor() {
  const collisions = Matter.Query.ray(
    engine.world.bodies,
    playerBody.position,
    Matter.Vector.add(playerBody.position, { x: 0, y: 1 + 0.1}),
  );

  return collisions.some((collisions) => collisions.bodyA.collisionFilter.group === 1);
}

window.addEventListener("keydown", (e) => {
  if (e.code !== "Space") {
    return;
  }

  const isPlayerOnFloor = isOnFloor();
  if (isPlayerOnFloor) {
    canDoubleJump = true;
    Matter.Body.setVelocity(playerBody, {x: playerBody.velocity.x, y: 0.5});
  } else if (canDoubleJump) {
    canDoubleJump = false;
    Matter.Body.setVelocity(playerBody, {x: playerBody.velocity.x, y: 0.5});
  }
})

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
    // playerSprite.position = playerSprite.position.add(playerDirection.multiplyScalar(0.12 * deltaTime));
    Matter.Body.setVelocity(playerBody, {
      x: playerDirection.x * 0.2,
      y: playerBody.velocity.y,
    });
  }

  Matter.Engine.update(engine);

  // const cameraSpeed = ;
}



app.ticker.add(update);

