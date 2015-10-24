$(document).ready(function(){
	document.addEventListener('deviceready', onDeviceReady, false);
});
function onDeviceReady(){

	if(localStorage.channel == null || localStorage.channel == ''){
		$('#popupDialog').popup('open');

	} else{
		var channel = localStorage.getItem('channel');

	}


	getPlaylist(channel);

	$(document).on('click','#listvidz li', function(){
		showVideo($(this).attr('videoId'));
	});

	$('#ChannelBtnOk').click(function(){
		var channel = $('#ChannelName').val();
		setChannel(channel);
		getPlaylist(channel);
	});

	$('#saveOptions').click(function(){
		saveOptions();
	});

	$('#clearChannel').click(function(){
		clearChannel();
	});

	$(document).on('pageinit', '#options', function(e){
		var channel = localStorage.getItem('channel');
		var maxResults = localStorage.getItem('maxresults');
		$('#channelNameOptions').attr('value', channel);
		$('#maxResultsOptions').attr('value', maxResults);
	});
}
function getPlaylist(channel){
	$('#listvidz').html('');
	$.get(
			"https://www.googleapis.com/youtube/v3/channels",
			{
				part: 'contentDetails',
				forUsername: channel,
				key: 'AIzaSyB52gEbC71B1NRaW4-ohqFrxyUhldS_A2E'
			},
			function(data){
				$.each(data.items, function(i, item){
					console.log(item);
					playlistId = item.contentDetails.relatedPlaylists.uploads;
					getVideos(playlistId, localStorage.getItem('maxresults'));
				});
			}
		);
}

function getVideos(playlistId, maxResults){
	$.get(
		"https://www.googleapis.com/youtube/v3/playlistItems",
		{
			part: 'snippet',
			maxResults: maxResults,
			playlistId: playlistId,
			key: 'AIzaSyB52gEbC71B1NRaW4-ohqFrxyUhldS_A2E'
		},function(data){
			console.log(data);
			var output;
			$.each(data.items, function(i, item){
				id = item.snippet.resourceId.videoId;
				title = item.snippet.title;
				thumb = item.snippet.thumbnails.default.url;
				$('#listvidz').append('<li videoId="'+id+'"><img src="'+thumb+'"><h3>'+title+'</h3></li>');
				$('#listvidz').listview('refresh');
			});
		}
		);
}

function showVideo(id){
	console.log('Showwing Video '+id);
	$('#logo').hide();
	var output = '<iframe width="100%" height="250" src="https://www.youtube.com/embed/'+id+'" frameborder="0" allowfullscreen></iframe>';
	$('#showVids').html(output);
}
function setChannel(channel){
	localStorage.setItem('channel', channel);
	console.log('Channel Set '+channel);


}
function setMaxResults(maxResults){
	localStorage.setItem('maxresults', maxResults);
	console.log('Max Results change '+maxResults);
}

function saveOptions(){
	var channel = $('#channelNameOptions').val();
	setChannel(channel);
	var maxResults = $('#maxResultsOptions').val();
	setMaxResults(maxResults);
	$('body').pagecontainer('change', '#main',{options});
	getPlaylist(channel);
}
function clearChannel(){
	localStorage.removeItem('channel');
	$('body').pagecontainer('change', '#main',{options});
	$('#listvidz').html('');
	$('#popupDialog').popup('open');
}




