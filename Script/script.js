console.log("i am connected to website")
var currentSong;
var play= document.querySelector(".play").firstElementChild
let getSongDeatils = async() =>{
    let song= await fetch("/songs/")
    let songData = await song.text()
    let div = document.createElement("div")
    div.innerHTML= `${songData}`
    let links= div.getElementsByTagName("a")
    let songList= []
    for (let index = 0; index < links.length; index++) {
        const element = links[index];
        if(element.innerHTML.endsWith(".mp3")){
            songList.push(element.href)
        }
    }
    return songList
}

let convertSecondsToMinutes= (second) =>{
    let minute= Math.floor(second/60)
    let sec= Math.floor(second%60)

    let formatedMinute= String(minute).padStart(2, '0')
    let formatedSecond= String(sec).padStart(2, '0')

    return `${formatedMinute}:${formatedSecond}`
}

let playMusic = async(track) =>{
    document.getElementById("songName").innerHTML= `${track}`
    track= "/songs/" + track
    currentSong.src= track
    currentSong.play();
    play.src= `./Assets/pause.svg`
    
}

let main= async()=>{
    // get all the songs details
    currentSong=  new Audio()
    let songName= await getSongDeatils()

    currentSong.src= songName[0]
    
    
    //show all the songs in the playlist
    let songUL= document.querySelector(".songList").getElementsByTagName("ul")[0]
    for (let index = 0; index < songName.length; index++) {
        const element = songName[index];
        let songN= element.split("/songs/")
        songUL.innerHTML= songUL.innerHTML + ` 
                <li id=li${index} class="flex songRightCard">
                  <div class="songDetailsCard flex">
                    <img class="invert" src="./Assets/music-icon.svg" alt="music" />
                    <div class="songDetailLi flex">
                      <div>${songN[1].replaceAll("%20", " ")}</div>
                    <div class="artist">Artists</div>
                    </div>
                  </div>
                  <div class="playNow hide buttonContainer flex">
                    <img class="player" src="./Assets/playButton.svg" alt="PlayNow" />
                  </div>
                </li>`   
    }

    // add animation in the play button in playlist
    document.querySelectorAll(".songRightCard").forEach((e)=>{
        e.addEventListener("mouseover",()=>{
            let nodeId= e.id
            document.getElementById(`${nodeId}`).lastElementChild.classList.remove("hide")
            document.getElementById(`${nodeId}`).lastElementChild.classList.add("visibility")
            // document.getElementById(`${nodeId}`).classList.add("visibility")
            // nodeId.classList.remove("hide")
            // nodeId.classList.add("visibility")
        })

        e.addEventListener("mouseout",()=>{
            let nodeId= e.id
            document.getElementById(`${nodeId}`).lastElementChild.classList.remove("visibility")
            document.getElementById(`${nodeId}`).lastElementChild.classList.add("hide")
            // nodeId.classList.remove("visibility")
            // nodeId.classList.add("hide")
        })
    }) 

    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach((e)=>{
        e.addEventListener("click",(element)=>{
            console.log(e.firstElementChild.lastElementChild.firstElementChild.innerHTML)
            playMusic(e.firstElementChild.lastElementChild.firstElementChild.innerHTML.trim())
        })
    })

    play.addEventListener("click", ()=>{
        if(currentSong.paused){
            currentSong.play()
            play.src= `./Assets/pause.svg`
        }

        else{
            currentSong.pause()
            play.src= `./Assets/playButton.svg`
        }
    })
    
    currentSong.addEventListener("timeupdate", ()=>{
        console.log(currentSong.currentTime, currentSong.duration)
        document.querySelector(".currentTime").innerHTML= `${convertSecondsToMinutes(currentSong.currentTime)}`
        document.querySelector(".songDuration").innerHTML= `${convertSecondsToMinutes(currentSong.duration)}`
        document.querySelector(".circle").style.left= (currentSong.currentTime / currentSong.duration)*100 + "%"
    })

    document.querySelector(".seekBar").addEventListener("click",(e)=>{
        let timePercent= (e.offsetX/e.target.getBoundingClientRect().width)*100
        document.querySelector(".circle").style.left= `${Math.floor((e.offsetX/e.target.getBoundingClientRect().width)*100)}%`
        currentSong.currentTime = ((currentSong.duration) * timePercent)/100
    })

    document.querySelector(".menuBar").addEventListener("click",()=>{
        document.querySelector(".left-container").style.display= "flex"
    })

    document.querySelector(".crossBar").addEventListener("click",()=>{
        document.querySelector(".left-container").style.display= "none"
    })
}

main()



