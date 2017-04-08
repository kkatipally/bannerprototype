'use strict';

visitNotesApp.factory('DateFactory', function(){

	var data = {
				  sliderMinDate: '',
				  sliderMaxDate: ''
			    };

	return {
			        getSliderMinDate: function () {
			        	//console.log("Slider min in getter: " + data.sliderMinDate);
			            return data.sliderMinDate;
			        },
			        setSliderMinDate: function (sliderMinDate) {
			            data.sliderMinDate = sliderMinDate;
			        	//console.log("Slider min in setter: " + data.sliderMinDate);
			        },
			        getSliderMaxDate: function () {
			        	//console.log("Slider max in getter: " + data.sliderMaxDate);
			            return data.sliderMaxDate;
			        },
			        setSliderMaxDate: function (sliderMaxDate) {
			            data.sliderMaxDate = sliderMaxDate;
			        	//console.log("Slider max in setter: " + data.sliderMaxDate);
			        }
			    };
});