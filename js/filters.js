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
    var activeInputsByFoodType = filterForm.querySelectorAll('[name="food-type"]:checked'); // находим включеные инпуты фильтра по типу
    var activeInputsByFoodProperty = filterForm.querySelectorAll('[name="food-property"]:checked'); // находим включеные инпуты фильтра по составу
    activeFilter.foodTypes = []; // очищаем старые данные
    activeFilter.foodProperties = [];
    activeInputsByFoodType.forEach(function (item) {
      activeFilter.foodTypes.push(item.value);
    });
    activeInputsByFoodProperty.forEach(function (item) {
      activeFilter.foodProperties.push(item.value);
    });
    activeFilter.sortOrder = filterForm.querySelector('[name="sort"]:checked').value;
    activeFilter.isFavorite = document.querySelector('#filter-favorite').checked;
    activeFilter.amount = document.querySelector('#filter-availability').checked;
  };

  // функция для фильрации товара
  var filterGoods = function (item) {
    var isFoodTypeMatch = false;
    var isFoodPropertyMatch = false;
    var isPriceMatched = false;

    if (activeFilter.isFavorite) {
      return item.isFavorite;
    }
    if (activeFilter.amount) {
      var itemInCatalog = window.utils.findItemById(item.id, window.data.goodsInCatalog);
      return itemInCatalog.amount > 0;
    }

    if (activeFilter.foodTypes.length > 0) {
      isFoodTypeMatch = checkFoodTypeInFilters(item);
    } else {
      isFoodTypeMatch = true;
    }
    if (activeFilter.foodProperties.length > 0) {
      isFoodPropertyMatch = checkFoodPropertyInFilters(item);
    } else {
      isFoodPropertyMatch = true;
    }
    if (item.price >= activeFilter.minPrice && item.price <= activeFilter.maxPrice) {
      isPriceMatched = true;
    }
    return isFoodTypeMatch && isFoodPropertyMatch && isPriceMatched;
  };

  // вспомогателльная функция для фильтрации, проверяет товар на соответствие по типу
  var checkFoodTypeInFilters = function (item) {
    var goodKind = kindOfGoodToFilterValue[item.kind];
    return (activeFilter.foodTypes.indexOf(goodKind) > -1);
  };

  // вспомогателльная функция для фильтрации, проверяет товар на соответствие по составу
  var checkFoodPropertyInFilters = function (item) {
    // если в товаре есть сахар и в фильтре есть критерий "без" сахара
    var isSugerFree = true;
    var isGlutenFree = true;
    var isVegetarian = true;
    activeFilter.foodProperties.forEach(function (foodProperty) {
      switch (foodProperty) {
        case 'sugar-free':
          isSugerFree = !item.nutritionFacts.sugar;
          break;
        case 'gluten-free':
          isGlutenFree = !item.nutritionFacts.gluten;
          break;
        case 'vegetarian':
          isVegetarian = item.nutritionFacts.vegetarian;
          break;
      }
    });
    return isSugerFree && isGlutenFree && isVegetarian;
  };

  // вспомогателльная функция сравнение товаров по цене
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

  // вспомогателльная функция сравнение товаров по рейтингу
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

  // вспомогателльная функция сравнение товаров по популярности
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

  // сортировка данных каталога.
  var sortByFormSelection = function (item1, item2) {
    // если выбрана сортировка "сначала дорогие"
    var result;
    switch (activeFilter.sortOrder) {
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

  // функция обертка: фильтрует и сортирует входящие данные и возвращат обработанные
  var filterAndSortCatalog = function (data) {
    getFiltersAndSortOrder();
    return data.filter(filterGoods).sort(sortByFormSelection);
  };
  window.filters = {
    activeFilter: {
      foodTypes: null,
      foodProperties: null,
      sortOrder: null,
      isFavorite: false,
      amount: false,
      minPrice: 0,
      maxPrice: 90
    },
    filterAndSortCatalog: filterAndSortCatalog
  };
  var activeFilter = window.filters.activeFilter; // шорткат для удобства

})();
