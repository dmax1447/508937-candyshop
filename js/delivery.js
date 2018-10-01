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
  var deliveryCourierInputs = tabDeliverCourier.querySelectorAll('input');
  var deliveryStoreInputs = tabDeliverStore.querySelectorAll('input');
  var deliveryStoreList = document.querySelector('.deliver__store-list');

  var inputStoreNameToAdress = {
    academicheskaya: 'проспект Науки, д. 19, корп. 3, литер А, ТК «Платформа», 3-й этаж, секция 310',
    vasileostrovskaya: '',
    rechka: '',
    petrogradskaya: '',
    proletarskaya: '',
    vostaniya: '',
    prosvesheniya: '',
    frunzenskaya: '',
    chernishevskaya: '',
    tehinstitute: ''
  };

  // обработчик кликов по табам выбора метода доставки
  var onDeliveryBtnsClick = function (evt) {
    if (evt.target === btnDeliverStores) { // если клик по "заеду в магаз"
      tabDeliverStore.classList.remove('visually-hidden'); // показываем блок доставки в магаз
      tabDeliverCourier.classList.add('visually-hidden'); // скрываем блок доставки курьером
      for (var i = 0; i < deliveryCourierInputs.length; i++) { // отключаем инпуты курьерской доставки
        deliveryCourierInputs[i].setAttribute('disabled', '');
      }
      for (i = 0; i < deliveryStoreInputs.length; i++) { // включаем инпуты выбора магазина
        deliveryStoreInputs[i].removeAttribute('disabled');
      }
    }
    if (evt.target === btnDeliverCourier) {
      tabDeliverStore.classList.add('visually-hidden');
      tabDeliverCourier.classList.remove('visually-hidden');
      for (i = 0; i < deliveryCourierInputs.length; i++) { // включаем инпуты курьерской доставки
        deliveryCourierInputs[i].removeAttribute('disabled');
      }
      for (i = 0; i < deliveryStoreInputs.length; i++) { // отключаем инпуты выбора магазина
        deliveryStoreInputs[i].setAttribute('disabled', '');
      }
    }
  };

  // обработчик выдора магазина для доставки
  var onDeliveryStoreListClick = function (evt) {
    var storeMapImage = document.querySelector('.deliver__store-map-img');
    if (evt.target.tagName === 'INPUT') { // перехватываем клик на инпуте
      var mapName = 'img/map/' + evt.target.value + '.jpg'; // берем его значение и составляем имя файла
      storeMapImage.src = mapName; // меняем картинку карты
    }
    if (evt.target.tagName === 'LABEL') { // перехватываем клик на метке инпута
      storeMapImage.alt = evt.target.textContent; // берез из метки текст и прописываем альт к карте
    }

  };

  deliveryToggle.addEventListener('click', onDeliveryBtnsClick); // добавим обработчик на раздел выбора метода доставки

  deliveryStoreList.addEventListener('click', onDeliveryStoreListClick); // вешаем обработчик выбор магазина на список магазов

})();
