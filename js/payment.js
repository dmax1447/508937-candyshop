// модуль обработки платежей
'use strict';
(function () {
  var cardNumberInput = document.querySelector('#payment__card-number'); // инупут для ввода номера карты

  // добавим валидацию карты на поле с номером карты
  cardNumberInput.addEventListener('blur', function () {
    if (window.payments.checkCardNumber()) {
      document.querySelector('.payment__card-status').textContent = 'номер введен верно';
    } else {
      document.querySelector('.payment__card-status').textContent = 'c карточкой проблема';
    }
  });

  window.payments = {
    checkCardNumber: function () {
      var cardNumber = cardNumberInput.value;
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
    }
  };
})();
