const moves = document.getElementById("moves-count");
const timeValue = document.getElementById("time");
const startButton = document.getElementById("start");
const stopButton = document.getElementById("stop");
const gameContainer = document.querySelector(".game-container");
const result = document.getElementById("result");
const controls = document.querySelector(".controls-container");
let cards;
let interval;
let firstCard = false;
let secondCard = false;

//Массив элементов
const items = [
  { name: "lime", image: "lime.png" },
  { name: "apple", image: "apple.png" },
  { name: "banan", image: "banan.png" },
  { name: "baggle", image: "baggle.png" },
  { name: "melon", image: "melon.png" },
  { name: "strawberry", image: "strawberry.png" },
  { name: "pear", image: "pear.png" },
  { name: "abrikos", image: "abrikos.png" },
  { name: "cake", image: "cake.png" },
  { name: "wishnia", image: "wishnia.png" },
  { name: "candy", image: "candy.png" },
];

//Инициализация времени
let seconds = 0,
  minutes = 0;
//Инициализация ходов и кол-во выигрышей
let movesCount = 0,
  winCount = 0;

//Для таймера
const timeGenerator = () => {
  seconds += 1;
  //логика минут
  if (seconds >= 60) {
    minutes += 1;
    seconds = 0;
  }
  //формат время перед отображением
  let secondsValue = seconds < 10 ? `0${seconds}` : seconds;
  let minutesValue = minutes < 10 ? `0${minutes}` : minutes;
  timeValue.innerHTML = `<span>Time:</span>${minutesValue}:${secondsValue}`;
};

//Для счета шагов
const movesCounter = () => {
  movesCount += 1;
  moves.innerHTML = `<span>Moves:</span>${movesCount}`;
};

//Выбор случайных объектов из массива items
const generateRandom = (size = 4) => {
  //временный массив
  let tempArray = [...items];
  //инициализирует массив значений карт
  let cardValues = [];
  /*Переменная size изменяется, умножаясь на саму себя и делится на 2, 
  чтобы определить количество пар объектов, которые будут выбраны случайным образом.*/
  size = (size * size) / 2;
  /*цикл for проходит по длине size и каждый раз случайным образом 
  выбирается индекс randomIndex в пределах длины временного массива. 
  Выбранный объект добавляется в массив cardValues, 
  после чего он удаляется из временного массива с помощью метода splice.*/
  for (let i = 0; i < size; i++) {
    const randomIndex = Math.floor(Math.random() * tempArray.length);
    cardValues.push(tempArray[randomIndex]);
    //после выбора удалите объект из временного массива
    tempArray.splice(randomIndex, 1);
  }
  //функция возвращает массив cardValues, содержащий случайно выбранные объекты.
  return cardValues;
};

const matrixGenerator = (cardValues, size = 4) => {
  gameContainer.innerHTML = "";
  cardValues = [...cardValues, ...cardValues];
  //простое перемешивание
  cardValues.sort(() => Math.random() - 0.5);
  for (let i = 0; i < size * size; i++) {
    /*
        Создание карточек
до => лицевая сторона (содержит вопросительный знак)
после => оборотная сторона (содержит фактическое изображение)
 data-card-values - это пользовательский атрибут, который хранит названия карточек для последующего сопоставления
      */
    gameContainer.innerHTML += `
     <div class="card-container" data-card-value="${cardValues[i].name}">
        <div class="card-before">?</div>
        <div class="card-after">
        <img src="${cardValues[i].image}" class="image" width = "60" height = "62" style = "background-color: white;"/></div>
     </div>`;
  }
  //Grid
  gameContainer.style.gridTemplateColumns = `repeat(${size},auto)`;

  //Cards
  cards = document.querySelectorAll(".card-container");
  cards.forEach((card) => {
    card.addEventListener("click", () => {
      //Если выбранная карта еще не подобрана, то только запуск (т.е. уже подобранная карта при нажатии будет проигнорирована).
      if (!card.classList.contains("matched")) {
        //Переворот при клике
        card.classList.add("flipped");
        //если это первая карточка (!firstCard, поскольку firstCard изначально имеет значение false)
        if (!firstCard) {
          //иначе текущая карта станет первой картой
          firstCard = card;
          //текущее значение карты становится значением первой карты
          firstCardValue = card.getAttribute("data-card-value");
        } else {
          //увеличение количества ходов с момента выбора пользователем второй карты
          movesCounter();
          //Вторая карта и значение
          secondCard = card;
          let secondCardValue = card.getAttribute("data-card-value");
          if (firstCardValue == secondCardValue) {
            //если обе карты совпадают, добавляются в соответствующий класс, чтобы в следующий раз эти карты были проигнорированы
            firstCard.classList.add("matched");
            secondCard.classList.add("matched");
            //Для первой карты значение false, так как следующая карта теперь будет первой, 
            firstCard = false;
            //Количество выигрышей увеличивается по мере того, как пользователь находит правильное совпадение
            winCount += 1;
            //Соответствует ли winCount == половине значений карты
            if (winCount == Math.floor(cardValues.length / 2)) {
              if (seconds < 10)
              {
                result.innerHTML = `<h2>Вы выиграли!</h2>
            <h4>Moves: ${movesCount}</h4>
            <h4>Time: ${minutes}:0${seconds}</h4>`;
              }
              else{
              result.innerHTML = `<h2>Вы выиграли!</h2>
            <h4>Moves: ${movesCount}</h4>
            <h4>Time: ${minutes}:${seconds}</h4>`;
              }
              stopGame();
            }
          } else {
            /*если карточки не совпадают
            возврат карточек в исходное положение*/
            let [tempFirst, tempSecond] = [firstCard, secondCard];
            firstCard = false;
            secondCard = false;
            let delay = setTimeout(() => {
              tempFirst.classList.remove("flipped");
              tempSecond.classList.remove("flipped");
            }, 900);
          }
        }
      }
    });
  });
};

//Start game
startButton.addEventListener("click", () => {
  movesCount = 0;
  seconds = 0;
  minutes = 0;
  //управление видимостью кнопок
  controls.classList.add("hide");
  stopButton.classList.remove("hide");
  startButton.classList.add("hide");
  //Start timer
  interval = setInterval(timeGenerator, 1000);
  //Инициализация ходов
  moves.innerHTML = `<span>Moves:</span> ${movesCount}`;
  initializer();
});

//Stop game
stopButton.addEventListener(
  "click",
  (stopGame = () => {
    controls.classList.remove("hide");
    stopButton.classList.add("hide");
    startButton.classList.remove("hide");
    clearInterval(interval);
  })
);

//Инициализируйте значения и вызовы функций
const initializer = () => {
  result.innerText = "";
  winCount = 0;
  let cardValues = generateRandom();
  console.log(cardValues);
  matrixGenerator(cardValues);
};