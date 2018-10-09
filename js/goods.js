'use strict';
// модуль каталог
(function () {

  // служебные данные
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
  var catalogFilterRange = document.querySelector('.range'); // блок с фильтром
  var leftPin = catalogFilterRange.querySelector('.range__btn--left');
  var rightPin = catalogFilterRange.querySelector('.range__btn--right'); // правый пин
  var filterForm = document.querySelector('form'); // форма фильтра
  var rangeFilter = catalogFilterRange.querySelector('.range__filter');
  var range = rangeFilter.clientWidth; // ширина бара фильтра = диапазон
  var filterFavoriteInput = document.querySelector('#filter-favorite');
  var filterAvailabilityInput = document.querySelector('#filter-availability');
  var rangeFillLine = catalogFilterRange.querySelector('.range__fill-line'); // полоска между пинами
  var PIN_SIZE = 10;

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

  // функция поиска товара в списке. передаем id товара и список где искать. вернет товар или undefind если его нет

  // обработчик кликов - работа кнопок в избранное и в корзину
  var onCatalogCardClick = function (evt) {
    // сохраним карточку, ее id и кнопки в ней
    var currentCard = evt.currentTarget; // текущая карточка
    var btnFavorite = currentCard.querySelector('.card__btn-favorite'); // кнопка избранное
    var btnChart = currentCard.querySelector('.card__btn'); // кнопка в корзину
    var id = parseInt(currentCard.getAttribute('id'), 10); // сохраняем id товара из карточки
    var goodsInCatalogItem = window.data.goodsInCatalog[id]; // найдем в каталоге товар соответствующий карточке
    var cardInOrder = goodsCards.querySelector('[id="' + id + '"]'); // найдем карточку в каталоге соответствующую карточке в корзине
    if (evt.target === btnChart) { // если клик по кнопке в корзину
      evt.preventDefault();
      if (goodsInCatalogItem.amount >= 1) { // проверяем есть ли товар в каталоге
        var goodsInOrderItem = window.data.findItemById(id, window.data.goodsInOrder); // пробуем найти в корзине товар соответствующий карточке
        if (goodsInOrderItem === undefined) { // если товара в корзине нет
          goodsInOrderItem = Object.assign({}, goodsInCatalogItem); // создаем объект и копируем в него данные из карточки товара
          delete goodsInOrderItem.amount; // удаляем ненужный ключ
          goodsInOrderItem.orderedAmount = 0; // устанавливаем начальное значение
          window.data.goodsInOrder.push(goodsInOrderItem); // добавляем созданный объект в массив корзина
          var newCard = window.busket.renderCardInBusket(goodsInOrderItem); // отрисуем карточку товара в корзине
          goodsCards.appendChild(newCard); // добавим ее в раздел корзина
        }
        goodsInOrderItem.orderedAmount++; // увеличим количество товара в объекте в корзине
        goodsInCatalogItem.amount--; // уменьшим количество товара в объекте в каталоге
        cardInOrder.querySelector('.card-order__count').value = goodsInOrderItem.orderedAmount; // обновим количество товара в карточке корзина
        goodsCards.classList.remove('goods__cards--empty'); // удалим у блока товары в корзине goods__cards класс goods__cards--empty
        document.querySelector('.goods__card-empty').classList.add('visually-hidden'); // скроем блок goods__card-empty добавив ему класс visually-hidden
      }
      busketInHeader.textContent = 'В корзине: ' + window.data.goodsInOrder.length;
      window.busket.showCostOfGoods();
      window.busket.enableOrderForm();
      window.data.setCardClassAmount(currentCard, goodsInCatalogItem.amount);
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
    window.data.setCardClassAmount(card, cardData.amount);
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
    window.data.goodsInCatalog = cardsData.slice(); // сохраним копию данных для дальнейшей работы
    // window.data.goodsInCatalogOrigin = cardsData.slice(); // сохраним копию данных для восттановления
    var catalogFragment = renderCatalog(cardsData); // рендерим каталог по полученным данным
    catalogCards.classList.remove('catalog__cards--load'); // у блока catalog__cards уберем класс catalog__cards--load
    catalogLoad.classList.add('visually-hidden'); // блок catalog__load скроем, добавив класс visually-hidden
    catalogCards.appendChild(catalogFragment);
    window.data.minPrice = findMinPrice(window.data.goodsInCatalog); // сохраним нижнюю границу цены
    window.data.maxPrice = findMaxPrice(window.data.goodsInCatalog);
    rangePriceMin.textContent = window.data.minPrice;
    rangePriceMax.textContent = window.data.maxPrice;
    window.data.initSlider(); // выставляем начальные значния слайдера
    window.data.initFilterCounters(window.data.goodsInCatalog); // выставляем значения счетчиков
    window.busket.disableOrderForm(); // отключаем инпуты доставки
  };

  // функция расчета цены по положению пина
  var calculatePrice = function (x) {
    var relativePositionInPercent = Math.round((x * 100) / (range - PIN_SIZE)); // вычисляю положение в % от начала
    return Math.round((window.data.maxPrice - window.data.minPrice) * (relativePositionInPercent / 100) + window.data.minPrice); // вычисляю цену
  };

  // обработчик перемещения пинов
  var onPinMouseDown = function (downEvt) { // при нажатии запоминаем пин и его позицию
    var pin = downEvt.target;
    var pinStart = pin.offsetLeft;
    var onPinMouseMove = function (moveEvt) {
      var pinCurrent = pinStart - (downEvt.clientX - moveEvt.clientX); // рассчитываем положение пина по сдвигу мыши и начальному положению
      if (pin === leftPin && pinCurrent >= 0 && pinCurrent < rightPin.offsetLeft) { // если пин левый
        pin.style.left = pinCurrent + 'px'; // двигаю пин
        window.filters.activeFilter.minPrice = calculatePrice(pinCurrent); // вычисляю текущую цену и сохраняю в объекте window.filters
        rangePriceMin.textContent = window.filters.activeFilter.minPrice; // обновляю текстовое поле под пином
        rangeFillLine.style.left = (pinCurrent + 10) + 'px'; // обновляю филллайн
      }
      if (pin === rightPin && pinCurrent > leftPin.offsetLeft && pinCurrent <= (range - PIN_SIZE)) { // если пин правый
        pin.style.left = pinCurrent + 'px'; // двигаю пин
        window.filters.activeFilter.maxPrice = calculatePrice(pinCurrent); // вычисляю текущую цену и сохраняю в объекте window.filters
        rangePriceMax.textContent = window.filters.activeFilter.maxPrice; // обновляю текстовое поле под пином
        rangeFillLine.style.right = (range - pinCurrent) + 'px'; // обновляю филллайн
      }
    };
    var onPinMouseUp = function () {
      window.backend.debounce(refreshOnFilterChange); // обновляем информацию о каталоге
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
      window.backend.disableControls();
      window.filters.activeFilter.minPrice = 0;
      window.filters.activeFilter.maxPrice = 90;
      window.data.initSlider();
    }
    if (filterAvailabilityInput.checked || filterFavoriteInput.checked) {
      window.backend.disableControls();
    }
    if (!filterAvailabilityInput.checked && !filterFavoriteInput.checked) {
      window.backend.enableControls();
    }
    window.backend.debounce(refreshOnFilterChange);
  };

  // обработчик кнопки "показать все" в фильтрах
  var onFormSubmit = function (evt) {
    evt.preventDefault();
    filterForm.reset();
    window.backend.enableControls();
    window.backend.debounce(refreshOnFilterChange);
    window.data.initSlider();
  };

  // функция обновляет каталог, счетчики, данных о фильтрах
  var refreshOnFilterChange = function () {
    window.data.goodsFiltered = window.filters.filterAndSortCatalog(window.data.goodsInCatalog); // прогняем данные через фильтр (согласно состоянию фильтров)
    refreshCatalog(window.data.goodsFiltered); // отрисовываем карточки заново
    if (window.data.goodsFiltered.length === 0) { // если фильтры слишком строгие
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

  window.backend.loadCatalog(onCatalogLoad, window.backend.showError); // пытаемся загрузить каталог, если удачно - то рендерим в список, если нет то выводим сообщение об ошибке
  leftPin.addEventListener('mousedown', onPinMouseDown); // нажатие кнопки мыши на левый пин
  rightPin.addEventListener('mousedown', onPinMouseDown); // нажатие кнопки мыши на правый пин
  filterForm.addEventListener('change', onFormChange); // на изменения в форме фильтра
  filterForm.addEventListener('submit', onFormSubmit); // на кнопку показать все в фильтре


})();
