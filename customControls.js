export default function customControls(){
    document.getElementById("play-vid").addEventListener("click",()=>{ 

        player.playVideo()
    
        
      })
    
    document.getElementById("pause-vid").addEventListener("click",()=>{
        player.pauseVideo()
    
    });
    
    document.getElementById("vol").addEventListener("mouseup",(e)=>{
        const seekedTime=(e.target.value*player.getDuration())/100;
        player.seekTo(seekedTime,true);
      
    })  

}

 




  


