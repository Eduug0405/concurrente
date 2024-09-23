console.log('Worker de mensajes inicializado');

onmessage = function(e) {
    const timePassed = e.data;
    console.log('wrker recibió el tiempo:', timePassed);

    if (timePassed === 30) {
        console.log('worker: 30 segundos, enviando mensaje');
        postMessage({ message: 'La dificultad aumentó' });
    }
    if (timePassed === 60) {
        console.log('Worker: 60 segundos, enviando mensaje');
        postMessage({ message: 'Modo imposible activado' });
    }
};
