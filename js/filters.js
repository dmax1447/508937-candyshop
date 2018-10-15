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

  var activeFilter = {
    foodTypes: null,
    sugarFree: null,
    vegetarian: null,
    glutenFree: null,
    sortOrder: null,
    isFavorite: false,
    amount: false,
  };

  // функция обновления состояния фильтра
  var getFiltersAndSortOrder = function () {
    var activeInputsByFoodType = filterForm.querySelectorAll('[name="food-type"]:checked'); // находим включеные инпуты фильтра по типу
    activeFilter.foodTypes = []; // очищаем старые данные
    activeFilter.foodProperties = [];
    activeInputsByFoodType.forEach(function (item) {
      activeFilter.foodTypes.push(item.value);
    });
    activeFilter.sugarFree = filterForm.querySelector('#filter-sugar-free').checked;
    activeFilter.vegetarian = filterForm.querySelector('#filter-vegetarian').checked;
    activeFilter.glutenFree = filterForm.querySelector('#filter-gluten-free').checked;
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
      var itemInCatalog = window.utils.findItemById(item.id, window.utils.goodsInCatalog);
      return itemInCatalog.amount > 0;
    }
    isFoodTypeMatch = activeFilter.foodTypes.length > 0 ? checkFoodTypeInFilters(item) : true;
    isFoodPropertyMatch = checkFoodPropertyInFilters(item);
    isPriceMatched = (item.price >= window.filters.minPrice && item.price <= window.filters.maxPrice);
    return isFoodTypeMatch && isFoodPropertyMatch && isPriceMatched;
  };

  // вспомогателльная функция для фильтрации, проверяет товар на соответствие по типу
  var checkFoodTypeInFilters = function (item) {
    var goodKind = kindOfGoodToFilterValue[item.kind];
    return (activeFilter.foodTypes.indexOf(goodKind) > -1);
  };

  // вспомогателльная функция для фильтрации, проверяет товар на соответствие по составу
  var checkFoodPropertyInFilters = function (item) {
    var isSugerFree = true;
    var isGlutenFree = true;
    var isVegetarian = true;
    if (activeFilter.sugarFree) {
      isSugerFree = !item.nutritionFacts.sugar;
    }
    if (activeFilter.vegetarian) {
      isVegetarian = item.nutritionFacts.vegetarian;
    }
    if (activeFilter.glutenFree) {
      isGlutenFree = !item.nutritionFacts.gluten;
    }
    return isSugerFree && isGlutenFree && isVegetarian;
  };

  // вспомогателльная функция сравнение товаров по цене
  var comapareByPrice = function (item1, item2) {
    return item2.price > item1.price ? 1 : -1;
  };

  // вспомогателльная функция сравнение товаров по рейтингу
  var comapareByRating = function (item1, item2) {
    if (item2.rating.value === item1.rating.value) {
      return item2.rating.number > item1.rating.number ? 1 : -1;
    }
    return item2.rating.value > item1.rating.value ? 1 : -1;
  };

  // вспомогателльная функция сравнение товаров по популярности
  var comapareByPopuarity = function (item1, item2) {
    return item2.id < item1.id ? 1 : -1;
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
  var processData = function (data) {
    getFiltersAndSortOrder();
    return data.filter(filterGoods).sort(sortByFormSelection);
  };

  window.filters = {
    minPrice: 0,
    maxPrice: 90,
    processData: processData
  };

})();
