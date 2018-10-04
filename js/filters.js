// модуль работы с фильтрами
'use strict';
(function () {
  var catalogFilterRange = document.querySelector('.range'); // блок с фильтром
  var leftPin = catalogFilterRange.querySelector('.range__btn--left');
  var rightPin = catalogFilterRange.querySelector('.range__btn--right'); // правый пин
  var rangeFilter = catalogFilterRange.querySelector('.range__filter');
  var range = rangeFilter.clientWidth; // ширина бара фильтра = диапазон
  var rangePriceMin = catalogFilterRange.querySelector('.range__price--min'); // поле цены левого пина
  var rangePriceMax = catalogFilterRange.querySelector('.range__price--max'); // поле цены правого пина
  var rangeFillLine = catalogFilterRange.querySelector('.range__fill-line'); // полоска между пинами
  var pinSize = 10;
  var catalogCards = document.querySelector('.catalog__cards'); // блок каталог товаров
  var filterForm = document.querySelector('form'); // форма фильтра
  var DEBOUNCE_INTERVAL = 1000;
  var lastTimeout;

  // объект для сохрания состояния фильтра
  var filterState = {
    'icecream': false,
    'soda': false,
    'gum': false,
    'marmalade': false,
    'marshmallows': false,
    'groupKindActive': false,
    'sugar-free': false,
    'vegetarian': false,
    'gluten-free': false,
    'groupNutritionActive': false,
    'availability': false,
    'favorite': false,
    'groupFavoriteAmountActive': false,
    'sortOrder': false,
    'minPrice': 0,
    'maxPrice': 90
  };

  // мапа соответствия тип товара в базе и типа выбранного фильтра
  var kindOfGoodToFilterValue = {
    'Мороженое': 'icecream',
    'Газировка': 'soda',
    'Жевательная резинка': 'gum',
    'Мармелад': 'marmalade',
    'Зефир': 'marshmallows'
  };

  // функция debounce
  var debounce = function (fun) {
    if (lastTimeout) {
      window.clearTimeout(lastTimeout);
    }
    lastTimeout = window.setTimeout(fun, DEBOUNCE_INTERVAL);
  };

  // функция расчета цены по положению пина
  var calculatePrice = function (x) {
    var relativePositionInPercent = Math.round((x * 100) / (range - pinSize)); // вычисляю положение в % от начала
    return Math.round((window.data.maxPrice - window.data.minPrice) * (relativePositionInPercent / 100) + window.data.minPrice); // вычисляю цену
  };
  var showEmptyFilterMessage = function () {
    var emptyFiltersTemplate = document.querySelector('#empty-filters').content.cloneNode(true); // форма ошибки при слишком строгом фильтре
    var emptyFiltersMessage = emptyFiltersTemplate.querySelector('.catalog__empty-filter');
    catalogCards.appendChild(emptyFiltersMessage);
  };


  var updateFilterState = function () {
    filterState['groupKindActive'] = false; // сбросим состояние активности у групп фильтра
    filterState['groupNutritionActive'] = false;
    filterState['groupFavoriteAmountActive'] = false;
    for (var i = 0; i <= 4; i++) { // проверяем группу инпутов "вид товара"
      var fieldName = filterForm[i].value; // читаем название инпута и пишем в поле имя свойства объекта
      var fieldState = filterForm[i].checked; // читаем состояние инпута и пишем в значение свойства объекта
      filterState[fieldName] = fieldState;
      if (fieldState) { // если встречаем активный инпут
        filterState['groupKindActive'] = true; // поднимаем флаг активности группы
      }
    }
    for (i = 5; i <= 7; i++) { // проверяем группу инпутов "состав товара"
      fieldName = filterForm[i].value;
      fieldState = filterForm[i].checked;
      filterState[fieldName] = fieldState;
      if (fieldState) {
        filterState['groupNutritionActive'] = true;
      }
    }
    for (i = 10; i <= 11; i++) { // проверяем группу инпутов "избранное / в наличии"
      fieldName = filterForm[i].value;
      fieldState = filterForm[i].checked;
      filterState[fieldName] = fieldState;
      if (fieldState) {
        filterState['groupFavoriteAmountActive'] = true;
      }
    }
    for (i = 12; i <= 15; i++) {
      if (filterForm[i].checked) {
        filterState.sortOrder = filterForm[i].value;
        break;
      }
    }
  };

  // фильтр каталога по значениям чекбоксов и цены
  var filterByFormSelections = function (item) {
    // свойства товара для фильтрации
    var isFilterPassed = false; // флаг соответствия фильтру
    var goodKind = kindOfGoodToFilterValue[item.kind]; // конвертим тип товара в фильтре под каталог
    var isKindMatched = false; // флаг соответствия типа товара
    var isNutritionMatched = false; // флаг соответствия состава товара
    var isPriceMatched = false;
    // проверяем соответствие типа товара
    if (filterState.groupKindActive) { // если фильтр по товару активен
      isKindMatched = filterState[goodKind]; // проверим соответствие товара фильтру
    } else { // если фильтр по товару не активен то считаем его пройденным
      isKindMatched = true;
    }
    // проверяем соответствие состава товара
    if (filterState.groupNutritionActive) { // если фильтр по составу активен
      if (filterState['gluten-free'] && item.nutritionFacts.gluten) { // проверяем совпадение значений фильтра и товара
        isNutritionMatched = true;
      }
      if (filterState['sugar-free'] && item.nutritionFacts.sugar) {
        isNutritionMatched = true;
      }
      if (filterState['vegetarian'] && item.nutritionFacts.vegetarian) {
        isNutritionMatched = true;
      }
    } else { // если фильтр по составу не активен то считаем его пройденным
      isNutritionMatched = true;
    }
    isFilterPassed = isKindMatched && isNutritionMatched;
    // если включен фильтр избранное и товар в избранном - считаем фильтр пройденным
    if (filterState.favorite) {
      return item.isFavorite;
    }
    if (filterState.availability) {
      return (item.amount > 0);
    }

    // если включен фильтр наличие и количество товара > 0 то считаем фильтр пройденным
    if (filterState.availability && item.amount > 0) {
      return true;
    }
    // проверяем соответствует ли товар границам по цене
    if (item.price >= filterState.minPrice && item.price <= filterState.maxPrice) {
      isPriceMatched = true;
    }
    return isFilterPassed && isPriceMatched;
  };

  // сортировка по данным формы
  var sortByFormSelection = function (item1, item2) {
    // если выбрана сортировка "сначала дорогие"
    if (filterState.sortOrder === 'expensive') {
      if (item2.price > item1.price) {
        return 1;
      }
      if (item2.price < item1.price) {
        return -1;
      }
    }
    // если выбрана сортировка "сначала дешевые"
    if (filterState.sortOrder === 'cheep') {
      if (item2.price < item1.price) {
        return 1;
      }
      if (item2.price > item1.price) {
        return -1;
      }
    }
    // если выбрана сортировка "по рейтингу"
    if (filterState.sortOrder === 'rating') {
      if (item2.rating.number > item1.rating.number) {
        return 1;
      }
      if (item2.rating.number < item1.rating.number) {
        return -1;
      }
    }
    // если выбрана сортировка "сначала популярные"
    if (filterState.sortOrder === 'popular') {
      if (item2.rating.value > item1.rating.value) {
        return 1;
      }
      if (item2.rating.value < item1.rating.value) {
        return -1;
      }
    }
    return 0;
  };

  // обработчик перемещения пина
  var onPinMouseDown = function (downEvt) { // при нажатии запоминаем пин и его позицию
    var pin = downEvt.target;
    var pinStart = pin.offsetLeft;
    var onPinMouseMove = function (moveEvt) {
      var pinCurrent = pinStart - (downEvt.clientX - moveEvt.clientX); // рассчитываем положение пина по сдвигу мыши и начальному положению
      if (pin === leftPin && pinCurrent >= 0 && pinCurrent < rightPin.offsetLeft) { // если пин левый
        pin.style.left = pinCurrent + 'px'; // двигаю пин
        filterState.minPrice = calculatePrice(pinCurrent); // вычисляю текущую цену и сохраняю в объекте window.filters
        rangePriceMin.textContent = filterState.minPrice; // обновляю текстовое поле под пином
        rangeFillLine.style.left = (pinCurrent + 10) + 'px'; // обновляю филллайн
      }
      if (pin === rightPin && pinCurrent > leftPin.offsetLeft && pinCurrent <= (range - pinSize)) { // если пин правый
        pin.style.left = pinCurrent + 'px'; // двигаю пин
        filterState.maxPrice = calculatePrice(pinCurrent); // вычисляю текущую цену и сохраняю в объекте window.filters
        rangePriceMax.textContent = filterState.maxPrice; // обновляю текстовое поле под пином
        rangeFillLine.style.right = (range - pinCurrent) + 'px'; // обновляю филллайн
      }
    };
    var onPinMouseUp = function () {
      // перерисовываем каталог по условию фильтра
      window.data.goodsFiltered = window.data.goodsInCatalog.filter(filterByFormSelections);
      refreshCatalog(window.data.goodsFiltered);
      if (window.data.goodsFiltered.length === 0) {
        showEmptyFilterMessage();
      }
      document.querySelector('span.range__count').textContent = '(' + window.data.goodsFiltered.length + ')';
      // описываем обработчик отпускания мыши
      document.removeEventListener('mousemove', onPinMouseMove); // удаляем обработчик "движение мыши"
      document.removeEventListener('mouseup', onPinMouseUp); // удаляем обработчик "отпускание кнопки мыши"
    };
    document.addEventListener('mousemove', onPinMouseMove); // запускаем обработчик "движение мыши"
    document.addEventListener('mouseup', onPinMouseUp); // запускаем обработчик "отпускание кнопки мыши"
  };

  // обработчик взаимодействий с чекбоксами формы фильтра
  var onFormChange = function () {
    // соберем данные для фильтра
    updateFilterState();
    window.data.goodsFiltered = window.data.goodsInCatalog.filter(filterByFormSelections);
    window.data.goodsFiltered.sort(sortByFormSelection);
    debounce(refreshCatalog(window.data.goodsFiltered));
    // refreshCatalog(window.data.goodsFiltered);
  };

  // обработчик кнопки сбросить на форме
  var onFormSubmit = function (evt) {
    evt.preventDefault();
    filterForm.reset();
    refreshCatalog(window.data.goodsInCatalog);
    window.data.initSlider(); // сбрасываем слайдер
    document.querySelector('span.range__count').textContent = '(' + window.data.goodsInCatalog.length + ')'; // сбрасываем значения цена: ()
  };

  // фуннкция обновления каталога
  var refreshCatalog = function (data) {
    window.goods.clearCatalog(); // очищаем каталог
    var refreshedCatalog = window.goods.renderCatalog(data); // рендерим новый каталог по фильтрованным данным
    catalogCards.appendChild(refreshedCatalog); // вставляем его на страницу
  };

  // добавляем обработчики
  leftPin.addEventListener('mousedown', onPinMouseDown); // нажатие кнопки мыши на левый пин
  rightPin.addEventListener('mousedown', onPinMouseDown); // нажатие кнопки мыши на правый пин
  filterForm.addEventListener('change', onFormChange); // на изменения в форме фильтра
  filterForm.addEventListener('submit', onFormSubmit); // на кнопку показать все в фильтре

  window.filters = {
    minPrice: null,
    maxPrice: null,
  };

})();
