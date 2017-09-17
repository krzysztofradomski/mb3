
function stickyModals(i) {
    let modalId = "modal--sticky" + i;
    let id = "-sticky" + i;

    let modal = document.getElementById(modalId);
    modal.style.display = "none";

    let btn = document.getElementById(id);

    let span = document.getElementById("close-" + modalId);

    btn.onclick = function() {
        if (modal.style.display === "none") {
            modal.style.display = "block";
        } else {
            modal.style.display = "none";
        }
    };
    span.onclick = function() {
        modal.style.display = "none";
    };
}

export default stickyModals;