$('aside.navigation ul.nav').find('.subnav').hide();

// Accordion
$('aside.navigation ul.nav').find('.menu-arrow').click(function() {
    var next = $(this).next();
    next.slideToggle('fast');
    $('.subnav').not(next).slideUp('fast');
    return false;
});


if ($(window).width() < 600) {
    $('.navigation-wrapper nav.main-menu ul.nav').find('.subnav').hide();

    // Accordion
    $('.navigation-wrapper nav.main-menu ul.nav').find('.menu-arrow').click(function() {
        var next = $(this).next();
        next.slideToggle('fast');
        $('.subnav').not(next).slideUp('fast');
        return false;
    });
}