"use strict";

require("core-js/modules/es.symbol");

require("core-js/modules/es.symbol.description");

require("core-js/modules/es.array.concat");

require("core-js/modules/es.array.for-each");

require("core-js/modules/es.array.from");

require("core-js/modules/es.array.index-of");

require("core-js/modules/es.array.map");

require("core-js/modules/es.array.reduce");

require("core-js/modules/es.array.splice");

require("core-js/modules/es.date.to-string");

require("core-js/modules/es.number.to-fixed");

require("core-js/modules/es.parse-float");

require("core-js/modules/es.parse-int");

require("core-js/modules/es.regexp.exec");

require("core-js/modules/es.string.iterator");

require("core-js/modules/es.string.split");

require("core-js/modules/web.dom-collections.for-each");

//////////////////////////////////////
// Budget Controller
var budgetController = function () {
  var Expense = function Expense(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
    this.percentage = -1;
  };

  Expense.prototype.calcPercentage = function (totalIncome) {
    if (totalIncome > 0) {
      this.percentage = Math.round(this.value / totalIncome * 100);
    } else {
      this.percentage = -1;
    }

    ;
  };

  Expense.prototype.getPercentage = function () {
    return this.percentage;
  };

  var Income = function Income(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  var data = {
    allItems: {
      inc: [],
      exp: []
    },
    totals: {
      inc: 0,
      exp: 0
    },
    budget: 0,
    percentage: -1
  };

  var calculateTotal = function calculateTotal(type) {
    var sum = data.allItems[type].reduce(function (prev, cur) {
      return prev + cur.value;
    }, 0);
    data.totals[type] = sum;
  };

  return {
    addItem: function addItem(type, des, val) {
      var newItem, ID; // Create new ID 
      // ID = last ID + 1

      data.allItems[type].length > 0 ? ID = data.allItems[type][data.allItems[type].length - 1].id + 1 : ID = 0; // Create new item based on 'inc' or 'exp' type

      if (type === 'inc') {
        newItem = new Income(ID, des, val);
      } else if (type === 'exp') {
        newItem = new Expense(ID, des, val);
      }

      ; // Push it into data structure

      data.allItems[type].push(newItem); // Return new item

      return newItem;
    },
    deleteItem: function deleteItem(type, id) {
      var ids = data.allItems[type].map(function (cur) {
        return cur.id;
      });
      var index = ids.indexOf(id);
      if (index !== -1) data.allItems[type].splice(index, 1);
    },
    CalculateBudget: function CalculateBudget() {
      // Calculate total income and expenses
      calculateTotal('inc');
      calculateTotal('exp'); // Calculate the budget - Income - Expenses

      data.budget = data.totals.inc - data.totals.exp; // Calculate the percentage of expenses that we spent

      if (data.totals.inc > 0) {
        data.percentage = Math.round(data.totals.exp / data.totals.inc * 100);
      } else {
        data.percentage = -1;
      }

      ;
    },
    calculatePercentages: function calculatePercentages() {
      data.allItems.exp.forEach(function (cur) {
        return cur.calcPercentage(data.totals.inc);
      });
    },
    getPercentages: function getPercentages() {
      var allPercentage = data.allItems.exp.map(function (cur) {
        return cur.getPercentage();
      });
      return allPercentage;
    },
    getBudget: function getBudget() {
      return {
        budget: data.budget,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp,
        percentage: data.percentage
      };
    },
    testing: function testing() {
      console.log(data);
    }
  };
}(); //////////////////////////////////////
// UI Controller


var UIController = function () {
  var DOMStrings = {
    inputType: ".add__type",
    inputDescription: ".add__description",
    inputValue: ".add__value",
    inputBtn: ".add__btn",
    incomeContainer: ".income__list",
    expenseContainer: ".expenses__list",
    budgetLabel: ".budget__value",
    incomeLable: ".budget__income--value",
    expenseLabel: ".budget__expenses--value",
    percentLabel: ".budget__expenses--percentage",
    container: ".container",
    expensesPercLabel: ".item__percentage",
    dateLabel: ".budget__title--month"
  };

  var formatNum = function formatNum(num, type) {
    var numSplit, _int, dec;
    /*
        + or - before number
        2 decimal points
        comma separating the thousands
        
        2310.4567 -> 2,310.45
        2000 -> 2,000.00
    */


    num = Math.abs(num);
    num = num.toFixed(2);
    numSplit = num.split('.');
    _int = numSplit[0];
    dec = numSplit[1];
    if (_int.length > 3) _int = _int.substr(0, _int.length - 3) + ',' + _int.substr(_int.length - 3, _int.length);
    return (type === 'exp' ? '-' : '+') + ' ' + _int + '.' + dec;
  };

  return {
    getInput: function getInput() {
      return {
        type: document.querySelector(DOMStrings.inputType).value,
        // inc or exp
        description: document.querySelector(DOMStrings.inputDescription).value,
        value: parseFloat(document.querySelector(DOMStrings.inputValue).value)
      };
    },
    addListItem: function addListItem(obj, type) {
      var html, element; // Create HTML string with placeholder

      if (type === 'inc') {
        element = DOMStrings.incomeContainer;
        html = "\n                <div class=\"item clearfix\" id=\"inc-".concat(obj.id, "\">\n                    <div class=\"item__description\">").concat(obj.description, "</div>\n                    <div class=\"right clearfix\">\n                        <div class=\"item__value\">").concat(formatNum(obj.value, type), "</div>\n                        <div class=\"item__delete\">\n                            <button class=\"item__delete--btn\"><i class=\"ion-ios-close-outline\"></i></button>\n                        </div>\n                    </div>\n                </div>\n                ");
      } else if (type === 'exp') {
        element = DOMStrings.expenseContainer;
        html = "\n                <div class=\"item clearfix\" id=\"exp-".concat(obj.id, "\">\n                    <div class=\"item__description\">").concat(obj.description, "</div>\n                    <div class=\"right clearfix\">\n                        <div class=\"item__value\">").concat(formatNum(obj.value, type), "</div>\n                        <div class=\"item__percentage\">21%</div>\n                        <div class=\"item__delete\">\n                            <button class=\"item__delete--btn\"><i class=\"ion-ios-close-outline\"></i></button>\n                        </div>\n                    </div>\n                </div>\n                ");
      }

      ; // Insert the HTML into the DOM

      document.querySelector(element).insertAdjacentHTML('beforeend', html);
    },
    deleteListItem: function deleteListItem(selectorID) {
      var el = document.getElementById(selectorID);
      el.parentNode.removeChild(el);
    },
    clearField: function clearField() {
      var fields = Array.from(document.querySelectorAll(DOMStrings.inputDescription + ',' + DOMStrings.inputValue));
      fields.forEach(function (cur) {
        return cur.value = '';
      });
      fields[0].focus();
    },
    displayBudget: function displayBudget(obj) {
      var type;
      obj.budget > 0 ? type = 'inc' : type = 'exp';
      document.querySelector(DOMStrings.budgetLabel).textContent = formatNum(obj.budget, type);
      document.querySelector(DOMStrings.incomeLable).textContent = formatNum(obj.totalInc, 'inc');
      document.querySelector(DOMStrings.expenseLabel).textContent = formatNum(obj.totalExp, 'exp');

      if (obj.percentage > 0) {
        document.querySelector(DOMStrings.percentLabel).textContent = obj.percentage + '%';
      } else {
        document.querySelector(DOMStrings.percentLabel).textContent = '---';
      }
    },
    displayPerc: function displayPerc(percentages) {
      var fields = document.querySelectorAll(DOMStrings.expensesPercLabel);
      Array.from(fields).forEach(function (cur, index) {
        percentages[index] > 0 ? cur.textContent = percentages[index] + '%' : cur.textContent = '---';
      });
    },
    displayMonth: function displayMonth() {
      var now, month, months, year;
      months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      now = new Date();
      month = now.getMonth();
      year = now.getFullYear();
      document.querySelector(DOMStrings.dateLabel).textContent = months[month] + ' ' + year;
    },
    changeType: function changeType() {
      var fields = document.querySelectorAll(DOMStrings.inputType + ',' + DOMStrings.inputDescription + ',' + DOMStrings.inputValue);
      Array.from(fields).forEach(function (cur) {
        return cur.classList.toggle('red-focus');
      });
      document.querySelector(DOMStrings.inputBtn).classList.toggle('red');
    },
    getDOMString: function getDOMString() {
      return DOMStrings;
    }
  };
}(); //////////////////////////////////////
//  Global App Controller


var controller = function (budgetCtrl, UICtrl) {
  var setupEventListener = function setupEventListener() {
    var DOM = UICtrl.getDOMString();
    document.addEventListener('keypress', function (e) {
      if (e.keyCode === 13 || e.which === 13) ctrlAddItem();
    });
    document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
    document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
    document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changeType);
  };

  var updateBudget = function updateBudget() {
    // Calculate the budget
    budgetCtrl.CalculateBudget(); // Return the budget

    var budget = budgetCtrl.getBudget(); // Display the budget on the UI

    UICtrl.displayBudget(budget);
  };

  var updatePercentage = function updatePercentage() {
    // Calculate percentage
    budgetCtrl.calculatePercentages(); // Read percentage from budget controller

    var percentages = budgetCtrl.getPercentages(); // Display new percentage on UI

    UICtrl.displayPerc(percentages);
  };

  var ctrlAddItem = function ctrlAddItem() {
    var input, newItem; // Get input data 

    input = UICtrl.getInput();

    if (input.description !== '' && !isNaN(input.value) && input.value > 0) {
      // Add the item to the budget controller
      newItem = budgetCtrl.addItem(input.type, input.description, input.value); // Add the item to the UI 

      UICtrl.addListItem(newItem, input.type); // Clear input field

      UICtrl.clearField(); // Calculate and update the budget

      updateBudget(); // Calculate and update percentage

      updatePercentage();
    }
  };

  var ctrlDeleteItem = function ctrlDeleteItem(event) {
    var itemID, splitID, type, ID;
    itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

    if (itemID) {
      splitID = itemID.split('-');
      type = splitID[0];
      ID = parseInt(splitID[1]); // Delete item from budget controller

      budgetCtrl.deleteItem(type, ID); // Delete item from UI

      UICtrl.deleteListItem(itemID); // Update and display new budget

      updateBudget(); // Calculate and update percentage

      updatePercentage();
    }

    ;
  };

  return {
    init: function init() {
      console.log('Application has started.');
      UICtrl.displayBudget({
        budget: 0,
        totalInc: 0,
        totalExp: 0,
        percentage: 0
      });
      UICtrl.displayMonth();
      setupEventListener();
    }
  };
}(budgetController, UIController);

controller.init();