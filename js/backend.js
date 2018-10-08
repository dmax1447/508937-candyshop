// модуль работы с сетью

'use strict';
(function () {

  var GET_URL = 'https://js.dump.academy/candyshop/data';
  var POST_URL = 'https://js.dump.academy/candyshop';
  var TIMEOUT = 10000;
  var Code = {
    SUCCESS: 200,
    NOT_FROUND_ERROR: 404,
    SERVER_ERROR: 500
  };
  var ESC_KEYCODE = 27;
  var DEBOUNCE_INTERVAL = 500;
  var lastTimeout;
  var filterForm = document.querySelector('form'); // форма фильтра
  var inputsFoodType = filterForm.querySelectorAll('[name="food-type"]');
  var inputsFoodProperty = filterForm.querySelectorAll('[name="food-property"]');
  var inputsSortOrder = filterForm.querySelectorAll('[name="sort"]');


  // функция выполнения запроса, принимает параметры:
  // onSuccses: коллбек на успешное завершение запроса, onError: коллбек на НЕуспешное завершение запроса
  // url: адрес сервиса, reqType: тип запроса, data: данные для отправки
  var makeRequest = function (onSuccess, onError, url, reqType, data) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.addEventListener('load', function () {
      if (xhr.status === Code.SUCCESS) {
        onSuccess(xhr.response);
      } else {
        onError('Cтатус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });
    xhr.addEventListener('error', function () {
      onError('Ошибка соединения');
    });
    xhr.addEventListener('timeout', function () {
      onError('Данные не загружены: запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });
    xhr.timeout = TIMEOUT;
    xhr.open(reqType, url);
    xhr.send(data);
  };

  window.backend = {
    // функция загрузки данных
    loadCatalog: function (onSuccess, onError) {
      makeRequest(onSuccess, onError, GET_URL, 'GET', undefined);
    },
    // функция отправки данных
    sendFormData: function (onSuccess, onError, data) {
      makeRequest(onSuccess, onError, POST_URL, 'POST', data);
    },
    // функция показа окна ошибки при загрузке / отправке
    showError: function (message) {
      var modalError = document.querySelector('.modal--error');
      var messageField = modalError.querySelector('p.modal__message');
      var btnClose = modalError.querySelector('.modal__close');
      messageField.textContent = message;
      var onBtnCloseClick = function () {
        modalError.classList.add('modal--hidden');
      };
      modalError.classList.remove('modal--hidden');
      btnClose.addEventListener('click', onBtnCloseClick);
      document.addEventListener('keydown', function (evt) {
        if (evt.keyCode === ESC_KEYCODE) {
          modalError.classList.add('modal--hidden');
        }
      });
    },
    // функция показывает окно при успешной отправке формы
    showSuccess: function () {
      var modalSuccess = document.querySelector('.modal--success');
      var btnClose = modalSuccess.querySelector('.modal__close');
      var onBtnCloseClick = function () {
        modalSuccess.classList.add('modal--hidden');
      };
      modalSuccess.classList.remove('modal--hidden');
      btnClose.addEventListener('click', onBtnCloseClick);
      document.addEventListener('keydown', function (evt) {
        if (evt.keyCode === ESC_KEYCODE) {
          modalSuccess.classList.add('modal--hidden');
        }
      });
    },
    debounce: function (fun) { // функция debounce
      if (lastTimeout) {
        window.clearTimeout(lastTimeout);
      }
      lastTimeout = window.setTimeout(fun, DEBOUNCE_INTERVAL);
    },
    disableControls: function () {
      inputsFoodType.forEach(function (item) {
        item.setAttribute('disabled', '');
      });
      inputsFoodProperty.forEach(function (item) {
        item.setAttribute('disabled', '');
      });
      inputsSortOrder.forEach(function (item) {
        item.setAttribute('disabled', '');
      });

    },
    enableControls: function () {
      inputsFoodType.forEach(function (item) {
        item.removeAttribute('disabled');
      });
      inputsFoodProperty.forEach(function (item) {
        item.removeAttribute('disabled');
      });
      inputsSortOrder.forEach(function (item) {
        item.removeAttribute('disabled');
      });
    }
  };

})();
