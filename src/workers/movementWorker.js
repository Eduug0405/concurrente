let positionX = 0;  
let screenWidth = 0;  

onmessage = function(e) {
    const { direction, speed, width } = e.data;

    if (width) {
        screenWidth = width;
    }

    if (direction === 'left') {
        positionX -= speed;
    } else if (direction === 'right') {
        positionX += speed;
    }

    if (positionX < 0) {
        positionX = 0;
    } else if (positionX > screenWidth) {
        positionX = screenWidth;
    }

    postMessage({ positionX });
};
