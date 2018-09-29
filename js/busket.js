// модуль работы с корзиной
'use strict';
(function () {
  // переменные и элементы интерфейса
  var goodsCards = document.querySelector('.goods__cards');
  var busketInHeader = document.querySelector('.main-header__basket');
  var formOrder = document.querySelectorAll('form')[1];
  var btnSubmit = document.querySelector('.buy__submit-btn');

  // обработчик кликов по элементам карточки в корзине
  var onOrderCardClick = function (evt) {
    var orderData = window.data.goodsInOrder;
    var catalogData = window.data.goodsInCatalog;
    var currentCard = evt.currentTarget; // карточка по которой кликнул
    var id = currentCard.getAttribute('id'); // получаем id товара по которуму кликнули
    var goodsInOrderItem = window.data.findItemById(id, orderData); // находим объект-товар в массиве-каталоге
    var goodsInCatalogItem = window.data.findItemById(id, catalogData); // найдем объект-товар в массиве-корзине
    var index = orderData.indexOf(goodsInOrderItem); // находим индекс объекта-товара в массиве-корзине
    var btnIncrease = currentCard.querySelector('.card-order__btn--increase'); // кнопка +
    var btnDecrease = currentCard.querySelector('.card-order__btn--decrease'); // кнопка -
    var btnClose = currentCard.querySelector('.card-order__close'); // кнопка Х

    if (evt.target === btnIncrease && goodsInCatalogItem.amount >= 1) { // если клик по + и товар есть на складе
      goodsInOrderItem.orderedAmount++; // увеличим количество товара в объекте в корзине
      goodsInCatalogItem.amount--; // уменьшим количество товара в объекте в каталоге
      currentCard.querySelector('.card-order__count').value = goodsInOrderItem.orderedAmount;
    }
    if (evt.target === btnDecrease) { // если клик по кнопке '-'
      goodsInOrderItem.orderedAmount--; // убавляем количество товара в заказе
      goodsInCatalogItem.amount++; // прибавляем количество товара на складе
      if (goodsInOrderItem.orderedAmount === 0) { // если товара в заказе не осталось
        goodsCards.removeChild(currentCard); // удаляем карточку из корзины
        orderData.splice(index, 1); // удаляем объект-товар из массива-корзины
      } else {
        currentCard.querySelector('.card-order__count').value = goodsInOrderItem.orderedAmount; // иначе обновляем количество в карточке
      }
    }
    if (evt.target === btnClose) { // если клик по кнопке закрыть
      goodsInCatalogItem.amount += goodsInOrderItem.orderedAmount; // возвращаем товар на склад
      goodsCards.removeChild(currentCard); // удаляем карточку товара из корзины
      orderData.splice(index, 1); // удаляем объект товар из массива корзина
    }
    busketInHeader.textContent = 'В корзине: ' + window.busket.countAmountOfGoods(orderData); // обновляем инфу в шапке
  };
  // функция показа окна при успехе

  // обработчик кликов по кнопке Заказать
  var onBtnSubmitClick = function (evt) {
    evt.preventDefault(); // убираем действие по умолчанию
    if (formOrder.checkValidity() && window.payments.checkCardNumber()) { // проверим, заполнена ли форма правильно, и номер карты верный
      window.backend.sendFormData(window.backend.showSuccess, window.backend.showError, new FormData(formOrder)); // отправляем данные
      formOrder.reset(); // сбрасываем поля формы
      document.querySelector('.payment__card-status').textContent = 'не определен'; // возвращаем текст про номер карты
    } else {
      window.backend.showError('Форма заполнена неправильно'); // иначе выводим сообщение об ошибке
    }
  };

  btnSubmit.addEventListener('click', onBtnSubmitClick); // вешаем обработчик на кнопку отправить

  // экспорт:
  window.busket = {

    renderCardInBusket: function (cardData) {
      // сохраним в переменные шаблон и карточку
      var cardTemplate = document.querySelector('#card-order').content.cloneNode(true);
      var card = cardTemplate.querySelector('.goods_card');
      // заполним поля и аттрибуты картоки данными
      card.setAttribute('id', cardData.id);
      card.querySelector('.card-order__title').textContent = cardData.name;
      card.querySelector('.card-order__img').src = 'img/cards/' + cardData.picture;
      card.querySelector('.card-order__img').alt = cardData.name;
      card.querySelector('.card-order__price').textContent = cardData.price;
      card.querySelector('.card-order__count').value = cardData.orderCount;
      // добавим обработчик кликов по карточке
      card.addEventListener('click', onOrderCardClick);
      return card;
    },
    countAmountOfGoods: function (_orderData) {
      var amountOfGoods = 0;
      for (var i = 0; i < _orderData.length; i++) {
        amountOfGoods += _orderData[i].orderedAmount;
      }
      return amountOfGoods;
    }

  };
})();
