"use strict";
import { showTotalSavingsBalance } from "./userSavings.js";
import { showAllUserTransferCards } from "./userTransfer.js";
const uniqid = new ShortUniqueId();
import { User } from "./creatUser.js";
//New user from registered user
let logedIn = JSON.parse(localStorage.getItem("logedIn"));

// let logedIn = "peterJ@gmail.com"; //for development use
//Function
function getUser() {
  let { fName, lName, bDay, email, password, cards, transactions, location } =
    JSON.parse(localStorage.getItem("peterJ@gmail.com"));
  const curUser = new User(
    fName,
    lName,
    bDay,
    email,
    password,
    cards,
    transactions,
    location
  );
  return curUser;
}
//Select main elements

const allTransBlocksWrapper = document.querySelector(
  ".transactions-info--wrapper"
);
const timerBlock = document.querySelector(".timer");
const contentSpace = document.querySelector(".content-space");
const allContentFillers = document.querySelectorAll(".content-filler");
const cardsZone = document.querySelector(".user-cards__zone");
const userCardsBlock = document.querySelector(".user-cards-info");
let timer;

//Init page

if (timer) clearInterval(timer);
countDownTimerFunc();

//Highlight main page
const home = document.getElementById("menu-home");
home.classList.add("menu-highlighted");
home.parentElement.classList.add("highlighted");

//Mobile version
const allMenuM = Array.from(document.getElementsByClassName("m-menu"));
const allMenu = Array.from(document.getElementsByClassName("user-menu--li"));
const documentBody = document.querySelector("body");
const checkboxEl = document.querySelector(".checkbox-menu");

document.addEventListener("click", function (e) {
  if (e.target.classList.contains("m-menu")) {
    allMenuM.forEach((m) => {
      if (
        m.classList.contains("menu-highlighted") &&
        m.parentElement.classList.contains("highlighted")
      ) {
        m.classList.toggle("menu-highlighted");
        m.parentElement.classList.toggle("highlighted");
      }
      e.target.parentElement.classList.add("highlighted");
      e.target.classList.add("menu-highlighted");
    });
    showContent(allMenuM);
    checkboxEl.checked = false;
  }
});

//Highlighted menu
checkboxEl.addEventListener("change", function () {
  if (this.checked) {
    documentBody.classList.add("overflow-hidden");
  } else documentBody.classList.remove("overflow-hidden");
});

document.addEventListener("click", function (e) {
  if (e.target.classList.contains("user-menu--li")) {
    allMenu.forEach((m) => {
      if (
        m.classList.contains("menu-highlighted") &&
        m.parentElement.classList.contains("highlighted")
      ) {
        m.classList.toggle("menu-highlighted");
        m.parentElement.classList.toggle("highlighted");
      }
      e.target.parentElement.classList.add("highlighted");
      e.target.classList.add("menu-highlighted");
    });
    showContent(allMenu);
  }
});

showContent(allMenu);

//Show html depends on current menu selection

function showContent(menu) {
  menu.forEach((m) => {
    if (m.classList.contains("menu-highlighted")) {
      const curId = m.id.split("-")[1];
      const curMenu = "#" + curId;
      const curContentFiller = document.querySelector(curMenu);
      allContentFillers.forEach((content) => {
        if (!content.classList.contains("hidden")) {
          content.classList.add("hidden");
        } else return;
      });
      curContentFiller.classList.remove("hidden");
      if (curId === "home") {
        revealHome();
      }
      if (curId === "savings") {
      }
      if (curId === "transfer") {
        showAllUserTransferCards();
      }
    } else return;
  });
}

//Reveal main content functions

function revealHome() {
  updateCardsContainer(getUser());
}

//Header greeting
const userFname = document.querySelector(".user-f--name");
window.addEventListener("DOMContentLoaded", function () {
  userFname.textContent = `${getUser().fName}`;
});

//Show Balance
export function showBalance(transactions) {
  return transactions.reduce((total, cur) => {
    if (cur.type === "withdrawal") {
      return (total -= Number(cur.amount));
    } else return (total += Number(cur.amount));
  }, 0);
}

//Reveal cards
function revealCards() {
  const curUser = getUser();
  userCardsBlock.innerHTML = "";
  //Show balance of every card
  curUser.cards.forEach((card) => {
    const curId = card.id;
    const curCardTrans = curUser.transactions.filter((t) => t.cardID === curId);

    const balance = showBalance(curCardTrans);
    const cardHtml = `
    <div class="total-card__info">
      <div class="user-card" id=${card.id}>
        <div class="card-wrapper">
          <img class="user-card__img" src="../img/${card.plan.toUpperCase()}.png" />
        </div>
        <div class="card-info__block">
          <p class="card-number">#${card.id} card</p>
          <p class="card-plan">${card.plan.toUpperCase()} plan</p>
          <p class="expiry-date">expired by ${card.expired}</p>
          <p class="transactions-init">Show transactions↓</p>
        </div>
        <div class="balance-info__block">
          <h3>Balance: </h3>
          <p class="balance">${balance + " " + card.currency}</p>
        </div>
      </div>
    </div>`;
    userCardsBlock.insertAdjacentHTML("beforeend", cardHtml);
  });
}

//Sort transactions
const sortTransactions = function (curCard) {
  return getUser().transactions.filter(function (transaction) {
    return transaction.cardID === curCard;
  });
};

//Create radio buttons
function createRadioBtns(id) {
  return `<div class="sorted-btns">
  <label class="sorted-btn">
        <input id="all" name="trans_${id}" value="all" class="radio" type="radio" checked/>
        <span class="checkmark"></span>
        All transactions
      </label>
      <label class="sorted-btn">
        <input id="withdrawal" name="trans_${id}" value="withdrawals" class="radio" type="radio" />
        <span class="checkmark"></span>
        Withdrawals
      </label>
      <label class="sorted-btn">
        <input class="radio" id="deposit" name="trans_${id}" value="deposits" type="radio"/>
        <span class="checkmark"></span>
        Deposits
      </label>
      </div>`;
}
//Reveal card transactions block
function revealTransactions(transactions, curTarget, curCard) {
  const cardTransactionsContainer = curTarget.closest(".total-card__info");

  if (sortTransactions(curCard.id).length === 0) {
    const noTransBlock = `<div class="no-transactions__block transaction-secret">
        <p class="no-transactions__p"> No transactions found</p>
      </div>`;
    cardTransactionsContainer.insertAdjacentHTML("beforeend", noTransBlock);
  } else {
    const transastions = `<div class="sorting-box transaction-secret">
    <div class="transactions">
    </div>
    </div>`;
    cardTransactionsContainer.insertAdjacentHTML("beforeEnd", transastions);
    const cardTransactionsBlock =
      cardTransactionsContainer.querySelector(".transactions");
    transactions.forEach((t) => {
      const htmlString = `<div class="transaction ${t.type}">
            <span class="transaction-group">
              <img class="oper-group__img" src="../img/${t.group}.png" />
            </span>
            <div class="transaction-name--date__block">
              <span class="transaction--name">${t.group.toUpperCase()}</span>
              <span class="transaction--date">${t.date}</span>
            </div>
            <div class="transaction-amount">
              <span class="transaction-currency">${t.currency}</span>
              <span class="transaction--amount">${t.amount}</span>
            </div>
          </div>`;
      cardTransactionsBlock.insertAdjacentHTML("beforeend", htmlString);
    });
  }
}

// Show/close transactions block
const openTransactions = document.addEventListener("click", function (e) {
  const curTarget = e.target;
  const curCard = curTarget.closest(".user-card");
  if (curTarget.classList.contains("transactions-init")) {
    //Toggle open class to define that transactions info is open
    curCard.classList.toggle("open");
    const closeTransactions = curTarget.closest(".transactions-init");
    if (curCard.classList.contains("open")) {
      //Change text to close transactions
      closeTransactions.textContent = "Close transactions information ↑";

      //Add transactions info
      revealTransactions(sortTransactions(curCard.id), curTarget, curCard);
      const curCardID = curCard.id;
      const cardTransactionsContainer = curTarget.closest(".total-card__info");
      const transContainer =
        cardTransactionsContainer.querySelector(".sorting-box");
      if (transContainer) {
        const btns = createRadioBtns(curCard.id);
        transContainer.insertAdjacentHTML("afterbegin", btns);
        const radioBtns = document.getElementsByName(`trans_${curCard.id}`);
        radioBtns.forEach((btn) =>
          btn.addEventListener("change", function () {
            sortingTrans(curTarget, curCard, btn);
          })
        );
      }
    } else {
      //Close block
      closeTransactions.textContent = "Show transactions↓";
      // deletePrevInfo(curTarget, curCard);
      radioBtnsDelete(curTarget, curTarget);
    }
  }
});

//Delete radio btns
function radioBtnsDelete(curTarget, curCard) {
  const [transactionsBlock, transastions, mainBlock, radioBtnsContainer] =
    mainPrevDelete(curTarget, curCard);
  transactionsBlock.removeChild(mainBlock);
}

//Delete prev transactions info

function prevTransDelete(curTarget, curCard) {
  const [transactionsBlock, transactions, _, radioBtnsContainer] =
    mainPrevDelete(curTarget, curCard);
  if (sortTransactions(curCard.id).length === 0) {
    const noTransactions = document.querySelector(".no-transactions__block");
    transactionsBlock.removeChild(noTransactions);
  } else {
    transactions.innerHTML = "";
  }
}
//Main prev trans block
function mainPrevDelete(curTarget, curCard) {
  const transactionsBlock = curTarget.closest(".total-card__info");
  const transactions = transactionsBlock.querySelector(".transactions");
  const mainBlock = transactionsBlock.querySelector(".transaction-secret");
  const radioBtnsContainer = curTarget.closest(".sorted-btns");
  return [transactionsBlock, transactions, mainBlock, radioBtnsContainer];
}

//Sorting functions
function sortingTrans(curTarget, curCard, btn) {
  if (btn.checked === true) {
    const type = btn.id;
    //DeletePrevInfo(curTarget, curCard);
    prevTransDelete(curTarget, curCard);
    showSortedOperations(curTarget, curCard, type);
  }
}

//Show sorted operations
const showSortedOperations = function (curTarget, curCard, type) {
  // const transactions = curUser.transactions.filter(function (t) {
  //   return t.cardID === curCard.id && t.type === type;
  // });
  let transactions = sortTransactions(curCard.id);
  if (type !== "all") {
    transactions = transactions.filter((t) => t.type === type);
  }
  revealTransactions(transactions, curTarget, curCard);
};

//Create new card

const getCardInit = document.querySelector(".get-new--card__wrapper");
const newCardCancel = document.querySelector(".cancel-card--creation");
const newCardForm = document.querySelector(".card-register-form");
const creationBlock = document.querySelector(".creation");
const choosePlan = document.querySelector(".card-register-form");
const waitingBlock = document.querySelector(".waiting-block");
const unsuccesfulCardPending = document.querySelector(
  ".unsuccesful-card--pending"
);
const closeMsgBtn = document.querySelector(".close-unsuccesful--msg");

getCardInit.addEventListener("click", function () {
  getCardInit.classList.add("hidden");
  choosePlan.classList.remove("hidden");
});

//Cancel new card creation
newCardCancel.addEventListener("click", function (e) {
  e.stopPropagation();
  getCardInit.classList.remove("hidden");
  choosePlan.classList.add("hidden");
});

//Get a card
newCardForm.addEventListener("submit", function (e) {
  e.preventDefault();
  newCardForm.classList.add("hidden");
  waitingBlock.classList.remove("hidden");
  setTimeout(checkCardDate, "4000");
});

//Check latest card date
function checkCardDate() {
  const curUser = getUser();
  const allCardsResult = [];
  const comparationDate = 30;
  const today = new Date().getTime();
  curUser.cards.forEach((c) => {
    const splitExpirationDate = c.expired.split("-");
    const creationDate = new Date(
      Number(splitExpirationDate[2]) - 4,
      Number(splitExpirationDate[1]) - 1,
      splitExpirationDate[0]
    );
    const comparedStamp = creationDate.getTime();
    const timeSinceLastCardCreation =
      (Number(today) - Number(comparedStamp)) / (60 * 60 * 24 * 1000);
    if (timeSinceLastCardCreation < comparationDate) {
      allCardsResult.push("false");
    } else return;
  });
  newCardForm.classList.add("hidden");
  if (allCardsResult.length === 0) {
    getCardInit.classList.remove("hidden");
    waitingBlock.classList.add("hidden");
    const plan = document.querySelector(".new-plan").value;
    const currency = document.querySelector(".new-currency").value;
    curUser.createNewCard(plan.toUpperCase(), null, null, currency);
    localStorage.setItem(curUser.email, JSON.stringify(curUser));
    updateCardsContainer(curUser);
    return true;
  } else {
    waitingBlock.classList.add("hidden");
    unsuccesfulCardPending.classList.remove("hidden");
    return false;
  }
}

//Close unsuccsesful message
closeMsgBtn.addEventListener("click", function () {
  unsuccesfulCardPending.classList.add("hidden");
  getCardInit.classList.remove("hidden");
});

//Update cards containers
function updateCardsContainer() {
  const allCards = document.querySelectorAll(".total-card__info");
  allCards.forEach((c) => c.remove());
  revealCards();
}
updateCardsContainer();

// Sort savings
const sortSavings = function () {
  return getUser().transactions.filter(function (transaction) {
    return transaction.group === "savings";
  });
};

//Create savings in user interface
const categoriesSavingsBlock = document.querySelector(".categories-block");

//Show savings
const savingsBlock = document.querySelector(".savings-block");
function showSavings() {
  const savingsTypes = new Set();
  sortSavings().forEach((saving) => {
    const type = saving.savingType;
    savingsTypes.add(type);
  });
  createSavingsType(savingsTypes);
}

// Currency info-box
const currInfoBox = document.querySelector("currency-info--box");
const allCurr = document.querySelector(".all-rates");
const exchangeRates = [];
function getCurrHTML(currName, num) {
  const html = `<div id="${currName}-curr" class="curr-rate">
          <div class="curr-exchange--name">
            <span>${currName}</span>
          </div>
          <div class="curr-exchange--info">
            <div class="curr-exchange--to">
              <span>${Object.keys(exchangeRates[num].rates)[0]}</span>
            </div>
            <div class="rate-box">
              <div class="rate-amount">
                <h5>Official rate</h5>
                <h5>${
                  exchangeRates[num].rates[
                    Object.keys(exchangeRates[num].rates)[0]
                  ].officialRate
                }</h5>
              </div>
              <div class="rate-amount">
                <h5>Buy</h5>
                <h5>${
                  exchangeRates[num].rates[
                    Object.keys(exchangeRates[num].rates)[0]
                  ].buy
                }</h5>
              </div>
              <div class="rate-amount">
                <h5>Sell</h5>
                <h5>${
                  exchangeRates[num].rates[
                    Object.keys(exchangeRates[num].rates)[0]
                  ].sell
                }</h5>
              </div>
            </div>
          </div>
          <div class="curr-exchange--info">
            <div class="curr-exchange--to">
              <span>${Object.keys(exchangeRates[num].rates)[1]}</span>
            </div>
            <div class="rate-box">
              <div class="rate-amount">
                <h5>Official rate</h5>
                <h5>${
                  exchangeRates[num].rates[
                    Object.keys(exchangeRates[num].rates)[1]
                  ].officialRate
                }</h5>
              </div>
              <div class="rate-amount">
                <h5>Buy</h5>
                <h5>${
                  exchangeRates[num].rates[
                    Object.keys(exchangeRates[num].rates)[1]
                  ].buy
                }</h5>
              </div>
              <div class="rate-amount">
                <h5>Sell</h5>
                <h5>${
                  exchangeRates[num].rates[
                    Object.keys(exchangeRates[num].rates)[1]
                  ].sell
                }</h5>
              </div>
            </div>
          </div>
        </div>`;
  allCurr.insertAdjacentHTML("afterbegin", html);
}
async function getCurrencyRate(currName, num) {
  let response = await fetch(`https://open.er-api.com/v6/latest/${currName}`);
  if (response.ok) {
    let rate = await response.json();
    if (currName === "USD")
      exchangeRates.push({
        fromCurrency: currName,
        rates: {
          EUR: {
            officialRate: rate.rates.EUR.toFixed(2),
            buy: (rate.rates.EUR * 0.95).toFixed(2),
            sell: (rate.rates.EUR * 1.05).toFixed(2),
          },
          GBP: {
            officialRate: rate.rates.GBP.toFixed(2),
            buy: (rate.rates.GBP * 0.95).toFixed(2),
            sell: (rate.rates.GBP * 0.95).toFixed(2),
          },
        },
      });
    if (currName === "EUR")
      exchangeRates.push({
        fromCurrency: currName,
        rates: {
          USD: {
            officialRate: rate.rates.USD.toFixed(2),
            buy: (rate.rates.USD * 0.95).toFixed(2),
            sell: (rate.rates.USD * 1.05).toFixed(2),
          },
          GBP: {
            officialRate: rate.rates.GBP.toFixed(2),
            buy: (rate.rates.GBP * 0.95).toFixed(2),
            sell: (rate.rates.GBP * 0.95).toFixed(2),
          },
        },
      });
    if (currName === "GBP")
      exchangeRates.push({
        fromCurrency: currName,
        rates: {
          EUR: {
            officialRate: rate.rates.EUR.toFixed(2),
            buy: (rate.rates.EUR * 0.95).toFixed(2),
            sell: (rate.rates.EUR * 1.05).toFixed(2),
          },
          USD: {
            officialRate: rate.rates.USD.toFixed(2),
            buy: (rate.rates.USD * 0.95).toFixed(2),
            sell: (rate.rates.USD * 0.95).toFixed(2),
          },
        },
      });
    getCurrHTML(currName, num);
    if (localStorage.getItem("exchangeRates") !== undefined) {
      localStorage.removeItem("exchangeRates");
      localStorage.setItem("exchangeRates", exchangeRates);
    }
  }
  if (!response.ok) {
    currInfoBox.classList.add("hidden");
  }
}

getCurrencyRate("USD", 0);
getCurrencyRate("EUR", 1);
getCurrencyRate("GBP", 2);
// if (operation.type ==="withdrawal"){
//   currRate=curr.sell
// } else currRate=curr.buy

// Date-time box
const userNavigationBox = document.querySelector(".user-date--time__box");
let lat, lng;

function showLocation() {
  const curUser = getUser();
  if (curUser.location.length > 0) {
    userNavigationBox.textContent =
      userNavigationBox.textContent = `You are in ${curUser.location[0]}, ${curUser.location[1]}`;
  } else {
    // Get user coords
    navigator.geolocation.getCurrentPosition(function (position) {
      lat = position.coords.latitude;
      lng = position.coords.longitude;
      const userPosition = fetch(
        `http://api.geonames.org/findNearbyPlaceNameJSON?lat=${lat}&lng=${lng}&username=fecony`
      )
        .then(function (response) {
          return response.json();
        })
        .then(function (response) {
          const userCity = response.geonames[0].adminName1;
          const userCountry = response.geonames[0].countryName;
          curUser.location = [userCity, userCountry];
          localStorage.setItem(curUser.email, JSON.stringify(curUser));
          userNavigationBox.textContent = `You are in ${curUser.location[0]}, ${curUser.location[1]}`;
        });
    });
  }
}
showLocation();
// Get position from API

//Log out function
const logOutBtn = document.querySelector(".log-out--btn");
logOutBtn.addEventListener("click", logOut);
function logOut() {
  window.location.href = "./log-in.html";
  localStorage.removeItem("logedIn");
}

// Log out timer

function countDownTimerFunc() {
  function timeCounting() {
    const min = String(Math.trunc(`${time / 60}`)).padStart(2, 0);
    const sec = String(`${time % 60}`).padStart(2, 0);
    timerBlock.textContent = `${min}:${sec}`;
    if (time === 0) {
      clearInterval(timer);
      logOut();
    }
    time--;
  }
  let time = 180;
  timeCounting();
  timer = setInterval(timeCounting, 1000);
  return timer;
}
document.addEventListener("click", function () {
  if (timer) clearInterval(timer);
  countDownTimerFunc();
});
