/* create board item in the html */
function drawEntry(expire, item) {
    /*console.log("drawing single entry " + key);*/
    let categoryZeroContainer = document.getElementById("cat0");
    let categoryOneContainer = document.getElementById("cat1");
    let categoryTwoContainer = document.getElementById("cat2");
    let categoryThreeContainer = document.getElementById("cat3");
    let who = item.handle || item.whoName;
    let id = item.key;
    let modalId = "modal-" + item.key;
    let startDate = new Date(item.timestamp).toLocaleDateString() + " at " + new Date(item.timestamp).toLocaleTimeString().slice(0, 5);
    let expiryDate = new Date(item.timestamp + expire * 60 * 60 * 1000).toLocaleDateString() + " at " + new Date(item.timestamp + expire * 60 * 60 * 1000).toLocaleTimeString().slice(0, 5);

    let modalContent = '<div id="' + modalId + '" class="modal ' + item.key + '" data-user-id="' + item.whoId + '" data-user-name="' + item.whoName + '">' +
        '<div class="modal-content">' +
        '<div class="modal-header">' +
        '<span id="close-' + modalId + '" class="close" style="float: right">&times;</span>' +
        '<h2>' + item.title + '</h2>' +
        '</div>' +
        '<div class="modal-body">' +
        '<p >' + item.message + '</p>' +
        '</div>' +
        '<div class="modal-footer">' +
        '<p>' + who + ", " + item.email + '</p>' +
        '<p>Added on: ' + startDate + "<br>Expires on: " + expiryDate + '</p>' +
        '</div>' +
        '</div></div>';

    switch (item.category) {
        case "Category 0":
            categoryZeroContainer.insertAdjacentHTML('beforeend', '<div data-cat="' + item.category + '" class="board-item ' + item.key + '" id="' + id + '"><h4>' + item.title + '</h4><p>' + item.message + '</p></div>' + modalContent);
            break;
        case "Category 1":
            categoryOneContainer.insertAdjacentHTML('beforeend', '<div data-cat="' + item.category + '" class="board-item ' + item.key + '" id="' + id + '"><h4>' + item.title + '</h4><p>' + item.message + '</p></div>' + modalContent);
            break;
        case "Category 2":
            categoryTwoContainer.insertAdjacentHTML('beforeend', '<div data-cat="' + item.category + '" class="board-item ' + item.key + '" id="' + id + '"><h4>' + item.title + '</h4><p>' + item.message + '</p></div>' + modalContent);
            break;
        case "Category 3":
            categoryThreeContainer.insertAdjacentHTML('beforeend', '<div data-cat="' + item.category + '" class="board-item ' + item.key + '" id="' + id + '"><h4>' + item.title + '</h4><p>' + item.message + '</p></div>' + modalContent);
            break;
        default:
            categoryZeroContainer.insertAdjacentHTML('beforeend', '<div data-cat="' + item.category + '" class="board-item ' + item.key + '" id="' + id + '"><h4>' + item.title + '</h4><p>' + item.message + '</p></div>' + modalContent);
            break;
    }
    let modal = document.getElementById(modalId);
    modal.style.display = "none";

    let btn = document.getElementById(id);

     let root = document.getElementById('root');

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
    root.addEventListener("click", function() {
    	 window.event.target.id === modalId ?  modal.style.display = "none" : '';
    });
    return modalId;
}

export default drawEntry;