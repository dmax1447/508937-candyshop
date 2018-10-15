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
  // инпуты таба оплата картой
  var paymentSection = document.querySelector('section.payment');
  var cardDate = paymentSection.querySelector('#payment__card-date');
  var cardCVC = paymentSection.querySelector('#payment__card-cvc');
  var cardHolderName = paymentSection.querySelector('#payment__cardholder');
  var cardStatus = paymentSection.querySelector('.payment__card-status');
  var cardErrorMessage = paymentSection.querySelector('.payment__error-message');
  var totalCountElement = document.querySelector('.goods__total-count');
  var goodsCardsEmpty = document.querySelector('.goods__card-empty'); // блок сообщение пустая корзина
  var goodsTotal = document.querySelector('.goods__total'); // блок общая сумма покупок
  var paymentCardTab = document.querySelector('.payment__card-wrap'); // таб оплата картой
  var paymentCashTab = document.querySelector('.payment__cash-wrap'); // таб оплата налом
  var cardOrderTemplate = document.querySelector('#card-order');

  var cardState = {
    'номер карты': true,
    'срок действия': true,
    'имя владельца': true,
    'CVC': true,
  };
  var isCardValid = false;

  // обработчик кликов по элементам карточки в корзине
  var onOrderCardClick = function (evt) {
    var orderData = window.utils.goodsInOrder;
    var catalogData = window.utils.goodsInCatalog;
    var currentCard = evt.currentTarget; // карточка по которой кликнул
    var id = currentCard.getAttribute('id'); // получаем id товара по которуму кликнули
    var goodsInOrderItem = window.utils.findItemById(id, orderData); // находим объект-товар в массиве-каталоге
    var goodsInCatalogItem = window.utils.findItemById(id, catalogData); // найдем объект-товар в массиве-корзине
    var catalogCardSelector = '[id="' + id + '"]';
    var catalogCard = catalogCards.querySelector(catalogCardSelector);
    var index = window.utils.goodsInOrder.indexOf(goodsInOrderItem);
    var btnIncrease = currentCard.querySelector('.card-order__btn--increase'); // кнопка +
    var btnDecrease = currentCard.querySelector('.card-order__btn--decrease'); // кнопка -
    var btnClose = currentCard.querySelector('.card-order__close'); // кнопка Х

    if (evt.target === btnIncrease && goodsInCatalogItem.amount >= 1) {
      changeCountOfGoodInCard(goodsInOrderItem, goodsInCatalogItem, currentCard, 1);
    }
    if (evt.target === btnDecrease) {
      changeCountOfGoodInCard(goodsInOrderItem, goodsInCatalogItem, currentCard, -1);
    }
    if (evt.target === btnClose) { // если клик по кнопке закрыть
      deleteCardFromOrder(goodsInCatalogItem, goodsInOrderItem, currentCard, index);
      evt.preventDefault();
    }
    if (goodsInOrderItem.orderedAmount === 0) { // если товара в заказе не осталось
      goodsCards.removeChild(currentCard); // удаляем карточку из корзины
      orderData.splice(index, 1); // удаляем объект-товар из массива-корзины
    }
    if (orderData.length === 0) { // если после действий в заказе не осталось товаров:
      proceedEmptyBusket();
      disableOrderForm(); // отключить поля формы заказа
    } else { // если после действий в заказе есть товары
      busketInHeader.textContent = 'В корзине: ' + orderData.length; // обновляем блок корзина в заголовке
      enableOrderForm(); // включаем поля формы заказа
      showCostOfGoods(); // включаем и показываем стоимость и количество товара в корхине
    }
    window.utils.setCardClassAmount(catalogCard, goodsInCatalogItem.amount); // выставляем карточке в каталоге класс доступности после операций в корзине
  };

  // функция обработки клика по кнопке (+) в карточке товара в корзине
  var changeCountOfGoodInCard = function (goodsInOrderItem, goodsInCatalogItem, cardInOrder, value) {
    goodsInOrderItem.orderedAmount += value; // увеличим количество товара в объекте в корзине
    goodsInCatalogItem.amount -= value; // уменьшим количество товара в объекте в каталоге
    cardInOrder.querySelector('.card-order__count').value = goodsInOrderItem.orderedAmount;
  };

  var deleteCardFromOrder = function (goodsInCatalogItem, goodsInOrderItem, cardInOrder, index) {
    goodsInCatalogItem.amount += goodsInOrderItem.orderedAmount;
    goodsCards.removeChild(cardInOrder);
    window.utils.goodsInOrder.splice(index, 1);
  };

  var proceedEmptyBusket = function () {
    goodsCards.classList.add('goods__cards--empty'); // удалим у блока товары в корзине goods__cards класс goods__cards--empty
    goodsCardsEmpty.classList.remove('visually-hidden'); // скроем блок goods__card-empty добавив ему класс visually-hidden
    busketInHeader.textContent = 'В корзине пусто! '; // сообщение в блок корзины в заголовке
    goodsTotal.classList.add('visually-hidden'); // скрыть блок суммарной стоимости/количества товара в корзине
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
    var totalPrice = calculateCost(window.utils.goodsInOrder); // считаем общую стоимость
    var totalCount = window.utils.goodsInOrder.length; // сохранияем количество
    goodsTotal.classList.remove('visually-hidden'); // показываем блок
    totalCountElement.childNodes[0].textContent = 'Итого за ' + totalCount + ' товаров';
    totalCountElement.childNodes[1].textContent = totalPrice + ' ₽';
  };

  var onFormOrderSubmit = function (evt) {
    evt.preventDefault();
    // если есть товар есть в корзине
    if (window.utils.goodsInOrder.length > 0) {
      // если выбрана оплата картой и карта верна, или выбрана оплата наличными
      if ((window.payments.selectedPaymentMethod === 'card' && isCardValid) || window.payments.selectedPaymentMethod === 'cash') {
        window.backend.sendFormData(window.utils.showSuccess, window.utils.showError, new FormData(formOrder)); // отправляем данные
        formOrder.reset(); // сбрасываем поля формы
        cardStatus.textContent = 'не определен'; // возвращаем текст про номер карты
        paymentCardTab.classList.remove('visually-hidden'); // скрываем вкладку наличные
        paymentCashTab.classList.add('visually-hidden'); // выводим вкладку оплата картой
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

  var onFormOrderChange = function () {
    cardState['номер карты'] = window.payments.checkCardNumber();
    cardState['срок действия'] = cardDate.checkValidity();
    cardState['CVC'] = cardCVC.checkValidity();
    cardState['имя владельца'] = cardHolderName.checkValidity();
    isCardValid = cardState['номер карты'] && cardState['срок действия'] && cardState['CVC'] && cardState['имя владельца'];

    if (isCardValid) {
      cardErrorMessage.classList.add('visually-hidden');
      cardStatus.textContent = 'Одобрен';
    } else {
      var checkFields = 'Проверьте поля: ';
      for (var prop in cardState) {
        if (cardState[prop] === false) {
          checkFields += (' ' + prop);
        }
      }
      cardErrorMessage.classList.remove('visually-hidden');
      cardErrorMessage.textContent = checkFields;
      cardStatus.textContent = 'Не определен';
    }
  };

  // добавляем обработчик события отправить на форму
  formOrder.addEventListener('submit', onFormOrderSubmit);
  formOrder.addEventListener('change', onFormOrderChange);
  // экспорт:
  window.busket = {
    renderCardInBusket: function (cardData) {
      // заполним поля и аттрибуты картоки данными
      var cardTemplate = cardOrderTemplate.content.cloneNode(true); // шаблон карточки корзины
      var card = cardTemplate.querySelector('.goods_card'); // сама карточка
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
