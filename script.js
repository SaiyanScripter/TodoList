document.addEventListener("DOMContentLoaded", function () {
  const addTaskButton = document.getElementById("add-task-button");
  const contentSection = document.querySelector(".content-section");
  const themeButton = document.getElementById("theme-button");
  const timer = document.querySelector(".timer");
  let intervalId;
  let isAnyTimerActive = false;
  
  addTaskButton.addEventListener("click", function () {
    const task = createTaskElement();
    contentSection.appendChild(task);
  });

  function createTaskElement() {
    const task = document.createElement("div");
    const checkbox = document.createElement("input");
    const input = document.createElement("input");
    const label = document.createElement("label");
    const startButton = document.createElement("button");
    const deleteButton = document.createElement("button");
    let elapsedTime = 0;
    let totalElapsedTime = 0;
    let startTime;
    

    // Set the unique ID for the task element
    const taskId = `task-${Date.now()}`;
    task.id = taskId;
    
    task.classList.add("task");
    checkbox.type = "checkbox";
    checkbox.name = "tasks";
    checkbox.id = `task-${Date.now()}`;
    label.htmlFor = checkbox.id;
    label.classList.add("task-label");

    // Add the necessary attributes and event listeners for drag and drop
    task.setAttribute("draggable", "true");
    task.addEventListener("dragstart", handleDragStart);
    task.addEventListener("dragover", handleDragOver);
    task.addEventListener("drop", handleDrop);
    task.addEventListener("dragend", handleDragEnd);

    input.type = "text";
    input.placeholder = "Enter the task text";
    input.classList.add("task-input");
    input.addEventListener("blur", function () {
      if (input.value.trim()) {
        label.innerText = input.value;
        task.replaceChild(label, input);
        startButton.classList.add("start-button");
        startButton.innerText = "Start";
        deleteButton.classList.add("delete-button");
        deleteButton.innerHTML = "&times;";
        task.appendChild(startButton);
        task.appendChild(deleteButton);
      }
    });

    input.addEventListener("keyup", function (event) {
      if (event.keyCode === 13) {
        event.preventDefault();
        input.blur();
      }
    });

    startButton.addEventListener("click", function () {
      if (task.classList.contains("active")) {
        clearInterval(intervalId);
        totalElapsedTime += new Date().getTime() - startTime; // Store total elapsed time before pausing
        task.classList.remove("active");
        startButton.innerText = "Start";
        timer.classList.remove("active-timer");
        isAnyTimerActive = false; // Update the flag
      } else {
        if (!isAnyTimerActive) { // Check if no timer is active
          startTime = new Date().getTime();
          task.classList.add("active");
          startButton.innerText = "Pause";
          timer.classList.add("active-timer");
          isAnyTimerActive = true; // Update the flag
          intervalId = setInterval(function () {
            const currentTime = new Date().getTime();
            elapsedTime = currentTime - startTime;
            const totalTime = elapsedTime + totalElapsedTime;
            const hours = Math.floor(totalTime / (1000 * 60 * 60));
            const minutes = Math.floor(
              (totalTime % (1000 * 60 * 60)) / (1000 * 60)
            );
            const seconds = Math.floor((totalTime % (1000 * 60)) / 1000);
            timer.innerText = `${hours
              .toString()
              .padStart(2, "0")}:${minutes
              .toString()
              .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
          }, 1000);
        }
      }
    });          
    
    deleteButton.addEventListener("click", function () {
      task.remove();
    });

    // Reset the timer when the checkbox is checked
    checkbox.addEventListener("change", function () {
      if (this.checked) {
        // Strike out the task
        label.style.textDecoration = "line-through";
        label.style.opacity = "0.5";
        
        // Disable the start button
        startButton.disabled = true;
        startButton.style.opacity = "0.5";
    
        // Stop the timer if it's running
        if (task.classList.contains("active")) {
          clearInterval(intervalId);
          totalElapsedTime += new Date().getTime() - startTime;
          task.classList.remove("active");
          startButton.innerText = "Start";
          timer.classList.remove("active-timer");
          isAnyTimerActive = false;
        }
        
        // Reset the timer
        timer.innerText = "00:00:00";
      } else {
        // Remove strike out and enable the start button
        label.style.textDecoration = "none";
        label.style.opacity = "1";
        startButton.disabled = false;
        startButton.style.opacity = "1";
      }
    });
    

    task.appendChild(checkbox);
    task.appendChild(input);
    return task;
  }

  function handleDragStart(e) {
    this.style.opacity = "0.5";
    e.dataTransfer.setData("text/plain", this.id);
  }
  
  function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }
  
  function handleDrop(e) {
    e.preventDefault();
    const draggedTaskId = e.dataTransfer.getData("text/plain");
    const draggedTask = document.getElementById(draggedTaskId);
    contentSection.insertBefore(draggedTask, this);
  }
  
  function handleDragEnd() {
    this.style.opacity = "1";
  }  

  themeButton.addEventListener("click", function() {
    const currentTheme = contentSection.getAttribute("data-theme");
    
    if (currentTheme === "dark") {
      contentSection.setAttribute("data-theme", "light");
      contentSection.classList.remove("dark");
      themeButton.innerText = "Dark Theme";
    } else {
      contentSection.setAttribute("data-theme", "dark");
      contentSection.classList.add("dark");
      themeButton.innerText = "Light Theme";

    }
  });
  
});
