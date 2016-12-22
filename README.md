# backbone-http-interceptor
it is a general purpose ajax interceptor for backbone and backbone.marionette framework or any other framework which is build on top of backbone.js.<br/>
Using this project you can intercept every ajax request which is fired using backbone models/collections fetch/save method.<br/>
During interceptions we given you some default options as below to show/hide spinner/toaster. By modifying the cource code you can also add your custom headers to your request/response.<br/>

See example for more information.

#Installation
simply include this plugin after everything is loaded except your files
&lt;script src="https://code.jquery.com/jquery-3.1.1.js"&gt; &lt;&#47;script&gt;
&lt;script src="https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore.js"&gt; &lt&#47;script&gt;
&lt;script src="https://cdnjs.cloudflare.com/ajax/libs/backbone.js/1.3.3/backbone.js"&gt; &lt;&#47;script&gt;
&lt;script src="http://rawgit.com/nikhil-001mehta/backbone-http-interceptor/master/release/backbone.httpInterceptor.min.js"&gt; &lt;&#47;script&gt;
&lt;your files here afterwards&gt;

#Usage
<pre>
var backboneInterceptor = new Backbone.HttpInterceptor
			backboneInterceptor.start(options object);
</pre>

#available options are
<pre>
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
		 };
</pre>

after installation simply call fetch/save method you can see spinner/toaster as per your options
<pre>
var todoModel = new Backbone.Model({
	url: "http://jsonplaceholder.typicode.com/posts",
});
todoModel.fetch();
</pre>

You can also supress spinner and toaster for some specific fetch/save calls as shown below
<pre>
var todoModel = new Backbone.Model({
	url: "http://jsonplaceholder.typicode.com/posts"
});
todoModel.fetch({
	doNotshowSpinner: true,
	doNotshowToaster: true
});
</pre>
you can abort all pending requests using
<pre>
backboneInterceptor.abortAllPendingRequests();
</pre>

you can tell interceptor not to abort the request during abortAllPendingRequests() process 
var todoModel = new Backbone.Model({
	url: "http://jsonplaceholder.typicode.com/posts"
});
todoModel.fetch({
	doNotAbort: true
});
todoModel.fetch();
backboneInterceptor.abortAllPendingRequests();

this will abort only second request

