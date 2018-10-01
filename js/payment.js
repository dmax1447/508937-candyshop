// модуль обработки платежей
'use strict';
(function () {
  var cardNumberInput = document.querySelector('#payment__card-number'); // инупут для ввода номера карты
  var paymentToggle = document.querySelector('.payment__method');
  var btnPaymentCard = paymentToggle.querySelector('#payment__card');
  var btnPaymentCash = paymentToggle.querySelector('#payment__cash');
  var paymentByCardTab = document.querySelector('.payment__card-wrap');
  var paymentByCashTab = document.querySelector('.payment__cash-wrap');
  var paymentCardBlock = document.querySelector('.payment__card-wrap');
  var paymentCardInputs = paymentCardBlock.querySelectorAll('input');


  var onPaymentToggleClick = function (evt) { // переключение метода оплаты по клику на кнопку
    if (evt.target === btnPaymentCard) { // если выбрана оплата картой
      paymentByCardTab.classList.remove('visually-hidden'); // таб оплата картой показываем
      paymentByCashTab.classList.add('visually-hidden'); // таб оплата налом скрываем
      for (var i = 0; i < paymentCardInputs.length; i++) {
        paymentCardInputs[i].removeAttribute('disabled'); // включаем инпуты оплаты картой
      }
    }
    if (evt.target === btnPaymentCash) { // если нал - все наооброт
      paymentByCashTab.classList.remove('visually-hidden');
      paymentByCardTab.classList.add('visually-hidden');
      for (i = 0; i < paymentCardInputs.length; i++) {
        paymentCardInputs[i].setAttribute('disabled', '');
      }
    }
  };

  cardNumberInput.addEventListener('blur', function () { // добавим валидацию карты на поле с номером карты
    if (window.payments.checkCardNumber()) {
      document.querySelector('.payment__card-status').textContent = 'номер введен верно';
    } else {
      document.querySelector('.payment__card-status').textContent = 'c карточкой проблема';
    }
  });

  paymentToggle.addEventListener('click', onPaymentToggleClick); // добавим разделу выбора метода оплаты обработчик

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
