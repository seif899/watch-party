
let videoId;
function handleClick(){
  //search for video
  const link=document.getElementById("link-injector");
  fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${link}&key=AIzaSyCS_8M26113YwMd6SS8z0okR4z11-0HikA`)
  .then(response=>response.json())
  .then(data=>{
    videoId=data.items[0].id.videoId;
    loadVideo()
    
  })
  .catch(err=>console.log(err))
}
function loadVideo(){
    const video=document.createElement('div');
    video.id='player';
    video.appendChild(document.createElement('script'));
    video.appendChild(tag)
    
}

// 2. This code loads the IFrame Player API code asynchronously.
if (videoId){
    var tag = document.createElement('script');
    
    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    
    // 3. This function creates an <iframe> (and YouTube player)
    //    after the API code downloads.
    var player;
    function onYouTubeIframeAPIReady() {
    console.log('ha');
     player = new YT.Player('player', {
       height: '390',
       width: '640',
       videoId: videoId,
       playerVars: {
         'playsinline': 1
       },
       events: {
         'onReady': onPlayerReady,
         'onStateChange': onPlayerStateChange
       }
     });
    }
    
    // 4. The API will call this function when the video player is ready.
    function onPlayerReady(event) {
     event.target.playVideo();
    }
    
    // 5. The API calls this function when the player's state changes.
    //    The function indicates that when playing a video (state=1),
    //    the player should play for six seconds and then stop.
    var done = false;
    function onPlayerStateChange(event) {
     if (event.data == YT.PlayerState.PLAYING && !done) {
       setTimeout(stopVideo, 6000);
       done = true;
     }
    }
    function stopVideo() {
     player.stopVideo();
    }
    
}




