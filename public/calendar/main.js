$(document).ready(() => {
    $(`#taskList`).click(() => {
        window.location.href = '/';
    })

    $(`#calendar`).click(() => {
        window.location.href = '/calendar';
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
                                <div class="openAddtaskContainer" id="openAddtaskContainer${dayCounter}-${currentDate.getMonth() + 1}-${currentDate.getFullYear()}"><i class="fa-solid fa-plus" id="openAddtaskContainer${dayCounter}-${currentDate.getMonth() + 1}-${currentDate.getFullYear()}"></i></div>
                            </div>
                            <div class="tasksContainer" id="tasksContainer${dayCounter}-${currentDate.getMonth() + 1}-${currentDate.getFullYear()}">
                                
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
        console.log(ID);
    
        $(`#tasksContainer${ID}`).append(`
            <div class="task" id="task${ID}">Виконати роботу</div>
        `);
    });
    
})
