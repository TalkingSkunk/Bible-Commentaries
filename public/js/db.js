// handle all offline activities (async task): sync up database with indexedDB (when indexedDB is changed when offline) when next time online, and store all database data in indexedDB to be accessed offline
db.enablePersistence()
  // catch error, and pass the err object...
  .catch(function(err) {
    // if there are multiple tabs open at once...
    if (err.code == 'failed-precondition') {
      console.log('persistance failed. Multiple tabs open.');
    // if the browser does not support indexedDB...
    } else if (err.code == 'unimplemented') {
      console.log('persistance not available. No browser support.');
    }
  });

// 24/7 real-time listener sends back changes to database immediate. onSnapshot method sends back any change to the collection through a callback function, which takes the snapshot object. (**Snapshot listens not only to changes to database, but also changes to indexedDB. So DOM will reflect the changes even when offline.**)
db.collection('books').onSnapshot(snapshot => {
  // docChanges() puts all changes into an array to the collection since the last snapshot. Then we cycle through each change object...
  snapshot.docChanges().forEach(change => {
    // sense the change in the Collection, and output to DOM so user can see the change.
    if(change.type === 'added'){
      // Add document data to DOM (trigger function from ui.js): doc property.data object (data inside each document), each id of document
      renderChapter(change.doc.data(), change.doc.id);
    };
    // sense the change in the Collection, and output to DOM so user can see the change.
    if(change.type === 'removed'){
      // Remove document data from DOM (trigger function from ui.js): id of document to be removed
      removeChapter(change.doc.id);
    };
  });
});

// ADD NEW CHAPTER
// pinpoint the form tag (only one) from DOM
const form = document.querySelector('form');
form.addEventListener('submit', evt => {
  // submit event, by default, refreshes the page.
  evt.preventDefault();
  // make a JS object from user's input in the form
  const chapter = {
    chapter: form.chapter.value.trim(),
    commentary: form.commentary.value.trim()
  };
  // Add the JS Object into the Collection
  db.collection('books').add(chapter)
    // no need to do .then (since there's nothing else to do)
    .catch(err => console.log(err));
  // clear the form inputs after.
  form.chapter.value = '';
  form.commentary.value = '';
});

// REMOVE A CHAPTER
// pinpoint the parent <div> containing all the documents
const chapterContainer = document.querySelector('.chapters');
// attach only one event listener to the parent <div>. Clicking anywhere inside the section will trigger the callback function.
chapterContainer.addEventListener('click', evt => {
  // if clicked target is <i> tag...
  if(evt.target.tagName === 'I'){
    // extract the attribute date (i.e. the id of the document)
    const id = evt.target.getAttribute('data-id');
    // pass on the id of the document to be deleted
    db.collection('books').doc(id).delete();
  }
})