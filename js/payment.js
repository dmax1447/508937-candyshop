// модуль обработки платежей
'use strict';
(function () {
  // начало
  var cardNumberInput = document.querySelector('#payment__card-number');

  // функция проверки карты по алгоритму Луна
  var validateCard = function (cardNumber) {
    if (cardNumber === '') {
      return false;
    }
    var digits = cardNumber.split('');
    var value;
    var checkSum = 0;
    for (var i = 0; i < cardNumber.length; i++) {
      var number = +digits[i];
      if (i % 2 === 0) {
        value = number * 2;
        if (value > 9) {
          value -= 9;
        }
        checkSum += value;
      } else {
        checkSum += number;
      }
    }
    return checkSum % 10 === 0;
  };

  // добавим валидацию карты на поле с номером карты
  cardNumberInput.addEventListener('blur', function () {
    if (validateCard(cardNumberInput.value)) {
      document.querySelector('.payment__card-status').textContent = 'номер введен верно';
    } else {
      document.querySelector('.payment__card-status').textContent = 'не определен';
    }
  });

  // конец
})();
