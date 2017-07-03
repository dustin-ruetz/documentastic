var docApp = {};

docApp.init = function() {
    // find all internal links (href starts with #)
    $("a[href^='#']").each(function() {
        // apply smoothScroll to each one
        $(this).smoothScroll();
    });
};

// jQuery document ready
$(function() {
    docApp.init();
});