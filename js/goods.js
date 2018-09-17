'use strict';
var mockNames = ['Чесночные сливки', 'Огуречный педант', 'Молочная хрюша', 'Грибной шейк', 'Баклажановое безумие', 'Паприколу итальяно', 'Нинзя-удар васаби', 'Хитрый баклажан', 'Горчичный вызов', 'Кедровая липучка', 'Корманный портвейн', 'Чилийский задира', 'Беконовый взрыв', 'Арахис vs виноград', 'Сельдерейная душа', 'Початок в бутылке', 'Чернющий мистер чеснок', 'Раша федераша', 'Кислая мина', 'Кукурузное утро', 'Икорный фуршет', 'Новогоднее настроение', 'С пивком потянет', 'Мисс креветка', 'Бесконечный взрыв', 'Невинные винные', 'Бельгийское пенное', 'Острый язычок'];
var mockPictures = ['gum-cedar.jpg', 'gum-chile.jpg', 'gum-eggplant.jpg', 'gum-mustard.jpg', 'gum-portwine.jpg', 'gum-wasabi.jpg', 'ice-cucumber.jpg', 'ice-eggplant.jpg', 'ice-garlic.jpg', 'ice-italian.jpg', 'ice-mushroom.jpg', 'ice-pig.jpg', 'marmalade-beer.jpg', 'marmalade-caviar.jpg', 'marmalade-corn.jpg', 'marmalade-new-year.jpg', 'marmalade-sour.jpg', 'marshmallow-bacon.jpg', 'marshmallow-beer.jpg', 'marshmallow-shrimp.jpg', 'marshmallow-spicy.jpg', 'marshmallow-wine.jpg', 'soda-bacon.jpg', 'soda-celery.jpg', 'soda-cob.jpg', 'soda-garlic.jpg', 'soda-peanut-grapes.jpg',
  'soda-russian.jpg'];
var mockContents = ['молоко', 'сливки', 'вода', 'пищевой краситель', 'патока', 'ароматизатор бекона', 'ароматизатор свинца', 'ароматизатор дуба, идентичный натуральному', 'ароматизатор картофеля', 'лимонная кислота', 'загуститель', 'эмульгатор', 'консервант: сорбат калия', 'посолочная смесь: соль, нитрит натрия', 'ксилит', 'карбамид', 'вилларибо', 'виллабаджо'];
var starsRatingStyles = ['stars__rating--one', 'stars__rating--two', 'stars__rating--three', 'stars__rating--four', 'stars__rating--five'];
var GOODS_NUMBER = 10;
var GOODS_NUMBER_BASKET = 0;
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

// функция генерации составляющих продукта
var getRandomContents = function () {
  var numberOfСomponents = getRandomValue(1, mockContents.length);
  var contents = [];
  var element;
  for (var i = 0; i < numberOfСomponents; i++) {
    element = getRandomElement(mockContents);
    if (contents.indexOf(element) === -1) {
      contents.push(element);
    }
  }
  return contents.join(', ');
};

// функция генерации объекта-товара
var getMockElement = function () {
  var mockElement = {};
  mockElement.name = getRandomElement(mockNames);
  mockElement.picture = 'img/cards/' + getRandomElement(mockPictures);
  mockElement.amount = getRandomValue(AMOUNT_MIN, AMOUNT_MAX);
  mockElement.price = getRandomValue(PRICE_MIN, PRICE_MAX);
  mockElement.weight = getRandomValue(WEIGHT_MIN, WEIGHT_MAX);
  mockElement.rating = {};
  mockElement.rating.value = getRandomValue(RATING_MIN, RATING_MAX);
  mockElement.rating.number = getRandomValue(RATING_NUMBER_MIN, RATING_NUMBER_MAX);
  mockElement.nutritionFacts = {};
  mockElement.nutritionFacts.sugar = getRandomBoolean();
  mockElement.nutritionFacts.energy = getRandomValue(ENERGY_MIN, ENERGY_MAX);
  mockElement.nutritionFacts.contents = getRandomContents();
  mockElement.QtyinBasket = 0;
  mockElement.inFavorite = false;
  return mockElement;
};

// функция создания массива данных
var getMockGoods = function (number) {
  var mockGoods = [];
  for (var i = 0; i < number; i++) {
    mockGoods[i] = getMockElement();
  }
  return mockGoods;
};

// функция отрисовки карточки товара в каталоге. передаем в нее id для карточки, объект с данными и контейнер куда рисовать;
var renderCard = function (id, cardData, list) {
  // находим и сохраняем шаблон
  var cardTemplate = document.querySelector('#card').content.cloneNode(true);

  // берем из шаблона карточку товара, очищаем класс доступности
  var card = cardTemplate.querySelector('.catalog__card');

  // добавим фото товара
  card.querySelector('.card__img').src = cardData.picture;

  // добавим карточке id
  // var cardId = '#' + id;
  // card.classList.add(cardId);
  card.setAttribute('id', id);
  // добавим карточке товара класс доступности в зависимости от количества
  card.classList.remove('card--in-stock');
  switch (cardData.amount) {
    case 0:
      card.classList.add('card--soon');
      break;
    case 1: case 2: case 3: case 4:
      card.classList.add('card--little');
      break;
    default:
      card.classList.add('card--in-stock');
      break;
  }
  // название вставляем в блок card__title
  card.querySelector('.card__title').textContent = cardData.name;

  // цену и вес вставляем в ноды в блок card__price
  card.querySelector('.card__price').childNodes[0].textContent = cardData.price + ' ';
  card.querySelector('.card__price').childNodes[2].textContent = '/ ' + cardData.weight + ' Г';

  // добавим нужный стиль в блок stars__rating
  card.querySelector('.stars__rating').classList.remove('stars__rating--five');
  card.querySelector('.stars__rating').classList.add(starsRatingStyles[cardData.rating.value - 1]);

  // добавим количество голосов в блок star__count
  card.querySelector('.star__count').textContent = '( ' + cardData.rating.number + ' )';

  // оформим блок состав товара card__characteristic, добавим данные о наличии сахара
  var sugar = cardData.nutritionFacts.sugar ? 'Содержит сахар' : 'Без сахара';
  card.querySelector('.card__characteristic').textContent = sugar;

  // оформим блок состав товара card__composition-list, добавим данные о содержащихся элементах
  card.querySelector('.card__composition-list').textContent = cardData.nutritionFacts.contents;

  // добавим обработчик на кнопку "добавить в корзину"
  var btnToChart = card.querySelector('.card__btn');
  btnToChart.addEventListener('click', onBtnToChart);

  // добавим обработчик на кнопку "в избранное"
  var btnToFavorite = card.querySelector('.card__btn-favorite');
  btnToFavorite.addEventListener('click', onBtnToFavorite);

  // добавим обработчик клика на карточку товара
  card.addEventListener('click', onCardClick);

  // добавим сформированную карточку в контейнер
  list.appendChild(card);
  // catalogCards.appendChild(card);
};

// обработчик клика по кнопке в корзину
var onBtnToChart = function () {
  // console.log('В КОРЗИНУ');
};

// обработчик клика по кнопке избранное
var onBtnToFavorite = function () {
  // console.log('В ИЗБРАННОЕ');
};

// обработчик кликов для карточки
var onCardClick = function (evt) {
  // сохраним кнопки карточки и саму карточку в переменные
  var currentCard = evt.currentTarget;
  var btnFavorite = currentCard.querySelector('.card__btn-favorite');
  var btnChart = currentCard.querySelector('.card__btn');
  // сохраним id карточки
  var id = currentCard.getAttribute('id');
  // сохраним шаблон карточки в корзине
  // var cardInBusket = document.querySelector('#card-order').content.cloneNode(true);
  if (evt.target === btnChart) {
    // обработаем клик по кнопке в корзину
    // проверим есть ли товар в корзине, если есть то увеличим его количество
    if (goods[id].QtyinBasket === 0) {
      // если товара нет - рисуем его в корзине, и увеличиваем запись о его количестве на 1
      goods[id].QtyinBasket++;
      var newCard = renderCardInBusket(goods[id], id);
      goodsCards.appendChild(newCard);
    } else {
      // если товар есть - увеличим запись о его количестве на 1 и изменим данные на карточке
      goods[id].QtyinBasket++;
      var exitingCard = getCardInBusket(id);
      exitingCard.querySelector('.card-order__count').value++;
    }

  }
  if (evt.target === btnFavorite) {
    // обработаем клик по кнопке в избранное
  }
};

// функция отрисовки карточки в корзине, передадим в нее данные для отрисовки в виде объекта, а она вернет отрисованный элемент
var renderCardInBusket = function (cardData, id) {
  var cardTemplate = document.querySelector('#card-order').content.cloneNode(true);
  var card = cardTemplate.querySelector('.goods_card');
  card.setAttribute('id', id);
  card.querySelector('.card-order__title').textContent = cardData.name;
  card.querySelector('.card-order__img').src = cardData.picture;
  card.querySelector('.card-order__img').alt = cardData.name;
  card.querySelector('.card-order__price').textContent = cardData.price;
  card.querySelector('.card-order__count').value = 1;
  return card;
};

var getCardInBusket = function (id) {
  var idString = '[id="' + id + '"]';
  var card = goodsCards.querySelector(idString);
  return card;
};


// найдем блок catalog__cards и уберем у него класс catalog__cards--load
var catalogCards = document.querySelector('.catalog__cards');
catalogCards.classList.remove('catalog__cards--load');

// найдем блок catalog__load и скроем его, добавив класс visually-hidden
var catalogLoad = document.querySelector('.catalog__load');
catalogLoad.classList.add('visually-hidden');

// наполним каталог: создадим данные, контейнер для отрисовки в него карточек, отрисуем в него карточки и вставим контейнер в каталог
var goods = getMockGoods(GOODS_NUMBER);
var fragmentCatalog = document.createDocumentFragment();
for (var i = 0; i < goods.length; i++) {
  renderCard(i, goods[i], fragmentCatalog);
}
catalogCards.appendChild(fragmentCatalog);

// наполним корзину: создадим данные, контейнер, для отрисовки в него карточек, отрисуем в него карточки и вставим контейнер в корзину
var goodsInBusket = getMockGoods(GOODS_NUMBER_BASKET);
var fragmentBasket = document.createDocumentFragment();
var goodsCards = document.querySelector('.goods__cards');
for (i = 0; i < goodsInBusket.length; i++) {
  renderCard(i, goodsInBusket[i], fragmentBasket);
}
goodsCards.appendChild(fragmentBasket);

// удалим у блока товары в корзине goods__cards класс goods__cards--empty
goodsCards.classList.remove('goods__cards--empty');

// скроем блок goods__card-empty добавив ему класс visually-hidden
document.querySelector('.goods__card-empty').classList.add('visually-hidden');

