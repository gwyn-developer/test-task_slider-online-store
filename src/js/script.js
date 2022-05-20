'use sctrict';

$(document).ready(function(){
    $('.slider').slick({
      arrows:true,
      dots:true,
      adaptiveHeigth: true,
      speed: 400,
      easing: 'easeInOutCubic',
      touchTreshold: 10,
      waitForAnimate: false,
    });
});