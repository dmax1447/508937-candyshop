// модуль работы с корзиной
'use strict';
(function () {
  // переменные и элементы интерфейса
  var goodsCards = document.querySelector('.goods__cards');
  var busketInHeader = document.querySelector('.main-header__basket');

  // обработчик кликов по элементам карточки в корзине
  var onOrderCardClick = function (evt) {
    var currentCard = evt.currentTarget;  // карточка по которой кликнул
    var id = currentCard.getAttribute('id'); // получаем id товара по которуму кликнули
    var goodsInOrderItem = window.data.findItemById(id, window.data.goodsInOrder); // находим объект-товар в массиве-каталоге
    var goodsInCatalogItem = window.data.findItemById(id, window.data.goodsInCatalog); // найдем объект-товар в массиве-корзине
    var index = window.data.goodsInOrder.indexOf(goodsInOrderItem); // находим индекс объекта-товара в массиве-корзине
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
        window.data.goodsInOrder.splice(index, 1); // удаляем объект-товар из массива-корзины
      } else {
        currentCard.querySelector('.card-order__count').value = goodsInOrderItem.orderedAmount; // иначе обновляем количество в карточке
      }
    }
    if (evt.target === btnClose) { // если клик по кнопке закрыть
      goodsInCatalogItem.amount += goodsInOrderItem.orderedAmount; // возвращаем товар на склад
      goodsCards.removeChild(currentCard); // удаляем карточку товара из корзины
      window.data.goodsInOrder.splice(index, 1); // удаляем объект товар из массива корзина
    }
    busketInHeader.textContent = 'В корзине: ' + window.data.goodsInOrder.length; // обновляем инфу в шапке
  };

  // ЭКСПОРТ
  window.busket = {
    renderCardInBusket: function (cardData) {
      // сохраним в переменные шаблон и карточку
      var cardTemplate = document.querySelector('#card-order').content.cloneNode(true);
      var card = cardTemplate.querySelector('.goods_card');
      // заполним поля и аттрибуты картоки данными
      card.setAttribute('id', cardData.id);
      card.querySelector('.card-order__title').textContent = cardData.name;
      card.querySelector('.card-order__img').src = cardData.picture;
      card.querySelector('.card-order__img').alt = cardData.name;
      card.querySelector('.card-order__price').textContent = cardData.price;
      card.querySelector('.card-order__count').value = cardData.orderCount;
      // добавим обработчик кликов по карточке
      card.addEventListener('click', onOrderCardClick);
      busketInHeader.textContent = 'В корзине: ' + window.data.goodsInOrder.length; // обновляем инфу в шапке
      return card;
    }

  };

  // КОНЕЦ МОДУЛЯ
})();
