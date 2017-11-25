
function drawDeleteEntryButton(whoId, whoName) {
    let entries = [].slice.call(document.querySelectorAll('.modal'));
    console.log(entries)
    entries.map(function(entry) {
        
        if (entry.getAttribute('data-user-id') !== null && entry.getAttribute('data-user-name') !== null
            && 'anonymous' !== entry.getAttribute('data-user-id') && 'anonymous' !== entry.getAttribute('data-user-name') 
            && whoId === entry.getAttribute('data-user-id') && whoName === entry.getAttribute('data-user-name')) {
            console.log('del ' + entry + ' ' + entry.getAttribute('data-user-id') + ' ' + entry.getAttribute('data-user-name'));
            console.log(entry.querySelector('.modal-footer').innerHTML)
            let x = '<span class="delete">DEL</span>';
            if (!entry.querySelector('.modal-footer').innerHTML.match(/DEL/)) {
                entry.querySelector('.modal-footer').innerHTML = entry.querySelector('.modal-footer').innerHTML + x;
            }
        }
    });
    let deleteLinks = document.querySelectorAll('.delete');
    Array.from(deleteLinks).forEach(link => {
    link.addEventListener('click', function(event) {
       let modalId = this.parentNode.parentNode.parentNode.id;
        let entryId = this.parentNode.parentNode.parentNode.id.replace("modal-", "");

            
        	if (modalId) {
        		document.getElementById(modalId).remove();
        	}
            if (entryId) {
                document.getElementById(entryId).remove();
            }      
        
        global.firebase.database().ref("/entries").once("value").then(function(snapshot) {
            let db = snapshot.val();
            db = db || [];
            let keys = Object.keys(db);

            for (let i = 0; i < keys.length; i++) {
                if (db[keys[i]].whoId === whoId && db[keys[i]].whoName === whoName && keys[i] === entryId) {
                    console.log("Removing entry by key equal to: " + keys[i]);
                    global.firebase.database().ref("/entries").child(keys[i]).remove();
                }
            }
        });
    });
});

}

export default drawDeleteEntryButton;