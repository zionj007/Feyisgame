// script.js
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const levelSelect = document.getElementById("levelSelect");
const startBtn = document.getElementById("startBtn");
const scoreDisplay = document.getElementById("score");
const levelDisplay = document.getElementById("level");
const menu = document.getElementById("menu");
const gameInfo = document.getElementById("gameInfo");

canvas.width = 400;
canvas.height = 400;

const box = 20; // Size of each box
let snake = [{ x: 9 * box, y: 10 * box }]; // Initial snake position
let food = { x: Math.floor(Math.random() * 19) * box, y: Math.floor(Math.random() * 19) * box };
let score = 0;
let level = 1;
let speed = 100;
let obstacles = [];
let direction;
let game;

// Speed settings for each level
const speedLevels = {
    1: 250,
    2: 100,
    3: 50
};

// Obstacles configuration for different levels
const levelObstacles = {
    2: [{ x: 5 * box, y: 5 * box }, { x: 14 * box, y: 5 * box }],
    3: [{ x: 5 * box, y: 5 * box }, { x: 14 * box, y: 5 * box }, { x: 5 * box, y: 14 * box }, { x: 14 * box, y: 14 * box }]
};

// Start the game when the button is clicked
startBtn.addEventListener("click", () => {
    level = parseInt(levelSelect.value);
    speed = speedLevels[level];
    obstacles = levelObstacles[level] || [];
    resetGame();
    menu.style.display = "none";
    canvas.style.display = "block";
    gameInfo.style.display = "block";
});

// Draw the game elements
function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

    // Draw the background
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw the snake
    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = i === 0 ? "#61dafb" : "#FFF";
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
        ctx.strokeStyle = "#282c34";
        ctx.strokeRect(snake[i].x, snake[i].y, box, box);
    }

    // Draw the food
    ctx.fillStyle = "#FF0000";
    ctx.fillRect(food.x, food.y, box, box);

    // Draw obstacles
    for (let obstacle of obstacles) {
        ctx.fillStyle = "#FFA500";
        ctx.fillRect(obstacle.x, obstacle.y, box, box);
    }

    // Move the snake
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (direction === "LEFT") snakeX -= box;
    if (direction === "UP") snakeY -= box;
    if (direction === "RIGHT") snakeX += box;
    if (direction === "DOWN") snakeY += box;

    // Check if the snake eats the food
    if (snakeX === food.x && snakeY === food.y) {
        score++;
        food = {
            x: Math.floor(Math.random() * 19) * box,
            y: Math.floor(Math.random() * 19) * box
        };
    } else {
        snake.pop();
    }

    // Add new head to the snake
    let newHead = { x: snakeX, y: snakeY };

    // Check for collision with walls, snake body, or obstacles
    if (snakeX < 0 || snakeY < 0 || snakeX >= canvas.width || snakeY >= canvas.height || collision(newHead, snake) || collision(newHead, obstacles)) {
        clearInterval(game);
        alert("Game Over! Your score: " + score);
        menu.style.display = "block";
        canvas.style.display = "none";
        gameInfo.style.display = "none";
    }

    snake.unshift(newHead);

    // Update score and level display
    scoreDisplay.textContent = score;
    levelDisplay.textContent = level;
}

// Check for collision
function collision(head, array) {
    for (let i = 0; i < array.length; i++) {
        if (head.x === array[i].x && head.y === array[i].y) {
            return true;
        }
    }
    return false;
}

// Control the snake
document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
    if (event.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
    if (event.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
    if (event.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
});

// Reset game after Game Over
function resetGame() {
    snake = [{ x: 9 * box, y: 10 * box }];
    direction = null;
    score = 0;
    game = setInterval(drawGame, speed);
}
