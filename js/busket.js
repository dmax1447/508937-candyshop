// модуль работы с корзиной
'use strict';
(function () {
  // переменные и элементы интерфейса
  var goodsCards = document.querySelector('.goods__cards');
  var catalogCards = document.querySelector('.catalog__cards');
  var busketInHeader = document.querySelector('.main-header__basket');
  var formOrder = document.querySelectorAll('form')[1];
  var formInputsAll = formOrder.querySelectorAll('input');
  var deliverDescription = document.querySelector('.deliver__textarea');
  var fieldsetDilverStores = document.querySelector('.deliver__stores');
  var fieldsetDilverCourier = document.querySelector('.deliver__entry-fields-wrap');
  var tabDeliverStore = document.querySelector('.deliver__store');
  var btnSubmit = document.querySelector('.buy__submit-btn');
  // var tabDeliverCourier = document.querySelector('.deliver__courier');

  // обработчик кликов по элементам карточки в корзине
  var onOrderCardClick = function (evt) {
    var orderData = window.data.goodsInOrder;
    var catalogData = window.data.goodsInCatalog;
    var currentCard = evt.currentTarget; // карточка по которой кликнул
    var id = currentCard.getAttribute('id'); // получаем id товара по которуму кликнули
    var goodsInOrderItem = window.data.findItemById(id, orderData); // находим объект-товар в массиве-каталоге
    var goodsInCatalogItem = window.data.findItemById(id, catalogData); // найдем объект-товар в массиве-корзине
    var catalogCardSelector = '[id="' + id + '"]';
    var catalogCard = catalogCards.querySelector(catalogCardSelector);
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
    if (orderData.length === 0) {
      goodsCards.classList.add('goods__cards--empty'); // удалим у блока товары в корзине goods__cards класс goods__cards--empty
      document.querySelector('.goods__card-empty').classList.remove('visually-hidden'); // скроем блок goods__card-empty добавив ему класс visually-hidden
      busketInHeader.textContent = 'В корзине пусто! ';
      document.querySelector('.goods__total').classList.add('visually-hidden');
      disableOrderForm();
    } else {
      busketInHeader.textContent = 'В корзине: ' + orderData.length; // обновляем инфу в шапке
      enableOrderForm();
      showCostOfGoods();
    }
    window.data.setCardClassAmount(catalogCard, goodsInCatalogItem.amount);

  };
  // подсчет стоимости товара в корзине
  var calculateCost = function (orderData) {
    var totalCost = 0;
    orderData.forEach(function (orderItem) {
      totalCost += (orderItem.price * orderItem.orderedAmount);
    });
    return totalCost;
  };

  var showCostOfGoods = function () {
    var totalPrice = calculateCost(window.data.goodsInOrder);
    var totalCount = window.data.goodsInOrder.length;
    document.querySelector('.goods__total').classList.remove('visually-hidden');
    var totalCountElement = document.querySelector('.goods__total-count');
    totalCountElement.childNodes[0].textContent = 'Итого за ' + totalCount + ' товаров';
    totalCountElement.childNodes[1].textContent = totalPrice + ' ₽';
  };

  // обработчик события "отправить" на форме заказа
  var onFormOrderSubmit = function (evt) {
    if (formOrder.checkValidity() && (window.data.goodsInOrder.length > 0)) { // проверим, заполнена ли форма правильно, и товар в корзине есть
      evt.preventDefault();
      window.backend.sendFormData(window.backend.showSuccess, window.backend.showError, new FormData(formOrder)); // отправляем данные
      formOrder.reset(); // сбрасываем поля формы
      document.querySelector('.payment__card-status').textContent = 'не определен'; // возвращаем текст про номер карты
      document.querySelector('.payment__card-wrap').classList.remove('visually-hidden'); // скрываем вкладку наличные
      document.querySelector('.payment__cash-wrap').classList.add('visually-hidden'); // выводим вкладку оплата картой
    }
  };
  // функция блокировки формы заказа (для пустой корзины)
  var disableOrderForm = function () {
    formInputsAll.forEach(function (input) {
      input.setAttribute('disabled', '');
    });
    btnSubmit.setAttribute('disabled', '');
    // fieldsetDilverStores.setAttribute('disabled', '');
    // fieldsetDilverCourier.setAttribute('disabled', '');
  };
  var enableOrderForm = function () {
    formInputsAll.forEach(function (input) {
      input.removeAttribute('disabled');
    });
    btnSubmit.removeAttribute('disabled');
    deliverDescription.removeAttribute('disabled');
    if (tabDeliverStore.classList.contains('visually-hidden')) {
      fieldsetDilverStores.setAttribute('disabled', '');

    } else {
      fieldsetDilverCourier.setAttribute('disabled', '');
      // deliverDescription.setAttribute('disabled', '');
    }


  };

  formOrder.addEventListener('submit', onFormOrderSubmit); // добавляем обработчик события отправить на форму

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
      card.querySelector('.card-order__price').textContent = cardData.price + ' ₽';
      card.querySelector('.card-order__count').value = cardData.orderCount;
      // добавим обработчик кликов по карточке
      card.addEventListener('click', onOrderCardClick);
      return card;
    },
    showCostOfGoods: showCostOfGoods,
    disableOrderForm: disableOrderForm,
    enableOrderForm: enableOrderForm
  };
})();
