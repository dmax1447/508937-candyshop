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
  var cardsFiltered;
  var catalogCards = document.querySelector('.catalog__cards'); // блок каталог товаров


  // функция расчета цены по положению пина
  var calculatePrice = function (x) {
    var relativePositionInPercent = Math.round((x * 100) / (range - pinSize)); // вычисляю положение в % от начала
    return Math.round((window.filters.maxPrice - window.filters.minPrice) * (relativePositionInPercent / 100) + window.filters.minPrice); // вычисляю цену
  };

  // фильтр каталога по цене
  var filterByPrice = function (item) {
    return (item.price >= window.filters.minFilterPrice && item.price <= window.filters.maxFilterPrice);
  };

  // обработчик перемещения пина
  var onPinMouseDown = function (downEvt) { // при нажатии запоминаем пин и его позицию
    var pin = downEvt.target;
    var pinStart = pin.offsetLeft;
    var onPinMouseMove = function (moveEvt) {
      var pinCurrent = pinStart - (downEvt.clientX - moveEvt.clientX); // рассчитываем положение пина по сдвигу мыши и начальному положению
      if (pin === leftPin && pinCurrent >= 0 && pinCurrent < rightPin.offsetLeft) { // если пин левый
        pin.style.left = pinCurrent + 'px'; // двигаю пин
        window.filters.minFilterPrice = calculatePrice(pinCurrent); // вычисляю текущую цену и сохраняю в объекте window.filters
        rangePriceMin.textContent = window.filters.minFilterPrice; // обновляю текстовое поле под пином
        rangeFillLine.style.left = (pinCurrent + 10) + 'px'; // обновляю филллайн
      }
      if (pin === rightPin && pinCurrent > leftPin.offsetLeft && pinCurrent <= (range - pinSize)) { // если пин правый
        pin.style.left = pinCurrent + 'px'; // двигаю пин
        window.filters.maxFilterPrice = calculatePrice(pinCurrent); // вычисляю текущую цену и сохраняю в объекте window.filters
        rangePriceMax.textContent = window.filters.maxFilterPrice; // обновляю текстовое поле под пином
        rangeFillLine.style.right = (range - pinCurrent) + 'px'; // обновляю филллайн
      }
    };
    var onPinMouseUp = function () {
      // перерисовываем каталог по условию фильтра
      window.data.goodsFiltered = window.data.goodsInCatalog.filter(filterByPrice); // получаем отфильровнные данные
      window.goods.clearCatalog(); // очищаем каталог
      cardsFiltered = window.goods.renderCatalog(window.data.goodsFiltered); // рендерим новый каталог по фильтрованным данным
      catalogCards.appendChild(cardsFiltered); // вставляем его на страницу
      // описываем обработчик отпускания мыши
      document.removeEventListener('mousemove', onPinMouseMove); // удаляем обработчик "движение мыши"
      document.removeEventListener('mouseup', onPinMouseUp); // удаляем обработчик "отпускание кнопки мыши"
    };
    document.addEventListener('mousemove', onPinMouseMove); // запускаем обработчик "движение мыши"
    document.addEventListener('mouseup', onPinMouseUp); // запускаем обработчик "отпускание кнопки мыши"
  };

  var findMinPrice = function (catalogData) {
    var min = catalogData[0].price;
    for (var i = 0; i < catalogData.length; i++) {
      if (catalogData[i].price < min) {
        min = catalogData[i].price;
      }
    }
    return min;
  };

  var findMaxPrice = function (catalogData) {
    var max = catalogData[0].price;
    for (var i = 0; i < catalogData.length; i++) {
      if (catalogData[i].price > max) {
        max = catalogData[i].price;
      }
    }
    return max;
  };

  // выставим начальные значения пина и бара;
  leftPin.style.left = 0;
  rightPin.style.right = 0;
  rangeFillLine.style.left = (leftPin.offsetLeft) + pinSize + 'px';
  rangeFillLine.style.right = pinSize + 'px';


  // добавляем обработчики на пины слайдера цены
  leftPin.addEventListener('mousedown', onPinMouseDown); // добавляем обработчик "нажатие кнопки мыши" на левый пин
  rightPin.addEventListener('mousedown', onPinMouseDown); // добавляем обработчик "нажатие кнопки мыши" на правый пин

  window.filters = {
    findMinPrice: findMinPrice,
    findMaxPrice: findMaxPrice,
    minPrice: null,
    maxPrice: null,
    minFilterPrice: null,
    maxFilterPrice: null
  };

})();
