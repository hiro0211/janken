const choices = ['グー', 'チョキ', 'パー'];
const images = [
  'images/グー-removebg-preview.png',
  'images/チョキ-removebg-preview.png',
  'images/パー-removebg-preview.png'
];
const buttons = document.querySelectorAll('.choice-btn');
const decideBtn = document.getElementById('decide-btn');
const playerHandElement = document.getElementById('player-hand');
const computerHandElement = document.getElementById('computer-hand');
const judgmentElement = document.getElementById('judgment');

const audioWin = new Audio('audio/決定ボタンを押す23.mp3');
const audioLose = new Audio('audio/間抜け1.mp3');
const audioDraw = new Audio('audio/マントを翻す.mp3');
const roulette = new Audio('audio/電子ルーレット.mp3');

let playerChoice = null;

buttons.forEach((button, index) => {
  button.addEventListener('click', () => selectHand(index));
});

decideBtn.addEventListener('click', playGame);

function selectHand(index) {
  buttons.forEach(btn => btn.classList.remove('selected'));
  buttons[index].classList.add('selected');
  playerChoice = index;
  decideBtn.disabled = false;
}

function playGame() {
  if (playerChoice === null) return;

  const computerChoice = Math.floor(Math.random() * 3);

  // ルーレット効果音の再生
  roulette.play();

  // ルーレット演出
  animateRoulette(playerHandElement, playerChoice);
  animateRoulette(computerHandElement, computerChoice);

  setTimeout(() => {
    displayResult(playerChoice, computerChoice);
  }, 3000); // ルーレット演出の後に結果を表示
}

function animateRoulette(element, finalChoice) {
  let counter = 0;
  const interval = setInterval(() => {
    element.style.backgroundImage = `url(${images[counter % 3]})`;
    element.style.animation = 'roulette 0.1s linear';
    setTimeout(() => {
      element.style.animation = 'none';
    }, 50);
    counter++;
    if (counter > 20 + finalChoice) {
      clearInterval(interval);
      element.style.backgroundImage = `url(${images[finalChoice]})`;
      roulette.pause(); // ルーレット効果音を停止
      roulette.currentTime = 0; // 音声を最初に巻き戻す
    }
  }, 100);
}

function displayResult(player, computer) {
  playerHandElement.style.backgroundImage = `url(${images[player]})`;
  computerHandElement.style.backgroundImage = `url(${images[computer]})`;

  const result = getResult(player, computer);
  judgmentElement.textContent = result;

  playAudio(result);
}

function getResult(player, computer) {
  if (player === computer) return 'あいこ';
  if ((player === 0 && computer === 1) ||
    (player === 1 && computer === 2) ||
    (player === 2 && computer === 0)) {
    return '勝ち';
  }
  return '負け';
}

function playAudio(result) {
  switch (result) {
    case '勝ち':
      audioWin.play();
      break;
    case '負け':
      audioLose.play();
      break;
    case 'あいこ':
      audioDraw.play();
      break;
  }
}