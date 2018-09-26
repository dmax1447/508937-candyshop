// вспомогательный модуль
'use strict';
(function () {
  // константы и вспомогательные данные
  var mockNames = ['Чесночные сливки', 'Огуречный педант', 'Молочная хрюша', 'Грибной шейк', 'Баклажановое безумие', 'Паприколу итальяно', 'Нинзя-удар васаби', 'Хитрый баклажан', 'Горчичный вызов', 'Кедровая липучка', 'Корманный портвейн', 'Чилийский задира', 'Беконовый взрыв', 'Арахис vs виноград', 'Сельдерейная душа', 'Початок в бутылке', 'Чернющий мистер чеснок', 'Раша федераша', 'Кислая мина', 'Кукурузное утро', 'Икорный фуршет', 'Новогоднее настроение', 'С пивком потянет', 'Мисс креветка', 'Бесконечный взрыв', 'Невинные винные', 'Бельгийское пенное', 'Острый язычок'];
  var mockPictures = ['gum-cedar.jpg', 'gum-chile.jpg', 'gum-eggplant.jpg', 'gum-mustard.jpg', 'gum-portwine.jpg', 'gum-wasabi.jpg', 'ice-cucumber.jpg', 'ice-eggplant.jpg', 'ice-garlic.jpg', 'ice-italian.jpg', 'ice-mushroom.jpg', 'ice-pig.jpg', 'marmalade-beer.jpg', 'marmalade-caviar.jpg', 'marmalade-corn.jpg', 'marmalade-new-year.jpg', 'marmalade-sour.jpg', 'marshmallow-bacon.jpg', 'marshmallow-beer.jpg', 'marshmallow-shrimp.jpg', 'marshmallow-spicy.jpg', 'marshmallow-wine.jpg', 'soda-bacon.jpg', 'soda-celery.jpg', 'soda-cob.jpg', 'soda-garlic.jpg', 'soda-peanut-grapes.jpg', 'soda-russian.jpg'];
  var mockContents = ['молоко', 'сливки', 'вода', 'пищевой краситель', 'патока', 'ароматизатор бекона', 'ароматизатор свинца', 'ароматизатор дуба, идентичный натуральному', 'ароматизатор картофеля', 'лимонная кислота', 'загуститель', 'эмульгатор', 'консервант: сорбат калия', 'посолочная смесь: соль, нитрит натрия', 'ксилит', 'карбамид', 'вилларибо', 'виллабаджо'];
  var GOODS_NUMBER = 5;
  // var GOODS_NUMBER_BASKET = 0;
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

  // вспомогательные функции
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
  var getMockElement = function (_id) {
    var mockElement = {};
    mockElement.id = _id;
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
    mockElement.inFavorite = false;
    return mockElement;
  };

  // функция создания массива данных
  var getMockGoods = function (number) {
    var mockGoods = [];
    for (var i = 0; i < number; i++) {
      mockGoods[i] = getMockElement(i);
    }
    return mockGoods;
  };

  // экспортируемые данные:
  window.data = {
    goodsInCatalog: getMockGoods(GOODS_NUMBER),
    goodsInOrder: [],
    findItemById: function (idValue, list) {
      var idValueInt = parseInt(idValue, 10);
      for (var i = 0; i < list.length; i++) {
        if (list[i].id === idValueInt) {
          return list[i];
        }
      }
      return undefined;
    }
  };

})();
