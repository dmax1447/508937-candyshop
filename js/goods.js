'use strict';
// модуль каталог
(function () {

  // служебные данные
  var starsRatingStyles = ['stars__rating--one', 'stars__rating--two', 'stars__rating--three', 'stars__rating--four', 'stars__rating--five'];

  // элементы интерфейса
  var catalogCards = document.querySelector('.catalog__cards'); // блок каталог товаров
  var goodsCards = document.querySelector('.goods__cards'); // блок товары в корзине
  var catalogLoad = document.querySelector('.catalog__load'); // блок уведомления о загрузке
  var busketInHeader = document.querySelector('.main-header__basket'); // корзинка в заголовке
  var orderData = window.data.goodsInOrder; // данные о заказах
  var catalogData = window.data.goodsInCatalog; // данные о каталоге
  // функция поиска товара в списке. передаем id товара и список где искать. вернет товар или undefind если его нет
  var findItemById = function (idValue, list) {
    var idValueInt = parseInt(idValue, 10);
    for (var i = 0; i < list.length; i++) {
      if (list[i].id === idValueInt) {
        return list[i];
      }
    }
    return undefined;
  };

  // обработчик кликов - работа кнопок в избранное и в корзину
  var onCatalogCardClick = function (evt) {
    // сохраним карточку, ее id и кнопки в ней
    var currentCard = evt.currentTarget; // текущая карточка
    var btnFavorite = currentCard.querySelector('.card__btn-favorite'); // кнопка избранное
    var btnChart = currentCard.querySelector('.card__btn'); // кнопка в корзину
    var id = currentCard.getAttribute('id'); // сохраняем id товара из карточки
    var goodsInCatalogItem = findItemById(id, catalogData); // найдем в каталоге товар соответствующий карточке
    if (evt.target === btnChart) { // если клик по кнопке в корзину
      if (goodsInCatalogItem.amount >= 1) { // проверяем есть ли товар в каталоге
        var goodsInOrderItem = findItemById(id, orderData); // пробуем найти в корзине товар соответствующий карточке
        if (goodsInOrderItem === undefined) { // если товара в корзине нет
          goodsInOrderItem = Object.assign({}, goodsInCatalogItem); // создаем объект и копируем в него данные из карточки товара
          delete goodsInOrderItem.amount; // удаляем ненужный ключ
          goodsInOrderItem.orderedAmount = 0; // устанавливаем начальное значение
          orderData.push(goodsInOrderItem); // добавляем созданный объект в массив корзина
          var newCard = window.busket.renderCardInBusket(goodsInOrderItem); // отрисуем карточку товара в корзине
          goodsCards.appendChild(newCard); // добавим ее в раздел корзина
        }
        goodsInOrderItem.orderedAmount++; // увеличим количество товара в объекте в корзине
        goodsInCatalogItem.amount--; // уменьшим количество товара в объекте в каталоге
        var cardInOrder = goodsCards.querySelector('[id="' + id + '"]');
        cardInOrder.querySelector('.card-order__count').value = goodsInOrderItem.orderedAmount; // обновим количество товара в карточке корзина
      }
      busketInHeader.textContent = 'В корзине: ' + window.busket.countAmountOfGoods(orderData);
    }
    // обработаем клик по кнопке в избранное
    /*
    if (evt.target === btnFavorite) {
      evt.preventDefault();
      btnFavorite.classList.toggle('card__btn-favorite--selected');
    }*/
  };
  var onBtnFavoriteClick = function (evt) {
    var btn = evt.target;
    evt.preventDefault();
    btn.classList.toggle('card__btn-favorite--selected');

  };

  var renderCard = function (id, cardData, list) {
    // находим и сохраняем шаблон
    var cardTemplate = document.querySelector('#card').content.cloneNode(true);
    var card = cardTemplate.querySelector('.catalog__card');
    var btnFavorite = card.querySelector('.card__btn-favorite');
    // добавим карточке id
    card.setAttribute('id', id);
    // заполним поля карточки по полученным данным
    card.querySelector('.card__img').src = cardData.picture;
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
    card.querySelector('.card__title').textContent = cardData.name;
    card.querySelector('.card__price').childNodes[0].textContent = cardData.price + ' ';
    card.querySelector('.card__price').childNodes[2].textContent = '/ ' + cardData.weight + ' Г';
    card.querySelector('.stars__rating').classList.remove('stars__rating--five');
    card.querySelector('.stars__rating').classList.add(starsRatingStyles[cardData.rating.value - 1]);
    card.querySelector('.star__count').textContent = '( ' + cardData.rating.number + ' )';
    var sugar = cardData.nutritionFacts.sugar ? 'Содержит сахар' : 'Без сахара';
    card.querySelector('.card__characteristic').textContent = sugar;
    card.querySelector('.card__composition-list').textContent = cardData.nutritionFacts.contents;
    // добавим обработчик клика на карточку товара
    card.addEventListener('click', onCatalogCardClick);
    btnFavorite.addEventListener('click', onBtnFavoriteClick);
    // добавим сформированную карточку в контейнер
    list.appendChild(card);
  };

  // у блока catalog__cards уберем класс catalog__cards--load
  catalogCards.classList.remove('catalog__cards--load');
  // блока catalog__load скроем, добавив класс visually-hidden
  catalogLoad.classList.add('visually-hidden');

  // отрисуем каталог по данным
  var fragmentCatalog = document.createDocumentFragment();
  for (var i = 0; i < catalogData.length; i++) {
    renderCard(i, catalogData[i], fragmentCatalog);
  }
  catalogCards.appendChild(fragmentCatalog);

  // удалим у блока товары в корзине goods__cards класс goods__cards--empty
  goodsCards.classList.remove('goods__cards--empty');
  // скроем блок goods__card-empty добавив ему класс visually-hidden
  document.querySelector('.goods__card-empty').classList.add('visually-hidden');

  // КОНЕЦ МОДУЛЯ
})();
