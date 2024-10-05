const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startBtn = document.getElementById('startBtn');
const scoreDisplay = document.getElementById('score');

canvas.width = 2000;  
canvas.height = 600;

let isGameRunning = false;
let score = 0;
let playerSpeed = 2; 
let moveSpeed = 5; 

let player = {
  x: 100,
  y: canvas.height / 2,
  radius: 15,
  color: 'yellow'
};

let earth = {
  x: canvas.width - 100,
  y: canvas.height / 2,
  radius: 30,
  color: 'blue',
  visible: false // A Terra começa invisível
};

let sun = {
  x: 50,
  y: canvas.height / 2,
  radius: 50,
  color: 'orange'
};

let obstacles = [];
let particles = []; 

function createObstacle() {
  let radius = Math.random() * 20 + 10;
  let y = Math.random() * canvas.height;
  obstacles.push({
    x: canvas.width + radius, 
    y: y,
    radius: radius,
    dx: -4, 
    color: 'gray'
  });
}

function createParticle() {
  let radius = 5; 
  let y = Math.random() * canvas.height;
  particles.push({
    x: canvas.width + radius, 
    y: y,
    radius: radius,
    dx: -3, 
    color: 'cyan'
  });
}

function drawCircle(object) {
  ctx.beginPath();
  ctx.arc(object.x, object.y, object.radius, 0, Math.PI * 2);
  ctx.fillStyle = object.color;
  ctx.fill();
  ctx.closePath();
}

function drawPlayer() {
  drawCircle(player);
}

function drawEarth() {
  if (earth.visible) {
    drawCircle(earth);
  }
}

function drawSun() {
  drawCircle(sun);
}

function drawObstacles() {
  obstacles.forEach(obstacle => {
    drawCircle(obstacle);
  });
}

function drawParticles() {
  particles.forEach(particle => {
    drawCircle(particle);
  });
}

function moveObstacles() {
  obstacles.forEach((obstacle, index) => {
    obstacle.x += obstacle.dx;

    if (obstacle.x + obstacle.radius < 0) {
      obstacles.splice(index, 1);
      score++;
      scoreDisplay.innerText = `Score: ${score}`;
    }
  });
}

function moveParticles() {
  particles.forEach((particle, index) => {
    particle.x += particle.dx;

    if (particle.x + particle.radius < 0) {
      particles.splice(index, 1);
    }
  });
}

function checkCollision() {
  for (let obstacle of obstacles) {
    let distX = player.x - obstacle.x;
    let distY = player.y - obstacle.y;
    let distance = Math.sqrt(distX * distX + distY * distY);

    if (distance < player.radius + obstacle.radius) {
      document.location.reload();
    }
  }

  // Checa se o score atingiu 200 para mostrar a Terra
  if (score >= 200) {
    earth.visible = true; // Torna a Terra visível quando o score atinge 200
  }

  let distX = player.x - earth.x;
  let distY = player.y - earth.y;
  let distance = Math.sqrt(distX * distX + distY * distY);

  // Condição de vitória
  if (earth.visible && distance < player.radius + earth.radius) {
    document.location.reload();
  }

  for (let particle of particles) {
    let distX = player.x - particle.x;
    let distY = player.y - particle.y;
    let distance = Math.sqrt(distX * distX + distY * distY);

    if (distance < player.radius + particle.radius) {
      score += 5; 
      playerSpeed += 0.5; 
      scoreDisplay.innerText = `Score: ${score}`;
      particles.splice(particles.indexOf(particle), 1);
    }
  }
}

function update() {
  if (!isGameRunning) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  earth.x -= playerSpeed; 
  sun.x -= playerSpeed; 

  moveObstacles();
  moveParticles();

  drawSun();
  drawPlayer();
  drawEarth();
  drawObstacles();
  drawParticles();

  checkCollision();

  requestAnimationFrame(update);
}

let obstacleInterval;
let particleInterval;

startBtn.addEventListener('click', function () {
  isGameRunning = true;
  startBtn.style.display = 'none'; 
  obstacleInterval = setInterval(createObstacle, 2000); 
  particleInterval = setInterval(createParticle, 800); 
  update();
});

window.addEventListener('keydown', function (e) {
  if (e.key === 'ArrowUp') {
    player.y -= moveSpeed; 
    if (player.y < player.radius) player.y = player.radius; 
    e.preventDefault(); 
  }
  if (e.key === 'ArrowDown') {
    player.y += moveSpeed; 
    if (player.y > canvas.height - player.radius) player.y = canvas.height - player.radius; 
    e.preventDefault(); 
  }
});

// Centralizando o jogador no meio da tela
player.y = canvas.height / 2;
