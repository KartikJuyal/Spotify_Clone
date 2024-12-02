let currentSong=new Audio();
let songs;
let currFolder;
function secondsToMinutesSeconds(totalSeconds) {
  if(isNaN(totalSeconds)||totalSeconds<0){
    return "00:00";
  }
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60) ;

  // Format minutes and seconds to always have two digits
  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(seconds).padStart(2, '0');

  return `${formattedMinutes}:${formattedSeconds}`;
}
async function getSongs(folder){
  currFolder=folder;
let a=await fetch(`http://127.0.0.1:3000/${folder}/`)
let response=await a.text();
// console.log(response);
let div=document.createElement("div")
div.innerHTML=response;
let as=div.getElementsByTagName("a")
songs=[];
for(let index=0; index<as.length;index++){
    const element=as[index];
    if(element.href.endsWith(".mp3")){
        songs.push(element.href.split(`/${folder}/`)[1])
    }
}

let songUl=document.querySelector(".songlist").getElementsByTagName("ul")[0];
songUl.innerHTML=""
for(const song of songs){
    songUl.innerHTML=songUl.innerHTML+`
     <li>
                <img class="invert" src="music .svg" alt="">
                <div class="info">
                  <div>${song.replaceAll("%20","")}</div>
                  <div>Joy</div>
                </div>
                <div class="playnow">
                  <span>Play Now</span>
                <img class="invert" src="play.svg" alt="">
              </div>
              </li>
    </li>`;
}
// var audio=new Audio(songs[0]);
// audio.play();
Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e=>{
  e.addEventListener("click",element=>{
    console.log(e.querySelector(".info").firstElementChild.innerHTML)
    playMusic(e.querySelector(".info").firstElementChild.innerHTML)
  })


}); 
}
const playMusic=(track)=>{
  currentSong.src=`/${currFolder}/` + track;
  currentSong.play();
  play.src="pause.svg";
  document.querySelector(".songinfo").innerHTML=track;
  document.querySelector(".songtime").innerHTML="00.00/00.00";
}
async function main(){
await getSongs("songs/a");
play.addEventListener("click",()=>{
  if(currentSong.paused){
    currentSong.play();
    play.src="pause.svg"
  }
  else{
    currentSong.pause();
    play.src="play.svg"
  }
})
currentSong.addEventListener("timeupdate",()=>{
  // console.log(currentSong.currentTime,currentSong.duration)
  document.querySelector(".songtime").innerHTML=`${secondsToMinutesSeconds(currentSong.currentTime)}/${secondsToMinutesSeconds(currentSong.duration)}`
  document.querySelector(".circle").style.left=(currentSong.currentTime/currentSong.duration)*100+"%";
})
document.querySelector(".seekbar").addEventListener("click",e=>{
  let percent=(e.offsetX/e.target.getBoundingClientRect().width)*100;
  document.querySelector(".circle").style.left=percent+"%";
  currentSong.currentTime=(currentSong.duration*percent)/100;
 })
 document.querySelector(".hamburger").addEventListener("click",()=>{
  document.querySelector(".left").style.left="0";
 })
 document.querySelector(".close").addEventListener("click",()=>{
  document.querySelector(".left").style.left="-100%";
 })
 previous.addEventListener("click",()=>{
  console.log("previous click")
  console.log(currentSong);
  let index=songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
  if((index-1)>=0){
    playMusic(songs[index-1])
  }
 })
 next.addEventListener("click",()=>{
  console.log("next click")
  let index=songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
  console.log(index);
  if((index+1)<songs.length){
    playMusic(songs[index+1])
  }
 })
 document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
   currentSong.volume=(e.target.value)/100;
 })
 Array.from(document.getElementsByClassName("card")).forEach(e=>{
  e.addEventListener("click",async item=>{
    songs=await getSongs(`songs/${item.currentTarget.dataset.folder}`)
  })
 })
}  
main();
 