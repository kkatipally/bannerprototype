'use strict';

visitNotesApp.factory('DateFactory', function(){

	var data = {
				  minDate: '',
				  sliderMinDate: '',
				  sliderMaxDate: ''
			    };

	return {
			        getMinDate: function () {
                        //console.log("Min in getter: " + data.minDate);
                        return data.minDate;
                    },
                    setMinDate: function (minDate) {
                        data.minDate = minDate;
                        //console.log("Min in setter: " + data.minDate);
                    },
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