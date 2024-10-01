$(document).ready(() => {
    $(`#taskList`).click(() => {
        window.location.href = '/';
    })

    $(`#calendar`).click(() => {
        window.location.href = '/calendar';
    })

    $(`#closeBtn`).click(() => {
        $(`.addTaskContainer`).css(`display`, `none`);
    })

    let currentDate = new Date();

    function updatedCalendar() {
        $('.calendarContainer').empty();

        let firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        let lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

        let today = new Date();

        let startDayOfWeek = firstDay.getDay();
        let totalDays = lastDay.getDate();

        let dayCounter = 1;

        for (let i = 0; i < 5; i++) {
            let row = $('<div class="row"></div>');

            for (let j = 0; j < 7; j++) {
                if (i === 0 && j < startDayOfWeek || dayCounter > totalDays) {
                    row.append('<div class="day empty"></div>');
                } else {
                    let dayCell = $(`
                        <div class="day">
                            <div class="header">
                                <div class="dayNumber">${dayCounter}</div>
                                <div class="openAddtaskContainer" id="openAddtaskContainer${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${dayCounter}"><i class="fa-solid fa-plus" id="openAddtaskContainer${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${dayCounter}"></i></div>
                            </div>
                            <div class="tasksContainer" id="tasksContainer${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${dayCounter}">
                                
                            </div>
                        </div>
                    `);

                    if (currentDate.getMonth() === today.getMonth() && currentDate.getFullYear() === today.getFullYear()) {
                        if (dayCounter === today.getDate()) {
                            dayCell.addClass('selected');
                        }
                    }

                    row.append(dayCell);
                    dayCounter++;
                }
            }

            $('.calendarContainer').append(row);
        }
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        $(`.currentDate`).text(`${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`);
    }

    updatedCalendar();

    $('.arrowLeft').click(() => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        updatedCalendar();
    })

    $('.arrowRight').click(() => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        updatedCalendar();
    })

    $('.calendarContainer').on('click', '.openAddtaskContainer', (e) => {
        let ID = e.target.id.replace('openAddtaskContainer', '');

        $(`.addTaskContainer`).css(`display`, `flex`);
        let [year, month, day] = ID.split('-');

        if (day < 10) {
            day = `0${day}`;
        }

        if (month < 10) {
            month = `0${month}`;
        }

        let reversedDate = `${year}-${month}-${day}`;
        $(`#date`).val(reversedDate);
    });

    $(`#addTask`).click(() => {
        if ($(`#title`).val().length >= 3) {
            if ($(`#date`).val() && $('#date')[0].checkValidity()) {
                if ($(`#withTime`).val() && $('#withTime')[0].checkValidity()) {
                    if ($(`#toTime`).val() && $('#toTime')[0].checkValidity()) {

                        if ($(`#toTime`).val() > $(`#withTime`).val()) {
                            let data = {
                                title: $(`#title`).val(),
                                date: $(`#date`).val(),
                                withTime: $(`#withTime`).val(),
                                toTime: $(`#toTime`).val(),
                                completed: false
                            }

                            $(`#title`).val(``);
                            $(`#date`).val(``);
                            $(`#withTime`).val(``);
                            $(`#toTime`).val(``);

                            axios.post(`/api/tasks`, data)
                                .then(res => {
                                    console.log(res.data)
                                    getTasks();
                                    $(`.addTaskContainer`).css(`display`, `none`);
                                })
                        } else {
                            displayNotification('To time must be greater than with time');
                        }
                    } else {
                        displayNotification('To time is required');
                    }
                } else {
                    displayNotification('With time is required');
                }
            } else {
                displayNotification('Date is required');
            }
        } else {
            displayNotification('Title must be at least 3 characters');
        }
    });

    let notificationTimeout;

    function displayNotification(message) {

        if (notificationTimeout) {
            clearTimeout(notificationTimeout);
        }

        $(`.notificationContainer`).empty();

        $(`.notificationContainer`).append(`
        <div class="notification">
            <p>${message}</p>
        </div>
    `);

        notificationTimeout = setTimeout(() => {
            $(`.notificationContainer`).empty();
        }, 4000);
    }

    function getTasks() {
        axios.get(`/api/tasks`)
            .then(res => {
                $('.tasksContainer').empty();
    
                for (let el of res.data) {
                    let dateString = el.date;
                    let date = new Date(dateString);
                    let formattedDate = date.toISOString().split('T')[0];
    
                    let [year, month, day] = formattedDate.split('-');
                    month = parseInt(month, 10);
                    day = parseInt(day, 10);
    
                    formattedDate = `${year}-${month}-${day}`;
    
                    if ($(`#tasksContainer${formattedDate}`).length) {
                        $(`#tasksContainer${formattedDate}`).prepend(`
                            <div class="task" id="task${el._id}">
                                <p>${el.title}</p>
                            </div>
                        `);
                    }
                }
            })
            .catch(err => {
                console.error('Error fetching tasks:', err);
            });
    }
    

    getTasks()
})
