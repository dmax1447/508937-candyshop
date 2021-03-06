// модуль доставки
'use strict';
(function () {
  // начало
  var deliverySection = document.querySelector('.deliver'); // раздел доставка
  var deliveryToggle = deliverySection.querySelector('.deliver__toggle'); // раздел выбор метода доставки
  var tabDeliverStore = deliverySection.querySelector('.deliver__store');
  var tabDeliverCourier = deliverySection.querySelector('.deliver__courier');

  var deliveryStoreList = deliverySection.querySelector('.deliver__store-list');
  var fieldsetDilverStores = tabDeliverStore.querySelector('fieldset');
  var fieldsetDilverCourier = tabDeliverCourier.querySelector('fieldset');
  var courierDescription = tabDeliverCourier.querySelector('.deliver__textarea');
  // мапа соответствия адреса магазина его названию
  var inputStoreNamesToAdress = {
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
    var hiddenTab = deliverySection.querySelector('div.visually-hidden');
    if (evt.target.tagName === 'INPUT' && hiddenTab.classList.contains(evt.target.id)) { // если нажатая кнопка и скрытый таб совпадают
      tabDeliverStore.classList.toggle('visually-hidden');
      tabDeliverCourier.classList.toggle('visually-hidden');
      (evt.target.id === 'deliver__store' ? fieldsetDilverStores : fieldsetDilverCourier).removeAttribute('disabled');
      (evt.target.id === 'deliver__store' ? fieldsetDilverCourier : fieldsetDilverStores).setAttribute('disabled', '');
      disableCourierDescription();
    }
  };
  var disableCourierDescription = function (tab) {
    return tab === 'deliver__store' ? courierDescription.setAttribute('disabled', '') : courierDescription.removeAttribute('disabled');
  };

  // обработчик выдора магазина для доставки
  var onDeliveryStoreListClick = function (evt) {
    var storeMapImage = document.querySelector('.deliver__store-map-img');
    if (evt.target.tagName === 'INPUT') { // перехватываем клик на инпуте
      var mapName = 'img/map/' + evt.target.value + '.jpg'; // берем его значение и составляем имя файла
      storeMapImage.src = mapName; // меняем картинку карты
      document.querySelector('.deliver__store-describe').textContent = inputStoreNamesToAdress[evt.target.value]; // меняем описание как добраться
    }
    if (evt.target.tagName === 'LABEL') { // перехватываем клик на метке инпута
      storeMapImage.alt = evt.target.textContent; // берез из метки текст и прописываем альт к карте
    }

  };

  deliveryToggle.addEventListener('click', onDeliveryBtnsClick); // добавим обработчик на раздел выбора метода доставки
  deliveryStoreList.addEventListener('click', onDeliveryStoreListClick); // вешаем обработчик выбор магазина на список магазов
})();
