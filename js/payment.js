// модуль обработки платежей
'use strict';
(function () {
  var paymentSection = document.querySelector('section.payment');
  var cardNumberInput = paymentSection.querySelector('#payment__card-number'); // инупут для ввода номера карты
  var paymentToggle = paymentSection.querySelector('.payment__method'); // блок с переключателями выбора метода оплаты
  // var btnPaymentCard = paymentToggle.querySelector('#payment__card'); // кнопка оплаты картой
  // var btnPaymentCash = paymentToggle.querySelector('#payment__cash'); // кнопка оплаты наличиными
  var paymentByCardTab = paymentSection.querySelector('.payment__card-wrap'); // блок оплаты картой
  var paymentByCashTab = paymentSection.querySelector('.payment__cash-wrap'); // блок оплаты наличными
  var paymentCardInputs = paymentByCardTab.querySelectorAll('input'); // все инпуты оплаты картой

  // обработчик кликов по кнопкам "оплата картой/наличными"
  var onPaymentToggleClick = function (evt) { // переключение метода оплаты по клику на кнопку
    if (evt.target.tagName === 'INPUT' && paymentSection.querySelector('.' + evt.target.id + '-wrap').classList.contains('visually-hidden')) {
      window.payments.selectedPaymentMethod = evt.target.value;
      paymentByCardTab.classList.toggle('visually-hidden'); // таб оплата картой показываем
      paymentByCashTab.classList.toggle('visually-hidden');
      if (evt.target.value === 'card') {
        paymentCardInputs.forEach(function (input) {
          input.removeAttribute('disabled');
        });
      } else {
        paymentCardInputs.forEach(function (input) {
          input.setAttribute('disabled', '');
        });
      }
    }
  };

  // обработчик проверки номера карты после ввода
  cardNumberInput.addEventListener('blur', function () { // добавим валидацию карты на поле с номером карты
    document.querySelector('.payment__card-status').textContent = window.payments.checkCardNumber() ? 'Одобрен' : 'Не определен';
  });

  paymentToggle.addEventListener('click', onPaymentToggleClick); // добавим разделу выбора метода оплаты обработчик

  window.payments = {
    // функия проверки номера карты
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
    },
    selectedPaymentMethod: 'card'
  };
})();
