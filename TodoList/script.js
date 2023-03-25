document.getElementById('task-form').addEventListener('submit', addTask);

function addTask(e) {
    e.preventDefault();
    const taskInput = document.getElementById('task-input');
    const taskText = taskInput.value.trim();

    if (taskText) {
        const li = document.createElement('li');
        li.textContent = taskText;

        const timerButton = document.createElement('button');
        timerButton.textContent = 'Start Timer';
        timerButton.classList.add('timer');

        const pauseButton = document.createElement('button');
        pauseButton.textContent = 'Pause';
        pauseButton.classList.add('timer');
        pauseButton.style.display = 'none';

        let interval;
        let remainingTime;

        timerButton.addEventListener('click', () => {
            timerButton.style.display = 'none';
            pauseButton.style.display = 'inline';

            const duration = remainingTime || 25 * 60; // 25 minutes in seconds
            const endTime = Date.now() + duration * 1000; // Calculate end time

            interval = setInterval(() => {
                remainingTime = Math.round((endTime - Date.now()) / 1000);

                if (remainingTime <= 0) {
                    clearInterval(interval);
                    timerButton.textContent = "Time's Up!";
                } else {
                    const minutes = Math.floor(remainingTime / 60);
                    const seconds = remainingTime % 60;
                    timerButton.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
                }
            }, 1000);
        });

        pauseButton.addEventListener('click', () => {
            timerButton.style.display = 'inline';
            pauseButton.style.display = 'none';
            clearInterval(interval);
        });

        li.appendChild(timerButton);
        li.appendChild(pauseButton);
        document.getElementById('task-list').appendChild(li);
        taskInput.value = '';
    }
}
