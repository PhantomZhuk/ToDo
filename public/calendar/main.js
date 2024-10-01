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
                    if (el.completed == false) {
                        if ($(`#tasksContainer${formattedDate}`).length) {
                            $(`#tasksContainer${formattedDate}`).prepend(`
                                <div class="task" id="task${el._id}">
                                    <p>${el.title}</p>
                                </div>
                            `);
                        }
                    } else if (el.completed == true) {
                        if ($(`#tasksContainer${formattedDate}`).length) {
                            $(`#tasksContainer${formattedDate}`).append(`
                                <div class="task" id="task${el._id}">
                                    <p>${el.title}</p>
                                </div>
                            `);
                        }
                        $(`#task${el._id}`).css(`opacity`, `0.4`);
                    }

                }
            })
            .catch(err => {
                console.error('Error fetching tasks:', err);
            });
    }


    getTasks()

    function openEditContainer(id) {
        axios.get(`/api/tasks`)
            .then(res => {
                $(`.editTaskContainer`).empty();
                for (let el of res.data) {
                    if (el._id == id) {
                        let dateString = el.date;

                        let date = new Date(dateString);
                        let formattedDate = date.toISOString().split('T')[0];

                        $(`.editTaskContainer`).css(`display`, `flex`);
                        if (el.completed == false) {
                            $(`.editTaskContainer`).append(`
                                <div class="editContainer" id="editContainer${el._id}">
                                <div class="header">
                                    <i class="fa-solid fa-xmark" id="closeEditBtn"></i>
                                </div>
                                <div class="titleContainer">
                                    <textarea class="taskTitle" id="taskTitle${el._id}" readonly>${el.title}</textarea>
                                    <i class="fas fa-edit editTask" id="editTask${el._id}"></i>
                                </div>
                                <div class="inputContainer">
                                    <input type="date" class="date" id="date${el._id}" value="${formattedDate}" readonly>
                                    <input type="time" class="withTime" id="withTime${el._id}" value="${el.withTime}" readonly>
                                    <input type="time"  class="toTime" id="toTime${el._id}" value="${el.toTime}" readonly>
                                </div>
                                <div class="btnContainer">
                                    <i class="fa-regular fa-square checkBox" id="checkBox${el._id}"></i>
                                    <i class="fas fa-trash deleteTask" id="deleteTask${el._id}"></i>
                                </div>
                            </div>
                                    `)
                        } else if (el.completed == true) {
                            $(`.editTaskContainer`).append(`
                                <div class="editContainer" id="editContainer${el._id}">
                                <div class="header">
                                    <i class="fa-solid fa-xmark" id="closeEditBtn"></i>
                                </div>
                                <div class="titleContainer">
                                    <textarea class="taskTitle" id="taskTitle${el._id}" readonly>${el.title}</textarea>
                                    <i class="fas fa-edit editTask" id="editTask${el._id}"></i>
                                </div>
                                <div class="inputContainer">
                                    <input type="date" class="date" id="date${el._id}" value="${formattedDate}" readonly>
                                    <input type="time" class="withTime" id="withTime${el._id}" value="${el.withTime}" readonly>
                                    <input type="time"  class="toTime" id="toTime${el._id}" value="${el.toTime}" readonly>
                                </div>
                                <div class="btnContainer">
                                    <i class="fa-regular fa-square-check checkBox" id="checkBox${el._id}"></i>
                                    <i class="fas fa-trash deleteTask" id="deleteTask${el._id}"></i>
                                </div>
                            </div>
                                    `)
                        }
                    }
                }
            })
    }

    $(`.tasksContainer`).on('click', '.task', (e) => {
        let ID = e.target.id.replace('task', '');

        openEditContainer(ID)
    })

    $(`.editTaskContainer`).on('click', '.deleteTask', (e) => {
        let ID = e.target.id.replace('deleteTask', '')

        axios.delete(`/app/tasks/${ID}`)
            .then(res => {
                console.log(res.data);
                getTasks();
                $(`.editTaskContainer`).css(`display`, `none`);
            })
            .catch(err => {
                console.error(`Error deleting task:`, err);
            });
    });


    $(`.editTaskContainer`).on('click', '.checkBox', (e) => {
        let ID = e.target.id.replace('checkBox', '');

        if ($(e.target).hasClass('fa-square')) {
            let data = {
                completed: true
            };

            axios.put(`/api/tasks/${ID}`, data)
                .then(res => {
                    $(e.target).removeClass('fa-square').addClass('fa-square-check');
                    getTasks();
                })
                .catch(err => {
                    console.error(`Error updating task:`, err);
                });

        } else if ($(e.target).hasClass('fa-square-check')) {
            let data = {
                completed: false
            };

            axios.put(`/api/tasks/${ID}`, data)
                .then(res => {
                    $(e.target).removeClass('fa-square-check').addClass('fa-square');
                    getTasks();
                })
                .catch(err => {
                    console.error(`Error updating task:`, err);
                });
        }
    });

    $(`.editTaskContainer`).on('click', '.editTask', (e) => {
        let ID = e.target.id.replace('editTask', '');
        console.log(ID);

        if ($(`#editTask${ID}`).hasClass('fa-edit')) {

            $(`#taskTitle${ID}`).removeAttr("readonly");
            $(`#date${ID}`).removeAttr("readonly");
            $(`#withTime${ID}`).removeAttr("readonly");
            $(`#toTime${ID}`).removeAttr("readonly");
            $(`#editTask${ID}`).addClass('fa-calendar-check').removeClass('fa-edit');

        } else if ($(`#editTask${ID}`).hasClass('fa-calendar-check')) {

            $(`#editTask${ID}`).removeClass('fa-calendar-check').addClass('fa-edit');
            $(`#taskTitle${ID}`).attr("readonly", true);
            $(`#date${ID}`).attr("readonly", true);
            $(`#withTime${ID}`).attr("readonly", true);
            $(`#toTime${ID}`).attr("readonly", true);

            if ($(`#taskTitle${ID}`).val().length >= 3) {
                if ($(`#date${ID}`).val() && $(`#date${ID}`)[0].checkValidity()) {
                    if ($(`#withTime${ID}`).val() && $(`#withTime${ID}`)[0].checkValidity()) {
                        if ($(`#toTime${ID}`).val() && $(`#toTime${ID}`)[0].checkValidity()) {

                            if ($(`#toTime${ID}`).val() > $(`#withTime${ID}`).val()) {
                                let data = {
                                    title: $(`#taskTitle${ID}`).val(),
                                    date: $(`#date${ID}`).val(),
                                    withTime: $(`#withTime${ID}`).val(),
                                    toTime: $(`#toTime${ID}`).val()
                                }

                                axios.put(`/api/tasks/${ID}`, data)
                                    .then(res => {
                                        getTasks();
                                    })
                                    .catch(err => {
                                        console.error(`Error updating task:`, err);
                                    });
                            } else {
                                displayNotification('To time must be greater than with time');
                                getTasks();
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
        }
    });

    $(`.editTaskContainer`).on('click', '#closeEditBtn', (e) => {
        $(`.editTaskContainer`).css(`display`, `none`);
    })
})
