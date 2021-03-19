// pinpoint the HTML element with class "chapters" (only in index.html)
const chapters = document.querySelector('.chapters');
// once all DOM content in browser are loaded, trigger a callback function
document.addEventListener('DOMContentLoaded', function() {
  // pinpoint the sidenav section
  const menus = document.querySelectorAll('.side-menu');
  // use the Sidenav from Materialize JS library, then initialize it (using init()), passing it the menus variable, and the optional object (specifies we want the sidenav to slide from the right)
  M.Sidenav.init(menus, {edge: 'right'});
  // pinpoint the sidenav section (add chapter form)
  const forms = document.querySelectorAll('.side-form');
  // use the Sidenav from Materialize JS library, then initialize it (using init()), passing it the forms variable, and the optional object (specifies we want the sidenav to slide from the left)
  M.Sidenav.init(forms, {edge: 'left'});
  // dropdown list of the books
  const dropdown = document.querySelectorAll('.dropdown-trigger');
  // initialize the Dropdown
  M.Dropdown.init(dropdown, {alignment: 'left'});
});

// render chapter data
const renderChapter = (data, id) => {
    const html = `
      <div class="card-panel chapter white row" data-id="${id}">
        <img src="./img/chapter.png" alt="chapter thumb">
        <div class="chapter-details">
          <div class="chapter-number">${data.chapter}</div>
          <div class="chapter-commentary">${data.commentary}</div>
        </div>
        <div class="chapter-delete">
          <i class="material-icons" data-id="${id}">delete_outline</i>
        </div>
      </div>
    `;
    chapters.innerHTML += html;
  };
  
  // remove chapter data
  const removeChapter = (id) => {
    // pinpoint div with class "chapter" which has the attribute with the value
    const chapter = document.querySelector(`.chapter[data-id="${id}"]`);
    chapter.remove();
  };