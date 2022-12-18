const app = document.querySelector('.app');
const input = document.querySelector('input');
const autocompl = document.querySelector('.autocomp');
const itemsList = document.querySelector('.items-list');

const debounce = (fn, debounceTime) => {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    const fnCall = () => {
      fn.apply(this, args);
    };
    timer = setTimeout(fnCall, debounceTime);
  };
};

const debouncedGetRepo = debounce(getRepo, 200);

input.addEventListener('input', (e) => {
  let userData = e.target.value;
  debouncedGetRepo(userData);
  if (!userData) {
    autocompl.innerHTML = '';
  }
});

function getRepo(value) {
  return Promise.resolve().then(async () => {
    return await fetch(`https://api.github.com/search/repositories?q=${value}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(res.statusText);
        }

        return res.json();
      })
      .then((repo) => {
        if (repo.items.length === 0) {
          autocompl.innerHTML = ' ';
        } else {
          getInfo(repo);
        }
      })
      .catch((err) => console.log(err));
  });
}

function getInfo(data) {
  autocompl.innerHTML = '';

  let name, star, owners;
  let items = data.items;

  let arrName = [];
  for (let el = 0; el < items.length; el++) {
    name = items[el].name;
    star = items[el].stargazers_count;
    owners = items[el].owner.login;
    let newObj = { name, owners, star };
    arrName.push(newObj);
  }
  createList(arrName);
}

function createList(data) {
  for (const item of data) {
    const el = document.createElement('li');
    el.classList.add('autocomp-item');
    el.textContent = item.name;

    el.addEventListener('click', () => {
      render(item.name, item.owners, item.star);
    });

    autocompl.append(el);
  }
}

const render = (name, owners, star) => {
  const item = document.createElement('div');
  item.classList.add('item');
  const button = document.createElement('button');
  button.classList.add('delete');
  const wrapperInfo = document.createElement('div');
  wrapperInfo.classList.add('wrapper-info');
  item.append(wrapperInfo);
  const itemName = document.createElement('div');
  itemName.classList.add('item-name');
  const itemOwner = document.createElement('div');
  itemOwner.classList.add('item-owner');
  const itemStars = document.createElement('div');
  itemStars.classList.add('item-stars');
  const nameKey1 = document.createElement('div');
  const nameValue1 = document.createElement('div');
  nameKey1.classList.add('name-key');
  nameValue1.classList.add('name-value');
  const nameKey2 = document.createElement('div');
  const nameValue2 = document.createElement('div');
  nameKey2.classList.add('owner-key');
  nameValue2.classList.add('owner-value');
  const nameKey3 = document.createElement('div');
  const nameValue3 = document.createElement('div');
  nameKey3.classList.add('star-key');
  nameValue3.classList.add('star-value');

  nameKey1.textContent = 'Name: ';
  nameValue1.textContent = name;
  nameKey2.textContent = 'Owner: ';
  nameValue2.textContent = owners;
  nameKey3.textContent = 'Stars: ';
  nameValue3.textContent = star;

  item.append(wrapperInfo, button);
  wrapperInfo.append(itemName, itemOwner, itemStars);
  itemName.append(nameKey1, nameValue1);
  itemOwner.append(nameKey2, nameValue2);
  itemStars.append(nameKey3, nameValue3);
  itemsList.append(item);

  item.addEventListener('click', (e) => {
    let target = e.target.closest('.delete');
    if (target) {
      item.remove();
    }
  });
};
