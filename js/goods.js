'use strict';
// модуль каталог
(function () {

  // служебные данные
  var starsRatingStyles = ['stars__rating--one', 'stars__rating--two', 'stars__rating--three', 'stars__rating--four', 'stars__rating--five'];

  // элементы интерфейса
  var catalogCards = document.querySelector('.catalog__cards'); // блок каталог товаров
  var goodsCards = document.querySelector('.goods__cards'); // блок товары в корзине
  var catalogLoad = document.querySelector('.catalog__load'); // блок уведомления о загрузке

  // элементы каталога


  // обработчик кликов - работа кнопок в избранное и в корзину
  var onCatalogCardClick = function (evt) {
    // сохраним карточку, ее id и кнопки в ней
    var currentCard = evt.currentTarget;
    var btnFavorite = currentCard.querySelector('.card__btn-favorite');
    var btnChart = currentCard.querySelector('.card__btn');
    var id = currentCard.getAttribute('id');
    if (evt.target === btnChart) { // если клик по кнопке в корзину
      if (window.data.goods[id].orderCount === 0) {
        // если товара нет - рисуем его в корзине, и увеличиваем запись о его количестве на 1
        window.data.goods[id].orderCount++;
        var newCard = window.busket.renderCardInBusket(window.data.goods[id], id);
        goodsCards.appendChild(newCard);
      } else {
        // если товар есть - увеличим запись о его количестве на 1 и изменим данные на карточке
        window.data.goods[id].orderCount++;
        var exitingCard = goodsCards.querySelector('[id="' + id + '"]');
        exitingCard.querySelector('.card-order__count').value++;
      }
    }
    // обработаем клик по кнопке в избранное
    if (evt.target === btnFavorite) {
      btnFavorite.classList.toggle('card__btn-favorite--selected');
    }
  };

  var renderCard = function (id, cardData, list) {
    // находим и сохраняем шаблон
    var cardTemplate = document.querySelector('#card').content.cloneNode(true);
    var card = cardTemplate.querySelector('.catalog__card');
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
    // добавим сформированную карточку в контейнер
    list.appendChild(card);
  };

  // у блока catalog__cards уберем класс catalog__cards--load
  catalogCards.classList.remove('catalog__cards--load');
  // блока catalog__load скроем, добавив класс visually-hidden
  catalogLoad.classList.add('visually-hidden');

  // отрисуем каталог по данным
  var fragmentCatalog = document.createDocumentFragment();
  for (var i = 0; i < window.data.goods.length; i++) {
    renderCard(i, window.data.goods[i], fragmentCatalog);
  }
  catalogCards.appendChild(fragmentCatalog);

  // удалим у блока товары в корзине goods__cards класс goods__cards--empty
  goodsCards.classList.remove('goods__cards--empty');
  // скроем блок goods__card-empty добавив ему класс visually-hidden
  document.querySelector('.goods__card-empty').classList.add('visually-hidden');

  // КОНЕЦ МОДУЛЯ
})();
