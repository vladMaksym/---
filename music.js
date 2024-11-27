//                                                          music
document.addEventListener('DOMContentLoaded', function() {
    const audio = document.getElementById('backgroundMusic');
    let hasInteracted = false;
    // Function to play audio
    function playAudio() {
        if (!hasInteracted) {
            const playPromise = audio.play();
            
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    // Playback started successfully
                    hasInteracted = true;
                    removeEventListeners();
                })
                .catch(error => {
                    // Auto-play was prevented
                    console.log("Playback prevented:", error);
                });
            }
        }
    }
    // Function to remove event listeners
    function removeEventListeners() {
        document.removeEventListener('scroll', playAudio);
        document.removeEventListener('click', playAudio);
        document.removeEventListener('keydown', playAudio);   
    }
    // Add event listeners for common user interactions
    document.addEventListener('scroll', playAudio);
    document.addEventListener('click', playAudio);
    document.addEventListener('keydown', playAudio);   
});