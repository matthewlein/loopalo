// ************************************************************************* //
//
// Get the length of a CSS transition or animation
//
// ************************************************************************* //

(function($){

  $.fn.transtionDuration = function() {
    // check the main transition duration property
    if( this.css('transition-duration') ) {
      return Math.round( parseFloat( this.css('transition-duration') ) * 1000 );
    }
    // if we're here, then no transition duration was found, return 0
    return 0;
  };

  $.fn.animationDuration = function() {
    // check the main transition duration property
    if( this.css('animation-duration' )) {
      return Math.round( parseFloat( this.css('animation-duration') ) * 1000) ;
    }
    // if we're here, then no animation duration was found, return 0
    return 0;
  };

})(jQuery);
