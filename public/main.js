$(document).ready(function () {
    let filterOpen = false;
    $(`.filterBtn`).click(() => {
        if (filterOpen == false) {
            $(`.filterContainer`).css(`display`, `flex`);
            filterOpen = true;
        } else {
            $(`.filterContainer`).css(`display`, `none`);
            filterOpen = false;
        }
    })
    let importance = `all`;

    $(`#allImportance`).click(() => {
        importance = `all`;
        $(`#allImportance`).addClass(`selectedFilter`);
        $(`#hard`).removeClass(`selectedFilter`);
        $(`#medium`).removeClass(`selectedFilter`);
        $(`#default`).removeClass(`selectedFilter`);
    })

    $(`#hard`).click(() => {
        importance = `hard`;
        $(`#allImportance`).removeClass(`selectedFilter`);
        $(`#hard`).addClass(`selectedFilter`);
        $(`#medium`).removeClass(`selectedFilter`);
        $(`#default`).removeClass(`selectedFilter`);
    })

    $(`#medium`).click(() => {
        importance = `medium`;
        $(`#allImportance`).removeClass(`selectedFilter`);
        $(`#hard`).removeClass(`selectedFilter`);
        $(`#medium`).addClass(`selectedFilter`);
        $(`#default`).removeClass(`selectedFilter`);
    })

    $(`#default`).click(() => {
        importance = `default`;
        $(`#allImportance`).removeClass(`selectedFilter`);
        $(`#hard`).removeClass(`selectedFilter`);
        $(`#medium`).removeClass(`selectedFilter`);
        $(`#default`).addClass(`selectedFilter`);
    })

    let status = `all`;

    $(`#allStatus`).click(() => {
        status = `all`;
        $(`#allStatus`).addClass(`selectedFilter`);
        $(`#fulfilled`).removeClass(`selectedFilter`);
        $(`#unfulfilled`).removeClass(`selectedFilter`);
    })

    $(`#fulfilled`).click(() => {
        status = `fulfilled`;
        $(`#allStatus`).removeClass(`selectedFilter`);
        $(`#fulfilled`).addClass(`selectedFilter`);
        $(`#unfulfilled`).removeClass(`selectedFilter`);
    })

    $(`#unfulfilled`).click(() => {
        status = `unfulfilled`;
        $(`#allStatus`).removeClass(`selectedFilter`);
        $(`#fulfilled`).removeClass(`selectedFilter`);
        $(`#unfulfilled`).addClass(`selectedFilter`);
    })

    $(`#openAddTask`).click(() => {
        $(`.addTaskContainer`).css(`display`, `flex`);
    })

    $(`#closeBtn`).click(() => {
        $(`.addTaskContainer`).css(`display`, `none`);
    })

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
                $(`.tasksContainer`).empty();
                for (let el of res.data) {
                    if (el.completed == true) {
                        let dateString = el.date;

                        let date = new Date(dateString);
                        let formattedDate = date.toISOString().split('T')[0];

                        $(`.tasksContainer`).append(`
                        <div class="task" id="task${el._id}">
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
                        `);
                        $(`#task${el._id}`).css(`opacity`, `0.4`);
                    } else if (el.completed == false) {
                        let dateString = el.date;

                        let date = new Date(dateString);
                        let formattedDate = date.toISOString().split('T')[0];

                        $(`.tasksContainer`).prepend(`
                    <div class="task" id="task${el._id}">
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
                    }
                }
            })
    }

    getTasks();

    $(`.tasksContainer`).on('click', '.deleteTask', (e) => {
        let ID = e.target.id.replace('deleteTask', '')

        axios.delete(`/app/tasks/${ID}`)
            .then(res => {
                console.log(res.data);
                getTasks();
            })
            .catch(err => {
                console.error(`Error deleting task:`, err);
            });
    });


    $(`.tasksContainer`).on('click', '.checkBox', (e) => {
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

    $(`.tasksContainer`).on('click', '.editTask', (e) => {
        let ID = e.target.id.replace('editTask', '');
    
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
    
})