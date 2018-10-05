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
  var filterFavoriteInput = document.querySelector('#filter-favorite');
  var filterAvailabilityInput = document.querySelector('#filter-availability');

  var activeFilters = {
    foodType: null,
    foodProperty: null,
    sortOrder: null,
    isFavorite: false,
    amount: false,
    minPrice: 0,
    maxPrice: 90
  };
  var DEBOUNCE_INTERVAL = 500;
  var lastTimeout;

  // мапа соответствия тип товара в базе и типа выбранного фильтра
  var kindOfGoodToFilterValue = {
    'Мороженое': 'icecream',
    'Газировка': 'soda',
    'Жевательная резинка': 'gum',
    'Мармелад': 'marmalade',
    'Зефир': 'marshmallows'
  };
  var foodPropertyToNutritionFacts = {
    'sugar-free': 'sugar',
    'vegetarian': 'vegetarian',
    'gluten-free': 'gluten'
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

  // функция показывает сообщение об ошибке строгих фильтров
  var showEmptyFilterMessage = function () {
    var emptyFiltersTemplate = document.querySelector('#empty-filters').content.cloneNode(true);
    var emptyFiltersMessage = emptyFiltersTemplate.querySelector('.catalog__empty-filter');
    catalogCards.appendChild(emptyFiltersMessage);
  };

  var getFiltersAndSortOrder = function () {
    // очищаем старые данные о фильтрах перед обновлением:
    activeFilters.foodType = [];
    activeFilters.foodProperty = [];
    var activeInputsByFoodType = filterForm.querySelectorAll('[name="food-type"]:checked');
    var activeInputsByFoodProperty = filterForm.querySelectorAll('[name="food-property"]:checked');
    activeInputsByFoodType.forEach(function (item) {
      activeFilters.foodType.push(item.value);
    });
    activeInputsByFoodProperty.forEach(function (item) {
      activeFilters.foodProperty.push(foodPropertyToNutritionFacts[item.value]);
    });
    activeFilters.sortOrder = filterForm.querySelector('[name="sort"]:checked').value;
    activeFilters.isFavorite = document.querySelector('#filter-favorite').checked;
    activeFilters.amount = document.querySelector('#filter-availability').checked;
  };

  var filterGoods = function (item) {
    var isFoodTypeMatch = false;
    var isFoodPropertyMatch = false;
    var isPriceMatched = false;

    if (activeFilters.isFavorite) {
      return item.isFavorite;
    }
    if (activeFilters.amount) {
      return item.amount > 0;
    }

    if (activeFilters.foodType.length > 0) {
      isFoodTypeMatch = checkFoodTypeInFilters(item);
    } else {
      isFoodTypeMatch = true;
    }
    if (activeFilters.foodProperty.length > 0) {
      isFoodPropertyMatch = checkFoodPropertyInFilters(item);
    } else {
      isFoodPropertyMatch = true;
    }
    if (item.price >= activeFilters.minPrice && item.price <= activeFilters.maxPrice) {
      isPriceMatched = true;
    }
    return isFoodTypeMatch && isFoodPropertyMatch && isPriceMatched;
  };
  // всопмогателльная функция для фильтрации, проверяет товар на соответствие по типу
  var checkFoodTypeInFilters = function (item) {
    var goodKind = kindOfGoodToFilterValue[item.kind];
    return (activeFilters.foodType.indexOf(goodKind) > -1);
  };
  // всопмогателльная функция для фильтрации, проверяет товар на соответствие по составу
  var checkFoodPropertyInFilters = function (item) {
    for (var i = 0; i < activeFilters.foodProperty.length; i++) { // ищем циклом по фильтруемым полям
      if (item.nutritionFacts[activeFilters.foodProperty[i]]) { // поля в поле продукта у которых фильруемый тип true
        return true;
      }
    }
    return false;
  };
  // сравнение товаров по цене
  var comapareByPrice = function (item1, item2) {
    if (item2.price > item1.price) {
      return 1;
    }
    if (item2.price < item1.price) {
      return -1;
    } else {
      return 0;
    }
  };
  // сравнение товаров по рейтингу
  var comapareByRating = function (item1, item2) {
    if (item2.rating.value > item1.rating.value) {
      return 1;
    }
    if (item2.rating.value < item1.rating.value) {
      return -1;
    }
    if (item2.rating.value === item1.rating.value) {
      if (item2.rating.number > item1.rating.number) {
        return 1;
      }
      if (item2.rating.number < item1.rating.number) {
        return -1;
      }
    }
    return 0;
  };
  // сравнение товаров по популярности
  var comapareByPopuarity = function (item1, item2) {
    if (item2.id < item1.id) {
      return 1;
    }
    if (item2.id > item1.id) {
      return -1;
    } else {
      return 0;
    }
  };


  // сортировка данных каталога. тип сортировки берем из filterState
  var sortByFormSelection = function (item1, item2) {
    // если выбрана сортировка "сначала дорогие"
    var result;
    switch (activeFilters.sortOrder) {
      case 'expensive':
        result = comapareByPrice(item1, item2);
        break;
      case 'cheep':
        result = comapareByPrice(item2, item1);
        break;
      case 'rating':
        result = comapareByRating(item1, item2);
        break;
      case 'popular':
        result = comapareByPopuarity(item1, item2);
        break;
    }
    return result;
  };

  // обработчик перемещения пина
  var onPinMouseDown = function (downEvt) { // при нажатии запоминаем пин и его позицию
    var pin = downEvt.target;
    var pinStart = pin.offsetLeft;
    var onPinMouseMove = function (moveEvt) {
      var pinCurrent = pinStart - (downEvt.clientX - moveEvt.clientX); // рассчитываем положение пина по сдвигу мыши и начальному положению
      if (pin === leftPin && pinCurrent >= 0 && pinCurrent < rightPin.offsetLeft) { // если пин левый
        pin.style.left = pinCurrent + 'px'; // двигаю пин
        activeFilters.minPrice = calculatePrice(pinCurrent); // вычисляю текущую цену и сохраняю в объекте window.filters
        rangePriceMin.textContent = activeFilters.minPrice; // обновляю текстовое поле под пином
        rangeFillLine.style.left = (pinCurrent + 10) + 'px'; // обновляю филллайн
      }
      if (pin === rightPin && pinCurrent > leftPin.offsetLeft && pinCurrent <= (range - pinSize)) { // если пин правый
        pin.style.left = pinCurrent + 'px'; // двигаю пин
        activeFilters.maxPrice = calculatePrice(pinCurrent); // вычисляю текущую цену и сохраняю в объекте window.filters
        rangePriceMax.textContent = activeFilters.maxPrice; // обновляю текстовое поле под пином
        rangeFillLine.style.right = (range - pinCurrent) + 'px'; // обновляю филллайн
      }
    };
    var onPinMouseUp = function () {
      debounce(refreshOnFilterChange); // обновляем информацию о каталоге
      document.removeEventListener('mousemove', onPinMouseMove); // удаляем обработчик "движение мыши"
      document.removeEventListener('mouseup', onPinMouseUp); // удаляем обработчик "отпускание кнопки мыши"
    };
    document.addEventListener('mousemove', onPinMouseMove); // запускаем обработчик "движение мыши"
    document.addEventListener('mouseup', onPinMouseUp); // запускаем обработчик "отпускание кнопки мыши"
  };

  // обработчик изменений фильтра
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
      activeFilters.minPrice = 0;
      activeFilters.maxPrice = 90;
      window.data.initSlider();
    }
    debounce(refreshOnFilterChange);
  };

  // обработчик кнопки "показать все" в фильтрах
  var onFormSubmit = function (evt) {
    evt.preventDefault();
    filterForm.reset();
    debounce(refreshOnFilterChange);
    window.data.initSlider();
  };

  // функция обновляет каталог, счетчики, данных о фильтрах
  var refreshOnFilterChange = function () {
    getFiltersAndSortOrder(); // обновляем данные о состоянии фильтров
    window.data.goodsFiltered = window.data.goodsInCatalog.filter(filterGoods).sort(sortByFormSelection); // прогняем данные через фильтр (согласно состоянию фильтров)
    refreshCatalog(window.data.goodsFiltered); // отрисовываем карточки заново
    // document.querySelector('span.range__count').textContent = '(' + window.data.goodsFiltered.length + ')'; // обновляем счетчик товаров в диапазоне
    // window.data.updateInStockCounter(window.data.goodsFiltered); // обновляем счетчик товара в наличии
    // window.data.updateFavoriteCounter(window.data.goodsFiltered); // обновляем счетчик товаров в избранном
    if (window.data.goodsFiltered.length === 0) { // если фильтры слишком строгие
      showEmptyFilterMessage(); // показываем сообщение
    }
  };

  // фуннкция рендера каталога
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


})();
