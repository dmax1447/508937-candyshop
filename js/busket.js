// модуль работы с корзиной
'use strict';
(function () {
  // переменные и элементы интерфейса
  var goodsCards = document.querySelector('.goods__cards'); // раздел корзина
  var catalogCards = document.querySelector('.catalog__cards'); // раздел каталог
  var busketInHeader = document.querySelector('.main-header__basket'); // раздел в заголовке "в корзине""
  var formOrder = document.querySelectorAll('form')[1]; // форма заказа
  var formInputsAll = formOrder.querySelectorAll('input'); // все инпуты формы заказа
  var deliverDescription = document.querySelector('.deliver__textarea'); // текстовое поле описание доставки курьером
  var fieldsetDilverStores = document.querySelector('.deliver__stores'); // набор инпутов в разделе доставка в магазины
  var fieldsetDilverCourier = document.querySelector('.deliver__entry-fields-wrap'); // набор инутов в разделе доставка
  var tabDeliverStore = document.querySelector('.deliver__store'); // таб доставки в магазины
  var btnSubmit = document.querySelector('.buy__submit-btn'); // кнопка отправить форму

  // обработчик кликов по элементам карточки в корзине
  var onOrderCardClick = function (evt) {
    var orderData = window.data.goodsInOrder;
    var catalogData = window.data.goodsInCatalog;
    var currentCard = evt.currentTarget; // карточка по которой кликнул
    var id = currentCard.getAttribute('id'); // получаем id товара по которуму кликнули
    var goodsInOrderItem = window.utils.findItemById(id, orderData); // находим объект-товар в массиве-каталоге
    var goodsInCatalogItem = window.utils.findItemById(id, catalogData); // найдем объект-товар в массиве-корзине
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
      evt.preventDefault();
    }
    if (orderData.length === 0) { // если после действий в заказе не осталось товаров:
      goodsCards.classList.add('goods__cards--empty'); // удалим у блока товары в корзине goods__cards класс goods__cards--empty
      document.querySelector('.goods__card-empty').classList.remove('visually-hidden'); // скроем блок goods__card-empty добавив ему класс visually-hidden
      busketInHeader.textContent = 'В корзине пусто! '; // сообщение в блок корзины в заголовке
      document.querySelector('.goods__total').classList.add('visually-hidden'); // скрыть блок суммарной стоимости/количества товара в корзине
      disableOrderForm(); // отключить поля формы заказа
    } else { // если после действий в заказе есть товары
      busketInHeader.textContent = 'В корзине: ' + orderData.length; // обновляем блок корзина в заголовке
      enableOrderForm(); // включаем поля формы заказа
      showCostOfGoods(); // включаем и показываем стоимость и количество товара в корхине
    }
    window.utils.setCardClassAmount(catalogCard, goodsInCatalogItem.amount); // выставляем карточке в каталоге класс доступности после операций в корзине

  };
  // функция суммарную стоимость товаров в корзине
  var calculateCost = function (orderData) {
    var totalCost = 0;
    orderData.forEach(function (orderItem) {
      totalCost += (orderItem.price * orderItem.orderedAmount);
    });
    return totalCost;
  };

  // функция показывает окно с количеством и стоимостью товаров в корзине
  var showCostOfGoods = function () {
    var totalPrice = calculateCost(window.data.goodsInOrder); // считаем общую стоимость
    var totalCount = window.data.goodsInOrder.length; // сохранияем количество
    document.querySelector('.goods__total').classList.remove('visually-hidden'); // показываем блок
    var totalCountElement = document.querySelector('.goods__total-count'); // и в нужные поля показываем данные
    totalCountElement.childNodes[0].textContent = 'Итого за ' + totalCount + ' товаров';
    totalCountElement.childNodes[1].textContent = totalPrice + ' ₽';
  };

  // обработчик события "отправить" на форме заказа
  var onFormOrderSubmit = function (evt) {
    evt.preventDefault();
    // если форма валидка и товар есть в корзине
    if (formOrder.checkValidity && (window.data.goodsInOrder.length > 0)) {
      // если выбрана оплата картой и карта верна, или выбрана оплата наличными
      if ((window.payments.selectedPaymentMethod === 'card' && window.payments.checkCardNumber()) || window.payments.selectedPaymentMethod === 'cash') {
        window.backend.sendFormData(window.utils.showSuccess, window.utils.showError, new FormData(formOrder)); // отправляем данные
        formOrder.reset(); // сбрасываем поля формы
        document.querySelector('.payment__card-status').textContent = 'не определен'; // возвращаем текст про номер карты
        document.querySelector('.payment__card-wrap').classList.remove('visually-hidden'); // скрываем вкладку наличные
        document.querySelector('.payment__cash-wrap').classList.add('visually-hidden'); // выводим вкладку оплата картой
      }
    }
  };

  // функция блокировки формы заказа (для пустой корзины)
  var disableOrderForm = function () {
    formInputsAll.forEach(function (input) {
      input.setAttribute('disabled', '');
    });
    btnSubmit.setAttribute('disabled', '');
  };
  // функция разблокировки формы заказа
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
      deliverDescription.setAttribute('disabled', '');
    }
  };

  // добавляем обработчик события отправить на форму
  formOrder.addEventListener('submit', onFormOrderSubmit);

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
