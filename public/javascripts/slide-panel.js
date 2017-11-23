$(document).ready(function(){
	$('#opener').on('click', function() {		
		var panel = $('#slide-panel');
		if (panel.hasClass("visible")) {
			panel.removeClass('visible').animate({'margin-left':'-300px'});
      $('#mycontent').css({'margin-right':'0px'});
		} else {panel.addClass('visible').animate({'margin-left':'0px'});
      $('#mycontent').css({'margin-right':'-300px'});
		}	
		return false;	
	});
});