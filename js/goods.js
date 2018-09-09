'use strict';
var mokNames = ['Чесночные сливки', 'Огуречный педант', 'Молочная хрюша', 'Грибной шейк', 'Баклажановое безумие', 'Паприколу итальяно', 'Нинзя-удар васаби', 'Хитрый баклажан', 'Горчичный вызов', 'Кедровая липучка', 'Корманный портвейн', 'Чилийский задира', 'Беконовый взрыв', 'Арахис vs виноград', 'Сельдерейная душа', 'Початок в бутылке', 'Чернющий мистер чеснок', 'Раша федераша', 'Кислая мина', 'Кукурузное утро', 'Икорный фуршет', 'Новогоднее настроение', 'С пивком потянет', 'Мисс креветка', 'Бесконечный взрыв', 'Невинные винные', 'Бельгийское пенное', 'Острый язычок'];
var mokPictures = ['gum-cedar.jpg', 'gum-chile.jpg', 'gum-eggplant.jpg', 'gum-mustard.jpg', 'gum-portwine.jpg', 'gum-wasabi.jpg', 'ice-cucumber.jpg', 'ice-eggplant.jpg', 'ice-garlic.jpg', 'ice-italian.jpg', 'ice-mushroom.jpg', 'ice-pig.jpg', 'marmalade-beer.jpg', 'marmalade-caviar.jpg', 'marmalade-corn.jpg', 'marmalade-new-year.jpg', 'marmalade-sour.jpg', 'marshmallow-bacon.jpg', 'marshmallow-beer.jpg', 'marshmallow-shrimp.jpg', 'marshmallow-spicy.jpg', 'marshmallow-wine.jpg', 'soda-bacon.jpg', 'soda-celery.jpg', 'soda-cob.jpg', 'soda-garlic.jpg', 'soda-peanut-grapes.jpg',
  'soda-russian.jpg'];
var mokContents = ['молоко', 'сливки', 'вода', 'пищевой краситель', 'патока', 'ароматизатор екона', 'ароматизатор свинца', 'ароматизатор дуба, идентичный натуральному', 'ароматизатор артофеля', 'лимонная кислота', 'загуститель', 'эмульгатор', 'консервант: сорбат калия', 'посолочная смесь: соль, нитрит натрия', 'ксилит', 'карбамид', 'вилларибо', 'виллабаджо'];
var GOODS_NUMBER = 26;
var GOODS_NUMBER_BASKET = 3;
var AMOUNT_MIN = 0;
var AMOUNT_MAX = 20;
var PRICE_MIN = 100;
var PRICE_MAX = 1500;
var WEIGHT_MIN = 30;
var WEIGHT_MAX = 300;
var RATING_MIN = 1;
var RATING_MAX = 5;
var RATING_NUMBER_MIN = 10;
var RATING_NUMBER_MAX = 900;
var ENERGY_MIN = 70;
var ENERGY_MAX = 500;

// функция выбора случайного элемента массива, возвращает случайный элемент переданного массива
var getRandomElement = function (array) {
  var index = Math.floor(array.length * Math.random());
  return array[index];
};

// функция генерации случайного целого значения в выбранном диапазоне
var getRandomValue = function (min, max) {
  return Math.round(Math.random() * (max - min)) + min;
};

// функция генерации случайного булева значания
var getRandomBoolean = function () {
  return Math.round(Math.random()) ? true : false;
};

var getRandomContents = function () {
  var numberOfСomponents = getRandomValue(1, mokContents.length);
  var contents = [];
  for (var i = 0; i < numberOfСomponents; i++) {
    contents[i] = getRandomElement(mokContents);
  }
  return contents.toString();
};

// функция генерации объекта-товара
var getMokElement = function () {
  var mokElement = {};
  mokElement.name = getRandomElement(mokNames);
  mokElement.picture = 'img/cards/' + getRandomElement(mokPictures);
  mokElement.amount = getRandomValue(AMOUNT_MIN, AMOUNT_MAX);
  mokElement.price = getRandomValue(PRICE_MIN, PRICE_MAX);
  mokElement.weight = getRandomValue(WEIGHT_MIN, WEIGHT_MAX);
  mokElement.rating = {};
  mokElement.rating.value = getRandomValue(RATING_MIN, RATING_MAX);
  mokElement.rating.number = getRandomValue(RATING_NUMBER_MIN, RATING_NUMBER_MAX);
  mokElement.nutritionFacts = {};
  mokElement.nutritionFacts.sugar = getRandomBoolean();
  mokElement.nutritionFacts.energy = getRandomValue(ENERGY_MIN, ENERGY_MAX);
  mokElement.nutritionFacts.contents = getRandomContents();
  return mokElement;
};

// функция создания массива данных
var getMokGoods = function (number) {
  var mokGoods = [];
  for (var i = 0; i < number; i++) {
    mokGoods[i] = getMokElement();
  }
  return mokGoods;
};

// функция отрисовки карточки товара по шаблону, передаем в нее данные о товаре в виде объекта и указатель на список куда отрисовывать карточку
var renderCard = function (cardData, list) {
  // находим и сохраняем шаблон
  var cardTemplate = document.querySelector('#card').content.cloneNode(true);

  // берем из шаблона карточку товара, очищаем класс доступности
  var card = cardTemplate.querySelector('.catalog__card');

  // добавим фото товара
  card.querySelector('.card__img').src = cardData.picture;

  // добавим карточке товара класс доступности в зависимости от количества
  card.classList.remove('card--in-stock');
  if (cardData.amount > 5) {
    card.classList.add('card--in-stock');
  }
  if (cardData.amount > 0 && cardData.amount <= 5) {
    card.classList.add('card--little');
  }
  if (cardData.amount === 0) {
    card.classList.add('card--soon');
  }

  // название вставляем в блок card__title
  card.querySelector('.card__title').textContent = cardData.name;

  // цену и вес вставляем в ноды в блок card__price
  card.querySelector('.card__price').childNodes[0].textContent = cardData.price + ' ';
  card.querySelector('.card__price').childNodes[2].textContent = '/ ' + cardData.weight + ' Г';

  // добавим нужный стиль в блок stars__rating
  var starsRatingStyles = ['stars__rating--one', 'stars__rating--two', 'stars__rating--three', 'stars__rating--four', 'stars__rating--five'];
  card.querySelector('.stars__rating').classList.remove('stars__rating--five');
  card.querySelector('.stars__rating').classList.add(starsRatingStyles[cardData.rating.value - 1]);

  // добавим количество голосов в блок star__count
  card.querySelector('.star__count').textContent = '( ' + cardData.rating.number + ' )';

  // оформим блок состав товара card__characteristic, добавим данные о наличии сахара
  if (cardData.nutritionFacts.sugar) {
    card.querySelector('.card__characteristic').textContent = 'Содержит сахар';
  } else {
    card.querySelector('.card__characteristic').textContent = 'Без сахара';
  }

  // оформим блок состав товара card__composition-list, добавим данные о содержащихся элементах
  card.querySelector('.card__composition-list').textContent = cardData.nutritionFacts.contents;

  // добавим сформированную карточку в блок товаров
  list.appendChild(card);
  // catalogCards.appendChild(card);
};

// создаем массив данных товаров в каталоге
var goods = getMokGoods(GOODS_NUMBER);

// найдем блок catalog__cards и уберем у него класс catalog__cards--load
var catalogCards = document.querySelector('.catalog__cards');
catalogCards.classList.remove('catalog__cards--load');

// найдем блок catalog__load и скроем его, добавив класс visually-hidden
var catalogLoad = document.querySelector('.catalog__load');
catalogLoad.classList.add('visually-hidden');

// отрисовываем карточки товаров в каталоге catalog__cards
for (var i = 0; i < goods.length; i++) {
  renderCard(goods[i], catalogCards);
}

// создаем массив данных товаров в корзине
var goodsInBusket = getMokGoods(GOODS_NUMBER_BASKET);

// отрисуем товары в корзине в блок goods__cards
var goodsCards = document.querySelector('.goods__cards');
for (i = 0; i < goodsInBusket.length; i++) {
  renderCard(goodsInBusket[i], goodsCards);
}

// удалим у блока товары в корзине goods__cards класс goods__cards--empty
goodsCards.classList.remove('goods__cards--empty');

// скроем блок goods__card-empty добавив ему класс visually-hidden
document.querySelector('.goods__card-empty').classList.add('visually-hidden');
