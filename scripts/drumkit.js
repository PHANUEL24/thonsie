// document.querySelector("button").addEventListener("click", handleClick)
// function handleClick(){
//     alert("Got clicked")
// }

// document.querySelectorAll(".drum").forEach(addEventListener("click", (e)=>{
//     // var audio = new Audio("sounds/" + e.target.id + ".mp3")
//     // var audio = new Audio("sounds/tom-1.mp3")
//     // audio.play()
// }))
for (var i = 0; i < document.querySelectorAll(".drum").length; i++) {
    document.querySelectorAll(".drum")[i].addEventListener("click", function () {
        var buttonInnerHTML = this.innerHTML;
        playSound(buttonInnerHTML)
        buttonAnimation(buttonInnerHTML)
    })
}
document.addEventListener("keypress", (e) => {
    playSound(e.key)
    buttonAnimation(e.key)
})


function playSound(key) {
    switch (key) {
        case "w":
            var audio = new Audio("sounds/tom-1.mp3")
            audio.play()
            break;
        case "a":
            var audio = new Audio("sounds/tom-2.mp3")
            audio.play()
            break;
        case "s":
            var audio = new Audio("sounds/tom-3.mp3")
            audio.play()
            break;
        case "d":
            var audio = new Audio("sounds/tom-4.mp3")
            audio.play()
            break;
        case "j":
            var audio = new Audio("sounds/snare.mp3")
            audio.play()
            break;
        case "k":
            var audio = new Audio("sounds/crash.mp3")
            audio.play()
            break;
        case "l":
            var audio = new Audio("sounds/kick-bass.mp3")
            audio.play()
            break;

        default:
            break;
    }
}

function buttonAnimation(currentKey){
    var activeButton = document.querySelector("."+currentKey);
    activeButton.classList.add("pressed")
    setTimeout(() => {activeButton.classList.remove("pressed")},100)
}
// const buttonAnimation = (e) => {
//     var activeButton = document.querySelectorAll("." + e)
//     activeButton.classList.add("pressed")

// }