// модуль работы с корзиной
'use strict';
(function () {
  // переменные и элементы интерфейса
  var goodsCards = document.querySelector('.goods__cards');

  // обработчик кликов по элементам карточки в корзине
  var onOrderCardClick = function (evt) {
    // сохраним карточку в которой прошел клик и ее id
    var currentCard = evt.currentTarget;
    var id = currentCard.getAttribute('id');
    // найдем кнопки в карточке
    var btnIncrease = currentCard.querySelector('.card-order__btn--increase');
    var btnDecrease = currentCard.querySelector('.card-order__btn--decrease');
    var btnClose = currentCard.querySelector('.card-order__close');
    // если клик по кнопке '+' то увеличим количество товара в данных и карточке
    if (evt.target === btnIncrease) {
      window.data.goods[id].orderCount++;
      currentCard.querySelector('.card-order__count').value++;
    }
    // если клик по кнопке '-' то уменьшим количества товара и(или) удалим карточку
    if (evt.target === btnDecrease) {
      if (window.data.goods[id].orderCount === 1) {
        goodsCards.removeChild(currentCard);
      } else {
        currentCard.querySelector('.card-order__count').value--;
      }
      window.data.goods[id].orderCount--;
    }
    // если клик по кнопке "close" обнуляем кол-во товара в корзине в данных и удаляем карточку
    if (evt.target === btnClose) {
      window.data.goods[id].orderCount = 0;
      goodsCards.removeChild(currentCard);
    }
  };

  // ЭКСПОРТ
  window.busket = {
    renderCardInBusket: function (cardData, id) {
      // сохраним в переменные шаблон и карточку
      var cardTemplate = document.querySelector('#card-order').content.cloneNode(true);
      var card = cardTemplate.querySelector('.goods_card');
      // заполним поля и аттрибуты картоки данными
      card.setAttribute('id', id);
      card.querySelector('.card-order__title').textContent = cardData.name;
      card.querySelector('.card-order__img').src = cardData.picture;
      card.querySelector('.card-order__img').alt = cardData.name;
      card.querySelector('.card-order__price').textContent = cardData.price;
      card.querySelector('.card-order__count').value = 1;
      // добавим обработчик кликов по карточке
      card.addEventListener('click', onOrderCardClick);
      return card;
    }
  };

  // КОНЕЦ МОДУЛЯ
})();
