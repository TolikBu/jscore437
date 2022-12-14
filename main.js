const app = document.querySelector('.app');
const input = document.createElement('input');
const listName = document.createElement('div');
// const name = document.querySelector('.name-value');
// const owner = document.querySelector('.owner-value');
// const stars = document.querySelector('.stars-value');

input.classList.add('search');
app.appendChild(input);

input.addEventListener('keyup', () => {
  getRepo(input.value)
    .then((repo) => {
      getInfo(repo);
    })
    .catch((err) => console.log(err));
});

function getRepo(value) {
  return Promise.resolve().then(() => {
    return fetch(`https://api.github.com/search/repositories?q=${value}`).then((res) => res.json());
  });
}

function createElement(profilData) {
  listName.classList.add('list-name');
  listName.textContent = `${profilData.name}`
  app.appendChild(listName);
}

function getInfo(data) {
  let items = data.items;
  for (let el = 0; el < 5; el++) {
    let name = items[el];
    console.log(items[el].name);
    createElement(name);
  }
}

function deleteRepo() {
  const closeBtn = document.querySelectorAll('.delete')
  const item = document.querySelectorAll('.item')
  
}

