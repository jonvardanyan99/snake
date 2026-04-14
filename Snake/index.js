const BOX = 32;
const COLS = 17;
const ROWS = 15;
const INITIAL_SNAKE = [
  {
    x: 9 * BOX,
    y: 10 * BOX,
  },
];

const gameCvs = document.getElementById('game');
const gameCtx = gameCvs.getContext('2d');
const playAgainBtn = document.getElementById('play-again-btn');

const groundImg = new Image();
const foodImg = new Image();

groundImg.src = 'assets/images/ground.png';
foodImg.src = 'assets/images/food.png';

const dead = new Audio();
const eat = new Audio();
const up = new Audio();
const left = new Audio();
const right = new Audio();
const down = new Audio();

dead.src = 'assets/audio/dead.mp3';
eat.src = 'assets/audio/eat.mp3';
up.src = 'assets/audio/up.mp3';
left.src = 'assets/audio/left.mp3';
right.src = 'assets/audio/right.mp3';
down.src = 'assets/audio/down.mp3';

let score = 0;
let direction = '';
let snake = [...INITIAL_SNAKE];
let food = {
  x: 0,
  y: 0,
};
let isGamePaused = false;

const getFoodCoordinates = () => {
  return {
    x: Math.floor(Math.random() * COLS + 1) * BOX,
    y: Math.floor(Math.random() * ROWS + 3) * BOX,
  };
}

const getInitialFoodCoordinates = () => {
  let initialFoodCoordinates = getFoodCoordinates();

  while (initialFoodCoordinates.x === snake[0].x && initialFoodCoordinates.y === snake[0].y) {
    initialFoodCoordinates = getFoodCoordinates();
  }

  return initialFoodCoordinates;
};

food = getInitialFoodCoordinates();

const detectCollision = (head, snake) => {
  for (let i = 0; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      return true;
    }
  }

  return false;
};

const toggleGamePause = () => {
  if (isGamePaused) {
    snakeGame = setInterval(draw, 100);

    isGamePaused = false;
  } else {
    clearInterval(snakeGame);

    isGamePaused = true;
  }
};

const handleKeyDown = (event) => {
  const { key } = event;

  if (!playAgainBtn.classList.contains('play-again-btn--active')) {
    if (key === 'Escape') {
      toggleGamePause();
    }

    if (!isGamePaused) {
      if (key === 'ArrowLeft' && direction !== 'right') {
        left.play();

        direction = 'left';
      } else if (key === 'ArrowUp' && direction !== 'down') {
        direction = 'up';

        up.play();
      } else if (key === 'ArrowRight' && direction !== 'left') {
        direction = 'right';

        right.play();
      } else if (key === 'ArrowDown' && direction !== 'up') {
        direction = 'down';

        down.play();
      }
    }
  }
};

const playGameAgain = () => {
  if (playAgainBtn.classList.contains('play-again-btn--active')) {
    score = 0;
    direction = '';
    snake = [...INITIAL_SNAKE];
    food = getInitialFoodCoordinates();
    isGamePaused = false;

    playAgainBtn.classList.remove('play-again-btn--active');

    snakeGame = setInterval(draw, 100);
  }
};


const draw = () => {
  gameCtx.drawImage(groundImg, 0, 0);
  gameCtx.drawImage(foodImg, food.x, food.y);

  for (let i = 0; i < snake.length; i++) {
    gameCtx.fillStyle = i === 0 ? 'green' : 'white';
    gameCtx.fillRect(snake[i].x, snake[i].y, BOX, BOX);

    gameCtx.strokeStyle = 'red';
    gameCtx.strokeRect(snake[i].x, snake[i].y, BOX, BOX);
  }

  let snakeX = snake[0].x;
  let snakeY = snake[0].y;

  if (direction === 'left') snakeX -= BOX;
  if (direction === 'up') snakeY -= BOX;
  if (direction === 'right') snakeX += BOX;
  if (direction === 'down') snakeY += BOX;

  const newHead = {
    x: snakeX,
    y: snakeY,
  };

  if (snakeX === food.x && snakeY === food.y) {
    score++;

    eat.play();

    food = getFoodCoordinates();
  } else {
    snake.pop();
  }

  if (
    snakeX < BOX ||
    snakeX > COLS * BOX ||
    snakeY < 3 * BOX ||
    snakeY > COLS * BOX ||
    detectCollision(newHead, snake)
  ) {
    clearInterval(snakeGame);

    dead.play();

    playAgainBtn.classList.add('play-again-btn--active');
  }

  snake.unshift(newHead);

  gameCtx.fillStyle = 'white';
  gameCtx.textAlign = 'left';
  gameCtx.font = '45px Arial, sans-serif';
  gameCtx.fillText(score, 2 * BOX, 1.6 * BOX);

  gameCtx.textAlign = 'right';
  gameCtx.font = '16px Arial, sans-serif';
  gameCtx.fillText('Press ESC to pause', gameCvs.width - BOX, 1.3 * BOX);
};

addEventListener('keydown', handleKeyDown);
playAgainBtn.addEventListener('click', playGameAgain);

let snakeGame = setInterval(draw, 100);
