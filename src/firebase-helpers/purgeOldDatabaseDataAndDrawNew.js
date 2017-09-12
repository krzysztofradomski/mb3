function purgeOldDatabaseDataAndDrawNew(name, ref) {
    let deleted = 0;
    ref
        .once("value", (snap) => {
            snap.forEach((item) => {
                item.ref.remove();
                deleted +=1;
            });
            console.log(
                `Total outdated data removed from ${name}: ${deleted}`
            );
        })
        .then(() => {
            deleted !== 0 ?
                console.log(`Finished purging old data from: ${name}`) :
                console.log(`...  ${name} up to date, no data purged...`);
        });
};

export default purgeOldDatabaseDataAndDrawNew;