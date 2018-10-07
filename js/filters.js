// модуль работы с фильтрами
'use strict';
(function () {

  var filterForm = document.querySelector('form'); // форма фильтра

  // мапы соответствия в товаров и фильров
  var kindOfGoodToFilterValue = {
    'Мороженое': 'icecream',
    'Газировка': 'soda',
    'Жевательная резинка': 'gum',
    'Мармелад': 'marmalade',
    'Зефир': 'marshmallows'
  };

  // функция обновления состояния фильтра
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
      activeFilters.foodProperty.push(item.value);
    });
    activeFilters.sortOrder = filterForm.querySelector('[name="sort"]:checked').value;
    activeFilters.isFavorite = document.querySelector('#filter-favorite').checked;
    activeFilters.amount = document.querySelector('#filter-availability').checked;
  };

  // функция для фильрации товара
  var filterGoods = function (item) {
    var isFoodTypeMatch = false;
    var isFoodPropertyMatch = false;
    var isPriceMatched = false;

    if (activeFilters.isFavorite) {
      return item.isFavorite;
    }
    if (activeFilters.amount) {
      var itemInCatalog = window.data.findItemById(item.id, window.data.goodsInCatalog);
      return itemInCatalog.amount > 0;
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
  // вспомогателльная функция для фильтрации, проверяет товар на соответствие по составу
  var checkFoodPropertyInFilters = function (item) {
    // если в товаре есть сахар и в фильтре есть критерий "без" сахара
    if (item.nutritionFacts.sugar && (activeFilters.foodProperty.indexOf('sugar-free') !== -1)) {
      return false; // товар НЕ проходит
    }
    // если у товаре есть глютен и в фильтре есть критерий "без" сахара
    if (item.nutritionFacts.gluten && (activeFilters.foodProperty.indexOf('gluten-free') !== -1)) {
      return false; // товар НЕ проходит
    }
    // если товар НЕ вегетарианский а в фильтре есть есть критерий вегетарианский
    if (!item.nutritionFacts.vegetarian && (activeFilters.foodProperty.indexOf('vegetarian') !== -1)) {
      return false; // товар НЕ проходит
    }
    return true; // если все три условия не сроаботали то товар проходит
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

  var filterAndSortCatalog = function (data) {
    getFiltersAndSortOrder();
    return data.filter(filterGoods).sort(sortByFormSelection);
  };

  window.filters = {
    activeFilters: {
      foodType: null,
      foodProperty: null,
      sortOrder: null,
      isFavorite: false,
      amount: false,
      minPrice: 0,
      maxPrice: 90
    },
    filterAndSortCatalog: filterAndSortCatalog
  };

  var activeFilters = window.filters.activeFilters;


})();
