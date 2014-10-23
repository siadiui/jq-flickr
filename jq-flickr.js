/**********************************************************
 * General settings  
 **********************************************************/
	
	//*** Your flickr api key goes here:
	var apik = '7fbba6dc87a44ff109a1e652cd481a52';
	var imageSelectedClass='selected';
	var imageNotSelectedClass='unselected';
	var imageContainerId='image-container';
	var searchFormId='search-form';
	var keywordFieldId='search-field';
	var pageFieldId='page-field';
	var submitFormId='submit-form';
	//*** Leave url blank to submit to self:
	var submitFormURL='';
	var searchRes;
	
/**********************************************************
 * Search flickr by keyword and show results  
 **********************************************************/

function flickrSearch(apiKey,keyword,page)	{
	$.getJSON(
		'https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key='+ apiKey +'&text='+ keyword +'&extras=url_s&page='+page+'&per_page=100&format=json&jsoncallback=?',
		function(results){
    		$.each(results.photos.photo, function(i,item){
				var photoURL=item.url_s;
    			var photoID = item.id;
    			if (photoURL){
    				var imgElement='<img class="'+ imageNotSelectedClass +'" id="'+ photoID +'" src="'+ photoURL +'" />';
    				$('#'+imageContainerId).append(imgElement);
					$('#'+photoID).click(function(){
    					if ($(this).attr('class')==imageSelectedClass) {
    						$(this).attr('class', imageNotSelectedClass);
    					}
    					else {
    						$(this).attr('class', imageSelectedClass);
    					}
					});
    			}
 			});
		}
	);
}

/**********************************************************
 * Get info from photo by id and return json response  
 **********************************************************/

function flickrPhotoInfo(apiKey, photoID)	{
	return $.getJSON('https://api.flickr.com/services/rest/?method=flickr.photos.getInfo&api_key=' + apiKey + '&photo_id=' + photoID + '&format=json&jsoncallback=?',
    	function(data){
			//no use for this right now
    	}
	);
}

$(document).ready(function(){
	
	 /* Define what happens when search form is submitted:
	 * 		1-Prevent form submission (default form behavior)
	 * 		2-Retrieve search keyword and page from form
	 * 		3-Do search on flickr, show photos					*/
	
	$('#'+searchFormId).submit(function(event){
	
		event.preventDefault();
		
		var searchKeyword=$('#'+keywordFieldId).val(); 
		var searchPage=$('#'+pageFieldId).val();

		$('#'+imageContainerId).empty();
		flickrSearch(apik,searchKeyword,searchPage);
	});
	
	
	/* Attach onClick behaviour to submit button:	
	* 		1-Prevent form submission (default form behavior)					
	*		2-Get selected images		
	*		3-Get flickr info from each image			
	* 		4-Build JSON object and submit						*/

	$('#'+submitFormId).submit(function(event){
	
		event.preventDefault();
		
		var jsonImages;
		$('.'+imageSelectedClass).each(function(index) {
		  	id=$(this).attr('id');
		  	$.when(flickrPhotoInfo(apik,id)).done(function(pInfo){
		  		if (!jsonImages) {
		  			jsonImages=$.makeArray(pInfo);
		  		} else {
					jsonImages=jsonImages.concat($.makeArray(pInfo));
				}
			});
		});
		
		$.post( submitFormURL, jsonImages, function(data) {
         	// do something with response from server, or ignore it
         		$('#'+imageContainerId).empty();
				//$('#'+imageContainerId).append();
       	});
	});
});
