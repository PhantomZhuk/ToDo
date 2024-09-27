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
})