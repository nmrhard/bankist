'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,
  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');


const displayMovements = function(acc, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort ? acc.movements.slice().sort((a, b) => {
    return a - b;
  }) : acc.movements;

  movs.forEach(function(mov, i) {
  const type = mov > 0 ? 'deposit' : 'withdrawal';

  const date = new Date(acc.movementsDates[i]);
  const year = date.getFullYear();
  const month =`${date.getMonth() + 1}`.padStart(2, 0);
  const day = `${date.getDate()}`.padStart(2, 0);

  const displayDate = `${day}/${month}/${year}`;

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
        <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${mov.toFixed(2)}€</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function(acc) {
  acc.balance = acc.movements.reduce((acc, mov) => {
    return acc + mov;
  }, 0)
  labelBalance.textContent = `${acc.balance.toFixed(2)} €`;
}

const calcDisplaySummary = function(acc) {
  const incomes = acc.movements
    .filter((mov) => { return mov > 0; })
    .reduce((acc, mov) => { return acc + mov; });
    labelSumIn.textContent = `${incomes.toFixed(2)}€`;

  const out = acc.movements
    .filter((mov) => { return mov < 0; })
    .reduce((acc, mov) => { return acc + mov; });
    labelSumOut.textContent = `${Math.abs(out).toFixed(2)}€`;

  const interest = acc.movements
    .filter((mov) => { return mov > 0; })
    .map((deposit) => { return deposit * acc.interestRate / 100; })
    .filter((int) => { return int >= 1; })
    .reduce((acc, int) => { return acc + int; });
  labelSumInterest.textContent = `${interest.toFixed(2)}€`;
}

const createUsernames = function(accs) {
  accs.forEach(acc => {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => { return  name[0]})
      .join('');
  })
}
createUsernames(accounts);

const updateUI = function(acc) {
  displayMovements(acc);
  calcDisplayBalance(acc);
  calcDisplaySummary(acc);
}

let currentAccount;

btnLogin.addEventListener('click', function(evt) {
  evt.preventDefault();

  currentAccount = accounts.find((acc) => {
    return acc.username === inputLoginUsername.value;
  })

  if(currentAccount?.pin === Number(inputLoginPin.value)) {
    labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(' ')[0]}`;
    containerApp.style.opacity = 100;

    const now = new Date();
    const year = now.getFullYear();
    const month =`${now.getMonth() + 1}`.padStart(2, 0);
    const date = `${now.getDate()}`.padStart(2, 0);
    const hours = `${now.getHours()}`.padStart(2, 0);
    const min = `${now.getMinutes()}`.padStart(2, 0);
    labelDate.textContent = `${date}/${month}/${year}, ${hours}:${min}`;

    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function(evt) {
  evt.preventDefault();

  const amount = Number(inputTransferAmount.value);
  const reciverAcc = accounts.find((acc) => {
    return acc.username === inputTransferTo.value;
  });

  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    reciverAcc &&
    amount <= currentAccount.balance &&
    reciverAcc.username !== currentAccount.username
  ) {
    
    currentAccount.movements.push(-amount);
    reciverAcc.movements.push(amount);

    currentAccount.movementsDates.push(new Date().toISOString());
    reciverAcc.movementsDates.push(new Date().toISOString());

    updateUI(currentAccount);
  }
})

btnClose.addEventListener('click', function(evt) {
  evt.preventDefault();
  
  if (currentAccount.username === inputCloseUsername.value 
    && currentAccount.pin === Number(inputClosePin.value)) {
    const index = accounts.findIndex(acc => {
      return acc.username === currentAccount.username;
    });

    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';
})

btnLoan.addEventListener('click', function(evt) {
  evt.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => {
    return mov >= amount * 0.1;
  })) {
    currentAccount.movements.push(amount);
    currentAccount.movementsDates.push(new Date().toISOString());
    updateUI(currentAccount);
  }

  inputLoanAmount.value = '';
})

let isSort = false;
btnSort.addEventListener('click', function(evt) {
  evt.preventDefault();

  isSort = !isSort;
  displayMovements(currentAccount, isSort);
})