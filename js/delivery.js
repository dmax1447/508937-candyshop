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
  // var deliveryCourierInputs = tabDeliverCourier.querySelectorAll('input');
  // var deliveryStoreInputs = tabDeliverStore.querySelectorAll('input');
  var deliveryStoreList = document.querySelector('.deliver__store-list');
  var fieldsetDilverStores = document.querySelector('.deliver__stores');
  var fieldsetDilverCourier = document.querySelector('.deliver__entry-fields-wrap');

  var inputStoreNameToAdress = {
    academicheskaya: 'проспект Науки, д. 19, корп. 3, литер А, ТК «Платформа», 3-й этаж, секция 310',
    vasileostrovskaya: 'Средний проспект В.О. д.27, второй подъезд слева, этаж 27',
    rechka: 'ул. Савушкина д.7, в здании ТЦ Черная речка, отметка -25м под речкой',
    petrogradskaya: 'ул. Льва Толстого д.4, там спросите кого нибудь',
    proletarskaya: 'проспект Обуховской обороны д.227, зайдите в военкомат, при себе иметь приписное',
    vostaniya: 'Гончарная ул. д.11 этаж 322, офис 44',
    prosvesheniya: 'проспект Просвещения, д.62, подъезд 1, этаж 3 1/2,  комната 3,14',
    frunzenskaya: 'м.Фрунзенская, Московский проспект, д.65, там дальше вывеска висит',
    chernishevskaya: 'м.Чернышевская, ул.Кирочная д.4, идите вниз и направо',
    tehinstitute: 'м.Технологический институт, ул. 1я Красноармейская д.4, оф.12, пароль - "три зеленых свистка"'
  };

  // обработчик кликов по табам выбора метода доставки
  var onDeliveryBtnsClick = function (evt) {
    if (evt.target === btnDeliverStores) { // если клик по "заеду в магаз"
      tabDeliverStore.classList.remove('visually-hidden'); // показываем блок доставки в магаз
      tabDeliverCourier.classList.add('visually-hidden'); // скрываем блок доставки курьером
      // for (var i = 0; i < deliveryCourierInputs.length; i++) { // отключаем инпуты курьерской доставки
      //   deliveryCourierInputs[i].setAttribute('disabled', '');
      // }
      // for (i = 0; i < deliveryStoreInputs.length; i++) { // включаем инпуты выбора магазина
      //   deliveryStoreInputs[i].removeAttribute('disabled');
      // }
      fieldsetDilverStores.removeAttribute('disabled');
      fieldsetDilverCourier.setAttribute('disabled', '');
    }
    if (evt.target === btnDeliverCourier) {
      tabDeliverStore.classList.add('visually-hidden');
      tabDeliverCourier.classList.remove('visually-hidden');
      // for (i = 0; i < deliveryCourierInputs.length; i++) { // включаем инпуты курьерской доставки
      //   deliveryCourierInputs[i].removeAttribute('disabled');
      // }
      // for (i = 0; i < deliveryStoreInputs.length; i++) { // отключаем инпуты выбора магазина
      //   deliveryStoreInputs[i].setAttribute('disabled', '');
      // }
      fieldsetDilverStores.setAttribute('disabled', '');
      fieldsetDilverCourier.removeAttribute('disabled');
    }
  };

  // обработчик выдора магазина для доставки
  var onDeliveryStoreListClick = function (evt) {
    var storeMapImage = document.querySelector('.deliver__store-map-img');
    if (evt.target.tagName === 'INPUT') { // перехватываем клик на инпуте
      var mapName = 'img/map/' + evt.target.value + '.jpg'; // берем его значение и составляем имя файла
      storeMapImage.src = mapName; // меняем картинку карты
      document.querySelector('.deliver__store-describe').textContent = inputStoreNameToAdress[evt.target.value];
    }
    if (evt.target.tagName === 'LABEL') { // перехватываем клик на метке инпута
      storeMapImage.alt = evt.target.textContent; // берез из метки текст и прописываем альт к карте
    }

  };

  deliveryToggle.addEventListener('click', onDeliveryBtnsClick); // добавим обработчик на раздел выбора метода доставки
  deliveryStoreList.addEventListener('click', onDeliveryStoreListClick); // вешаем обработчик выбор магазина на список магазов


})();
