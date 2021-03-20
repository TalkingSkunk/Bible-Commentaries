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

// ADD A NEW BOOK
// pinpoint the form from DOM
const bookForm = document.querySelector('#newBookForm');
bookForm.addEventListener('submit', evt =>{
  // submit event, by default, refreshes the page.
  evt.preventDefault();
  // extract user input for book name
  const book = bookForm.book.value.trim();
  // Create a document with the Book name as its unique ID
  db.collection('books').doc(book).set({})
    // no need to do .then (since there's nothing else to do)
    .catch(err => console.log(err));
  // clear the form inputs after.
  bookForm.book.value = '';

  // fetch all documents inside collection "fragments" inside the Book document
  // db.collection('books').doc(book).collection('fragments').get()
  //   .then(snapshot => {
  //     snapshot.docs.forEach(doc => {
  //     //populate with the documents found in the book's subcollection (trigger function from ui.js)
  //     renderChapter(doc.data(), doc.id);
  //     })
  //   })
  // send title data to DOM (trigger function from ui.js)
  renderTitle(book);
})
// fetch all documents inside collection, and populate the bookList dropdown menu
db.collection('books').onSnapshot(snapshot => {
  snapshot.docChanges().forEach(change => {
    // sense the change in the Collection, and output to DOM so user can see the change.
    if(change.type === 'added'){
      // send title data to DOM (trigger function from ui.js)
      renderBookList(change.doc.id);
    };
  })
});

// pinpoint the bookList Dropdown menu section
const bookList2 = document.querySelector('#bookList');
// Listen for a click anywhere inside the section...
bookList2.addEventListener('click', evt => {
  // if you click on the "anchor" tag...
  if(evt.target.tagName === 'A'){
    // extract the attribute data (i.e. the id of the document; i.e. the book name)
    const book = evt.target.getAttribute('data-id');
    // pinpoint the HTML element with class "chapters" (only in index.html)
    const chapters2 = document.querySelector('.chapters');
    // refresh the DOM every time a new Anchor tag is clicked.
    chapters2.innerHTML = '';

    // 24/7 real-time listener sends back changes to database immediate. onSnapshot method sends back any change to the collection through a callback function, which takes the snapshot object. (**Snapshot listens not only to changes to database, but also changes to indexedDB. So DOM will reflect the changes even when offline.**)
    db.collection('books').doc(book).collection('fragments').onSnapshot(snapshot => {
      // docChanges() puts all changes into an array to the collection since the last snapshot. Then we cycle through each change object...
      snapshot.docChanges().forEach(change => {
        console.log('change:', change)
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
  }
});
  
// ADD NEW CHAPTER
// pinpoint the form from DOM
const chapterForm = document.querySelector('#newChapterForm');
chapterForm.addEventListener('submit', evt => {
  // submit event, by default, refreshes the page.
  evt.preventDefault();
  // make a JS object from user's input in the form
  const chapter = {
    chapter: chapterForm.chapter.value.trim(),
    commentary: chapterForm.commentary.value.trim()
  };
  // find what book we are in
  const book = document.querySelector('#bookTitle').getAttribute('data-id');
  // Add the JS Object into the Collection
  db.collection('books').doc(book).collection('fragments').add(chapter)
    // no need to do .then (since there's nothing else to do)
    .catch(err => console.log(err));
  // clear the form inputs after.
  chapterForm.chapter.value = '';
  chapterForm.commentary.value = '';
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
    db.collection('books').doc(book).collection('fragments').doc(id).delete();
  }
})