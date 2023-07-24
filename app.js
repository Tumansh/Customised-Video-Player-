//PART1: Get elements from the DOM
const player = document.querySelector('.player');//getting the entire vidoe player div
const video = player.querySelector('.viewer');//getting the video element
const progress = player.querySelector('.progress');//getting the progress div
const progress_bar = player.querySelector('.progress_filled'); //getting the progress bar
const toggle = player.querySelector('.toggle'); //getting the toggle button
const sliders = player.querySelectorAll('.player_slider'); //getting all elements that have player_slider class
const skip_buttons = player.querySelectorAll('[data-skip]')  //getting all elements that have a data-skip attribute
const fullscreenButton = player.querySelector('#fullscreen')//get the fulsreen button
progress_bar.style.flexBasis = `0%`;//initially, the progress bar should be 0% filled
//--------------------------------------------------------
//PART2: Build functions
//Function to implement toggle play/pause feature:
function togglePlay(){
    if(video.paused){
        video.play();
    }
    else{
        video.pause();
    }
}
//function to update the play/pause button whenever video gets paused, and event listener is fired,
function updateButton(){ 
    if(this.paused)
    {
        toggle.textContent = '►';
    }
    else{
        toggle.textContent = '❚ ❚';
    }
}
//function to skip forward and backward in the video
function skipping(){ //'this' is the skip button that was clicked
    console.log(this.dataset.skip);
    console.log(typeof(this.dataset.skip)); //it gives the time for which the video needs to be skipped, but that is a string. Use typeof() to know the data type 
    skipTime = parseFloat(this.dataset.skip);//use parseFloat() to convert string to number. 
    video.currentTime+=skipTime;
}
//function to update the video when slider value changes
function handleSliderUpdate(){
    console.log(this.value); //'this' is the slider whose value is being changed. The slider can be volume slider or speed slider
    console.log(this.name);//this.name tells us which slider's value has been changed now, and acc we apply change to the video
    video[this.name]=this.value; //if this.name = volume, then the volume property of video will be updated, if this.name = playBackRate, then speed of video will be updated
}

function handleProgressBarUpdate(){
    //we need to find % duration of video played
    const percent = (video.currentTime / video.duration)*100;
    progress_bar.style.flexBasis = `${percent}%`;
}
//To scrub in the progress bar of the video
function scrub(e){
    // console.log(this);
    console.log(e);//e is the target on which the click event is being fired. Actually e is the progress_bar that has been filled 
    const scrubTime = (e.offsetX/progress.offsetWidth)*video.duration;//e.offsetX tells the hz width upto which progressBar has been filled, progress.offsetWidth tells the entire width of the progress div
    //if e.offsetX=30 and progress.offsetWidth = 60, then we have reached half way through the progress bar and scrub time is 1/2* video duration
    // console.log(scrubTime);
    video.currentTime = scrubTime;//update the currentTime of the video to the calculated scrub time
}

function toggleFullScreen(){
    if(video.requestFullscreen){
        console.log("Inside toggle");
        video.requestFullscreen();
        // fullscreenButton.textContent  = '><' //fix this line
    }
    
}
//------------------------------------------------
//PART3: Hook up the event listeners
//->to add event listeners such that the video is paused/played on clicking toggle button as well as the video
toggle.addEventListener('click',togglePlay);//refer to togglePlay whenever the click event is fired
video.addEventListener('click',togglePlay);

//->we don't want that play/pause button gets updated only when click is done, as there video might be paused when 
//a popup comes or anything else happens. So we can't hook the update button to the click event listener as it confines our functionality.
//We must update button when video gets played/paused by any reason
video.addEventListener('play',updateButton); //we refer to the name of updateButton(), we are not calling it
video.addEventListener('pause',updateButton);

//->adding event listener on each skip button
skip_buttons.forEach(function(button){
    button.addEventListener('click', skipping);//whenever any skip button is clicked, we refer to the skipping function to move forward or backward
})

//adding event listener on slider whenever change occurs on slider
sliders.forEach(function(slider){
    slider.addEventListener('change', handleSliderUpdate);//we refer to handleSliderUpdate whenever the change event is fired
});

sliders.forEach(function(slider){
    slider.addEventListener('mousemove', handleSliderUpdate);//we refer to handleSliderUpdate whenever the mousemove event is fired
});

//adding an event listener to video, whenever the timeupdate property changes, we need to update the progressBar
video.addEventListener('timeupdate',handleProgressBarUpdate);//refer to the handleProgressBar() to update the progress bar acc to the current time of the video

//adding an event listener to the progress bar so that whenever someone clicks on it or drags mouse over it, the scrub function is refered
progress.addEventListener('click',scrub);
let mousedown = false;
progress.addEventListener('mousemove', (e)=>mousedown && scrub(e)); //if mousedown is true, only then we will be able to call scrub() passing the event, otherwise it will return false

progress.addEventListener('mousedown',() => mousedown = true);
progress.addEventListener('mouseup',() => mousedown = false);

fullscreenButton.addEventListener('click',toggleFullScreen);
//Problem ho rahi hai: Jab fullscreen ho raha hai tab custom controls gayab ho jate hain...solve this issue ASAP!!!