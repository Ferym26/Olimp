
$(document).ready(function() {

	//Анимации
	//Animate.scss + WayPoints JS plugin with settings in sass
	$.fn.animated = function(animName, offset) {
		$(this).each(function() {
			var ths = $(this);
			$(this).css("opacity", "0").addClass("animated").waypoint(function(dir) {
				ths.addClass(animName);
			}, {
				offset: offset
			});

		});
	};


	 if($(window).width() > 991) {
		//Init animation
		// .item - target item
		// animation-name - class from _animation.sass

		$(".block-0 .planet").animated("planet--anim", "100%");

		$(".block-0 .meteor").animated("meteor--anim", "100%");

		$(".block-0 .advantages__item").animated("advantages__item--anim", "100%");

		$(".block-0 .title-field__wrap").animated("title-field__wrap--anim", "100%");

		$(".block-0 .superhero-1").animated("superhero-1--anim", "100%");

		$(".block-0 .nums").animated("nums--anim", "100%");

		$(".block-1__inner").animated("block-1__inner--anim", "200%");
	 };

	

	//Jquery
	var overlay = $('#js_overlay');
	var open_modal = $('.js_open_modal');
	var close = $('.js_popup_close, #js_overlay');
	var modal = $('.js_popup');

	open_modal.click( function(event){
		event.preventDefault();
		var div = $(this).attr('href');		
		overlay.fadeIn(400,
			function(){
				$(div)
					.css('display', 'block') 
					.animate({opacity: 1, top: '55%'}, 200);
			});
	});

	close.click( function(){
		modal
		.animate({opacity: 0, top: '45%'}, 200,
			function(){
				$(this).css('display', 'none');
				overlay.fadeOut(400);
			}
		);
	});






});

