const docApp = {};

docApp.init = function() {
	// find all internal links (href starts with #)
	$("a[href^='#']").each(function() {
		// apply smoothScroll to each one
		$(this).smoothScroll();
	});
};

$(function() {
	docApp.init();
});