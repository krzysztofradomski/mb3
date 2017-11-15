/* create buttons enabling user to delete own entries */
function drawDeleteEntryButton(whoId, whoName) {
    var entries = [].slice.call(document.querySelectorAll('.modal'));
    for (var entry in entries) {
        if (whoId !== "anonymous" && whoName !== "anonymous" && whoId === entries[entry].getAttribute('data-user-id') && whoName === entries[entry].getAttribute('data-user-name')) {
            console.log(entry, entries[entry].getAttribute('data-user-id'));
            var x = '<span class="delete">DEL</span>';
            if (!entries[entry].querySelector('.modal-footer').innerHTML.match(/DEL/)) {
                entries[entry].querySelector('.modal-footer').innerHTML = entries[entry].querySelector('.modal-footer').innerHTML + x;
            }
        }
    }
    var deleteLinks = document.querySelectorAll('.delete');
    Array.from(deleteLinks).forEach(link => {
    link.addEventListener('click', function(event) {
       var modalId = this.parentNode.parentNode.parentNode.id;
        var entryId = this.parentNode.parentNode.parentNode.id.replace("modal-", "");

        document.getElementById(entryId).remove();
        this.parentNode.parentNode.parentNode.fadeOut(1000, function() {
            document.getElementbyId(modalId).remove();
        });
        global.firebase.database().ref("/entries").once("value").then(function(snapshot) {
            var db = snapshot.val();
            db = db || [];
            var keys = Object.keys(db);

            for (var i = 0; i < keys.length; i++) {
                if (db[keys[i]].whoId === whoId && db[keys[i]].whoName === whoName && keys[i] === entryId) {
                    console.log("Removing entry by key equal to: " + keys[i]);
                    global.firebase.database().ref("/entries").child(keys[i]).remove();
                }
            }
        });
    });
});
    // document.querySelectorAll(".delete").on('click', function() {
    //     var modalId = this.parentNode.parentNode.parentNode.id;
    //     var entryId = this.parentNode.parentNode.parentNode.id.replace("modal-", "");

    //     document.getElementById(entryId).remove();
    //     this.parentNode.parentNode.parentNode.fadeOut(1000, function() {
    //         document.getElementbyId(modalId).remove();
    //     });
    //     global.firebase.database().ref("/entries").once("value").then(function(snapshot) {
    //         var db = snapshot.val();
    //         db = db || [];
    //         var keys = Object.keys(db);

    //         for (var i = 0; i < keys.length; i++) {
    //             if (db[keys[i]].whoId === whoId && db[keys[i]].whoName === whoName && keys[i] === entryId) {
    //                 console.log("Removing entry by key equal to: " + keys[i]);
    //                 global.firebase.database().ref("/entries").child(keys[i]).remove();
    //             }
    //         }
    //     });

    // });
}

export default drawDeleteEntryButton;