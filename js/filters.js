// модуль работы с фильтрами
'use strict';
(function () {
  // начало
  var catalogFilterRange = document.querySelector('.range'); // блок с фильтром
  var leftPin = catalogFilterRange.querySelector('.range__btn--left');
  var rightPin = catalogFilterRange.querySelector('.range__btn--right'); // правый пин
  var rangeFilter = catalogFilterRange.querySelector('.range__filter');
  var range = rangeFilter.clientWidth; // ширина бара фильтра = диапазон
  var rangePriceMin = catalogFilterRange.querySelector('.range__price--min'); // поле цены левого пина
  var rangePriceMax = catalogFilterRange.querySelector('.range__price--max'); // поле цены правого пина
  var rangeFillLine = catalogFilterRange.querySelector('.range__fill-line'); // полоска между пинами
  var priceMin = 100;
  var priceMax = 1500;
  var pinSize = 10;
  // выставим начальные значения пина и бара;
  leftPin.style.left = 0;
  rightPin.style.right = 0;
  rangeFillLine.style.left = (leftPin.offsetLeft) + pinSize + 'px';
  rangeFillLine.style.right = pinSize + 'px';
  rangePriceMin.textContent = priceMin;
  rangePriceMax.textContent = priceMax;

  var calculatePrice = function (x) {
    var relativePositionInPercent = Math.round((x * 100) / (range - pinSize)); // вычисляю положение в % от начала
    return Math.round((priceMax - priceMin) * (relativePositionInPercent / 100) + priceMin); // вычисляю цену
  };

  // обработчик для пина пина
  var onPinMouseDown = function (downEvt) { // при нажатии запоминаем пин и его позицию
    var pin = downEvt.target;
    var pinStart = pin.offsetLeft;
    var onPinMouseMove = function (moveEvt) {
      var pinCurrent = pinStart - (downEvt.clientX - moveEvt.clientX); // рассчитываем положение пина по сдвигу мыши и начальному положению
      if (pin === leftPin && pinCurrent >= 0 && pinCurrent < rightPin.offsetLeft) { // если пин левый
        pin.style.left = pinCurrent + 'px';
        rangePriceMin.textContent = calculatePrice(pinCurrent);
        rangeFillLine.style.left = (pinCurrent + 10) + 'px';
      }
      if (pin === rightPin && pinCurrent > leftPin.offsetLeft && pinCurrent <= (range - pinSize)) { // если пин правый
        pin.style.left = pinCurrent + 'px';
        rangePriceMax.textContent = calculatePrice(pinCurrent);
        rangeFillLine.style.right = (range - pinCurrent) + 'px';
      }
    };
    var onPinMouseUp = function () {

      // описываем обработчик отпускания мыши
      document.removeEventListener('mousemove', onPinMouseMove); // удаляем обработчик "движение мыши"
      document.removeEventListener('mouseup', onPinMouseUp); // удаляем обработчик "отпускание кнопки мыши"
    };
    document.addEventListener('mousemove', onPinMouseMove); // запускаем обработчик "движение мыши"
    document.addEventListener('mouseup', onPinMouseUp); // запускаем обработчик "отпускание кнопки мыши"
  };

  // добавляем обработчики
  leftPin.addEventListener('mousedown', onPinMouseDown); // добавляем обработчик "нажатие кнопки мыши"
  rightPin.addEventListener('mousedown', onPinMouseDown);
})();
