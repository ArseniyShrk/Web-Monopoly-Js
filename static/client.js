const socket = io();
const grid = document.querySelector('.card-grid');
const dices = document.querySelectorAll('.dice');
const car_layer = document.querySelector('.car-container');
const dialog_name_inputs = document.querySelectorAll('.name-input');
let cards = [];

const card_sprites = []; // сards V
for (let i; card_sprites.length < 40; i++) {
  card_sprites.push('card-placeholder.png');
};

const card_positions = [{ row: 1, column: 1 }];
for (let i = 1; card_positions.length < 12; i++) {
  card_positions.push({ row: 2, column: i });
};
card_positions.push({ row: 1, column: 11 });

card_sprites.forEach((file_name, i) => {
  let card = document.createElement('img');
  card.src = `/static/sprites/${file_name}`;
  card.linked_objects = [];
  card.classList.add('card');
  if (i < 13) {
    if (i === 0 || i === 1) {
      card.style.rotate = '90deg';
      card.style.left = '-1.9em';
    } else if (i === 12) {
      card.style.rotate = '270deg';
      card.style.right = '-1.9em';
    } else {
      card.style.rotate = '0deg';
      card.style.removeProperty('left');
      card.style.removeProperty('right');
    };
    card.style.gridRow = card_positions[i].row;
    card.style.gridColumn = card_positions[i].column;
    grid.appendChild(card);
  };
  cards.push(card)
});

function shift_cards() {
  let last_element = cards.pop();
  cards.unshift(last_element);
  for (let i = 0; i < 40; i++) {
    let card = cards[i];
    if (i < 13) {
      if (i === 0 || i === 1) {
        card.style.rotate = '90deg';
        card.style.left = '-1.9em';
      } else if (i === 12) {
        card.style.rotate = '270deg';
        card.style.right = '-1.9em';
      } else {
        card.style.rotate = '0deg';
        card.style.removeProperty('left');
        card.style.removeProperty('right');
      };
      card.style.gridRow = card_positions[i].row;
      card.style.gridColumn = card_positions[i].column;
      grid.appendChild(card);

    } else {
      if (card in grid.children) {
        grid.removeChild(card);
      };
    };
    try {
      dx = card_positions[i].column - card_positions[i - 1].column;
      dy = card_positions[i].row - card_positions[i - 1].row;
    } catch (TypeError) {
      dx = 0;
      dy = 0;
    };
    for (let j = 0; j < card.linked_objects.length; j++) {
      link_object(card, card.linked_objects[j]);
    };

    card.style.transition = 'none';
    if (i === 1) {
      card.style.transform = `translate(${-dy * 7.8}em, ${-dx * 11.55}em)`
    } else if (i === 12) {
      card.style.transform = `translate(${dy * 7.8}em, ${dx * 11.55}em)`;
    } else {
      card.style.transform = `translate(${-dx * 7.8}em, ${-dy * 11.55}em)`;
    };
    card.offsetHeight;
    card.style.transform = 'translate(0,0)';
    card.style.transition = 'linear 0.15s';
    for (let j = 0; j < card.linked_objects.length; j++) {
      card.linked_objects[j].style.transition = 'none';
      if (cards[0] === card) {
        card.linked_objects[j].style.transform = `translate(0em, -11.55em)`;
        card.linked_objects[j].style.visibility = 'hidden';
        setTimeout(() => { card.linked_objects[j].style.visibility = 'visible' }, 92)
      } else {
        card.linked_objects[j].style.transform = `translate(${-dx * 7.8}em, ${-dy * 11.55}em)`;
      };
      card.linked_objects[j].offsetHeight;
      card.linked_objects[j].style.transform = 'translate(0,0)';
      card.linked_objects[j].style.transition = 'linear 0.15s';
    };
  };
}; // dices V

dice_sprites_left = ['dice-two.png', 'dice-three.png',
  'dice-four.png', 'dice-five.png', 'dice-six.png'];
dice_sprites_right = ['dice-two.png', 'dice-three.png',
  'dice-four.png', 'dice-five.png', 'dice-six.png'];
current_sprites = ['dice-one.png', 'dice-one.png'];
function throw_dice(result) {
  for (let i = 10; i > 0; i--) {
    setTimeout(() => {
      let random_val = Math.round(Math.random() * 4);
      dices[0].src = `/static/sprites/${dice_sprites_left[random_val]}`;
      let tmp = dice_sprites_left[random_val];
      dice_sprites_left[random_val] = current_sprites[0];
      current_sprites[0] = tmp;
      random_val = Math.round(Math.random() * 4);
      dices[1].src = `/static/sprites/${dice_sprites_right[random_val]}`;
      tmp = dice_sprites_right[random_val];
      dice_sprites_right[random_val] = current_sprites[1];
      current_sprites[1] = tmp;
    }, 200 * i);
  };

  let dices_final_result = [Math.floor(Math.random() *
    (Math.min(6, result - 1) - Math.max(1, result - 6) + 1) +
    Math.max(1, result - 6))];
  dices_final_result.push(result - dices_final_result[0]);

  setTimeout(() => {
    let random_val = Math.round(Math.random() * 4);
    while (random_val === dices_final_result[0]) {
      random_val = Math.round(Math.random() * 4);
    };

    dices[0].src = `/static/sprites/${dice_sprites_left[random_val]}`;
    let tmp = dice_sprites_left[random_val];
    dice_sprites_left[random_val] = current_sprites[0];
    current_sprites[0] = tmp;

    random_val = Math.round(Math.random() * 4);
    while (random_val === dices_final_result[0]) {
      random_val = Math.round(Math.random() * 4);
    }

    dices[1].src = `/static/sprites/${dice_sprites_right[random_val]}`;
    tmp = dice_sprites_right[random_val];
    dice_sprites_right[random_val] = current_sprites[1];
    current_sprites[1] = tmp;
  }, 200 * 11);

  setTimeout(() => {
    num_to_sprite = {
      1: 'dice-one.png', 2: 'dice-two.png',
      3: 'dice-three.png', 4: 'dice-four.png', 5: 'dice-five.png',
      6: 'dice-six.png'
    };
    dices[0].src = `/static/sprites/${num_to_sprite[dices_final_result[0]]}`
    dices[1].src = `/static/sprites/${num_to_sprite[dices_final_result[1]]}`;
  }, 200 * 12);
};

function link_object(target, object) {// objects V
  if ((object.link_to !== target && object.link_to !== null) || target === null) {
    const idx = object.link_to.linked_objects.indexOf(object);
    object.link_to.linked_objects.splice(idx, 1);
  };
  if (Array.from(grid.children).includes(target)) {
    object.style.gridRow = target.style.gridRow;
    object.style.gridColumn = target.style.gridColumn;
    if ([cards[1], cards[11], cards[0], cards[12]].includes(target)) {
      object.style.marginLeft = object.basic_margin[1] * 2 + 'em';
    } else {
      object.style.marginLeft = object.basic_margin[1] + 'em';
    };
  };
  if (cards.indexOf(target) < 13) {
    object.style.visibility = 'visible';
  } else {
    object.style.visibility = 'hidden';
  };
  if (target !== null && object.link_to !== target) {
    target.linked_objects.push(object);
  };
  object.link_to = target;
};

function init_cars(count) {
  let colors = ['red', 'green', 'blue', 'yellow'];
  let margins = [['3', '1'], ['4.66', '2.1'],
  ['6.33', '1'], ['8', '2.1']];
  let cars = [];
  for (let i = 0; i < count; i++) {
    let car = document.createElement('img');
    car.src = `/static/sprites/${colors[i]}-player.png`;
    car.link_to = null;
    car.basic_margin = margins[i];

    car.style.marginTop = margins[i][0] + 'em';
    car.style.marginLeft = margins[i][1] + 'em';
    car.classList.add('car');

    car_layer.appendChild(car);
    link_object(cards[11], car);
    cars.push(car);
  };
  return cars;
};

function move(target, count, faster = 20) {
  const idx = cards.indexOf(target.link_to);
  link_object(null, target);
  if (idx - count < 1) {
    link_object(cards[0], target);
    target.style.transition = 'none';
    let bonus_duration = 0;
    let bonus_length = 0;
    if (idx === 11) {
      bonus_duration = 0.25;
      bonus_length = 1.65;
    }
    target.style.transform = `translate(${(idx - 1) * 7.8 + bonus_length}em, 9.675em)`;
    target.offsetHeight;
    target.style.transform = 'translate(0, 9.675em)';
    target.style.transition = `linear ${0.5 * (idx - 1) - bonus_duration}s`;
    setTimeout(() => {
      target.style.transform = 'translate(0, 0)';
      target.style.transition = `linear 0.5s`;
      setTimeout(() => {
        for (let i = 10; i > 0; i--) {
          setTimeout(shift_cards, 150 * i);
        };
        setTimeout(() => {
          move(target, count - idx, faster = 0);
        }, 1650);
      }, 450);
    }, (idx - 1) * (500 - faster));


  } else {
    link_object(cards[idx - count], target);
    target.style.transition = 'none';
    target.style.transform = `translate(${count * 7.8}em, 0em)`;
    target.offsetHeight;
    target.style.transform = 'translate(0,0)';
    target.style.transition = `linear ${0.5 * count}s`;
  };
};

dialog_name_inputs.forEach((input, i) => {
  input.addEventListener('input', () => {
    socket.emit('->rename_player', { value: input.value, });
  });
});

socket.emit('new_player');

socket.on('watcher', (data) => {
  document.getElementById('watcher-dialog').style.display = 'flex';
});

socket.on('load_game', (data) => {
  if (!data.round_started) {
    document.getElementById('start-round-dialog').style.display = 'flex';
  } else {
    document.getElementById('start-round-dialog').style.display = 'none';
  };
  document.getElementById('red-d').value = data.players.red.name;
  document.getElementById('blue-d').value = data.players.blue.name;
  document.getElementById('yellow-d').value = data.players.yellow.name;
  document.getElementById('green-d').value = data.players.green.name;
  document.getElementById('red-l').innerHTML = data.players.red.name;
  document.getElementById('green-l').innerHTML = data.players.green.name;
  document.getElementById('blue-l').innerHTML = data.players.blue.name;
  document.getElementById('yellow-l').innerHTML = data.players.yellow.name;
  commands = ['red', 'blue', 'green', 'yellow'];
  for (let i = 0; i < 4; i++) {
    document.getElementById(`${commands[i]}-d`).classList.remove('input-off');
    if (data.command !== commands[i]) {
      document.getElementById(`${commands[i]}-d`).classList.add('input-off');
    };
    if (data.command !== 'red') {
      document.getElementById('start-round-btn').classList.add('btn-off');
    };
  };
  document.querySelector('#next-turn-btn').classList.add('btn-off');
  document.querySelectorAll('input').forEach(el => el.blur());
  if (data.current_turn == data.command && data.command !== null) {
    document.querySelector('.dice-container').style.display = 'inline-block';
    document.querySelectorAll('.dice')[0].classList.remove('btn-off');
    document.querySelectorAll('.dice')[1].classList.remove('btn-off');
  } else {
    document.querySelector('.dice-container').style.display = 'none';
  };
});

socket.on('<-rename_player', (data) => {
  let commands = { 'red': 0, 'green': 1, 'blue': 2, 'yellow': 3 };
  dialog_name_inputs[commands[data.command]].value = data.value;
});

socket.on('run_game', function run(data) {
  init_cars(data);
});

socket.on('<-roll', (data) => {
  throw_dice(data.num);
  commands = { red: 0, green: 1, blue: 2, yellow: 3 }
  setTimeout(move, 3000, document.querySelectorAll('.car')[commands[data.player]], data.num);
  setTimeout(() => {
    document.querySelectorAll('.dice')[0].classList.add('btn-off');
    document.querySelectorAll('.dice')[1].classList.add('btn-off');
    document.querySelector('#next-turn-btn').classList.remove('btn-off');
  }, 3000);
});

/*
let player_cars = init_cars(4);
document.addEventListener('keydown', (event) => { // init
  digits = ['Digit1', 'Digit2', 'Digit3', 'Digit4',
    'Digit5', 'Digit6', 'Digit7', 'Digit8', 'Digit9'];
  if (event.code === 'Space') {
    for (let i = 10; i > 0; i--) {
      setTimeout(shift_cards, 150 * i);
    };
  } else if (digits.includes(event.code)) {
    throw_dice(digits.indexOf(event.code) + 1);
  } else if (event.code === 'KeyW') {
    move(player_cars[2], 40);
  } else {
    console.log(event.code);
  };
});
*/