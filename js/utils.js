'use strict';
(function () {

  var PIN_SIZE = 10;
  var LEFT_PIN_START_POSITION = '0';
  var RIGHT_PIN_START_POSITION = '235px';
  var ESC_KEYCODE = 27;
  var DEBOUNCE_INTERVAL = 500;

  var lastTimeout;
  var filterForm = document.querySelector('form'); // форма фильтра
  var inputsFoodType = filterForm.querySelectorAll('[name="food-type"]');
  var inputsFoodProperty = filterForm.querySelectorAll('[name="food-property"]');
  var inputsSortOrder = filterForm.querySelectorAll('[name="sort"]');

  window.utils = {
    goodsInCatalog: [], // массив для хранения данных каталога
    goodsFiltered: [], // массив для хранения отфильтрованных данных
    goodsInOrder: [], // массив для хранения данных заказа
    minPrice: null,
    maxPrice: null,
    // поиск значения в каталоге по id
    findItemById: function (idValue, list) {
      var idValueInt = parseInt(idValue, 10);
      return list.find(function (item) {
        return item.id === idValueInt;
      });

    },

    // функция для подсчета начальных значений счетчиков в блоке фильтров
    initFilterCounters: function (catalogData) {
      var filterCount = {
        'Мороженое': 0,
        'Газировка': 0,
        'Жевательная резинка': 0,
        'Мармелад': 0,
        'Зефир': 0,
        'noSugar': 0,
        'vegetarian': 0,
        'noGluten': 0,
        'inFavorite': 0,
        'inStock': 0
      };
      catalogData.forEach(function (item) {
        filterCount[item.kind]++;
        if (!item.nutritionFacts.sugar) {
          filterCount.noSugar++;
        }
        if (item.nutritionFacts.vegetarian) {
          filterCount.vegetarian++;
        }
        if (!item.nutritionFacts.gluten) {
          filterCount.noGluten++;
        }
        if (item.isFavorite) {
          filterCount.inFavorite++;
        }
        if (item.amount > 0) {
          filterCount.inStock++;
        }
      });
      var sidebar = document.querySelector('.catalog__sidebar');
      sidebar.querySelector('label[for="filter-icecream"] + span').textContent = '(' + filterCount['Мороженое'] + ')';
      sidebar.querySelector('label[for="filter-soda"] + span').textContent = '(' + filterCount['Газировка'] + ')';
      sidebar.querySelector('label[for="filter-gum"] + span').textContent = '(' + filterCount['Жевательная резинка'] + ')';
      sidebar.querySelector('label[for="filter-marmalade"] + span').textContent = '(' + filterCount['Мармелад'] + ')';
      sidebar.querySelector('label[for="filter-marshmallows"] + span').textContent = '(' + filterCount['Зефир'] + ')';
      sidebar.querySelector('label[for="filter-sugar-free"] + span').textContent = '(' + filterCount.noSugar + ')';
      sidebar.querySelector('label[for="filter-vegetarian"] + span').textContent = '(' + filterCount.vegetarian + ')';
      sidebar.querySelector('label[for="filter-gluten-free"] + span').textContent = '(' + filterCount.noGluten + ')';
      sidebar.querySelector('span.range__count').textContent = '(' + catalogData.length + ')';
      sidebar.querySelector('label[for="filter-favorite"] + span').textContent = '(' + filterCount.inFavorite + ')';
      sidebar.querySelector('label[for="filter-availability"] + span').textContent = '(' + filterCount.inStock + ')';
    },

    // функция инициализирует начальное положение пинов, филллайна и цены в фильтре-слайдере по цене
    initSlider: function () {
      var rangeFilter = document.querySelector('.range');
      rangeFilter.querySelector('.range__btn--left').style.left = LEFT_PIN_START_POSITION;
      rangeFilter.querySelector('.range__btn--right').style.left = RIGHT_PIN_START_POSITION;
      rangeFilter.querySelector('.range__fill-line').style.left = PIN_SIZE + 'px';
      rangeFilter.querySelector('.range__fill-line').style.right = PIN_SIZE + 'px';
      rangeFilter.querySelector('.range__price--min').textContent = window.utils.minPrice;
      rangeFilter.querySelector('.range__price--max').textContent = window.utils.maxPrice;
    },

    // функция устанавливает карточке товара в каталоге класс доступности в зависимости от количества
    setCardClassAmount: function (card, amount) {
      card.classList.remove('card--in-stock');
      card.classList.remove('card--little');
      card.classList.remove('card--soon');
      switch (amount) {
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
    },
    // функция показывает модальное окна ошибки при загрузке / отправке
    showError: function (message) {
      var modalError = document.querySelector('.modal--error');
      var messageField = modalError.querySelector('p.modal__message');
      var btnClose = modalError.querySelector('.modal__close');
      messageField.textContent = message;
      var onBtnCloseClick = function () {
        modalError.classList.add('modal--hidden');
        btnClose.removeEventListener('click', onBtnCloseClick);
        document.removeEventListener('keydown', onBtnEscClick);
      };
      var onBtnEscClick = function (evt) {
        if (evt.keyCode === ESC_KEYCODE) {
          modalError.classList.add('modal--hidden');
          btnClose.removeEventListener('click', onBtnCloseClick);
          document.removeEventListener('keydown', onBtnEscClick);
        }
      };
      modalError.classList.remove('modal--hidden');
      btnClose.addEventListener('click', onBtnCloseClick);
      document.addEventListener('keydown', onBtnEscClick);
    },
    // функция показывает модальное окно при успешной отправке формы
    showSuccess: function () {
      var modalSuccess = document.querySelector('.modal--success');
      var btnClose = modalSuccess.querySelector('.modal__close');
      var onBtnCloseClick = function () {
        modalSuccess.classList.add('modal--hidden');
        btnClose.removeEventListener('click', onBtnCloseClick);
        document.removeEventListener('keydown', onBtnEscClick);
      };
      var onBtnEscClick = function (evt) {
        if (evt.keyCode === ESC_KEYCODE) {
          modalSuccess.classList.add('modal--hidden');
          btnClose.removeEventListener('click', onBtnCloseClick);
          document.removeEventListener('keydown', onBtnEscClick);
        }
      };
      modalSuccess.classList.remove('modal--hidden');
      btnClose.addEventListener('click', onBtnCloseClick);
      document.addEventListener('keydown', onBtnEscClick);
    },
    // функция debounce
    debounce: function (fun) {
      if (lastTimeout) {
        window.clearTimeout(lastTimeout);
      }
      lastTimeout = window.setTimeout(fun, DEBOUNCE_INTERVAL);
    },
    // функия для выключения контролов формы фильтра
    disableControls: function () {
      inputsFoodType.forEach(function (item) {
        item.setAttribute('disabled', '');
      });
      inputsFoodProperty.forEach(function (item) {
        item.setAttribute('disabled', '');
      });
      inputsSortOrder.forEach(function (item) {
        item.setAttribute('disabled', '');
      });

    },
    // функция для включения контролов формы фильтра
    enableControls: function () {
      inputsFoodType.forEach(function (item) {
        item.removeAttribute('disabled');
      });
      inputsFoodProperty.forEach(function (item) {
        item.removeAttribute('disabled');
      });
      inputsSortOrder.forEach(function (item) {
        item.removeAttribute('disabled');
      });
    }
  };

})();
