// модуль доставки
'use strict';
(function () {
  // начало
  var deliverySection = document.querySelector('.deliver'); // раздел доставка
  var deliveryToggle = deliverySection.querySelector('.deliver__toggle'); // раздел выбор метода доставки
  var tabDeliverStore = deliverySection.querySelector('.deliver__store');
  var tabDeliverCourier = deliverySection.querySelector('.deliver__courier');
  var btnDeliverStores = deliverySection.querySelector('#deliver__store');
  var btnDeliverCourier = deliverySection.querySelector('#deliver__courier');

  // обработчик кликов по табам выбора метода доставки
  var onDeliveryBtnsClick = function (evt) {
    if (evt.target === btnDeliverStores) {
      // btnDeliverCourier.classList.add('visually-hidden');
      // btnDeliverStores.classList.remove('visually-hidden');
      tabDeliverStore.classList.remove('visually-hidden');
      tabDeliverCourier.classList.add('visually-hidden');
    }
    if (evt.target === btnDeliverCourier) {
      // btnDeliverCourier.classList.remove('visually-hidden');
      // btnDeliverStores.classList.add('visually-hidden');
      tabDeliverStore.classList.add('visually-hidden');
      tabDeliverCourier.classList.remove('visually-hidden');
    }
  };


  // добавим обработчик на раздел выбора метода доставки
  deliveryToggle.addEventListener('click', onDeliveryBtnsClick);
  // конец
})();
