document.getElementById('startButton').addEventListener('click', function() {
    document.getElementById('startButton').style.display = 'none';
    document.getElementById('quizContainer').style.display = 'block';
    document.getElementById('controlButtons').style.display = 'block';
});

document.getElementById('pauseButton').addEventListener('click', function() {
    alert('Quiz gepauzeerd');
});

document.getElementById('exitButton').addEventListener('click', function() {
    if (confirm('Weet je zeker dat je de quiz wilt verlaten?')) {
        location.reload();
    }
});

