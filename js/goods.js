'use strict';
// модуль каталог
(function () {

  // служебные данные
  // var starsRatingStyles = ['', 'stars__rating--one', 'stars__rating--two', 'stars__rating--three', 'stars__rating--four', 'stars__rating--five'];
  var startsToSyle = {
    1: 'stars__rating--one',
    2: 'stars__rating--two',
    3: 'stars__rating--three',
    4: 'stars__rating--four',
    5: 'stars__rating--five'
  };

  // элементы интерфейса
  var catalogCards = document.querySelector('.catalog__cards'); // блок каталог товаров
  var goodsCards = document.querySelector('.goods__cards'); // блок товары в корзине
  var catalogLoad = document.querySelector('.catalog__load'); // блок уведомления о загрузке
  var busketInHeader = document.querySelector('.main-header__basket'); // корзинка в заголовке
  var modalError = document.querySelector('.modal--error'); // блок сообщение об ошибке
  // var modalSuccess = document.querySelector('modal--success'); // блок сообщение об успешном действии
  var orderData = window.data.goodsInOrder; // данные о заказах
  var catalogData; // данные о каталоге
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
    // debugger;
    // сохраним карточку, ее id и кнопки в ней
    var currentCard = evt.currentTarget; // текущая карточка
    var btnFavorite = currentCard.querySelector('.card__btn-favorite'); // кнопка избранное
    var btnChart = currentCard.querySelector('.card__btn'); // кнопка в корзину
    var id = currentCard.getAttribute('id'); // сохраняем id товара из карточки
    var goodsInCatalogItem = findItemById(id, catalogData); // найдем в каталоге товар соответствующий карточке
    if (evt.target === btnChart) { // если клик по кнопке в корзину
      evt.preventDefault();
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
    if (evt.target === btnFavorite) {
      evt.preventDefault();
      btnFavorite.classList.toggle('card__btn-favorite--selected');
      btnFavorite.blur();
    }
  };

  var renderCard = function (id, cardData) {
    var cardTemplate = document.querySelector('#card').content.cloneNode(true); // находим и сохраняем шаблон
    var card = cardTemplate.querySelector('.catalog__card');
    var sugar = cardData.nutritionFacts.sugar ? 'Содержит сахар' : 'Без сахара';
    // очищаем карточку
    card.classList.remove('card--in-stock');
    card.querySelector('.stars__rating').classList.remove('stars__rating--five');
    // добавляем данные
    card.setAttribute('id', id); // добавим карточке id
    card.querySelector('.card__title').textContent = cardData.name;
    card.querySelector('.card__img').src = 'img/cards/' + cardData.picture;
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
    card.querySelector('.card__price').childNodes[0].textContent = cardData.price + ' ';
    card.querySelector('.card__price').childNodes[2].textContent = '/ ' + cardData.weight + ' Г';
    card.querySelector('.stars__rating').classList.add(startsToSyle[cardData.rating.value]);
    card.querySelector('.star__count').textContent = '( ' + cardData.rating.number + ' )';
    card.querySelector('.card__characteristic').textContent = sugar;
    card.querySelector('.card__composition-list').textContent = cardData.nutritionFacts.contents;
    card.addEventListener('click', onCatalogCardClick); // добавим обработчик клика на карточку товара
    return card;
  };

  // Функция для отрисовки каталога
  var renderCatalog = function (cardsData) {
    // catalogData = cardsData; // сохраним полученные данные для дальнейшей работы
    var catalogFragment = document.createDocumentFragment(); // создаем пустой фрагмент
    for (var i = 0; i < cardsData.length; i++) {
      var card = renderCard(i, cardsData[i]);
      catalogFragment.appendChild(card); // вставляем сгенерированный по данным элемент(волшебника) в пустой фрагмент
    }
    catalogCards.appendChild(catalogFragment);
  };
  // Функция показывает сообщение об ошибке:
  var showErrorMessage = function (message) {
    modalError.classList.toggle('modal--hidden');
    modalError.querySelector('p').textContent = 'Произошла ошибка: ' + message;
  };

  window.backend.loadCatalog(renderCatalog, showErrorMessage); // пытаемся загрузить каталог, если удачно - то рендерим в список, если нет то выводим сообщение об ошибке
  catalogCards.classList.remove('catalog__cards--load'); // у блока catalog__cards уберем класс catalog__cards--load
  catalogLoad.classList.add('visually-hidden'); // блока catalog__load скроем, добавив класс visually-hidden
  goodsCards.classList.remove('goods__cards--empty'); // удалим у блока товары в корзине goods__cards класс goods__cards--empty
  document.querySelector('.goods__card-empty').classList.add('visually-hidden'); // скроем блок goods__card-empty добавив ему класс visually-hidden

})();
