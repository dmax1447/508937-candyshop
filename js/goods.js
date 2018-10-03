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
  var rangePriceMin = document.querySelector('.range__price--min'); // поле цены левого пина
  var rangePriceMax = document.querySelector('.range__price--max'); // поле цены правого пина

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
    var orderData = window.data.goodsInOrder;
    var catalogData = window.data.goodsInCatalog;
    var currentCard = evt.currentTarget; // текущая карточка
    var btnFavorite = currentCard.querySelector('.card__btn-favorite'); // кнопка избранное
    var btnChart = currentCard.querySelector('.card__btn'); // кнопка в корзину
    var id = parseInt(currentCard.getAttribute('id'), 10); // сохраняем id товара из карточки
    var goodsInCatalogItem = catalogData[id]; // найдем в каталоге товар соответствующий карточке
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
      busketInHeader.textContent = 'В корзине: ' + orderData.length;

    }
    // обработаем клик по кнопке в избранное
    if (evt.target === btnFavorite) {
      evt.preventDefault();
      btnFavorite.classList.toggle('card__btn-favorite--selected');
      btnFavorite.blur();
      if (goodsInCatalogItem.isFavorite) {
        goodsInCatalogItem.isFavorite = false;
      } else {
        goodsInCatalogItem.isFavorite = true;
      }

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

  // Функция для отрисовки каталога, вернет подгтовленный каталог по входным данным
  var renderCatalog = function (cardsData) {
    var catalogFragment = document.createDocumentFragment(); // создаем пустой фрагмент
    for (var i = 0; i < cardsData.length; i++) {
      var card = renderCard(i, cardsData[i]);
      catalogFragment.appendChild(card); // вставляем сгенерированный по данным элемент(волшебника) в пустой фрагмент
    }
    return catalogFragment; // вернем подготовленный каталог
  };

  var clearCatalog = function () {
    var cards = document.querySelectorAll('.catalog__card');
    for (var i = 0; i < cards.length; i++) {
      catalogCards.removeChild(cards[i]);
    }
  };

  // Коллбек на загрузку списка товаров с сервера
  var onCatalogLoad = function (cardsData) {
    for (var i = 0; i < cardsData.length; i++) { // обработаем входные данные
      cardsData[i].id = i; // добавим идентификатор id каждой записи
      cardsData[i].isFavorite = false; // и поле избранное
    }
    window.data.goodsInCatalog = cardsData.slice(); // сохраним копию данных для дальнейшей работы
    var catalogFragment = renderCatalog(cardsData); // рендерим каталог по полученным данным
    catalogCards.classList.remove('catalog__cards--load'); // у блока catalog__cards уберем класс catalog__cards--load
    catalogLoad.classList.add('visually-hidden'); // блок catalog__load скроем, добавив класс visually-hidden
    catalogCards.appendChild(catalogFragment);
    goodsCards.classList.remove('goods__cards--empty'); // удалим у блока товары в корзине goods__cards класс goods__cards--empty
    document.querySelector('.goods__card-empty').classList.add('visually-hidden'); // скроем блок goods__card-empty добавив ему класс visually-hidden
    window.filters.minPrice = window.filters.findMinPrice(window.data.goodsInCatalog); // сохраним нижнюю границу цены
    window.filters.maxPrice = window.filters.findMaxPrice(window.data.goodsInCatalog); // сохраним верхнюю границу цены
    window.filters.minFilterPrice = window.filters.minPrice; // начальное минимальное значение фильтра = мин цена
    window.filters.maxFilterPrice = window.filters.maxPrice; // начальное максимальное значение фильтра = макс цена
    rangePriceMin.textContent = window.filters.minPrice;
    rangePriceMax.textContent = window.filters.maxPrice;
  };

  // пытаемся загрузить каталог, если удачно - то рендерим в список, если нет то выводим сообщение об ошибке
  window.backend.loadCatalog(onCatalogLoad, window.backend.showError);

  // экспорт:
  window.goods = {
    renderCatalog: renderCatalog,
    clearCatalog: clearCatalog
  };

})();
