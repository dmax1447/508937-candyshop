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
    }
  };

})();
