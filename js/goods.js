'use strict';
// модуль каталог
(function () {
  var PIN_SIZE = 10;
  var MIN_PRICE = 0;
  var MAX_PRICE = 90;
  // служебные данные
  var startsToSyle = {
    1: 'stars__rating--one',
    2: 'stars__rating--two',
    3: 'stars__rating--three',
    4: 'stars__rating--four',
    5: 'stars__rating--five'
  };

  // элементы интерфейса
  var catalogSidebar = document.querySelector('.catalog__sidebar'); // блок фильтров
  var catalogCards = document.querySelector('.catalog__cards'); // блок каталог товаров
  var goodsCards = document.querySelector('.goods__cards'); // блок товары в корзине
  var catalogLoad = catalogCards.querySelector('.catalog__load'); // блок уведомления о загрузке
  var busketInHeader = document.querySelector('.main-header__basket'); // корзинка в заголовке
  var rangePriceMin = catalogSidebar.querySelector('.range__price--min'); // поле цены левого пина
  var rangePriceMax = catalogSidebar.querySelector('.range__price--max'); // поле цены правого пина
  var catalogFilterRange = catalogSidebar.querySelector('.range'); // блок с фильтром
  var leftPin = catalogFilterRange.querySelector('.range__btn--left');
  var rightPin = catalogFilterRange.querySelector('.range__btn--right'); // правый пин
  var filterForm = catalogSidebar.querySelector('form'); // форма фильтра
  var rangeFilter = catalogFilterRange.querySelector('.range__filter');
  var range = rangeFilter.clientWidth; // ширина бара фильтра = диапазон
  var filterFavoriteInput = catalogSidebar.querySelector('#filter-favorite');
  var filterAvailabilityInput = catalogSidebar.querySelector('#filter-availability');
  var rangeFillLine = catalogFilterRange.querySelector('.range__fill-line'); // полоска между пинами

  // поиск минимальной цены в каталоге
  var findMinPrice = function (cardsData) {
    var min = cardsData[0].price;
    for (var i = 0; i < cardsData.length; i++) {
      if (cardsData[i].price < min) {
        min = cardsData[i].price;
      }
    }
    return min;
  };

  // поиск максиальной цены в каталоге
  var findMaxPrice = function (cardsData) {
    var max = cardsData[0].price;
    for (var i = 0; i < cardsData.length; i++) {
      if (cardsData[i].price > max) {
        max = cardsData[i].price;
      }
    }
    return max;
  };

  // обработчик кликов - работа кнопок в избранное и в корзину
  var onCatalogCardClick = function (evt) {
    // сохраним карточку, ее id и кнопки в ней
    var currentCard = evt.currentTarget; // текущая карточка
    var btnFavorite = currentCard.querySelector('.card__btn-favorite'); // кнопка избранное
    var btnChart = currentCard.querySelector('.card__btn'); // кнопка в корзину
    var id = parseInt(currentCard.getAttribute('id'), 10); // сохраняем id товара из карточки
    var goodsInCatalogItem = window.utils.goodsInCatalog[id]; // найдем в каталоге товар соответствующий карточке
    if (evt.target === btnChart) { // если клик по кнопке в корзину
      evt.preventDefault();
      if (goodsInCatalogItem.amount >= 1) { // проверяем есть ли товар в каталоге
        var goodsInOrderItem = window.utils.findItemById(id, window.utils.goodsInOrder); // пробуем найти в корзине товар соответствующий карточке
        if (goodsInOrderItem === undefined) { // если товара в корзине нет
          goodsInOrderItem = Object.assign({}, goodsInCatalogItem); // создаем объект и копируем в него данные из карточки товара
          delete goodsInOrderItem.amount; // удаляем ненужный ключ
          goodsInOrderItem.orderedAmount = 0; // устанавливаем начальное значение
          window.utils.goodsInOrder.push(goodsInOrderItem); // добавляем созданный объект в массив корзина
          var newCard = window.busket.renderCardInBusket(goodsInOrderItem); // отрисуем карточку товара в корзине
          goodsCards.appendChild(newCard); // добавим ее в раздел корзина
        }
        goodsInOrderItem.orderedAmount++; // увеличим количество товара в объекте в корзине
        goodsInCatalogItem.amount--; // уменьшим количество товара в объекте в каталоге
        var cardInOrder = goodsCards.querySelector('[id="' + id + '"]');
        cardInOrder.querySelector('.card-order__count').value = goodsInOrderItem.orderedAmount; // обновим количество товара в карточке корзина
        goodsCards.classList.remove('goods__cards--empty'); // удалим у блока товары в корзине goods__cards класс goods__cards--empty
        document.querySelector('.goods__card-empty').classList.add('visually-hidden'); // скроем блок goods__card-empty добавив ему класс visually-hidden
      }
      busketInHeader.textContent = 'В корзине: ' + window.utils.goodsInOrder.length;
      window.busket.showCostOfGoods();
      window.busket.enableOrderForm();
      window.utils.setCardClassAmount(currentCard, goodsInCatalogItem.amount);
    }
    if (evt.target === btnFavorite) { // обработаем клик по кнопке в избранное
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

  // отприсовка карточки в каталоге
  var renderCard = function (cardData) {
    var cardTemplate = document.querySelector('#card').content.cloneNode(true); // находим и сохраняем шаблон
    var card = cardTemplate.querySelector('.catalog__card');
    var sugar = cardData.nutritionFacts.sugar ? 'Содержит сахар' : 'Без сахара';
    // очищаем карточку
    card.querySelector('.stars__rating').classList.remove('stars__rating--five');
    // добавляем данные
    card.setAttribute('id', cardData.id); // добавим карточке id
    card.querySelector('.card__title').textContent = cardData.name;
    card.querySelector('.card__img').src = 'img/cards/' + cardData.picture;
    window.utils.setCardClassAmount(card, cardData.amount);
    card.querySelector('.card__price').childNodes[0].textContent = cardData.price + ' ';
    card.querySelector('.card__price').childNodes[2].textContent = '/ ' + cardData.weight + ' Г';
    card.querySelector('.stars__rating').classList.add(startsToSyle[cardData.rating.value]);
    card.querySelector('.star__count').textContent = '( ' + cardData.rating.number + ' )';
    card.querySelector('.card__characteristic').textContent = sugar;
    card.querySelector('.card__composition-list').textContent = cardData.nutritionFacts.contents;
    if (cardData.isFavorite) {
      var btnFavorite = card.querySelector('.card__btn-favorite');
      btnFavorite.classList.toggle('card__btn-favorite--selected');
    }
    card.addEventListener('click', onCatalogCardClick); // добавим обработчик клика на карточку товара
    return card;
  };

  // Функция для отрисовки каталога, вернет подгтовленный каталог по входным данным
  var renderCatalog = function (cardsData) {
    var catalogFragment = document.createDocumentFragment(); // создаем пустой фрагмент
    for (var i = 0; i < cardsData.length; i++) {
      var card = renderCard(cardsData[i]);
      catalogFragment.appendChild(card); // вставляем сгенерированный по данным элемент(волшебника) в пустой фрагмент
    }
    return catalogFragment; // вернем подготовленный каталог
  };

  // функция очистки каталога
  var clearCatalog = function () {
    var cards = document.querySelectorAll('.catalog__card');
    for (var i = 0; i < cards.length; i++) {
      catalogCards.removeChild(cards[i]);
    }
    var errorMessage = document.querySelector('.catalog__empty-filter');
    if (errorMessage !== null) {
      catalogCards.removeChild(errorMessage);
    }
  };

  // Коллбек на загрузку списка товаров с сервера
  var onCatalogLoad = function (cardsData) {
    for (var i = 0; i < cardsData.length; i++) { // обработаем входные данные
      cardsData[i].id = i; // добавим идентификатор id каждой записи
      cardsData[i].isFavorite = false; // и поле избранное
    }
    window.utils.goodsInCatalog = cardsData.slice(); // сохраним копию данных для дальнейшей работы
    var catalogFragment = renderCatalog(cardsData); // рендерим каталог по полученным данным
    catalogCards.classList.remove('catalog__cards--load'); // у блока catalog__cards уберем класс catalog__cards--load
    catalogLoad.classList.add('visually-hidden'); // блок catalog__load скроем, добавив класс visually-hidden
    catalogCards.appendChild(catalogFragment);
    window.utils.minPrice = findMinPrice(window.utils.goodsInCatalog); // сохраним нижнюю границу цены
    window.utils.maxPrice = findMaxPrice(window.utils.goodsInCatalog);
    rangePriceMin.textContent = window.utils.minPrice;
    rangePriceMax.textContent = window.utils.maxPrice;
    window.utils.initSlider(); // выставляем начальные значния слайдера
    window.utils.initFilterCounters(window.utils.goodsInCatalog); // выставляем значения счетчиков
    window.busket.disableOrderForm(); // отключаем инпуты доставки
  };

  // функция расчета цены по положению пина
  var calculatePrice = function (x) {
    var relativePositionInPercent = Math.round((x * 100) / (range - PIN_SIZE)); // вычисляю положение в % от начала
    return Math.round((window.utils.maxPrice - window.utils.minPrice) * (relativePositionInPercent / 100) + window.utils.minPrice); // вычисляю цену
  };

  // обработка движения пина
  var onPinMouseDown = function (downEvt) {
    var pin = downEvt.target;
    var pinPosition = {
      min: pin === leftPin ? 0 : leftPin.offsetLeft,
      max: pin === leftPin ? rightPin.offsetLeft : (range - PIN_SIZE),
      current: null,
      start: pin.offsetLeft
    };
    var rangePrice = pin === leftPin ? rangePriceMin : rangePriceMax;

    var onPinMouseMove = function (moveEvt) {
      pinPosition.current = pinPosition.start - (downEvt.clientX - moveEvt.clientX);
      if (pinPosition.current >= pinPosition.min && pinPosition.current <= pinPosition.max) {
        pin.style.left = pinPosition.current + 'px'; // двигаю пин
        rangeFillLine.style[(pin === leftPin ? 'left' : 'right')] = (pin === leftPin ? pinPosition.current + PIN_SIZE : range - pinPosition.current) + 'px';
        rangePrice.textContent = calculatePrice(pinPosition.current); // обновляем поле с ценой
      }
    };

    var onPinMouseUp = function () {
      window.filters[pin === leftPin ? 'minPrice' : 'maxPrice'] = rangePrice.textContent;
      window.utils.debounce(refreshOnFilterChange); // обновляем информацию о каталоге
      document.removeEventListener('mousemove', onPinMouseMove); // удаляем обработчик "движение мыши"
      document.removeEventListener('mouseup', onPinMouseUp); // удаляем обработчик "отпускание кнопки мыши"
    };
    document.addEventListener('mousemove', onPinMouseMove); // запускаем обработчик "движение мыши"
    document.addEventListener('mouseup', onPinMouseUp); // запускаем обработчик "отпускание кнопки мыши"
  };

  // обработчик изменений фильтров в форме
  var onFormChange = function (evt) {
    // соберем данные для фильтра
    if (evt.target === filterFavoriteInput && filterAvailabilityInput.checked) {
      filterAvailabilityInput.checked = false;
    }
    if (evt.target === filterAvailabilityInput && filterFavoriteInput.checked) {
      filterFavoriteInput.checked = false;
    }
    if (evt.target === filterAvailabilityInput || evt.target === filterFavoriteInput) {
      for (var i = 0; i <= 8; i++) {
        filterForm[i].checked = false;
      }
      window.utils.disableControls();
      window.filters.minPrice = MIN_PRICE;
      window.filters.maxPrice = MAX_PRICE;
      window.utils.initSlider();
    }
    if (filterAvailabilityInput.checked || filterFavoriteInput.checked) {
      window.utils.disableControls();
    }
    if (!filterAvailabilityInput.checked && !filterFavoriteInput.checked) {
      window.utils.enableControls();
    }
    window.utils.debounce(refreshOnFilterChange);
  };

  // обработчик кнопки "показать все" в фильтрах
  var onFormSubmit = function (evt) {
    evt.preventDefault();
    filterForm.reset();
    window.utils.enableControls();
    window.utils.debounce(refreshOnFilterChange);
    window.utils.initSlider();
  };

  // функция обновляет каталог, счетчики, данных о фильтрах
  var refreshOnFilterChange = function () {
    window.utils.goodsFiltered = window.filters.filterAndSortCatalog(window.utils.goodsInCatalog); // прогняем данные через фильтр (согласно состоянию фильтров)
    refreshCatalog(window.utils.goodsFiltered); // отрисовываем карточки заново
    if (window.utils.goodsFiltered.length === 0) { // если фильтры слишком строгие
      showEmptyFilterMessage(); // показываем сообщение
    }
  };

  // фуннкция рендера каталога
  var refreshCatalog = function (data) {
    clearCatalog(); // очищаем каталог
    var refreshedCatalog = renderCatalog(data); // рендерим новый каталог по фильтрованным данным
    catalogCards.appendChild(refreshedCatalog); // вставляем его на страницу
  };

  // функция показывает сообщение об ошибке строгих фильтров
  var showEmptyFilterMessage = function () {
    var emptyFiltersTemplate = document.querySelector('#empty-filters').content.cloneNode(true);
    var emptyFiltersMessage = emptyFiltersTemplate.querySelector('.catalog__empty-filter');
    catalogCards.appendChild(emptyFiltersMessage);
  };

  window.backend.loadCatalog(onCatalogLoad, window.utils.showError); // пытаемся загрузить каталог, если удачно - то рендерим в список, если нет то выводим сообщение об ошибке
  leftPin.addEventListener('mousedown', onPinMouseDown); // нажатие кнопки мыши на левый пин
  rightPin.addEventListener('mousedown', onPinMouseDown); // нажатие кнопки мыши на правый пин
  filterForm.addEventListener('change', onFormChange); // на изменения в форме фильтра
  filterForm.addEventListener('submit', onFormSubmit); // на кнопку показать все в фильтре


})();
