function setData(data) {
	chrome.storage.local.set(data, function() {
		// console.log(data);
	});
}

function getData(callback) {
	chrome.storage.local.get(null, callback);
}

$('div#arrow_up:lt(-1)').remove();
$('div#arrow_down:lt(-1)').remove();
$('div#arrow_left:lt(-1)').remove();
$('div#arrow_right:lt(-1)').remove();
$('div#click_btn:lt(-1)').remove();
$('div#focus_btn:lt(-1)').remove();
$('div#press_btn:lt(-1)').remove();

$('div.calibration_div:lt(-1)').remove();
$('div#arrows_div:lt(-1)').remove();
$('div#help_div:lt(-1)').remove();
$('div#gaze_btns_div:lt(-1)').remove();
$('.calibration_btn:lt(-5)').remove();


$('canvas#webgazerVideoCanvas').remove();
$('canvas#webgazerFaceOverlay').remove();
$('canvas#webgazerFaceFeedbackBox').remove();
$('video#webgazerVideoFeed').remove();


/*** GAZE RELATED FUNCTIONS ***/

var scrolled_ud=0, scrolled_lr=0, scroll_var=300, count=0;
var arrows_shown=true, advance_shown=false;
var toaster_options_success = {
	style: {
		main: {
			background: "green",
			color: "black"
		}
	}, 
	settings: {
		duration: 1000
	}
};

var toaster_options_fail = {
	style: {
		main: {
			background: "red",
			color: "white"
		}
	}, 
	settings: {
		duration: 1000
	}
};

function scrollDown() {
	console.log('scroll down');
	getData(function(data) {
		var scrolled_data = data['scrolled_ud'];
		var arrow_down = data['arrow_down'];
		scrolled_data+=scroll_var;

		$('#arrow_down').css('opacity', 0.3);
		setTimeout(function() {

			$('html, body').animate({ scrollTop: scrolled_data });
	 		var data = { 'scrolled_ud' : scrolled_data };
	 		console.log(scrolled_data);
	 		setData(data);			

	 		$('#arrow_down').css('opacity', 1);
	 		setTimeout(function() {
  			iqwerty.toast.Toast('scroll down!', toaster_options_success);
  		}, 1000);

		}, 1000);
	});
	
}

function scrollUp() {
	console.log('scroll up');
	getData(function(data) {
		var scrolled_data = data['scrolled_ud'];
		scrolled_data-=scroll_var;

		$('#arrow_up').css('opacity', 0.3);
		setTimeout(function() {
		
			$('html, body').animate({ scrollTop: scrolled_data });
	 		var data = { 'scrolled_ud' : scrolled_data };
	 		console.log(scrolled_data);
	 		setData(data);

	 		$('#arrow_up').css('opacity', 1);
			setTimeout(function() {
  			iqwerty.toast.Toast('scroll up!', toaster_options_success);
  		}, 1000);

		}, 1000);
	});

}

function scrollRight() {
	console.log('scroll right');
	getData(function(data) {
		var scrolled_data = data['scrolled_lr'];
		scrolled_data+=scroll_var;

		$('#arrow_right').css('opacity', 0.3);
		setTimeout(function() {
		
			$('html, body').animate({ scrollLeft: scrolled_data });
	 		var data = { 'scrolled_lr' : scrolled_data };
	 		console.log(scrolled_data);
	 		setData(data);

	 		$('#arrow_right').css('opacity', 1);
			setTimeout(function() {
  			iqwerty.toast.Toast('scroll right!', toaster_options_success);
  		}, 1000);

		}, 1000);			
	});

}

function scrollLeft() {
	console.log('scroll left');
	getData(function(data) {
		var scrolled_data = data['scrolled_lr'];
		scrolled_data-=scroll_var;

		$('#arrow_left').css('opacity', 0.3);
		setTimeout(function() {
		
			$('html, body').animate({ scrollLeft: scrolled_data });
	 		var data = { 'scrolled_lr' : scrolled_data };
	 		console.log(scrolled_data);
	 		setData(data);			

	 		$('#arrow_left').css('opacity', 1);
			setTimeout(function() {
  			iqwerty.toast.Toast('scroll left!', toaster_options_success);
  		}, 1000);

		}, 1000);		
	});

}

/** CLICK, PRESS, FOCUS FUNCTIONS **/

var click_toggle=false, press_toggle=false, focus_toggle=false;
var data = {
	'click_toggle' : click_toggle,
	'press_toggle' : press_toggle,
	'focus_toggle' : focus_toggle
};
setData(data);

function highlightLinks() {
	$('a:visible').addClass('selectLinks');
}

function highlightButtons() {
	$('button:visible').addClass('selectBtns');
	$('input[value]').addClass('selectBtns');
	$('a[class*="btn"]').addClass('selectBtns');
	$('a[class*="button"]').addClass('selectBtns');
	$('input[type="submit"]').addClass('selectBtns');
	$('input[type="reset"]').addClass('selectBtns');
	$('input[type="button"]').addClass('selectBtns');
}


function highlightFields() {
	$('input[type="text"]').addClass('selectInputs');
	$('input[type="search"]').addClass('selectInputs');
	$('input[type="email"]').addClass('selectInputs');
	$('input[type="password"]').addClass('selectInputs');
	$('div[role="textbox"]').addClass('selectInputs');
}

/* COLLECTION OF SELECTED DOM ELEMENTS INTO AN ARRAY */
var link_arr = [], button_arr = [], field_arr = [];

function addToArray(orig_array, array, array_length) {
	var temp_array = orig_array;

	for(var i=0, j=array_length; i<j; i++) 
		temp_array.push(array[i]);

	return temp_array;
}

function collectLinks() {
	link_arr = $('a:visible').toArray();

	for(var i=0; i<link_arr.length; i++) {
		var box = link_arr[i].getBoundingClientRect();

		if(box.width===0 && box.height===0) link_arr.splice(i, 1);
	}
	
	console.log(link_arr.length);
}


function collectButtons() {
	var temp_arr = [];

	var button_arr1 = $('button:visible').toArray();
	var button_arr2 = $('input[value], input[type="submit"], input[type="reset"], input[type="button"]').toArray();
	var button_arr3 = $('a[class*="btn"], a[class*="button"]').toArray();

	temp_arr = addToArray(temp_arr, button_arr1, button_arr1.length);
	temp_arr = addToArray(temp_arr, button_arr2, button_arr2.length);
	temp_arr = addToArray(temp_arr, button_arr3, button_arr3.length);

	button_arr = jQuery.unique(temp_arr);

	for(var i=0; i<button_arr.length; i++) {
		var box = button_arr[i].getBoundingClientRect();

		if(box.width===0 && box.height===0) {
			button_arr.splice(i, 1);
		}
	}
	console.log(button_arr.length);
}


function collectFields() {
	var temp_arr = [];

	var field_arr1 = $('input:not(value), input[type="text"], input[type="password"]').toArray();
	var field_arr2 = $('div[role="textbox"]').toArray();

	temp_arr = addToArray(temp_arr, field_arr1, field_arr1.length);
	temp_arr = addToArray(temp_arr, field_arr2, field_arr2.length);
	
	field_arr = temp_arr;
	
	for(var i=0; i<field_arr.length; i++) {
		var box = field_arr[i].getBoundingClientRect();

		if(box.width===0 && box.height===0) {
			field_arr.splice(i, 1);
		}
	}
	console.log(field_arr.length);
}

/* REMOVES HIGHLIGHT OF SELECTED DOM ELEMENTS */

function removeLinks() {
	for(var i=0; i<link_arr.length; i++)
		link_arr[i].classList.remove('selectLinks');
}

function removeButtons() {
	for(var i=0; i<button_arr.length; i++)
		button_arr[i].classList.remove('selectBtns');
}

function removeFields() {
	for(var i=0; i<field_arr.length; i++)
		field_arr[i].classList.remove('selectInputs');
}

/* ADDING/REMOVING LABELS TO SELECTED DOM ELEMENTS */ 

function getCoordinates(element) {
	
	if(element == null) console.log('element is null');
	else {
		var box = element.getBoundingClientRect();
		var top_coordinate = box.top + pageYOffset;
		var right_coordinate = box.right + pageXOffset;

		return {
			top: top_coordinate,
			right: right_coordinate,
		}
	}
}


function createLabelArray(array) {
	var length = array.length;
	var label_arr = [];

	for(var i=0; i<length; i++) {
		var label_div = document.createElement('div');

		label_div.setAttribute('class', 'label');
		label_div.innerHTML = i;
		label_arr.push(label_div);
	}

	return label_arr;
}


function addLabels(array, label_array) {
	var length = array.length;

	for(var i=0; i<length; i++) {
		var coordinates = getCoordinates(array[i]);
		var x = coordinates.right;
		var y = coordinates.top;

		document.body.appendChild(label_array[i]);

		label_array[i].style.position = 'absolute';
		label_array[i].style.left = x + 'px';
		label_array[i].style.top = y + 'px';
		label_array[i].style.visibility = 'visible';

	}
}

function removeLabels() {
	$('.label').css('opacity', 0);
}


/* collects elements, highlights those elements, puts it all in an array, and attaches
		a numerical label on the right of each highlighted element */

var link_labels = [], button_labels = [], field_labels = [];

function clickFxn() {
	if (document.readyState == "complete") {
		getData(function(data) {
			var c_toggle = data['click_toggle'];
			var p_toggle = data['press_toggle'];
			var f_toggle = data['focus_toggle'];
			c_toggle=true;

			if(c_toggle && !p_toggle && !f_toggle) {
				gaze_btns_div.style.opacity = 0;
				highlightLinks();
				collectLinks();
				link_labels = createLabelArray(link_arr);
				addLabels(link_arr, link_labels);
			}
			else if(p_toggle || f_toggle) {
				console.log('click is activated');
			}
			var data = { 'click_toggle' : true }
			setData(data);
		});
	}
}

function pressFxn() {
	if (document.readyState == "complete") {
		getData(function(data) {
			var c_toggle = data['click_toggle'];
			var p_toggle = data['press_toggle'];
			var f_toggle = data['focus_toggle'];
			p_toggle=true;

			if(p_toggle && !c_toggle && !f_toggle) {
				gaze_btns_div.style.opacity = 0;
				highlightButtons();
				collectButtons();
				button_labels = createLabelArray(button_arr);
				addLabels(button_arr, button_labels);
			}
			else if(c_toggle || f_toggle) {
				console.log('press is activated');
			}
			var data = { 'press_toggle' : true }
			setData(data);
		});
	}
}

function focusFxn() {
	if (document.readyState == "complete") {
		getData(function(data) {
			var c_toggle = data['click_toggle'];
			var p_toggle = data['press_toggle'];
			var f_toggle = data['focus_toggle'];
			f_toggle=true;

			if(f_toggle && !c_toggle && !p_toggle) {
				gaze_btns_div.style.opacity = 0;
				highlightFields();
				collectFields();
				field_labels = createLabelArray(field_arr);
				addLabels(field_arr, field_labels);
			}
			else if(c_toggle || p_toggle) {
				console.log('focus is activated');
			}
			var data = { 'focus_toggle' : true }
			setData(data);
		});
	}
}

/*** END ***/











/*** WEBGAZER RELATED FUNCTIONALITIES ***/

var data = { 
	'scrolled_ud' : scrolled_ud,
	'scrolled_lr' : scrolled_lr,
	'arrows_shown' : arrows_shown,
	'advance_shown' : advance_shown
};
setData(data);

webgazer
	.setRegression('ridge')
	.setTracker('clmtrackr')
	.setGazeListener(function(wg_data, elapsedTime) {
			if(wg_data==null) return;

			var xp = wg_data.x, yp = wg_data.y;

			getData(function(data) {
				var arrow_down = data['arrow_down'];
				var arrow_up = data['arrow_up'];
				var arrow_right = data['arrow_right'];
				var arrow_left = data['arrow_left'];
				var arr_shown = data['arrows_shown'];
				var adv_shown = data['advance_shown'];
				if(data['gaze_calibrated']) {
					if ((arrow_down.x<xp && xp<(arrow_down.x+50)) && (arrow_down.y<yp && yp<(arrow_down.y+50))) {
						if(arr_shown && !adv_shown) scrollDown();
						else if(!arr_shown && adv_shown) console.log('advance commands are activated');
					}
					else if ((arrow_up.x<xp && xp<(arrow_up.x+50)) && (arrow_up.y<yp && yp<(arrow_up.y+50))) {
						if(arr_shown && !adv_shown) scrollUp();
						else if(!arr_shown && adv_shown) console.log('advance commands are activated');
					}
					else if ((arrow_right.x<xp && xp<(arrow_right.x+50)) && (arrow_right.y<yp && yp<(arrow_right.y+50))) {
						if(arr_shown && !adv_shown) scrollRight();
						else if(!arr_shown && adv_shown) console.log('advance commands are activated');
					}
					else if ((arrow_left.x<xp && xp<(arrow_left.x+50)) && (arrow_left.y<yp && yp<(arrow_left.y+50))) {
						if(arr_shown && !adv_shown) scrollLeft();
						else if(!arr_shown && adv_shown) console.log('advance commands are activated');
					}
				}
			});

			getData(function(data) {
				var click_btn = data['click_btn'];
				var press_btn = data['press_btn'];
				var focus_btn = data['focus_btn'];
				var arr_shown = data['arrows_shown'];
				var adv_shown = data['advance_shown'];

				if ((click_btn.x<xp && xp<(click_btn.x+50)) && (click_btn.y<yp && yp<(click_btn.y+50))){	
					if(adv_shown && !arr_shown) {
						console.log('click link');
						clickFxn();
					}
				}
				else if ((press_btn.x<xp && xp<(press_btn.x+50)) && (press_btn.y<yp && yp<(press_btn.y+50))) {	
					if(adv_shown && !arr_shown) {
						console.log('press button');
						pressFxn();
					}
				}
				else if ((focus_btn.x<xp && xp<(focus_btn.x+50)) && (focus_btn.y<yp && yp<(focus_btn.y+50))) {
					if(adv_shown && !arr_shown) {
						console.log('focus text field');	
						focusFxn();
					}
				}
			});
		})
	.begin()
	.showPredictionPoints(false);

/*** END ***/









/*** VOICE RELATED FUNCTIONS ***/

function showHelp() {
	console.log('show help');

	var help_div = document.getElementById('help_div');
	document.getElementById("help_div").style.zIndex = 9999;
	help_div.style.opacity = 1;
}

function hideHelp() {
	console.log('hide help');

	var help_div = document.getElementById('help_div');
	document.getElementById("help_div").style.zIndex = -9999;
	help_div.style.opacity = 0;
}

function backPage() {
	console.log('back page');
	setTimeout(function() {		
		iqwerty.toast.Toast('back page!', toaster_options_success);
		window.history.back();
	}, 1000);
}

function nextPage() {
	console.log('next page');
	setTimeout(function() {		
		iqwerty.toast.Toast('next page!', toaster_options_success);
		window.history.forward();
	}, 1000);
}



var gaze_btns_div = document.getElementById('gaze_btns_div');
var arrows_div = document.getElementById('arrows_div');

function advDiv() {
	getData(function(data) {
		var arr_shown = data['arrows_shown'];
		var adv_shown = data['advance_shown'];

		arr_shown=!arr_shown;
		adv_shown=!adv_shown;

		if (adv_shown) {
			console.log('boxes are shown - advanced commands only');
			arrows_div.style.opacity = 0;
			gaze_btns_div.style.opacity = 1;
			setTimeout(function() {		
				iqwerty.toast.Toast('advanced functions are shown!', toaster_options_success);
			}, 1000);

			var data = { 'arrows_shown' : arr_shown, 'advance_shown' : adv_shown};
			setData(data);
		}
	});
}

function basicDiv() {
	getData(function(data) {
		var arr_shown = data['arrows_shown'];
		var adv_shown = data['advance_shown'];

		arr_shown=!arr_shown;
		adv_shown=!adv_shown;

		if(arr_shown) {
			console.log('arrows are shown - basic commands only');
			arrows_div.style.opacity = 1;
			gaze_btns_div.style.opacity = 0;
			setTimeout(function() {		
				iqwerty.toast.Toast('arrows are shown!', toaster_options_success);
			}, 1000);
		}

		var data = { 'arrows_shown' : arr_shown, 'advance_shown' : adv_shown};
		setData(data);
	});
}

function toggleDiv() {
	getData(function(data) {
		var arr_shown = data['arrows_shown'];
		var adv_shown = data['advance_shown'];

		arr_shown=!arr_shown;
		adv_shown=!adv_shown;
		
		if(arr_shown) {
			console.log('arrows are shown - basic commands only');
			arrows_div.style.opacity = 1;
			gaze_btns_div.style.opacity = 0;
			setTimeout(function() {		
				iqwerty.toast.Toast('arrows are shown!', toaster_options_success);
			}, 1000);
		}
		else if(adv_shown) {
			console.log('boxes are shown - advanced commands only');
			arrows_div.style.opacity = 0;
			gaze_btns_div.style.opacity = 1;
			setTimeout(function() {		
				iqwerty.toast.Toast('advanced functions are shown!', toaster_options_success);
			}, 1000);
		}

		var data = { 'arrows_shown' : arr_shown, 'advance_shown' : adv_shown};
		setData(data);
	});

}

var zoom_val=0.1, min_zoom=0.5, max_zoom=1.5, zoomed=1;

var data = { 'zoomed' : zoomed };
setData(data);
document.body.style.zoom = zoomed;

function zoomIn() {
	console.log('zoom in');
	getData(function(data) {
		var curr_zoom = data['zoomed'];
		if((curr_zoom+zoom_val) < 1.6) {

			curr_zoom+=zoom_val;
			document.body.style.zoom = curr_zoom;	
			console.log('curr_zoom: ' + curr_zoom);
			
			var data = { 'zoomed' : curr_zoom };
			setData(data);
		}
		else {
			console.log('curr_zoom: ' + curr_zoom);
			console.log('zoom value exceeds limits');
		} 
		setTimeout(function() {		
			iqwerty.toast.Toast('zoom in!', toaster_options_success);
		}, 1000);
	});
}

function zoomOut() {
	console.log('zoom out');
	getData(function(data) {
		var curr_zoom = data['zoomed'];
		if((curr_zoom-zoom_val) > 0.5) {
			curr_zoom-=zoom_val;
			document.body.style.zoom = curr_zoom;
			console.log('curr_zoom: ' + curr_zoom);
			
			var data = { 'zoomed' : curr_zoom };
			setData(data);
		}
		else {
			console.log('curr_zoom: ' + curr_zoom);
			console.log('zoom value exceeds limits');
		}
		setTimeout(function() {		
			iqwerty.toast.Toast('zoom out!', toaster_options_success);
		}, 1000);
	});
}

function zoomReset() {
	console.log('zoom reset');
	getData(function(data) {
		var curr_zoom = data['zoomed'];
		curr_zoom=1;
		document.body.style.zoom = curr_zoom;	
		console.log('curr_zoom: ' + curr_zoom);
		var data = { 'zoomed' : curr_zoom };
		setData(data);
	});
	setTimeout(function() {		
		iqwerty.toast.Toast('zoom reset!', toaster_options_success);
	}, 1000);
}

/* label selection */

function selectElement(label_number, array) {
	getData(function(data) {

		var c_toggle = data['click_toggle'];
		var p_toggle = data['press_toggle'];
		var f_toggle = data['focus_toggle'];

		if(c_toggle && !p_toggle && !f_toggle) {
			console.log('link clicked');
			setTimeout(function() {
				iqwerty.toast.Toast('click link success', toaster_options_success);
				array[label_number].click();
			}, 1000);
			removeLabels();
			removeLinks();
			var data = { 'click_toggle' : false };
			setData(data);
		}
		else if(p_toggle && !c_toggle && !f_toggle) {
			console.log('button pressed');
			setTimeout(function() {
				iqwerty.toast.Toast('press button success', toaster_options_success);
				array[label_number].click();
			}, 1000);
			removeLabels();
			removeButtons();
			var data = { 'press_toggle' : false };
			setData(data);
		}
		else if(f_toggle && !c_toggle && !p_toggle) {
			console.log('field focused');
			setTimeout(function() {
				iqwerty.toast.Toast('focus success', toaster_options_success);
			}, 1000);
			array[label_number].focus();
			array[label_number].innerHTML='';
			removeLabels();
			removeFields();
		}
	});
}

var add_toggle=false;

data = { 'add_toggle' : add_toggle };
setData(data);

function inputNum(number) {
	if(typeof number !== 'number') {
		switch(number) {
			case 'zero': number=0; break;
			case 'one': number=1; break;
			case 'two': number=2; break;
			case 'three': number=3; break;
			case 'four': number=4; break;
			case 'five': number=5; break;
			case 'six': number=6; break;
			case 'seven': number=7; break;
			case 'eight': number=8; break;
			case 'nine': number=9; break;
		}
	}

	if(typeof number === 'number') console.log('inputNum: ' + number);

	getData(function(data) {
		var c_toggle = data['click_toggle'];
		var p_toggle = data['press_toggle'];
		var f_toggle = data['focus_toggle'];
		var a_toggle = data['add_toggle'];

		if(c_toggle && !p_toggle && !f_toggle && !a_toggle) {
			selectElement(number, link_arr);
			console.log('c: ' + number);
		}
		else if(p_toggle && !c_toggle && !f_toggle && !a_toggle) {
			selectElement(number, button_arr);
			console.log('p: ' + number);
		}
		else if(f_toggle && !c_toggle && !p_toggle && !a_toggle) {
			if(isNaN(number)) {
				console.log('NaN: ' + number);

				var elem = document.activeElement;
				if(number === 'stop focus') {
					console.log('FOCUS STOPPED');
					setTimeout(function() {
						iqwerty.toast.Toast('FOCUS STOPPED!', toaster_options_success);
					}, 1000);
					elem.blur();
					f_toggle=false;
					var data = { 'focus_toggle' : false } 
					setData(data);
					arrows_div.style.opacity=1;
				}
				else if(document.activeElement.value!=' ') {
					document.activeElement.value = ' ' + number;
				}
				else {
					number += ' ';
					console.log(document.activeElement);
					if(document.activeElement.tagName === 'INPUT')
						document.activeElement.value += number;
					else document.activeElement.innerHTML += number;
				}
			}
			else selectElement(number, field_arr);
		}
		else if(a_toggle && !c_toggle && !p_toggle && !f_toggle) {
			console.log(number + ' saved.');

			getData(function(data) {
				var tempkeyword = data['keyword_arr'];
				var tempplink = data['plink_arr'];
				
				tempkeyword.push(number);
				tempplink.push(window.location.href);
				var data = { "keyword_arr" : tempkeyword, "plink_arr" :  tempplink };
				setData(data);
				console.log(tempkeyword.length);
				console.log(tempplink.length);
			
				console.log("keywords: " + data['keyword_arr']);
				console.log("plinks: " + data['plink_arr']);

				setTimeout(function() {
					iqwerty.toast.Toast('keyword saved', toaster_options_success);
				}, 1000);
			});
			
		}
	});
}

var keyword_arr=[], plink_arr=[];

function addBookmark() {
	
	getData(function(data) {
		var c_toggle = data['click_toggle'];
		var p_toggle = data['press_toggle'];
		var f_toggle = data['focus_toggle'];
		var a_toggle = data['add_toggle'];

		var tempkeyword = data['keyword_arr'];
		var tempplink = data['plink_arr'];

		if(tempkeyword===undefined && tempplink===undefined) {
			var data = { 'keyword_arr' : keyword_arr, 'plink_arr' : plink_arr };
			setData(data);
		}
		// try to put here condition if length of data[keyword arr] & data[plink arr] <=5 or <=4 
		if(tempkeyword.length<=4 && tempplink.length<=4){
			a_toggle=true;
			if(a_toggle && !c_toggle && !p_toggle && !f_toggle) {
				console.log('Say customized bookmark: ');
				setTimeout(function() {
					iqwerty.toast.Toast('Say customized bookmark: ', toaster_options_success);
				}, 1000);
			}
			else if(c_toggle || p_toggle || f_toggle) {
				console.log('add function is toggled');
				setTimeout(function() {
					iqwerty.toast.Toast('add function is toggled', toaster_options_fail);
				}, 1000);
			}

			console.log(data['keyword_arr']);
			console.log(data['plink_arr']);
		}
		else if(tempkeyword===undefined && tempplink===undefined) {
			var data = { 'keyword_arr' : keyword_arr, 'plink_arr' : plink_arr };
			setData(data);
		}

		else {
			alert('Customized bookmarks are only limited up to five (5).');
			setTimeout(function() {
				iqwerty.toast.Toast('limit exceeded', toaster_options_fail);
			}, 1000);
		}
		var data = { 'add_toggle' : true }
		setData(data);
	});
}

function holdGaze() {
	getData(function(data) {
		var arr_shown = data['arrows_shown'], adv_shown = data['advance_shown'];
		webgazer.pause();
		if(arr_shown && !adv_shown) {
			var data = { 'arrows_shown' : false, 'advance_shown' : false, 'hold' : 'basic' };
			setData(data);
		}
		else if(adv_shown && !arr_shown) {
			var data = { 'arrows_shown' : false, 'advance_shown' : false, 'hold' : 'advance' };
			setData(data);
		}

		arrows_div.style.opacity = 0;
		gaze_btns_div.style.opacity = 0;

		setTimeout(function() {		
			iqwerty.toast.Toast('hold extension!', toaster_options_success);
		}, 1000);
	});
}


function releaseGaze() {
	getData(function(data) {
		var arr_shown = data['arrows_shown'], adv_shown = data['advance_shown'], hold = data['hold'];

		webgazer.resume();
		if(arr_shown && !adv_shown && hold == 'basic') {
			var data = { 'arrows_shown' : true, 'hold' : '' }
			setData(data);
			arrows_div.style.opacity = 1;
			gaze_btns_div.style.opacity = 0;
		}
		else if(adv_shown && !arr_shown && hold == 'advance') {
			var data = { 'advance_shown' : true, 'hold' : '' }
			setData(data);
			arrows_div.style.opacity = 0;
			gaze_btns_div.style.opacity = 1;
		}

		setTimeout(function() {		
			iqwerty.toast.Toast('release extension!', toaster_options_success);
		}, 1000);
		location.reload();
	});
}

function cancelAdvFxn() {

	getData(function(data) {
		var c_toggle = data['click_toggle'];
		var p_toggle = data['press_toggle'];
		var f_toggle = data['focus_toggle'];

		if(c_toggle && !p_toggle && !f_toggle) {
			c_toggle=false;
			removeLinks();
			removeLabels();
			var data = { 'click_toggle' : c_toggle };
			setData(data);
			console.log('click cancelled');
			setTimeout(function() {
				iqwerty.toast.Toast('click cancelled', toaster_options_success);
			}, 1000);
		}
		else if(p_toggle && !c_toggle && !f_toggle) {
			p_toggle=false;
			removeButtons();
			removeLabels();
			var data = { 'press_toggle' : p_toggle };
			setData(data);
			console.log('press cancelled');
			setTimeout(function() {
				iqwerty.toast.Toast('press cancelled', toaster_options_success);
			}, 1000);
		}
		else if(f_toggle && !c_toggle && !p_toggle) {
			f_toggle=false;
			removeFields();
			removeLabels();
			var data = { 'focus_toggle' : f_toggle };
			setData(data);
			console.log('focus cancelled');
			setTimeout(function() {
				iqwerty.toast.Toast('focus cancelled', toaster_options_success);
			}, 1000);
		}
	});
	gaze_btns_div.style.opacity = 1;
}

function turnOff() {
	$('.arrows').remove();
	$('.gaze_btns').remove();
	$('canvas#webgazerVideoCanvas').remove();
	$('canvas#webgazerFaceOverlay').remove();
	$('canvas#webgazerFaceFeedbackBox').remove();

	$('.selectLinks').removeClass('selectLinks');
	$('.selectBtns').removeClass('selectBtns');
	$('.selectInputs').removeClass('selectInputs');

	webgazer.end();
	setTimeout(function() {
		iqwerty.toast.Toast('turn off', toaster_options_success);
	}, 1000);
}

/*** END ***/


/*** SPEECH API RELATED FUNCTIONALITIES ***/
window.SpeechRecognition = window.SpeechRecognition  || window.webkitSpeechRecognition;
var toggle=false;

if(window.SpeechRecognition !== null) {
	console.log('has speech recog yaaay');
	var recognizer = new window.SpeechRecognition();

	/* 
		- puts recognized word in textbox when start button is clicked
		- is only done once so after calling functions in the switchcase, the recognizer stops so that
			it can be started again in recognizer.onend()
	*/
	recognizer.start();

	recognizer.onresult = function(event) {
		console.log('onresult');

		var voice_results;

		for(var i=event.resultIndex; i<event.results.length; i++) {
			if(event.results[i].isFinal) voice_results = event.results[i][0].transcript;
			else voice_results += event.results[i][0].transcript;
		}

		/* when user says the keyword, it calls t he corresponding function */
		var data, label_number;
		console.log('voice results: ' + voice_results);
		switch(voice_results) {
			case 'help': showHelp(); break;
			case 'thanks':
			case 'close help': hideHelp(); break;
			case 'go back': backPage();
											break;
			case 'go next': nextPage();
											break;
			case 'hold': holdGaze(); break;
			case 'release': releaseGaze(); break;
			case 'zoom in': zoomIn();
											break;
			case 'zoom out': zoomOut();
											break;
			case 'zoom reset': zoomReset(); break;
			case 'advance':
			case 'advanced':
			case 'advanced functions':
			case 'more':
			case 'more functions': advDiv(); break;
			case 'basic':
			case 'scroll':
			case 'arrows':
			case 'back to scrolling': basicDiv(); break;
			case 'toggle': 	toggleDiv();
											break;											
			case 'add': addBookmark();
									break;
			case 'cancel': cancelAdvFxn(); break;
			case 'turn off':
			case 'off': turnOff(); break;
			default: inputNum(voice_results); break;
		}		

		getData(function(data) {
			var tempkeyword = data['keyword_arr'];
			var tempplink = data['plink_arr'];
			if(tempkeyword!=undefined && tempplink!=undefined){
				switch(voice_results) {
					case tempkeyword[0]: if(tempkeyword[0]!=undefined) window.location.href=tempplink[0]; break;
					case tempkeyword[1]: if(tempkeyword[1]!=undefined) window.location.href=tempplink[1]; break;
					case tempkeyword[2]: if(tempkeyword[2]!=undefined) window.location.href=tempplink[2]; break;
					case tempkeyword[3]: if(tempkeyword[3]!=undefined) window.location.href=tempplink[3]; break;
					case tempkeyword[4]: if(tempkeyword[4]!=undefined) window.location.href=tempplink[4]; break;
				}
			}
		});

	}

	/* after calling recognizer.stop() above, it will go here to start the recognizer and check if the 
			toggle for each function is true, if true it will set the said toggle to false,
			else, it will empty the textbox.
	*/
	recognizer.onend = function(event) {
		recognizer.start();
	}
}

/*** END ***/