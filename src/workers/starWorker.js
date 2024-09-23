let timeElapsed = 0;

onmessage = function(e) {
    if (e.data === 'checkTime') {
        timeElapsed += 15

        if (timeElapsed >= 15) {
            postMessage('spawnStar');  
            timeElapsed = 0;
        }
    }
};
