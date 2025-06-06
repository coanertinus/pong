const canvas = document.getElementById("pong");
const ctx = canvas.getContext("2d");

// Game variables
const PADDLE_WIDTH = 15;
const PADDLE_HEIGHT = 100;
const BALL_SIZE = 16;
const PLAYER_X = 10;
const AI_X = canvas.width - PADDLE_WIDTH - 10;
const PADDLE_SPEED = 6;
const BALL_SPEED = 6;

// Player paddle
let player = {
    x: PLAYER_X,
    y: canvas.height / 2 - PADDLE_HEIGHT / 2,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
    dy: 0
};

// AI paddle
let ai = {
    x: AI_X,
    y: canvas.height / 2 - PADDLE_HEIGHT / 2,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
    dy: 0
};

// Ball
let ball = {
    x: canvas.width / 2 - BALL_SIZE / 2,
    y: canvas.height / 2 - BALL_SIZE / 2,
    size: BALL_SIZE,
    dx: BALL_SPEED * (Math.random() > 0.5 ? 1 : -1),
    dy: BALL_SPEED * (Math.random() * 2 - 1)
};

// Scores
let playerScore = 0;
let aiScore = 0;

// Mouse control for player paddle
canvas.addEventListener('mousemove', function(evt) {
    const rect = canvas.getBoundingClientRect();
    let mouseY = evt.clientY - rect.top;
    player.y = mouseY - player.height / 2;
    // Clamp to canvas
    if (player.y < 0) player.y = 0;
    if (player.y + player.height > canvas.height) player.y = canvas.height - player.height;
});

// Draw functions
function drawRect(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

function drawBall(x, y, size, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, size, size);
}

function drawNet() {
    ctx.fillStyle = "#fff";
    for (let i = 0; i < canvas.height; i += 30) {
        ctx.fillRect(canvas.width / 2 - 2, i, 4, 20);
    }
}

function drawScore() {
    ctx.font = "32px Arial";
    ctx.fillStyle = "#fff";
    ctx.fillText(playerScore, canvas.width / 4, 50);
    ctx.fillText(aiScore, (canvas.width * 3) / 4, 50);
}

// Collision detection
function collision(paddle, ball) {
    return (
        ball.x < paddle.x + paddle.width &&
        ball.x + ball.size > paddle.x &&
        ball.y < paddle.y + paddle.height &&
        ball.y + ball.size > paddle.y
    );
}

// AI movement (simple tracking)
function moveAI() {
    let center = ai.y + ai.height / 2;
    if (center < ball.y + ball.size / 2 - 10) {
        ai.y += PADDLE_SPEED * 0.8;
    } else if (center > ball.y + ball.size / 2 + 10) {
        ai.y -= PADDLE_SPEED * 0.8;
    }
    // Clamp to canvas
    if (ai.y < 0) ai.y = 0;
    if (ai.y + ai.height > canvas.height) ai.y = canvas.height - ai.height;
}

// Reset ball after score
function resetBall() {
    ball.x = canvas.width / 2 - BALL_SIZE / 2;
    ball.y = canvas.height / 2 - BALL_SIZE / 2;
    ball.dx = BALL_SPEED * (Math.random() > 0.5 ? 1 : -1);
    ball.dy = BALL_SPEED * (Math.random() * 2 - 1);
}

// Main update loop
function update() {
    // Move ball
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Ball collision with top/bottom
    if (ball.y < 0) {
        ball.y = 0;
        ball.dy *= -1;
    }
    if (ball.y + ball.size > canvas.height) {
        ball.y = canvas.height - ball.size;
        ball.dy *= -1;
    }

    // Ball collision with paddles
    if (collision(player, ball)) {
        ball.x = player.x + player.width;
        ball.dx *= -1;
        // Add spin based on hit position
        let collidePoint = (ball.y + ball.size / 2) - (player.y + player.height / 2);
        collidePoint = collidePoint / (player.height / 2);
        ball.dy = BALL_SPEED * collidePoint;
    }
    if (collision(ai, ball)) {
        ball.x = ai.x - ball.size;
        ball.dx *= -1;
        let collidePoint = (ball.y + ball.size / 2) - (ai.y + ai.height / 2);
        collidePoint = collidePoint / (ai.height / 2);
        ball.dy = BALL_SPEED * collidePoint;
    }

    // Score update
    if (ball.x < 0) {
        aiScore++;
        resetBall();
    }
    if (ball.x + ball.size > canvas.width) {
        playerScore++;
        resetBall();
    }

    // AI paddle movement
    moveAI();
}

// Draw everything
function draw() {
    // Clear
    drawRect(0, 0, canvas.width, canvas.height, "#111");
    drawNet();
    drawScore();
    // Draw paddles and ball
    drawRect(player.x, player.y, player.width, player.height, "#00ff99");
    drawRect(ai.x, ai.y, ai.width, ai.height, "#ff2a6d");
    drawBall(ball.x, ball.y, ball.size, "#fff");
}

// Game loop
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Start
gameLoop();
