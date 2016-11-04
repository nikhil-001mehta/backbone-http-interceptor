var vent;
(function(backboneHttpInterceptor){
	'use strict';
    if (typeof define === 'function' && define.amd) {
        define('backboneHttpInterceptor', ['jquery', 'backbone', 'underscore', 'vent'], backboneHttpInterceptor);
    } else if(typeof module !== 'undefined' && module.exports) {
        // CommonJS
		var jq = require('jquery'),bb =	require('backbone'),underscore = require('underscore');
        module.exports = backboneHttpInterceptor(jq,bb,underscore);
    } else {
        backboneHttpInterceptor($, Backbone, _, vent);
    }
}(function($, Backbone, underscore){
	'use strict';
	if(!Backbone){
		throw 'Please include Backbone.js before Backbone.HttpInterceptor.js';
	}
	
	Backbone.HttpInterceptor = function(){
        _.bindAll.apply(_, [this].concat(_.functions(this)));
    };

	var _xhrArray = [];
	var _options = {};
	var _showSpinner,_showToaster;
	
	var _removeCompletedXhrs = function(){
		return underscore.reject(_xhrArray, function(xhr) {
				//remove all xhrs which are completed since we can not abort them
				return 4 === xhr.readyState;
		});
	};
	// here options can contain the text which you want to show on spinner and toaster
    var _showSpinnerandToaster = function(method, options) {
        if("create" === method || "update" === method || "patch" === method || "read" === method) {
            //show spinner
			$(_options.spinnerTextSelector).text(options.spinnerText || _options.defaultSpinnerText);
			$(_options.spinnerSelector).css('display', _options.spinnerDisplayStyle || 'block');
        }
        //using once here because none of this will be called twice
        //'sync' event is fired on the model/collection when ajax gets succeeded
        this.once("sync", function() {
            _xhrArray = _removeCompletedXhrs();
			//hide the spinner if no pending in process ajax
			if(_xhrArray.length === 0){
				$(_options.spinnerSelector).css('display', 'none');
			}
			//show success toaster
			if(!options.doNotshowToaster && _showToaster){
				$(_options.toasterSelector).addClass(_options.toasterSuccessClass);
				$(_options.toasterTextSelector).text(options.toasterText || _options.defaultToasterText);
				$(_options.toasterSelector).css('display', _options.toasterDisplayStyle);
				$(_options.toasterSelector).delay(5000).fadeOut('slow');
				$(_options.toasterSelector).removeClass(_options.toasterSuccessClass);
			}
            //remove cancelRequest since now on you can not abort the AJAX
            if(this.cancelRequest) delete this.cancelRequest;
            //remove error callback since it will not be called now
            this.off("error");
        });
        //'error' event is fired on the model/collection when ajax fails
        this.once("error", function(model, xhr) {
			//hide the spinner
			$(_options.spinnerSelector).css('display', 'none');
            //show error toaster if the xhr.statusText !== "abort"
			if(xhr.statusText !== "abort" && !options.doNotshowToaster && _showToaster){
				$(_options.toasterSelector).addClass(_options.toasterErrorClass);
				$(_options.toasterTextSelector).text(options.toasterText || _options.defaultToasterText);
				$(_options.toasterSelector).css('display', _options.toasterDisplayStyle);
				$(_options.toasterSelector).delay(5000).fadeOut('slow');
				$(_options.toasterSelector).removeClass(_options.toasterErrorClass);
			}
            //remove cancelRequest since now on you can not abort the AJAX
            if(this.cancelRequest) delete this.cancelRequest;
            //remove sync callback since it will not be called now
            this.off("sync");
        });
    };
	
	var abortAllPendingXhrs = function() {
		underscore.invoke(_xhrArray, "abort");
		_xhrArray = [];
	};
	
	var setInterceptorOptions = function(options){
		/*
		 options can contain
		 options = {
			spinnerSelector: 'unique selector for showing/hiding the spinner during ajax request is in progress',
			spinnerTextSelector: 'unique selector to show text in spinner i.e. saving/loading/processing etc',
			defaultSpinnerText: 'Texr to show in spinner when nothing is paased in options to backbone.fetch/backbone.save'
			spinnerDisplayStyle: 'block/flex/inline etc'
			toasterSelector: 'unique selector for showing/hiding the spinner after ajax request is processed',
			toasterTextSelector: 'unique selector to show text in toaster',
			defaultToasterText: 'Texr to show in toaster when nothing is paased in options to backbone.fetch/backbone.save'
			toasterDisplayStyle: 'block/flex/inline etc'
			toasterSuccessClass: 'class to apply to toasterSelector when ajax request is succeeds',
			toasterErrorClass: 'class to apply to toasterSelector when ajax request is fails',
		 }
		*/
        if(!options){
			throw 'Please pass options to Backbone.HttpInterceptor.start';
		}
		_options = _.extend(_options, options);
		_showSpinner = !!options.spinnerSelector;
		_showToaster = !!options.toasterSelector;
    };
	
	var startHttpInterceptor = function(options){
		setInterceptorOptions(options);
		Backbone.Model.prototype.sync = Backbone.Collection.prototype.sync = function(method, model, options) {
			var proxiedShowSpinnerandToaster = underscore.bind(_showSpinnerandToaster, this);
			var xhr = Backbone.sync.apply(this, arguments);
			if(!options.doNotshowSpinner && _showSpinner) {
				proxiedShowSpinnerandToaster(method, options);
			}
			if(!options.doNotAbort){
				_xhrArray.push(xhr);
				this.cancelRequest = function(){
					//invoke cancelRequest on model if you want to abort the AJAX call
					xhr.abort();
				};
			}
			_xhrArray = _removeCompletedXhrs();
			return xhr;
		};
	};
	
	Backbone.HttpInterceptor.VERSION = '1.0.0';
    
	_.extend(Backbone.HttpInterceptor.prototype, {
		setOptions : setInterceptorOptions,
		start: startHttpInterceptor,
		abortAllPendingRequests : abortAllPendingXhrs
	});
	return Backbone.httpInterceptor;
}));
