var allTransactions = [];
var activeFilter = 'all';
var udharData = [];
var currentPage = 'finance';
var currentPersonId = null;
var incomeTypes = ['Salary','Freelance','Investment','Other'];
var expenseTypes = ['Food','Bills','Shopping','Health','Transport','Entertainment','Other'];

/*localStorage helpers*/

function saveToStorage() {
  try {
    localStorage.setItem('financeData', JSON.stringify(allTransactions));
    localStorage.setItem('udharData', JSON.stringify(udharData));
  } catch (e) {
    console.log('Storage failed');
  }
}
/*for reload*/
function loadFromStorage() {
  try {
    var stored = localStorage.getItem('financeData');
    if (stored) {
      allTransactions = JSON.parse(stored);
    }
    var udharStored = localStorage.getItem('udharData');
    if (udharStored) {
      udharData = JSON.parse(udharStored);
    }
  } catch (e) {
    allTransactions = [];
    udharData = [];
  }
}

/*Page Badalna :) */
function switchPage(page) {
  currentPage = page;
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
     document.querySelectorAll('.navBtn').forEach(b => b.classList.remove('active'));
  if (page === 'finance') {
          document.getElementById('financePage').classList.add('active');
        document.querySelectorAll('.navBtn')[0].classList.add('active');
} else {
    document.getElementById('udharPage').classList.add('active');
    document.querySelectorAll('.navBtn')[1].classList.add('active');
    renderUdharCards();

  }
}


/* ---- Finance Functions ---- */
function categoryMagicThingy() {

  alignmentType.onchange = function() {
    battleClass.innerHTML = '<option value="">Category</option>';
        var list = alignmentType.value === 'income' ? incomeTypes : expenseTypes;
    list.forEach(x => {
      var o = document.createElement('option');
    o.textContent = o.value = x;
     battleClass.appendChild(o);
    });

  };
}


function showError(elementId, message) {
  var el = document.getElementById(elementId);
  el.textContent = message;
  el.style.display = 'block';
  setTimeout(() => {
    el.style.display = 'none';
  }, 3000);
}

function formGoBrrr() {
  shieldForm.onsubmit = function(e) {
     e.preventDefault();
      var amt = parseFloat(powerLevel.value);
    var desc = missionBrief.value.trim();

    // Validation

    if (!desc) {
        showError('formError', 'Description cannot be empty');
      return;

    }

    if (isNaN(amt) || amt <= 0) {
         showError('formError', 'Amount must be greater than 0');
      return;

    }

    var entry = {
               id: Date.now(),
      description: desc,

      amount: amt,
       type: alignmentType.value,


      category: battleClass.value,
           date: new Date().toLocaleDateString()

    };

    allTransactions.push(entry);


    saveToStorage();
    shieldForm.reset();

    rerenderEverythingAgain();
  };


}

function totalMoneyThingy() {

  var bheemPower = 0;
  var villainDamage = 0;


  allTransactions.forEach(t => {

    if (t.type === 'income') {
      bheemPower += t.amount;


    } else {
      villainDamage += t.amount;

    }
  });


  return {
    bheemPower: bheemPower,
    villainDamage: villainDamage,
    arjunDecision: bheemPower - villainDamage

  };
}

function updateTheBigNumbers() {
  var m = totalMoneyThingy();
  chottaBheem.innerHTML = '₹' + m.bheemPower.toFixed(2);
  ultronExpense.innerHTML = '₹' + m.villainDamage.toFixed(2);
  arjun.innerHTML = '₹' + m.arjunDecision.toFixed(2);
}

function dumpMoneyStuffOnScreen() {
     warArchive.innerHTML = '';
  var listToShow = allTransactions;
  if (activeFilter !== 'all') {
    listToShow = allTransactions.filter(t => t.type === activeFilter);

  }

  if (listToShow.length === 0) {


    warArchive.innerHTML = '<div class="emptyState">No transactions yet</div>';
    return;

  }

  for (var i = listToShow.length - 1; i >= 0; i--) {


    var t = listToShow[i];
    var div = document.createElement('div');

    div.className = 'combatEntry';
    div.innerHTML = `


      <div>
        <div style="font-weight: 600;">${t.description}</div>
        <small style="color: #6b7280;">${t.category} • ${t.date}</small>
      </div>
      <div class="damageReport ${t.type}">₹${t.amount.toFixed(2)}</div>
      <button class="snapButton" onclick="yeetTransactionOut(${t.id})">Delete</button>

    `;
    warArchive.appendChild(div);


  }
}

function expenseBarVibes() {


  powerDistribution.innerHTML = '';
  var map = {};

  allTransactions.filter(t => t.type === 'expense')
    .forEach(t => {
      if (!map[t.category]) map[t.category] = 0;

      map[t.category] += t.amount;
    });
  var total = 0;
  for (var k in map) total += map[k];
  if (total === 0) {
    powerDistribution.innerHTML = '<div class="emptyState">No expenses yet</div>';
    return;

  }

  for (var c in map) {
    var p = ((map[c] / total) * 100).toFixed(1);
    var div = document.createElement('div');
    div.innerHTML = `
      <div style="margin-bottom: 5px; font-weight: 600;">${c} - ₹${map[c].toFixed(2)}</div>
      <div class="energyBar">
        <div class="energyFill" style="width:${p}%">${p}%</div>

      </div>
    `;
    powerDistribution.appendChild(div);
  }

}

function rerenderEverythingAgain() {
  updateTheBigNumbers();
  dumpMoneyStuffOnScreen();

  expenseBarVibes();
}


function yeetTransactionOut(id) {
  if (confirm('Are you sure you want to delete this transaction?')) {

    allTransactions = allTransactions.filter(t => t.id !== id);
    saveToStorage();


    rerenderEverythingAgain();
  }

}

/*  Udhari */


function openAddPersonModal() {
  document.getElementById('addPersonModal').classList.add('active');

  document.getElementById('personName').value = '';
}


function closeAddPersonModal() {
  document.getElementById('addPersonModal').classList.remove('active');

}

function addPerson() {


  var name = document.getElementById('personName').value.trim();
  

  if (!name) {


    showError('personError', 'Name cannot be empty');
    return;

  }

  if (udharData.some(p => p.name.toLowerCase() === name.toLowerCase())) {


    showError('personError', 'Person already exists');
    return;

  }

  var person = {


    id: Date.now(),
    name: name,

    balance: 0,
    transactions: []


  };

  udharData.push(person);

  saveToStorage();
  closeAddPersonModal();


  renderUdharCards();
}

function openTransactionModal(personId) {


  currentPersonId = personId;
  var person = udharData.find(p => p.id === personId);

  document.getElementById('transactionModalTitle').textContent = `Add Transaction - ${person.name}`;
  document.getElementById('addTransactionModal').classList.add('active');


  document.getElementById('transactionDesc').value = '';
  document.getElementById('transactionAmount').value = '';

}

function closeTransactionModal() {


  document.getElementById('addTransactionModal').classList.remove('active');
  currentPersonId = null;

}

function addTransaction() {


  var desc = document.getElementById('transactionDesc').value.trim();
  var amt = parseFloat(document.getElementById('transactionAmount').value);

  if (!desc) {


    showError('transactionError', 'Description cannot be empty');
    return;

  }

  if (isNaN(amt) || amt === 0) {


    showError('transactionError', 'Amount cannot be 0');
    return;

  }

  var person = udharData.find(p => p.id === currentPersonId);


  if (!person) return;

  var transaction = {


    id: Date.now(),
    description: desc,

    amount: amt,
    date: new Date().toLocaleDateString()


  };

  person.transactions.push(transaction);

  person.balance += amt;
  

  saveToStorage();


  closeTransactionModal();
  renderUdharCards();

}

function deletePerson(personId) {


  if (confirm('Are you sure you want to delete this person and all their transactions?')) {
    udharData = udharData.filter(p => p.id !== personId);

    saveToStorage();
    renderUdharCards();


  }
}

function renderUdharCards() {


  var container = document.getElementById('udharCards');
  container.innerHTML = '';

  if (udharData.length === 0) {


    container.innerHTML = '<div class="emptyState">No people added yet. Click "Add Person" to start tracking.</div>';
    return;

  }

  udharData.forEach(person => {


    var card = document.createElement('div');
    card.className = 'udharCard';

    
    var balanceClass = person.balance > 0 ? 'positive' : person.balance < 0 ? 'negative' : '';


    var balanceText = person.balance > 0 
      ? `They owe you ₹${person.balance.toFixed(2)}` 

      : person.balance < 0 
      ? `You owe them ₹${Math.abs(person.balance).toFixed(2)}`


      : 'Settled';

    var historyHtml = '';

    if (person.transactions.length > 0) {


      historyHtml = '<div class="udharHistory">';
      person.transactions.slice(-5).reverse().forEach(t => {

        var sign = t.amount > 0 ? '+' : '';
        historyHtml += `


          <div class="udharHistoryItem">
            <span>${t.description}</span>

            <span style="color: ${t.amount > 0 ? '#22c55e' : '#ef4444'}; font-weight: 600;">
              ${sign}₹${t.amount.toFixed(2)}


            </span>
          </div>

        `;
      });


      historyHtml += '</div>';
    }

    card.innerHTML = `


      <h3>${person.name}</h3>
      <div class="udharAmount ${balanceClass}">${balanceText}</div>

      ${historyHtml}
      <div class="udharActions">


        <button onclick="openTransactionModal(${person.id})">Add Money</button>
        <button class="snapButton" onclick="deletePerson(${person.id})">Delete</button>

      </div>
    `;


    
    container.appendChild(card);
  });

}

/* ---- Initialize ---- */


window.onload = function() {
  loadFromStorage();

  categoryMagicThingy();
  formGoBrrr();

  rerenderEverythingAgain();
};
