// модуль работы с фильтрами
'use strict';
(function () {
  // начало
  var catalogFilterRange = document.querySelector('.range'); // блок с фильтром
  var leftSlider = catalogFilterRange.querySelector('.range__btn--left'); // левый пин
  var rightSlider = catalogFilterRange.querySelector('.range__btn--right'); // правый пин
  var rangeFilter = catalogFilterRange.querySelector('.range__filter');
  var range = rangeFilter.clientWidth; // ширина бара фильтра = диапазон
  var rangePriceMin = catalogFilterRange.querySelector('.range__price--min'); // поле цены левого пина
  var rangePriceMax = catalogFilterRange.querySelector('.range__price--max'); // поле цены правого пина
  var rangeFillLine = catalogFilterRange.querySelector('.range__fill-line'); // полоска между пинами
  var priceMin = 100;
  var priceMax = 1500;
  // выставим начальные значения слайдера и бара;
  leftSlider.style.left = 0;
  rightSlider.style.left = range + 'px';
  rangeFillLine.style.left = 0;
  rangeFillLine.style.right = 0;
  rangePriceMin.textContent = priceMin;
  rangePriceMax.textContent = priceMax;


  // функция вычисления

  // обработчик для левого слайдера
  var onLeftSliderMouseDown = function (evt) { // описываем обработчик нажатия мыши
    var sliderStartPosition = leftSlider.offsetLeft; // сохраняем стартовое положение слайдера
    var sliderCureentPosition = sliderStartPosition;
    var maxPosition = rightSlider.offsetLeft;
    var mouseStart = evt.clientX; // сохаряем стартовое положение мышки
    var priceLeftPin;
    var relativePositionInPercent;

    var onLeftSliderMouseMove = function (moveEvt) { // описываем обработчик движения мыши
      var shift = mouseStart - moveEvt.clientX; // вычисляем сдвиг мышки
      sliderCureentPosition = sliderStartPosition - shift; // вычисляем текущее положение слайдера
      if (sliderCureentPosition >= 0 && sliderCureentPosition <= maxPosition) { // если положение в диапазоне от 0 до правого слайдера
        leftSlider.style.left = sliderCureentPosition + 'px'; // двигаю слайдер
        relativePositionInPercent = Math.round((sliderCureentPosition * 100) / range); // вычисляю положение в % от начала
        priceLeftPin = Math.round((priceMax - priceMin) * (relativePositionInPercent / 100) + priceMin); // вычисляю цену
        rangePriceMin.textContent = priceLeftPin; // обновляю полоску фильтра
        rangeFillLine.style.left = sliderCureentPosition + 'px'; // обновляю цену в поле
      }
    };
    var onLeftSliderMouseUp = function () { // описываем обработчик отпускания мыши
      document.removeEventListener('mousemove', onLeftSliderMouseMove); // удаляем обработчик "движение мыши"
      document.removeEventListener('mouseup', onLeftSliderMouseUp); // удаляем обработчик "отпускание кнопки мыши"
    };

    document.addEventListener('mousemove', onLeftSliderMouseMove); // запускаем обработчик "движение мыши"
    document.addEventListener('mouseup', onLeftSliderMouseUp); // запускаем обработчик "отпускание кнопки мыши"
  };

  // обработчик поведения правого слайдера
  var onRightSliderMouseDown = function (evt) {
    var sliderStartPosition = rightSlider.offsetLeft; // сохраняем стартовое положение слайдера
    var sliderCureentPosition = sliderStartPosition;
    var maxPosition = range;
    var mouseStart = evt.clientX; // сохаряем стартовое положение мышки
    var priceRightPin;
    var relativePositionInPercent;

    var onRightSliderMouseMove = function (moveEvt) { // описываем обработчик движения мыши
      var shift = mouseStart - moveEvt.clientX; // вычисляем сдвиг мышки
      sliderCureentPosition = sliderStartPosition - shift; // вычисляем текущее положение слайдера
      if (sliderCureentPosition > leftSlider.offsetLeft && sliderCureentPosition <= maxPosition) { // если положение в диапазоне от 0 до правого слайдера
        rightSlider.style.left = sliderCureentPosition + 'px'; // двигаю слайдер
        relativePositionInPercent = Math.round((sliderCureentPosition * 100) / range); // вычисляю положение в % от начала
        priceRightPin = Math.round((priceMax - priceMin) * (relativePositionInPercent / 100) + priceMin); // вычисляю цену
        rangePriceMax.textContent = priceRightPin; // обновляю поле цены
        rangeFillLine.style.right = (100 - relativePositionInPercent) + '%'; // обновляю слайдер
      }
    };
    var onRightSliderMouseUp = function () { // описываем обработчик отпускания мыши
      document.removeEventListener('mousemove', onRightSliderMouseMove); // удаляем обработчик "движение мыши"
      document.removeEventListener('mouseup', onRightSliderMouseUp); // удаляем обработчик "отпускание кнопки мыши"
    };

    document.addEventListener('mousemove', onRightSliderMouseMove); // запускаем обработчик "движение мыши"
    document.addEventListener('mouseup', onRightSliderMouseUp); // запускаем обработчик "отпускание кнопки мыши"
  };

  // добавляем обработчики
  leftSlider.addEventListener('mousedown', onLeftSliderMouseDown); // добавляем обработчик "нажатие кнопки мыши"
  rightSlider.addEventListener('mousedown', onRightSliderMouseDown);
})();
