/******/ (function() { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/axios/index.js":
/*!*************************************!*\
  !*** ./node_modules/axios/index.js ***!
  \*************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

module.exports = __webpack_require__(/*! ./lib/axios */ "./node_modules/axios/lib/axios.js");

/***/ }),

/***/ "./node_modules/axios/lib/adapters/xhr.js":
/*!************************************************!*\
  !*** ./node_modules/axios/lib/adapters/xhr.js ***!
  \************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

var settle = __webpack_require__(/*! ./../core/settle */ "./node_modules/axios/lib/core/settle.js");

var cookies = __webpack_require__(/*! ./../helpers/cookies */ "./node_modules/axios/lib/helpers/cookies.js");

var buildURL = __webpack_require__(/*! ./../helpers/buildURL */ "./node_modules/axios/lib/helpers/buildURL.js");

var buildFullPath = __webpack_require__(/*! ../core/buildFullPath */ "./node_modules/axios/lib/core/buildFullPath.js");

var parseHeaders = __webpack_require__(/*! ./../helpers/parseHeaders */ "./node_modules/axios/lib/helpers/parseHeaders.js");

var isURLSameOrigin = __webpack_require__(/*! ./../helpers/isURLSameOrigin */ "./node_modules/axios/lib/helpers/isURLSameOrigin.js");

var createError = __webpack_require__(/*! ../core/createError */ "./node_modules/axios/lib/core/createError.js");

var transitionalDefaults = __webpack_require__(/*! ../defaults/transitional */ "./node_modules/axios/lib/defaults/transitional.js");

var Cancel = __webpack_require__(/*! ../cancel/Cancel */ "./node_modules/axios/lib/cancel/Cancel.js");

module.exports = function xhrAdapter(config) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    var requestData = config.data;
    var requestHeaders = config.headers;
    var responseType = config.responseType;
    var onCanceled;

    function done() {
      if (config.cancelToken) {
        config.cancelToken.unsubscribe(onCanceled);
      }

      if (config.signal) {
        config.signal.removeEventListener('abort', onCanceled);
      }
    }

    if (utils.isFormData(requestData)) {
      delete requestHeaders['Content-Type']; // Let the browser set it
    }

    var request = new XMLHttpRequest(); // HTTP basic authentication

    if (config.auth) {
      var username = config.auth.username || '';
      var password = config.auth.password ? unescape(encodeURIComponent(config.auth.password)) : '';
      requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
    }

    var fullPath = buildFullPath(config.baseURL, config.url);
    request.open(config.method.toUpperCase(), buildURL(fullPath, config.params, config.paramsSerializer), true); // Set the request timeout in MS

    request.timeout = config.timeout;

    function onloadend() {
      if (!request) {
        return;
      } // Prepare the response


      var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
      var responseData = !responseType || responseType === 'text' || responseType === 'json' ? request.responseText : request.response;
      var response = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config: config,
        request: request
      };
      settle(function _resolve(value) {
        resolve(value);
        done();
      }, function _reject(err) {
        reject(err);
        done();
      }, response); // Clean up request

      request = null;
    }

    if ('onloadend' in request) {
      // Use onloadend if available
      request.onloadend = onloadend;
    } else {
      // Listen for ready state to emulate onloadend
      request.onreadystatechange = function handleLoad() {
        if (!request || request.readyState !== 4) {
          return;
        } // The request errored out and we didn't get a response, this will be
        // handled by onerror instead
        // With one exception: request that using file: protocol, most browsers
        // will return status as 0 even though it's a successful request


        if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
          return;
        } // readystate handler is calling before onerror or ontimeout handlers,
        // so we should call onloadend on the next 'tick'


        setTimeout(onloadend);
      };
    } // Handle browser request cancellation (as opposed to a manual cancellation)


    request.onabort = function handleAbort() {
      if (!request) {
        return;
      }

      reject(createError('Request aborted', config, 'ECONNABORTED', request)); // Clean up request

      request = null;
    }; // Handle low level network errors


    request.onerror = function handleError() {
      // Real errors are hidden from us by the browser
      // onerror should only fire if it's a network error
      reject(createError('Network Error', config, null, request)); // Clean up request

      request = null;
    }; // Handle timeout


    request.ontimeout = function handleTimeout() {
      var timeoutErrorMessage = config.timeout ? 'timeout of ' + config.timeout + 'ms exceeded' : 'timeout exceeded';
      var transitional = config.transitional || transitionalDefaults;

      if (config.timeoutErrorMessage) {
        timeoutErrorMessage = config.timeoutErrorMessage;
      }

      reject(createError(timeoutErrorMessage, config, transitional.clarifyTimeoutError ? 'ETIMEDOUT' : 'ECONNABORTED', request)); // Clean up request

      request = null;
    }; // Add xsrf header
    // This is only done if running in a standard browser environment.
    // Specifically not if we're in a web worker, or react-native.


    if (utils.isStandardBrowserEnv()) {
      // Add xsrf header
      var xsrfValue = (config.withCredentials || isURLSameOrigin(fullPath)) && config.xsrfCookieName ? cookies.read(config.xsrfCookieName) : undefined;

      if (xsrfValue) {
        requestHeaders[config.xsrfHeaderName] = xsrfValue;
      }
    } // Add headers to the request


    if ('setRequestHeader' in request) {
      utils.forEach(requestHeaders, function setRequestHeader(val, key) {
        if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
          // Remove Content-Type if data is undefined
          delete requestHeaders[key];
        } else {
          // Otherwise add header to the request
          request.setRequestHeader(key, val);
        }
      });
    } // Add withCredentials to request if needed


    if (!utils.isUndefined(config.withCredentials)) {
      request.withCredentials = !!config.withCredentials;
    } // Add responseType to request if needed


    if (responseType && responseType !== 'json') {
      request.responseType = config.responseType;
    } // Handle progress if needed


    if (typeof config.onDownloadProgress === 'function') {
      request.addEventListener('progress', config.onDownloadProgress);
    } // Not all browsers support upload events


    if (typeof config.onUploadProgress === 'function' && request.upload) {
      request.upload.addEventListener('progress', config.onUploadProgress);
    }

    if (config.cancelToken || config.signal) {
      // Handle cancellation
      // eslint-disable-next-line func-names
      onCanceled = function (cancel) {
        if (!request) {
          return;
        }

        reject(!cancel || cancel && cancel.type ? new Cancel('canceled') : cancel);
        request.abort();
        request = null;
      };

      config.cancelToken && config.cancelToken.subscribe(onCanceled);

      if (config.signal) {
        config.signal.aborted ? onCanceled() : config.signal.addEventListener('abort', onCanceled);
      }
    }

    if (!requestData) {
      requestData = null;
    } // Send the request


    request.send(requestData);
  });
};

/***/ }),

/***/ "./node_modules/axios/lib/axios.js":
/*!*****************************************!*\
  !*** ./node_modules/axios/lib/axios.js ***!
  \*****************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./utils */ "./node_modules/axios/lib/utils.js");

var bind = __webpack_require__(/*! ./helpers/bind */ "./node_modules/axios/lib/helpers/bind.js");

var Axios = __webpack_require__(/*! ./core/Axios */ "./node_modules/axios/lib/core/Axios.js");

var mergeConfig = __webpack_require__(/*! ./core/mergeConfig */ "./node_modules/axios/lib/core/mergeConfig.js");

var defaults = __webpack_require__(/*! ./defaults */ "./node_modules/axios/lib/defaults/index.js");
/**
 * Create an instance of Axios
 *
 * @param {Object} defaultConfig The default config for the instance
 * @return {Axios} A new instance of Axios
 */


function createInstance(defaultConfig) {
  var context = new Axios(defaultConfig);
  var instance = bind(Axios.prototype.request, context); // Copy axios.prototype to instance

  utils.extend(instance, Axios.prototype, context); // Copy context to instance

  utils.extend(instance, context); // Factory for creating new instances

  instance.create = function create(instanceConfig) {
    return createInstance(mergeConfig(defaultConfig, instanceConfig));
  };

  return instance;
} // Create the default instance to be exported


var axios = createInstance(defaults); // Expose Axios class to allow class inheritance

axios.Axios = Axios; // Expose Cancel & CancelToken

axios.Cancel = __webpack_require__(/*! ./cancel/Cancel */ "./node_modules/axios/lib/cancel/Cancel.js");
axios.CancelToken = __webpack_require__(/*! ./cancel/CancelToken */ "./node_modules/axios/lib/cancel/CancelToken.js");
axios.isCancel = __webpack_require__(/*! ./cancel/isCancel */ "./node_modules/axios/lib/cancel/isCancel.js");
axios.VERSION = (__webpack_require__(/*! ./env/data */ "./node_modules/axios/lib/env/data.js").version); // Expose all/spread

axios.all = function all(promises) {
  return Promise.all(promises);
};

axios.spread = __webpack_require__(/*! ./helpers/spread */ "./node_modules/axios/lib/helpers/spread.js"); // Expose isAxiosError

axios.isAxiosError = __webpack_require__(/*! ./helpers/isAxiosError */ "./node_modules/axios/lib/helpers/isAxiosError.js");
module.exports = axios; // Allow use of default import syntax in TypeScript

module.exports["default"] = axios;

/***/ }),

/***/ "./node_modules/axios/lib/cancel/Cancel.js":
/*!*************************************************!*\
  !*** ./node_modules/axios/lib/cancel/Cancel.js ***!
  \*************************************************/
/***/ (function(module) {

"use strict";

/**
 * A `Cancel` is an object that is thrown when an operation is canceled.
 *
 * @class
 * @param {string=} message The message.
 */

function Cancel(message) {
  this.message = message;
}

Cancel.prototype.toString = function toString() {
  return 'Cancel' + (this.message ? ': ' + this.message : '');
};

Cancel.prototype.__CANCEL__ = true;
module.exports = Cancel;

/***/ }),

/***/ "./node_modules/axios/lib/cancel/CancelToken.js":
/*!******************************************************!*\
  !*** ./node_modules/axios/lib/cancel/CancelToken.js ***!
  \******************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var Cancel = __webpack_require__(/*! ./Cancel */ "./node_modules/axios/lib/cancel/Cancel.js");
/**
 * A `CancelToken` is an object that can be used to request cancellation of an operation.
 *
 * @class
 * @param {Function} executor The executor function.
 */


function CancelToken(executor) {
  if (typeof executor !== 'function') {
    throw new TypeError('executor must be a function.');
  }

  var resolvePromise;
  this.promise = new Promise(function promiseExecutor(resolve) {
    resolvePromise = resolve;
  });
  var token = this; // eslint-disable-next-line func-names

  this.promise.then(function (cancel) {
    if (!token._listeners) return;
    var i;
    var l = token._listeners.length;

    for (i = 0; i < l; i++) {
      token._listeners[i](cancel);
    }

    token._listeners = null;
  }); // eslint-disable-next-line func-names

  this.promise.then = function (onfulfilled) {
    var _resolve; // eslint-disable-next-line func-names


    var promise = new Promise(function (resolve) {
      token.subscribe(resolve);
      _resolve = resolve;
    }).then(onfulfilled);

    promise.cancel = function reject() {
      token.unsubscribe(_resolve);
    };

    return promise;
  };

  executor(function cancel(message) {
    if (token.reason) {
      // Cancellation has already been requested
      return;
    }

    token.reason = new Cancel(message);
    resolvePromise(token.reason);
  });
}
/**
 * Throws a `Cancel` if cancellation has been requested.
 */


CancelToken.prototype.throwIfRequested = function throwIfRequested() {
  if (this.reason) {
    throw this.reason;
  }
};
/**
 * Subscribe to the cancel signal
 */


CancelToken.prototype.subscribe = function subscribe(listener) {
  if (this.reason) {
    listener(this.reason);
    return;
  }

  if (this._listeners) {
    this._listeners.push(listener);
  } else {
    this._listeners = [listener];
  }
};
/**
 * Unsubscribe from the cancel signal
 */


CancelToken.prototype.unsubscribe = function unsubscribe(listener) {
  if (!this._listeners) {
    return;
  }

  var index = this._listeners.indexOf(listener);

  if (index !== -1) {
    this._listeners.splice(index, 1);
  }
};
/**
 * Returns an object that contains a new `CancelToken` and a function that, when called,
 * cancels the `CancelToken`.
 */


CancelToken.source = function source() {
  var cancel;
  var token = new CancelToken(function executor(c) {
    cancel = c;
  });
  return {
    token: token,
    cancel: cancel
  };
};

module.exports = CancelToken;

/***/ }),

/***/ "./node_modules/axios/lib/cancel/isCancel.js":
/*!***************************************************!*\
  !*** ./node_modules/axios/lib/cancel/isCancel.js ***!
  \***************************************************/
/***/ (function(module) {

"use strict";


module.exports = function isCancel(value) {
  return !!(value && value.__CANCEL__);
};

/***/ }),

/***/ "./node_modules/axios/lib/core/Axios.js":
/*!**********************************************!*\
  !*** ./node_modules/axios/lib/core/Axios.js ***!
  \**********************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

var buildURL = __webpack_require__(/*! ../helpers/buildURL */ "./node_modules/axios/lib/helpers/buildURL.js");

var InterceptorManager = __webpack_require__(/*! ./InterceptorManager */ "./node_modules/axios/lib/core/InterceptorManager.js");

var dispatchRequest = __webpack_require__(/*! ./dispatchRequest */ "./node_modules/axios/lib/core/dispatchRequest.js");

var mergeConfig = __webpack_require__(/*! ./mergeConfig */ "./node_modules/axios/lib/core/mergeConfig.js");

var validator = __webpack_require__(/*! ../helpers/validator */ "./node_modules/axios/lib/helpers/validator.js");

var validators = validator.validators;
/**
 * Create a new instance of Axios
 *
 * @param {Object} instanceConfig The default config for the instance
 */

function Axios(instanceConfig) {
  this.defaults = instanceConfig;
  this.interceptors = {
    request: new InterceptorManager(),
    response: new InterceptorManager()
  };
}
/**
 * Dispatch a request
 *
 * @param {Object} config The config specific for this request (merged with this.defaults)
 */


Axios.prototype.request = function request(configOrUrl, config) {
  /*eslint no-param-reassign:0*/
  // Allow for axios('example/url'[, config]) a la fetch API
  if (typeof configOrUrl === 'string') {
    config = config || {};
    config.url = configOrUrl;
  } else {
    config = configOrUrl || {};
  }

  config = mergeConfig(this.defaults, config); // Set config.method

  if (config.method) {
    config.method = config.method.toLowerCase();
  } else if (this.defaults.method) {
    config.method = this.defaults.method.toLowerCase();
  } else {
    config.method = 'get';
  }

  var transitional = config.transitional;

  if (transitional !== undefined) {
    validator.assertOptions(transitional, {
      silentJSONParsing: validators.transitional(validators.boolean),
      forcedJSONParsing: validators.transitional(validators.boolean),
      clarifyTimeoutError: validators.transitional(validators.boolean)
    }, false);
  } // filter out skipped interceptors


  var requestInterceptorChain = [];
  var synchronousRequestInterceptors = true;
  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
    if (typeof interceptor.runWhen === 'function' && interceptor.runWhen(config) === false) {
      return;
    }

    synchronousRequestInterceptors = synchronousRequestInterceptors && interceptor.synchronous;
    requestInterceptorChain.unshift(interceptor.fulfilled, interceptor.rejected);
  });
  var responseInterceptorChain = [];
  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
    responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
  });
  var promise;

  if (!synchronousRequestInterceptors) {
    var chain = [dispatchRequest, undefined];
    Array.prototype.unshift.apply(chain, requestInterceptorChain);
    chain = chain.concat(responseInterceptorChain);
    promise = Promise.resolve(config);

    while (chain.length) {
      promise = promise.then(chain.shift(), chain.shift());
    }

    return promise;
  }

  var newConfig = config;

  while (requestInterceptorChain.length) {
    var onFulfilled = requestInterceptorChain.shift();
    var onRejected = requestInterceptorChain.shift();

    try {
      newConfig = onFulfilled(newConfig);
    } catch (error) {
      onRejected(error);
      break;
    }
  }

  try {
    promise = dispatchRequest(newConfig);
  } catch (error) {
    return Promise.reject(error);
  }

  while (responseInterceptorChain.length) {
    promise = promise.then(responseInterceptorChain.shift(), responseInterceptorChain.shift());
  }

  return promise;
};

Axios.prototype.getUri = function getUri(config) {
  config = mergeConfig(this.defaults, config);
  return buildURL(config.url, config.params, config.paramsSerializer).replace(/^\?/, '');
}; // Provide aliases for supported request methods


utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function (url, config) {
    return this.request(mergeConfig(config || {}, {
      method: method,
      url: url,
      data: (config || {}).data
    }));
  };
});
utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function (url, data, config) {
    return this.request(mergeConfig(config || {}, {
      method: method,
      url: url,
      data: data
    }));
  };
});
module.exports = Axios;

/***/ }),

/***/ "./node_modules/axios/lib/core/InterceptorManager.js":
/*!***********************************************************!*\
  !*** ./node_modules/axios/lib/core/InterceptorManager.js ***!
  \***********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

function InterceptorManager() {
  this.handlers = [];
}
/**
 * Add a new interceptor to the stack
 *
 * @param {Function} fulfilled The function to handle `then` for a `Promise`
 * @param {Function} rejected The function to handle `reject` for a `Promise`
 *
 * @return {Number} An ID used to remove interceptor later
 */


InterceptorManager.prototype.use = function use(fulfilled, rejected, options) {
  this.handlers.push({
    fulfilled: fulfilled,
    rejected: rejected,
    synchronous: options ? options.synchronous : false,
    runWhen: options ? options.runWhen : null
  });
  return this.handlers.length - 1;
};
/**
 * Remove an interceptor from the stack
 *
 * @param {Number} id The ID that was returned by `use`
 */


InterceptorManager.prototype.eject = function eject(id) {
  if (this.handlers[id]) {
    this.handlers[id] = null;
  }
};
/**
 * Iterate over all the registered interceptors
 *
 * This method is particularly useful for skipping over any
 * interceptors that may have become `null` calling `eject`.
 *
 * @param {Function} fn The function to call for each interceptor
 */


InterceptorManager.prototype.forEach = function forEach(fn) {
  utils.forEach(this.handlers, function forEachHandler(h) {
    if (h !== null) {
      fn(h);
    }
  });
};

module.exports = InterceptorManager;

/***/ }),

/***/ "./node_modules/axios/lib/core/buildFullPath.js":
/*!******************************************************!*\
  !*** ./node_modules/axios/lib/core/buildFullPath.js ***!
  \******************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var isAbsoluteURL = __webpack_require__(/*! ../helpers/isAbsoluteURL */ "./node_modules/axios/lib/helpers/isAbsoluteURL.js");

var combineURLs = __webpack_require__(/*! ../helpers/combineURLs */ "./node_modules/axios/lib/helpers/combineURLs.js");
/**
 * Creates a new URL by combining the baseURL with the requestedURL,
 * only when the requestedURL is not already an absolute URL.
 * If the requestURL is absolute, this function returns the requestedURL untouched.
 *
 * @param {string} baseURL The base URL
 * @param {string} requestedURL Absolute or relative URL to combine
 * @returns {string} The combined full path
 */


module.exports = function buildFullPath(baseURL, requestedURL) {
  if (baseURL && !isAbsoluteURL(requestedURL)) {
    return combineURLs(baseURL, requestedURL);
  }

  return requestedURL;
};

/***/ }),

/***/ "./node_modules/axios/lib/core/createError.js":
/*!****************************************************!*\
  !*** ./node_modules/axios/lib/core/createError.js ***!
  \****************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var enhanceError = __webpack_require__(/*! ./enhanceError */ "./node_modules/axios/lib/core/enhanceError.js");
/**
 * Create an Error with the specified message, config, error code, request and response.
 *
 * @param {string} message The error message.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The created error.
 */


module.exports = function createError(message, config, code, request, response) {
  var error = new Error(message);
  return enhanceError(error, config, code, request, response);
};

/***/ }),

/***/ "./node_modules/axios/lib/core/dispatchRequest.js":
/*!********************************************************!*\
  !*** ./node_modules/axios/lib/core/dispatchRequest.js ***!
  \********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

var transformData = __webpack_require__(/*! ./transformData */ "./node_modules/axios/lib/core/transformData.js");

var isCancel = __webpack_require__(/*! ../cancel/isCancel */ "./node_modules/axios/lib/cancel/isCancel.js");

var defaults = __webpack_require__(/*! ../defaults */ "./node_modules/axios/lib/defaults/index.js");

var Cancel = __webpack_require__(/*! ../cancel/Cancel */ "./node_modules/axios/lib/cancel/Cancel.js");
/**
 * Throws a `Cancel` if cancellation has been requested.
 */


function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }

  if (config.signal && config.signal.aborted) {
    throw new Cancel('canceled');
  }
}
/**
 * Dispatch a request to the server using the configured adapter.
 *
 * @param {object} config The config that is to be used for the request
 * @returns {Promise} The Promise to be fulfilled
 */


module.exports = function dispatchRequest(config) {
  throwIfCancellationRequested(config); // Ensure headers exist

  config.headers = config.headers || {}; // Transform request data

  config.data = transformData.call(config, config.data, config.headers, config.transformRequest); // Flatten headers

  config.headers = utils.merge(config.headers.common || {}, config.headers[config.method] || {}, config.headers);
  utils.forEach(['delete', 'get', 'head', 'post', 'put', 'patch', 'common'], function cleanHeaderConfig(method) {
    delete config.headers[method];
  });
  var adapter = config.adapter || defaults.adapter;
  return adapter(config).then(function onAdapterResolution(response) {
    throwIfCancellationRequested(config); // Transform response data

    response.data = transformData.call(config, response.data, response.headers, config.transformResponse);
    return response;
  }, function onAdapterRejection(reason) {
    if (!isCancel(reason)) {
      throwIfCancellationRequested(config); // Transform response data

      if (reason && reason.response) {
        reason.response.data = transformData.call(config, reason.response.data, reason.response.headers, config.transformResponse);
      }
    }

    return Promise.reject(reason);
  });
};

/***/ }),

/***/ "./node_modules/axios/lib/core/enhanceError.js":
/*!*****************************************************!*\
  !*** ./node_modules/axios/lib/core/enhanceError.js ***!
  \*****************************************************/
/***/ (function(module) {

"use strict";

/**
 * Update an Error with the specified config, error code, and response.
 *
 * @param {Error} error The error to update.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The error.
 */

module.exports = function enhanceError(error, config, code, request, response) {
  error.config = config;

  if (code) {
    error.code = code;
  }

  error.request = request;
  error.response = response;
  error.isAxiosError = true;

  error.toJSON = function toJSON() {
    return {
      // Standard
      message: this.message,
      name: this.name,
      // Microsoft
      description: this.description,
      number: this.number,
      // Mozilla
      fileName: this.fileName,
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber,
      stack: this.stack,
      // Axios
      config: this.config,
      code: this.code,
      status: this.response && this.response.status ? this.response.status : null
    };
  };

  return error;
};

/***/ }),

/***/ "./node_modules/axios/lib/core/mergeConfig.js":
/*!****************************************************!*\
  !*** ./node_modules/axios/lib/core/mergeConfig.js ***!
  \****************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ../utils */ "./node_modules/axios/lib/utils.js");
/**
 * Config-specific merge-function which creates a new config-object
 * by merging two configuration objects together.
 *
 * @param {Object} config1
 * @param {Object} config2
 * @returns {Object} New object resulting from merging config2 to config1
 */


module.exports = function mergeConfig(config1, config2) {
  // eslint-disable-next-line no-param-reassign
  config2 = config2 || {};
  var config = {};

  function getMergedValue(target, source) {
    if (utils.isPlainObject(target) && utils.isPlainObject(source)) {
      return utils.merge(target, source);
    } else if (utils.isPlainObject(source)) {
      return utils.merge({}, source);
    } else if (utils.isArray(source)) {
      return source.slice();
    }

    return source;
  } // eslint-disable-next-line consistent-return


  function mergeDeepProperties(prop) {
    if (!utils.isUndefined(config2[prop])) {
      return getMergedValue(config1[prop], config2[prop]);
    } else if (!utils.isUndefined(config1[prop])) {
      return getMergedValue(undefined, config1[prop]);
    }
  } // eslint-disable-next-line consistent-return


  function valueFromConfig2(prop) {
    if (!utils.isUndefined(config2[prop])) {
      return getMergedValue(undefined, config2[prop]);
    }
  } // eslint-disable-next-line consistent-return


  function defaultToConfig2(prop) {
    if (!utils.isUndefined(config2[prop])) {
      return getMergedValue(undefined, config2[prop]);
    } else if (!utils.isUndefined(config1[prop])) {
      return getMergedValue(undefined, config1[prop]);
    }
  } // eslint-disable-next-line consistent-return


  function mergeDirectKeys(prop) {
    if (prop in config2) {
      return getMergedValue(config1[prop], config2[prop]);
    } else if (prop in config1) {
      return getMergedValue(undefined, config1[prop]);
    }
  }

  var mergeMap = {
    'url': valueFromConfig2,
    'method': valueFromConfig2,
    'data': valueFromConfig2,
    'baseURL': defaultToConfig2,
    'transformRequest': defaultToConfig2,
    'transformResponse': defaultToConfig2,
    'paramsSerializer': defaultToConfig2,
    'timeout': defaultToConfig2,
    'timeoutMessage': defaultToConfig2,
    'withCredentials': defaultToConfig2,
    'adapter': defaultToConfig2,
    'responseType': defaultToConfig2,
    'xsrfCookieName': defaultToConfig2,
    'xsrfHeaderName': defaultToConfig2,
    'onUploadProgress': defaultToConfig2,
    'onDownloadProgress': defaultToConfig2,
    'decompress': defaultToConfig2,
    'maxContentLength': defaultToConfig2,
    'maxBodyLength': defaultToConfig2,
    'transport': defaultToConfig2,
    'httpAgent': defaultToConfig2,
    'httpsAgent': defaultToConfig2,
    'cancelToken': defaultToConfig2,
    'socketPath': defaultToConfig2,
    'responseEncoding': defaultToConfig2,
    'validateStatus': mergeDirectKeys
  };
  utils.forEach(Object.keys(config1).concat(Object.keys(config2)), function computeConfigValue(prop) {
    var merge = mergeMap[prop] || mergeDeepProperties;
    var configValue = merge(prop);
    utils.isUndefined(configValue) && merge !== mergeDirectKeys || (config[prop] = configValue);
  });
  return config;
};

/***/ }),

/***/ "./node_modules/axios/lib/core/settle.js":
/*!***********************************************!*\
  !*** ./node_modules/axios/lib/core/settle.js ***!
  \***********************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var createError = __webpack_require__(/*! ./createError */ "./node_modules/axios/lib/core/createError.js");
/**
 * Resolve or reject a Promise based on response status.
 *
 * @param {Function} resolve A function that resolves the promise.
 * @param {Function} reject A function that rejects the promise.
 * @param {object} response The response.
 */


module.exports = function settle(resolve, reject, response) {
  var validateStatus = response.config.validateStatus;

  if (!response.status || !validateStatus || validateStatus(response.status)) {
    resolve(response);
  } else {
    reject(createError('Request failed with status code ' + response.status, response.config, null, response.request, response));
  }
};

/***/ }),

/***/ "./node_modules/axios/lib/core/transformData.js":
/*!******************************************************!*\
  !*** ./node_modules/axios/lib/core/transformData.js ***!
  \******************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

var defaults = __webpack_require__(/*! ../defaults */ "./node_modules/axios/lib/defaults/index.js");
/**
 * Transform the data for a request or a response
 *
 * @param {Object|String} data The data to be transformed
 * @param {Array} headers The headers for the request or response
 * @param {Array|Function} fns A single function or Array of functions
 * @returns {*} The resulting transformed data
 */


module.exports = function transformData(data, headers, fns) {
  var context = this || defaults;
  /*eslint no-param-reassign:0*/

  utils.forEach(fns, function transform(fn) {
    data = fn.call(context, data, headers);
  });
  return data;
};

/***/ }),

/***/ "./node_modules/axios/lib/defaults/index.js":
/*!**************************************************!*\
  !*** ./node_modules/axios/lib/defaults/index.js ***!
  \**************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ../utils */ "./node_modules/axios/lib/utils.js");

var normalizeHeaderName = __webpack_require__(/*! ../helpers/normalizeHeaderName */ "./node_modules/axios/lib/helpers/normalizeHeaderName.js");

var enhanceError = __webpack_require__(/*! ../core/enhanceError */ "./node_modules/axios/lib/core/enhanceError.js");

var transitionalDefaults = __webpack_require__(/*! ./transitional */ "./node_modules/axios/lib/defaults/transitional.js");

var DEFAULT_CONTENT_TYPE = {
  'Content-Type': 'application/x-www-form-urlencoded'
};

function setContentTypeIfUnset(headers, value) {
  if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {
    headers['Content-Type'] = value;
  }
}

function getDefaultAdapter() {
  var adapter;

  if (typeof XMLHttpRequest !== 'undefined') {
    // For browsers use XHR adapter
    adapter = __webpack_require__(/*! ../adapters/xhr */ "./node_modules/axios/lib/adapters/xhr.js");
  } else if (typeof process !== 'undefined' && Object.prototype.toString.call(process) === '[object process]') {
    // For node use HTTP adapter
    adapter = __webpack_require__(/*! ../adapters/http */ "./node_modules/axios/lib/adapters/xhr.js");
  }

  return adapter;
}

function stringifySafely(rawValue, parser, encoder) {
  if (utils.isString(rawValue)) {
    try {
      (parser || JSON.parse)(rawValue);
      return utils.trim(rawValue);
    } catch (e) {
      if (e.name !== 'SyntaxError') {
        throw e;
      }
    }
  }

  return (encoder || JSON.stringify)(rawValue);
}

var defaults = {
  transitional: transitionalDefaults,
  adapter: getDefaultAdapter(),
  transformRequest: [function transformRequest(data, headers) {
    normalizeHeaderName(headers, 'Accept');
    normalizeHeaderName(headers, 'Content-Type');

    if (utils.isFormData(data) || utils.isArrayBuffer(data) || utils.isBuffer(data) || utils.isStream(data) || utils.isFile(data) || utils.isBlob(data)) {
      return data;
    }

    if (utils.isArrayBufferView(data)) {
      return data.buffer;
    }

    if (utils.isURLSearchParams(data)) {
      setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
      return data.toString();
    }

    if (utils.isObject(data) || headers && headers['Content-Type'] === 'application/json') {
      setContentTypeIfUnset(headers, 'application/json');
      return stringifySafely(data);
    }

    return data;
  }],
  transformResponse: [function transformResponse(data) {
    var transitional = this.transitional || defaults.transitional;
    var silentJSONParsing = transitional && transitional.silentJSONParsing;
    var forcedJSONParsing = transitional && transitional.forcedJSONParsing;
    var strictJSONParsing = !silentJSONParsing && this.responseType === 'json';

    if (strictJSONParsing || forcedJSONParsing && utils.isString(data) && data.length) {
      try {
        return JSON.parse(data);
      } catch (e) {
        if (strictJSONParsing) {
          if (e.name === 'SyntaxError') {
            throw enhanceError(e, this, 'E_JSON_PARSE');
          }

          throw e;
        }
      }
    }

    return data;
  }],

  /**
   * A timeout in milliseconds to abort a request. If set to 0 (default) a
   * timeout is not created.
   */
  timeout: 0,
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',
  maxContentLength: -1,
  maxBodyLength: -1,
  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  },
  headers: {
    common: {
      'Accept': 'application/json, text/plain, */*'
    }
  }
};
utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
  defaults.headers[method] = {};
});
utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
});
module.exports = defaults;

/***/ }),

/***/ "./node_modules/axios/lib/defaults/transitional.js":
/*!*********************************************************!*\
  !*** ./node_modules/axios/lib/defaults/transitional.js ***!
  \*********************************************************/
/***/ (function(module) {

"use strict";


module.exports = {
  silentJSONParsing: true,
  forcedJSONParsing: true,
  clarifyTimeoutError: false
};

/***/ }),

/***/ "./node_modules/axios/lib/env/data.js":
/*!********************************************!*\
  !*** ./node_modules/axios/lib/env/data.js ***!
  \********************************************/
/***/ (function(module) {

module.exports = {
  "version": "0.26.1"
};

/***/ }),

/***/ "./node_modules/axios/lib/helpers/bind.js":
/*!************************************************!*\
  !*** ./node_modules/axios/lib/helpers/bind.js ***!
  \************************************************/
/***/ (function(module) {

"use strict";


module.exports = function bind(fn, thisArg) {
  return function wrap() {
    var args = new Array(arguments.length);

    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }

    return fn.apply(thisArg, args);
  };
};

/***/ }),

/***/ "./node_modules/axios/lib/helpers/buildURL.js":
/*!****************************************************!*\
  !*** ./node_modules/axios/lib/helpers/buildURL.js ***!
  \****************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

function encode(val) {
  return encodeURIComponent(val).replace(/%3A/gi, ':').replace(/%24/g, '$').replace(/%2C/gi, ',').replace(/%20/g, '+').replace(/%5B/gi, '[').replace(/%5D/gi, ']');
}
/**
 * Build a URL by appending params to the end
 *
 * @param {string} url The base of the url (e.g., http://www.google.com)
 * @param {object} [params] The params to be appended
 * @returns {string} The formatted url
 */


module.exports = function buildURL(url, params, paramsSerializer) {
  /*eslint no-param-reassign:0*/
  if (!params) {
    return url;
  }

  var serializedParams;

  if (paramsSerializer) {
    serializedParams = paramsSerializer(params);
  } else if (utils.isURLSearchParams(params)) {
    serializedParams = params.toString();
  } else {
    var parts = [];
    utils.forEach(params, function serialize(val, key) {
      if (val === null || typeof val === 'undefined') {
        return;
      }

      if (utils.isArray(val)) {
        key = key + '[]';
      } else {
        val = [val];
      }

      utils.forEach(val, function parseValue(v) {
        if (utils.isDate(v)) {
          v = v.toISOString();
        } else if (utils.isObject(v)) {
          v = JSON.stringify(v);
        }

        parts.push(encode(key) + '=' + encode(v));
      });
    });
    serializedParams = parts.join('&');
  }

  if (serializedParams) {
    var hashmarkIndex = url.indexOf('#');

    if (hashmarkIndex !== -1) {
      url = url.slice(0, hashmarkIndex);
    }

    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  }

  return url;
};

/***/ }),

/***/ "./node_modules/axios/lib/helpers/combineURLs.js":
/*!*******************************************************!*\
  !*** ./node_modules/axios/lib/helpers/combineURLs.js ***!
  \*******************************************************/
/***/ (function(module) {

"use strict";

/**
 * Creates a new URL by combining the specified URLs
 *
 * @param {string} baseURL The base URL
 * @param {string} relativeURL The relative URL
 * @returns {string} The combined URL
 */

module.exports = function combineURLs(baseURL, relativeURL) {
  return relativeURL ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '') : baseURL;
};

/***/ }),

/***/ "./node_modules/axios/lib/helpers/cookies.js":
/*!***************************************************!*\
  !*** ./node_modules/axios/lib/helpers/cookies.js ***!
  \***************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

module.exports = utils.isStandardBrowserEnv() ? // Standard browser envs support document.cookie
function standardBrowserEnv() {
  return {
    write: function write(name, value, expires, path, domain, secure) {
      var cookie = [];
      cookie.push(name + '=' + encodeURIComponent(value));

      if (utils.isNumber(expires)) {
        cookie.push('expires=' + new Date(expires).toGMTString());
      }

      if (utils.isString(path)) {
        cookie.push('path=' + path);
      }

      if (utils.isString(domain)) {
        cookie.push('domain=' + domain);
      }

      if (secure === true) {
        cookie.push('secure');
      }

      document.cookie = cookie.join('; ');
    },
    read: function read(name) {
      var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
      return match ? decodeURIComponent(match[3]) : null;
    },
    remove: function remove(name) {
      this.write(name, '', Date.now() - 86400000);
    }
  };
}() : // Non standard browser env (web workers, react-native) lack needed support.
function nonStandardBrowserEnv() {
  return {
    write: function write() {},
    read: function read() {
      return null;
    },
    remove: function remove() {}
  };
}();

/***/ }),

/***/ "./node_modules/axios/lib/helpers/isAbsoluteURL.js":
/*!*********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/isAbsoluteURL.js ***!
  \*********************************************************/
/***/ (function(module) {

"use strict";

/**
 * Determines whether the specified URL is absolute
 *
 * @param {string} url The URL to test
 * @returns {boolean} True if the specified URL is absolute, otherwise false
 */

module.exports = function isAbsoluteURL(url) {
  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
  // by any combination of letters, digits, plus, period, or hyphen.
  return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url);
};

/***/ }),

/***/ "./node_modules/axios/lib/helpers/isAxiosError.js":
/*!********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/isAxiosError.js ***!
  \********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");
/**
 * Determines whether the payload is an error thrown by Axios
 *
 * @param {*} payload The value to test
 * @returns {boolean} True if the payload is an error thrown by Axios, otherwise false
 */


module.exports = function isAxiosError(payload) {
  return utils.isObject(payload) && payload.isAxiosError === true;
};

/***/ }),

/***/ "./node_modules/axios/lib/helpers/isURLSameOrigin.js":
/*!***********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/isURLSameOrigin.js ***!
  \***********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

module.exports = utils.isStandardBrowserEnv() ? // Standard browser envs have full support of the APIs needed to test
// whether the request URL is of the same origin as current location.
function standardBrowserEnv() {
  var msie = /(msie|trident)/i.test(navigator.userAgent);
  var urlParsingNode = document.createElement('a');
  var originURL;
  /**
  * Parse a URL to discover it's components
  *
  * @param {String} url The URL to be parsed
  * @returns {Object}
  */

  function resolveURL(url) {
    var href = url;

    if (msie) {
      // IE needs attribute set twice to normalize properties
      urlParsingNode.setAttribute('href', href);
      href = urlParsingNode.href;
    }

    urlParsingNode.setAttribute('href', href); // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils

    return {
      href: urlParsingNode.href,
      protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
      host: urlParsingNode.host,
      search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
      hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
      hostname: urlParsingNode.hostname,
      port: urlParsingNode.port,
      pathname: urlParsingNode.pathname.charAt(0) === '/' ? urlParsingNode.pathname : '/' + urlParsingNode.pathname
    };
  }

  originURL = resolveURL(window.location.href);
  /**
  * Determine if a URL shares the same origin as the current location
  *
  * @param {String} requestURL The URL to test
  * @returns {boolean} True if URL shares the same origin, otherwise false
  */

  return function isURLSameOrigin(requestURL) {
    var parsed = utils.isString(requestURL) ? resolveURL(requestURL) : requestURL;
    return parsed.protocol === originURL.protocol && parsed.host === originURL.host;
  };
}() : // Non standard browser envs (web workers, react-native) lack needed support.
function nonStandardBrowserEnv() {
  return function isURLSameOrigin() {
    return true;
  };
}();

/***/ }),

/***/ "./node_modules/axios/lib/helpers/normalizeHeaderName.js":
/*!***************************************************************!*\
  !*** ./node_modules/axios/lib/helpers/normalizeHeaderName.js ***!
  \***************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ../utils */ "./node_modules/axios/lib/utils.js");

module.exports = function normalizeHeaderName(headers, normalizedName) {
  utils.forEach(headers, function processHeader(value, name) {
    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
      headers[normalizedName] = value;
      delete headers[name];
    }
  });
};

/***/ }),

/***/ "./node_modules/axios/lib/helpers/parseHeaders.js":
/*!********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/parseHeaders.js ***!
  \********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js"); // Headers whose duplicates are ignored by node
// c.f. https://nodejs.org/api/http.html#http_message_headers


var ignoreDuplicateOf = ['age', 'authorization', 'content-length', 'content-type', 'etag', 'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since', 'last-modified', 'location', 'max-forwards', 'proxy-authorization', 'referer', 'retry-after', 'user-agent'];
/**
 * Parse headers into an object
 *
 * ```
 * Date: Wed, 27 Aug 2014 08:58:49 GMT
 * Content-Type: application/json
 * Connection: keep-alive
 * Transfer-Encoding: chunked
 * ```
 *
 * @param {String} headers Headers needing to be parsed
 * @returns {Object} Headers parsed into an object
 */

module.exports = function parseHeaders(headers) {
  var parsed = {};
  var key;
  var val;
  var i;

  if (!headers) {
    return parsed;
  }

  utils.forEach(headers.split('\n'), function parser(line) {
    i = line.indexOf(':');
    key = utils.trim(line.substr(0, i)).toLowerCase();
    val = utils.trim(line.substr(i + 1));

    if (key) {
      if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
        return;
      }

      if (key === 'set-cookie') {
        parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
      } else {
        parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
      }
    }
  });
  return parsed;
};

/***/ }),

/***/ "./node_modules/axios/lib/helpers/spread.js":
/*!**************************************************!*\
  !*** ./node_modules/axios/lib/helpers/spread.js ***!
  \**************************************************/
/***/ (function(module) {

"use strict";

/**
 * Syntactic sugar for invoking a function and expanding an array for arguments.
 *
 * Common use case would be to use `Function.prototype.apply`.
 *
 *  ```js
 *  function f(x, y, z) {}
 *  var args = [1, 2, 3];
 *  f.apply(null, args);
 *  ```
 *
 * With `spread` this example can be re-written.
 *
 *  ```js
 *  spread(function(x, y, z) {})([1, 2, 3]);
 *  ```
 *
 * @param {Function} callback
 * @returns {Function}
 */

module.exports = function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr);
  };
};

/***/ }),

/***/ "./node_modules/axios/lib/helpers/validator.js":
/*!*****************************************************!*\
  !*** ./node_modules/axios/lib/helpers/validator.js ***!
  \*****************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var VERSION = (__webpack_require__(/*! ../env/data */ "./node_modules/axios/lib/env/data.js").version);

var validators = {}; // eslint-disable-next-line func-names

['object', 'boolean', 'number', 'function', 'string', 'symbol'].forEach(function (type, i) {
  validators[type] = function validator(thing) {
    return typeof thing === type || 'a' + (i < 1 ? 'n ' : ' ') + type;
  };
});
var deprecatedWarnings = {};
/**
 * Transitional option validator
 * @param {function|boolean?} validator - set to false if the transitional option has been removed
 * @param {string?} version - deprecated version / removed since version
 * @param {string?} message - some message with additional info
 * @returns {function}
 */

validators.transitional = function transitional(validator, version, message) {
  function formatMessage(opt, desc) {
    return '[Axios v' + VERSION + '] Transitional option \'' + opt + '\'' + desc + (message ? '. ' + message : '');
  } // eslint-disable-next-line func-names


  return function (value, opt, opts) {
    if (validator === false) {
      throw new Error(formatMessage(opt, ' has been removed' + (version ? ' in ' + version : '')));
    }

    if (version && !deprecatedWarnings[opt]) {
      deprecatedWarnings[opt] = true; // eslint-disable-next-line no-console

      console.warn(formatMessage(opt, ' has been deprecated since v' + version + ' and will be removed in the near future'));
    }

    return validator ? validator(value, opt, opts) : true;
  };
};
/**
 * Assert object's properties type
 * @param {object} options
 * @param {object} schema
 * @param {boolean?} allowUnknown
 */


function assertOptions(options, schema, allowUnknown) {
  if (typeof options !== 'object') {
    throw new TypeError('options must be an object');
  }

  var keys = Object.keys(options);
  var i = keys.length;

  while (i-- > 0) {
    var opt = keys[i];
    var validator = schema[opt];

    if (validator) {
      var value = options[opt];
      var result = value === undefined || validator(value, opt, options);

      if (result !== true) {
        throw new TypeError('option ' + opt + ' must be ' + result);
      }

      continue;
    }

    if (allowUnknown !== true) {
      throw Error('Unknown option ' + opt);
    }
  }
}

module.exports = {
  assertOptions: assertOptions,
  validators: validators
};

/***/ }),

/***/ "./node_modules/axios/lib/utils.js":
/*!*****************************************!*\
  !*** ./node_modules/axios/lib/utils.js ***!
  \*****************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var bind = __webpack_require__(/*! ./helpers/bind */ "./node_modules/axios/lib/helpers/bind.js"); // utils is a library of generic helper functions non-specific to axios


var toString = Object.prototype.toString;
/**
 * Determine if a value is an Array
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Array, otherwise false
 */

function isArray(val) {
  return Array.isArray(val);
}
/**
 * Determine if a value is undefined
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if the value is undefined, otherwise false
 */


function isUndefined(val) {
  return typeof val === 'undefined';
}
/**
 * Determine if a value is a Buffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Buffer, otherwise false
 */


function isBuffer(val) {
  return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor) && typeof val.constructor.isBuffer === 'function' && val.constructor.isBuffer(val);
}
/**
 * Determine if a value is an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
 */


function isArrayBuffer(val) {
  return toString.call(val) === '[object ArrayBuffer]';
}
/**
 * Determine if a value is a FormData
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an FormData, otherwise false
 */


function isFormData(val) {
  return toString.call(val) === '[object FormData]';
}
/**
 * Determine if a value is a view on an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
 */


function isArrayBufferView(val) {
  var result;

  if (typeof ArrayBuffer !== 'undefined' && ArrayBuffer.isView) {
    result = ArrayBuffer.isView(val);
  } else {
    result = val && val.buffer && isArrayBuffer(val.buffer);
  }

  return result;
}
/**
 * Determine if a value is a String
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a String, otherwise false
 */


function isString(val) {
  return typeof val === 'string';
}
/**
 * Determine if a value is a Number
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Number, otherwise false
 */


function isNumber(val) {
  return typeof val === 'number';
}
/**
 * Determine if a value is an Object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Object, otherwise false
 */


function isObject(val) {
  return val !== null && typeof val === 'object';
}
/**
 * Determine if a value is a plain Object
 *
 * @param {Object} val The value to test
 * @return {boolean} True if value is a plain Object, otherwise false
 */


function isPlainObject(val) {
  if (toString.call(val) !== '[object Object]') {
    return false;
  }

  var prototype = Object.getPrototypeOf(val);
  return prototype === null || prototype === Object.prototype;
}
/**
 * Determine if a value is a Date
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Date, otherwise false
 */


function isDate(val) {
  return toString.call(val) === '[object Date]';
}
/**
 * Determine if a value is a File
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a File, otherwise false
 */


function isFile(val) {
  return toString.call(val) === '[object File]';
}
/**
 * Determine if a value is a Blob
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Blob, otherwise false
 */


function isBlob(val) {
  return toString.call(val) === '[object Blob]';
}
/**
 * Determine if a value is a Function
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Function, otherwise false
 */


function isFunction(val) {
  return toString.call(val) === '[object Function]';
}
/**
 * Determine if a value is a Stream
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Stream, otherwise false
 */


function isStream(val) {
  return isObject(val) && isFunction(val.pipe);
}
/**
 * Determine if a value is a URLSearchParams object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
 */


function isURLSearchParams(val) {
  return toString.call(val) === '[object URLSearchParams]';
}
/**
 * Trim excess whitespace off the beginning and end of a string
 *
 * @param {String} str The String to trim
 * @returns {String} The String freed of excess whitespace
 */


function trim(str) {
  return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g, '');
}
/**
 * Determine if we're running in a standard browser environment
 *
 * This allows axios to run in a web worker, and react-native.
 * Both environments support XMLHttpRequest, but not fully standard globals.
 *
 * web workers:
 *  typeof window -> undefined
 *  typeof document -> undefined
 *
 * react-native:
 *  navigator.product -> 'ReactNative'
 * nativescript
 *  navigator.product -> 'NativeScript' or 'NS'
 */


function isStandardBrowserEnv() {
  if (typeof navigator !== 'undefined' && (navigator.product === 'ReactNative' || navigator.product === 'NativeScript' || navigator.product === 'NS')) {
    return false;
  }

  return typeof window !== 'undefined' && typeof document !== 'undefined';
}
/**
 * Iterate over an Array or an Object invoking a function for each item.
 *
 * If `obj` is an Array callback will be called passing
 * the value, index, and complete array for each item.
 *
 * If 'obj' is an Object callback will be called passing
 * the value, key, and complete object for each property.
 *
 * @param {Object|Array} obj The object to iterate
 * @param {Function} fn The callback to invoke for each item
 */


function forEach(obj, fn) {
  // Don't bother if no value provided
  if (obj === null || typeof obj === 'undefined') {
    return;
  } // Force an array if not already something iterable


  if (typeof obj !== 'object') {
    /*eslint no-param-reassign:0*/
    obj = [obj];
  }

  if (isArray(obj)) {
    // Iterate over array values
    for (var i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    // Iterate over object keys
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        fn.call(null, obj[key], key, obj);
      }
    }
  }
}
/**
 * Accepts varargs expecting each argument to be an object, then
 * immutably merges the properties of each object and returns result.
 *
 * When multiple objects contain the same key the later object in
 * the arguments list will take precedence.
 *
 * Example:
 *
 * ```js
 * var result = merge({foo: 123}, {foo: 456});
 * console.log(result.foo); // outputs 456
 * ```
 *
 * @param {Object} obj1 Object to merge
 * @returns {Object} Result of all merge properties
 */


function
  /* obj1, obj2, obj3, ... */
merge() {
  var result = {};

  function assignValue(val, key) {
    if (isPlainObject(result[key]) && isPlainObject(val)) {
      result[key] = merge(result[key], val);
    } else if (isPlainObject(val)) {
      result[key] = merge({}, val);
    } else if (isArray(val)) {
      result[key] = val.slice();
    } else {
      result[key] = val;
    }
  }

  for (var i = 0, l = arguments.length; i < l; i++) {
    forEach(arguments[i], assignValue);
  }

  return result;
}
/**
 * Extends object a by mutably adding to it the properties of object b.
 *
 * @param {Object} a The object to be extended
 * @param {Object} b The object to copy properties from
 * @param {Object} thisArg The object to bind function to
 * @return {Object} The resulting value of object a
 */


function extend(a, b, thisArg) {
  forEach(b, function assignValue(val, key) {
    if (thisArg && typeof val === 'function') {
      a[key] = bind(val, thisArg);
    } else {
      a[key] = val;
    }
  });
  return a;
}
/**
 * Remove byte order marker. This catches EF BB BF (the UTF-8 BOM)
 *
 * @param {string} content with BOM
 * @return {string} content value without BOM
 */


function stripBOM(content) {
  if (content.charCodeAt(0) === 0xFEFF) {
    content = content.slice(1);
  }

  return content;
}

module.exports = {
  isArray: isArray,
  isArrayBuffer: isArrayBuffer,
  isBuffer: isBuffer,
  isFormData: isFormData,
  isArrayBufferView: isArrayBufferView,
  isString: isString,
  isNumber: isNumber,
  isObject: isObject,
  isPlainObject: isPlainObject,
  isUndefined: isUndefined,
  isDate: isDate,
  isFile: isFile,
  isBlob: isBlob,
  isFunction: isFunction,
  isStream: isStream,
  isURLSearchParams: isURLSearchParams,
  isStandardBrowserEnv: isStandardBrowserEnv,
  forEach: forEach,
  merge: merge,
  extend: extend,
  trim: trim,
  stripBOM: stripBOM
};

/***/ }),

/***/ "./src/arrowFn.js":
/*!************************!*\
  !*** ./src/arrowFn.js ***!
  \************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "arrow": function() { return /* binding */ arrow; }
/* harmony export */ });
/* arrowFn.js */
var arrow = function arrow() {
  return 'arrow function example';
};

/***/ }),

/***/ "./src/mouse.js":
/*!**********************!*\
  !*** ./src/mouse.js ***!
  \**********************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "mouse": function() { return /* binding */ mouse; }
/* harmony export */ });
// mouse.js
var mouse = 'Jerry';

/***/ }),

/***/ "./node_modules/core-js/es/function/index.js":
/*!***************************************************!*\
  !*** ./node_modules/core-js/es/function/index.js ***!
  \***************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

__webpack_require__(/*! ../../modules/es.function.bind */ "./node_modules/core-js/modules/es.function.bind.js");

__webpack_require__(/*! ../../modules/es.function.name */ "./node_modules/core-js/modules/es.function.name.js");

__webpack_require__(/*! ../../modules/es.function.has-instance */ "./node_modules/core-js/modules/es.function.has-instance.js");

var path = __webpack_require__(/*! ../../internals/path */ "./node_modules/core-js/internals/path.js");

module.exports = path.Function;

/***/ }),

/***/ "./node_modules/core-js/internals/a-callable.js":
/*!******************************************************!*\
  !*** ./node_modules/core-js/internals/a-callable.js ***!
  \******************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js/internals/global.js");

var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js/internals/is-callable.js");

var tryToString = __webpack_require__(/*! ../internals/try-to-string */ "./node_modules/core-js/internals/try-to-string.js");

var TypeError = global.TypeError; // `Assert: IsCallable(argument) is true`

module.exports = function (argument) {
  if (isCallable(argument)) return argument;
  throw TypeError(tryToString(argument) + ' is not a function');
};

/***/ }),

/***/ "./node_modules/core-js/internals/an-object.js":
/*!*****************************************************!*\
  !*** ./node_modules/core-js/internals/an-object.js ***!
  \*****************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js/internals/global.js");

var isObject = __webpack_require__(/*! ../internals/is-object */ "./node_modules/core-js/internals/is-object.js");

var String = global.String;
var TypeError = global.TypeError; // `Assert: Type(argument) is Object`

module.exports = function (argument) {
  if (isObject(argument)) return argument;
  throw TypeError(String(argument) + ' is not an object');
};

/***/ }),

/***/ "./node_modules/core-js/internals/array-includes.js":
/*!**********************************************************!*\
  !*** ./node_modules/core-js/internals/array-includes.js ***!
  \**********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var toIndexedObject = __webpack_require__(/*! ../internals/to-indexed-object */ "./node_modules/core-js/internals/to-indexed-object.js");

var toAbsoluteIndex = __webpack_require__(/*! ../internals/to-absolute-index */ "./node_modules/core-js/internals/to-absolute-index.js");

var lengthOfArrayLike = __webpack_require__(/*! ../internals/length-of-array-like */ "./node_modules/core-js/internals/length-of-array-like.js"); // `Array.prototype.{ indexOf, includes }` methods implementation


var createMethod = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIndexedObject($this);
    var length = lengthOfArrayLike(O);
    var index = toAbsoluteIndex(fromIndex, length);
    var value; // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare -- NaN check

    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++]; // eslint-disable-next-line no-self-compare -- NaN check

      if (value != value) return true; // Array#indexOf ignores holes, Array#includes - not
    } else for (; length > index; index++) {
      if ((IS_INCLUDES || index in O) && O[index] === el) return IS_INCLUDES || index || 0;
    }
    return !IS_INCLUDES && -1;
  };
};

module.exports = {
  // `Array.prototype.includes` method
  // https://tc39.es/ecma262/#sec-array.prototype.includes
  includes: createMethod(true),
  // `Array.prototype.indexOf` method
  // https://tc39.es/ecma262/#sec-array.prototype.indexof
  indexOf: createMethod(false)
};

/***/ }),

/***/ "./node_modules/core-js/internals/array-slice.js":
/*!*******************************************************!*\
  !*** ./node_modules/core-js/internals/array-slice.js ***!
  \*******************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js/internals/function-uncurry-this.js");

module.exports = uncurryThis([].slice);

/***/ }),

/***/ "./node_modules/core-js/internals/classof-raw.js":
/*!*******************************************************!*\
  !*** ./node_modules/core-js/internals/classof-raw.js ***!
  \*******************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js/internals/function-uncurry-this.js");

var toString = uncurryThis({}.toString);
var stringSlice = uncurryThis(''.slice);

module.exports = function (it) {
  return stringSlice(toString(it), 8, -1);
};

/***/ }),

/***/ "./node_modules/core-js/internals/copy-constructor-properties.js":
/*!***********************************************************************!*\
  !*** ./node_modules/core-js/internals/copy-constructor-properties.js ***!
  \***********************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var hasOwn = __webpack_require__(/*! ../internals/has-own-property */ "./node_modules/core-js/internals/has-own-property.js");

var ownKeys = __webpack_require__(/*! ../internals/own-keys */ "./node_modules/core-js/internals/own-keys.js");

var getOwnPropertyDescriptorModule = __webpack_require__(/*! ../internals/object-get-own-property-descriptor */ "./node_modules/core-js/internals/object-get-own-property-descriptor.js");

var definePropertyModule = __webpack_require__(/*! ../internals/object-define-property */ "./node_modules/core-js/internals/object-define-property.js");

module.exports = function (target, source, exceptions) {
  var keys = ownKeys(source);
  var defineProperty = definePropertyModule.f;
  var getOwnPropertyDescriptor = getOwnPropertyDescriptorModule.f;

  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];

    if (!hasOwn(target, key) && !(exceptions && hasOwn(exceptions, key))) {
      defineProperty(target, key, getOwnPropertyDescriptor(source, key));
    }
  }
};

/***/ }),

/***/ "./node_modules/core-js/internals/correct-prototype-getter.js":
/*!********************************************************************!*\
  !*** ./node_modules/core-js/internals/correct-prototype-getter.js ***!
  \********************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js/internals/fails.js");

module.exports = !fails(function () {
  function F() {
    /* empty */
  }

  F.prototype.constructor = null; // eslint-disable-next-line es/no-object-getprototypeof -- required for testing

  return Object.getPrototypeOf(new F()) !== F.prototype;
});

/***/ }),

/***/ "./node_modules/core-js/internals/create-non-enumerable-property.js":
/*!**************************************************************************!*\
  !*** ./node_modules/core-js/internals/create-non-enumerable-property.js ***!
  \**************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var DESCRIPTORS = __webpack_require__(/*! ../internals/descriptors */ "./node_modules/core-js/internals/descriptors.js");

var definePropertyModule = __webpack_require__(/*! ../internals/object-define-property */ "./node_modules/core-js/internals/object-define-property.js");

var createPropertyDescriptor = __webpack_require__(/*! ../internals/create-property-descriptor */ "./node_modules/core-js/internals/create-property-descriptor.js");

module.exports = DESCRIPTORS ? function (object, key, value) {
  return definePropertyModule.f(object, key, createPropertyDescriptor(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};

/***/ }),

/***/ "./node_modules/core-js/internals/create-property-descriptor.js":
/*!**********************************************************************!*\
  !*** ./node_modules/core-js/internals/create-property-descriptor.js ***!
  \**********************************************************************/
/***/ (function(module) {

module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};

/***/ }),

/***/ "./node_modules/core-js/internals/descriptors.js":
/*!*******************************************************!*\
  !*** ./node_modules/core-js/internals/descriptors.js ***!
  \*******************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js/internals/fails.js"); // Detect IE8's incomplete defineProperty implementation


module.exports = !fails(function () {
  // eslint-disable-next-line es/no-object-defineproperty -- required for testing
  return Object.defineProperty({}, 1, {
    get: function () {
      return 7;
    }
  })[1] != 7;
});

/***/ }),

/***/ "./node_modules/core-js/internals/document-create-element.js":
/*!*******************************************************************!*\
  !*** ./node_modules/core-js/internals/document-create-element.js ***!
  \*******************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js/internals/global.js");

var isObject = __webpack_require__(/*! ../internals/is-object */ "./node_modules/core-js/internals/is-object.js");

var document = global.document; // typeof document.createElement is 'object' in old IE

var EXISTS = isObject(document) && isObject(document.createElement);

module.exports = function (it) {
  return EXISTS ? document.createElement(it) : {};
};

/***/ }),

/***/ "./node_modules/core-js/internals/engine-user-agent.js":
/*!*************************************************************!*\
  !*** ./node_modules/core-js/internals/engine-user-agent.js ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var getBuiltIn = __webpack_require__(/*! ../internals/get-built-in */ "./node_modules/core-js/internals/get-built-in.js");

module.exports = getBuiltIn('navigator', 'userAgent') || '';

/***/ }),

/***/ "./node_modules/core-js/internals/engine-v8-version.js":
/*!*************************************************************!*\
  !*** ./node_modules/core-js/internals/engine-v8-version.js ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js/internals/global.js");

var userAgent = __webpack_require__(/*! ../internals/engine-user-agent */ "./node_modules/core-js/internals/engine-user-agent.js");

var process = global.process;
var Deno = global.Deno;
var versions = process && process.versions || Deno && Deno.version;
var v8 = versions && versions.v8;
var match, version;

if (v8) {
  match = v8.split('.'); // in old Chrome, versions of V8 isn't V8 = Chrome / 10
  // but their correct versions are not interesting for us

  version = match[0] > 0 && match[0] < 4 ? 1 : +(match[0] + match[1]);
} // BrowserFS NodeJS `process` polyfill incorrectly set `.v8` to `0.0`
// so check `userAgent` even if `.v8` exists, but 0


if (!version && userAgent) {
  match = userAgent.match(/Edge\/(\d+)/);

  if (!match || match[1] >= 74) {
    match = userAgent.match(/Chrome\/(\d+)/);
    if (match) version = +match[1];
  }
}

module.exports = version;

/***/ }),

/***/ "./node_modules/core-js/internals/enum-bug-keys.js":
/*!*********************************************************!*\
  !*** ./node_modules/core-js/internals/enum-bug-keys.js ***!
  \*********************************************************/
/***/ (function(module) {

// IE8- don't enum bug keys
module.exports = ['constructor', 'hasOwnProperty', 'isPrototypeOf', 'propertyIsEnumerable', 'toLocaleString', 'toString', 'valueOf'];

/***/ }),

/***/ "./node_modules/core-js/internals/export.js":
/*!**************************************************!*\
  !*** ./node_modules/core-js/internals/export.js ***!
  \**************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js/internals/global.js");

var getOwnPropertyDescriptor = (__webpack_require__(/*! ../internals/object-get-own-property-descriptor */ "./node_modules/core-js/internals/object-get-own-property-descriptor.js").f);

var createNonEnumerableProperty = __webpack_require__(/*! ../internals/create-non-enumerable-property */ "./node_modules/core-js/internals/create-non-enumerable-property.js");

var redefine = __webpack_require__(/*! ../internals/redefine */ "./node_modules/core-js/internals/redefine.js");

var setGlobal = __webpack_require__(/*! ../internals/set-global */ "./node_modules/core-js/internals/set-global.js");

var copyConstructorProperties = __webpack_require__(/*! ../internals/copy-constructor-properties */ "./node_modules/core-js/internals/copy-constructor-properties.js");

var isForced = __webpack_require__(/*! ../internals/is-forced */ "./node_modules/core-js/internals/is-forced.js");
/*
  options.target      - name of the target object
  options.global      - target is the global object
  options.stat        - export as static methods of target
  options.proto       - export as prototype methods of target
  options.real        - real prototype method for the `pure` version
  options.forced      - export even if the native feature is available
  options.bind        - bind methods to the target, required for the `pure` version
  options.wrap        - wrap constructors to preventing global pollution, required for the `pure` version
  options.unsafe      - use the simple assignment of property instead of delete + defineProperty
  options.sham        - add a flag to not completely full polyfills
  options.enumerable  - export as enumerable property
  options.noTargetGet - prevent calling a getter on target
  options.name        - the .name of the function if it does not match the key
*/


module.exports = function (options, source) {
  var TARGET = options.target;
  var GLOBAL = options.global;
  var STATIC = options.stat;
  var FORCED, target, key, targetProperty, sourceProperty, descriptor;

  if (GLOBAL) {
    target = global;
  } else if (STATIC) {
    target = global[TARGET] || setGlobal(TARGET, {});
  } else {
    target = (global[TARGET] || {}).prototype;
  }

  if (target) for (key in source) {
    sourceProperty = source[key];

    if (options.noTargetGet) {
      descriptor = getOwnPropertyDescriptor(target, key);
      targetProperty = descriptor && descriptor.value;
    } else targetProperty = target[key];

    FORCED = isForced(GLOBAL ? key : TARGET + (STATIC ? '.' : '#') + key, options.forced); // contained in target

    if (!FORCED && targetProperty !== undefined) {
      if (typeof sourceProperty == typeof targetProperty) continue;
      copyConstructorProperties(sourceProperty, targetProperty);
    } // add a flag to not completely full polyfills


    if (options.sham || targetProperty && targetProperty.sham) {
      createNonEnumerableProperty(sourceProperty, 'sham', true);
    } // extend global


    redefine(target, key, sourceProperty, options);
  }
};

/***/ }),

/***/ "./node_modules/core-js/internals/fails.js":
/*!*************************************************!*\
  !*** ./node_modules/core-js/internals/fails.js ***!
  \*************************************************/
/***/ (function(module) {

module.exports = function (exec) {
  try {
    return !!exec();
  } catch (error) {
    return true;
  }
};

/***/ }),

/***/ "./node_modules/core-js/internals/function-bind-native.js":
/*!****************************************************************!*\
  !*** ./node_modules/core-js/internals/function-bind-native.js ***!
  \****************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js/internals/fails.js");

module.exports = !fails(function () {
  var test = function () {
    /* empty */
  }.bind(); // eslint-disable-next-line no-prototype-builtins -- safe


  return typeof test != 'function' || test.hasOwnProperty('prototype');
});

/***/ }),

/***/ "./node_modules/core-js/internals/function-bind.js":
/*!*********************************************************!*\
  !*** ./node_modules/core-js/internals/function-bind.js ***!
  \*********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js/internals/global.js");

var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js/internals/function-uncurry-this.js");

var aCallable = __webpack_require__(/*! ../internals/a-callable */ "./node_modules/core-js/internals/a-callable.js");

var isObject = __webpack_require__(/*! ../internals/is-object */ "./node_modules/core-js/internals/is-object.js");

var hasOwn = __webpack_require__(/*! ../internals/has-own-property */ "./node_modules/core-js/internals/has-own-property.js");

var arraySlice = __webpack_require__(/*! ../internals/array-slice */ "./node_modules/core-js/internals/array-slice.js");

var NATIVE_BIND = __webpack_require__(/*! ../internals/function-bind-native */ "./node_modules/core-js/internals/function-bind-native.js");

var Function = global.Function;
var concat = uncurryThis([].concat);
var join = uncurryThis([].join);
var factories = {};

var construct = function (C, argsLength, args) {
  if (!hasOwn(factories, argsLength)) {
    for (var list = [], i = 0; i < argsLength; i++) list[i] = 'a[' + i + ']';

    factories[argsLength] = Function('C,a', 'return new C(' + join(list, ',') + ')');
  }

  return factories[argsLength](C, args);
}; // `Function.prototype.bind` method implementation
// https://tc39.es/ecma262/#sec-function.prototype.bind


module.exports = NATIVE_BIND ? Function.bind : function bind(that
/* , ...args */
) {
  var F = aCallable(this);
  var Prototype = F.prototype;
  var partArgs = arraySlice(arguments, 1);

  var boundFunction = function
    /* args... */
  bound() {
    var args = concat(partArgs, arraySlice(arguments));
    return this instanceof boundFunction ? construct(F, args.length, args) : F.apply(that, args);
  };

  if (isObject(Prototype)) boundFunction.prototype = Prototype;
  return boundFunction;
};

/***/ }),

/***/ "./node_modules/core-js/internals/function-call.js":
/*!*********************************************************!*\
  !*** ./node_modules/core-js/internals/function-call.js ***!
  \*********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var NATIVE_BIND = __webpack_require__(/*! ../internals/function-bind-native */ "./node_modules/core-js/internals/function-bind-native.js");

var call = Function.prototype.call;
module.exports = NATIVE_BIND ? call.bind(call) : function () {
  return call.apply(call, arguments);
};

/***/ }),

/***/ "./node_modules/core-js/internals/function-name.js":
/*!*********************************************************!*\
  !*** ./node_modules/core-js/internals/function-name.js ***!
  \*********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var DESCRIPTORS = __webpack_require__(/*! ../internals/descriptors */ "./node_modules/core-js/internals/descriptors.js");

var hasOwn = __webpack_require__(/*! ../internals/has-own-property */ "./node_modules/core-js/internals/has-own-property.js");

var FunctionPrototype = Function.prototype; // eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe

var getDescriptor = DESCRIPTORS && Object.getOwnPropertyDescriptor;
var EXISTS = hasOwn(FunctionPrototype, 'name'); // additional protection from minified / mangled / dropped function names

var PROPER = EXISTS && function something() {
  /* empty */
}.name === 'something';

var CONFIGURABLE = EXISTS && (!DESCRIPTORS || DESCRIPTORS && getDescriptor(FunctionPrototype, 'name').configurable);
module.exports = {
  EXISTS: EXISTS,
  PROPER: PROPER,
  CONFIGURABLE: CONFIGURABLE
};

/***/ }),

/***/ "./node_modules/core-js/internals/function-uncurry-this.js":
/*!*****************************************************************!*\
  !*** ./node_modules/core-js/internals/function-uncurry-this.js ***!
  \*****************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var NATIVE_BIND = __webpack_require__(/*! ../internals/function-bind-native */ "./node_modules/core-js/internals/function-bind-native.js");

var FunctionPrototype = Function.prototype;
var bind = FunctionPrototype.bind;
var call = FunctionPrototype.call;
var uncurryThis = NATIVE_BIND && bind.bind(call, call);
module.exports = NATIVE_BIND ? function (fn) {
  return fn && uncurryThis(fn);
} : function (fn) {
  return fn && function () {
    return call.apply(fn, arguments);
  };
};

/***/ }),

/***/ "./node_modules/core-js/internals/get-built-in.js":
/*!********************************************************!*\
  !*** ./node_modules/core-js/internals/get-built-in.js ***!
  \********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js/internals/global.js");

var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js/internals/is-callable.js");

var aFunction = function (argument) {
  return isCallable(argument) ? argument : undefined;
};

module.exports = function (namespace, method) {
  return arguments.length < 2 ? aFunction(global[namespace]) : global[namespace] && global[namespace][method];
};

/***/ }),

/***/ "./node_modules/core-js/internals/get-method.js":
/*!******************************************************!*\
  !*** ./node_modules/core-js/internals/get-method.js ***!
  \******************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var aCallable = __webpack_require__(/*! ../internals/a-callable */ "./node_modules/core-js/internals/a-callable.js"); // `GetMethod` abstract operation
// https://tc39.es/ecma262/#sec-getmethod


module.exports = function (V, P) {
  var func = V[P];
  return func == null ? undefined : aCallable(func);
};

/***/ }),

/***/ "./node_modules/core-js/internals/global.js":
/*!**************************************************!*\
  !*** ./node_modules/core-js/internals/global.js ***!
  \**************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var check = function (it) {
  return it && it.Math == Math && it;
}; // https://github.com/zloirock/core-js/issues/86#issuecomment-115759028


module.exports = // eslint-disable-next-line es/no-global-this -- safe
check(typeof globalThis == 'object' && globalThis) || check(typeof window == 'object' && window) || // eslint-disable-next-line no-restricted-globals -- safe
check(typeof self == 'object' && self) || check(typeof __webpack_require__.g == 'object' && __webpack_require__.g) || // eslint-disable-next-line no-new-func -- fallback
function () {
  return this;
}() || Function('return this')();

/***/ }),

/***/ "./node_modules/core-js/internals/has-own-property.js":
/*!************************************************************!*\
  !*** ./node_modules/core-js/internals/has-own-property.js ***!
  \************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js/internals/function-uncurry-this.js");

var toObject = __webpack_require__(/*! ../internals/to-object */ "./node_modules/core-js/internals/to-object.js");

var hasOwnProperty = uncurryThis({}.hasOwnProperty); // `HasOwnProperty` abstract operation
// https://tc39.es/ecma262/#sec-hasownproperty

module.exports = Object.hasOwn || function hasOwn(it, key) {
  return hasOwnProperty(toObject(it), key);
};

/***/ }),

/***/ "./node_modules/core-js/internals/hidden-keys.js":
/*!*******************************************************!*\
  !*** ./node_modules/core-js/internals/hidden-keys.js ***!
  \*******************************************************/
/***/ (function(module) {

module.exports = {};

/***/ }),

/***/ "./node_modules/core-js/internals/ie8-dom-define.js":
/*!**********************************************************!*\
  !*** ./node_modules/core-js/internals/ie8-dom-define.js ***!
  \**********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var DESCRIPTORS = __webpack_require__(/*! ../internals/descriptors */ "./node_modules/core-js/internals/descriptors.js");

var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js/internals/fails.js");

var createElement = __webpack_require__(/*! ../internals/document-create-element */ "./node_modules/core-js/internals/document-create-element.js"); // Thanks to IE8 for its funny defineProperty


module.exports = !DESCRIPTORS && !fails(function () {
  // eslint-disable-next-line es/no-object-defineproperty -- required for testing
  return Object.defineProperty(createElement('div'), 'a', {
    get: function () {
      return 7;
    }
  }).a != 7;
});

/***/ }),

/***/ "./node_modules/core-js/internals/indexed-object.js":
/*!**********************************************************!*\
  !*** ./node_modules/core-js/internals/indexed-object.js ***!
  \**********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js/internals/global.js");

var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js/internals/function-uncurry-this.js");

var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js/internals/fails.js");

var classof = __webpack_require__(/*! ../internals/classof-raw */ "./node_modules/core-js/internals/classof-raw.js");

var Object = global.Object;
var split = uncurryThis(''.split); // fallback for non-array-like ES3 and non-enumerable old V8 strings

module.exports = fails(function () {
  // throws an error in rhino, see https://github.com/mozilla/rhino/issues/346
  // eslint-disable-next-line no-prototype-builtins -- safe
  return !Object('z').propertyIsEnumerable(0);
}) ? function (it) {
  return classof(it) == 'String' ? split(it, '') : Object(it);
} : Object;

/***/ }),

/***/ "./node_modules/core-js/internals/inspect-source.js":
/*!**********************************************************!*\
  !*** ./node_modules/core-js/internals/inspect-source.js ***!
  \**********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js/internals/function-uncurry-this.js");

var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js/internals/is-callable.js");

var store = __webpack_require__(/*! ../internals/shared-store */ "./node_modules/core-js/internals/shared-store.js");

var functionToString = uncurryThis(Function.toString); // this helper broken in `core-js@3.4.1-3.4.4`, so we can't use `shared` helper

if (!isCallable(store.inspectSource)) {
  store.inspectSource = function (it) {
    return functionToString(it);
  };
}

module.exports = store.inspectSource;

/***/ }),

/***/ "./node_modules/core-js/internals/internal-state.js":
/*!**********************************************************!*\
  !*** ./node_modules/core-js/internals/internal-state.js ***!
  \**********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var NATIVE_WEAK_MAP = __webpack_require__(/*! ../internals/native-weak-map */ "./node_modules/core-js/internals/native-weak-map.js");

var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js/internals/global.js");

var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js/internals/function-uncurry-this.js");

var isObject = __webpack_require__(/*! ../internals/is-object */ "./node_modules/core-js/internals/is-object.js");

var createNonEnumerableProperty = __webpack_require__(/*! ../internals/create-non-enumerable-property */ "./node_modules/core-js/internals/create-non-enumerable-property.js");

var hasOwn = __webpack_require__(/*! ../internals/has-own-property */ "./node_modules/core-js/internals/has-own-property.js");

var shared = __webpack_require__(/*! ../internals/shared-store */ "./node_modules/core-js/internals/shared-store.js");

var sharedKey = __webpack_require__(/*! ../internals/shared-key */ "./node_modules/core-js/internals/shared-key.js");

var hiddenKeys = __webpack_require__(/*! ../internals/hidden-keys */ "./node_modules/core-js/internals/hidden-keys.js");

var OBJECT_ALREADY_INITIALIZED = 'Object already initialized';
var TypeError = global.TypeError;
var WeakMap = global.WeakMap;
var set, get, has;

var enforce = function (it) {
  return has(it) ? get(it) : set(it, {});
};

var getterFor = function (TYPE) {
  return function (it) {
    var state;

    if (!isObject(it) || (state = get(it)).type !== TYPE) {
      throw TypeError('Incompatible receiver, ' + TYPE + ' required');
    }

    return state;
  };
};

if (NATIVE_WEAK_MAP || shared.state) {
  var store = shared.state || (shared.state = new WeakMap());
  var wmget = uncurryThis(store.get);
  var wmhas = uncurryThis(store.has);
  var wmset = uncurryThis(store.set);

  set = function (it, metadata) {
    if (wmhas(store, it)) throw new TypeError(OBJECT_ALREADY_INITIALIZED);
    metadata.facade = it;
    wmset(store, it, metadata);
    return metadata;
  };

  get = function (it) {
    return wmget(store, it) || {};
  };

  has = function (it) {
    return wmhas(store, it);
  };
} else {
  var STATE = sharedKey('state');
  hiddenKeys[STATE] = true;

  set = function (it, metadata) {
    if (hasOwn(it, STATE)) throw new TypeError(OBJECT_ALREADY_INITIALIZED);
    metadata.facade = it;
    createNonEnumerableProperty(it, STATE, metadata);
    return metadata;
  };

  get = function (it) {
    return hasOwn(it, STATE) ? it[STATE] : {};
  };

  has = function (it) {
    return hasOwn(it, STATE);
  };
}

module.exports = {
  set: set,
  get: get,
  has: has,
  enforce: enforce,
  getterFor: getterFor
};

/***/ }),

/***/ "./node_modules/core-js/internals/is-callable.js":
/*!*******************************************************!*\
  !*** ./node_modules/core-js/internals/is-callable.js ***!
  \*******************************************************/
/***/ (function(module) {

// `IsCallable` abstract operation
// https://tc39.es/ecma262/#sec-iscallable
module.exports = function (argument) {
  return typeof argument == 'function';
};

/***/ }),

/***/ "./node_modules/core-js/internals/is-forced.js":
/*!*****************************************************!*\
  !*** ./node_modules/core-js/internals/is-forced.js ***!
  \*****************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js/internals/fails.js");

var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js/internals/is-callable.js");

var replacement = /#|\.prototype\./;

var isForced = function (feature, detection) {
  var value = data[normalize(feature)];
  return value == POLYFILL ? true : value == NATIVE ? false : isCallable(detection) ? fails(detection) : !!detection;
};

var normalize = isForced.normalize = function (string) {
  return String(string).replace(replacement, '.').toLowerCase();
};

var data = isForced.data = {};
var NATIVE = isForced.NATIVE = 'N';
var POLYFILL = isForced.POLYFILL = 'P';
module.exports = isForced;

/***/ }),

/***/ "./node_modules/core-js/internals/is-object.js":
/*!*****************************************************!*\
  !*** ./node_modules/core-js/internals/is-object.js ***!
  \*****************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js/internals/is-callable.js");

module.exports = function (it) {
  return typeof it == 'object' ? it !== null : isCallable(it);
};

/***/ }),

/***/ "./node_modules/core-js/internals/is-pure.js":
/*!***************************************************!*\
  !*** ./node_modules/core-js/internals/is-pure.js ***!
  \***************************************************/
/***/ (function(module) {

module.exports = false;

/***/ }),

/***/ "./node_modules/core-js/internals/is-symbol.js":
/*!*****************************************************!*\
  !*** ./node_modules/core-js/internals/is-symbol.js ***!
  \*****************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js/internals/global.js");

var getBuiltIn = __webpack_require__(/*! ../internals/get-built-in */ "./node_modules/core-js/internals/get-built-in.js");

var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js/internals/is-callable.js");

var isPrototypeOf = __webpack_require__(/*! ../internals/object-is-prototype-of */ "./node_modules/core-js/internals/object-is-prototype-of.js");

var USE_SYMBOL_AS_UID = __webpack_require__(/*! ../internals/use-symbol-as-uid */ "./node_modules/core-js/internals/use-symbol-as-uid.js");

var Object = global.Object;
module.exports = USE_SYMBOL_AS_UID ? function (it) {
  return typeof it == 'symbol';
} : function (it) {
  var $Symbol = getBuiltIn('Symbol');
  return isCallable($Symbol) && isPrototypeOf($Symbol.prototype, Object(it));
};

/***/ }),

/***/ "./node_modules/core-js/internals/length-of-array-like.js":
/*!****************************************************************!*\
  !*** ./node_modules/core-js/internals/length-of-array-like.js ***!
  \****************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var toLength = __webpack_require__(/*! ../internals/to-length */ "./node_modules/core-js/internals/to-length.js"); // `LengthOfArrayLike` abstract operation
// https://tc39.es/ecma262/#sec-lengthofarraylike


module.exports = function (obj) {
  return toLength(obj.length);
};

/***/ }),

/***/ "./node_modules/core-js/internals/native-symbol.js":
/*!*********************************************************!*\
  !*** ./node_modules/core-js/internals/native-symbol.js ***!
  \*********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

/* eslint-disable es/no-symbol -- required for testing */
var V8_VERSION = __webpack_require__(/*! ../internals/engine-v8-version */ "./node_modules/core-js/internals/engine-v8-version.js");

var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js/internals/fails.js"); // eslint-disable-next-line es/no-object-getownpropertysymbols -- required for testing


module.exports = !!Object.getOwnPropertySymbols && !fails(function () {
  var symbol = Symbol(); // Chrome 38 Symbol has incorrect toString conversion
  // `get-own-property-symbols` polyfill symbols converted to object are not Symbol instances

  return !String(symbol) || !(Object(symbol) instanceof Symbol) || // Chrome 38-40 symbols are not inherited from DOM collections prototypes to instances
  !Symbol.sham && V8_VERSION && V8_VERSION < 41;
});

/***/ }),

/***/ "./node_modules/core-js/internals/native-weak-map.js":
/*!***********************************************************!*\
  !*** ./node_modules/core-js/internals/native-weak-map.js ***!
  \***********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js/internals/global.js");

var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js/internals/is-callable.js");

var inspectSource = __webpack_require__(/*! ../internals/inspect-source */ "./node_modules/core-js/internals/inspect-source.js");

var WeakMap = global.WeakMap;
module.exports = isCallable(WeakMap) && /native code/.test(inspectSource(WeakMap));

/***/ }),

/***/ "./node_modules/core-js/internals/object-define-property.js":
/*!******************************************************************!*\
  !*** ./node_modules/core-js/internals/object-define-property.js ***!
  \******************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js/internals/global.js");

var DESCRIPTORS = __webpack_require__(/*! ../internals/descriptors */ "./node_modules/core-js/internals/descriptors.js");

var IE8_DOM_DEFINE = __webpack_require__(/*! ../internals/ie8-dom-define */ "./node_modules/core-js/internals/ie8-dom-define.js");

var V8_PROTOTYPE_DEFINE_BUG = __webpack_require__(/*! ../internals/v8-prototype-define-bug */ "./node_modules/core-js/internals/v8-prototype-define-bug.js");

var anObject = __webpack_require__(/*! ../internals/an-object */ "./node_modules/core-js/internals/an-object.js");

var toPropertyKey = __webpack_require__(/*! ../internals/to-property-key */ "./node_modules/core-js/internals/to-property-key.js");

var TypeError = global.TypeError; // eslint-disable-next-line es/no-object-defineproperty -- safe

var $defineProperty = Object.defineProperty; // eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe

var $getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
var ENUMERABLE = 'enumerable';
var CONFIGURABLE = 'configurable';
var WRITABLE = 'writable'; // `Object.defineProperty` method
// https://tc39.es/ecma262/#sec-object.defineproperty

exports.f = DESCRIPTORS ? V8_PROTOTYPE_DEFINE_BUG ? function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPropertyKey(P);
  anObject(Attributes);

  if (typeof O === 'function' && P === 'prototype' && 'value' in Attributes && WRITABLE in Attributes && !Attributes[WRITABLE]) {
    var current = $getOwnPropertyDescriptor(O, P);

    if (current && current[WRITABLE]) {
      O[P] = Attributes.value;
      Attributes = {
        configurable: CONFIGURABLE in Attributes ? Attributes[CONFIGURABLE] : current[CONFIGURABLE],
        enumerable: ENUMERABLE in Attributes ? Attributes[ENUMERABLE] : current[ENUMERABLE],
        writable: false
      };
    }
  }

  return $defineProperty(O, P, Attributes);
} : $defineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPropertyKey(P);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return $defineProperty(O, P, Attributes);
  } catch (error) {
    /* empty */
  }
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};

/***/ }),

/***/ "./node_modules/core-js/internals/object-get-own-property-descriptor.js":
/*!******************************************************************************!*\
  !*** ./node_modules/core-js/internals/object-get-own-property-descriptor.js ***!
  \******************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

var DESCRIPTORS = __webpack_require__(/*! ../internals/descriptors */ "./node_modules/core-js/internals/descriptors.js");

var call = __webpack_require__(/*! ../internals/function-call */ "./node_modules/core-js/internals/function-call.js");

var propertyIsEnumerableModule = __webpack_require__(/*! ../internals/object-property-is-enumerable */ "./node_modules/core-js/internals/object-property-is-enumerable.js");

var createPropertyDescriptor = __webpack_require__(/*! ../internals/create-property-descriptor */ "./node_modules/core-js/internals/create-property-descriptor.js");

var toIndexedObject = __webpack_require__(/*! ../internals/to-indexed-object */ "./node_modules/core-js/internals/to-indexed-object.js");

var toPropertyKey = __webpack_require__(/*! ../internals/to-property-key */ "./node_modules/core-js/internals/to-property-key.js");

var hasOwn = __webpack_require__(/*! ../internals/has-own-property */ "./node_modules/core-js/internals/has-own-property.js");

var IE8_DOM_DEFINE = __webpack_require__(/*! ../internals/ie8-dom-define */ "./node_modules/core-js/internals/ie8-dom-define.js"); // eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe


var $getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor; // `Object.getOwnPropertyDescriptor` method
// https://tc39.es/ecma262/#sec-object.getownpropertydescriptor

exports.f = DESCRIPTORS ? $getOwnPropertyDescriptor : function getOwnPropertyDescriptor(O, P) {
  O = toIndexedObject(O);
  P = toPropertyKey(P);
  if (IE8_DOM_DEFINE) try {
    return $getOwnPropertyDescriptor(O, P);
  } catch (error) {
    /* empty */
  }
  if (hasOwn(O, P)) return createPropertyDescriptor(!call(propertyIsEnumerableModule.f, O, P), O[P]);
};

/***/ }),

/***/ "./node_modules/core-js/internals/object-get-own-property-names.js":
/*!*************************************************************************!*\
  !*** ./node_modules/core-js/internals/object-get-own-property-names.js ***!
  \*************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

var internalObjectKeys = __webpack_require__(/*! ../internals/object-keys-internal */ "./node_modules/core-js/internals/object-keys-internal.js");

var enumBugKeys = __webpack_require__(/*! ../internals/enum-bug-keys */ "./node_modules/core-js/internals/enum-bug-keys.js");

var hiddenKeys = enumBugKeys.concat('length', 'prototype'); // `Object.getOwnPropertyNames` method
// https://tc39.es/ecma262/#sec-object.getownpropertynames
// eslint-disable-next-line es/no-object-getownpropertynames -- safe

exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
  return internalObjectKeys(O, hiddenKeys);
};

/***/ }),

/***/ "./node_modules/core-js/internals/object-get-own-property-symbols.js":
/*!***************************************************************************!*\
  !*** ./node_modules/core-js/internals/object-get-own-property-symbols.js ***!
  \***************************************************************************/
/***/ (function(__unused_webpack_module, exports) {

// eslint-disable-next-line es/no-object-getownpropertysymbols -- safe
exports.f = Object.getOwnPropertySymbols;

/***/ }),

/***/ "./node_modules/core-js/internals/object-get-prototype-of.js":
/*!*******************************************************************!*\
  !*** ./node_modules/core-js/internals/object-get-prototype-of.js ***!
  \*******************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js/internals/global.js");

var hasOwn = __webpack_require__(/*! ../internals/has-own-property */ "./node_modules/core-js/internals/has-own-property.js");

var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js/internals/is-callable.js");

var toObject = __webpack_require__(/*! ../internals/to-object */ "./node_modules/core-js/internals/to-object.js");

var sharedKey = __webpack_require__(/*! ../internals/shared-key */ "./node_modules/core-js/internals/shared-key.js");

var CORRECT_PROTOTYPE_GETTER = __webpack_require__(/*! ../internals/correct-prototype-getter */ "./node_modules/core-js/internals/correct-prototype-getter.js");

var IE_PROTO = sharedKey('IE_PROTO');
var Object = global.Object;
var ObjectPrototype = Object.prototype; // `Object.getPrototypeOf` method
// https://tc39.es/ecma262/#sec-object.getprototypeof

module.exports = CORRECT_PROTOTYPE_GETTER ? Object.getPrototypeOf : function (O) {
  var object = toObject(O);
  if (hasOwn(object, IE_PROTO)) return object[IE_PROTO];
  var constructor = object.constructor;

  if (isCallable(constructor) && object instanceof constructor) {
    return constructor.prototype;
  }

  return object instanceof Object ? ObjectPrototype : null;
};

/***/ }),

/***/ "./node_modules/core-js/internals/object-is-prototype-of.js":
/*!******************************************************************!*\
  !*** ./node_modules/core-js/internals/object-is-prototype-of.js ***!
  \******************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js/internals/function-uncurry-this.js");

module.exports = uncurryThis({}.isPrototypeOf);

/***/ }),

/***/ "./node_modules/core-js/internals/object-keys-internal.js":
/*!****************************************************************!*\
  !*** ./node_modules/core-js/internals/object-keys-internal.js ***!
  \****************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js/internals/function-uncurry-this.js");

var hasOwn = __webpack_require__(/*! ../internals/has-own-property */ "./node_modules/core-js/internals/has-own-property.js");

var toIndexedObject = __webpack_require__(/*! ../internals/to-indexed-object */ "./node_modules/core-js/internals/to-indexed-object.js");

var indexOf = (__webpack_require__(/*! ../internals/array-includes */ "./node_modules/core-js/internals/array-includes.js").indexOf);

var hiddenKeys = __webpack_require__(/*! ../internals/hidden-keys */ "./node_modules/core-js/internals/hidden-keys.js");

var push = uncurryThis([].push);

module.exports = function (object, names) {
  var O = toIndexedObject(object);
  var i = 0;
  var result = [];
  var key;

  for (key in O) !hasOwn(hiddenKeys, key) && hasOwn(O, key) && push(result, key); // Don't enum bug & hidden keys


  while (names.length > i) if (hasOwn(O, key = names[i++])) {
    ~indexOf(result, key) || push(result, key);
  }

  return result;
};

/***/ }),

/***/ "./node_modules/core-js/internals/object-property-is-enumerable.js":
/*!*************************************************************************!*\
  !*** ./node_modules/core-js/internals/object-property-is-enumerable.js ***!
  \*************************************************************************/
/***/ (function(__unused_webpack_module, exports) {

"use strict";


var $propertyIsEnumerable = {}.propertyIsEnumerable; // eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe

var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor; // Nashorn ~ JDK8 bug

var NASHORN_BUG = getOwnPropertyDescriptor && !$propertyIsEnumerable.call({
  1: 2
}, 1); // `Object.prototype.propertyIsEnumerable` method implementation
// https://tc39.es/ecma262/#sec-object.prototype.propertyisenumerable

exports.f = NASHORN_BUG ? function propertyIsEnumerable(V) {
  var descriptor = getOwnPropertyDescriptor(this, V);
  return !!descriptor && descriptor.enumerable;
} : $propertyIsEnumerable;

/***/ }),

/***/ "./node_modules/core-js/internals/ordinary-to-primitive.js":
/*!*****************************************************************!*\
  !*** ./node_modules/core-js/internals/ordinary-to-primitive.js ***!
  \*****************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js/internals/global.js");

var call = __webpack_require__(/*! ../internals/function-call */ "./node_modules/core-js/internals/function-call.js");

var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js/internals/is-callable.js");

var isObject = __webpack_require__(/*! ../internals/is-object */ "./node_modules/core-js/internals/is-object.js");

var TypeError = global.TypeError; // `OrdinaryToPrimitive` abstract operation
// https://tc39.es/ecma262/#sec-ordinarytoprimitive

module.exports = function (input, pref) {
  var fn, val;
  if (pref === 'string' && isCallable(fn = input.toString) && !isObject(val = call(fn, input))) return val;
  if (isCallable(fn = input.valueOf) && !isObject(val = call(fn, input))) return val;
  if (pref !== 'string' && isCallable(fn = input.toString) && !isObject(val = call(fn, input))) return val;
  throw TypeError("Can't convert object to primitive value");
};

/***/ }),

/***/ "./node_modules/core-js/internals/own-keys.js":
/*!****************************************************!*\
  !*** ./node_modules/core-js/internals/own-keys.js ***!
  \****************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var getBuiltIn = __webpack_require__(/*! ../internals/get-built-in */ "./node_modules/core-js/internals/get-built-in.js");

var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js/internals/function-uncurry-this.js");

var getOwnPropertyNamesModule = __webpack_require__(/*! ../internals/object-get-own-property-names */ "./node_modules/core-js/internals/object-get-own-property-names.js");

var getOwnPropertySymbolsModule = __webpack_require__(/*! ../internals/object-get-own-property-symbols */ "./node_modules/core-js/internals/object-get-own-property-symbols.js");

var anObject = __webpack_require__(/*! ../internals/an-object */ "./node_modules/core-js/internals/an-object.js");

var concat = uncurryThis([].concat); // all object keys, includes non-enumerable and symbols

module.exports = getBuiltIn('Reflect', 'ownKeys') || function ownKeys(it) {
  var keys = getOwnPropertyNamesModule.f(anObject(it));
  var getOwnPropertySymbols = getOwnPropertySymbolsModule.f;
  return getOwnPropertySymbols ? concat(keys, getOwnPropertySymbols(it)) : keys;
};

/***/ }),

/***/ "./node_modules/core-js/internals/path.js":
/*!************************************************!*\
  !*** ./node_modules/core-js/internals/path.js ***!
  \************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js/internals/global.js");

module.exports = global;

/***/ }),

/***/ "./node_modules/core-js/internals/redefine.js":
/*!****************************************************!*\
  !*** ./node_modules/core-js/internals/redefine.js ***!
  \****************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js/internals/global.js");

var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js/internals/is-callable.js");

var hasOwn = __webpack_require__(/*! ../internals/has-own-property */ "./node_modules/core-js/internals/has-own-property.js");

var createNonEnumerableProperty = __webpack_require__(/*! ../internals/create-non-enumerable-property */ "./node_modules/core-js/internals/create-non-enumerable-property.js");

var setGlobal = __webpack_require__(/*! ../internals/set-global */ "./node_modules/core-js/internals/set-global.js");

var inspectSource = __webpack_require__(/*! ../internals/inspect-source */ "./node_modules/core-js/internals/inspect-source.js");

var InternalStateModule = __webpack_require__(/*! ../internals/internal-state */ "./node_modules/core-js/internals/internal-state.js");

var CONFIGURABLE_FUNCTION_NAME = (__webpack_require__(/*! ../internals/function-name */ "./node_modules/core-js/internals/function-name.js").CONFIGURABLE);

var getInternalState = InternalStateModule.get;
var enforceInternalState = InternalStateModule.enforce;
var TEMPLATE = String(String).split('String');
(module.exports = function (O, key, value, options) {
  var unsafe = options ? !!options.unsafe : false;
  var simple = options ? !!options.enumerable : false;
  var noTargetGet = options ? !!options.noTargetGet : false;
  var name = options && options.name !== undefined ? options.name : key;
  var state;

  if (isCallable(value)) {
    if (String(name).slice(0, 7) === 'Symbol(') {
      name = '[' + String(name).replace(/^Symbol\(([^)]*)\)/, '$1') + ']';
    }

    if (!hasOwn(value, 'name') || CONFIGURABLE_FUNCTION_NAME && value.name !== name) {
      createNonEnumerableProperty(value, 'name', name);
    }

    state = enforceInternalState(value);

    if (!state.source) {
      state.source = TEMPLATE.join(typeof name == 'string' ? name : '');
    }
  }

  if (O === global) {
    if (simple) O[key] = value;else setGlobal(key, value);
    return;
  } else if (!unsafe) {
    delete O[key];
  } else if (!noTargetGet && O[key]) {
    simple = true;
  }

  if (simple) O[key] = value;else createNonEnumerableProperty(O, key, value); // add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
})(Function.prototype, 'toString', function toString() {
  return isCallable(this) && getInternalState(this).source || inspectSource(this);
});

/***/ }),

/***/ "./node_modules/core-js/internals/require-object-coercible.js":
/*!********************************************************************!*\
  !*** ./node_modules/core-js/internals/require-object-coercible.js ***!
  \********************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js/internals/global.js");

var TypeError = global.TypeError; // `RequireObjectCoercible` abstract operation
// https://tc39.es/ecma262/#sec-requireobjectcoercible

module.exports = function (it) {
  if (it == undefined) throw TypeError("Can't call method on " + it);
  return it;
};

/***/ }),

/***/ "./node_modules/core-js/internals/set-global.js":
/*!******************************************************!*\
  !*** ./node_modules/core-js/internals/set-global.js ***!
  \******************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js/internals/global.js"); // eslint-disable-next-line es/no-object-defineproperty -- safe


var defineProperty = Object.defineProperty;

module.exports = function (key, value) {
  try {
    defineProperty(global, key, {
      value: value,
      configurable: true,
      writable: true
    });
  } catch (error) {
    global[key] = value;
  }

  return value;
};

/***/ }),

/***/ "./node_modules/core-js/internals/shared-key.js":
/*!******************************************************!*\
  !*** ./node_modules/core-js/internals/shared-key.js ***!
  \******************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var shared = __webpack_require__(/*! ../internals/shared */ "./node_modules/core-js/internals/shared.js");

var uid = __webpack_require__(/*! ../internals/uid */ "./node_modules/core-js/internals/uid.js");

var keys = shared('keys');

module.exports = function (key) {
  return keys[key] || (keys[key] = uid(key));
};

/***/ }),

/***/ "./node_modules/core-js/internals/shared-store.js":
/*!********************************************************!*\
  !*** ./node_modules/core-js/internals/shared-store.js ***!
  \********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js/internals/global.js");

var setGlobal = __webpack_require__(/*! ../internals/set-global */ "./node_modules/core-js/internals/set-global.js");

var SHARED = '__core-js_shared__';
var store = global[SHARED] || setGlobal(SHARED, {});
module.exports = store;

/***/ }),

/***/ "./node_modules/core-js/internals/shared.js":
/*!**************************************************!*\
  !*** ./node_modules/core-js/internals/shared.js ***!
  \**************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var IS_PURE = __webpack_require__(/*! ../internals/is-pure */ "./node_modules/core-js/internals/is-pure.js");

var store = __webpack_require__(/*! ../internals/shared-store */ "./node_modules/core-js/internals/shared-store.js");

(module.exports = function (key, value) {
  return store[key] || (store[key] = value !== undefined ? value : {});
})('versions', []).push({
  version: '3.21.1',
  mode: IS_PURE ? 'pure' : 'global',
  copyright: '© 2014-2022 Denis Pushkarev (zloirock.ru)',
  license: 'https://github.com/zloirock/core-js/blob/v3.21.1/LICENSE',
  source: 'https://github.com/zloirock/core-js'
});

/***/ }),

/***/ "./node_modules/core-js/internals/to-absolute-index.js":
/*!*************************************************************!*\
  !*** ./node_modules/core-js/internals/to-absolute-index.js ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var toIntegerOrInfinity = __webpack_require__(/*! ../internals/to-integer-or-infinity */ "./node_modules/core-js/internals/to-integer-or-infinity.js");

var max = Math.max;
var min = Math.min; // Helper for a popular repeating case of the spec:
// Let integer be ? ToInteger(index).
// If integer < 0, let result be max((length + integer), 0); else let result be min(integer, length).

module.exports = function (index, length) {
  var integer = toIntegerOrInfinity(index);
  return integer < 0 ? max(integer + length, 0) : min(integer, length);
};

/***/ }),

/***/ "./node_modules/core-js/internals/to-indexed-object.js":
/*!*************************************************************!*\
  !*** ./node_modules/core-js/internals/to-indexed-object.js ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

// toObject with fallback for non-array-like ES3 strings
var IndexedObject = __webpack_require__(/*! ../internals/indexed-object */ "./node_modules/core-js/internals/indexed-object.js");

var requireObjectCoercible = __webpack_require__(/*! ../internals/require-object-coercible */ "./node_modules/core-js/internals/require-object-coercible.js");

module.exports = function (it) {
  return IndexedObject(requireObjectCoercible(it));
};

/***/ }),

/***/ "./node_modules/core-js/internals/to-integer-or-infinity.js":
/*!******************************************************************!*\
  !*** ./node_modules/core-js/internals/to-integer-or-infinity.js ***!
  \******************************************************************/
/***/ (function(module) {

var ceil = Math.ceil;
var floor = Math.floor; // `ToIntegerOrInfinity` abstract operation
// https://tc39.es/ecma262/#sec-tointegerorinfinity

module.exports = function (argument) {
  var number = +argument; // eslint-disable-next-line no-self-compare -- safe

  return number !== number || number === 0 ? 0 : (number > 0 ? floor : ceil)(number);
};

/***/ }),

/***/ "./node_modules/core-js/internals/to-length.js":
/*!*****************************************************!*\
  !*** ./node_modules/core-js/internals/to-length.js ***!
  \*****************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var toIntegerOrInfinity = __webpack_require__(/*! ../internals/to-integer-or-infinity */ "./node_modules/core-js/internals/to-integer-or-infinity.js");

var min = Math.min; // `ToLength` abstract operation
// https://tc39.es/ecma262/#sec-tolength

module.exports = function (argument) {
  return argument > 0 ? min(toIntegerOrInfinity(argument), 0x1FFFFFFFFFFFFF) : 0; // 2 ** 53 - 1 == 9007199254740991
};

/***/ }),

/***/ "./node_modules/core-js/internals/to-object.js":
/*!*****************************************************!*\
  !*** ./node_modules/core-js/internals/to-object.js ***!
  \*****************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js/internals/global.js");

var requireObjectCoercible = __webpack_require__(/*! ../internals/require-object-coercible */ "./node_modules/core-js/internals/require-object-coercible.js");

var Object = global.Object; // `ToObject` abstract operation
// https://tc39.es/ecma262/#sec-toobject

module.exports = function (argument) {
  return Object(requireObjectCoercible(argument));
};

/***/ }),

/***/ "./node_modules/core-js/internals/to-primitive.js":
/*!********************************************************!*\
  !*** ./node_modules/core-js/internals/to-primitive.js ***!
  \********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js/internals/global.js");

var call = __webpack_require__(/*! ../internals/function-call */ "./node_modules/core-js/internals/function-call.js");

var isObject = __webpack_require__(/*! ../internals/is-object */ "./node_modules/core-js/internals/is-object.js");

var isSymbol = __webpack_require__(/*! ../internals/is-symbol */ "./node_modules/core-js/internals/is-symbol.js");

var getMethod = __webpack_require__(/*! ../internals/get-method */ "./node_modules/core-js/internals/get-method.js");

var ordinaryToPrimitive = __webpack_require__(/*! ../internals/ordinary-to-primitive */ "./node_modules/core-js/internals/ordinary-to-primitive.js");

var wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ "./node_modules/core-js/internals/well-known-symbol.js");

var TypeError = global.TypeError;
var TO_PRIMITIVE = wellKnownSymbol('toPrimitive'); // `ToPrimitive` abstract operation
// https://tc39.es/ecma262/#sec-toprimitive

module.exports = function (input, pref) {
  if (!isObject(input) || isSymbol(input)) return input;
  var exoticToPrim = getMethod(input, TO_PRIMITIVE);
  var result;

  if (exoticToPrim) {
    if (pref === undefined) pref = 'default';
    result = call(exoticToPrim, input, pref);
    if (!isObject(result) || isSymbol(result)) return result;
    throw TypeError("Can't convert object to primitive value");
  }

  if (pref === undefined) pref = 'number';
  return ordinaryToPrimitive(input, pref);
};

/***/ }),

/***/ "./node_modules/core-js/internals/to-property-key.js":
/*!***********************************************************!*\
  !*** ./node_modules/core-js/internals/to-property-key.js ***!
  \***********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var toPrimitive = __webpack_require__(/*! ../internals/to-primitive */ "./node_modules/core-js/internals/to-primitive.js");

var isSymbol = __webpack_require__(/*! ../internals/is-symbol */ "./node_modules/core-js/internals/is-symbol.js"); // `ToPropertyKey` abstract operation
// https://tc39.es/ecma262/#sec-topropertykey


module.exports = function (argument) {
  var key = toPrimitive(argument, 'string');
  return isSymbol(key) ? key : key + '';
};

/***/ }),

/***/ "./node_modules/core-js/internals/try-to-string.js":
/*!*********************************************************!*\
  !*** ./node_modules/core-js/internals/try-to-string.js ***!
  \*********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js/internals/global.js");

var String = global.String;

module.exports = function (argument) {
  try {
    return String(argument);
  } catch (error) {
    return 'Object';
  }
};

/***/ }),

/***/ "./node_modules/core-js/internals/uid.js":
/*!***********************************************!*\
  !*** ./node_modules/core-js/internals/uid.js ***!
  \***********************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js/internals/function-uncurry-this.js");

var id = 0;
var postfix = Math.random();
var toString = uncurryThis(1.0.toString);

module.exports = function (key) {
  return 'Symbol(' + (key === undefined ? '' : key) + ')_' + toString(++id + postfix, 36);
};

/***/ }),

/***/ "./node_modules/core-js/internals/use-symbol-as-uid.js":
/*!*************************************************************!*\
  !*** ./node_modules/core-js/internals/use-symbol-as-uid.js ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

/* eslint-disable es/no-symbol -- required for testing */
var NATIVE_SYMBOL = __webpack_require__(/*! ../internals/native-symbol */ "./node_modules/core-js/internals/native-symbol.js");

module.exports = NATIVE_SYMBOL && !Symbol.sham && typeof Symbol.iterator == 'symbol';

/***/ }),

/***/ "./node_modules/core-js/internals/v8-prototype-define-bug.js":
/*!*******************************************************************!*\
  !*** ./node_modules/core-js/internals/v8-prototype-define-bug.js ***!
  \*******************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var DESCRIPTORS = __webpack_require__(/*! ../internals/descriptors */ "./node_modules/core-js/internals/descriptors.js");

var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js/internals/fails.js"); // V8 ~ Chrome 36-
// https://bugs.chromium.org/p/v8/issues/detail?id=3334


module.exports = DESCRIPTORS && fails(function () {
  // eslint-disable-next-line es/no-object-defineproperty -- required for testing
  return Object.defineProperty(function () {
    /* empty */
  }, 'prototype', {
    value: 42,
    writable: false
  }).prototype != 42;
});

/***/ }),

/***/ "./node_modules/core-js/internals/well-known-symbol.js":
/*!*************************************************************!*\
  !*** ./node_modules/core-js/internals/well-known-symbol.js ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js/internals/global.js");

var shared = __webpack_require__(/*! ../internals/shared */ "./node_modules/core-js/internals/shared.js");

var hasOwn = __webpack_require__(/*! ../internals/has-own-property */ "./node_modules/core-js/internals/has-own-property.js");

var uid = __webpack_require__(/*! ../internals/uid */ "./node_modules/core-js/internals/uid.js");

var NATIVE_SYMBOL = __webpack_require__(/*! ../internals/native-symbol */ "./node_modules/core-js/internals/native-symbol.js");

var USE_SYMBOL_AS_UID = __webpack_require__(/*! ../internals/use-symbol-as-uid */ "./node_modules/core-js/internals/use-symbol-as-uid.js");

var WellKnownSymbolsStore = shared('wks');
var Symbol = global.Symbol;
var symbolFor = Symbol && Symbol['for'];
var createWellKnownSymbol = USE_SYMBOL_AS_UID ? Symbol : Symbol && Symbol.withoutSetter || uid;

module.exports = function (name) {
  if (!hasOwn(WellKnownSymbolsStore, name) || !(NATIVE_SYMBOL || typeof WellKnownSymbolsStore[name] == 'string')) {
    var description = 'Symbol.' + name;

    if (NATIVE_SYMBOL && hasOwn(Symbol, name)) {
      WellKnownSymbolsStore[name] = Symbol[name];
    } else if (USE_SYMBOL_AS_UID && symbolFor) {
      WellKnownSymbolsStore[name] = symbolFor(description);
    } else {
      WellKnownSymbolsStore[name] = createWellKnownSymbol(description);
    }
  }

  return WellKnownSymbolsStore[name];
};

/***/ }),

/***/ "./node_modules/core-js/modules/es.function.bind.js":
/*!**********************************************************!*\
  !*** ./node_modules/core-js/modules/es.function.bind.js ***!
  \**********************************************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");

var bind = __webpack_require__(/*! ../internals/function-bind */ "./node_modules/core-js/internals/function-bind.js"); // `Function.prototype.bind` method
// https://tc39.es/ecma262/#sec-function.prototype.bind


$({
  target: 'Function',
  proto: true,
  forced: Function.bind !== bind
}, {
  bind: bind
});

/***/ }),

/***/ "./node_modules/core-js/modules/es.function.has-instance.js":
/*!******************************************************************!*\
  !*** ./node_modules/core-js/modules/es.function.has-instance.js ***!
  \******************************************************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js/internals/is-callable.js");

var isObject = __webpack_require__(/*! ../internals/is-object */ "./node_modules/core-js/internals/is-object.js");

var definePropertyModule = __webpack_require__(/*! ../internals/object-define-property */ "./node_modules/core-js/internals/object-define-property.js");

var getPrototypeOf = __webpack_require__(/*! ../internals/object-get-prototype-of */ "./node_modules/core-js/internals/object-get-prototype-of.js");

var wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ "./node_modules/core-js/internals/well-known-symbol.js");

var HAS_INSTANCE = wellKnownSymbol('hasInstance');
var FunctionPrototype = Function.prototype; // `Function.prototype[@@hasInstance]` method
// https://tc39.es/ecma262/#sec-function.prototype-@@hasinstance

if (!(HAS_INSTANCE in FunctionPrototype)) {
  definePropertyModule.f(FunctionPrototype, HAS_INSTANCE, {
    value: function (O) {
      if (!isCallable(this) || !isObject(O)) return false;
      var P = this.prototype;
      if (!isObject(P)) return O instanceof this; // for environment w/o native `@@hasInstance` logic enough `instanceof`, but add this:

      while (O = getPrototypeOf(O)) if (P === O) return true;

      return false;
    }
  });
}

/***/ }),

/***/ "./node_modules/core-js/modules/es.function.name.js":
/*!**********************************************************!*\
  !*** ./node_modules/core-js/modules/es.function.name.js ***!
  \**********************************************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

var DESCRIPTORS = __webpack_require__(/*! ../internals/descriptors */ "./node_modules/core-js/internals/descriptors.js");

var FUNCTION_NAME_EXISTS = (__webpack_require__(/*! ../internals/function-name */ "./node_modules/core-js/internals/function-name.js").EXISTS);

var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js/internals/function-uncurry-this.js");

var defineProperty = (__webpack_require__(/*! ../internals/object-define-property */ "./node_modules/core-js/internals/object-define-property.js").f);

var FunctionPrototype = Function.prototype;
var functionToString = uncurryThis(FunctionPrototype.toString);
var nameRE = /function\b(?:\s|\/\*[\S\s]*?\*\/|\/\/[^\n\r]*[\n\r]+)*([^\s(/]*)/;
var regExpExec = uncurryThis(nameRE.exec);
var NAME = 'name'; // Function instances `.name` property
// https://tc39.es/ecma262/#sec-function-instances-name

if (DESCRIPTORS && !FUNCTION_NAME_EXISTS) {
  defineProperty(FunctionPrototype, NAME, {
    configurable: true,
    get: function () {
      try {
        return regExpExec(nameRE, functionToString(this))[1];
      } catch (error) {
        return '';
      }
    }
  });
}

/***/ }),

/***/ "./src/main.scss":
/*!***********************!*\
  !*** ./src/main.scss ***!
  \***********************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	!function() {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = function(module) {
/******/ 			var getter = module && module.__esModule ?
/******/ 				function() { return module['default']; } :
/******/ 				function() { return module; };
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	!function() {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = function(exports, definition) {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	!function() {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	!function() {
/******/ 		__webpack_require__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); }
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	!function() {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = function(exports) {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	}();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
!function() {
"use strict";
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! axios */ "./node_modules/axios/index.js");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _main_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./main.scss */ "./src/main.scss");
/* harmony import */ var _mouse_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./mouse.js */ "./src/mouse.js");
/* harmony import */ var core_js_es_function__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! core-js/es/function */ "./node_modules/core-js/es/function/index.js");
/* harmony import */ var core_js_es_function__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(core_js_es_function__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _arrowFn_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./arrowFn.js */ "./src/arrowFn.js");
function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    enumerableOnly && (symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    })), keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = null != arguments[i] ? arguments[i] : {};
    i % 2 ? ownKeys(Object(source), !0).forEach(function (key) {
      _defineProperty(target, key, source[key]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) {
      Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
    });
  }

  return target;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}
/* may not be able to import pg? */




/* for stylesheet */

/* BELOW: Test examples for importing modules to front-end */




console.log('This is from index.js');
console.log('This is from cat.js', cat);
console.log('This is from mouse.js', _mouse_js__WEBPACK_IMPORTED_MODULE_2__.mouse);
var obj = {
  a: 'apple',
  b: 'buffalo'
};

var newObj = _objectSpread(_objectSpread({}, obj), {}, {
  c: 'cheetah'
});

console.log('new obj', newObj);
var result = (0,_arrowFn_js__WEBPACK_IMPORTED_MODULE_4__.arrow)();
console.log('result', result);
/* ABOVE: Test examples for importing modules to front-end */
// Test Example: Make a request for all the items

axios__WEBPACK_IMPORTED_MODULE_0___default().get('/items').then(function (response) {
  // handle success
  console.log(response.data.items);
  var itemCont = document.createElement('div');
  response.data.items.forEach(function (item) {
    var itemEl = document.createElement('div');
    itemEl.innerText = JSON.stringify(item);
    itemEl.classList.add('item');
    document.body.appendChild(itemEl);
  });
  document.body.appendChild(itemCont);
}).catch(function (error) {
  // handle error
  console.log(error);
});
}();
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFVO0FBQ3BDLFFBQU1DLE1BQU0sR0FBRzFRLFFBQVEsQ0FBQ2EsYUFBVGIsQ0FBdUIsS0FBdkJBLENBQWY7QUFDQTBRLFVBQU0sQ0FBQ0MsU0FBUEQsR0FBbUJwVCxJQUFJLENBQUNJLFNBQUxKLENBQWVtVCxJQUFmblQsQ0FBbkJvVDtBQUNBQSxVQUFNLENBQUNFLFNBQVBGLENBQWlCRyxHQUFqQkgsQ0FBcUIsTUFBckJBO0FBQ0ExUSxZQUFRLENBQUM4USxJQUFUOVEsQ0FBYytRLFdBQWQvUSxDQUEwQjBRLE1BQTFCMVE7QUFKRjtBQU9BQSxVQUFRLENBQUM4USxJQUFUOVEsQ0FBYytRLFdBQWQvUSxDQUEwQndRLFFBQTFCeFE7QUFkSixHQWdCR2dSLEtBaEJINWIsQ0FnQlMsVUFBQzhELEtBQUQsRUFBVztBQUNoQjtBQUNBMEosU0FBTyxDQUFDd04sR0FBUnhOLENBQVkxSixLQUFaMEo7QUFsQkosRyIsInNvdXJjZXMiOlsid2VicGFjazovL3Byb2plY3QtMy8uL25vZGVfbW9kdWxlcy9heGlvcy9pbmRleC5qcyIsIndlYnBhY2s6Ly9wcm9qZWN0LTMvLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2FkYXB0ZXJzL3hoci5qcyIsIndlYnBhY2s6Ly9wcm9qZWN0LTMvLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2F4aW9zLmpzIiwid2VicGFjazovL3Byb2plY3QtMy8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvY2FuY2VsL0NhbmNlbC5qcyIsIndlYnBhY2s6Ly9wcm9qZWN0LTMvLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2NhbmNlbC9DYW5jZWxUb2tlbi5qcyIsIndlYnBhY2s6Ly9wcm9qZWN0LTMvLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2NhbmNlbC9pc0NhbmNlbC5qcyIsIndlYnBhY2s6Ly9wcm9qZWN0LTMvLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2NvcmUvQXhpb3MuanMiLCJ3ZWJwYWNrOi8vcHJvamVjdC0zLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jb3JlL0ludGVyY2VwdG9yTWFuYWdlci5qcyIsIndlYnBhY2s6Ly9wcm9qZWN0LTMvLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2NvcmUvYnVpbGRGdWxsUGF0aC5qcyIsIndlYnBhY2s6Ly9wcm9qZWN0LTMvLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2NvcmUvY3JlYXRlRXJyb3IuanMiLCJ3ZWJwYWNrOi8vcHJvamVjdC0zLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jb3JlL2Rpc3BhdGNoUmVxdWVzdC5qcyIsIndlYnBhY2s6Ly9wcm9qZWN0LTMvLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2NvcmUvZW5oYW5jZUVycm9yLmpzIiwid2VicGFjazovL3Byb2plY3QtMy8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvY29yZS9tZXJnZUNvbmZpZy5qcyIsIndlYnBhY2s6Ly9wcm9qZWN0LTMvLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2NvcmUvc2V0dGxlLmpzIiwid2VicGFjazovL3Byb2plY3QtMy8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvY29yZS90cmFuc2Zvcm1EYXRhLmpzIiwid2VicGFjazovL3Byb2plY3QtMy8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvZGVmYXVsdHMvaW5kZXguanMiLCJ3ZWJwYWNrOi8vcHJvamVjdC0zLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9kZWZhdWx0cy90cmFuc2l0aW9uYWwuanMiLCJ3ZWJwYWNrOi8vcHJvamVjdC0zLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9lbnYvZGF0YS5qcyIsIndlYnBhY2s6Ly9wcm9qZWN0LTMvLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2hlbHBlcnMvYmluZC5qcyIsIndlYnBhY2s6Ly9wcm9qZWN0LTMvLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2hlbHBlcnMvYnVpbGRVUkwuanMiLCJ3ZWJwYWNrOi8vcHJvamVjdC0zLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9oZWxwZXJzL2NvbWJpbmVVUkxzLmpzIiwid2VicGFjazovL3Byb2plY3QtMy8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvaGVscGVycy9jb29raWVzLmpzIiwid2VicGFjazovL3Byb2plY3QtMy8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvaGVscGVycy9pc0Fic29sdXRlVVJMLmpzIiwid2VicGFjazovL3Byb2plY3QtMy8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvaGVscGVycy9pc0F4aW9zRXJyb3IuanMiLCJ3ZWJwYWNrOi8vcHJvamVjdC0zLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9oZWxwZXJzL2lzVVJMU2FtZU9yaWdpbi5qcyIsIndlYnBhY2s6Ly9wcm9qZWN0LTMvLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2hlbHBlcnMvbm9ybWFsaXplSGVhZGVyTmFtZS5qcyIsIndlYnBhY2s6Ly9wcm9qZWN0LTMvLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2hlbHBlcnMvcGFyc2VIZWFkZXJzLmpzIiwid2VicGFjazovL3Byb2plY3QtMy8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvaGVscGVycy9zcHJlYWQuanMiLCJ3ZWJwYWNrOi8vcHJvamVjdC0zLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9oZWxwZXJzL3ZhbGlkYXRvci5qcyIsIndlYnBhY2s6Ly9wcm9qZWN0LTMvLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL3V0aWxzLmpzIiwid2VicGFjazovL3Byb2plY3QtMy8uL3NyYy9hcnJvd0ZuLmpzIiwid2VicGFjazovL3Byb2plY3QtMy8uL3NyYy9tb3VzZS5qcyIsIndlYnBhY2s6Ly9wcm9qZWN0LTMvLi9ub2RlX21vZHVsZXMvY29yZS1qcy9lcy9mdW5jdGlvbi9pbmRleC5qcyIsIndlYnBhY2s6Ly9wcm9qZWN0LTMvLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvYS1jYWxsYWJsZS5qcyIsIndlYnBhY2s6Ly9wcm9qZWN0LTMvLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvYW4tb2JqZWN0LmpzIiwid2VicGFjazovL3Byb2plY3QtMy8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9hcnJheS1pbmNsdWRlcy5qcyIsIndlYnBhY2s6Ly9wcm9qZWN0LTMvLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvYXJyYXktc2xpY2UuanMiLCJ3ZWJwYWNrOi8vcHJvamVjdC0zLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2NsYXNzb2YtcmF3LmpzIiwid2VicGFjazovL3Byb2plY3QtMy8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9jb3B5LWNvbnN0cnVjdG9yLXByb3BlcnRpZXMuanMiLCJ3ZWJwYWNrOi8vcHJvamVjdC0zLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2NvcnJlY3QtcHJvdG90eXBlLWdldHRlci5qcyIsIndlYnBhY2s6Ly9wcm9qZWN0LTMvLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvY3JlYXRlLW5vbi1lbnVtZXJhYmxlLXByb3BlcnR5LmpzIiwid2VicGFjazovL3Byb2plY3QtMy8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9jcmVhdGUtcHJvcGVydHktZGVzY3JpcHRvci5qcyIsIndlYnBhY2s6Ly9wcm9qZWN0LTMvLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvZGVzY3JpcHRvcnMuanMiLCJ3ZWJwYWNrOi8vcHJvamVjdC0zLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2RvY3VtZW50LWNyZWF0ZS1lbGVtZW50LmpzIiwid2VicGFjazovL3Byb2plY3QtMy8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9lbmdpbmUtdXNlci1hZ2VudC5qcyIsIndlYnBhY2s6Ly9wcm9qZWN0LTMvLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvZW5naW5lLXY4LXZlcnNpb24uanMiLCJ3ZWJwYWNrOi8vcHJvamVjdC0zLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2VudW0tYnVnLWtleXMuanMiLCJ3ZWJwYWNrOi8vcHJvamVjdC0zLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2V4cG9ydC5qcyIsIndlYnBhY2s6Ly9wcm9qZWN0LTMvLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvZmFpbHMuanMiLCJ3ZWJwYWNrOi8vcHJvamVjdC0zLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2Z1bmN0aW9uLWJpbmQtbmF0aXZlLmpzIiwid2VicGFjazovL3Byb2plY3QtMy8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9mdW5jdGlvbi1iaW5kLmpzIiwid2VicGFjazovL3Byb2plY3QtMy8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9mdW5jdGlvbi1jYWxsLmpzIiwid2VicGFjazovL3Byb2plY3QtMy8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9mdW5jdGlvbi1uYW1lLmpzIiwid2VicGFjazovL3Byb2plY3QtMy8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9mdW5jdGlvbi11bmN1cnJ5LXRoaXMuanMiLCJ3ZWJwYWNrOi8vcHJvamVjdC0zLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2dldC1idWlsdC1pbi5qcyIsIndlYnBhY2s6Ly9wcm9qZWN0LTMvLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvZ2V0LW1ldGhvZC5qcyIsIndlYnBhY2s6Ly9wcm9qZWN0LTMvLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvZ2xvYmFsLmpzIiwid2VicGFjazovL3Byb2plY3QtMy8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9oYXMtb3duLXByb3BlcnR5LmpzIiwid2VicGFjazovL3Byb2plY3QtMy8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9oaWRkZW4ta2V5cy5qcyIsIndlYnBhY2s6Ly9wcm9qZWN0LTMvLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvaWU4LWRvbS1kZWZpbmUuanMiLCJ3ZWJwYWNrOi8vcHJvamVjdC0zLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2luZGV4ZWQtb2JqZWN0LmpzIiwid2VicGFjazovL3Byb2plY3QtMy8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9pbnNwZWN0LXNvdXJjZS5qcyIsIndlYnBhY2s6Ly9wcm9qZWN0LTMvLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvaW50ZXJuYWwtc3RhdGUuanMiLCJ3ZWJwYWNrOi8vcHJvamVjdC0zLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2lzLWNhbGxhYmxlLmpzIiwid2VicGFjazovL3Byb2plY3QtMy8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9pcy1mb3JjZWQuanMiLCJ3ZWJwYWNrOi8vcHJvamVjdC0zLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2lzLW9iamVjdC5qcyIsIndlYnBhY2s6Ly9wcm9qZWN0LTMvLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvaXMtcHVyZS5qcyIsIndlYnBhY2s6Ly9wcm9qZWN0LTMvLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvaXMtc3ltYm9sLmpzIiwid2VicGFjazovL3Byb2plY3QtMy8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9sZW5ndGgtb2YtYXJyYXktbGlrZS5qcyIsIndlYnBhY2s6Ly9wcm9qZWN0LTMvLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvbmF0aXZlLXN5bWJvbC5qcyIsIndlYnBhY2s6Ly9wcm9qZWN0LTMvLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvbmF0aXZlLXdlYWstbWFwLmpzIiwid2VicGFjazovL3Byb2plY3QtMy8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9vYmplY3QtZGVmaW5lLXByb3BlcnR5LmpzIiwid2VicGFjazovL3Byb2plY3QtMy8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9vYmplY3QtZ2V0LW93bi1wcm9wZXJ0eS1kZXNjcmlwdG9yLmpzIiwid2VicGFjazovL3Byb2plY3QtMy8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9vYmplY3QtZ2V0LW93bi1wcm9wZXJ0eS1uYW1lcy5qcyIsIndlYnBhY2s6Ly9wcm9qZWN0LTMvLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvb2JqZWN0LWdldC1vd24tcHJvcGVydHktc3ltYm9scy5qcyIsIndlYnBhY2s6Ly9wcm9qZWN0LTMvLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvb2JqZWN0LWdldC1wcm90b3R5cGUtb2YuanMiLCJ3ZWJwYWNrOi8vcHJvamVjdC0zLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL29iamVjdC1pcy1wcm90b3R5cGUtb2YuanMiLCJ3ZWJwYWNrOi8vcHJvamVjdC0zLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL29iamVjdC1rZXlzLWludGVybmFsLmpzIiwid2VicGFjazovL3Byb2plY3QtMy8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9vYmplY3QtcHJvcGVydHktaXMtZW51bWVyYWJsZS5qcyIsIndlYnBhY2s6Ly9wcm9qZWN0LTMvLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvb3JkaW5hcnktdG8tcHJpbWl0aXZlLmpzIiwid2VicGFjazovL3Byb2plY3QtMy8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9vd24ta2V5cy5qcyIsIndlYnBhY2s6Ly9wcm9qZWN0LTMvLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvcGF0aC5qcyIsIndlYnBhY2s6Ly9wcm9qZWN0LTMvLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvcmVkZWZpbmUuanMiLCJ3ZWJwYWNrOi8vcHJvamVjdC0zLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL3JlcXVpcmUtb2JqZWN0LWNvZXJjaWJsZS5qcyIsIndlYnBhY2s6Ly9wcm9qZWN0LTMvLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvc2V0LWdsb2JhbC5qcyIsIndlYnBhY2s6Ly9wcm9qZWN0LTMvLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvc2hhcmVkLWtleS5qcyIsIndlYnBhY2s6Ly9wcm9qZWN0LTMvLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvc2hhcmVkLXN0b3JlLmpzIiwid2VicGFjazovL3Byb2plY3QtMy8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9zaGFyZWQuanMiLCJ3ZWJwYWNrOi8vcHJvamVjdC0zLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL3RvLWFic29sdXRlLWluZGV4LmpzIiwid2VicGFjazovL3Byb2plY3QtMy8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy90by1pbmRleGVkLW9iamVjdC5qcyIsIndlYnBhY2s6Ly9wcm9qZWN0LTMvLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvdG8taW50ZWdlci1vci1pbmZpbml0eS5qcyIsIndlYnBhY2s6Ly9wcm9qZWN0LTMvLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvdG8tbGVuZ3RoLmpzIiwid2VicGFjazovL3Byb2plY3QtMy8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy90by1vYmplY3QuanMiLCJ3ZWJwYWNrOi8vcHJvamVjdC0zLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL3RvLXByaW1pdGl2ZS5qcyIsIndlYnBhY2s6Ly9wcm9qZWN0LTMvLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvdG8tcHJvcGVydHkta2V5LmpzIiwid2VicGFjazovL3Byb2plY3QtMy8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy90cnktdG8tc3RyaW5nLmpzIiwid2VicGFjazovL3Byb2plY3QtMy8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy91aWQuanMiLCJ3ZWJwYWNrOi8vcHJvamVjdC0zLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL3VzZS1zeW1ib2wtYXMtdWlkLmpzIiwid2VicGFjazovL3Byb2plY3QtMy8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy92OC1wcm90b3R5cGUtZGVmaW5lLWJ1Zy5qcyIsIndlYnBhY2s6Ly9wcm9qZWN0LTMvLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvd2VsbC1rbm93bi1zeW1ib2wuanMiLCJ3ZWJwYWNrOi8vcHJvamVjdC0zLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lcy5mdW5jdGlvbi5iaW5kLmpzIiwid2VicGFjazovL3Byb2plY3QtMy8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXMuZnVuY3Rpb24uaGFzLWluc3RhbmNlLmpzIiwid2VicGFjazovL3Byb2plY3QtMy8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXMuZnVuY3Rpb24ubmFtZS5qcyIsIndlYnBhY2s6Ly9wcm9qZWN0LTMvLi9zcmMvbWFpbi5zY3NzIiwid2VicGFjazovL3Byb2plY3QtMy93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9wcm9qZWN0LTMvd2VicGFjay9ydW50aW1lL2NvbXBhdCBnZXQgZGVmYXVsdCBleHBvcnQiLCJ3ZWJwYWNrOi8vcHJvamVjdC0zL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9wcm9qZWN0LTMvd2VicGFjay9ydW50aW1lL2dsb2JhbCIsIndlYnBhY2s6Ly9wcm9qZWN0LTMvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9wcm9qZWN0LTMvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9wcm9qZWN0LTMvLi9zcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL2xpYi9heGlvcycpOyIsIid1c2Ugc3RyaWN0JztcblxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi8uLi91dGlscycpO1xudmFyIHNldHRsZSA9IHJlcXVpcmUoJy4vLi4vY29yZS9zZXR0bGUnKTtcbnZhciBjb29raWVzID0gcmVxdWlyZSgnLi8uLi9oZWxwZXJzL2Nvb2tpZXMnKTtcbnZhciBidWlsZFVSTCA9IHJlcXVpcmUoJy4vLi4vaGVscGVycy9idWlsZFVSTCcpO1xudmFyIGJ1aWxkRnVsbFBhdGggPSByZXF1aXJlKCcuLi9jb3JlL2J1aWxkRnVsbFBhdGgnKTtcbnZhciBwYXJzZUhlYWRlcnMgPSByZXF1aXJlKCcuLy4uL2hlbHBlcnMvcGFyc2VIZWFkZXJzJyk7XG52YXIgaXNVUkxTYW1lT3JpZ2luID0gcmVxdWlyZSgnLi8uLi9oZWxwZXJzL2lzVVJMU2FtZU9yaWdpbicpO1xudmFyIGNyZWF0ZUVycm9yID0gcmVxdWlyZSgnLi4vY29yZS9jcmVhdGVFcnJvcicpO1xudmFyIHRyYW5zaXRpb25hbERlZmF1bHRzID0gcmVxdWlyZSgnLi4vZGVmYXVsdHMvdHJhbnNpdGlvbmFsJyk7XG52YXIgQ2FuY2VsID0gcmVxdWlyZSgnLi4vY2FuY2VsL0NhbmNlbCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHhockFkYXB0ZXIoY29uZmlnKSB7XG4gIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiBkaXNwYXRjaFhoclJlcXVlc3QocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgdmFyIHJlcXVlc3REYXRhID0gY29uZmlnLmRhdGE7XG4gICAgdmFyIHJlcXVlc3RIZWFkZXJzID0gY29uZmlnLmhlYWRlcnM7XG4gICAgdmFyIHJlc3BvbnNlVHlwZSA9IGNvbmZpZy5yZXNwb25zZVR5cGU7XG4gICAgdmFyIG9uQ2FuY2VsZWQ7XG4gICAgZnVuY3Rpb24gZG9uZSgpIHtcbiAgICAgIGlmIChjb25maWcuY2FuY2VsVG9rZW4pIHtcbiAgICAgICAgY29uZmlnLmNhbmNlbFRva2VuLnVuc3Vic2NyaWJlKG9uQ2FuY2VsZWQpO1xuICAgICAgfVxuXG4gICAgICBpZiAoY29uZmlnLnNpZ25hbCkge1xuICAgICAgICBjb25maWcuc2lnbmFsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2Fib3J0Jywgb25DYW5jZWxlZCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHV0aWxzLmlzRm9ybURhdGEocmVxdWVzdERhdGEpKSB7XG4gICAgICBkZWxldGUgcmVxdWVzdEhlYWRlcnNbJ0NvbnRlbnQtVHlwZSddOyAvLyBMZXQgdGhlIGJyb3dzZXIgc2V0IGl0XG4gICAgfVxuXG4gICAgdmFyIHJlcXVlc3QgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcblxuICAgIC8vIEhUVFAgYmFzaWMgYXV0aGVudGljYXRpb25cbiAgICBpZiAoY29uZmlnLmF1dGgpIHtcbiAgICAgIHZhciB1c2VybmFtZSA9IGNvbmZpZy5hdXRoLnVzZXJuYW1lIHx8ICcnO1xuICAgICAgdmFyIHBhc3N3b3JkID0gY29uZmlnLmF1dGgucGFzc3dvcmQgPyB1bmVzY2FwZShlbmNvZGVVUklDb21wb25lbnQoY29uZmlnLmF1dGgucGFzc3dvcmQpKSA6ICcnO1xuICAgICAgcmVxdWVzdEhlYWRlcnMuQXV0aG9yaXphdGlvbiA9ICdCYXNpYyAnICsgYnRvYSh1c2VybmFtZSArICc6JyArIHBhc3N3b3JkKTtcbiAgICB9XG5cbiAgICB2YXIgZnVsbFBhdGggPSBidWlsZEZ1bGxQYXRoKGNvbmZpZy5iYXNlVVJMLCBjb25maWcudXJsKTtcbiAgICByZXF1ZXN0Lm9wZW4oY29uZmlnLm1ldGhvZC50b1VwcGVyQ2FzZSgpLCBidWlsZFVSTChmdWxsUGF0aCwgY29uZmlnLnBhcmFtcywgY29uZmlnLnBhcmFtc1NlcmlhbGl6ZXIpLCB0cnVlKTtcblxuICAgIC8vIFNldCB0aGUgcmVxdWVzdCB0aW1lb3V0IGluIE1TXG4gICAgcmVxdWVzdC50aW1lb3V0ID0gY29uZmlnLnRpbWVvdXQ7XG5cbiAgICBmdW5jdGlvbiBvbmxvYWRlbmQoKSB7XG4gICAgICBpZiAoIXJlcXVlc3QpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgLy8gUHJlcGFyZSB0aGUgcmVzcG9uc2VcbiAgICAgIHZhciByZXNwb25zZUhlYWRlcnMgPSAnZ2V0QWxsUmVzcG9uc2VIZWFkZXJzJyBpbiByZXF1ZXN0ID8gcGFyc2VIZWFkZXJzKHJlcXVlc3QuZ2V0QWxsUmVzcG9uc2VIZWFkZXJzKCkpIDogbnVsbDtcbiAgICAgIHZhciByZXNwb25zZURhdGEgPSAhcmVzcG9uc2VUeXBlIHx8IHJlc3BvbnNlVHlwZSA9PT0gJ3RleHQnIHx8ICByZXNwb25zZVR5cGUgPT09ICdqc29uJyA/XG4gICAgICAgIHJlcXVlc3QucmVzcG9uc2VUZXh0IDogcmVxdWVzdC5yZXNwb25zZTtcbiAgICAgIHZhciByZXNwb25zZSA9IHtcbiAgICAgICAgZGF0YTogcmVzcG9uc2VEYXRhLFxuICAgICAgICBzdGF0dXM6IHJlcXVlc3Quc3RhdHVzLFxuICAgICAgICBzdGF0dXNUZXh0OiByZXF1ZXN0LnN0YXR1c1RleHQsXG4gICAgICAgIGhlYWRlcnM6IHJlc3BvbnNlSGVhZGVycyxcbiAgICAgICAgY29uZmlnOiBjb25maWcsXG4gICAgICAgIHJlcXVlc3Q6IHJlcXVlc3RcbiAgICAgIH07XG5cbiAgICAgIHNldHRsZShmdW5jdGlvbiBfcmVzb2x2ZSh2YWx1ZSkge1xuICAgICAgICByZXNvbHZlKHZhbHVlKTtcbiAgICAgICAgZG9uZSgpO1xuICAgICAgfSwgZnVuY3Rpb24gX3JlamVjdChlcnIpIHtcbiAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgIGRvbmUoKTtcbiAgICAgIH0sIHJlc3BvbnNlKTtcblxuICAgICAgLy8gQ2xlYW4gdXAgcmVxdWVzdFxuICAgICAgcmVxdWVzdCA9IG51bGw7XG4gICAgfVxuXG4gICAgaWYgKCdvbmxvYWRlbmQnIGluIHJlcXVlc3QpIHtcbiAgICAgIC8vIFVzZSBvbmxvYWRlbmQgaWYgYXZhaWxhYmxlXG4gICAgICByZXF1ZXN0Lm9ubG9hZGVuZCA9IG9ubG9hZGVuZDtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gTGlzdGVuIGZvciByZWFkeSBzdGF0ZSB0byBlbXVsYXRlIG9ubG9hZGVuZFxuICAgICAgcmVxdWVzdC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbiBoYW5kbGVMb2FkKCkge1xuICAgICAgICBpZiAoIXJlcXVlc3QgfHwgcmVxdWVzdC5yZWFkeVN0YXRlICE9PSA0KSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gVGhlIHJlcXVlc3QgZXJyb3JlZCBvdXQgYW5kIHdlIGRpZG4ndCBnZXQgYSByZXNwb25zZSwgdGhpcyB3aWxsIGJlXG4gICAgICAgIC8vIGhhbmRsZWQgYnkgb25lcnJvciBpbnN0ZWFkXG4gICAgICAgIC8vIFdpdGggb25lIGV4Y2VwdGlvbjogcmVxdWVzdCB0aGF0IHVzaW5nIGZpbGU6IHByb3RvY29sLCBtb3N0IGJyb3dzZXJzXG4gICAgICAgIC8vIHdpbGwgcmV0dXJuIHN0YXR1cyBhcyAwIGV2ZW4gdGhvdWdoIGl0J3MgYSBzdWNjZXNzZnVsIHJlcXVlc3RcbiAgICAgICAgaWYgKHJlcXVlc3Quc3RhdHVzID09PSAwICYmICEocmVxdWVzdC5yZXNwb25zZVVSTCAmJiByZXF1ZXN0LnJlc3BvbnNlVVJMLmluZGV4T2YoJ2ZpbGU6JykgPT09IDApKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIC8vIHJlYWR5c3RhdGUgaGFuZGxlciBpcyBjYWxsaW5nIGJlZm9yZSBvbmVycm9yIG9yIG9udGltZW91dCBoYW5kbGVycyxcbiAgICAgICAgLy8gc28gd2Ugc2hvdWxkIGNhbGwgb25sb2FkZW5kIG9uIHRoZSBuZXh0ICd0aWNrJ1xuICAgICAgICBzZXRUaW1lb3V0KG9ubG9hZGVuZCk7XG4gICAgICB9O1xuICAgIH1cblxuICAgIC8vIEhhbmRsZSBicm93c2VyIHJlcXVlc3QgY2FuY2VsbGF0aW9uIChhcyBvcHBvc2VkIHRvIGEgbWFudWFsIGNhbmNlbGxhdGlvbilcbiAgICByZXF1ZXN0Lm9uYWJvcnQgPSBmdW5jdGlvbiBoYW5kbGVBYm9ydCgpIHtcbiAgICAgIGlmICghcmVxdWVzdCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHJlamVjdChjcmVhdGVFcnJvcignUmVxdWVzdCBhYm9ydGVkJywgY29uZmlnLCAnRUNPTk5BQk9SVEVEJywgcmVxdWVzdCkpO1xuXG4gICAgICAvLyBDbGVhbiB1cCByZXF1ZXN0XG4gICAgICByZXF1ZXN0ID0gbnVsbDtcbiAgICB9O1xuXG4gICAgLy8gSGFuZGxlIGxvdyBsZXZlbCBuZXR3b3JrIGVycm9yc1xuICAgIHJlcXVlc3Qub25lcnJvciA9IGZ1bmN0aW9uIGhhbmRsZUVycm9yKCkge1xuICAgICAgLy8gUmVhbCBlcnJvcnMgYXJlIGhpZGRlbiBmcm9tIHVzIGJ5IHRoZSBicm93c2VyXG4gICAgICAvLyBvbmVycm9yIHNob3VsZCBvbmx5IGZpcmUgaWYgaXQncyBhIG5ldHdvcmsgZXJyb3JcbiAgICAgIHJlamVjdChjcmVhdGVFcnJvcignTmV0d29yayBFcnJvcicsIGNvbmZpZywgbnVsbCwgcmVxdWVzdCkpO1xuXG4gICAgICAvLyBDbGVhbiB1cCByZXF1ZXN0XG4gICAgICByZXF1ZXN0ID0gbnVsbDtcbiAgICB9O1xuXG4gICAgLy8gSGFuZGxlIHRpbWVvdXRcbiAgICByZXF1ZXN0Lm9udGltZW91dCA9IGZ1bmN0aW9uIGhhbmRsZVRpbWVvdXQoKSB7XG4gICAgICB2YXIgdGltZW91dEVycm9yTWVzc2FnZSA9IGNvbmZpZy50aW1lb3V0ID8gJ3RpbWVvdXQgb2YgJyArIGNvbmZpZy50aW1lb3V0ICsgJ21zIGV4Y2VlZGVkJyA6ICd0aW1lb3V0IGV4Y2VlZGVkJztcbiAgICAgIHZhciB0cmFuc2l0aW9uYWwgPSBjb25maWcudHJhbnNpdGlvbmFsIHx8IHRyYW5zaXRpb25hbERlZmF1bHRzO1xuICAgICAgaWYgKGNvbmZpZy50aW1lb3V0RXJyb3JNZXNzYWdlKSB7XG4gICAgICAgIHRpbWVvdXRFcnJvck1lc3NhZ2UgPSBjb25maWcudGltZW91dEVycm9yTWVzc2FnZTtcbiAgICAgIH1cbiAgICAgIHJlamVjdChjcmVhdGVFcnJvcihcbiAgICAgICAgdGltZW91dEVycm9yTWVzc2FnZSxcbiAgICAgICAgY29uZmlnLFxuICAgICAgICB0cmFuc2l0aW9uYWwuY2xhcmlmeVRpbWVvdXRFcnJvciA/ICdFVElNRURPVVQnIDogJ0VDT05OQUJPUlRFRCcsXG4gICAgICAgIHJlcXVlc3QpKTtcblxuICAgICAgLy8gQ2xlYW4gdXAgcmVxdWVzdFxuICAgICAgcmVxdWVzdCA9IG51bGw7XG4gICAgfTtcblxuICAgIC8vIEFkZCB4c3JmIGhlYWRlclxuICAgIC8vIFRoaXMgaXMgb25seSBkb25lIGlmIHJ1bm5pbmcgaW4gYSBzdGFuZGFyZCBicm93c2VyIGVudmlyb25tZW50LlxuICAgIC8vIFNwZWNpZmljYWxseSBub3QgaWYgd2UncmUgaW4gYSB3ZWIgd29ya2VyLCBvciByZWFjdC1uYXRpdmUuXG4gICAgaWYgKHV0aWxzLmlzU3RhbmRhcmRCcm93c2VyRW52KCkpIHtcbiAgICAgIC8vIEFkZCB4c3JmIGhlYWRlclxuICAgICAgdmFyIHhzcmZWYWx1ZSA9IChjb25maWcud2l0aENyZWRlbnRpYWxzIHx8IGlzVVJMU2FtZU9yaWdpbihmdWxsUGF0aCkpICYmIGNvbmZpZy54c3JmQ29va2llTmFtZSA/XG4gICAgICAgIGNvb2tpZXMucmVhZChjb25maWcueHNyZkNvb2tpZU5hbWUpIDpcbiAgICAgICAgdW5kZWZpbmVkO1xuXG4gICAgICBpZiAoeHNyZlZhbHVlKSB7XG4gICAgICAgIHJlcXVlc3RIZWFkZXJzW2NvbmZpZy54c3JmSGVhZGVyTmFtZV0gPSB4c3JmVmFsdWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gQWRkIGhlYWRlcnMgdG8gdGhlIHJlcXVlc3RcbiAgICBpZiAoJ3NldFJlcXVlc3RIZWFkZXInIGluIHJlcXVlc3QpIHtcbiAgICAgIHV0aWxzLmZvckVhY2gocmVxdWVzdEhlYWRlcnMsIGZ1bmN0aW9uIHNldFJlcXVlc3RIZWFkZXIodmFsLCBrZXkpIHtcbiAgICAgICAgaWYgKHR5cGVvZiByZXF1ZXN0RGF0YSA9PT0gJ3VuZGVmaW5lZCcgJiYga2V5LnRvTG93ZXJDYXNlKCkgPT09ICdjb250ZW50LXR5cGUnKSB7XG4gICAgICAgICAgLy8gUmVtb3ZlIENvbnRlbnQtVHlwZSBpZiBkYXRhIGlzIHVuZGVmaW5lZFxuICAgICAgICAgIGRlbGV0ZSByZXF1ZXN0SGVhZGVyc1trZXldO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIE90aGVyd2lzZSBhZGQgaGVhZGVyIHRvIHRoZSByZXF1ZXN0XG4gICAgICAgICAgcmVxdWVzdC5zZXRSZXF1ZXN0SGVhZGVyKGtleSwgdmFsKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gQWRkIHdpdGhDcmVkZW50aWFscyB0byByZXF1ZXN0IGlmIG5lZWRlZFxuICAgIGlmICghdXRpbHMuaXNVbmRlZmluZWQoY29uZmlnLndpdGhDcmVkZW50aWFscykpIHtcbiAgICAgIHJlcXVlc3Qud2l0aENyZWRlbnRpYWxzID0gISFjb25maWcud2l0aENyZWRlbnRpYWxzO1xuICAgIH1cblxuICAgIC8vIEFkZCByZXNwb25zZVR5cGUgdG8gcmVxdWVzdCBpZiBuZWVkZWRcbiAgICBpZiAocmVzcG9uc2VUeXBlICYmIHJlc3BvbnNlVHlwZSAhPT0gJ2pzb24nKSB7XG4gICAgICByZXF1ZXN0LnJlc3BvbnNlVHlwZSA9IGNvbmZpZy5yZXNwb25zZVR5cGU7XG4gICAgfVxuXG4gICAgLy8gSGFuZGxlIHByb2dyZXNzIGlmIG5lZWRlZFxuICAgIGlmICh0eXBlb2YgY29uZmlnLm9uRG93bmxvYWRQcm9ncmVzcyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgcmVxdWVzdC5hZGRFdmVudExpc3RlbmVyKCdwcm9ncmVzcycsIGNvbmZpZy5vbkRvd25sb2FkUHJvZ3Jlc3MpO1xuICAgIH1cblxuICAgIC8vIE5vdCBhbGwgYnJvd3NlcnMgc3VwcG9ydCB1cGxvYWQgZXZlbnRzXG4gICAgaWYgKHR5cGVvZiBjb25maWcub25VcGxvYWRQcm9ncmVzcyA9PT0gJ2Z1bmN0aW9uJyAmJiByZXF1ZXN0LnVwbG9hZCkge1xuICAgICAgcmVxdWVzdC51cGxvYWQuYWRkRXZlbnRMaXN0ZW5lcigncHJvZ3Jlc3MnLCBjb25maWcub25VcGxvYWRQcm9ncmVzcyk7XG4gICAgfVxuXG4gICAgaWYgKGNvbmZpZy5jYW5jZWxUb2tlbiB8fCBjb25maWcuc2lnbmFsKSB7XG4gICAgICAvLyBIYW5kbGUgY2FuY2VsbGF0aW9uXG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZnVuYy1uYW1lc1xuICAgICAgb25DYW5jZWxlZCA9IGZ1bmN0aW9uKGNhbmNlbCkge1xuICAgICAgICBpZiAoIXJlcXVlc3QpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgcmVqZWN0KCFjYW5jZWwgfHwgKGNhbmNlbCAmJiBjYW5jZWwudHlwZSkgPyBuZXcgQ2FuY2VsKCdjYW5jZWxlZCcpIDogY2FuY2VsKTtcbiAgICAgICAgcmVxdWVzdC5hYm9ydCgpO1xuICAgICAgICByZXF1ZXN0ID0gbnVsbDtcbiAgICAgIH07XG5cbiAgICAgIGNvbmZpZy5jYW5jZWxUb2tlbiAmJiBjb25maWcuY2FuY2VsVG9rZW4uc3Vic2NyaWJlKG9uQ2FuY2VsZWQpO1xuICAgICAgaWYgKGNvbmZpZy5zaWduYWwpIHtcbiAgICAgICAgY29uZmlnLnNpZ25hbC5hYm9ydGVkID8gb25DYW5jZWxlZCgpIDogY29uZmlnLnNpZ25hbC5hZGRFdmVudExpc3RlbmVyKCdhYm9ydCcsIG9uQ2FuY2VsZWQpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICghcmVxdWVzdERhdGEpIHtcbiAgICAgIHJlcXVlc3REYXRhID0gbnVsbDtcbiAgICB9XG5cbiAgICAvLyBTZW5kIHRoZSByZXF1ZXN0XG4gICAgcmVxdWVzdC5zZW5kKHJlcXVlc3REYXRhKTtcbiAgfSk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuL3V0aWxzJyk7XG52YXIgYmluZCA9IHJlcXVpcmUoJy4vaGVscGVycy9iaW5kJyk7XG52YXIgQXhpb3MgPSByZXF1aXJlKCcuL2NvcmUvQXhpb3MnKTtcbnZhciBtZXJnZUNvbmZpZyA9IHJlcXVpcmUoJy4vY29yZS9tZXJnZUNvbmZpZycpO1xudmFyIGRlZmF1bHRzID0gcmVxdWlyZSgnLi9kZWZhdWx0cycpO1xuXG4vKipcbiAqIENyZWF0ZSBhbiBpbnN0YW5jZSBvZiBBeGlvc1xuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBkZWZhdWx0Q29uZmlnIFRoZSBkZWZhdWx0IGNvbmZpZyBmb3IgdGhlIGluc3RhbmNlXG4gKiBAcmV0dXJuIHtBeGlvc30gQSBuZXcgaW5zdGFuY2Ugb2YgQXhpb3NcbiAqL1xuZnVuY3Rpb24gY3JlYXRlSW5zdGFuY2UoZGVmYXVsdENvbmZpZykge1xuICB2YXIgY29udGV4dCA9IG5ldyBBeGlvcyhkZWZhdWx0Q29uZmlnKTtcbiAgdmFyIGluc3RhbmNlID0gYmluZChBeGlvcy5wcm90b3R5cGUucmVxdWVzdCwgY29udGV4dCk7XG5cbiAgLy8gQ29weSBheGlvcy5wcm90b3R5cGUgdG8gaW5zdGFuY2VcbiAgdXRpbHMuZXh0ZW5kKGluc3RhbmNlLCBBeGlvcy5wcm90b3R5cGUsIGNvbnRleHQpO1xuXG4gIC8vIENvcHkgY29udGV4dCB0byBpbnN0YW5jZVxuICB1dGlscy5leHRlbmQoaW5zdGFuY2UsIGNvbnRleHQpO1xuXG4gIC8vIEZhY3RvcnkgZm9yIGNyZWF0aW5nIG5ldyBpbnN0YW5jZXNcbiAgaW5zdGFuY2UuY3JlYXRlID0gZnVuY3Rpb24gY3JlYXRlKGluc3RhbmNlQ29uZmlnKSB7XG4gICAgcmV0dXJuIGNyZWF0ZUluc3RhbmNlKG1lcmdlQ29uZmlnKGRlZmF1bHRDb25maWcsIGluc3RhbmNlQ29uZmlnKSk7XG4gIH07XG5cbiAgcmV0dXJuIGluc3RhbmNlO1xufVxuXG4vLyBDcmVhdGUgdGhlIGRlZmF1bHQgaW5zdGFuY2UgdG8gYmUgZXhwb3J0ZWRcbnZhciBheGlvcyA9IGNyZWF0ZUluc3RhbmNlKGRlZmF1bHRzKTtcblxuLy8gRXhwb3NlIEF4aW9zIGNsYXNzIHRvIGFsbG93IGNsYXNzIGluaGVyaXRhbmNlXG5heGlvcy5BeGlvcyA9IEF4aW9zO1xuXG4vLyBFeHBvc2UgQ2FuY2VsICYgQ2FuY2VsVG9rZW5cbmF4aW9zLkNhbmNlbCA9IHJlcXVpcmUoJy4vY2FuY2VsL0NhbmNlbCcpO1xuYXhpb3MuQ2FuY2VsVG9rZW4gPSByZXF1aXJlKCcuL2NhbmNlbC9DYW5jZWxUb2tlbicpO1xuYXhpb3MuaXNDYW5jZWwgPSByZXF1aXJlKCcuL2NhbmNlbC9pc0NhbmNlbCcpO1xuYXhpb3MuVkVSU0lPTiA9IHJlcXVpcmUoJy4vZW52L2RhdGEnKS52ZXJzaW9uO1xuXG4vLyBFeHBvc2UgYWxsL3NwcmVhZFxuYXhpb3MuYWxsID0gZnVuY3Rpb24gYWxsKHByb21pc2VzKSB7XG4gIHJldHVybiBQcm9taXNlLmFsbChwcm9taXNlcyk7XG59O1xuYXhpb3Muc3ByZWFkID0gcmVxdWlyZSgnLi9oZWxwZXJzL3NwcmVhZCcpO1xuXG4vLyBFeHBvc2UgaXNBeGlvc0Vycm9yXG5heGlvcy5pc0F4aW9zRXJyb3IgPSByZXF1aXJlKCcuL2hlbHBlcnMvaXNBeGlvc0Vycm9yJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gYXhpb3M7XG5cbi8vIEFsbG93IHVzZSBvZiBkZWZhdWx0IGltcG9ydCBzeW50YXggaW4gVHlwZVNjcmlwdFxubW9kdWxlLmV4cG9ydHMuZGVmYXVsdCA9IGF4aW9zO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIEEgYENhbmNlbGAgaXMgYW4gb2JqZWN0IHRoYXQgaXMgdGhyb3duIHdoZW4gYW4gb3BlcmF0aW9uIGlzIGNhbmNlbGVkLlxuICpcbiAqIEBjbGFzc1xuICogQHBhcmFtIHtzdHJpbmc9fSBtZXNzYWdlIFRoZSBtZXNzYWdlLlxuICovXG5mdW5jdGlvbiBDYW5jZWwobWVzc2FnZSkge1xuICB0aGlzLm1lc3NhZ2UgPSBtZXNzYWdlO1xufVxuXG5DYW5jZWwucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24gdG9TdHJpbmcoKSB7XG4gIHJldHVybiAnQ2FuY2VsJyArICh0aGlzLm1lc3NhZ2UgPyAnOiAnICsgdGhpcy5tZXNzYWdlIDogJycpO1xufTtcblxuQ2FuY2VsLnByb3RvdHlwZS5fX0NBTkNFTF9fID0gdHJ1ZTtcblxubW9kdWxlLmV4cG9ydHMgPSBDYW5jZWw7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBDYW5jZWwgPSByZXF1aXJlKCcuL0NhbmNlbCcpO1xuXG4vKipcbiAqIEEgYENhbmNlbFRva2VuYCBpcyBhbiBvYmplY3QgdGhhdCBjYW4gYmUgdXNlZCB0byByZXF1ZXN0IGNhbmNlbGxhdGlvbiBvZiBhbiBvcGVyYXRpb24uXG4gKlxuICogQGNsYXNzXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBleGVjdXRvciBUaGUgZXhlY3V0b3IgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIENhbmNlbFRva2VuKGV4ZWN1dG9yKSB7XG4gIGlmICh0eXBlb2YgZXhlY3V0b3IgIT09ICdmdW5jdGlvbicpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdleGVjdXRvciBtdXN0IGJlIGEgZnVuY3Rpb24uJyk7XG4gIH1cblxuICB2YXIgcmVzb2x2ZVByb21pc2U7XG5cbiAgdGhpcy5wcm9taXNlID0gbmV3IFByb21pc2UoZnVuY3Rpb24gcHJvbWlzZUV4ZWN1dG9yKHJlc29sdmUpIHtcbiAgICByZXNvbHZlUHJvbWlzZSA9IHJlc29sdmU7XG4gIH0pO1xuXG4gIHZhciB0b2tlbiA9IHRoaXM7XG5cbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGZ1bmMtbmFtZXNcbiAgdGhpcy5wcm9taXNlLnRoZW4oZnVuY3Rpb24oY2FuY2VsKSB7XG4gICAgaWYgKCF0b2tlbi5fbGlzdGVuZXJzKSByZXR1cm47XG5cbiAgICB2YXIgaTtcbiAgICB2YXIgbCA9IHRva2VuLl9saXN0ZW5lcnMubGVuZ3RoO1xuXG4gICAgZm9yIChpID0gMDsgaSA8IGw7IGkrKykge1xuICAgICAgdG9rZW4uX2xpc3RlbmVyc1tpXShjYW5jZWwpO1xuICAgIH1cbiAgICB0b2tlbi5fbGlzdGVuZXJzID0gbnVsbDtcbiAgfSk7XG5cbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGZ1bmMtbmFtZXNcbiAgdGhpcy5wcm9taXNlLnRoZW4gPSBmdW5jdGlvbihvbmZ1bGZpbGxlZCkge1xuICAgIHZhciBfcmVzb2x2ZTtcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZnVuYy1uYW1lc1xuICAgIHZhciBwcm9taXNlID0gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSkge1xuICAgICAgdG9rZW4uc3Vic2NyaWJlKHJlc29sdmUpO1xuICAgICAgX3Jlc29sdmUgPSByZXNvbHZlO1xuICAgIH0pLnRoZW4ob25mdWxmaWxsZWQpO1xuXG4gICAgcHJvbWlzZS5jYW5jZWwgPSBmdW5jdGlvbiByZWplY3QoKSB7XG4gICAgICB0b2tlbi51bnN1YnNjcmliZShfcmVzb2x2ZSk7XG4gICAgfTtcblxuICAgIHJldHVybiBwcm9taXNlO1xuICB9O1xuXG4gIGV4ZWN1dG9yKGZ1bmN0aW9uIGNhbmNlbChtZXNzYWdlKSB7XG4gICAgaWYgKHRva2VuLnJlYXNvbikge1xuICAgICAgLy8gQ2FuY2VsbGF0aW9uIGhhcyBhbHJlYWR5IGJlZW4gcmVxdWVzdGVkXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdG9rZW4ucmVhc29uID0gbmV3IENhbmNlbChtZXNzYWdlKTtcbiAgICByZXNvbHZlUHJvbWlzZSh0b2tlbi5yZWFzb24pO1xuICB9KTtcbn1cblxuLyoqXG4gKiBUaHJvd3MgYSBgQ2FuY2VsYCBpZiBjYW5jZWxsYXRpb24gaGFzIGJlZW4gcmVxdWVzdGVkLlxuICovXG5DYW5jZWxUb2tlbi5wcm90b3R5cGUudGhyb3dJZlJlcXVlc3RlZCA9IGZ1bmN0aW9uIHRocm93SWZSZXF1ZXN0ZWQoKSB7XG4gIGlmICh0aGlzLnJlYXNvbikge1xuICAgIHRocm93IHRoaXMucmVhc29uO1xuICB9XG59O1xuXG4vKipcbiAqIFN1YnNjcmliZSB0byB0aGUgY2FuY2VsIHNpZ25hbFxuICovXG5cbkNhbmNlbFRva2VuLnByb3RvdHlwZS5zdWJzY3JpYmUgPSBmdW5jdGlvbiBzdWJzY3JpYmUobGlzdGVuZXIpIHtcbiAgaWYgKHRoaXMucmVhc29uKSB7XG4gICAgbGlzdGVuZXIodGhpcy5yZWFzb24pO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGlmICh0aGlzLl9saXN0ZW5lcnMpIHtcbiAgICB0aGlzLl9saXN0ZW5lcnMucHVzaChsaXN0ZW5lcik7XG4gIH0gZWxzZSB7XG4gICAgdGhpcy5fbGlzdGVuZXJzID0gW2xpc3RlbmVyXTtcbiAgfVxufTtcblxuLyoqXG4gKiBVbnN1YnNjcmliZSBmcm9tIHRoZSBjYW5jZWwgc2lnbmFsXG4gKi9cblxuQ2FuY2VsVG9rZW4ucHJvdG90eXBlLnVuc3Vic2NyaWJlID0gZnVuY3Rpb24gdW5zdWJzY3JpYmUobGlzdGVuZXIpIHtcbiAgaWYgKCF0aGlzLl9saXN0ZW5lcnMpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgdmFyIGluZGV4ID0gdGhpcy5fbGlzdGVuZXJzLmluZGV4T2YobGlzdGVuZXIpO1xuICBpZiAoaW5kZXggIT09IC0xKSB7XG4gICAgdGhpcy5fbGlzdGVuZXJzLnNwbGljZShpbmRleCwgMSk7XG4gIH1cbn07XG5cbi8qKlxuICogUmV0dXJucyBhbiBvYmplY3QgdGhhdCBjb250YWlucyBhIG5ldyBgQ2FuY2VsVG9rZW5gIGFuZCBhIGZ1bmN0aW9uIHRoYXQsIHdoZW4gY2FsbGVkLFxuICogY2FuY2VscyB0aGUgYENhbmNlbFRva2VuYC5cbiAqL1xuQ2FuY2VsVG9rZW4uc291cmNlID0gZnVuY3Rpb24gc291cmNlKCkge1xuICB2YXIgY2FuY2VsO1xuICB2YXIgdG9rZW4gPSBuZXcgQ2FuY2VsVG9rZW4oZnVuY3Rpb24gZXhlY3V0b3IoYykge1xuICAgIGNhbmNlbCA9IGM7XG4gIH0pO1xuICByZXR1cm4ge1xuICAgIHRva2VuOiB0b2tlbixcbiAgICBjYW5jZWw6IGNhbmNlbFxuICB9O1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBDYW5jZWxUb2tlbjtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpc0NhbmNlbCh2YWx1ZSkge1xuICByZXR1cm4gISEodmFsdWUgJiYgdmFsdWUuX19DQU5DRUxfXyk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLy4uL3V0aWxzJyk7XG52YXIgYnVpbGRVUkwgPSByZXF1aXJlKCcuLi9oZWxwZXJzL2J1aWxkVVJMJyk7XG52YXIgSW50ZXJjZXB0b3JNYW5hZ2VyID0gcmVxdWlyZSgnLi9JbnRlcmNlcHRvck1hbmFnZXInKTtcbnZhciBkaXNwYXRjaFJlcXVlc3QgPSByZXF1aXJlKCcuL2Rpc3BhdGNoUmVxdWVzdCcpO1xudmFyIG1lcmdlQ29uZmlnID0gcmVxdWlyZSgnLi9tZXJnZUNvbmZpZycpO1xudmFyIHZhbGlkYXRvciA9IHJlcXVpcmUoJy4uL2hlbHBlcnMvdmFsaWRhdG9yJyk7XG5cbnZhciB2YWxpZGF0b3JzID0gdmFsaWRhdG9yLnZhbGlkYXRvcnM7XG4vKipcbiAqIENyZWF0ZSBhIG5ldyBpbnN0YW5jZSBvZiBBeGlvc1xuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBpbnN0YW5jZUNvbmZpZyBUaGUgZGVmYXVsdCBjb25maWcgZm9yIHRoZSBpbnN0YW5jZVxuICovXG5mdW5jdGlvbiBBeGlvcyhpbnN0YW5jZUNvbmZpZykge1xuICB0aGlzLmRlZmF1bHRzID0gaW5zdGFuY2VDb25maWc7XG4gIHRoaXMuaW50ZXJjZXB0b3JzID0ge1xuICAgIHJlcXVlc3Q6IG5ldyBJbnRlcmNlcHRvck1hbmFnZXIoKSxcbiAgICByZXNwb25zZTogbmV3IEludGVyY2VwdG9yTWFuYWdlcigpXG4gIH07XG59XG5cbi8qKlxuICogRGlzcGF0Y2ggYSByZXF1ZXN0XG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGNvbmZpZyBUaGUgY29uZmlnIHNwZWNpZmljIGZvciB0aGlzIHJlcXVlc3QgKG1lcmdlZCB3aXRoIHRoaXMuZGVmYXVsdHMpXG4gKi9cbkF4aW9zLnByb3RvdHlwZS5yZXF1ZXN0ID0gZnVuY3Rpb24gcmVxdWVzdChjb25maWdPclVybCwgY29uZmlnKSB7XG4gIC8qZXNsaW50IG5vLXBhcmFtLXJlYXNzaWduOjAqL1xuICAvLyBBbGxvdyBmb3IgYXhpb3MoJ2V4YW1wbGUvdXJsJ1ssIGNvbmZpZ10pIGEgbGEgZmV0Y2ggQVBJXG4gIGlmICh0eXBlb2YgY29uZmlnT3JVcmwgPT09ICdzdHJpbmcnKSB7XG4gICAgY29uZmlnID0gY29uZmlnIHx8IHt9O1xuICAgIGNvbmZpZy51cmwgPSBjb25maWdPclVybDtcbiAgfSBlbHNlIHtcbiAgICBjb25maWcgPSBjb25maWdPclVybCB8fCB7fTtcbiAgfVxuXG4gIGNvbmZpZyA9IG1lcmdlQ29uZmlnKHRoaXMuZGVmYXVsdHMsIGNvbmZpZyk7XG5cbiAgLy8gU2V0IGNvbmZpZy5tZXRob2RcbiAgaWYgKGNvbmZpZy5tZXRob2QpIHtcbiAgICBjb25maWcubWV0aG9kID0gY29uZmlnLm1ldGhvZC50b0xvd2VyQ2FzZSgpO1xuICB9IGVsc2UgaWYgKHRoaXMuZGVmYXVsdHMubWV0aG9kKSB7XG4gICAgY29uZmlnLm1ldGhvZCA9IHRoaXMuZGVmYXVsdHMubWV0aG9kLnRvTG93ZXJDYXNlKCk7XG4gIH0gZWxzZSB7XG4gICAgY29uZmlnLm1ldGhvZCA9ICdnZXQnO1xuICB9XG5cbiAgdmFyIHRyYW5zaXRpb25hbCA9IGNvbmZpZy50cmFuc2l0aW9uYWw7XG5cbiAgaWYgKHRyYW5zaXRpb25hbCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgdmFsaWRhdG9yLmFzc2VydE9wdGlvbnModHJhbnNpdGlvbmFsLCB7XG4gICAgICBzaWxlbnRKU09OUGFyc2luZzogdmFsaWRhdG9ycy50cmFuc2l0aW9uYWwodmFsaWRhdG9ycy5ib29sZWFuKSxcbiAgICAgIGZvcmNlZEpTT05QYXJzaW5nOiB2YWxpZGF0b3JzLnRyYW5zaXRpb25hbCh2YWxpZGF0b3JzLmJvb2xlYW4pLFxuICAgICAgY2xhcmlmeVRpbWVvdXRFcnJvcjogdmFsaWRhdG9ycy50cmFuc2l0aW9uYWwodmFsaWRhdG9ycy5ib29sZWFuKVxuICAgIH0sIGZhbHNlKTtcbiAgfVxuXG4gIC8vIGZpbHRlciBvdXQgc2tpcHBlZCBpbnRlcmNlcHRvcnNcbiAgdmFyIHJlcXVlc3RJbnRlcmNlcHRvckNoYWluID0gW107XG4gIHZhciBzeW5jaHJvbm91c1JlcXVlc3RJbnRlcmNlcHRvcnMgPSB0cnVlO1xuICB0aGlzLmludGVyY2VwdG9ycy5yZXF1ZXN0LmZvckVhY2goZnVuY3Rpb24gdW5zaGlmdFJlcXVlc3RJbnRlcmNlcHRvcnMoaW50ZXJjZXB0b3IpIHtcbiAgICBpZiAodHlwZW9mIGludGVyY2VwdG9yLnJ1bldoZW4gPT09ICdmdW5jdGlvbicgJiYgaW50ZXJjZXB0b3IucnVuV2hlbihjb25maWcpID09PSBmYWxzZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHN5bmNocm9ub3VzUmVxdWVzdEludGVyY2VwdG9ycyA9IHN5bmNocm9ub3VzUmVxdWVzdEludGVyY2VwdG9ycyAmJiBpbnRlcmNlcHRvci5zeW5jaHJvbm91cztcblxuICAgIHJlcXVlc3RJbnRlcmNlcHRvckNoYWluLnVuc2hpZnQoaW50ZXJjZXB0b3IuZnVsZmlsbGVkLCBpbnRlcmNlcHRvci5yZWplY3RlZCk7XG4gIH0pO1xuXG4gIHZhciByZXNwb25zZUludGVyY2VwdG9yQ2hhaW4gPSBbXTtcbiAgdGhpcy5pbnRlcmNlcHRvcnMucmVzcG9uc2UuZm9yRWFjaChmdW5jdGlvbiBwdXNoUmVzcG9uc2VJbnRlcmNlcHRvcnMoaW50ZXJjZXB0b3IpIHtcbiAgICByZXNwb25zZUludGVyY2VwdG9yQ2hhaW4ucHVzaChpbnRlcmNlcHRvci5mdWxmaWxsZWQsIGludGVyY2VwdG9yLnJlamVjdGVkKTtcbiAgfSk7XG5cbiAgdmFyIHByb21pc2U7XG5cbiAgaWYgKCFzeW5jaHJvbm91c1JlcXVlc3RJbnRlcmNlcHRvcnMpIHtcbiAgICB2YXIgY2hhaW4gPSBbZGlzcGF0Y2hSZXF1ZXN0LCB1bmRlZmluZWRdO1xuXG4gICAgQXJyYXkucHJvdG90eXBlLnVuc2hpZnQuYXBwbHkoY2hhaW4sIHJlcXVlc3RJbnRlcmNlcHRvckNoYWluKTtcbiAgICBjaGFpbiA9IGNoYWluLmNvbmNhdChyZXNwb25zZUludGVyY2VwdG9yQ2hhaW4pO1xuXG4gICAgcHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZShjb25maWcpO1xuICAgIHdoaWxlIChjaGFpbi5sZW5ndGgpIHtcbiAgICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oY2hhaW4uc2hpZnQoKSwgY2hhaW4uc2hpZnQoKSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHByb21pc2U7XG4gIH1cblxuXG4gIHZhciBuZXdDb25maWcgPSBjb25maWc7XG4gIHdoaWxlIChyZXF1ZXN0SW50ZXJjZXB0b3JDaGFpbi5sZW5ndGgpIHtcbiAgICB2YXIgb25GdWxmaWxsZWQgPSByZXF1ZXN0SW50ZXJjZXB0b3JDaGFpbi5zaGlmdCgpO1xuICAgIHZhciBvblJlamVjdGVkID0gcmVxdWVzdEludGVyY2VwdG9yQ2hhaW4uc2hpZnQoKTtcbiAgICB0cnkge1xuICAgICAgbmV3Q29uZmlnID0gb25GdWxmaWxsZWQobmV3Q29uZmlnKTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgb25SZWplY3RlZChlcnJvcik7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICB0cnkge1xuICAgIHByb21pc2UgPSBkaXNwYXRjaFJlcXVlc3QobmV3Q29uZmlnKTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoZXJyb3IpO1xuICB9XG5cbiAgd2hpbGUgKHJlc3BvbnNlSW50ZXJjZXB0b3JDaGFpbi5sZW5ndGgpIHtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKHJlc3BvbnNlSW50ZXJjZXB0b3JDaGFpbi5zaGlmdCgpLCByZXNwb25zZUludGVyY2VwdG9yQ2hhaW4uc2hpZnQoKSk7XG4gIH1cblxuICByZXR1cm4gcHJvbWlzZTtcbn07XG5cbkF4aW9zLnByb3RvdHlwZS5nZXRVcmkgPSBmdW5jdGlvbiBnZXRVcmkoY29uZmlnKSB7XG4gIGNvbmZpZyA9IG1lcmdlQ29uZmlnKHRoaXMuZGVmYXVsdHMsIGNvbmZpZyk7XG4gIHJldHVybiBidWlsZFVSTChjb25maWcudXJsLCBjb25maWcucGFyYW1zLCBjb25maWcucGFyYW1zU2VyaWFsaXplcikucmVwbGFjZSgvXlxcPy8sICcnKTtcbn07XG5cbi8vIFByb3ZpZGUgYWxpYXNlcyBmb3Igc3VwcG9ydGVkIHJlcXVlc3QgbWV0aG9kc1xudXRpbHMuZm9yRWFjaChbJ2RlbGV0ZScsICdnZXQnLCAnaGVhZCcsICdvcHRpb25zJ10sIGZ1bmN0aW9uIGZvckVhY2hNZXRob2ROb0RhdGEobWV0aG9kKSB7XG4gIC8qZXNsaW50IGZ1bmMtbmFtZXM6MCovXG4gIEF4aW9zLnByb3RvdHlwZVttZXRob2RdID0gZnVuY3Rpb24odXJsLCBjb25maWcpIHtcbiAgICByZXR1cm4gdGhpcy5yZXF1ZXN0KG1lcmdlQ29uZmlnKGNvbmZpZyB8fCB7fSwge1xuICAgICAgbWV0aG9kOiBtZXRob2QsXG4gICAgICB1cmw6IHVybCxcbiAgICAgIGRhdGE6IChjb25maWcgfHwge30pLmRhdGFcbiAgICB9KSk7XG4gIH07XG59KTtcblxudXRpbHMuZm9yRWFjaChbJ3Bvc3QnLCAncHV0JywgJ3BhdGNoJ10sIGZ1bmN0aW9uIGZvckVhY2hNZXRob2RXaXRoRGF0YShtZXRob2QpIHtcbiAgLyplc2xpbnQgZnVuYy1uYW1lczowKi9cbiAgQXhpb3MucHJvdG90eXBlW21ldGhvZF0gPSBmdW5jdGlvbih1cmwsIGRhdGEsIGNvbmZpZykge1xuICAgIHJldHVybiB0aGlzLnJlcXVlc3QobWVyZ2VDb25maWcoY29uZmlnIHx8IHt9LCB7XG4gICAgICBtZXRob2Q6IG1ldGhvZCxcbiAgICAgIHVybDogdXJsLFxuICAgICAgZGF0YTogZGF0YVxuICAgIH0pKTtcbiAgfTtcbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEF4aW9zO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLy4uL3V0aWxzJyk7XG5cbmZ1bmN0aW9uIEludGVyY2VwdG9yTWFuYWdlcigpIHtcbiAgdGhpcy5oYW5kbGVycyA9IFtdO1xufVxuXG4vKipcbiAqIEFkZCBhIG5ldyBpbnRlcmNlcHRvciB0byB0aGUgc3RhY2tcbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdWxmaWxsZWQgVGhlIGZ1bmN0aW9uIHRvIGhhbmRsZSBgdGhlbmAgZm9yIGEgYFByb21pc2VgXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSByZWplY3RlZCBUaGUgZnVuY3Rpb24gdG8gaGFuZGxlIGByZWplY3RgIGZvciBhIGBQcm9taXNlYFxuICpcbiAqIEByZXR1cm4ge051bWJlcn0gQW4gSUQgdXNlZCB0byByZW1vdmUgaW50ZXJjZXB0b3IgbGF0ZXJcbiAqL1xuSW50ZXJjZXB0b3JNYW5hZ2VyLnByb3RvdHlwZS51c2UgPSBmdW5jdGlvbiB1c2UoZnVsZmlsbGVkLCByZWplY3RlZCwgb3B0aW9ucykge1xuICB0aGlzLmhhbmRsZXJzLnB1c2goe1xuICAgIGZ1bGZpbGxlZDogZnVsZmlsbGVkLFxuICAgIHJlamVjdGVkOiByZWplY3RlZCxcbiAgICBzeW5jaHJvbm91czogb3B0aW9ucyA/IG9wdGlvbnMuc3luY2hyb25vdXMgOiBmYWxzZSxcbiAgICBydW5XaGVuOiBvcHRpb25zID8gb3B0aW9ucy5ydW5XaGVuIDogbnVsbFxuICB9KTtcbiAgcmV0dXJuIHRoaXMuaGFuZGxlcnMubGVuZ3RoIC0gMTtcbn07XG5cbi8qKlxuICogUmVtb3ZlIGFuIGludGVyY2VwdG9yIGZyb20gdGhlIHN0YWNrXG4gKlxuICogQHBhcmFtIHtOdW1iZXJ9IGlkIFRoZSBJRCB0aGF0IHdhcyByZXR1cm5lZCBieSBgdXNlYFxuICovXG5JbnRlcmNlcHRvck1hbmFnZXIucHJvdG90eXBlLmVqZWN0ID0gZnVuY3Rpb24gZWplY3QoaWQpIHtcbiAgaWYgKHRoaXMuaGFuZGxlcnNbaWRdKSB7XG4gICAgdGhpcy5oYW5kbGVyc1tpZF0gPSBudWxsO1xuICB9XG59O1xuXG4vKipcbiAqIEl0ZXJhdGUgb3ZlciBhbGwgdGhlIHJlZ2lzdGVyZWQgaW50ZXJjZXB0b3JzXG4gKlxuICogVGhpcyBtZXRob2QgaXMgcGFydGljdWxhcmx5IHVzZWZ1bCBmb3Igc2tpcHBpbmcgb3ZlciBhbnlcbiAqIGludGVyY2VwdG9ycyB0aGF0IG1heSBoYXZlIGJlY29tZSBgbnVsbGAgY2FsbGluZyBgZWplY3RgLlxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIFRoZSBmdW5jdGlvbiB0byBjYWxsIGZvciBlYWNoIGludGVyY2VwdG9yXG4gKi9cbkludGVyY2VwdG9yTWFuYWdlci5wcm90b3R5cGUuZm9yRWFjaCA9IGZ1bmN0aW9uIGZvckVhY2goZm4pIHtcbiAgdXRpbHMuZm9yRWFjaCh0aGlzLmhhbmRsZXJzLCBmdW5jdGlvbiBmb3JFYWNoSGFuZGxlcihoKSB7XG4gICAgaWYgKGggIT09IG51bGwpIHtcbiAgICAgIGZuKGgpO1xuICAgIH1cbiAgfSk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEludGVyY2VwdG9yTWFuYWdlcjtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGlzQWJzb2x1dGVVUkwgPSByZXF1aXJlKCcuLi9oZWxwZXJzL2lzQWJzb2x1dGVVUkwnKTtcbnZhciBjb21iaW5lVVJMcyA9IHJlcXVpcmUoJy4uL2hlbHBlcnMvY29tYmluZVVSTHMnKTtcblxuLyoqXG4gKiBDcmVhdGVzIGEgbmV3IFVSTCBieSBjb21iaW5pbmcgdGhlIGJhc2VVUkwgd2l0aCB0aGUgcmVxdWVzdGVkVVJMLFxuICogb25seSB3aGVuIHRoZSByZXF1ZXN0ZWRVUkwgaXMgbm90IGFscmVhZHkgYW4gYWJzb2x1dGUgVVJMLlxuICogSWYgdGhlIHJlcXVlc3RVUkwgaXMgYWJzb2x1dGUsIHRoaXMgZnVuY3Rpb24gcmV0dXJucyB0aGUgcmVxdWVzdGVkVVJMIHVudG91Y2hlZC5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gYmFzZVVSTCBUaGUgYmFzZSBVUkxcbiAqIEBwYXJhbSB7c3RyaW5nfSByZXF1ZXN0ZWRVUkwgQWJzb2x1dGUgb3IgcmVsYXRpdmUgVVJMIHRvIGNvbWJpbmVcbiAqIEByZXR1cm5zIHtzdHJpbmd9IFRoZSBjb21iaW5lZCBmdWxsIHBhdGhcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBidWlsZEZ1bGxQYXRoKGJhc2VVUkwsIHJlcXVlc3RlZFVSTCkge1xuICBpZiAoYmFzZVVSTCAmJiAhaXNBYnNvbHV0ZVVSTChyZXF1ZXN0ZWRVUkwpKSB7XG4gICAgcmV0dXJuIGNvbWJpbmVVUkxzKGJhc2VVUkwsIHJlcXVlc3RlZFVSTCk7XG4gIH1cbiAgcmV0dXJuIHJlcXVlc3RlZFVSTDtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBlbmhhbmNlRXJyb3IgPSByZXF1aXJlKCcuL2VuaGFuY2VFcnJvcicpO1xuXG4vKipcbiAqIENyZWF0ZSBhbiBFcnJvciB3aXRoIHRoZSBzcGVjaWZpZWQgbWVzc2FnZSwgY29uZmlnLCBlcnJvciBjb2RlLCByZXF1ZXN0IGFuZCByZXNwb25zZS5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gbWVzc2FnZSBUaGUgZXJyb3IgbWVzc2FnZS5cbiAqIEBwYXJhbSB7T2JqZWN0fSBjb25maWcgVGhlIGNvbmZpZy5cbiAqIEBwYXJhbSB7c3RyaW5nfSBbY29kZV0gVGhlIGVycm9yIGNvZGUgKGZvciBleGFtcGxlLCAnRUNPTk5BQk9SVEVEJykuXG4gKiBAcGFyYW0ge09iamVjdH0gW3JlcXVlc3RdIFRoZSByZXF1ZXN0LlxuICogQHBhcmFtIHtPYmplY3R9IFtyZXNwb25zZV0gVGhlIHJlc3BvbnNlLlxuICogQHJldHVybnMge0Vycm9yfSBUaGUgY3JlYXRlZCBlcnJvci5cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjcmVhdGVFcnJvcihtZXNzYWdlLCBjb25maWcsIGNvZGUsIHJlcXVlc3QsIHJlc3BvbnNlKSB7XG4gIHZhciBlcnJvciA9IG5ldyBFcnJvcihtZXNzYWdlKTtcbiAgcmV0dXJuIGVuaGFuY2VFcnJvcihlcnJvciwgY29uZmlnLCBjb2RlLCByZXF1ZXN0LCByZXNwb25zZSk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLy4uL3V0aWxzJyk7XG52YXIgdHJhbnNmb3JtRGF0YSA9IHJlcXVpcmUoJy4vdHJhbnNmb3JtRGF0YScpO1xudmFyIGlzQ2FuY2VsID0gcmVxdWlyZSgnLi4vY2FuY2VsL2lzQ2FuY2VsJyk7XG52YXIgZGVmYXVsdHMgPSByZXF1aXJlKCcuLi9kZWZhdWx0cycpO1xudmFyIENhbmNlbCA9IHJlcXVpcmUoJy4uL2NhbmNlbC9DYW5jZWwnKTtcblxuLyoqXG4gKiBUaHJvd3MgYSBgQ2FuY2VsYCBpZiBjYW5jZWxsYXRpb24gaGFzIGJlZW4gcmVxdWVzdGVkLlxuICovXG5mdW5jdGlvbiB0aHJvd0lmQ2FuY2VsbGF0aW9uUmVxdWVzdGVkKGNvbmZpZykge1xuICBpZiAoY29uZmlnLmNhbmNlbFRva2VuKSB7XG4gICAgY29uZmlnLmNhbmNlbFRva2VuLnRocm93SWZSZXF1ZXN0ZWQoKTtcbiAgfVxuXG4gIGlmIChjb25maWcuc2lnbmFsICYmIGNvbmZpZy5zaWduYWwuYWJvcnRlZCkge1xuICAgIHRocm93IG5ldyBDYW5jZWwoJ2NhbmNlbGVkJyk7XG4gIH1cbn1cblxuLyoqXG4gKiBEaXNwYXRjaCBhIHJlcXVlc3QgdG8gdGhlIHNlcnZlciB1c2luZyB0aGUgY29uZmlndXJlZCBhZGFwdGVyLlxuICpcbiAqIEBwYXJhbSB7b2JqZWN0fSBjb25maWcgVGhlIGNvbmZpZyB0aGF0IGlzIHRvIGJlIHVzZWQgZm9yIHRoZSByZXF1ZXN0XG4gKiBAcmV0dXJucyB7UHJvbWlzZX0gVGhlIFByb21pc2UgdG8gYmUgZnVsZmlsbGVkXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZGlzcGF0Y2hSZXF1ZXN0KGNvbmZpZykge1xuICB0aHJvd0lmQ2FuY2VsbGF0aW9uUmVxdWVzdGVkKGNvbmZpZyk7XG5cbiAgLy8gRW5zdXJlIGhlYWRlcnMgZXhpc3RcbiAgY29uZmlnLmhlYWRlcnMgPSBjb25maWcuaGVhZGVycyB8fCB7fTtcblxuICAvLyBUcmFuc2Zvcm0gcmVxdWVzdCBkYXRhXG4gIGNvbmZpZy5kYXRhID0gdHJhbnNmb3JtRGF0YS5jYWxsKFxuICAgIGNvbmZpZyxcbiAgICBjb25maWcuZGF0YSxcbiAgICBjb25maWcuaGVhZGVycyxcbiAgICBjb25maWcudHJhbnNmb3JtUmVxdWVzdFxuICApO1xuXG4gIC8vIEZsYXR0ZW4gaGVhZGVyc1xuICBjb25maWcuaGVhZGVycyA9IHV0aWxzLm1lcmdlKFxuICAgIGNvbmZpZy5oZWFkZXJzLmNvbW1vbiB8fCB7fSxcbiAgICBjb25maWcuaGVhZGVyc1tjb25maWcubWV0aG9kXSB8fCB7fSxcbiAgICBjb25maWcuaGVhZGVyc1xuICApO1xuXG4gIHV0aWxzLmZvckVhY2goXG4gICAgWydkZWxldGUnLCAnZ2V0JywgJ2hlYWQnLCAncG9zdCcsICdwdXQnLCAncGF0Y2gnLCAnY29tbW9uJ10sXG4gICAgZnVuY3Rpb24gY2xlYW5IZWFkZXJDb25maWcobWV0aG9kKSB7XG4gICAgICBkZWxldGUgY29uZmlnLmhlYWRlcnNbbWV0aG9kXTtcbiAgICB9XG4gICk7XG5cbiAgdmFyIGFkYXB0ZXIgPSBjb25maWcuYWRhcHRlciB8fCBkZWZhdWx0cy5hZGFwdGVyO1xuXG4gIHJldHVybiBhZGFwdGVyKGNvbmZpZykudGhlbihmdW5jdGlvbiBvbkFkYXB0ZXJSZXNvbHV0aW9uKHJlc3BvbnNlKSB7XG4gICAgdGhyb3dJZkNhbmNlbGxhdGlvblJlcXVlc3RlZChjb25maWcpO1xuXG4gICAgLy8gVHJhbnNmb3JtIHJlc3BvbnNlIGRhdGFcbiAgICByZXNwb25zZS5kYXRhID0gdHJhbnNmb3JtRGF0YS5jYWxsKFxuICAgICAgY29uZmlnLFxuICAgICAgcmVzcG9uc2UuZGF0YSxcbiAgICAgIHJlc3BvbnNlLmhlYWRlcnMsXG4gICAgICBjb25maWcudHJhbnNmb3JtUmVzcG9uc2VcbiAgICApO1xuXG4gICAgcmV0dXJuIHJlc3BvbnNlO1xuICB9LCBmdW5jdGlvbiBvbkFkYXB0ZXJSZWplY3Rpb24ocmVhc29uKSB7XG4gICAgaWYgKCFpc0NhbmNlbChyZWFzb24pKSB7XG4gICAgICB0aHJvd0lmQ2FuY2VsbGF0aW9uUmVxdWVzdGVkKGNvbmZpZyk7XG5cbiAgICAgIC8vIFRyYW5zZm9ybSByZXNwb25zZSBkYXRhXG4gICAgICBpZiAocmVhc29uICYmIHJlYXNvbi5yZXNwb25zZSkge1xuICAgICAgICByZWFzb24ucmVzcG9uc2UuZGF0YSA9IHRyYW5zZm9ybURhdGEuY2FsbChcbiAgICAgICAgICBjb25maWcsXG4gICAgICAgICAgcmVhc29uLnJlc3BvbnNlLmRhdGEsXG4gICAgICAgICAgcmVhc29uLnJlc3BvbnNlLmhlYWRlcnMsXG4gICAgICAgICAgY29uZmlnLnRyYW5zZm9ybVJlc3BvbnNlXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIFByb21pc2UucmVqZWN0KHJlYXNvbik7XG4gIH0pO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBVcGRhdGUgYW4gRXJyb3Igd2l0aCB0aGUgc3BlY2lmaWVkIGNvbmZpZywgZXJyb3IgY29kZSwgYW5kIHJlc3BvbnNlLlxuICpcbiAqIEBwYXJhbSB7RXJyb3J9IGVycm9yIFRoZSBlcnJvciB0byB1cGRhdGUuXG4gKiBAcGFyYW0ge09iamVjdH0gY29uZmlnIFRoZSBjb25maWcuXG4gKiBAcGFyYW0ge3N0cmluZ30gW2NvZGVdIFRoZSBlcnJvciBjb2RlIChmb3IgZXhhbXBsZSwgJ0VDT05OQUJPUlRFRCcpLlxuICogQHBhcmFtIHtPYmplY3R9IFtyZXF1ZXN0XSBUaGUgcmVxdWVzdC5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbcmVzcG9uc2VdIFRoZSByZXNwb25zZS5cbiAqIEByZXR1cm5zIHtFcnJvcn0gVGhlIGVycm9yLlxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGVuaGFuY2VFcnJvcihlcnJvciwgY29uZmlnLCBjb2RlLCByZXF1ZXN0LCByZXNwb25zZSkge1xuICBlcnJvci5jb25maWcgPSBjb25maWc7XG4gIGlmIChjb2RlKSB7XG4gICAgZXJyb3IuY29kZSA9IGNvZGU7XG4gIH1cblxuICBlcnJvci5yZXF1ZXN0ID0gcmVxdWVzdDtcbiAgZXJyb3IucmVzcG9uc2UgPSByZXNwb25zZTtcbiAgZXJyb3IuaXNBeGlvc0Vycm9yID0gdHJ1ZTtcblxuICBlcnJvci50b0pTT04gPSBmdW5jdGlvbiB0b0pTT04oKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIC8vIFN0YW5kYXJkXG4gICAgICBtZXNzYWdlOiB0aGlzLm1lc3NhZ2UsXG4gICAgICBuYW1lOiB0aGlzLm5hbWUsXG4gICAgICAvLyBNaWNyb3NvZnRcbiAgICAgIGRlc2NyaXB0aW9uOiB0aGlzLmRlc2NyaXB0aW9uLFxuICAgICAgbnVtYmVyOiB0aGlzLm51bWJlcixcbiAgICAgIC8vIE1vemlsbGFcbiAgICAgIGZpbGVOYW1lOiB0aGlzLmZpbGVOYW1lLFxuICAgICAgbGluZU51bWJlcjogdGhpcy5saW5lTnVtYmVyLFxuICAgICAgY29sdW1uTnVtYmVyOiB0aGlzLmNvbHVtbk51bWJlcixcbiAgICAgIHN0YWNrOiB0aGlzLnN0YWNrLFxuICAgICAgLy8gQXhpb3NcbiAgICAgIGNvbmZpZzogdGhpcy5jb25maWcsXG4gICAgICBjb2RlOiB0aGlzLmNvZGUsXG4gICAgICBzdGF0dXM6IHRoaXMucmVzcG9uc2UgJiYgdGhpcy5yZXNwb25zZS5zdGF0dXMgPyB0aGlzLnJlc3BvbnNlLnN0YXR1cyA6IG51bGxcbiAgICB9O1xuICB9O1xuICByZXR1cm4gZXJyb3I7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLi91dGlscycpO1xuXG4vKipcbiAqIENvbmZpZy1zcGVjaWZpYyBtZXJnZS1mdW5jdGlvbiB3aGljaCBjcmVhdGVzIGEgbmV3IGNvbmZpZy1vYmplY3RcbiAqIGJ5IG1lcmdpbmcgdHdvIGNvbmZpZ3VyYXRpb24gb2JqZWN0cyB0b2dldGhlci5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gY29uZmlnMVxuICogQHBhcmFtIHtPYmplY3R9IGNvbmZpZzJcbiAqIEByZXR1cm5zIHtPYmplY3R9IE5ldyBvYmplY3QgcmVzdWx0aW5nIGZyb20gbWVyZ2luZyBjb25maWcyIHRvIGNvbmZpZzFcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBtZXJnZUNvbmZpZyhjb25maWcxLCBjb25maWcyKSB7XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1wYXJhbS1yZWFzc2lnblxuICBjb25maWcyID0gY29uZmlnMiB8fCB7fTtcbiAgdmFyIGNvbmZpZyA9IHt9O1xuXG4gIGZ1bmN0aW9uIGdldE1lcmdlZFZhbHVlKHRhcmdldCwgc291cmNlKSB7XG4gICAgaWYgKHV0aWxzLmlzUGxhaW5PYmplY3QodGFyZ2V0KSAmJiB1dGlscy5pc1BsYWluT2JqZWN0KHNvdXJjZSkpIHtcbiAgICAgIHJldHVybiB1dGlscy5tZXJnZSh0YXJnZXQsIHNvdXJjZSk7XG4gICAgfSBlbHNlIGlmICh1dGlscy5pc1BsYWluT2JqZWN0KHNvdXJjZSkpIHtcbiAgICAgIHJldHVybiB1dGlscy5tZXJnZSh7fSwgc291cmNlKTtcbiAgICB9IGVsc2UgaWYgKHV0aWxzLmlzQXJyYXkoc291cmNlKSkge1xuICAgICAgcmV0dXJuIHNvdXJjZS5zbGljZSgpO1xuICAgIH1cbiAgICByZXR1cm4gc291cmNlO1xuICB9XG5cbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGNvbnNpc3RlbnQtcmV0dXJuXG4gIGZ1bmN0aW9uIG1lcmdlRGVlcFByb3BlcnRpZXMocHJvcCkge1xuICAgIGlmICghdXRpbHMuaXNVbmRlZmluZWQoY29uZmlnMltwcm9wXSkpIHtcbiAgICAgIHJldHVybiBnZXRNZXJnZWRWYWx1ZShjb25maWcxW3Byb3BdLCBjb25maWcyW3Byb3BdKTtcbiAgICB9IGVsc2UgaWYgKCF1dGlscy5pc1VuZGVmaW5lZChjb25maWcxW3Byb3BdKSkge1xuICAgICAgcmV0dXJuIGdldE1lcmdlZFZhbHVlKHVuZGVmaW5lZCwgY29uZmlnMVtwcm9wXSk7XG4gICAgfVxuICB9XG5cbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGNvbnNpc3RlbnQtcmV0dXJuXG4gIGZ1bmN0aW9uIHZhbHVlRnJvbUNvbmZpZzIocHJvcCkge1xuICAgIGlmICghdXRpbHMuaXNVbmRlZmluZWQoY29uZmlnMltwcm9wXSkpIHtcbiAgICAgIHJldHVybiBnZXRNZXJnZWRWYWx1ZSh1bmRlZmluZWQsIGNvbmZpZzJbcHJvcF0pO1xuICAgIH1cbiAgfVxuXG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBjb25zaXN0ZW50LXJldHVyblxuICBmdW5jdGlvbiBkZWZhdWx0VG9Db25maWcyKHByb3ApIHtcbiAgICBpZiAoIXV0aWxzLmlzVW5kZWZpbmVkKGNvbmZpZzJbcHJvcF0pKSB7XG4gICAgICByZXR1cm4gZ2V0TWVyZ2VkVmFsdWUodW5kZWZpbmVkLCBjb25maWcyW3Byb3BdKTtcbiAgICB9IGVsc2UgaWYgKCF1dGlscy5pc1VuZGVmaW5lZChjb25maWcxW3Byb3BdKSkge1xuICAgICAgcmV0dXJuIGdldE1lcmdlZFZhbHVlKHVuZGVmaW5lZCwgY29uZmlnMVtwcm9wXSk7XG4gICAgfVxuICB9XG5cbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGNvbnNpc3RlbnQtcmV0dXJuXG4gIGZ1bmN0aW9uIG1lcmdlRGlyZWN0S2V5cyhwcm9wKSB7XG4gICAgaWYgKHByb3AgaW4gY29uZmlnMikge1xuICAgICAgcmV0dXJuIGdldE1lcmdlZFZhbHVlKGNvbmZpZzFbcHJvcF0sIGNvbmZpZzJbcHJvcF0pO1xuICAgIH0gZWxzZSBpZiAocHJvcCBpbiBjb25maWcxKSB7XG4gICAgICByZXR1cm4gZ2V0TWVyZ2VkVmFsdWUodW5kZWZpbmVkLCBjb25maWcxW3Byb3BdKTtcbiAgICB9XG4gIH1cblxuICB2YXIgbWVyZ2VNYXAgPSB7XG4gICAgJ3VybCc6IHZhbHVlRnJvbUNvbmZpZzIsXG4gICAgJ21ldGhvZCc6IHZhbHVlRnJvbUNvbmZpZzIsXG4gICAgJ2RhdGEnOiB2YWx1ZUZyb21Db25maWcyLFxuICAgICdiYXNlVVJMJzogZGVmYXVsdFRvQ29uZmlnMixcbiAgICAndHJhbnNmb3JtUmVxdWVzdCc6IGRlZmF1bHRUb0NvbmZpZzIsXG4gICAgJ3RyYW5zZm9ybVJlc3BvbnNlJzogZGVmYXVsdFRvQ29uZmlnMixcbiAgICAncGFyYW1zU2VyaWFsaXplcic6IGRlZmF1bHRUb0NvbmZpZzIsXG4gICAgJ3RpbWVvdXQnOiBkZWZhdWx0VG9Db25maWcyLFxuICAgICd0aW1lb3V0TWVzc2FnZSc6IGRlZmF1bHRUb0NvbmZpZzIsXG4gICAgJ3dpdGhDcmVkZW50aWFscyc6IGRlZmF1bHRUb0NvbmZpZzIsXG4gICAgJ2FkYXB0ZXInOiBkZWZhdWx0VG9Db25maWcyLFxuICAgICdyZXNwb25zZVR5cGUnOiBkZWZhdWx0VG9Db25maWcyLFxuICAgICd4c3JmQ29va2llTmFtZSc6IGRlZmF1bHRUb0NvbmZpZzIsXG4gICAgJ3hzcmZIZWFkZXJOYW1lJzogZGVmYXVsdFRvQ29uZmlnMixcbiAgICAnb25VcGxvYWRQcm9ncmVzcyc6IGRlZmF1bHRUb0NvbmZpZzIsXG4gICAgJ29uRG93bmxvYWRQcm9ncmVzcyc6IGRlZmF1bHRUb0NvbmZpZzIsXG4gICAgJ2RlY29tcHJlc3MnOiBkZWZhdWx0VG9Db25maWcyLFxuICAgICdtYXhDb250ZW50TGVuZ3RoJzogZGVmYXVsdFRvQ29uZmlnMixcbiAgICAnbWF4Qm9keUxlbmd0aCc6IGRlZmF1bHRUb0NvbmZpZzIsXG4gICAgJ3RyYW5zcG9ydCc6IGRlZmF1bHRUb0NvbmZpZzIsXG4gICAgJ2h0dHBBZ2VudCc6IGRlZmF1bHRUb0NvbmZpZzIsXG4gICAgJ2h0dHBzQWdlbnQnOiBkZWZhdWx0VG9Db25maWcyLFxuICAgICdjYW5jZWxUb2tlbic6IGRlZmF1bHRUb0NvbmZpZzIsXG4gICAgJ3NvY2tldFBhdGgnOiBkZWZhdWx0VG9Db25maWcyLFxuICAgICdyZXNwb25zZUVuY29kaW5nJzogZGVmYXVsdFRvQ29uZmlnMixcbiAgICAndmFsaWRhdGVTdGF0dXMnOiBtZXJnZURpcmVjdEtleXNcbiAgfTtcblxuICB1dGlscy5mb3JFYWNoKE9iamVjdC5rZXlzKGNvbmZpZzEpLmNvbmNhdChPYmplY3Qua2V5cyhjb25maWcyKSksIGZ1bmN0aW9uIGNvbXB1dGVDb25maWdWYWx1ZShwcm9wKSB7XG4gICAgdmFyIG1lcmdlID0gbWVyZ2VNYXBbcHJvcF0gfHwgbWVyZ2VEZWVwUHJvcGVydGllcztcbiAgICB2YXIgY29uZmlnVmFsdWUgPSBtZXJnZShwcm9wKTtcbiAgICAodXRpbHMuaXNVbmRlZmluZWQoY29uZmlnVmFsdWUpICYmIG1lcmdlICE9PSBtZXJnZURpcmVjdEtleXMpIHx8IChjb25maWdbcHJvcF0gPSBjb25maWdWYWx1ZSk7XG4gIH0pO1xuXG4gIHJldHVybiBjb25maWc7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgY3JlYXRlRXJyb3IgPSByZXF1aXJlKCcuL2NyZWF0ZUVycm9yJyk7XG5cbi8qKlxuICogUmVzb2x2ZSBvciByZWplY3QgYSBQcm9taXNlIGJhc2VkIG9uIHJlc3BvbnNlIHN0YXR1cy5cbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSByZXNvbHZlIEEgZnVuY3Rpb24gdGhhdCByZXNvbHZlcyB0aGUgcHJvbWlzZS5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IHJlamVjdCBBIGZ1bmN0aW9uIHRoYXQgcmVqZWN0cyB0aGUgcHJvbWlzZS5cbiAqIEBwYXJhbSB7b2JqZWN0fSByZXNwb25zZSBUaGUgcmVzcG9uc2UuXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gc2V0dGxlKHJlc29sdmUsIHJlamVjdCwgcmVzcG9uc2UpIHtcbiAgdmFyIHZhbGlkYXRlU3RhdHVzID0gcmVzcG9uc2UuY29uZmlnLnZhbGlkYXRlU3RhdHVzO1xuICBpZiAoIXJlc3BvbnNlLnN0YXR1cyB8fCAhdmFsaWRhdGVTdGF0dXMgfHwgdmFsaWRhdGVTdGF0dXMocmVzcG9uc2Uuc3RhdHVzKSkge1xuICAgIHJlc29sdmUocmVzcG9uc2UpO1xuICB9IGVsc2Uge1xuICAgIHJlamVjdChjcmVhdGVFcnJvcihcbiAgICAgICdSZXF1ZXN0IGZhaWxlZCB3aXRoIHN0YXR1cyBjb2RlICcgKyByZXNwb25zZS5zdGF0dXMsXG4gICAgICByZXNwb25zZS5jb25maWcsXG4gICAgICBudWxsLFxuICAgICAgcmVzcG9uc2UucmVxdWVzdCxcbiAgICAgIHJlc3BvbnNlXG4gICAgKSk7XG4gIH1cbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciB1dGlscyA9IHJlcXVpcmUoJy4vLi4vdXRpbHMnKTtcbnZhciBkZWZhdWx0cyA9IHJlcXVpcmUoJy4uL2RlZmF1bHRzJyk7XG5cbi8qKlxuICogVHJhbnNmb3JtIHRoZSBkYXRhIGZvciBhIHJlcXVlc3Qgb3IgYSByZXNwb25zZVxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fFN0cmluZ30gZGF0YSBUaGUgZGF0YSB0byBiZSB0cmFuc2Zvcm1lZFxuICogQHBhcmFtIHtBcnJheX0gaGVhZGVycyBUaGUgaGVhZGVycyBmb3IgdGhlIHJlcXVlc3Qgb3IgcmVzcG9uc2VcbiAqIEBwYXJhbSB7QXJyYXl8RnVuY3Rpb259IGZucyBBIHNpbmdsZSBmdW5jdGlvbiBvciBBcnJheSBvZiBmdW5jdGlvbnNcbiAqIEByZXR1cm5zIHsqfSBUaGUgcmVzdWx0aW5nIHRyYW5zZm9ybWVkIGRhdGFcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB0cmFuc2Zvcm1EYXRhKGRhdGEsIGhlYWRlcnMsIGZucykge1xuICB2YXIgY29udGV4dCA9IHRoaXMgfHwgZGVmYXVsdHM7XG4gIC8qZXNsaW50IG5vLXBhcmFtLXJlYXNzaWduOjAqL1xuICB1dGlscy5mb3JFYWNoKGZucywgZnVuY3Rpb24gdHJhbnNmb3JtKGZuKSB7XG4gICAgZGF0YSA9IGZuLmNhbGwoY29udGV4dCwgZGF0YSwgaGVhZGVycyk7XG4gIH0pO1xuXG4gIHJldHVybiBkYXRhO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi4vdXRpbHMnKTtcbnZhciBub3JtYWxpemVIZWFkZXJOYW1lID0gcmVxdWlyZSgnLi4vaGVscGVycy9ub3JtYWxpemVIZWFkZXJOYW1lJyk7XG52YXIgZW5oYW5jZUVycm9yID0gcmVxdWlyZSgnLi4vY29yZS9lbmhhbmNlRXJyb3InKTtcbnZhciB0cmFuc2l0aW9uYWxEZWZhdWx0cyA9IHJlcXVpcmUoJy4vdHJhbnNpdGlvbmFsJyk7XG5cbnZhciBERUZBVUxUX0NPTlRFTlRfVFlQRSA9IHtcbiAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnXG59O1xuXG5mdW5jdGlvbiBzZXRDb250ZW50VHlwZUlmVW5zZXQoaGVhZGVycywgdmFsdWUpIHtcbiAgaWYgKCF1dGlscy5pc1VuZGVmaW5lZChoZWFkZXJzKSAmJiB1dGlscy5pc1VuZGVmaW5lZChoZWFkZXJzWydDb250ZW50LVR5cGUnXSkpIHtcbiAgICBoZWFkZXJzWydDb250ZW50LVR5cGUnXSA9IHZhbHVlO1xuICB9XG59XG5cbmZ1bmN0aW9uIGdldERlZmF1bHRBZGFwdGVyKCkge1xuICB2YXIgYWRhcHRlcjtcbiAgaWYgKHR5cGVvZiBYTUxIdHRwUmVxdWVzdCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAvLyBGb3IgYnJvd3NlcnMgdXNlIFhIUiBhZGFwdGVyXG4gICAgYWRhcHRlciA9IHJlcXVpcmUoJy4uL2FkYXB0ZXJzL3hocicpO1xuICB9IGVsc2UgaWYgKHR5cGVvZiBwcm9jZXNzICE9PSAndW5kZWZpbmVkJyAmJiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwocHJvY2VzcykgPT09ICdbb2JqZWN0IHByb2Nlc3NdJykge1xuICAgIC8vIEZvciBub2RlIHVzZSBIVFRQIGFkYXB0ZXJcbiAgICBhZGFwdGVyID0gcmVxdWlyZSgnLi4vYWRhcHRlcnMvaHR0cCcpO1xuICB9XG4gIHJldHVybiBhZGFwdGVyO1xufVxuXG5mdW5jdGlvbiBzdHJpbmdpZnlTYWZlbHkocmF3VmFsdWUsIHBhcnNlciwgZW5jb2Rlcikge1xuICBpZiAodXRpbHMuaXNTdHJpbmcocmF3VmFsdWUpKSB7XG4gICAgdHJ5IHtcbiAgICAgIChwYXJzZXIgfHwgSlNPTi5wYXJzZSkocmF3VmFsdWUpO1xuICAgICAgcmV0dXJuIHV0aWxzLnRyaW0ocmF3VmFsdWUpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGlmIChlLm5hbWUgIT09ICdTeW50YXhFcnJvcicpIHtcbiAgICAgICAgdGhyb3cgZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gKGVuY29kZXIgfHwgSlNPTi5zdHJpbmdpZnkpKHJhd1ZhbHVlKTtcbn1cblxudmFyIGRlZmF1bHRzID0ge1xuXG4gIHRyYW5zaXRpb25hbDogdHJhbnNpdGlvbmFsRGVmYXVsdHMsXG5cbiAgYWRhcHRlcjogZ2V0RGVmYXVsdEFkYXB0ZXIoKSxcblxuICB0cmFuc2Zvcm1SZXF1ZXN0OiBbZnVuY3Rpb24gdHJhbnNmb3JtUmVxdWVzdChkYXRhLCBoZWFkZXJzKSB7XG4gICAgbm9ybWFsaXplSGVhZGVyTmFtZShoZWFkZXJzLCAnQWNjZXB0Jyk7XG4gICAgbm9ybWFsaXplSGVhZGVyTmFtZShoZWFkZXJzLCAnQ29udGVudC1UeXBlJyk7XG5cbiAgICBpZiAodXRpbHMuaXNGb3JtRGF0YShkYXRhKSB8fFxuICAgICAgdXRpbHMuaXNBcnJheUJ1ZmZlcihkYXRhKSB8fFxuICAgICAgdXRpbHMuaXNCdWZmZXIoZGF0YSkgfHxcbiAgICAgIHV0aWxzLmlzU3RyZWFtKGRhdGEpIHx8XG4gICAgICB1dGlscy5pc0ZpbGUoZGF0YSkgfHxcbiAgICAgIHV0aWxzLmlzQmxvYihkYXRhKVxuICAgICkge1xuICAgICAgcmV0dXJuIGRhdGE7XG4gICAgfVxuICAgIGlmICh1dGlscy5pc0FycmF5QnVmZmVyVmlldyhkYXRhKSkge1xuICAgICAgcmV0dXJuIGRhdGEuYnVmZmVyO1xuICAgIH1cbiAgICBpZiAodXRpbHMuaXNVUkxTZWFyY2hQYXJhbXMoZGF0YSkpIHtcbiAgICAgIHNldENvbnRlbnRUeXBlSWZVbnNldChoZWFkZXJzLCAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkO2NoYXJzZXQ9dXRmLTgnKTtcbiAgICAgIHJldHVybiBkYXRhLnRvU3RyaW5nKCk7XG4gICAgfVxuICAgIGlmICh1dGlscy5pc09iamVjdChkYXRhKSB8fCAoaGVhZGVycyAmJiBoZWFkZXJzWydDb250ZW50LVR5cGUnXSA9PT0gJ2FwcGxpY2F0aW9uL2pzb24nKSkge1xuICAgICAgc2V0Q29udGVudFR5cGVJZlVuc2V0KGhlYWRlcnMsICdhcHBsaWNhdGlvbi9qc29uJyk7XG4gICAgICByZXR1cm4gc3RyaW5naWZ5U2FmZWx5KGRhdGEpO1xuICAgIH1cbiAgICByZXR1cm4gZGF0YTtcbiAgfV0sXG5cbiAgdHJhbnNmb3JtUmVzcG9uc2U6IFtmdW5jdGlvbiB0cmFuc2Zvcm1SZXNwb25zZShkYXRhKSB7XG4gICAgdmFyIHRyYW5zaXRpb25hbCA9IHRoaXMudHJhbnNpdGlvbmFsIHx8IGRlZmF1bHRzLnRyYW5zaXRpb25hbDtcbiAgICB2YXIgc2lsZW50SlNPTlBhcnNpbmcgPSB0cmFuc2l0aW9uYWwgJiYgdHJhbnNpdGlvbmFsLnNpbGVudEpTT05QYXJzaW5nO1xuICAgIHZhciBmb3JjZWRKU09OUGFyc2luZyA9IHRyYW5zaXRpb25hbCAmJiB0cmFuc2l0aW9uYWwuZm9yY2VkSlNPTlBhcnNpbmc7XG4gICAgdmFyIHN0cmljdEpTT05QYXJzaW5nID0gIXNpbGVudEpTT05QYXJzaW5nICYmIHRoaXMucmVzcG9uc2VUeXBlID09PSAnanNvbic7XG5cbiAgICBpZiAoc3RyaWN0SlNPTlBhcnNpbmcgfHwgKGZvcmNlZEpTT05QYXJzaW5nICYmIHV0aWxzLmlzU3RyaW5nKGRhdGEpICYmIGRhdGEubGVuZ3RoKSkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgcmV0dXJuIEpTT04ucGFyc2UoZGF0YSk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGlmIChzdHJpY3RKU09OUGFyc2luZykge1xuICAgICAgICAgIGlmIChlLm5hbWUgPT09ICdTeW50YXhFcnJvcicpIHtcbiAgICAgICAgICAgIHRocm93IGVuaGFuY2VFcnJvcihlLCB0aGlzLCAnRV9KU09OX1BBUlNFJyk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHRocm93IGU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZGF0YTtcbiAgfV0sXG5cbiAgLyoqXG4gICAqIEEgdGltZW91dCBpbiBtaWxsaXNlY29uZHMgdG8gYWJvcnQgYSByZXF1ZXN0LiBJZiBzZXQgdG8gMCAoZGVmYXVsdCkgYVxuICAgKiB0aW1lb3V0IGlzIG5vdCBjcmVhdGVkLlxuICAgKi9cbiAgdGltZW91dDogMCxcblxuICB4c3JmQ29va2llTmFtZTogJ1hTUkYtVE9LRU4nLFxuICB4c3JmSGVhZGVyTmFtZTogJ1gtWFNSRi1UT0tFTicsXG5cbiAgbWF4Q29udGVudExlbmd0aDogLTEsXG4gIG1heEJvZHlMZW5ndGg6IC0xLFxuXG4gIHZhbGlkYXRlU3RhdHVzOiBmdW5jdGlvbiB2YWxpZGF0ZVN0YXR1cyhzdGF0dXMpIHtcbiAgICByZXR1cm4gc3RhdHVzID49IDIwMCAmJiBzdGF0dXMgPCAzMDA7XG4gIH0sXG5cbiAgaGVhZGVyczoge1xuICAgIGNvbW1vbjoge1xuICAgICAgJ0FjY2VwdCc6ICdhcHBsaWNhdGlvbi9qc29uLCB0ZXh0L3BsYWluLCAqLyonXG4gICAgfVxuICB9XG59O1xuXG51dGlscy5mb3JFYWNoKFsnZGVsZXRlJywgJ2dldCcsICdoZWFkJ10sIGZ1bmN0aW9uIGZvckVhY2hNZXRob2ROb0RhdGEobWV0aG9kKSB7XG4gIGRlZmF1bHRzLmhlYWRlcnNbbWV0aG9kXSA9IHt9O1xufSk7XG5cbnV0aWxzLmZvckVhY2goWydwb3N0JywgJ3B1dCcsICdwYXRjaCddLCBmdW5jdGlvbiBmb3JFYWNoTWV0aG9kV2l0aERhdGEobWV0aG9kKSB7XG4gIGRlZmF1bHRzLmhlYWRlcnNbbWV0aG9kXSA9IHV0aWxzLm1lcmdlKERFRkFVTFRfQ09OVEVOVF9UWVBFKTtcbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGRlZmF1bHRzO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgc2lsZW50SlNPTlBhcnNpbmc6IHRydWUsXG4gIGZvcmNlZEpTT05QYXJzaW5nOiB0cnVlLFxuICBjbGFyaWZ5VGltZW91dEVycm9yOiBmYWxzZVxufTtcbiIsIm1vZHVsZS5leHBvcnRzID0ge1xuICBcInZlcnNpb25cIjogXCIwLjI2LjFcIlxufTsiLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gYmluZChmbiwgdGhpc0FyZykge1xuICByZXR1cm4gZnVuY3Rpb24gd3JhcCgpIHtcbiAgICB2YXIgYXJncyA9IG5ldyBBcnJheShhcmd1bWVudHMubGVuZ3RoKTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3MubGVuZ3RoOyBpKyspIHtcbiAgICAgIGFyZ3NbaV0gPSBhcmd1bWVudHNbaV07XG4gICAgfVxuICAgIHJldHVybiBmbi5hcHBseSh0aGlzQXJnLCBhcmdzKTtcbiAgfTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciB1dGlscyA9IHJlcXVpcmUoJy4vLi4vdXRpbHMnKTtcblxuZnVuY3Rpb24gZW5jb2RlKHZhbCkge1xuICByZXR1cm4gZW5jb2RlVVJJQ29tcG9uZW50KHZhbCkuXG4gICAgcmVwbGFjZSgvJTNBL2dpLCAnOicpLlxuICAgIHJlcGxhY2UoLyUyNC9nLCAnJCcpLlxuICAgIHJlcGxhY2UoLyUyQy9naSwgJywnKS5cbiAgICByZXBsYWNlKC8lMjAvZywgJysnKS5cbiAgICByZXBsYWNlKC8lNUIvZ2ksICdbJykuXG4gICAgcmVwbGFjZSgvJTVEL2dpLCAnXScpO1xufVxuXG4vKipcbiAqIEJ1aWxkIGEgVVJMIGJ5IGFwcGVuZGluZyBwYXJhbXMgdG8gdGhlIGVuZFxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSB1cmwgVGhlIGJhc2Ugb2YgdGhlIHVybCAoZS5nLiwgaHR0cDovL3d3dy5nb29nbGUuY29tKVxuICogQHBhcmFtIHtvYmplY3R9IFtwYXJhbXNdIFRoZSBwYXJhbXMgdG8gYmUgYXBwZW5kZWRcbiAqIEByZXR1cm5zIHtzdHJpbmd9IFRoZSBmb3JtYXR0ZWQgdXJsXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gYnVpbGRVUkwodXJsLCBwYXJhbXMsIHBhcmFtc1NlcmlhbGl6ZXIpIHtcbiAgLyplc2xpbnQgbm8tcGFyYW0tcmVhc3NpZ246MCovXG4gIGlmICghcGFyYW1zKSB7XG4gICAgcmV0dXJuIHVybDtcbiAgfVxuXG4gIHZhciBzZXJpYWxpemVkUGFyYW1zO1xuICBpZiAocGFyYW1zU2VyaWFsaXplcikge1xuICAgIHNlcmlhbGl6ZWRQYXJhbXMgPSBwYXJhbXNTZXJpYWxpemVyKHBhcmFtcyk7XG4gIH0gZWxzZSBpZiAodXRpbHMuaXNVUkxTZWFyY2hQYXJhbXMocGFyYW1zKSkge1xuICAgIHNlcmlhbGl6ZWRQYXJhbXMgPSBwYXJhbXMudG9TdHJpbmcoKTtcbiAgfSBlbHNlIHtcbiAgICB2YXIgcGFydHMgPSBbXTtcblxuICAgIHV0aWxzLmZvckVhY2gocGFyYW1zLCBmdW5jdGlvbiBzZXJpYWxpemUodmFsLCBrZXkpIHtcbiAgICAgIGlmICh2YWwgPT09IG51bGwgfHwgdHlwZW9mIHZhbCA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAodXRpbHMuaXNBcnJheSh2YWwpKSB7XG4gICAgICAgIGtleSA9IGtleSArICdbXSc7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YWwgPSBbdmFsXTtcbiAgICAgIH1cblxuICAgICAgdXRpbHMuZm9yRWFjaCh2YWwsIGZ1bmN0aW9uIHBhcnNlVmFsdWUodikge1xuICAgICAgICBpZiAodXRpbHMuaXNEYXRlKHYpKSB7XG4gICAgICAgICAgdiA9IHYudG9JU09TdHJpbmcoKTtcbiAgICAgICAgfSBlbHNlIGlmICh1dGlscy5pc09iamVjdCh2KSkge1xuICAgICAgICAgIHYgPSBKU09OLnN0cmluZ2lmeSh2KTtcbiAgICAgICAgfVxuICAgICAgICBwYXJ0cy5wdXNoKGVuY29kZShrZXkpICsgJz0nICsgZW5jb2RlKHYpKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgc2VyaWFsaXplZFBhcmFtcyA9IHBhcnRzLmpvaW4oJyYnKTtcbiAgfVxuXG4gIGlmIChzZXJpYWxpemVkUGFyYW1zKSB7XG4gICAgdmFyIGhhc2htYXJrSW5kZXggPSB1cmwuaW5kZXhPZignIycpO1xuICAgIGlmIChoYXNobWFya0luZGV4ICE9PSAtMSkge1xuICAgICAgdXJsID0gdXJsLnNsaWNlKDAsIGhhc2htYXJrSW5kZXgpO1xuICAgIH1cblxuICAgIHVybCArPSAodXJsLmluZGV4T2YoJz8nKSA9PT0gLTEgPyAnPycgOiAnJicpICsgc2VyaWFsaXplZFBhcmFtcztcbiAgfVxuXG4gIHJldHVybiB1cmw7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBuZXcgVVJMIGJ5IGNvbWJpbmluZyB0aGUgc3BlY2lmaWVkIFVSTHNcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gYmFzZVVSTCBUaGUgYmFzZSBVUkxcbiAqIEBwYXJhbSB7c3RyaW5nfSByZWxhdGl2ZVVSTCBUaGUgcmVsYXRpdmUgVVJMXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBUaGUgY29tYmluZWQgVVJMXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY29tYmluZVVSTHMoYmFzZVVSTCwgcmVsYXRpdmVVUkwpIHtcbiAgcmV0dXJuIHJlbGF0aXZlVVJMXG4gICAgPyBiYXNlVVJMLnJlcGxhY2UoL1xcLyskLywgJycpICsgJy8nICsgcmVsYXRpdmVVUkwucmVwbGFjZSgvXlxcLysvLCAnJylcbiAgICA6IGJhc2VVUkw7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLy4uL3V0aWxzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gKFxuICB1dGlscy5pc1N0YW5kYXJkQnJvd3NlckVudigpID9cblxuICAvLyBTdGFuZGFyZCBicm93c2VyIGVudnMgc3VwcG9ydCBkb2N1bWVudC5jb29raWVcbiAgICAoZnVuY3Rpb24gc3RhbmRhcmRCcm93c2VyRW52KCkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgd3JpdGU6IGZ1bmN0aW9uIHdyaXRlKG5hbWUsIHZhbHVlLCBleHBpcmVzLCBwYXRoLCBkb21haW4sIHNlY3VyZSkge1xuICAgICAgICAgIHZhciBjb29raWUgPSBbXTtcbiAgICAgICAgICBjb29raWUucHVzaChuYW1lICsgJz0nICsgZW5jb2RlVVJJQ29tcG9uZW50KHZhbHVlKSk7XG5cbiAgICAgICAgICBpZiAodXRpbHMuaXNOdW1iZXIoZXhwaXJlcykpIHtcbiAgICAgICAgICAgIGNvb2tpZS5wdXNoKCdleHBpcmVzPScgKyBuZXcgRGF0ZShleHBpcmVzKS50b0dNVFN0cmluZygpKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAodXRpbHMuaXNTdHJpbmcocGF0aCkpIHtcbiAgICAgICAgICAgIGNvb2tpZS5wdXNoKCdwYXRoPScgKyBwYXRoKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAodXRpbHMuaXNTdHJpbmcoZG9tYWluKSkge1xuICAgICAgICAgICAgY29va2llLnB1c2goJ2RvbWFpbj0nICsgZG9tYWluKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoc2VjdXJlID09PSB0cnVlKSB7XG4gICAgICAgICAgICBjb29raWUucHVzaCgnc2VjdXJlJyk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgZG9jdW1lbnQuY29va2llID0gY29va2llLmpvaW4oJzsgJyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgcmVhZDogZnVuY3Rpb24gcmVhZChuYW1lKSB7XG4gICAgICAgICAgdmFyIG1hdGNoID0gZG9jdW1lbnQuY29va2llLm1hdGNoKG5ldyBSZWdFeHAoJyhefDtcXFxccyopKCcgKyBuYW1lICsgJyk9KFteO10qKScpKTtcbiAgICAgICAgICByZXR1cm4gKG1hdGNoID8gZGVjb2RlVVJJQ29tcG9uZW50KG1hdGNoWzNdKSA6IG51bGwpO1xuICAgICAgICB9LFxuXG4gICAgICAgIHJlbW92ZTogZnVuY3Rpb24gcmVtb3ZlKG5hbWUpIHtcbiAgICAgICAgICB0aGlzLndyaXRlKG5hbWUsICcnLCBEYXRlLm5vdygpIC0gODY0MDAwMDApO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgIH0pKCkgOlxuXG4gIC8vIE5vbiBzdGFuZGFyZCBicm93c2VyIGVudiAod2ViIHdvcmtlcnMsIHJlYWN0LW5hdGl2ZSkgbGFjayBuZWVkZWQgc3VwcG9ydC5cbiAgICAoZnVuY3Rpb24gbm9uU3RhbmRhcmRCcm93c2VyRW52KCkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgd3JpdGU6IGZ1bmN0aW9uIHdyaXRlKCkge30sXG4gICAgICAgIHJlYWQ6IGZ1bmN0aW9uIHJlYWQoKSB7IHJldHVybiBudWxsOyB9LFxuICAgICAgICByZW1vdmU6IGZ1bmN0aW9uIHJlbW92ZSgpIHt9XG4gICAgICB9O1xuICAgIH0pKClcbik7XG4iLCIndXNlIHN0cmljdCc7XG5cbi8qKlxuICogRGV0ZXJtaW5lcyB3aGV0aGVyIHRoZSBzcGVjaWZpZWQgVVJMIGlzIGFic29sdXRlXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHVybCBUaGUgVVJMIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHRoZSBzcGVjaWZpZWQgVVJMIGlzIGFic29sdXRlLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpc0Fic29sdXRlVVJMKHVybCkge1xuICAvLyBBIFVSTCBpcyBjb25zaWRlcmVkIGFic29sdXRlIGlmIGl0IGJlZ2lucyB3aXRoIFwiPHNjaGVtZT46Ly9cIiBvciBcIi8vXCIgKHByb3RvY29sLXJlbGF0aXZlIFVSTCkuXG4gIC8vIFJGQyAzOTg2IGRlZmluZXMgc2NoZW1lIG5hbWUgYXMgYSBzZXF1ZW5jZSBvZiBjaGFyYWN0ZXJzIGJlZ2lubmluZyB3aXRoIGEgbGV0dGVyIGFuZCBmb2xsb3dlZFxuICAvLyBieSBhbnkgY29tYmluYXRpb24gb2YgbGV0dGVycywgZGlnaXRzLCBwbHVzLCBwZXJpb2QsIG9yIGh5cGhlbi5cbiAgcmV0dXJuIC9eKFthLXpdW2EtelxcZCtcXC0uXSo6KT9cXC9cXC8vaS50ZXN0KHVybCk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLy4uL3V0aWxzJyk7XG5cbi8qKlxuICogRGV0ZXJtaW5lcyB3aGV0aGVyIHRoZSBwYXlsb2FkIGlzIGFuIGVycm9yIHRocm93biBieSBBeGlvc1xuICpcbiAqIEBwYXJhbSB7Kn0gcGF5bG9hZCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdGhlIHBheWxvYWQgaXMgYW4gZXJyb3IgdGhyb3duIGJ5IEF4aW9zLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpc0F4aW9zRXJyb3IocGF5bG9hZCkge1xuICByZXR1cm4gdXRpbHMuaXNPYmplY3QocGF5bG9hZCkgJiYgKHBheWxvYWQuaXNBeGlvc0Vycm9yID09PSB0cnVlKTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciB1dGlscyA9IHJlcXVpcmUoJy4vLi4vdXRpbHMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSAoXG4gIHV0aWxzLmlzU3RhbmRhcmRCcm93c2VyRW52KCkgP1xuXG4gIC8vIFN0YW5kYXJkIGJyb3dzZXIgZW52cyBoYXZlIGZ1bGwgc3VwcG9ydCBvZiB0aGUgQVBJcyBuZWVkZWQgdG8gdGVzdFxuICAvLyB3aGV0aGVyIHRoZSByZXF1ZXN0IFVSTCBpcyBvZiB0aGUgc2FtZSBvcmlnaW4gYXMgY3VycmVudCBsb2NhdGlvbi5cbiAgICAoZnVuY3Rpb24gc3RhbmRhcmRCcm93c2VyRW52KCkge1xuICAgICAgdmFyIG1zaWUgPSAvKG1zaWV8dHJpZGVudCkvaS50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpO1xuICAgICAgdmFyIHVybFBhcnNpbmdOb2RlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xuICAgICAgdmFyIG9yaWdpblVSTDtcblxuICAgICAgLyoqXG4gICAgKiBQYXJzZSBhIFVSTCB0byBkaXNjb3ZlciBpdCdzIGNvbXBvbmVudHNcbiAgICAqXG4gICAgKiBAcGFyYW0ge1N0cmluZ30gdXJsIFRoZSBVUkwgdG8gYmUgcGFyc2VkXG4gICAgKiBAcmV0dXJucyB7T2JqZWN0fVxuICAgICovXG4gICAgICBmdW5jdGlvbiByZXNvbHZlVVJMKHVybCkge1xuICAgICAgICB2YXIgaHJlZiA9IHVybDtcblxuICAgICAgICBpZiAobXNpZSkge1xuICAgICAgICAvLyBJRSBuZWVkcyBhdHRyaWJ1dGUgc2V0IHR3aWNlIHRvIG5vcm1hbGl6ZSBwcm9wZXJ0aWVzXG4gICAgICAgICAgdXJsUGFyc2luZ05vZGUuc2V0QXR0cmlidXRlKCdocmVmJywgaHJlZik7XG4gICAgICAgICAgaHJlZiA9IHVybFBhcnNpbmdOb2RlLmhyZWY7XG4gICAgICAgIH1cblxuICAgICAgICB1cmxQYXJzaW5nTm9kZS5zZXRBdHRyaWJ1dGUoJ2hyZWYnLCBocmVmKTtcblxuICAgICAgICAvLyB1cmxQYXJzaW5nTm9kZSBwcm92aWRlcyB0aGUgVXJsVXRpbHMgaW50ZXJmYWNlIC0gaHR0cDovL3VybC5zcGVjLndoYXR3Zy5vcmcvI3VybHV0aWxzXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgaHJlZjogdXJsUGFyc2luZ05vZGUuaHJlZixcbiAgICAgICAgICBwcm90b2NvbDogdXJsUGFyc2luZ05vZGUucHJvdG9jb2wgPyB1cmxQYXJzaW5nTm9kZS5wcm90b2NvbC5yZXBsYWNlKC86JC8sICcnKSA6ICcnLFxuICAgICAgICAgIGhvc3Q6IHVybFBhcnNpbmdOb2RlLmhvc3QsXG4gICAgICAgICAgc2VhcmNoOiB1cmxQYXJzaW5nTm9kZS5zZWFyY2ggPyB1cmxQYXJzaW5nTm9kZS5zZWFyY2gucmVwbGFjZSgvXlxcPy8sICcnKSA6ICcnLFxuICAgICAgICAgIGhhc2g6IHVybFBhcnNpbmdOb2RlLmhhc2ggPyB1cmxQYXJzaW5nTm9kZS5oYXNoLnJlcGxhY2UoL14jLywgJycpIDogJycsXG4gICAgICAgICAgaG9zdG5hbWU6IHVybFBhcnNpbmdOb2RlLmhvc3RuYW1lLFxuICAgICAgICAgIHBvcnQ6IHVybFBhcnNpbmdOb2RlLnBvcnQsXG4gICAgICAgICAgcGF0aG5hbWU6ICh1cmxQYXJzaW5nTm9kZS5wYXRobmFtZS5jaGFyQXQoMCkgPT09ICcvJykgP1xuICAgICAgICAgICAgdXJsUGFyc2luZ05vZGUucGF0aG5hbWUgOlxuICAgICAgICAgICAgJy8nICsgdXJsUGFyc2luZ05vZGUucGF0aG5hbWVcbiAgICAgICAgfTtcbiAgICAgIH1cblxuICAgICAgb3JpZ2luVVJMID0gcmVzb2x2ZVVSTCh3aW5kb3cubG9jYXRpb24uaHJlZik7XG5cbiAgICAgIC8qKlxuICAgICogRGV0ZXJtaW5lIGlmIGEgVVJMIHNoYXJlcyB0aGUgc2FtZSBvcmlnaW4gYXMgdGhlIGN1cnJlbnQgbG9jYXRpb25cbiAgICAqXG4gICAgKiBAcGFyYW0ge1N0cmluZ30gcmVxdWVzdFVSTCBUaGUgVVJMIHRvIHRlc3RcbiAgICAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIFVSTCBzaGFyZXMgdGhlIHNhbWUgb3JpZ2luLCBvdGhlcndpc2UgZmFsc2VcbiAgICAqL1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uIGlzVVJMU2FtZU9yaWdpbihyZXF1ZXN0VVJMKSB7XG4gICAgICAgIHZhciBwYXJzZWQgPSAodXRpbHMuaXNTdHJpbmcocmVxdWVzdFVSTCkpID8gcmVzb2x2ZVVSTChyZXF1ZXN0VVJMKSA6IHJlcXVlc3RVUkw7XG4gICAgICAgIHJldHVybiAocGFyc2VkLnByb3RvY29sID09PSBvcmlnaW5VUkwucHJvdG9jb2wgJiZcbiAgICAgICAgICAgIHBhcnNlZC5ob3N0ID09PSBvcmlnaW5VUkwuaG9zdCk7XG4gICAgICB9O1xuICAgIH0pKCkgOlxuXG4gIC8vIE5vbiBzdGFuZGFyZCBicm93c2VyIGVudnMgKHdlYiB3b3JrZXJzLCByZWFjdC1uYXRpdmUpIGxhY2sgbmVlZGVkIHN1cHBvcnQuXG4gICAgKGZ1bmN0aW9uIG5vblN0YW5kYXJkQnJvd3NlckVudigpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbiBpc1VSTFNhbWVPcmlnaW4oKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfTtcbiAgICB9KSgpXG4pO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLi91dGlscycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIG5vcm1hbGl6ZUhlYWRlck5hbWUoaGVhZGVycywgbm9ybWFsaXplZE5hbWUpIHtcbiAgdXRpbHMuZm9yRWFjaChoZWFkZXJzLCBmdW5jdGlvbiBwcm9jZXNzSGVhZGVyKHZhbHVlLCBuYW1lKSB7XG4gICAgaWYgKG5hbWUgIT09IG5vcm1hbGl6ZWROYW1lICYmIG5hbWUudG9VcHBlckNhc2UoKSA9PT0gbm9ybWFsaXplZE5hbWUudG9VcHBlckNhc2UoKSkge1xuICAgICAgaGVhZGVyc1tub3JtYWxpemVkTmFtZV0gPSB2YWx1ZTtcbiAgICAgIGRlbGV0ZSBoZWFkZXJzW25hbWVdO1xuICAgIH1cbiAgfSk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLy4uL3V0aWxzJyk7XG5cbi8vIEhlYWRlcnMgd2hvc2UgZHVwbGljYXRlcyBhcmUgaWdub3JlZCBieSBub2RlXG4vLyBjLmYuIGh0dHBzOi8vbm9kZWpzLm9yZy9hcGkvaHR0cC5odG1sI2h0dHBfbWVzc2FnZV9oZWFkZXJzXG52YXIgaWdub3JlRHVwbGljYXRlT2YgPSBbXG4gICdhZ2UnLCAnYXV0aG9yaXphdGlvbicsICdjb250ZW50LWxlbmd0aCcsICdjb250ZW50LXR5cGUnLCAnZXRhZycsXG4gICdleHBpcmVzJywgJ2Zyb20nLCAnaG9zdCcsICdpZi1tb2RpZmllZC1zaW5jZScsICdpZi11bm1vZGlmaWVkLXNpbmNlJyxcbiAgJ2xhc3QtbW9kaWZpZWQnLCAnbG9jYXRpb24nLCAnbWF4LWZvcndhcmRzJywgJ3Byb3h5LWF1dGhvcml6YXRpb24nLFxuICAncmVmZXJlcicsICdyZXRyeS1hZnRlcicsICd1c2VyLWFnZW50J1xuXTtcblxuLyoqXG4gKiBQYXJzZSBoZWFkZXJzIGludG8gYW4gb2JqZWN0XG4gKlxuICogYGBgXG4gKiBEYXRlOiBXZWQsIDI3IEF1ZyAyMDE0IDA4OjU4OjQ5IEdNVFxuICogQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uXG4gKiBDb25uZWN0aW9uOiBrZWVwLWFsaXZlXG4gKiBUcmFuc2Zlci1FbmNvZGluZzogY2h1bmtlZFxuICogYGBgXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGhlYWRlcnMgSGVhZGVycyBuZWVkaW5nIHRvIGJlIHBhcnNlZFxuICogQHJldHVybnMge09iamVjdH0gSGVhZGVycyBwYXJzZWQgaW50byBhbiBvYmplY3RcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBwYXJzZUhlYWRlcnMoaGVhZGVycykge1xuICB2YXIgcGFyc2VkID0ge307XG4gIHZhciBrZXk7XG4gIHZhciB2YWw7XG4gIHZhciBpO1xuXG4gIGlmICghaGVhZGVycykgeyByZXR1cm4gcGFyc2VkOyB9XG5cbiAgdXRpbHMuZm9yRWFjaChoZWFkZXJzLnNwbGl0KCdcXG4nKSwgZnVuY3Rpb24gcGFyc2VyKGxpbmUpIHtcbiAgICBpID0gbGluZS5pbmRleE9mKCc6Jyk7XG4gICAga2V5ID0gdXRpbHMudHJpbShsaW5lLnN1YnN0cigwLCBpKSkudG9Mb3dlckNhc2UoKTtcbiAgICB2YWwgPSB1dGlscy50cmltKGxpbmUuc3Vic3RyKGkgKyAxKSk7XG5cbiAgICBpZiAoa2V5KSB7XG4gICAgICBpZiAocGFyc2VkW2tleV0gJiYgaWdub3JlRHVwbGljYXRlT2YuaW5kZXhPZihrZXkpID49IDApIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKGtleSA9PT0gJ3NldC1jb29raWUnKSB7XG4gICAgICAgIHBhcnNlZFtrZXldID0gKHBhcnNlZFtrZXldID8gcGFyc2VkW2tleV0gOiBbXSkuY29uY2F0KFt2YWxdKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHBhcnNlZFtrZXldID0gcGFyc2VkW2tleV0gPyBwYXJzZWRba2V5XSArICcsICcgKyB2YWwgOiB2YWw7XG4gICAgICB9XG4gICAgfVxuICB9KTtcblxuICByZXR1cm4gcGFyc2VkO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBTeW50YWN0aWMgc3VnYXIgZm9yIGludm9raW5nIGEgZnVuY3Rpb24gYW5kIGV4cGFuZGluZyBhbiBhcnJheSBmb3IgYXJndW1lbnRzLlxuICpcbiAqIENvbW1vbiB1c2UgY2FzZSB3b3VsZCBiZSB0byB1c2UgYEZ1bmN0aW9uLnByb3RvdHlwZS5hcHBseWAuXG4gKlxuICogIGBgYGpzXG4gKiAgZnVuY3Rpb24gZih4LCB5LCB6KSB7fVxuICogIHZhciBhcmdzID0gWzEsIDIsIDNdO1xuICogIGYuYXBwbHkobnVsbCwgYXJncyk7XG4gKiAgYGBgXG4gKlxuICogV2l0aCBgc3ByZWFkYCB0aGlzIGV4YW1wbGUgY2FuIGJlIHJlLXdyaXR0ZW4uXG4gKlxuICogIGBgYGpzXG4gKiAgc3ByZWFkKGZ1bmN0aW9uKHgsIHksIHopIHt9KShbMSwgMiwgM10pO1xuICogIGBgYFxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259XG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gc3ByZWFkKGNhbGxiYWNrKSB7XG4gIHJldHVybiBmdW5jdGlvbiB3cmFwKGFycikge1xuICAgIHJldHVybiBjYWxsYmFjay5hcHBseShudWxsLCBhcnIpO1xuICB9O1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIFZFUlNJT04gPSByZXF1aXJlKCcuLi9lbnYvZGF0YScpLnZlcnNpb247XG5cbnZhciB2YWxpZGF0b3JzID0ge307XG5cbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBmdW5jLW5hbWVzXG5bJ29iamVjdCcsICdib29sZWFuJywgJ251bWJlcicsICdmdW5jdGlvbicsICdzdHJpbmcnLCAnc3ltYm9sJ10uZm9yRWFjaChmdW5jdGlvbih0eXBlLCBpKSB7XG4gIHZhbGlkYXRvcnNbdHlwZV0gPSBmdW5jdGlvbiB2YWxpZGF0b3IodGhpbmcpIHtcbiAgICByZXR1cm4gdHlwZW9mIHRoaW5nID09PSB0eXBlIHx8ICdhJyArIChpIDwgMSA/ICduICcgOiAnICcpICsgdHlwZTtcbiAgfTtcbn0pO1xuXG52YXIgZGVwcmVjYXRlZFdhcm5pbmdzID0ge307XG5cbi8qKlxuICogVHJhbnNpdGlvbmFsIG9wdGlvbiB2YWxpZGF0b3JcbiAqIEBwYXJhbSB7ZnVuY3Rpb258Ym9vbGVhbj99IHZhbGlkYXRvciAtIHNldCB0byBmYWxzZSBpZiB0aGUgdHJhbnNpdGlvbmFsIG9wdGlvbiBoYXMgYmVlbiByZW1vdmVkXG4gKiBAcGFyYW0ge3N0cmluZz99IHZlcnNpb24gLSBkZXByZWNhdGVkIHZlcnNpb24gLyByZW1vdmVkIHNpbmNlIHZlcnNpb25cbiAqIEBwYXJhbSB7c3RyaW5nP30gbWVzc2FnZSAtIHNvbWUgbWVzc2FnZSB3aXRoIGFkZGl0aW9uYWwgaW5mb1xuICogQHJldHVybnMge2Z1bmN0aW9ufVxuICovXG52YWxpZGF0b3JzLnRyYW5zaXRpb25hbCA9IGZ1bmN0aW9uIHRyYW5zaXRpb25hbCh2YWxpZGF0b3IsIHZlcnNpb24sIG1lc3NhZ2UpIHtcbiAgZnVuY3Rpb24gZm9ybWF0TWVzc2FnZShvcHQsIGRlc2MpIHtcbiAgICByZXR1cm4gJ1tBeGlvcyB2JyArIFZFUlNJT04gKyAnXSBUcmFuc2l0aW9uYWwgb3B0aW9uIFxcJycgKyBvcHQgKyAnXFwnJyArIGRlc2MgKyAobWVzc2FnZSA/ICcuICcgKyBtZXNzYWdlIDogJycpO1xuICB9XG5cbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGZ1bmMtbmFtZXNcbiAgcmV0dXJuIGZ1bmN0aW9uKHZhbHVlLCBvcHQsIG9wdHMpIHtcbiAgICBpZiAodmFsaWRhdG9yID09PSBmYWxzZSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGZvcm1hdE1lc3NhZ2Uob3B0LCAnIGhhcyBiZWVuIHJlbW92ZWQnICsgKHZlcnNpb24gPyAnIGluICcgKyB2ZXJzaW9uIDogJycpKSk7XG4gICAgfVxuXG4gICAgaWYgKHZlcnNpb24gJiYgIWRlcHJlY2F0ZWRXYXJuaW5nc1tvcHRdKSB7XG4gICAgICBkZXByZWNhdGVkV2FybmluZ3Nbb3B0XSA9IHRydWU7XG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uc29sZVxuICAgICAgY29uc29sZS53YXJuKFxuICAgICAgICBmb3JtYXRNZXNzYWdlKFxuICAgICAgICAgIG9wdCxcbiAgICAgICAgICAnIGhhcyBiZWVuIGRlcHJlY2F0ZWQgc2luY2UgdicgKyB2ZXJzaW9uICsgJyBhbmQgd2lsbCBiZSByZW1vdmVkIGluIHRoZSBuZWFyIGZ1dHVyZSdcbiAgICAgICAgKVxuICAgICAgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdmFsaWRhdG9yID8gdmFsaWRhdG9yKHZhbHVlLCBvcHQsIG9wdHMpIDogdHJ1ZTtcbiAgfTtcbn07XG5cbi8qKlxuICogQXNzZXJ0IG9iamVjdCdzIHByb3BlcnRpZXMgdHlwZVxuICogQHBhcmFtIHtvYmplY3R9IG9wdGlvbnNcbiAqIEBwYXJhbSB7b2JqZWN0fSBzY2hlbWFcbiAqIEBwYXJhbSB7Ym9vbGVhbj99IGFsbG93VW5rbm93blxuICovXG5cbmZ1bmN0aW9uIGFzc2VydE9wdGlvbnMob3B0aW9ucywgc2NoZW1hLCBhbGxvd1Vua25vd24pIHtcbiAgaWYgKHR5cGVvZiBvcHRpb25zICE9PSAnb2JqZWN0Jykge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ29wdGlvbnMgbXVzdCBiZSBhbiBvYmplY3QnKTtcbiAgfVxuICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKG9wdGlvbnMpO1xuICB2YXIgaSA9IGtleXMubGVuZ3RoO1xuICB3aGlsZSAoaS0tID4gMCkge1xuICAgIHZhciBvcHQgPSBrZXlzW2ldO1xuICAgIHZhciB2YWxpZGF0b3IgPSBzY2hlbWFbb3B0XTtcbiAgICBpZiAodmFsaWRhdG9yKSB7XG4gICAgICB2YXIgdmFsdWUgPSBvcHRpb25zW29wdF07XG4gICAgICB2YXIgcmVzdWx0ID0gdmFsdWUgPT09IHVuZGVmaW5lZCB8fCB2YWxpZGF0b3IodmFsdWUsIG9wdCwgb3B0aW9ucyk7XG4gICAgICBpZiAocmVzdWx0ICE9PSB0cnVlKSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ29wdGlvbiAnICsgb3B0ICsgJyBtdXN0IGJlICcgKyByZXN1bHQpO1xuICAgICAgfVxuICAgICAgY29udGludWU7XG4gICAgfVxuICAgIGlmIChhbGxvd1Vua25vd24gIT09IHRydWUpIHtcbiAgICAgIHRocm93IEVycm9yKCdVbmtub3duIG9wdGlvbiAnICsgb3B0KTtcbiAgICB9XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGFzc2VydE9wdGlvbnM6IGFzc2VydE9wdGlvbnMsXG4gIHZhbGlkYXRvcnM6IHZhbGlkYXRvcnNcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBiaW5kID0gcmVxdWlyZSgnLi9oZWxwZXJzL2JpbmQnKTtcblxuLy8gdXRpbHMgaXMgYSBsaWJyYXJ5IG9mIGdlbmVyaWMgaGVscGVyIGZ1bmN0aW9ucyBub24tc3BlY2lmaWMgdG8gYXhpb3NcblxudmFyIHRvU3RyaW5nID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZztcblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhbiBBcnJheVxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGFuIEFycmF5LCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNBcnJheSh2YWwpIHtcbiAgcmV0dXJuIEFycmF5LmlzQXJyYXkodmFsKTtcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyB1bmRlZmluZWRcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB0aGUgdmFsdWUgaXMgdW5kZWZpbmVkLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNVbmRlZmluZWQodmFsKSB7XG4gIHJldHVybiB0eXBlb2YgdmFsID09PSAndW5kZWZpbmVkJztcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIEJ1ZmZlclxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGEgQnVmZmVyLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNCdWZmZXIodmFsKSB7XG4gIHJldHVybiB2YWwgIT09IG51bGwgJiYgIWlzVW5kZWZpbmVkKHZhbCkgJiYgdmFsLmNvbnN0cnVjdG9yICE9PSBudWxsICYmICFpc1VuZGVmaW5lZCh2YWwuY29uc3RydWN0b3IpXG4gICAgJiYgdHlwZW9mIHZhbC5jb25zdHJ1Y3Rvci5pc0J1ZmZlciA9PT0gJ2Z1bmN0aW9uJyAmJiB2YWwuY29uc3RydWN0b3IuaXNCdWZmZXIodmFsKTtcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhbiBBcnJheUJ1ZmZlclxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGFuIEFycmF5QnVmZmVyLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNBcnJheUJ1ZmZlcih2YWwpIHtcbiAgcmV0dXJuIHRvU3RyaW5nLmNhbGwodmFsKSA9PT0gJ1tvYmplY3QgQXJyYXlCdWZmZXJdJztcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIEZvcm1EYXRhXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYW4gRm9ybURhdGEsIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0Zvcm1EYXRhKHZhbCkge1xuICByZXR1cm4gdG9TdHJpbmcuY2FsbCh2YWwpID09PSAnW29iamVjdCBGb3JtRGF0YV0nO1xufVxuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGEgdmlldyBvbiBhbiBBcnJheUJ1ZmZlclxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGEgdmlldyBvbiBhbiBBcnJheUJ1ZmZlciwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzQXJyYXlCdWZmZXJWaWV3KHZhbCkge1xuICB2YXIgcmVzdWx0O1xuICBpZiAoKHR5cGVvZiBBcnJheUJ1ZmZlciAhPT0gJ3VuZGVmaW5lZCcpICYmIChBcnJheUJ1ZmZlci5pc1ZpZXcpKSB7XG4gICAgcmVzdWx0ID0gQXJyYXlCdWZmZXIuaXNWaWV3KHZhbCk7XG4gIH0gZWxzZSB7XG4gICAgcmVzdWx0ID0gKHZhbCkgJiYgKHZhbC5idWZmZXIpICYmIChpc0FycmF5QnVmZmVyKHZhbC5idWZmZXIpKTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGEgU3RyaW5nXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYSBTdHJpbmcsIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc1N0cmluZyh2YWwpIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWwgPT09ICdzdHJpbmcnO1xufVxuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGEgTnVtYmVyXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYSBOdW1iZXIsIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc051bWJlcih2YWwpIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWwgPT09ICdudW1iZXInO1xufVxuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGFuIE9iamVjdFxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGFuIE9iamVjdCwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzT2JqZWN0KHZhbCkge1xuICByZXR1cm4gdmFsICE9PSBudWxsICYmIHR5cGVvZiB2YWwgPT09ICdvYmplY3QnO1xufVxuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGEgcGxhaW4gT2JqZWN0XG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybiB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIHBsYWluIE9iamVjdCwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzUGxhaW5PYmplY3QodmFsKSB7XG4gIGlmICh0b1N0cmluZy5jYWxsKHZhbCkgIT09ICdbb2JqZWN0IE9iamVjdF0nKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgdmFyIHByb3RvdHlwZSA9IE9iamVjdC5nZXRQcm90b3R5cGVPZih2YWwpO1xuICByZXR1cm4gcHJvdG90eXBlID09PSBudWxsIHx8IHByb3RvdHlwZSA9PT0gT2JqZWN0LnByb3RvdHlwZTtcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIERhdGVcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIERhdGUsIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0RhdGUodmFsKSB7XG4gIHJldHVybiB0b1N0cmluZy5jYWxsKHZhbCkgPT09ICdbb2JqZWN0IERhdGVdJztcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIEZpbGVcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIEZpbGUsIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0ZpbGUodmFsKSB7XG4gIHJldHVybiB0b1N0cmluZy5jYWxsKHZhbCkgPT09ICdbb2JqZWN0IEZpbGVdJztcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIEJsb2JcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIEJsb2IsIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0Jsb2IodmFsKSB7XG4gIHJldHVybiB0b1N0cmluZy5jYWxsKHZhbCkgPT09ICdbb2JqZWN0IEJsb2JdJztcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIEZ1bmN0aW9uXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYSBGdW5jdGlvbiwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzRnVuY3Rpb24odmFsKSB7XG4gIHJldHVybiB0b1N0cmluZy5jYWxsKHZhbCkgPT09ICdbb2JqZWN0IEZ1bmN0aW9uXSc7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSBTdHJlYW1cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIFN0cmVhbSwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzU3RyZWFtKHZhbCkge1xuICByZXR1cm4gaXNPYmplY3QodmFsKSAmJiBpc0Z1bmN0aW9uKHZhbC5waXBlKTtcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIFVSTFNlYXJjaFBhcmFtcyBvYmplY3RcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIFVSTFNlYXJjaFBhcmFtcyBvYmplY3QsIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc1VSTFNlYXJjaFBhcmFtcyh2YWwpIHtcbiAgcmV0dXJuIHRvU3RyaW5nLmNhbGwodmFsKSA9PT0gJ1tvYmplY3QgVVJMU2VhcmNoUGFyYW1zXSc7XG59XG5cbi8qKlxuICogVHJpbSBleGNlc3Mgd2hpdGVzcGFjZSBvZmYgdGhlIGJlZ2lubmluZyBhbmQgZW5kIG9mIGEgc3RyaW5nXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHN0ciBUaGUgU3RyaW5nIHRvIHRyaW1cbiAqIEByZXR1cm5zIHtTdHJpbmd9IFRoZSBTdHJpbmcgZnJlZWQgb2YgZXhjZXNzIHdoaXRlc3BhY2VcbiAqL1xuZnVuY3Rpb24gdHJpbShzdHIpIHtcbiAgcmV0dXJuIHN0ci50cmltID8gc3RyLnRyaW0oKSA6IHN0ci5yZXBsYWNlKC9eXFxzK3xcXHMrJC9nLCAnJyk7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIHdlJ3JlIHJ1bm5pbmcgaW4gYSBzdGFuZGFyZCBicm93c2VyIGVudmlyb25tZW50XG4gKlxuICogVGhpcyBhbGxvd3MgYXhpb3MgdG8gcnVuIGluIGEgd2ViIHdvcmtlciwgYW5kIHJlYWN0LW5hdGl2ZS5cbiAqIEJvdGggZW52aXJvbm1lbnRzIHN1cHBvcnQgWE1MSHR0cFJlcXVlc3QsIGJ1dCBub3QgZnVsbHkgc3RhbmRhcmQgZ2xvYmFscy5cbiAqXG4gKiB3ZWIgd29ya2VyczpcbiAqICB0eXBlb2Ygd2luZG93IC0+IHVuZGVmaW5lZFxuICogIHR5cGVvZiBkb2N1bWVudCAtPiB1bmRlZmluZWRcbiAqXG4gKiByZWFjdC1uYXRpdmU6XG4gKiAgbmF2aWdhdG9yLnByb2R1Y3QgLT4gJ1JlYWN0TmF0aXZlJ1xuICogbmF0aXZlc2NyaXB0XG4gKiAgbmF2aWdhdG9yLnByb2R1Y3QgLT4gJ05hdGl2ZVNjcmlwdCcgb3IgJ05TJ1xuICovXG5mdW5jdGlvbiBpc1N0YW5kYXJkQnJvd3NlckVudigpIHtcbiAgaWYgKHR5cGVvZiBuYXZpZ2F0b3IgIT09ICd1bmRlZmluZWQnICYmIChuYXZpZ2F0b3IucHJvZHVjdCA9PT0gJ1JlYWN0TmF0aXZlJyB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hdmlnYXRvci5wcm9kdWN0ID09PSAnTmF0aXZlU2NyaXB0JyB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hdmlnYXRvci5wcm9kdWN0ID09PSAnTlMnKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICByZXR1cm4gKFxuICAgIHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmXG4gICAgdHlwZW9mIGRvY3VtZW50ICE9PSAndW5kZWZpbmVkJ1xuICApO1xufVxuXG4vKipcbiAqIEl0ZXJhdGUgb3ZlciBhbiBBcnJheSBvciBhbiBPYmplY3QgaW52b2tpbmcgYSBmdW5jdGlvbiBmb3IgZWFjaCBpdGVtLlxuICpcbiAqIElmIGBvYmpgIGlzIGFuIEFycmF5IGNhbGxiYWNrIHdpbGwgYmUgY2FsbGVkIHBhc3NpbmdcbiAqIHRoZSB2YWx1ZSwgaW5kZXgsIGFuZCBjb21wbGV0ZSBhcnJheSBmb3IgZWFjaCBpdGVtLlxuICpcbiAqIElmICdvYmonIGlzIGFuIE9iamVjdCBjYWxsYmFjayB3aWxsIGJlIGNhbGxlZCBwYXNzaW5nXG4gKiB0aGUgdmFsdWUsIGtleSwgYW5kIGNvbXBsZXRlIG9iamVjdCBmb3IgZWFjaCBwcm9wZXJ0eS5cbiAqXG4gKiBAcGFyYW0ge09iamVjdHxBcnJheX0gb2JqIFRoZSBvYmplY3QgdG8gaXRlcmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gVGhlIGNhbGxiYWNrIHRvIGludm9rZSBmb3IgZWFjaCBpdGVtXG4gKi9cbmZ1bmN0aW9uIGZvckVhY2gob2JqLCBmbikge1xuICAvLyBEb24ndCBib3RoZXIgaWYgbm8gdmFsdWUgcHJvdmlkZWRcbiAgaWYgKG9iaiA9PT0gbnVsbCB8fCB0eXBlb2Ygb2JqID09PSAndW5kZWZpbmVkJykge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIC8vIEZvcmNlIGFuIGFycmF5IGlmIG5vdCBhbHJlYWR5IHNvbWV0aGluZyBpdGVyYWJsZVxuICBpZiAodHlwZW9mIG9iaiAhPT0gJ29iamVjdCcpIHtcbiAgICAvKmVzbGludCBuby1wYXJhbS1yZWFzc2lnbjowKi9cbiAgICBvYmogPSBbb2JqXTtcbiAgfVxuXG4gIGlmIChpc0FycmF5KG9iaikpIHtcbiAgICAvLyBJdGVyYXRlIG92ZXIgYXJyYXkgdmFsdWVzXG4gICAgZm9yICh2YXIgaSA9IDAsIGwgPSBvYmoubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICBmbi5jYWxsKG51bGwsIG9ialtpXSwgaSwgb2JqKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgLy8gSXRlcmF0ZSBvdmVyIG9iamVjdCBrZXlzXG4gICAgZm9yICh2YXIga2V5IGluIG9iaikge1xuICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIGtleSkpIHtcbiAgICAgICAgZm4uY2FsbChudWxsLCBvYmpba2V5XSwga2V5LCBvYmopO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIEFjY2VwdHMgdmFyYXJncyBleHBlY3RpbmcgZWFjaCBhcmd1bWVudCB0byBiZSBhbiBvYmplY3QsIHRoZW5cbiAqIGltbXV0YWJseSBtZXJnZXMgdGhlIHByb3BlcnRpZXMgb2YgZWFjaCBvYmplY3QgYW5kIHJldHVybnMgcmVzdWx0LlxuICpcbiAqIFdoZW4gbXVsdGlwbGUgb2JqZWN0cyBjb250YWluIHRoZSBzYW1lIGtleSB0aGUgbGF0ZXIgb2JqZWN0IGluXG4gKiB0aGUgYXJndW1lbnRzIGxpc3Qgd2lsbCB0YWtlIHByZWNlZGVuY2UuXG4gKlxuICogRXhhbXBsZTpcbiAqXG4gKiBgYGBqc1xuICogdmFyIHJlc3VsdCA9IG1lcmdlKHtmb286IDEyM30sIHtmb286IDQ1Nn0pO1xuICogY29uc29sZS5sb2cocmVzdWx0LmZvbyk7IC8vIG91dHB1dHMgNDU2XG4gKiBgYGBcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqMSBPYmplY3QgdG8gbWVyZ2VcbiAqIEByZXR1cm5zIHtPYmplY3R9IFJlc3VsdCBvZiBhbGwgbWVyZ2UgcHJvcGVydGllc1xuICovXG5mdW5jdGlvbiBtZXJnZSgvKiBvYmoxLCBvYmoyLCBvYmozLCAuLi4gKi8pIHtcbiAgdmFyIHJlc3VsdCA9IHt9O1xuICBmdW5jdGlvbiBhc3NpZ25WYWx1ZSh2YWwsIGtleSkge1xuICAgIGlmIChpc1BsYWluT2JqZWN0KHJlc3VsdFtrZXldKSAmJiBpc1BsYWluT2JqZWN0KHZhbCkpIHtcbiAgICAgIHJlc3VsdFtrZXldID0gbWVyZ2UocmVzdWx0W2tleV0sIHZhbCk7XG4gICAgfSBlbHNlIGlmIChpc1BsYWluT2JqZWN0KHZhbCkpIHtcbiAgICAgIHJlc3VsdFtrZXldID0gbWVyZ2Uoe30sIHZhbCk7XG4gICAgfSBlbHNlIGlmIChpc0FycmF5KHZhbCkpIHtcbiAgICAgIHJlc3VsdFtrZXldID0gdmFsLnNsaWNlKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlc3VsdFtrZXldID0gdmFsO1xuICAgIH1cbiAgfVxuXG4gIGZvciAodmFyIGkgPSAwLCBsID0gYXJndW1lbnRzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgIGZvckVhY2goYXJndW1lbnRzW2ldLCBhc3NpZ25WYWx1ZSk7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqXG4gKiBFeHRlbmRzIG9iamVjdCBhIGJ5IG11dGFibHkgYWRkaW5nIHRvIGl0IHRoZSBwcm9wZXJ0aWVzIG9mIG9iamVjdCBiLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBhIFRoZSBvYmplY3QgdG8gYmUgZXh0ZW5kZWRcbiAqIEBwYXJhbSB7T2JqZWN0fSBiIFRoZSBvYmplY3QgdG8gY29weSBwcm9wZXJ0aWVzIGZyb21cbiAqIEBwYXJhbSB7T2JqZWN0fSB0aGlzQXJnIFRoZSBvYmplY3QgdG8gYmluZCBmdW5jdGlvbiB0b1xuICogQHJldHVybiB7T2JqZWN0fSBUaGUgcmVzdWx0aW5nIHZhbHVlIG9mIG9iamVjdCBhXG4gKi9cbmZ1bmN0aW9uIGV4dGVuZChhLCBiLCB0aGlzQXJnKSB7XG4gIGZvckVhY2goYiwgZnVuY3Rpb24gYXNzaWduVmFsdWUodmFsLCBrZXkpIHtcbiAgICBpZiAodGhpc0FyZyAmJiB0eXBlb2YgdmFsID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBhW2tleV0gPSBiaW5kKHZhbCwgdGhpc0FyZyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGFba2V5XSA9IHZhbDtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gYTtcbn1cblxuLyoqXG4gKiBSZW1vdmUgYnl0ZSBvcmRlciBtYXJrZXIuIFRoaXMgY2F0Y2hlcyBFRiBCQiBCRiAodGhlIFVURi04IEJPTSlcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gY29udGVudCB3aXRoIEJPTVxuICogQHJldHVybiB7c3RyaW5nfSBjb250ZW50IHZhbHVlIHdpdGhvdXQgQk9NXG4gKi9cbmZ1bmN0aW9uIHN0cmlwQk9NKGNvbnRlbnQpIHtcbiAgaWYgKGNvbnRlbnQuY2hhckNvZGVBdCgwKSA9PT0gMHhGRUZGKSB7XG4gICAgY29udGVudCA9IGNvbnRlbnQuc2xpY2UoMSk7XG4gIH1cbiAgcmV0dXJuIGNvbnRlbnQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBpc0FycmF5OiBpc0FycmF5LFxuICBpc0FycmF5QnVmZmVyOiBpc0FycmF5QnVmZmVyLFxuICBpc0J1ZmZlcjogaXNCdWZmZXIsXG4gIGlzRm9ybURhdGE6IGlzRm9ybURhdGEsXG4gIGlzQXJyYXlCdWZmZXJWaWV3OiBpc0FycmF5QnVmZmVyVmlldyxcbiAgaXNTdHJpbmc6IGlzU3RyaW5nLFxuICBpc051bWJlcjogaXNOdW1iZXIsXG4gIGlzT2JqZWN0OiBpc09iamVjdCxcbiAgaXNQbGFpbk9iamVjdDogaXNQbGFpbk9iamVjdCxcbiAgaXNVbmRlZmluZWQ6IGlzVW5kZWZpbmVkLFxuICBpc0RhdGU6IGlzRGF0ZSxcbiAgaXNGaWxlOiBpc0ZpbGUsXG4gIGlzQmxvYjogaXNCbG9iLFxuICBpc0Z1bmN0aW9uOiBpc0Z1bmN0aW9uLFxuICBpc1N0cmVhbTogaXNTdHJlYW0sXG4gIGlzVVJMU2VhcmNoUGFyYW1zOiBpc1VSTFNlYXJjaFBhcmFtcyxcbiAgaXNTdGFuZGFyZEJyb3dzZXJFbnY6IGlzU3RhbmRhcmRCcm93c2VyRW52LFxuICBmb3JFYWNoOiBmb3JFYWNoLFxuICBtZXJnZTogbWVyZ2UsXG4gIGV4dGVuZDogZXh0ZW5kLFxuICB0cmltOiB0cmltLFxuICBzdHJpcEJPTTogc3RyaXBCT01cbn07XG4iLCIvKiBhcnJvd0ZuLmpzICovXG5cbmV4cG9ydCBjb25zdCBhcnJvdyA9ICgpID0+IHtcbiAgcmV0dXJuICdhcnJvdyBmdW5jdGlvbiBleGFtcGxlJztcbn0iLCIvLyBtb3VzZS5qc1xuZXhwb3J0IGxldCBtb3VzZSA9ICdKZXJyeSc7IiwicmVxdWlyZSgnLi4vLi4vbW9kdWxlcy9lcy5mdW5jdGlvbi5iaW5kJyk7XG5yZXF1aXJlKCcuLi8uLi9tb2R1bGVzL2VzLmZ1bmN0aW9uLm5hbWUnKTtcbnJlcXVpcmUoJy4uLy4uL21vZHVsZXMvZXMuZnVuY3Rpb24uaGFzLWluc3RhbmNlJyk7XG52YXIgcGF0aCA9IHJlcXVpcmUoJy4uLy4uL2ludGVybmFscy9wYXRoJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gcGF0aC5GdW5jdGlvbjtcbiIsInZhciBnbG9iYWwgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZ2xvYmFsJyk7XG52YXIgaXNDYWxsYWJsZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9pcy1jYWxsYWJsZScpO1xudmFyIHRyeVRvU3RyaW5nID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3RyeS10by1zdHJpbmcnKTtcblxudmFyIFR5cGVFcnJvciA9IGdsb2JhbC5UeXBlRXJyb3I7XG5cbi8vIGBBc3NlcnQ6IElzQ2FsbGFibGUoYXJndW1lbnQpIGlzIHRydWVgXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChhcmd1bWVudCkge1xuICBpZiAoaXNDYWxsYWJsZShhcmd1bWVudCkpIHJldHVybiBhcmd1bWVudDtcbiAgdGhyb3cgVHlwZUVycm9yKHRyeVRvU3RyaW5nKGFyZ3VtZW50KSArICcgaXMgbm90IGEgZnVuY3Rpb24nKTtcbn07XG4iLCJ2YXIgZ2xvYmFsID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2dsb2JhbCcpO1xudmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2lzLW9iamVjdCcpO1xuXG52YXIgU3RyaW5nID0gZ2xvYmFsLlN0cmluZztcbnZhciBUeXBlRXJyb3IgPSBnbG9iYWwuVHlwZUVycm9yO1xuXG4vLyBgQXNzZXJ0OiBUeXBlKGFyZ3VtZW50KSBpcyBPYmplY3RgXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChhcmd1bWVudCkge1xuICBpZiAoaXNPYmplY3QoYXJndW1lbnQpKSByZXR1cm4gYXJndW1lbnQ7XG4gIHRocm93IFR5cGVFcnJvcihTdHJpbmcoYXJndW1lbnQpICsgJyBpcyBub3QgYW4gb2JqZWN0Jyk7XG59O1xuIiwidmFyIHRvSW5kZXhlZE9iamVjdCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy90by1pbmRleGVkLW9iamVjdCcpO1xudmFyIHRvQWJzb2x1dGVJbmRleCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy90by1hYnNvbHV0ZS1pbmRleCcpO1xudmFyIGxlbmd0aE9mQXJyYXlMaWtlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2xlbmd0aC1vZi1hcnJheS1saWtlJyk7XG5cbi8vIGBBcnJheS5wcm90b3R5cGUueyBpbmRleE9mLCBpbmNsdWRlcyB9YCBtZXRob2RzIGltcGxlbWVudGF0aW9uXG52YXIgY3JlYXRlTWV0aG9kID0gZnVuY3Rpb24gKElTX0lOQ0xVREVTKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoJHRoaXMsIGVsLCBmcm9tSW5kZXgpIHtcbiAgICB2YXIgTyA9IHRvSW5kZXhlZE9iamVjdCgkdGhpcyk7XG4gICAgdmFyIGxlbmd0aCA9IGxlbmd0aE9mQXJyYXlMaWtlKE8pO1xuICAgIHZhciBpbmRleCA9IHRvQWJzb2x1dGVJbmRleChmcm9tSW5kZXgsIGxlbmd0aCk7XG4gICAgdmFyIHZhbHVlO1xuICAgIC8vIEFycmF5I2luY2x1ZGVzIHVzZXMgU2FtZVZhbHVlWmVybyBlcXVhbGl0eSBhbGdvcml0aG1cbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tc2VsZi1jb21wYXJlIC0tIE5hTiBjaGVja1xuICAgIGlmIChJU19JTkNMVURFUyAmJiBlbCAhPSBlbCkgd2hpbGUgKGxlbmd0aCA+IGluZGV4KSB7XG4gICAgICB2YWx1ZSA9IE9baW5kZXgrK107XG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tc2VsZi1jb21wYXJlIC0tIE5hTiBjaGVja1xuICAgICAgaWYgKHZhbHVlICE9IHZhbHVlKSByZXR1cm4gdHJ1ZTtcbiAgICAvLyBBcnJheSNpbmRleE9mIGlnbm9yZXMgaG9sZXMsIEFycmF5I2luY2x1ZGVzIC0gbm90XG4gICAgfSBlbHNlIGZvciAoO2xlbmd0aCA+IGluZGV4OyBpbmRleCsrKSB7XG4gICAgICBpZiAoKElTX0lOQ0xVREVTIHx8IGluZGV4IGluIE8pICYmIE9baW5kZXhdID09PSBlbCkgcmV0dXJuIElTX0lOQ0xVREVTIHx8IGluZGV4IHx8IDA7XG4gICAgfSByZXR1cm4gIUlTX0lOQ0xVREVTICYmIC0xO1xuICB9O1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIC8vIGBBcnJheS5wcm90b3R5cGUuaW5jbHVkZXNgIG1ldGhvZFxuICAvLyBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLWFycmF5LnByb3RvdHlwZS5pbmNsdWRlc1xuICBpbmNsdWRlczogY3JlYXRlTWV0aG9kKHRydWUpLFxuICAvLyBgQXJyYXkucHJvdG90eXBlLmluZGV4T2ZgIG1ldGhvZFxuICAvLyBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLWFycmF5LnByb3RvdHlwZS5pbmRleG9mXG4gIGluZGV4T2Y6IGNyZWF0ZU1ldGhvZChmYWxzZSlcbn07XG4iLCJ2YXIgdW5jdXJyeVRoaXMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZnVuY3Rpb24tdW5jdXJyeS10aGlzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gdW5jdXJyeVRoaXMoW10uc2xpY2UpO1xuIiwidmFyIHVuY3VycnlUaGlzID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2Z1bmN0aW9uLXVuY3VycnktdGhpcycpO1xuXG52YXIgdG9TdHJpbmcgPSB1bmN1cnJ5VGhpcyh7fS50b1N0cmluZyk7XG52YXIgc3RyaW5nU2xpY2UgPSB1bmN1cnJ5VGhpcygnJy5zbGljZSk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiBzdHJpbmdTbGljZSh0b1N0cmluZyhpdCksIDgsIC0xKTtcbn07XG4iLCJ2YXIgaGFzT3duID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2hhcy1vd24tcHJvcGVydHknKTtcbnZhciBvd25LZXlzID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL293bi1rZXlzJyk7XG52YXIgZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yTW9kdWxlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL29iamVjdC1nZXQtb3duLXByb3BlcnR5LWRlc2NyaXB0b3InKTtcbnZhciBkZWZpbmVQcm9wZXJ0eU1vZHVsZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9vYmplY3QtZGVmaW5lLXByb3BlcnR5Jyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHRhcmdldCwgc291cmNlLCBleGNlcHRpb25zKSB7XG4gIHZhciBrZXlzID0gb3duS2V5cyhzb3VyY2UpO1xuICB2YXIgZGVmaW5lUHJvcGVydHkgPSBkZWZpbmVQcm9wZXJ0eU1vZHVsZS5mO1xuICB2YXIgZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yID0gZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yTW9kdWxlLmY7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwga2V5cy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBrZXkgPSBrZXlzW2ldO1xuICAgIGlmICghaGFzT3duKHRhcmdldCwga2V5KSAmJiAhKGV4Y2VwdGlvbnMgJiYgaGFzT3duKGV4Y2VwdGlvbnMsIGtleSkpKSB7XG4gICAgICBkZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwgZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHNvdXJjZSwga2V5KSk7XG4gICAgfVxuICB9XG59O1xuIiwidmFyIGZhaWxzID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2ZhaWxzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gIWZhaWxzKGZ1bmN0aW9uICgpIHtcbiAgZnVuY3Rpb24gRigpIHsgLyogZW1wdHkgKi8gfVxuICBGLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IG51bGw7XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBlcy9uby1vYmplY3QtZ2V0cHJvdG90eXBlb2YgLS0gcmVxdWlyZWQgZm9yIHRlc3RpbmdcbiAgcmV0dXJuIE9iamVjdC5nZXRQcm90b3R5cGVPZihuZXcgRigpKSAhPT0gRi5wcm90b3R5cGU7XG59KTtcbiIsInZhciBERVNDUklQVE9SUyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9kZXNjcmlwdG9ycycpO1xudmFyIGRlZmluZVByb3BlcnR5TW9kdWxlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL29iamVjdC1kZWZpbmUtcHJvcGVydHknKTtcbnZhciBjcmVhdGVQcm9wZXJ0eURlc2NyaXB0b3IgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvY3JlYXRlLXByb3BlcnR5LWRlc2NyaXB0b3InKTtcblxubW9kdWxlLmV4cG9ydHMgPSBERVNDUklQVE9SUyA/IGZ1bmN0aW9uIChvYmplY3QsIGtleSwgdmFsdWUpIHtcbiAgcmV0dXJuIGRlZmluZVByb3BlcnR5TW9kdWxlLmYob2JqZWN0LCBrZXksIGNyZWF0ZVByb3BlcnR5RGVzY3JpcHRvcigxLCB2YWx1ZSkpO1xufSA6IGZ1bmN0aW9uIChvYmplY3QsIGtleSwgdmFsdWUpIHtcbiAgb2JqZWN0W2tleV0gPSB2YWx1ZTtcbiAgcmV0dXJuIG9iamVjdDtcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChiaXRtYXAsIHZhbHVlKSB7XG4gIHJldHVybiB7XG4gICAgZW51bWVyYWJsZTogIShiaXRtYXAgJiAxKSxcbiAgICBjb25maWd1cmFibGU6ICEoYml0bWFwICYgMiksXG4gICAgd3JpdGFibGU6ICEoYml0bWFwICYgNCksXG4gICAgdmFsdWU6IHZhbHVlXG4gIH07XG59O1xuIiwidmFyIGZhaWxzID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2ZhaWxzJyk7XG5cbi8vIERldGVjdCBJRTgncyBpbmNvbXBsZXRlIGRlZmluZVByb3BlcnR5IGltcGxlbWVudGF0aW9uXG5tb2R1bGUuZXhwb3J0cyA9ICFmYWlscyhmdW5jdGlvbiAoKSB7XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBlcy9uby1vYmplY3QtZGVmaW5lcHJvcGVydHkgLS0gcmVxdWlyZWQgZm9yIHRlc3RpbmdcbiAgcmV0dXJuIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh7fSwgMSwgeyBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIDc7IH0gfSlbMV0gIT0gNztcbn0pO1xuIiwidmFyIGdsb2JhbCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9nbG9iYWwnKTtcbnZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9pcy1vYmplY3QnKTtcblxudmFyIGRvY3VtZW50ID0gZ2xvYmFsLmRvY3VtZW50O1xuLy8gdHlwZW9mIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQgaXMgJ29iamVjdCcgaW4gb2xkIElFXG52YXIgRVhJU1RTID0gaXNPYmplY3QoZG9jdW1lbnQpICYmIGlzT2JqZWN0KGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICByZXR1cm4gRVhJU1RTID8gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChpdCkgOiB7fTtcbn07XG4iLCJ2YXIgZ2V0QnVpbHRJbiA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9nZXQtYnVpbHQtaW4nKTtcblxubW9kdWxlLmV4cG9ydHMgPSBnZXRCdWlsdEluKCduYXZpZ2F0b3InLCAndXNlckFnZW50JykgfHwgJyc7XG4iLCJ2YXIgZ2xvYmFsID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2dsb2JhbCcpO1xudmFyIHVzZXJBZ2VudCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9lbmdpbmUtdXNlci1hZ2VudCcpO1xuXG52YXIgcHJvY2VzcyA9IGdsb2JhbC5wcm9jZXNzO1xudmFyIERlbm8gPSBnbG9iYWwuRGVubztcbnZhciB2ZXJzaW9ucyA9IHByb2Nlc3MgJiYgcHJvY2Vzcy52ZXJzaW9ucyB8fCBEZW5vICYmIERlbm8udmVyc2lvbjtcbnZhciB2OCA9IHZlcnNpb25zICYmIHZlcnNpb25zLnY4O1xudmFyIG1hdGNoLCB2ZXJzaW9uO1xuXG5pZiAodjgpIHtcbiAgbWF0Y2ggPSB2OC5zcGxpdCgnLicpO1xuICAvLyBpbiBvbGQgQ2hyb21lLCB2ZXJzaW9ucyBvZiBWOCBpc24ndCBWOCA9IENocm9tZSAvIDEwXG4gIC8vIGJ1dCB0aGVpciBjb3JyZWN0IHZlcnNpb25zIGFyZSBub3QgaW50ZXJlc3RpbmcgZm9yIHVzXG4gIHZlcnNpb24gPSBtYXRjaFswXSA+IDAgJiYgbWF0Y2hbMF0gPCA0ID8gMSA6ICsobWF0Y2hbMF0gKyBtYXRjaFsxXSk7XG59XG5cbi8vIEJyb3dzZXJGUyBOb2RlSlMgYHByb2Nlc3NgIHBvbHlmaWxsIGluY29ycmVjdGx5IHNldCBgLnY4YCB0byBgMC4wYFxuLy8gc28gY2hlY2sgYHVzZXJBZ2VudGAgZXZlbiBpZiBgLnY4YCBleGlzdHMsIGJ1dCAwXG5pZiAoIXZlcnNpb24gJiYgdXNlckFnZW50KSB7XG4gIG1hdGNoID0gdXNlckFnZW50Lm1hdGNoKC9FZGdlXFwvKFxcZCspLyk7XG4gIGlmICghbWF0Y2ggfHwgbWF0Y2hbMV0gPj0gNzQpIHtcbiAgICBtYXRjaCA9IHVzZXJBZ2VudC5tYXRjaCgvQ2hyb21lXFwvKFxcZCspLyk7XG4gICAgaWYgKG1hdGNoKSB2ZXJzaW9uID0gK21hdGNoWzFdO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gdmVyc2lvbjtcbiIsIi8vIElFOC0gZG9uJ3QgZW51bSBidWcga2V5c1xubW9kdWxlLmV4cG9ydHMgPSBbXG4gICdjb25zdHJ1Y3RvcicsXG4gICdoYXNPd25Qcm9wZXJ0eScsXG4gICdpc1Byb3RvdHlwZU9mJyxcbiAgJ3Byb3BlcnR5SXNFbnVtZXJhYmxlJyxcbiAgJ3RvTG9jYWxlU3RyaW5nJyxcbiAgJ3RvU3RyaW5nJyxcbiAgJ3ZhbHVlT2YnXG5dO1xuIiwidmFyIGdsb2JhbCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9nbG9iYWwnKTtcbnZhciBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvb2JqZWN0LWdldC1vd24tcHJvcGVydHktZGVzY3JpcHRvcicpLmY7XG52YXIgY3JlYXRlTm9uRW51bWVyYWJsZVByb3BlcnR5ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2NyZWF0ZS1ub24tZW51bWVyYWJsZS1wcm9wZXJ0eScpO1xudmFyIHJlZGVmaW5lID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3JlZGVmaW5lJyk7XG52YXIgc2V0R2xvYmFsID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3NldC1nbG9iYWwnKTtcbnZhciBjb3B5Q29uc3RydWN0b3JQcm9wZXJ0aWVzID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2NvcHktY29uc3RydWN0b3ItcHJvcGVydGllcycpO1xudmFyIGlzRm9yY2VkID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2lzLWZvcmNlZCcpO1xuXG4vKlxuICBvcHRpb25zLnRhcmdldCAgICAgIC0gbmFtZSBvZiB0aGUgdGFyZ2V0IG9iamVjdFxuICBvcHRpb25zLmdsb2JhbCAgICAgIC0gdGFyZ2V0IGlzIHRoZSBnbG9iYWwgb2JqZWN0XG4gIG9wdGlvbnMuc3RhdCAgICAgICAgLSBleHBvcnQgYXMgc3RhdGljIG1ldGhvZHMgb2YgdGFyZ2V0XG4gIG9wdGlvbnMucHJvdG8gICAgICAgLSBleHBvcnQgYXMgcHJvdG90eXBlIG1ldGhvZHMgb2YgdGFyZ2V0XG4gIG9wdGlvbnMucmVhbCAgICAgICAgLSByZWFsIHByb3RvdHlwZSBtZXRob2QgZm9yIHRoZSBgcHVyZWAgdmVyc2lvblxuICBvcHRpb25zLmZvcmNlZCAgICAgIC0gZXhwb3J0IGV2ZW4gaWYgdGhlIG5hdGl2ZSBmZWF0dXJlIGlzIGF2YWlsYWJsZVxuICBvcHRpb25zLmJpbmQgICAgICAgIC0gYmluZCBtZXRob2RzIHRvIHRoZSB0YXJnZXQsIHJlcXVpcmVkIGZvciB0aGUgYHB1cmVgIHZlcnNpb25cbiAgb3B0aW9ucy53cmFwICAgICAgICAtIHdyYXAgY29uc3RydWN0b3JzIHRvIHByZXZlbnRpbmcgZ2xvYmFsIHBvbGx1dGlvbiwgcmVxdWlyZWQgZm9yIHRoZSBgcHVyZWAgdmVyc2lvblxuICBvcHRpb25zLnVuc2FmZSAgICAgIC0gdXNlIHRoZSBzaW1wbGUgYXNzaWdubWVudCBvZiBwcm9wZXJ0eSBpbnN0ZWFkIG9mIGRlbGV0ZSArIGRlZmluZVByb3BlcnR5XG4gIG9wdGlvbnMuc2hhbSAgICAgICAgLSBhZGQgYSBmbGFnIHRvIG5vdCBjb21wbGV0ZWx5IGZ1bGwgcG9seWZpbGxzXG4gIG9wdGlvbnMuZW51bWVyYWJsZSAgLSBleHBvcnQgYXMgZW51bWVyYWJsZSBwcm9wZXJ0eVxuICBvcHRpb25zLm5vVGFyZ2V0R2V0IC0gcHJldmVudCBjYWxsaW5nIGEgZ2V0dGVyIG9uIHRhcmdldFxuICBvcHRpb25zLm5hbWUgICAgICAgIC0gdGhlIC5uYW1lIG9mIHRoZSBmdW5jdGlvbiBpZiBpdCBkb2VzIG5vdCBtYXRjaCB0aGUga2V5XG4qL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAob3B0aW9ucywgc291cmNlKSB7XG4gIHZhciBUQVJHRVQgPSBvcHRpb25zLnRhcmdldDtcbiAgdmFyIEdMT0JBTCA9IG9wdGlvbnMuZ2xvYmFsO1xuICB2YXIgU1RBVElDID0gb3B0aW9ucy5zdGF0O1xuICB2YXIgRk9SQ0VELCB0YXJnZXQsIGtleSwgdGFyZ2V0UHJvcGVydHksIHNvdXJjZVByb3BlcnR5LCBkZXNjcmlwdG9yO1xuICBpZiAoR0xPQkFMKSB7XG4gICAgdGFyZ2V0ID0gZ2xvYmFsO1xuICB9IGVsc2UgaWYgKFNUQVRJQykge1xuICAgIHRhcmdldCA9IGdsb2JhbFtUQVJHRVRdIHx8IHNldEdsb2JhbChUQVJHRVQsIHt9KTtcbiAgfSBlbHNlIHtcbiAgICB0YXJnZXQgPSAoZ2xvYmFsW1RBUkdFVF0gfHwge30pLnByb3RvdHlwZTtcbiAgfVxuICBpZiAodGFyZ2V0KSBmb3IgKGtleSBpbiBzb3VyY2UpIHtcbiAgICBzb3VyY2VQcm9wZXJ0eSA9IHNvdXJjZVtrZXldO1xuICAgIGlmIChvcHRpb25zLm5vVGFyZ2V0R2V0KSB7XG4gICAgICBkZXNjcmlwdG9yID0gZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwga2V5KTtcbiAgICAgIHRhcmdldFByb3BlcnR5ID0gZGVzY3JpcHRvciAmJiBkZXNjcmlwdG9yLnZhbHVlO1xuICAgIH0gZWxzZSB0YXJnZXRQcm9wZXJ0eSA9IHRhcmdldFtrZXldO1xuICAgIEZPUkNFRCA9IGlzRm9yY2VkKEdMT0JBTCA/IGtleSA6IFRBUkdFVCArIChTVEFUSUMgPyAnLicgOiAnIycpICsga2V5LCBvcHRpb25zLmZvcmNlZCk7XG4gICAgLy8gY29udGFpbmVkIGluIHRhcmdldFxuICAgIGlmICghRk9SQ0VEICYmIHRhcmdldFByb3BlcnR5ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGlmICh0eXBlb2Ygc291cmNlUHJvcGVydHkgPT0gdHlwZW9mIHRhcmdldFByb3BlcnR5KSBjb250aW51ZTtcbiAgICAgIGNvcHlDb25zdHJ1Y3RvclByb3BlcnRpZXMoc291cmNlUHJvcGVydHksIHRhcmdldFByb3BlcnR5KTtcbiAgICB9XG4gICAgLy8gYWRkIGEgZmxhZyB0byBub3QgY29tcGxldGVseSBmdWxsIHBvbHlmaWxsc1xuICAgIGlmIChvcHRpb25zLnNoYW0gfHwgKHRhcmdldFByb3BlcnR5ICYmIHRhcmdldFByb3BlcnR5LnNoYW0pKSB7XG4gICAgICBjcmVhdGVOb25FbnVtZXJhYmxlUHJvcGVydHkoc291cmNlUHJvcGVydHksICdzaGFtJywgdHJ1ZSk7XG4gICAgfVxuICAgIC8vIGV4dGVuZCBnbG9iYWxcbiAgICByZWRlZmluZSh0YXJnZXQsIGtleSwgc291cmNlUHJvcGVydHksIG9wdGlvbnMpO1xuICB9XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoZXhlYykge1xuICB0cnkge1xuICAgIHJldHVybiAhIWV4ZWMoKTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxufTtcbiIsInZhciBmYWlscyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9mYWlscycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9ICFmYWlscyhmdW5jdGlvbiAoKSB7XG4gIHZhciB0ZXN0ID0gKGZ1bmN0aW9uICgpIHsgLyogZW1wdHkgKi8gfSkuYmluZCgpO1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tcHJvdG90eXBlLWJ1aWx0aW5zIC0tIHNhZmVcbiAgcmV0dXJuIHR5cGVvZiB0ZXN0ICE9ICdmdW5jdGlvbicgfHwgdGVzdC5oYXNPd25Qcm9wZXJ0eSgncHJvdG90eXBlJyk7XG59KTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBnbG9iYWwgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZ2xvYmFsJyk7XG52YXIgdW5jdXJyeVRoaXMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZnVuY3Rpb24tdW5jdXJyeS10aGlzJyk7XG52YXIgYUNhbGxhYmxlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2EtY2FsbGFibGUnKTtcbnZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9pcy1vYmplY3QnKTtcbnZhciBoYXNPd24gPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaGFzLW93bi1wcm9wZXJ0eScpO1xudmFyIGFycmF5U2xpY2UgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvYXJyYXktc2xpY2UnKTtcbnZhciBOQVRJVkVfQklORCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9mdW5jdGlvbi1iaW5kLW5hdGl2ZScpO1xuXG52YXIgRnVuY3Rpb24gPSBnbG9iYWwuRnVuY3Rpb247XG52YXIgY29uY2F0ID0gdW5jdXJyeVRoaXMoW10uY29uY2F0KTtcbnZhciBqb2luID0gdW5jdXJyeVRoaXMoW10uam9pbik7XG52YXIgZmFjdG9yaWVzID0ge307XG5cbnZhciBjb25zdHJ1Y3QgPSBmdW5jdGlvbiAoQywgYXJnc0xlbmd0aCwgYXJncykge1xuICBpZiAoIWhhc093bihmYWN0b3JpZXMsIGFyZ3NMZW5ndGgpKSB7XG4gICAgZm9yICh2YXIgbGlzdCA9IFtdLCBpID0gMDsgaSA8IGFyZ3NMZW5ndGg7IGkrKykgbGlzdFtpXSA9ICdhWycgKyBpICsgJ10nO1xuICAgIGZhY3Rvcmllc1thcmdzTGVuZ3RoXSA9IEZ1bmN0aW9uKCdDLGEnLCAncmV0dXJuIG5ldyBDKCcgKyBqb2luKGxpc3QsICcsJykgKyAnKScpO1xuICB9IHJldHVybiBmYWN0b3JpZXNbYXJnc0xlbmd0aF0oQywgYXJncyk7XG59O1xuXG4vLyBgRnVuY3Rpb24ucHJvdG90eXBlLmJpbmRgIG1ldGhvZCBpbXBsZW1lbnRhdGlvblxuLy8gaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy1mdW5jdGlvbi5wcm90b3R5cGUuYmluZFxubW9kdWxlLmV4cG9ydHMgPSBOQVRJVkVfQklORCA/IEZ1bmN0aW9uLmJpbmQgOiBmdW5jdGlvbiBiaW5kKHRoYXQgLyogLCAuLi5hcmdzICovKSB7XG4gIHZhciBGID0gYUNhbGxhYmxlKHRoaXMpO1xuICB2YXIgUHJvdG90eXBlID0gRi5wcm90b3R5cGU7XG4gIHZhciBwYXJ0QXJncyA9IGFycmF5U2xpY2UoYXJndW1lbnRzLCAxKTtcbiAgdmFyIGJvdW5kRnVuY3Rpb24gPSBmdW5jdGlvbiBib3VuZCgvKiBhcmdzLi4uICovKSB7XG4gICAgdmFyIGFyZ3MgPSBjb25jYXQocGFydEFyZ3MsIGFycmF5U2xpY2UoYXJndW1lbnRzKSk7XG4gICAgcmV0dXJuIHRoaXMgaW5zdGFuY2VvZiBib3VuZEZ1bmN0aW9uID8gY29uc3RydWN0KEYsIGFyZ3MubGVuZ3RoLCBhcmdzKSA6IEYuYXBwbHkodGhhdCwgYXJncyk7XG4gIH07XG4gIGlmIChpc09iamVjdChQcm90b3R5cGUpKSBib3VuZEZ1bmN0aW9uLnByb3RvdHlwZSA9IFByb3RvdHlwZTtcbiAgcmV0dXJuIGJvdW5kRnVuY3Rpb247XG59O1xuIiwidmFyIE5BVElWRV9CSU5EID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2Z1bmN0aW9uLWJpbmQtbmF0aXZlJyk7XG5cbnZhciBjYWxsID0gRnVuY3Rpb24ucHJvdG90eXBlLmNhbGw7XG5cbm1vZHVsZS5leHBvcnRzID0gTkFUSVZFX0JJTkQgPyBjYWxsLmJpbmQoY2FsbCkgOiBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiBjYWxsLmFwcGx5KGNhbGwsIGFyZ3VtZW50cyk7XG59O1xuIiwidmFyIERFU0NSSVBUT1JTID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2Rlc2NyaXB0b3JzJyk7XG52YXIgaGFzT3duID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2hhcy1vd24tcHJvcGVydHknKTtcblxudmFyIEZ1bmN0aW9uUHJvdG90eXBlID0gRnVuY3Rpb24ucHJvdG90eXBlO1xuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGVzL25vLW9iamVjdC1nZXRvd25wcm9wZXJ0eWRlc2NyaXB0b3IgLS0gc2FmZVxudmFyIGdldERlc2NyaXB0b3IgPSBERVNDUklQVE9SUyAmJiBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yO1xuXG52YXIgRVhJU1RTID0gaGFzT3duKEZ1bmN0aW9uUHJvdG90eXBlLCAnbmFtZScpO1xuLy8gYWRkaXRpb25hbCBwcm90ZWN0aW9uIGZyb20gbWluaWZpZWQgLyBtYW5nbGVkIC8gZHJvcHBlZCBmdW5jdGlvbiBuYW1lc1xudmFyIFBST1BFUiA9IEVYSVNUUyAmJiAoZnVuY3Rpb24gc29tZXRoaW5nKCkgeyAvKiBlbXB0eSAqLyB9KS5uYW1lID09PSAnc29tZXRoaW5nJztcbnZhciBDT05GSUdVUkFCTEUgPSBFWElTVFMgJiYgKCFERVNDUklQVE9SUyB8fCAoREVTQ1JJUFRPUlMgJiYgZ2V0RGVzY3JpcHRvcihGdW5jdGlvblByb3RvdHlwZSwgJ25hbWUnKS5jb25maWd1cmFibGUpKTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIEVYSVNUUzogRVhJU1RTLFxuICBQUk9QRVI6IFBST1BFUixcbiAgQ09ORklHVVJBQkxFOiBDT05GSUdVUkFCTEVcbn07XG4iLCJ2YXIgTkFUSVZFX0JJTkQgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZnVuY3Rpb24tYmluZC1uYXRpdmUnKTtcblxudmFyIEZ1bmN0aW9uUHJvdG90eXBlID0gRnVuY3Rpb24ucHJvdG90eXBlO1xudmFyIGJpbmQgPSBGdW5jdGlvblByb3RvdHlwZS5iaW5kO1xudmFyIGNhbGwgPSBGdW5jdGlvblByb3RvdHlwZS5jYWxsO1xudmFyIHVuY3VycnlUaGlzID0gTkFUSVZFX0JJTkQgJiYgYmluZC5iaW5kKGNhbGwsIGNhbGwpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IE5BVElWRV9CSU5EID8gZnVuY3Rpb24gKGZuKSB7XG4gIHJldHVybiBmbiAmJiB1bmN1cnJ5VGhpcyhmbik7XG59IDogZnVuY3Rpb24gKGZuKSB7XG4gIHJldHVybiBmbiAmJiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIGNhbGwuYXBwbHkoZm4sIGFyZ3VtZW50cyk7XG4gIH07XG59O1xuIiwidmFyIGdsb2JhbCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9nbG9iYWwnKTtcbnZhciBpc0NhbGxhYmxlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2lzLWNhbGxhYmxlJyk7XG5cbnZhciBhRnVuY3Rpb24gPSBmdW5jdGlvbiAoYXJndW1lbnQpIHtcbiAgcmV0dXJuIGlzQ2FsbGFibGUoYXJndW1lbnQpID8gYXJndW1lbnQgOiB1bmRlZmluZWQ7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChuYW1lc3BhY2UsIG1ldGhvZCkge1xuICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA8IDIgPyBhRnVuY3Rpb24oZ2xvYmFsW25hbWVzcGFjZV0pIDogZ2xvYmFsW25hbWVzcGFjZV0gJiYgZ2xvYmFsW25hbWVzcGFjZV1bbWV0aG9kXTtcbn07XG4iLCJ2YXIgYUNhbGxhYmxlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2EtY2FsbGFibGUnKTtcblxuLy8gYEdldE1ldGhvZGAgYWJzdHJhY3Qgb3BlcmF0aW9uXG4vLyBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLWdldG1ldGhvZFxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoViwgUCkge1xuICB2YXIgZnVuYyA9IFZbUF07XG4gIHJldHVybiBmdW5jID09IG51bGwgPyB1bmRlZmluZWQgOiBhQ2FsbGFibGUoZnVuYyk7XG59O1xuIiwidmFyIGNoZWNrID0gZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiBpdCAmJiBpdC5NYXRoID09IE1hdGggJiYgaXQ7XG59O1xuXG4vLyBodHRwczovL2dpdGh1Yi5jb20vemxvaXJvY2svY29yZS1qcy9pc3N1ZXMvODYjaXNzdWVjb21tZW50LTExNTc1OTAyOFxubW9kdWxlLmV4cG9ydHMgPVxuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZXMvbm8tZ2xvYmFsLXRoaXMgLS0gc2FmZVxuICBjaGVjayh0eXBlb2YgZ2xvYmFsVGhpcyA9PSAnb2JqZWN0JyAmJiBnbG9iYWxUaGlzKSB8fFxuICBjaGVjayh0eXBlb2Ygd2luZG93ID09ICdvYmplY3QnICYmIHdpbmRvdykgfHxcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXJlc3RyaWN0ZWQtZ2xvYmFscyAtLSBzYWZlXG4gIGNoZWNrKHR5cGVvZiBzZWxmID09ICdvYmplY3QnICYmIHNlbGYpIHx8XG4gIGNoZWNrKHR5cGVvZiBnbG9iYWwgPT0gJ29iamVjdCcgJiYgZ2xvYmFsKSB8fFxuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tbmV3LWZ1bmMgLS0gZmFsbGJhY2tcbiAgKGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0pKCkgfHwgRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKTtcbiIsInZhciB1bmN1cnJ5VGhpcyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9mdW5jdGlvbi11bmN1cnJ5LXRoaXMnKTtcbnZhciB0b09iamVjdCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy90by1vYmplY3QnKTtcblxudmFyIGhhc093blByb3BlcnR5ID0gdW5jdXJyeVRoaXMoe30uaGFzT3duUHJvcGVydHkpO1xuXG4vLyBgSGFzT3duUHJvcGVydHlgIGFic3RyYWN0IG9wZXJhdGlvblxuLy8gaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy1oYXNvd25wcm9wZXJ0eVxubW9kdWxlLmV4cG9ydHMgPSBPYmplY3QuaGFzT3duIHx8IGZ1bmN0aW9uIGhhc093bihpdCwga2V5KSB7XG4gIHJldHVybiBoYXNPd25Qcm9wZXJ0eSh0b09iamVjdChpdCksIGtleSk7XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSB7fTtcbiIsInZhciBERVNDUklQVE9SUyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9kZXNjcmlwdG9ycycpO1xudmFyIGZhaWxzID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2ZhaWxzJyk7XG52YXIgY3JlYXRlRWxlbWVudCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9kb2N1bWVudC1jcmVhdGUtZWxlbWVudCcpO1xuXG4vLyBUaGFua3MgdG8gSUU4IGZvciBpdHMgZnVubnkgZGVmaW5lUHJvcGVydHlcbm1vZHVsZS5leHBvcnRzID0gIURFU0NSSVBUT1JTICYmICFmYWlscyhmdW5jdGlvbiAoKSB7XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBlcy9uby1vYmplY3QtZGVmaW5lcHJvcGVydHkgLS0gcmVxdWlyZWQgZm9yIHRlc3RpbmdcbiAgcmV0dXJuIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShjcmVhdGVFbGVtZW50KCdkaXYnKSwgJ2EnLCB7XG4gICAgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiA3OyB9XG4gIH0pLmEgIT0gNztcbn0pO1xuIiwidmFyIGdsb2JhbCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9nbG9iYWwnKTtcbnZhciB1bmN1cnJ5VGhpcyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9mdW5jdGlvbi11bmN1cnJ5LXRoaXMnKTtcbnZhciBmYWlscyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9mYWlscycpO1xudmFyIGNsYXNzb2YgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvY2xhc3NvZi1yYXcnKTtcblxudmFyIE9iamVjdCA9IGdsb2JhbC5PYmplY3Q7XG52YXIgc3BsaXQgPSB1bmN1cnJ5VGhpcygnJy5zcGxpdCk7XG5cbi8vIGZhbGxiYWNrIGZvciBub24tYXJyYXktbGlrZSBFUzMgYW5kIG5vbi1lbnVtZXJhYmxlIG9sZCBWOCBzdHJpbmdzXG5tb2R1bGUuZXhwb3J0cyA9IGZhaWxzKGZ1bmN0aW9uICgpIHtcbiAgLy8gdGhyb3dzIGFuIGVycm9yIGluIHJoaW5vLCBzZWUgaHR0cHM6Ly9naXRodWIuY29tL21vemlsbGEvcmhpbm8vaXNzdWVzLzM0NlxuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tcHJvdG90eXBlLWJ1aWx0aW5zIC0tIHNhZmVcbiAgcmV0dXJuICFPYmplY3QoJ3onKS5wcm9wZXJ0eUlzRW51bWVyYWJsZSgwKTtcbn0pID8gZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiBjbGFzc29mKGl0KSA9PSAnU3RyaW5nJyA/IHNwbGl0KGl0LCAnJykgOiBPYmplY3QoaXQpO1xufSA6IE9iamVjdDtcbiIsInZhciB1bmN1cnJ5VGhpcyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9mdW5jdGlvbi11bmN1cnJ5LXRoaXMnKTtcbnZhciBpc0NhbGxhYmxlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2lzLWNhbGxhYmxlJyk7XG52YXIgc3RvcmUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvc2hhcmVkLXN0b3JlJyk7XG5cbnZhciBmdW5jdGlvblRvU3RyaW5nID0gdW5jdXJyeVRoaXMoRnVuY3Rpb24udG9TdHJpbmcpO1xuXG4vLyB0aGlzIGhlbHBlciBicm9rZW4gaW4gYGNvcmUtanNAMy40LjEtMy40LjRgLCBzbyB3ZSBjYW4ndCB1c2UgYHNoYXJlZGAgaGVscGVyXG5pZiAoIWlzQ2FsbGFibGUoc3RvcmUuaW5zcGVjdFNvdXJjZSkpIHtcbiAgc3RvcmUuaW5zcGVjdFNvdXJjZSA9IGZ1bmN0aW9uIChpdCkge1xuICAgIHJldHVybiBmdW5jdGlvblRvU3RyaW5nKGl0KTtcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzdG9yZS5pbnNwZWN0U291cmNlO1xuIiwidmFyIE5BVElWRV9XRUFLX01BUCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9uYXRpdmUtd2Vhay1tYXAnKTtcbnZhciBnbG9iYWwgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZ2xvYmFsJyk7XG52YXIgdW5jdXJyeVRoaXMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZnVuY3Rpb24tdW5jdXJyeS10aGlzJyk7XG52YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaXMtb2JqZWN0Jyk7XG52YXIgY3JlYXRlTm9uRW51bWVyYWJsZVByb3BlcnR5ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2NyZWF0ZS1ub24tZW51bWVyYWJsZS1wcm9wZXJ0eScpO1xudmFyIGhhc093biA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9oYXMtb3duLXByb3BlcnR5Jyk7XG52YXIgc2hhcmVkID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3NoYXJlZC1zdG9yZScpO1xudmFyIHNoYXJlZEtleSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9zaGFyZWQta2V5Jyk7XG52YXIgaGlkZGVuS2V5cyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9oaWRkZW4ta2V5cycpO1xuXG52YXIgT0JKRUNUX0FMUkVBRFlfSU5JVElBTElaRUQgPSAnT2JqZWN0IGFscmVhZHkgaW5pdGlhbGl6ZWQnO1xudmFyIFR5cGVFcnJvciA9IGdsb2JhbC5UeXBlRXJyb3I7XG52YXIgV2Vha01hcCA9IGdsb2JhbC5XZWFrTWFwO1xudmFyIHNldCwgZ2V0LCBoYXM7XG5cbnZhciBlbmZvcmNlID0gZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiBoYXMoaXQpID8gZ2V0KGl0KSA6IHNldChpdCwge30pO1xufTtcblxudmFyIGdldHRlckZvciA9IGZ1bmN0aW9uIChUWVBFKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoaXQpIHtcbiAgICB2YXIgc3RhdGU7XG4gICAgaWYgKCFpc09iamVjdChpdCkgfHwgKHN0YXRlID0gZ2V0KGl0KSkudHlwZSAhPT0gVFlQRSkge1xuICAgICAgdGhyb3cgVHlwZUVycm9yKCdJbmNvbXBhdGlibGUgcmVjZWl2ZXIsICcgKyBUWVBFICsgJyByZXF1aXJlZCcpO1xuICAgIH0gcmV0dXJuIHN0YXRlO1xuICB9O1xufTtcblxuaWYgKE5BVElWRV9XRUFLX01BUCB8fCBzaGFyZWQuc3RhdGUpIHtcbiAgdmFyIHN0b3JlID0gc2hhcmVkLnN0YXRlIHx8IChzaGFyZWQuc3RhdGUgPSBuZXcgV2Vha01hcCgpKTtcbiAgdmFyIHdtZ2V0ID0gdW5jdXJyeVRoaXMoc3RvcmUuZ2V0KTtcbiAgdmFyIHdtaGFzID0gdW5jdXJyeVRoaXMoc3RvcmUuaGFzKTtcbiAgdmFyIHdtc2V0ID0gdW5jdXJyeVRoaXMoc3RvcmUuc2V0KTtcbiAgc2V0ID0gZnVuY3Rpb24gKGl0LCBtZXRhZGF0YSkge1xuICAgIGlmICh3bWhhcyhzdG9yZSwgaXQpKSB0aHJvdyBuZXcgVHlwZUVycm9yKE9CSkVDVF9BTFJFQURZX0lOSVRJQUxJWkVEKTtcbiAgICBtZXRhZGF0YS5mYWNhZGUgPSBpdDtcbiAgICB3bXNldChzdG9yZSwgaXQsIG1ldGFkYXRhKTtcbiAgICByZXR1cm4gbWV0YWRhdGE7XG4gIH07XG4gIGdldCA9IGZ1bmN0aW9uIChpdCkge1xuICAgIHJldHVybiB3bWdldChzdG9yZSwgaXQpIHx8IHt9O1xuICB9O1xuICBoYXMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgICByZXR1cm4gd21oYXMoc3RvcmUsIGl0KTtcbiAgfTtcbn0gZWxzZSB7XG4gIHZhciBTVEFURSA9IHNoYXJlZEtleSgnc3RhdGUnKTtcbiAgaGlkZGVuS2V5c1tTVEFURV0gPSB0cnVlO1xuICBzZXQgPSBmdW5jdGlvbiAoaXQsIG1ldGFkYXRhKSB7XG4gICAgaWYgKGhhc093bihpdCwgU1RBVEUpKSB0aHJvdyBuZXcgVHlwZUVycm9yKE9CSkVDVF9BTFJFQURZX0lOSVRJQUxJWkVEKTtcbiAgICBtZXRhZGF0YS5mYWNhZGUgPSBpdDtcbiAgICBjcmVhdGVOb25FbnVtZXJhYmxlUHJvcGVydHkoaXQsIFNUQVRFLCBtZXRhZGF0YSk7XG4gICAgcmV0dXJuIG1ldGFkYXRhO1xuICB9O1xuICBnZXQgPSBmdW5jdGlvbiAoaXQpIHtcbiAgICByZXR1cm4gaGFzT3duKGl0LCBTVEFURSkgPyBpdFtTVEFURV0gOiB7fTtcbiAgfTtcbiAgaGFzID0gZnVuY3Rpb24gKGl0KSB7XG4gICAgcmV0dXJuIGhhc093bihpdCwgU1RBVEUpO1xuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgc2V0OiBzZXQsXG4gIGdldDogZ2V0LFxuICBoYXM6IGhhcyxcbiAgZW5mb3JjZTogZW5mb3JjZSxcbiAgZ2V0dGVyRm9yOiBnZXR0ZXJGb3Jcbn07XG4iLCIvLyBgSXNDYWxsYWJsZWAgYWJzdHJhY3Qgb3BlcmF0aW9uXG4vLyBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLWlzY2FsbGFibGVcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGFyZ3VtZW50KSB7XG4gIHJldHVybiB0eXBlb2YgYXJndW1lbnQgPT0gJ2Z1bmN0aW9uJztcbn07XG4iLCJ2YXIgZmFpbHMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZmFpbHMnKTtcbnZhciBpc0NhbGxhYmxlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2lzLWNhbGxhYmxlJyk7XG5cbnZhciByZXBsYWNlbWVudCA9IC8jfFxcLnByb3RvdHlwZVxcLi87XG5cbnZhciBpc0ZvcmNlZCA9IGZ1bmN0aW9uIChmZWF0dXJlLCBkZXRlY3Rpb24pIHtcbiAgdmFyIHZhbHVlID0gZGF0YVtub3JtYWxpemUoZmVhdHVyZSldO1xuICByZXR1cm4gdmFsdWUgPT0gUE9MWUZJTEwgPyB0cnVlXG4gICAgOiB2YWx1ZSA9PSBOQVRJVkUgPyBmYWxzZVxuICAgIDogaXNDYWxsYWJsZShkZXRlY3Rpb24pID8gZmFpbHMoZGV0ZWN0aW9uKVxuICAgIDogISFkZXRlY3Rpb247XG59O1xuXG52YXIgbm9ybWFsaXplID0gaXNGb3JjZWQubm9ybWFsaXplID0gZnVuY3Rpb24gKHN0cmluZykge1xuICByZXR1cm4gU3RyaW5nKHN0cmluZykucmVwbGFjZShyZXBsYWNlbWVudCwgJy4nKS50b0xvd2VyQ2FzZSgpO1xufTtcblxudmFyIGRhdGEgPSBpc0ZvcmNlZC5kYXRhID0ge307XG52YXIgTkFUSVZFID0gaXNGb3JjZWQuTkFUSVZFID0gJ04nO1xudmFyIFBPTFlGSUxMID0gaXNGb3JjZWQuUE9MWUZJTEwgPSAnUCc7XG5cbm1vZHVsZS5leHBvcnRzID0gaXNGb3JjZWQ7XG4iLCJ2YXIgaXNDYWxsYWJsZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9pcy1jYWxsYWJsZScpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICByZXR1cm4gdHlwZW9mIGl0ID09ICdvYmplY3QnID8gaXQgIT09IG51bGwgOiBpc0NhbGxhYmxlKGl0KTtcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZhbHNlO1xuIiwidmFyIGdsb2JhbCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9nbG9iYWwnKTtcbnZhciBnZXRCdWlsdEluID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2dldC1idWlsdC1pbicpO1xudmFyIGlzQ2FsbGFibGUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaXMtY2FsbGFibGUnKTtcbnZhciBpc1Byb3RvdHlwZU9mID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL29iamVjdC1pcy1wcm90b3R5cGUtb2YnKTtcbnZhciBVU0VfU1lNQk9MX0FTX1VJRCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy91c2Utc3ltYm9sLWFzLXVpZCcpO1xuXG52YXIgT2JqZWN0ID0gZ2xvYmFsLk9iamVjdDtcblxubW9kdWxlLmV4cG9ydHMgPSBVU0VfU1lNQk9MX0FTX1VJRCA/IGZ1bmN0aW9uIChpdCkge1xuICByZXR1cm4gdHlwZW9mIGl0ID09ICdzeW1ib2wnO1xufSA6IGZ1bmN0aW9uIChpdCkge1xuICB2YXIgJFN5bWJvbCA9IGdldEJ1aWx0SW4oJ1N5bWJvbCcpO1xuICByZXR1cm4gaXNDYWxsYWJsZSgkU3ltYm9sKSAmJiBpc1Byb3RvdHlwZU9mKCRTeW1ib2wucHJvdG90eXBlLCBPYmplY3QoaXQpKTtcbn07XG4iLCJ2YXIgdG9MZW5ndGggPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvdG8tbGVuZ3RoJyk7XG5cbi8vIGBMZW5ndGhPZkFycmF5TGlrZWAgYWJzdHJhY3Qgb3BlcmF0aW9uXG4vLyBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLWxlbmd0aG9mYXJyYXlsaWtlXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChvYmopIHtcbiAgcmV0dXJuIHRvTGVuZ3RoKG9iai5sZW5ndGgpO1xufTtcbiIsIi8qIGVzbGludC1kaXNhYmxlIGVzL25vLXN5bWJvbCAtLSByZXF1aXJlZCBmb3IgdGVzdGluZyAqL1xudmFyIFY4X1ZFUlNJT04gPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZW5naW5lLXY4LXZlcnNpb24nKTtcbnZhciBmYWlscyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9mYWlscycpO1xuXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZXMvbm8tb2JqZWN0LWdldG93bnByb3BlcnR5c3ltYm9scyAtLSByZXF1aXJlZCBmb3IgdGVzdGluZ1xubW9kdWxlLmV4cG9ydHMgPSAhIU9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMgJiYgIWZhaWxzKGZ1bmN0aW9uICgpIHtcbiAgdmFyIHN5bWJvbCA9IFN5bWJvbCgpO1xuICAvLyBDaHJvbWUgMzggU3ltYm9sIGhhcyBpbmNvcnJlY3QgdG9TdHJpbmcgY29udmVyc2lvblxuICAvLyBgZ2V0LW93bi1wcm9wZXJ0eS1zeW1ib2xzYCBwb2x5ZmlsbCBzeW1ib2xzIGNvbnZlcnRlZCB0byBvYmplY3QgYXJlIG5vdCBTeW1ib2wgaW5zdGFuY2VzXG4gIHJldHVybiAhU3RyaW5nKHN5bWJvbCkgfHwgIShPYmplY3Qoc3ltYm9sKSBpbnN0YW5jZW9mIFN5bWJvbCkgfHxcbiAgICAvLyBDaHJvbWUgMzgtNDAgc3ltYm9scyBhcmUgbm90IGluaGVyaXRlZCBmcm9tIERPTSBjb2xsZWN0aW9ucyBwcm90b3R5cGVzIHRvIGluc3RhbmNlc1xuICAgICFTeW1ib2wuc2hhbSAmJiBWOF9WRVJTSU9OICYmIFY4X1ZFUlNJT04gPCA0MTtcbn0pO1xuIiwidmFyIGdsb2JhbCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9nbG9iYWwnKTtcbnZhciBpc0NhbGxhYmxlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2lzLWNhbGxhYmxlJyk7XG52YXIgaW5zcGVjdFNvdXJjZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9pbnNwZWN0LXNvdXJjZScpO1xuXG52YXIgV2Vha01hcCA9IGdsb2JhbC5XZWFrTWFwO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGlzQ2FsbGFibGUoV2Vha01hcCkgJiYgL25hdGl2ZSBjb2RlLy50ZXN0KGluc3BlY3RTb3VyY2UoV2Vha01hcCkpO1xuIiwidmFyIGdsb2JhbCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9nbG9iYWwnKTtcbnZhciBERVNDUklQVE9SUyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9kZXNjcmlwdG9ycycpO1xudmFyIElFOF9ET01fREVGSU5FID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2llOC1kb20tZGVmaW5lJyk7XG52YXIgVjhfUFJPVE9UWVBFX0RFRklORV9CVUcgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvdjgtcHJvdG90eXBlLWRlZmluZS1idWcnKTtcbnZhciBhbk9iamVjdCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9hbi1vYmplY3QnKTtcbnZhciB0b1Byb3BlcnR5S2V5ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3RvLXByb3BlcnR5LWtleScpO1xuXG52YXIgVHlwZUVycm9yID0gZ2xvYmFsLlR5cGVFcnJvcjtcbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBlcy9uby1vYmplY3QtZGVmaW5lcHJvcGVydHkgLS0gc2FmZVxudmFyICRkZWZpbmVQcm9wZXJ0eSA9IE9iamVjdC5kZWZpbmVQcm9wZXJ0eTtcbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBlcy9uby1vYmplY3QtZ2V0b3ducHJvcGVydHlkZXNjcmlwdG9yIC0tIHNhZmVcbnZhciAkZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcjtcbnZhciBFTlVNRVJBQkxFID0gJ2VudW1lcmFibGUnO1xudmFyIENPTkZJR1VSQUJMRSA9ICdjb25maWd1cmFibGUnO1xudmFyIFdSSVRBQkxFID0gJ3dyaXRhYmxlJztcblxuLy8gYE9iamVjdC5kZWZpbmVQcm9wZXJ0eWAgbWV0aG9kXG4vLyBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLW9iamVjdC5kZWZpbmVwcm9wZXJ0eVxuZXhwb3J0cy5mID0gREVTQ1JJUFRPUlMgPyBWOF9QUk9UT1RZUEVfREVGSU5FX0JVRyA/IGZ1bmN0aW9uIGRlZmluZVByb3BlcnR5KE8sIFAsIEF0dHJpYnV0ZXMpIHtcbiAgYW5PYmplY3QoTyk7XG4gIFAgPSB0b1Byb3BlcnR5S2V5KFApO1xuICBhbk9iamVjdChBdHRyaWJ1dGVzKTtcbiAgaWYgKHR5cGVvZiBPID09PSAnZnVuY3Rpb24nICYmIFAgPT09ICdwcm90b3R5cGUnICYmICd2YWx1ZScgaW4gQXR0cmlidXRlcyAmJiBXUklUQUJMRSBpbiBBdHRyaWJ1dGVzICYmICFBdHRyaWJ1dGVzW1dSSVRBQkxFXSkge1xuICAgIHZhciBjdXJyZW50ID0gJGdldE93blByb3BlcnR5RGVzY3JpcHRvcihPLCBQKTtcbiAgICBpZiAoY3VycmVudCAmJiBjdXJyZW50W1dSSVRBQkxFXSkge1xuICAgICAgT1tQXSA9IEF0dHJpYnV0ZXMudmFsdWU7XG4gICAgICBBdHRyaWJ1dGVzID0ge1xuICAgICAgICBjb25maWd1cmFibGU6IENPTkZJR1VSQUJMRSBpbiBBdHRyaWJ1dGVzID8gQXR0cmlidXRlc1tDT05GSUdVUkFCTEVdIDogY3VycmVudFtDT05GSUdVUkFCTEVdLFxuICAgICAgICBlbnVtZXJhYmxlOiBFTlVNRVJBQkxFIGluIEF0dHJpYnV0ZXMgPyBBdHRyaWJ1dGVzW0VOVU1FUkFCTEVdIDogY3VycmVudFtFTlVNRVJBQkxFXSxcbiAgICAgICAgd3JpdGFibGU6IGZhbHNlXG4gICAgICB9O1xuICAgIH1cbiAgfSByZXR1cm4gJGRlZmluZVByb3BlcnR5KE8sIFAsIEF0dHJpYnV0ZXMpO1xufSA6ICRkZWZpbmVQcm9wZXJ0eSA6IGZ1bmN0aW9uIGRlZmluZVByb3BlcnR5KE8sIFAsIEF0dHJpYnV0ZXMpIHtcbiAgYW5PYmplY3QoTyk7XG4gIFAgPSB0b1Byb3BlcnR5S2V5KFApO1xuICBhbk9iamVjdChBdHRyaWJ1dGVzKTtcbiAgaWYgKElFOF9ET01fREVGSU5FKSB0cnkge1xuICAgIHJldHVybiAkZGVmaW5lUHJvcGVydHkoTywgUCwgQXR0cmlidXRlcyk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7IC8qIGVtcHR5ICovIH1cbiAgaWYgKCdnZXQnIGluIEF0dHJpYnV0ZXMgfHwgJ3NldCcgaW4gQXR0cmlidXRlcykgdGhyb3cgVHlwZUVycm9yKCdBY2Nlc3NvcnMgbm90IHN1cHBvcnRlZCcpO1xuICBpZiAoJ3ZhbHVlJyBpbiBBdHRyaWJ1dGVzKSBPW1BdID0gQXR0cmlidXRlcy52YWx1ZTtcbiAgcmV0dXJuIE87XG59O1xuIiwidmFyIERFU0NSSVBUT1JTID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2Rlc2NyaXB0b3JzJyk7XG52YXIgY2FsbCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9mdW5jdGlvbi1jYWxsJyk7XG52YXIgcHJvcGVydHlJc0VudW1lcmFibGVNb2R1bGUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvb2JqZWN0LXByb3BlcnR5LWlzLWVudW1lcmFibGUnKTtcbnZhciBjcmVhdGVQcm9wZXJ0eURlc2NyaXB0b3IgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvY3JlYXRlLXByb3BlcnR5LWRlc2NyaXB0b3InKTtcbnZhciB0b0luZGV4ZWRPYmplY3QgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvdG8taW5kZXhlZC1vYmplY3QnKTtcbnZhciB0b1Byb3BlcnR5S2V5ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3RvLXByb3BlcnR5LWtleScpO1xudmFyIGhhc093biA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9oYXMtb3duLXByb3BlcnR5Jyk7XG52YXIgSUU4X0RPTV9ERUZJTkUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaWU4LWRvbS1kZWZpbmUnKTtcblxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGVzL25vLW9iamVjdC1nZXRvd25wcm9wZXJ0eWRlc2NyaXB0b3IgLS0gc2FmZVxudmFyICRnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yO1xuXG4vLyBgT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcmAgbWV0aG9kXG4vLyBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLW9iamVjdC5nZXRvd25wcm9wZXJ0eWRlc2NyaXB0b3JcbmV4cG9ydHMuZiA9IERFU0NSSVBUT1JTID8gJGdldE93blByb3BlcnR5RGVzY3JpcHRvciA6IGZ1bmN0aW9uIGdldE93blByb3BlcnR5RGVzY3JpcHRvcihPLCBQKSB7XG4gIE8gPSB0b0luZGV4ZWRPYmplY3QoTyk7XG4gIFAgPSB0b1Byb3BlcnR5S2V5KFApO1xuICBpZiAoSUU4X0RPTV9ERUZJTkUpIHRyeSB7XG4gICAgcmV0dXJuICRnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTywgUCk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7IC8qIGVtcHR5ICovIH1cbiAgaWYgKGhhc093bihPLCBQKSkgcmV0dXJuIGNyZWF0ZVByb3BlcnR5RGVzY3JpcHRvcighY2FsbChwcm9wZXJ0eUlzRW51bWVyYWJsZU1vZHVsZS5mLCBPLCBQKSwgT1tQXSk7XG59O1xuIiwidmFyIGludGVybmFsT2JqZWN0S2V5cyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9vYmplY3Qta2V5cy1pbnRlcm5hbCcpO1xudmFyIGVudW1CdWdLZXlzID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2VudW0tYnVnLWtleXMnKTtcblxudmFyIGhpZGRlbktleXMgPSBlbnVtQnVnS2V5cy5jb25jYXQoJ2xlbmd0aCcsICdwcm90b3R5cGUnKTtcblxuLy8gYE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzYCBtZXRob2Rcbi8vIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtb2JqZWN0LmdldG93bnByb3BlcnR5bmFtZXNcbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBlcy9uby1vYmplY3QtZ2V0b3ducHJvcGVydHluYW1lcyAtLSBzYWZlXG5leHBvcnRzLmYgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyB8fCBmdW5jdGlvbiBnZXRPd25Qcm9wZXJ0eU5hbWVzKE8pIHtcbiAgcmV0dXJuIGludGVybmFsT2JqZWN0S2V5cyhPLCBoaWRkZW5LZXlzKTtcbn07XG4iLCIvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZXMvbm8tb2JqZWN0LWdldG93bnByb3BlcnR5c3ltYm9scyAtLSBzYWZlXG5leHBvcnRzLmYgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzO1xuIiwidmFyIGdsb2JhbCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9nbG9iYWwnKTtcbnZhciBoYXNPd24gPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaGFzLW93bi1wcm9wZXJ0eScpO1xudmFyIGlzQ2FsbGFibGUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaXMtY2FsbGFibGUnKTtcbnZhciB0b09iamVjdCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy90by1vYmplY3QnKTtcbnZhciBzaGFyZWRLZXkgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvc2hhcmVkLWtleScpO1xudmFyIENPUlJFQ1RfUFJPVE9UWVBFX0dFVFRFUiA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9jb3JyZWN0LXByb3RvdHlwZS1nZXR0ZXInKTtcblxudmFyIElFX1BST1RPID0gc2hhcmVkS2V5KCdJRV9QUk9UTycpO1xudmFyIE9iamVjdCA9IGdsb2JhbC5PYmplY3Q7XG52YXIgT2JqZWN0UHJvdG90eXBlID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLy8gYE9iamVjdC5nZXRQcm90b3R5cGVPZmAgbWV0aG9kXG4vLyBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLW9iamVjdC5nZXRwcm90b3R5cGVvZlxubW9kdWxlLmV4cG9ydHMgPSBDT1JSRUNUX1BST1RPVFlQRV9HRVRURVIgPyBPYmplY3QuZ2V0UHJvdG90eXBlT2YgOiBmdW5jdGlvbiAoTykge1xuICB2YXIgb2JqZWN0ID0gdG9PYmplY3QoTyk7XG4gIGlmIChoYXNPd24ob2JqZWN0LCBJRV9QUk9UTykpIHJldHVybiBvYmplY3RbSUVfUFJPVE9dO1xuICB2YXIgY29uc3RydWN0b3IgPSBvYmplY3QuY29uc3RydWN0b3I7XG4gIGlmIChpc0NhbGxhYmxlKGNvbnN0cnVjdG9yKSAmJiBvYmplY3QgaW5zdGFuY2VvZiBjb25zdHJ1Y3Rvcikge1xuICAgIHJldHVybiBjb25zdHJ1Y3Rvci5wcm90b3R5cGU7XG4gIH0gcmV0dXJuIG9iamVjdCBpbnN0YW5jZW9mIE9iamVjdCA/IE9iamVjdFByb3RvdHlwZSA6IG51bGw7XG59O1xuIiwidmFyIHVuY3VycnlUaGlzID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2Z1bmN0aW9uLXVuY3VycnktdGhpcycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHVuY3VycnlUaGlzKHt9LmlzUHJvdG90eXBlT2YpO1xuIiwidmFyIHVuY3VycnlUaGlzID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2Z1bmN0aW9uLXVuY3VycnktdGhpcycpO1xudmFyIGhhc093biA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9oYXMtb3duLXByb3BlcnR5Jyk7XG52YXIgdG9JbmRleGVkT2JqZWN0ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3RvLWluZGV4ZWQtb2JqZWN0Jyk7XG52YXIgaW5kZXhPZiA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9hcnJheS1pbmNsdWRlcycpLmluZGV4T2Y7XG52YXIgaGlkZGVuS2V5cyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9oaWRkZW4ta2V5cycpO1xuXG52YXIgcHVzaCA9IHVuY3VycnlUaGlzKFtdLnB1c2gpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChvYmplY3QsIG5hbWVzKSB7XG4gIHZhciBPID0gdG9JbmRleGVkT2JqZWN0KG9iamVjdCk7XG4gIHZhciBpID0gMDtcbiAgdmFyIHJlc3VsdCA9IFtdO1xuICB2YXIga2V5O1xuICBmb3IgKGtleSBpbiBPKSAhaGFzT3duKGhpZGRlbktleXMsIGtleSkgJiYgaGFzT3duKE8sIGtleSkgJiYgcHVzaChyZXN1bHQsIGtleSk7XG4gIC8vIERvbid0IGVudW0gYnVnICYgaGlkZGVuIGtleXNcbiAgd2hpbGUgKG5hbWVzLmxlbmd0aCA+IGkpIGlmIChoYXNPd24oTywga2V5ID0gbmFtZXNbaSsrXSkpIHtcbiAgICB+aW5kZXhPZihyZXN1bHQsIGtleSkgfHwgcHVzaChyZXN1bHQsIGtleSk7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn07XG4iLCIndXNlIHN0cmljdCc7XG52YXIgJHByb3BlcnR5SXNFbnVtZXJhYmxlID0ge30ucHJvcGVydHlJc0VudW1lcmFibGU7XG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZXMvbm8tb2JqZWN0LWdldG93bnByb3BlcnR5ZGVzY3JpcHRvciAtLSBzYWZlXG52YXIgZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcjtcblxuLy8gTmFzaG9ybiB+IEpESzggYnVnXG52YXIgTkFTSE9STl9CVUcgPSBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IgJiYgISRwcm9wZXJ0eUlzRW51bWVyYWJsZS5jYWxsKHsgMTogMiB9LCAxKTtcblxuLy8gYE9iamVjdC5wcm90b3R5cGUucHJvcGVydHlJc0VudW1lcmFibGVgIG1ldGhvZCBpbXBsZW1lbnRhdGlvblxuLy8gaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy1vYmplY3QucHJvdG90eXBlLnByb3BlcnR5aXNlbnVtZXJhYmxlXG5leHBvcnRzLmYgPSBOQVNIT1JOX0JVRyA/IGZ1bmN0aW9uIHByb3BlcnR5SXNFbnVtZXJhYmxlKFYpIHtcbiAgdmFyIGRlc2NyaXB0b3IgPSBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGhpcywgVik7XG4gIHJldHVybiAhIWRlc2NyaXB0b3IgJiYgZGVzY3JpcHRvci5lbnVtZXJhYmxlO1xufSA6ICRwcm9wZXJ0eUlzRW51bWVyYWJsZTtcbiIsInZhciBnbG9iYWwgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZ2xvYmFsJyk7XG52YXIgY2FsbCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9mdW5jdGlvbi1jYWxsJyk7XG52YXIgaXNDYWxsYWJsZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9pcy1jYWxsYWJsZScpO1xudmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2lzLW9iamVjdCcpO1xuXG52YXIgVHlwZUVycm9yID0gZ2xvYmFsLlR5cGVFcnJvcjtcblxuLy8gYE9yZGluYXJ5VG9QcmltaXRpdmVgIGFic3RyYWN0IG9wZXJhdGlvblxuLy8gaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy1vcmRpbmFyeXRvcHJpbWl0aXZlXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpbnB1dCwgcHJlZikge1xuICB2YXIgZm4sIHZhbDtcbiAgaWYgKHByZWYgPT09ICdzdHJpbmcnICYmIGlzQ2FsbGFibGUoZm4gPSBpbnB1dC50b1N0cmluZykgJiYgIWlzT2JqZWN0KHZhbCA9IGNhbGwoZm4sIGlucHV0KSkpIHJldHVybiB2YWw7XG4gIGlmIChpc0NhbGxhYmxlKGZuID0gaW5wdXQudmFsdWVPZikgJiYgIWlzT2JqZWN0KHZhbCA9IGNhbGwoZm4sIGlucHV0KSkpIHJldHVybiB2YWw7XG4gIGlmIChwcmVmICE9PSAnc3RyaW5nJyAmJiBpc0NhbGxhYmxlKGZuID0gaW5wdXQudG9TdHJpbmcpICYmICFpc09iamVjdCh2YWwgPSBjYWxsKGZuLCBpbnB1dCkpKSByZXR1cm4gdmFsO1xuICB0aHJvdyBUeXBlRXJyb3IoXCJDYW4ndCBjb252ZXJ0IG9iamVjdCB0byBwcmltaXRpdmUgdmFsdWVcIik7XG59O1xuIiwidmFyIGdldEJ1aWx0SW4gPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZ2V0LWJ1aWx0LWluJyk7XG52YXIgdW5jdXJyeVRoaXMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZnVuY3Rpb24tdW5jdXJyeS10aGlzJyk7XG52YXIgZ2V0T3duUHJvcGVydHlOYW1lc01vZHVsZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9vYmplY3QtZ2V0LW93bi1wcm9wZXJ0eS1uYW1lcycpO1xudmFyIGdldE93blByb3BlcnR5U3ltYm9sc01vZHVsZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9vYmplY3QtZ2V0LW93bi1wcm9wZXJ0eS1zeW1ib2xzJyk7XG52YXIgYW5PYmplY3QgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvYW4tb2JqZWN0Jyk7XG5cbnZhciBjb25jYXQgPSB1bmN1cnJ5VGhpcyhbXS5jb25jYXQpO1xuXG4vLyBhbGwgb2JqZWN0IGtleXMsIGluY2x1ZGVzIG5vbi1lbnVtZXJhYmxlIGFuZCBzeW1ib2xzXG5tb2R1bGUuZXhwb3J0cyA9IGdldEJ1aWx0SW4oJ1JlZmxlY3QnLCAnb3duS2V5cycpIHx8IGZ1bmN0aW9uIG93bktleXMoaXQpIHtcbiAgdmFyIGtleXMgPSBnZXRPd25Qcm9wZXJ0eU5hbWVzTW9kdWxlLmYoYW5PYmplY3QoaXQpKTtcbiAgdmFyIGdldE93blByb3BlcnR5U3ltYm9scyA9IGdldE93blByb3BlcnR5U3ltYm9sc01vZHVsZS5mO1xuICByZXR1cm4gZ2V0T3duUHJvcGVydHlTeW1ib2xzID8gY29uY2F0KGtleXMsIGdldE93blByb3BlcnR5U3ltYm9scyhpdCkpIDoga2V5cztcbn07XG4iLCJ2YXIgZ2xvYmFsID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2dsb2JhbCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGdsb2JhbDtcbiIsInZhciBnbG9iYWwgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZ2xvYmFsJyk7XG52YXIgaXNDYWxsYWJsZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9pcy1jYWxsYWJsZScpO1xudmFyIGhhc093biA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9oYXMtb3duLXByb3BlcnR5Jyk7XG52YXIgY3JlYXRlTm9uRW51bWVyYWJsZVByb3BlcnR5ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2NyZWF0ZS1ub24tZW51bWVyYWJsZS1wcm9wZXJ0eScpO1xudmFyIHNldEdsb2JhbCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9zZXQtZ2xvYmFsJyk7XG52YXIgaW5zcGVjdFNvdXJjZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9pbnNwZWN0LXNvdXJjZScpO1xudmFyIEludGVybmFsU3RhdGVNb2R1bGUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaW50ZXJuYWwtc3RhdGUnKTtcbnZhciBDT05GSUdVUkFCTEVfRlVOQ1RJT05fTkFNRSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9mdW5jdGlvbi1uYW1lJykuQ09ORklHVVJBQkxFO1xuXG52YXIgZ2V0SW50ZXJuYWxTdGF0ZSA9IEludGVybmFsU3RhdGVNb2R1bGUuZ2V0O1xudmFyIGVuZm9yY2VJbnRlcm5hbFN0YXRlID0gSW50ZXJuYWxTdGF0ZU1vZHVsZS5lbmZvcmNlO1xudmFyIFRFTVBMQVRFID0gU3RyaW5nKFN0cmluZykuc3BsaXQoJ1N0cmluZycpO1xuXG4obW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoTywga2V5LCB2YWx1ZSwgb3B0aW9ucykge1xuICB2YXIgdW5zYWZlID0gb3B0aW9ucyA/ICEhb3B0aW9ucy51bnNhZmUgOiBmYWxzZTtcbiAgdmFyIHNpbXBsZSA9IG9wdGlvbnMgPyAhIW9wdGlvbnMuZW51bWVyYWJsZSA6IGZhbHNlO1xuICB2YXIgbm9UYXJnZXRHZXQgPSBvcHRpb25zID8gISFvcHRpb25zLm5vVGFyZ2V0R2V0IDogZmFsc2U7XG4gIHZhciBuYW1lID0gb3B0aW9ucyAmJiBvcHRpb25zLm5hbWUgIT09IHVuZGVmaW5lZCA/IG9wdGlvbnMubmFtZSA6IGtleTtcbiAgdmFyIHN0YXRlO1xuICBpZiAoaXNDYWxsYWJsZSh2YWx1ZSkpIHtcbiAgICBpZiAoU3RyaW5nKG5hbWUpLnNsaWNlKDAsIDcpID09PSAnU3ltYm9sKCcpIHtcbiAgICAgIG5hbWUgPSAnWycgKyBTdHJpbmcobmFtZSkucmVwbGFjZSgvXlN5bWJvbFxcKChbXildKilcXCkvLCAnJDEnKSArICddJztcbiAgICB9XG4gICAgaWYgKCFoYXNPd24odmFsdWUsICduYW1lJykgfHwgKENPTkZJR1VSQUJMRV9GVU5DVElPTl9OQU1FICYmIHZhbHVlLm5hbWUgIT09IG5hbWUpKSB7XG4gICAgICBjcmVhdGVOb25FbnVtZXJhYmxlUHJvcGVydHkodmFsdWUsICduYW1lJywgbmFtZSk7XG4gICAgfVxuICAgIHN0YXRlID0gZW5mb3JjZUludGVybmFsU3RhdGUodmFsdWUpO1xuICAgIGlmICghc3RhdGUuc291cmNlKSB7XG4gICAgICBzdGF0ZS5zb3VyY2UgPSBURU1QTEFURS5qb2luKHR5cGVvZiBuYW1lID09ICdzdHJpbmcnID8gbmFtZSA6ICcnKTtcbiAgICB9XG4gIH1cbiAgaWYgKE8gPT09IGdsb2JhbCkge1xuICAgIGlmIChzaW1wbGUpIE9ba2V5XSA9IHZhbHVlO1xuICAgIGVsc2Ugc2V0R2xvYmFsKGtleSwgdmFsdWUpO1xuICAgIHJldHVybjtcbiAgfSBlbHNlIGlmICghdW5zYWZlKSB7XG4gICAgZGVsZXRlIE9ba2V5XTtcbiAgfSBlbHNlIGlmICghbm9UYXJnZXRHZXQgJiYgT1trZXldKSB7XG4gICAgc2ltcGxlID0gdHJ1ZTtcbiAgfVxuICBpZiAoc2ltcGxlKSBPW2tleV0gPSB2YWx1ZTtcbiAgZWxzZSBjcmVhdGVOb25FbnVtZXJhYmxlUHJvcGVydHkoTywga2V5LCB2YWx1ZSk7XG4vLyBhZGQgZmFrZSBGdW5jdGlvbiN0b1N0cmluZyBmb3IgY29ycmVjdCB3b3JrIHdyYXBwZWQgbWV0aG9kcyAvIGNvbnN0cnVjdG9ycyB3aXRoIG1ldGhvZHMgbGlrZSBMb0Rhc2ggaXNOYXRpdmVcbn0pKEZ1bmN0aW9uLnByb3RvdHlwZSwgJ3RvU3RyaW5nJywgZnVuY3Rpb24gdG9TdHJpbmcoKSB7XG4gIHJldHVybiBpc0NhbGxhYmxlKHRoaXMpICYmIGdldEludGVybmFsU3RhdGUodGhpcykuc291cmNlIHx8IGluc3BlY3RTb3VyY2UodGhpcyk7XG59KTtcbiIsInZhciBnbG9iYWwgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZ2xvYmFsJyk7XG5cbnZhciBUeXBlRXJyb3IgPSBnbG9iYWwuVHlwZUVycm9yO1xuXG4vLyBgUmVxdWlyZU9iamVjdENvZXJjaWJsZWAgYWJzdHJhY3Qgb3BlcmF0aW9uXG4vLyBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLXJlcXVpcmVvYmplY3Rjb2VyY2libGVcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIGlmIChpdCA9PSB1bmRlZmluZWQpIHRocm93IFR5cGVFcnJvcihcIkNhbid0IGNhbGwgbWV0aG9kIG9uIFwiICsgaXQpO1xuICByZXR1cm4gaXQ7XG59O1xuIiwidmFyIGdsb2JhbCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9nbG9iYWwnKTtcblxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGVzL25vLW9iamVjdC1kZWZpbmVwcm9wZXJ0eSAtLSBzYWZlXG52YXIgZGVmaW5lUHJvcGVydHkgPSBPYmplY3QuZGVmaW5lUHJvcGVydHk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGtleSwgdmFsdWUpIHtcbiAgdHJ5IHtcbiAgICBkZWZpbmVQcm9wZXJ0eShnbG9iYWwsIGtleSwgeyB2YWx1ZTogdmFsdWUsIGNvbmZpZ3VyYWJsZTogdHJ1ZSwgd3JpdGFibGU6IHRydWUgfSk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgZ2xvYmFsW2tleV0gPSB2YWx1ZTtcbiAgfSByZXR1cm4gdmFsdWU7XG59O1xuIiwidmFyIHNoYXJlZCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9zaGFyZWQnKTtcbnZhciB1aWQgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvdWlkJyk7XG5cbnZhciBrZXlzID0gc2hhcmVkKCdrZXlzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGtleSkge1xuICByZXR1cm4ga2V5c1trZXldIHx8IChrZXlzW2tleV0gPSB1aWQoa2V5KSk7XG59O1xuIiwidmFyIGdsb2JhbCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9nbG9iYWwnKTtcbnZhciBzZXRHbG9iYWwgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvc2V0LWdsb2JhbCcpO1xuXG52YXIgU0hBUkVEID0gJ19fY29yZS1qc19zaGFyZWRfXyc7XG52YXIgc3RvcmUgPSBnbG9iYWxbU0hBUkVEXSB8fCBzZXRHbG9iYWwoU0hBUkVELCB7fSk7XG5cbm1vZHVsZS5leHBvcnRzID0gc3RvcmU7XG4iLCJ2YXIgSVNfUFVSRSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9pcy1wdXJlJyk7XG52YXIgc3RvcmUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvc2hhcmVkLXN0b3JlJyk7XG5cbihtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChrZXksIHZhbHVlKSB7XG4gIHJldHVybiBzdG9yZVtrZXldIHx8IChzdG9yZVtrZXldID0gdmFsdWUgIT09IHVuZGVmaW5lZCA/IHZhbHVlIDoge30pO1xufSkoJ3ZlcnNpb25zJywgW10pLnB1c2goe1xuICB2ZXJzaW9uOiAnMy4yMS4xJyxcbiAgbW9kZTogSVNfUFVSRSA/ICdwdXJlJyA6ICdnbG9iYWwnLFxuICBjb3B5cmlnaHQ6ICfCqSAyMDE0LTIwMjIgRGVuaXMgUHVzaGthcmV2ICh6bG9pcm9jay5ydSknLFxuICBsaWNlbnNlOiAnaHR0cHM6Ly9naXRodWIuY29tL3psb2lyb2NrL2NvcmUtanMvYmxvYi92My4yMS4xL0xJQ0VOU0UnLFxuICBzb3VyY2U6ICdodHRwczovL2dpdGh1Yi5jb20vemxvaXJvY2svY29yZS1qcydcbn0pO1xuIiwidmFyIHRvSW50ZWdlck9ySW5maW5pdHkgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvdG8taW50ZWdlci1vci1pbmZpbml0eScpO1xuXG52YXIgbWF4ID0gTWF0aC5tYXg7XG52YXIgbWluID0gTWF0aC5taW47XG5cbi8vIEhlbHBlciBmb3IgYSBwb3B1bGFyIHJlcGVhdGluZyBjYXNlIG9mIHRoZSBzcGVjOlxuLy8gTGV0IGludGVnZXIgYmUgPyBUb0ludGVnZXIoaW5kZXgpLlxuLy8gSWYgaW50ZWdlciA8IDAsIGxldCByZXN1bHQgYmUgbWF4KChsZW5ndGggKyBpbnRlZ2VyKSwgMCk7IGVsc2UgbGV0IHJlc3VsdCBiZSBtaW4oaW50ZWdlciwgbGVuZ3RoKS5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGluZGV4LCBsZW5ndGgpIHtcbiAgdmFyIGludGVnZXIgPSB0b0ludGVnZXJPckluZmluaXR5KGluZGV4KTtcbiAgcmV0dXJuIGludGVnZXIgPCAwID8gbWF4KGludGVnZXIgKyBsZW5ndGgsIDApIDogbWluKGludGVnZXIsIGxlbmd0aCk7XG59O1xuIiwiLy8gdG9PYmplY3Qgd2l0aCBmYWxsYmFjayBmb3Igbm9uLWFycmF5LWxpa2UgRVMzIHN0cmluZ3NcbnZhciBJbmRleGVkT2JqZWN0ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2luZGV4ZWQtb2JqZWN0Jyk7XG52YXIgcmVxdWlyZU9iamVjdENvZXJjaWJsZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9yZXF1aXJlLW9iamVjdC1jb2VyY2libGUnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIEluZGV4ZWRPYmplY3QocmVxdWlyZU9iamVjdENvZXJjaWJsZShpdCkpO1xufTtcbiIsInZhciBjZWlsID0gTWF0aC5jZWlsO1xudmFyIGZsb29yID0gTWF0aC5mbG9vcjtcblxuLy8gYFRvSW50ZWdlck9ySW5maW5pdHlgIGFic3RyYWN0IG9wZXJhdGlvblxuLy8gaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy10b2ludGVnZXJvcmluZmluaXR5XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChhcmd1bWVudCkge1xuICB2YXIgbnVtYmVyID0gK2FyZ3VtZW50O1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tc2VsZi1jb21wYXJlIC0tIHNhZmVcbiAgcmV0dXJuIG51bWJlciAhPT0gbnVtYmVyIHx8IG51bWJlciA9PT0gMCA/IDAgOiAobnVtYmVyID4gMCA/IGZsb29yIDogY2VpbCkobnVtYmVyKTtcbn07XG4iLCJ2YXIgdG9JbnRlZ2VyT3JJbmZpbml0eSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy90by1pbnRlZ2VyLW9yLWluZmluaXR5Jyk7XG5cbnZhciBtaW4gPSBNYXRoLm1pbjtcblxuLy8gYFRvTGVuZ3RoYCBhYnN0cmFjdCBvcGVyYXRpb25cbi8vIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtdG9sZW5ndGhcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGFyZ3VtZW50KSB7XG4gIHJldHVybiBhcmd1bWVudCA+IDAgPyBtaW4odG9JbnRlZ2VyT3JJbmZpbml0eShhcmd1bWVudCksIDB4MUZGRkZGRkZGRkZGRkYpIDogMDsgLy8gMiAqKiA1MyAtIDEgPT0gOTAwNzE5OTI1NDc0MDk5MVxufTtcbiIsInZhciBnbG9iYWwgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZ2xvYmFsJyk7XG52YXIgcmVxdWlyZU9iamVjdENvZXJjaWJsZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9yZXF1aXJlLW9iamVjdC1jb2VyY2libGUnKTtcblxudmFyIE9iamVjdCA9IGdsb2JhbC5PYmplY3Q7XG5cbi8vIGBUb09iamVjdGAgYWJzdHJhY3Qgb3BlcmF0aW9uXG4vLyBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLXRvb2JqZWN0XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChhcmd1bWVudCkge1xuICByZXR1cm4gT2JqZWN0KHJlcXVpcmVPYmplY3RDb2VyY2libGUoYXJndW1lbnQpKTtcbn07XG4iLCJ2YXIgZ2xvYmFsID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2dsb2JhbCcpO1xudmFyIGNhbGwgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZnVuY3Rpb24tY2FsbCcpO1xudmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2lzLW9iamVjdCcpO1xudmFyIGlzU3ltYm9sID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2lzLXN5bWJvbCcpO1xudmFyIGdldE1ldGhvZCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9nZXQtbWV0aG9kJyk7XG52YXIgb3JkaW5hcnlUb1ByaW1pdGl2ZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9vcmRpbmFyeS10by1wcmltaXRpdmUnKTtcbnZhciB3ZWxsS25vd25TeW1ib2wgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvd2VsbC1rbm93bi1zeW1ib2wnKTtcblxudmFyIFR5cGVFcnJvciA9IGdsb2JhbC5UeXBlRXJyb3I7XG52YXIgVE9fUFJJTUlUSVZFID0gd2VsbEtub3duU3ltYm9sKCd0b1ByaW1pdGl2ZScpO1xuXG4vLyBgVG9QcmltaXRpdmVgIGFic3RyYWN0IG9wZXJhdGlvblxuLy8gaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy10b3ByaW1pdGl2ZVxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaW5wdXQsIHByZWYpIHtcbiAgaWYgKCFpc09iamVjdChpbnB1dCkgfHwgaXNTeW1ib2woaW5wdXQpKSByZXR1cm4gaW5wdXQ7XG4gIHZhciBleG90aWNUb1ByaW0gPSBnZXRNZXRob2QoaW5wdXQsIFRPX1BSSU1JVElWRSk7XG4gIHZhciByZXN1bHQ7XG4gIGlmIChleG90aWNUb1ByaW0pIHtcbiAgICBpZiAocHJlZiA9PT0gdW5kZWZpbmVkKSBwcmVmID0gJ2RlZmF1bHQnO1xuICAgIHJlc3VsdCA9IGNhbGwoZXhvdGljVG9QcmltLCBpbnB1dCwgcHJlZik7XG4gICAgaWYgKCFpc09iamVjdChyZXN1bHQpIHx8IGlzU3ltYm9sKHJlc3VsdCkpIHJldHVybiByZXN1bHQ7XG4gICAgdGhyb3cgVHlwZUVycm9yKFwiQ2FuJ3QgY29udmVydCBvYmplY3QgdG8gcHJpbWl0aXZlIHZhbHVlXCIpO1xuICB9XG4gIGlmIChwcmVmID09PSB1bmRlZmluZWQpIHByZWYgPSAnbnVtYmVyJztcbiAgcmV0dXJuIG9yZGluYXJ5VG9QcmltaXRpdmUoaW5wdXQsIHByZWYpO1xufTtcbiIsInZhciB0b1ByaW1pdGl2ZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy90by1wcmltaXRpdmUnKTtcbnZhciBpc1N5bWJvbCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9pcy1zeW1ib2wnKTtcblxuLy8gYFRvUHJvcGVydHlLZXlgIGFic3RyYWN0IG9wZXJhdGlvblxuLy8gaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy10b3Byb3BlcnR5a2V5XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChhcmd1bWVudCkge1xuICB2YXIga2V5ID0gdG9QcmltaXRpdmUoYXJndW1lbnQsICdzdHJpbmcnKTtcbiAgcmV0dXJuIGlzU3ltYm9sKGtleSkgPyBrZXkgOiBrZXkgKyAnJztcbn07XG4iLCJ2YXIgZ2xvYmFsID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2dsb2JhbCcpO1xuXG52YXIgU3RyaW5nID0gZ2xvYmFsLlN0cmluZztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoYXJndW1lbnQpIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gU3RyaW5nKGFyZ3VtZW50KTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICByZXR1cm4gJ09iamVjdCc7XG4gIH1cbn07XG4iLCJ2YXIgdW5jdXJyeVRoaXMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZnVuY3Rpb24tdW5jdXJyeS10aGlzJyk7XG5cbnZhciBpZCA9IDA7XG52YXIgcG9zdGZpeCA9IE1hdGgucmFuZG9tKCk7XG52YXIgdG9TdHJpbmcgPSB1bmN1cnJ5VGhpcygxLjAudG9TdHJpbmcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChrZXkpIHtcbiAgcmV0dXJuICdTeW1ib2woJyArIChrZXkgPT09IHVuZGVmaW5lZCA/ICcnIDoga2V5KSArICcpXycgKyB0b1N0cmluZygrK2lkICsgcG9zdGZpeCwgMzYpO1xufTtcbiIsIi8qIGVzbGludC1kaXNhYmxlIGVzL25vLXN5bWJvbCAtLSByZXF1aXJlZCBmb3IgdGVzdGluZyAqL1xudmFyIE5BVElWRV9TWU1CT0wgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvbmF0aXZlLXN5bWJvbCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IE5BVElWRV9TWU1CT0xcbiAgJiYgIVN5bWJvbC5zaGFtXG4gICYmIHR5cGVvZiBTeW1ib2wuaXRlcmF0b3IgPT0gJ3N5bWJvbCc7XG4iLCJ2YXIgREVTQ1JJUFRPUlMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZGVzY3JpcHRvcnMnKTtcbnZhciBmYWlscyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9mYWlscycpO1xuXG4vLyBWOCB+IENocm9tZSAzNi1cbi8vIGh0dHBzOi8vYnVncy5jaHJvbWl1bS5vcmcvcC92OC9pc3N1ZXMvZGV0YWlsP2lkPTMzMzRcbm1vZHVsZS5leHBvcnRzID0gREVTQ1JJUFRPUlMgJiYgZmFpbHMoZnVuY3Rpb24gKCkge1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZXMvbm8tb2JqZWN0LWRlZmluZXByb3BlcnR5IC0tIHJlcXVpcmVkIGZvciB0ZXN0aW5nXG4gIHJldHVybiBPYmplY3QuZGVmaW5lUHJvcGVydHkoZnVuY3Rpb24gKCkgeyAvKiBlbXB0eSAqLyB9LCAncHJvdG90eXBlJywge1xuICAgIHZhbHVlOiA0MixcbiAgICB3cml0YWJsZTogZmFsc2VcbiAgfSkucHJvdG90eXBlICE9IDQyO1xufSk7XG4iLCJ2YXIgZ2xvYmFsID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2dsb2JhbCcpO1xudmFyIHNoYXJlZCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9zaGFyZWQnKTtcbnZhciBoYXNPd24gPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaGFzLW93bi1wcm9wZXJ0eScpO1xudmFyIHVpZCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy91aWQnKTtcbnZhciBOQVRJVkVfU1lNQk9MID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL25hdGl2ZS1zeW1ib2wnKTtcbnZhciBVU0VfU1lNQk9MX0FTX1VJRCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy91c2Utc3ltYm9sLWFzLXVpZCcpO1xuXG52YXIgV2VsbEtub3duU3ltYm9sc1N0b3JlID0gc2hhcmVkKCd3a3MnKTtcbnZhciBTeW1ib2wgPSBnbG9iYWwuU3ltYm9sO1xudmFyIHN5bWJvbEZvciA9IFN5bWJvbCAmJiBTeW1ib2xbJ2ZvciddO1xudmFyIGNyZWF0ZVdlbGxLbm93blN5bWJvbCA9IFVTRV9TWU1CT0xfQVNfVUlEID8gU3ltYm9sIDogU3ltYm9sICYmIFN5bWJvbC53aXRob3V0U2V0dGVyIHx8IHVpZDtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAobmFtZSkge1xuICBpZiAoIWhhc093bihXZWxsS25vd25TeW1ib2xzU3RvcmUsIG5hbWUpIHx8ICEoTkFUSVZFX1NZTUJPTCB8fCB0eXBlb2YgV2VsbEtub3duU3ltYm9sc1N0b3JlW25hbWVdID09ICdzdHJpbmcnKSkge1xuICAgIHZhciBkZXNjcmlwdGlvbiA9ICdTeW1ib2wuJyArIG5hbWU7XG4gICAgaWYgKE5BVElWRV9TWU1CT0wgJiYgaGFzT3duKFN5bWJvbCwgbmFtZSkpIHtcbiAgICAgIFdlbGxLbm93blN5bWJvbHNTdG9yZVtuYW1lXSA9IFN5bWJvbFtuYW1lXTtcbiAgICB9IGVsc2UgaWYgKFVTRV9TWU1CT0xfQVNfVUlEICYmIHN5bWJvbEZvcikge1xuICAgICAgV2VsbEtub3duU3ltYm9sc1N0b3JlW25hbWVdID0gc3ltYm9sRm9yKGRlc2NyaXB0aW9uKTtcbiAgICB9IGVsc2Uge1xuICAgICAgV2VsbEtub3duU3ltYm9sc1N0b3JlW25hbWVdID0gY3JlYXRlV2VsbEtub3duU3ltYm9sKGRlc2NyaXB0aW9uKTtcbiAgICB9XG4gIH0gcmV0dXJuIFdlbGxLbm93blN5bWJvbHNTdG9yZVtuYW1lXTtcbn07XG4iLCJ2YXIgJCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9leHBvcnQnKTtcbnZhciBiaW5kID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2Z1bmN0aW9uLWJpbmQnKTtcblxuLy8gYEZ1bmN0aW9uLnByb3RvdHlwZS5iaW5kYCBtZXRob2Rcbi8vIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtZnVuY3Rpb24ucHJvdG90eXBlLmJpbmRcbiQoeyB0YXJnZXQ6ICdGdW5jdGlvbicsIHByb3RvOiB0cnVlLCBmb3JjZWQ6IEZ1bmN0aW9uLmJpbmQgIT09IGJpbmQgfSwge1xuICBiaW5kOiBiaW5kXG59KTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBpc0NhbGxhYmxlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2lzLWNhbGxhYmxlJyk7XG52YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaXMtb2JqZWN0Jyk7XG52YXIgZGVmaW5lUHJvcGVydHlNb2R1bGUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvb2JqZWN0LWRlZmluZS1wcm9wZXJ0eScpO1xudmFyIGdldFByb3RvdHlwZU9mID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL29iamVjdC1nZXQtcHJvdG90eXBlLW9mJyk7XG52YXIgd2VsbEtub3duU3ltYm9sID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3dlbGwta25vd24tc3ltYm9sJyk7XG5cbnZhciBIQVNfSU5TVEFOQ0UgPSB3ZWxsS25vd25TeW1ib2woJ2hhc0luc3RhbmNlJyk7XG52YXIgRnVuY3Rpb25Qcm90b3R5cGUgPSBGdW5jdGlvbi5wcm90b3R5cGU7XG5cbi8vIGBGdW5jdGlvbi5wcm90b3R5cGVbQEBoYXNJbnN0YW5jZV1gIG1ldGhvZFxuLy8gaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy1mdW5jdGlvbi5wcm90b3R5cGUtQEBoYXNpbnN0YW5jZVxuaWYgKCEoSEFTX0lOU1RBTkNFIGluIEZ1bmN0aW9uUHJvdG90eXBlKSkge1xuICBkZWZpbmVQcm9wZXJ0eU1vZHVsZS5mKEZ1bmN0aW9uUHJvdG90eXBlLCBIQVNfSU5TVEFOQ0UsIHsgdmFsdWU6IGZ1bmN0aW9uIChPKSB7XG4gICAgaWYgKCFpc0NhbGxhYmxlKHRoaXMpIHx8ICFpc09iamVjdChPKSkgcmV0dXJuIGZhbHNlO1xuICAgIHZhciBQID0gdGhpcy5wcm90b3R5cGU7XG4gICAgaWYgKCFpc09iamVjdChQKSkgcmV0dXJuIE8gaW5zdGFuY2VvZiB0aGlzO1xuICAgIC8vIGZvciBlbnZpcm9ubWVudCB3L28gbmF0aXZlIGBAQGhhc0luc3RhbmNlYCBsb2dpYyBlbm91Z2ggYGluc3RhbmNlb2ZgLCBidXQgYWRkIHRoaXM6XG4gICAgd2hpbGUgKE8gPSBnZXRQcm90b3R5cGVPZihPKSkgaWYgKFAgPT09IE8pIHJldHVybiB0cnVlO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfSB9KTtcbn1cbiIsInZhciBERVNDUklQVE9SUyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9kZXNjcmlwdG9ycycpO1xudmFyIEZVTkNUSU9OX05BTUVfRVhJU1RTID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2Z1bmN0aW9uLW5hbWUnKS5FWElTVFM7XG52YXIgdW5jdXJyeVRoaXMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZnVuY3Rpb24tdW5jdXJyeS10aGlzJyk7XG52YXIgZGVmaW5lUHJvcGVydHkgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvb2JqZWN0LWRlZmluZS1wcm9wZXJ0eScpLmY7XG5cbnZhciBGdW5jdGlvblByb3RvdHlwZSA9IEZ1bmN0aW9uLnByb3RvdHlwZTtcbnZhciBmdW5jdGlvblRvU3RyaW5nID0gdW5jdXJyeVRoaXMoRnVuY3Rpb25Qcm90b3R5cGUudG9TdHJpbmcpO1xudmFyIG5hbWVSRSA9IC9mdW5jdGlvblxcYig/Olxcc3xcXC9cXCpbXFxTXFxzXSo/XFwqXFwvfFxcL1xcL1teXFxuXFxyXSpbXFxuXFxyXSspKihbXlxccygvXSopLztcbnZhciByZWdFeHBFeGVjID0gdW5jdXJyeVRoaXMobmFtZVJFLmV4ZWMpO1xudmFyIE5BTUUgPSAnbmFtZSc7XG5cbi8vIEZ1bmN0aW9uIGluc3RhbmNlcyBgLm5hbWVgIHByb3BlcnR5XG4vLyBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLWZ1bmN0aW9uLWluc3RhbmNlcy1uYW1lXG5pZiAoREVTQ1JJUFRPUlMgJiYgIUZVTkNUSU9OX05BTUVfRVhJU1RTKSB7XG4gIGRlZmluZVByb3BlcnR5KEZ1bmN0aW9uUHJvdG90eXBlLCBOQU1FLCB7XG4gICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgcmV0dXJuIHJlZ0V4cEV4ZWMobmFtZVJFLCBmdW5jdGlvblRvU3RyaW5nKHRoaXMpKVsxXTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIHJldHVybiAnJztcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xufVxuIiwiLy8gZXh0cmFjdGVkIGJ5IG1pbmktY3NzLWV4dHJhY3QtcGx1Z2luXG5leHBvcnQge307IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcblx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG5cdFx0ZnVuY3Rpb24oKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG5cdFx0ZnVuY3Rpb24oKSB7IHJldHVybiBtb2R1bGU7IH07XG5cdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsIHsgYTogZ2V0dGVyIH0pO1xuXHRyZXR1cm4gZ2V0dGVyO1xufTsiLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBkZWZpbml0aW9uKSB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18uZyA9IChmdW5jdGlvbigpIHtcblx0aWYgKHR5cGVvZiBnbG9iYWxUaGlzID09PSAnb2JqZWN0JykgcmV0dXJuIGdsb2JhbFRoaXM7XG5cdHRyeSB7XG5cdFx0cmV0dXJuIHRoaXMgfHwgbmV3IEZ1bmN0aW9uKCdyZXR1cm4gdGhpcycpKCk7XG5cdH0gY2F0Y2ggKGUpIHtcblx0XHRpZiAodHlwZW9mIHdpbmRvdyA9PT0gJ29iamVjdCcpIHJldHVybiB3aW5kb3c7XG5cdH1cbn0pKCk7IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqLCBwcm9wKSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKTsgfSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiLyogbWF5IG5vdCBiZSBhYmxlIHRvIGltcG9ydCBwZz8gKi9cbmltcG9ydCBheGlvcyBmcm9tICdheGlvcyc7XG5pbXBvcnQgJy4vbWFpbi5zY3NzJzsgLyogZm9yIHN0eWxlc2hlZXQgKi9cblxuLyogQkVMT1c6IFRlc3QgZXhhbXBsZXMgZm9yIGltcG9ydGluZyBtb2R1bGVzIHRvIGZyb250LWVuZCAqL1xuaW1wb3J0IHsgbW91c2UgfSBmcm9tICcuL21vdXNlLmpzJztcbmltcG9ydCAnY29yZS1qcy9lcy9mdW5jdGlvbic7XG5pbXBvcnQgeyBhcnJvdyB9IGZyb20gJy4vYXJyb3dGbi5qcyc7XG5cbmNvbnNvbGUubG9nKCdUaGlzIGlzIGZyb20gaW5kZXguanMnKTtcbmNvbnNvbGUubG9nKCdUaGlzIGlzIGZyb20gY2F0LmpzJywgY2F0KTtcbmNvbnNvbGUubG9nKCdUaGlzIGlzIGZyb20gbW91c2UuanMnLCBtb3VzZSk7XG5cbmNvbnN0IG9iaiA9IHtcbiAgYTogJ2FwcGxlJyxcbiAgYjogJ2J1ZmZhbG8nLFxufTtcblxuY29uc3QgbmV3T2JqID0geyAuLi5vYmosIGM6ICdjaGVldGFoJyB9O1xuY29uc29sZS5sb2coJ25ldyBvYmonLCBuZXdPYmopO1xuXG5jb25zdCByZXN1bHQgPSBhcnJvdygpO1xuY29uc29sZS5sb2coJ3Jlc3VsdCcsIHJlc3VsdCk7XG4vKiBBQk9WRTogVGVzdCBleGFtcGxlcyBmb3IgaW1wb3J0aW5nIG1vZHVsZXMgdG8gZnJvbnQtZW5kICovXG5cblxuLy8gVGVzdCBFeGFtcGxlOiBNYWtlIGEgcmVxdWVzdCBmb3IgYWxsIHRoZSBpdGVtc1xuYXhpb3MuZ2V0KCcvaXRlbXMnKVxuICAudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAvLyBoYW5kbGUgc3VjY2Vzc1xuICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlLmRhdGEuaXRlbXMpO1xuXG4gICAgY29uc3QgaXRlbUNvbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblxuICAgIHJlc3BvbnNlLmRhdGEuaXRlbXMuZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgICAgY29uc3QgaXRlbUVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICBpdGVtRWwuaW5uZXJUZXh0ID0gSlNPTi5zdHJpbmdpZnkoaXRlbSk7XG4gICAgICBpdGVtRWwuY2xhc3NMaXN0LmFkZCgnaXRlbScpO1xuICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChpdGVtRWwpO1xuICAgIH0pO1xuXG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChpdGVtQ29udCk7XG4gIH0pXG4gIC5jYXRjaCgoZXJyb3IpID0+IHtcbiAgICAvLyBoYW5kbGUgZXJyb3JcbiAgICBjb25zb2xlLmxvZyhlcnJvcik7XG4gIH0pO1xuXG4gICJdLCJuYW1lcyI6WyJtb2R1bGUiLCJleHBvcnRzIiwicmVxdWlyZSIsInV0aWxzIiwic2V0dGxlIiwiY29va2llcyIsImJ1aWxkVVJMIiwiYnVpbGRGdWxsUGF0aCIsInBhcnNlSGVhZGVycyIsImlzVVJMU2FtZU9yaWdpbiIsImNyZWF0ZUVycm9yIiwidHJhbnNpdGlvbmFsRGVmYXVsdHMiLCJDYW5jZWwiLCJ4aHJBZGFwdGVyIiwiY29uZmlnIiwiUHJvbWlzZSIsImRpc3BhdGNoWGhyUmVxdWVzdCIsInJlc29sdmUiLCJyZWplY3QiLCJyZXF1ZXN0RGF0YSIsImRhdGEiLCJyZXF1ZXN0SGVhZGVycyIsImhlYWRlcnMiLCJyZXNwb25zZVR5cGUiLCJvbkNhbmNlbGVkIiwiZG9uZSIsImNhbmNlbFRva2VuIiwidW5zdWJzY3JpYmUiLCJzaWduYWwiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwiaXNGb3JtRGF0YSIsInJlcXVlc3QiLCJYTUxIdHRwUmVxdWVzdCIsImF1dGgiLCJ1c2VybmFtZSIsInBhc3N3b3JkIiwidW5lc2NhcGUiLCJlbmNvZGVVUklDb21wb25lbnQiLCJBdXRob3JpemF0aW9uIiwiYnRvYSIsImZ1bGxQYXRoIiwiYmFzZVVSTCIsInVybCIsIm9wZW4iLCJtZXRob2QiLCJ0b1VwcGVyQ2FzZSIsInBhcmFtcyIsInBhcmFtc1NlcmlhbGl6ZXIiLCJ0aW1lb3V0Iiwib25sb2FkZW5kIiwicmVzcG9uc2VIZWFkZXJzIiwiZ2V0QWxsUmVzcG9uc2VIZWFkZXJzIiwicmVzcG9uc2VEYXRhIiwicmVzcG9uc2VUZXh0IiwicmVzcG9uc2UiLCJzdGF0dXMiLCJzdGF0dXNUZXh0IiwiX3Jlc29sdmUiLCJ2YWx1ZSIsIl9yZWplY3QiLCJlcnIiLCJvbnJlYWR5c3RhdGVjaGFuZ2UiLCJoYW5kbGVMb2FkIiwicmVhZHlTdGF0ZSIsInJlc3BvbnNlVVJMIiwiaW5kZXhPZiIsInNldFRpbWVvdXQiLCJvbmFib3J0IiwiaGFuZGxlQWJvcnQiLCJvbmVycm9yIiwiaGFuZGxlRXJyb3IiLCJvbnRpbWVvdXQiLCJoYW5kbGVUaW1lb3V0IiwidGltZW91dEVycm9yTWVzc2FnZSIsInRyYW5zaXRpb25hbCIsImNsYXJpZnlUaW1lb3V0RXJyb3IiLCJpc1N0YW5kYXJkQnJvd3NlckVudiIsInhzcmZWYWx1ZSIsIndpdGhDcmVkZW50aWFscyIsInhzcmZDb29raWVOYW1lIiwicmVhZCIsInVuZGVmaW5lZCIsInhzcmZIZWFkZXJOYW1lIiwiZm9yRWFjaCIsInNldFJlcXVlc3RIZWFkZXIiLCJ2YWwiLCJrZXkiLCJ0b0xvd2VyQ2FzZSIsImlzVW5kZWZpbmVkIiwib25Eb3dubG9hZFByb2dyZXNzIiwiYWRkRXZlbnRMaXN0ZW5lciIsIm9uVXBsb2FkUHJvZ3Jlc3MiLCJ1cGxvYWQiLCJjYW5jZWwiLCJ0eXBlIiwiYWJvcnQiLCJzdWJzY3JpYmUiLCJhYm9ydGVkIiwic2VuZCIsImJpbmQiLCJBeGlvcyIsIm1lcmdlQ29uZmlnIiwiZGVmYXVsdHMiLCJjcmVhdGVJbnN0YW5jZSIsImRlZmF1bHRDb25maWciLCJjb250ZXh0IiwiaW5zdGFuY2UiLCJwcm90b3R5cGUiLCJleHRlbmQiLCJjcmVhdGUiLCJpbnN0YW5jZUNvbmZpZyIsImF4aW9zIiwiQ2FuY2VsVG9rZW4iLCJpc0NhbmNlbCIsIlZFUlNJT04iLCJ2ZXJzaW9uIiwiYWxsIiwicHJvbWlzZXMiLCJzcHJlYWQiLCJpc0F4aW9zRXJyb3IiLCJkZWZhdWx0IiwibWVzc2FnZSIsInRvU3RyaW5nIiwiX19DQU5DRUxfXyIsImV4ZWN1dG9yIiwiVHlwZUVycm9yIiwicmVzb2x2ZVByb21pc2UiLCJwcm9taXNlIiwicHJvbWlzZUV4ZWN1dG9yIiwidG9rZW4iLCJ0aGVuIiwiX2xpc3RlbmVycyIsImkiLCJsIiwibGVuZ3RoIiwib25mdWxmaWxsZWQiLCJyZWFzb24iLCJ0aHJvd0lmUmVxdWVzdGVkIiwibGlzdGVuZXIiLCJwdXNoIiwiaW5kZXgiLCJzcGxpY2UiLCJzb3VyY2UiLCJjIiwiSW50ZXJjZXB0b3JNYW5hZ2VyIiwiZGlzcGF0Y2hSZXF1ZXN0IiwidmFsaWRhdG9yIiwidmFsaWRhdG9ycyIsImludGVyY2VwdG9ycyIsImNvbmZpZ09yVXJsIiwiYXNzZXJ0T3B0aW9ucyIsInNpbGVudEpTT05QYXJzaW5nIiwiYm9vbGVhbiIsImZvcmNlZEpTT05QYXJzaW5nIiwicmVxdWVzdEludGVyY2VwdG9yQ2hhaW4iLCJzeW5jaHJvbm91c1JlcXVlc3RJbnRlcmNlcHRvcnMiLCJ1bnNoaWZ0UmVxdWVzdEludGVyY2VwdG9ycyIsImludGVyY2VwdG9yIiwicnVuV2hlbiIsInN5bmNocm9ub3VzIiwidW5zaGlmdCIsImZ1bGZpbGxlZCIsInJlamVjdGVkIiwicmVzcG9uc2VJbnRlcmNlcHRvckNoYWluIiwicHVzaFJlc3BvbnNlSW50ZXJjZXB0b3JzIiwiY2hhaW4iLCJBcnJheSIsImFwcGx5IiwiY29uY2F0Iiwic2hpZnQiLCJuZXdDb25maWciLCJvbkZ1bGZpbGxlZCIsIm9uUmVqZWN0ZWQiLCJlcnJvciIsImdldFVyaSIsInJlcGxhY2UiLCJmb3JFYWNoTWV0aG9kTm9EYXRhIiwiZm9yRWFjaE1ldGhvZFdpdGhEYXRhIiwiaGFuZGxlcnMiLCJ1c2UiLCJvcHRpb25zIiwiZWplY3QiLCJpZCIsImZuIiwiZm9yRWFjaEhhbmRsZXIiLCJoIiwiaXNBYnNvbHV0ZVVSTCIsImNvbWJpbmVVUkxzIiwicmVxdWVzdGVkVVJMIiwiZW5oYW5jZUVycm9yIiwiY29kZSIsIkVycm9yIiwidHJhbnNmb3JtRGF0YSIsInRocm93SWZDYW5jZWxsYXRpb25SZXF1ZXN0ZWQiLCJjYWxsIiwidHJhbnNmb3JtUmVxdWVzdCIsIm1lcmdlIiwiY29tbW9uIiwiY2xlYW5IZWFkZXJDb25maWciLCJhZGFwdGVyIiwib25BZGFwdGVyUmVzb2x1dGlvbiIsInRyYW5zZm9ybVJlc3BvbnNlIiwib25BZGFwdGVyUmVqZWN0aW9uIiwidG9KU09OIiwibmFtZSIsImRlc2NyaXB0aW9uIiwibnVtYmVyIiwiZmlsZU5hbWUiLCJsaW5lTnVtYmVyIiwiY29sdW1uTnVtYmVyIiwic3RhY2siLCJjb25maWcxIiwiY29uZmlnMiIsImdldE1lcmdlZFZhbHVlIiwidGFyZ2V0IiwiaXNQbGFpbk9iamVjdCIsImlzQXJyYXkiLCJzbGljZSIsIm1lcmdlRGVlcFByb3BlcnRpZXMiLCJwcm9wIiwidmFsdWVGcm9tQ29uZmlnMiIsImRlZmF1bHRUb0NvbmZpZzIiLCJtZXJnZURpcmVjdEtleXMiLCJtZXJnZU1hcCIsIk9iamVjdCIsImtleXMiLCJjb21wdXRlQ29uZmlnVmFsdWUiLCJjb25maWdWYWx1ZSIsInZhbGlkYXRlU3RhdHVzIiwiZm5zIiwidHJhbnNmb3JtIiwibm9ybWFsaXplSGVhZGVyTmFtZSIsIkRFRkFVTFRfQ09OVEVOVF9UWVBFIiwic2V0Q29udGVudFR5cGVJZlVuc2V0IiwiZ2V0RGVmYXVsdEFkYXB0ZXIiLCJwcm9jZXNzIiwic3RyaW5naWZ5U2FmZWx5IiwicmF3VmFsdWUiLCJwYXJzZXIiLCJlbmNvZGVyIiwiaXNTdHJpbmciLCJKU09OIiwicGFyc2UiLCJ0cmltIiwiZSIsInN0cmluZ2lmeSIsImlzQXJyYXlCdWZmZXIiLCJpc0J1ZmZlciIsImlzU3RyZWFtIiwiaXNGaWxlIiwiaXNCbG9iIiwiaXNBcnJheUJ1ZmZlclZpZXciLCJidWZmZXIiLCJpc1VSTFNlYXJjaFBhcmFtcyIsImlzT2JqZWN0Iiwic3RyaWN0SlNPTlBhcnNpbmciLCJtYXhDb250ZW50TGVuZ3RoIiwibWF4Qm9keUxlbmd0aCIsInRoaXNBcmciLCJ3cmFwIiwiYXJncyIsImFyZ3VtZW50cyIsImVuY29kZSIsInNlcmlhbGl6ZWRQYXJhbXMiLCJwYXJ0cyIsInNlcmlhbGl6ZSIsInBhcnNlVmFsdWUiLCJ2IiwiaXNEYXRlIiwidG9JU09TdHJpbmciLCJqb2luIiwiaGFzaG1hcmtJbmRleCIsInJlbGF0aXZlVVJMIiwic3RhbmRhcmRCcm93c2VyRW52Iiwid3JpdGUiLCJleHBpcmVzIiwicGF0aCIsImRvbWFpbiIsInNlY3VyZSIsImNvb2tpZSIsImlzTnVtYmVyIiwiRGF0ZSIsInRvR01UU3RyaW5nIiwiZG9jdW1lbnQiLCJtYXRjaCIsIlJlZ0V4cCIsImRlY29kZVVSSUNvbXBvbmVudCIsInJlbW92ZSIsIm5vdyIsIm5vblN0YW5kYXJkQnJvd3NlckVudiIsInRlc3QiLCJwYXlsb2FkIiwibXNpZSIsIm5hdmlnYXRvciIsInVzZXJBZ2VudCIsInVybFBhcnNpbmdOb2RlIiwiY3JlYXRlRWxlbWVudCIsIm9yaWdpblVSTCIsInJlc29sdmVVUkwiLCJocmVmIiwic2V0QXR0cmlidXRlIiwicHJvdG9jb2wiLCJob3N0Iiwic2VhcmNoIiwiaGFzaCIsImhvc3RuYW1lIiwicG9ydCIsInBhdGhuYW1lIiwiY2hhckF0Iiwid2luZG93IiwibG9jYXRpb24iLCJyZXF1ZXN0VVJMIiwicGFyc2VkIiwibm9ybWFsaXplZE5hbWUiLCJwcm9jZXNzSGVhZGVyIiwiaWdub3JlRHVwbGljYXRlT2YiLCJzcGxpdCIsImxpbmUiLCJzdWJzdHIiLCJjYWxsYmFjayIsImFyciIsInRoaW5nIiwiZGVwcmVjYXRlZFdhcm5pbmdzIiwiZm9ybWF0TWVzc2FnZSIsIm9wdCIsImRlc2MiLCJvcHRzIiwiY29uc29sZSIsIndhcm4iLCJzY2hlbWEiLCJhbGxvd1Vua25vd24iLCJyZXN1bHQiLCJjb25zdHJ1Y3RvciIsIkFycmF5QnVmZmVyIiwiaXNWaWV3IiwiZ2V0UHJvdG90eXBlT2YiLCJpc0Z1bmN0aW9uIiwicGlwZSIsInN0ciIsInByb2R1Y3QiLCJvYmoiLCJoYXNPd25Qcm9wZXJ0eSIsImFzc2lnblZhbHVlIiwiYSIsImIiLCJzdHJpcEJPTSIsImNvbnRlbnQiLCJjaGFyQ29kZUF0IiwiYXJyb3ciLCJtb3VzZSIsIkZ1bmN0aW9uIiwiZ2xvYmFsIiwiaXNDYWxsYWJsZSIsInRyeVRvU3RyaW5nIiwiYXJndW1lbnQiLCJTdHJpbmciLCJ0b0luZGV4ZWRPYmplY3QiLCJ0b0Fic29sdXRlSW5kZXgiLCJsZW5ndGhPZkFycmF5TGlrZSIsImNyZWF0ZU1ldGhvZCIsIklTX0lOQ0xVREVTIiwiJHRoaXMiLCJlbCIsImZyb21JbmRleCIsIk8iLCJpbmNsdWRlcyIsInVuY3VycnlUaGlzIiwic3RyaW5nU2xpY2UiLCJpdCIsImhhc093biIsIm93bktleXMiLCJnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JNb2R1bGUiLCJkZWZpbmVQcm9wZXJ0eU1vZHVsZSIsImV4Y2VwdGlvbnMiLCJkZWZpbmVQcm9wZXJ0eSIsImYiLCJnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IiLCJmYWlscyIsIkYiLCJERVNDUklQVE9SUyIsImNyZWF0ZVByb3BlcnR5RGVzY3JpcHRvciIsIm9iamVjdCIsImJpdG1hcCIsImVudW1lcmFibGUiLCJjb25maWd1cmFibGUiLCJ3cml0YWJsZSIsImdldCIsIkVYSVNUUyIsImdldEJ1aWx0SW4iLCJEZW5vIiwidmVyc2lvbnMiLCJ2OCIsImNyZWF0ZU5vbkVudW1lcmFibGVQcm9wZXJ0eSIsInJlZGVmaW5lIiwic2V0R2xvYmFsIiwiY29weUNvbnN0cnVjdG9yUHJvcGVydGllcyIsImlzRm9yY2VkIiwiVEFSR0VUIiwiR0xPQkFMIiwiU1RBVElDIiwic3RhdCIsIkZPUkNFRCIsInRhcmdldFByb3BlcnR5Iiwic291cmNlUHJvcGVydHkiLCJkZXNjcmlwdG9yIiwibm9UYXJnZXRHZXQiLCJmb3JjZWQiLCJzaGFtIiwiZXhlYyIsImFDYWxsYWJsZSIsImFycmF5U2xpY2UiLCJOQVRJVkVfQklORCIsImZhY3RvcmllcyIsImNvbnN0cnVjdCIsIkMiLCJhcmdzTGVuZ3RoIiwibGlzdCIsInRoYXQiLCJQcm90b3R5cGUiLCJwYXJ0QXJncyIsImJvdW5kRnVuY3Rpb24iLCJib3VuZCIsIkZ1bmN0aW9uUHJvdG90eXBlIiwiZ2V0RGVzY3JpcHRvciIsIlBST1BFUiIsInNvbWV0aGluZyIsIkNPTkZJR1VSQUJMRSIsImFGdW5jdGlvbiIsIm5hbWVzcGFjZSIsIlYiLCJQIiwiZnVuYyIsImNoZWNrIiwiTWF0aCIsImdsb2JhbFRoaXMiLCJzZWxmIiwidG9PYmplY3QiLCJjbGFzc29mIiwicHJvcGVydHlJc0VudW1lcmFibGUiLCJzdG9yZSIsImZ1bmN0aW9uVG9TdHJpbmciLCJpbnNwZWN0U291cmNlIiwiTkFUSVZFX1dFQUtfTUFQIiwic2hhcmVkIiwic2hhcmVkS2V5IiwiaGlkZGVuS2V5cyIsIk9CSkVDVF9BTFJFQURZX0lOSVRJQUxJWkVEIiwiV2Vha01hcCIsInNldCIsImhhcyIsImVuZm9yY2UiLCJnZXR0ZXJGb3IiLCJUWVBFIiwic3RhdGUiLCJ3bWdldCIsIndtaGFzIiwid21zZXQiLCJtZXRhZGF0YSIsImZhY2FkZSIsIlNUQVRFIiwicmVwbGFjZW1lbnQiLCJmZWF0dXJlIiwiZGV0ZWN0aW9uIiwibm9ybWFsaXplIiwiUE9MWUZJTEwiLCJOQVRJVkUiLCJzdHJpbmciLCJpc1Byb3RvdHlwZU9mIiwiVVNFX1NZTUJPTF9BU19VSUQiLCIkU3ltYm9sIiwidG9MZW5ndGgiLCJWOF9WRVJTSU9OIiwiZ2V0T3duUHJvcGVydHlTeW1ib2xzIiwic3ltYm9sIiwiU3ltYm9sIiwiSUU4X0RPTV9ERUZJTkUiLCJWOF9QUk9UT1RZUEVfREVGSU5FX0JVRyIsImFuT2JqZWN0IiwidG9Qcm9wZXJ0eUtleSIsIiRkZWZpbmVQcm9wZXJ0eSIsIiRnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IiLCJFTlVNRVJBQkxFIiwiV1JJVEFCTEUiLCJBdHRyaWJ1dGVzIiwiY3VycmVudCIsInByb3BlcnR5SXNFbnVtZXJhYmxlTW9kdWxlIiwiaW50ZXJuYWxPYmplY3RLZXlzIiwiZW51bUJ1Z0tleXMiLCJnZXRPd25Qcm9wZXJ0eU5hbWVzIiwiQ09SUkVDVF9QUk9UT1RZUEVfR0VUVEVSIiwiSUVfUFJPVE8iLCJPYmplY3RQcm90b3R5cGUiLCJuYW1lcyIsIiRwcm9wZXJ0eUlzRW51bWVyYWJsZSIsIk5BU0hPUk5fQlVHIiwiaW5wdXQiLCJwcmVmIiwidmFsdWVPZiIsImdldE93blByb3BlcnR5TmFtZXNNb2R1bGUiLCJnZXRPd25Qcm9wZXJ0eVN5bWJvbHNNb2R1bGUiLCJJbnRlcm5hbFN0YXRlTW9kdWxlIiwiQ09ORklHVVJBQkxFX0ZVTkNUSU9OX05BTUUiLCJnZXRJbnRlcm5hbFN0YXRlIiwiZW5mb3JjZUludGVybmFsU3RhdGUiLCJURU1QTEFURSIsInVuc2FmZSIsInNpbXBsZSIsInVpZCIsIlNIQVJFRCIsIklTX1BVUkUiLCJtb2RlIiwiY29weXJpZ2h0IiwibGljZW5zZSIsInRvSW50ZWdlck9ySW5maW5pdHkiLCJtYXgiLCJtaW4iLCJpbnRlZ2VyIiwiSW5kZXhlZE9iamVjdCIsInJlcXVpcmVPYmplY3RDb2VyY2libGUiLCJjZWlsIiwiZmxvb3IiLCJpc1N5bWJvbCIsImdldE1ldGhvZCIsIm9yZGluYXJ5VG9QcmltaXRpdmUiLCJ3ZWxsS25vd25TeW1ib2wiLCJUT19QUklNSVRJVkUiLCJleG90aWNUb1ByaW0iLCJ0b1ByaW1pdGl2ZSIsInBvc3RmaXgiLCJyYW5kb20iLCJOQVRJVkVfU1lNQk9MIiwiaXRlcmF0b3IiLCJXZWxsS25vd25TeW1ib2xzU3RvcmUiLCJzeW1ib2xGb3IiLCJjcmVhdGVXZWxsS25vd25TeW1ib2wiLCJ3aXRob3V0U2V0dGVyIiwiJCIsInByb3RvIiwiSEFTX0lOU1RBTkNFIiwiRlVOQ1RJT05fTkFNRV9FWElTVFMiLCJuYW1lUkUiLCJyZWdFeHBFeGVjIiwiTkFNRSIsImxvZyIsImNhdCIsIm5ld09iaiIsIml0ZW1zIiwiaXRlbUNvbnQiLCJpdGVtIiwiaXRlbUVsIiwiaW5uZXJUZXh0IiwiY2xhc3NMaXN0IiwiYWRkIiwiYm9keSIsImFwcGVuZENoaWxkIiwiY2F0Y2giXSwic291cmNlUm9vdCI6IiJ9