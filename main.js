const app = document.querySelector('.app');
const input = document.querySelector('input');
const autocompl = document.querySelector('.autocomp');
const itemsList = document.querySelector('.items-list');

// const debounce = (fn, debounceTime) => {
//   let timer;
//   console.log('work');
//   return function (...args) {
//     clearTimeout(timer);
//     const fnCall = () => {
//       fn.apply(this, args);
//     };
//     timer = setTimeout(fnCall, debounceTime);
//   };
// };

input.addEventListener('keyup', (e) => {
  let userData = e.target.value;
  getRepo(userData);
  if (!userData) {
    autocompl.innerHTML = '';
  }
});

function getRepo(value) {
  return Promise.resolve().then(async () => {
    return await fetch(`https://api.github.com/search/repositories?q=${value}`)
      .then((res) => res.json())
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

function createList(listName) {
  let item;
  let arrName = [];
  for (let el = 0; el < listName.length; el++) {
    item = listName[el].name;
    arrName.push(item);
    arrName = arrName.sort();
  }
  arrName = arrName.map((data) => {
    return (data = `<li class="autocomp-item">${data}</li>`);
  });
  arrName = arrName.join(' ');
  autocompl.innerHTML = arrName;

  const itemList = document.querySelectorAll('.autocomp-item');

  for (let el = 0; el < itemList.length; el++) {
    let element = itemList[el];
  
    element.addEventListener('click', (e) => {
      listName.forEach((el) => {
        if (el.name === e.target.textContent) {
          render(el.name, el.owners, el.star);
        }
      });
    });
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
