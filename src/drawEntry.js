/* create board item in the html */
function drawEntry(expire, entryKey, title, category, message, email, timestamp, whoId, whoName, handle) {
    /*console.log("drawing single entry " + entryKey);*/
    let categoryZeroContainer = document.getElementById("cat0");
let categoryOneContainer = document.getElementById("cat1");
let categoryTwoContainer = document.getElementById("cat2");
let categoryThreeContainer = document.getElementById("cat3");
let shoutboxContainer = document.getElementById("shoutbox-inner");
    let who = handle || whoName;
    let id = entryKey;
    let modalId = "modal-" + entryKey;
    let startDate = new Date(timestamp).toLocaleDateString() + " at " + new Date(timestamp).toLocaleTimeString().slice(0, 5);
    let expiryDate = new Date(timestamp + expire * 60 * 60 * 1000).toLocaleDateString() + " at " + new Date(timestamp + expire * 60 * 60 * 1000).toLocaleTimeString().slice(0, 5);

    let modalContent = '<div id="' + modalId + '" class="modal ' + entryKey + '" data-user-id="' + whoId + '" data-user-name="' + who + '">' +
        '<div class="modal-content">' +
        '<div class="modal-header">' +
        '<span id="close-' + modalId + '" class="close" style="float: right">&times;</span>' +
        '<h2>' + title + '</h2>' +
        '</div>' +
        '<div class="modal-body">' +
        '<p>' + message + '</p>' +
        '</div>' +
        '<div class="modal-footer">' +
        '<p>' + who + ", " + email + '</p>' +
        '<p>Added on: ' + startDate + "<br>Expires on: " + expiryDate + '</p>' +
        '</div>' +
        '</div></div>';

    switch (category) {
        case "Category 0":
            categoryZeroContainer.insertAdjacentHTML('beforeend', '<div data-cat="' + category + '" class="board-item ' + entryKey + '" id="' + id + '"><h4>' + title + " - " + whoName + '</h4><p>' + message + '</p></div>' + modalContent);
            break;
        case "Category 1":
            categoryOneContainer.insertAdjacentHTML('beforeend', '<div data-cat="' + category + '" class="board-item ' + entryKey + '" id="' + id + '"><h4>' + title + " - " + whoName + '</h4><p>' + message + '</p></div>' + modalContent);
            break;
        case "Category 2":
            categoryTwoContainer.insertAdjacentHTML('beforeend', '<div data-cat="' + category + '" class="board-item ' + entryKey + '" id="' + id + '"><h4>' + title + " - " + whoName + '</h4><p>' + message + '</p></div>' + modalContent);
            break;
        case "Category 3":
            categoryThreeContainer.insertAdjacentHTML('beforeend', '<div data-cat="' + category + '" class="board-item ' + entryKey + '" id="' + id + '"><h4>' + title + " - " + whoName + '</h4><p>' + message + '</p></div>' + modalContent);
            break;
        default:
            categoryZeroContainer.insertAdjacentHTML('beforeend', '<div data-cat="' + category + '" class="board-item ' + entryKey + '" id="' + id + '"><h4>' + title + " - " + whoName + '</h4><p>' + message + '</p></div>' + modalContent);
            break;
    }
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
    return modalId;
}

export default drawEntry;