//////////////////////////////////////
// Budget Controller
const budgetController = (function() {

    const Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };

    Expense.prototype.calcPercentage = function(totalIncome) {
        if (totalIncome > 0) {
            this.percentage = Math.round((this.value / totalIncome) * 100);
        } else {
            this.percentage = -1;
        };
    };

    Expense.prototype.getPercentage = function() {
        return this.percentage;
    };

    const Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    const data = {
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

    const calculateTotal = function(type) {
        let sum = data.allItems[type].reduce((prev,cur) => prev + cur.value, 0);
        data.totals[type] = sum;
    };
    

    return {
        addItem: function(type, des, val) {
            let newItem, ID;
            
            // Create new ID 
            // ID = last ID + 1
            data.allItems[type].length > 0 ? ID = data.allItems[type][data.allItems[type].length - 1].id + 1 : ID = 0;

            // Create new item based on 'inc' or 'exp' type
            if (type === 'inc') {
                newItem = new Income(ID, des, val);
            } else if (type === 'exp') {
                newItem = new Expense(ID, des, val);
            };

            // Push it into data structure
            data.allItems[type].push(newItem);

            // Return new item
            return newItem;
        },

        deleteItem: function(type, id) {
            const ids = data.allItems[type].map(cur => cur.id);
            const index = ids.indexOf(id);
            if (index !== -1) data.allItems[type].splice(index, 1);
        },

        CalculateBudget: function() {

            // Calculate total income and expenses
            calculateTotal('inc');
            calculateTotal('exp');

            // Calculate the budget - Income - Expenses
            data.budget = data.totals.inc - data.totals.exp;

            // Calculate the percentage of expenses that we spent
            if (data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            } else {
                data.percentage = -1;
            };
        },

        calculatePercentages: function() {
            data.allItems.exp.forEach(cur => cur.calcPercentage(data.totals.inc));
        },

        getPercentages: function() {
            const allPercentage = data.allItems.exp.map(cur => cur.getPercentage());
            return allPercentage;
        },

        getBudget: function() {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            };
        },

        testing: function() {
            console.log(data);
        }
    };

})();


//////////////////////////////////////
// UI Controller
const UIController = (function() {

    const DOMStrings = {
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

    const formatNum = function(num, type) {
        let numSplit, int, dec;
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
        int = numSplit[0];
        dec = numSplit[1];

        if (int.length > 3) int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, int.length);
        return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;
    };    

    return {
        getInput: function() {
            return {
                type: document.querySelector(DOMStrings.inputType).value,                       // inc or exp
                description: document.querySelector(DOMStrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMStrings.inputValue).value)
            };
        },

        addListItem: function(obj, type) {
            let html, element;

            // Create HTML string with placeholder
            if (type === 'inc') {
                element = DOMStrings.incomeContainer;

                html = `
                <div class="item clearfix" id="inc-${obj.id}">
                    <div class="item__description">${obj.description}</div>
                    <div class="right clearfix">
                        <div class="item__value">${formatNum(obj.value, type)}</div>
                        <div class="item__delete">
                            <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                        </div>
                    </div>
                </div>
                `
            } else if(type === 'exp') {
                element = DOMStrings.expenseContainer;

                html = `
                <div class="item clearfix" id="exp-${obj.id}">
                    <div class="item__description">${obj.description}</div>
                    <div class="right clearfix">
                        <div class="item__value">${formatNum(obj.value, type)}</div>
                        <div class="item__percentage">21%</div>
                        <div class="item__delete">
                            <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                        </div>
                    </div>
                </div>
                `
            };

            // Insert the HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', html);
        },

        deleteListItem: function(selectorID) {
            const el = document.getElementById(selectorID);
            el.parentNode.removeChild(el);
        },

        clearField: function() {
            const fields = Array.from(document.querySelectorAll(DOMStrings.inputDescription + ',' + DOMStrings.inputValue));
            fields.forEach(cur => cur.value = '');
            fields[0].focus();
        },

        displayBudget: function(obj) {
            let type;
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

        displayPerc: function(percentages) {
            const fields = document.querySelectorAll(DOMStrings.expensesPercLabel);
            Array.from(fields).forEach((cur, index) => {
                percentages[index] > 0 ? cur.textContent = percentages[index] + '%' : cur.textContent = '---';
            });
        },

        displayMonth: function() {
            let now, month, months, year;
            months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            now = new Date();
            month = now.getMonth();
            year = now.getFullYear();
            document.querySelector(DOMStrings.dateLabel).textContent = months[month] + ' ' + year;
        },

        changeType: function() {
            const fields = document.querySelectorAll(DOMStrings.inputType + ',' + DOMStrings.inputDescription + ',' + DOMStrings.inputValue);
            Array.from(fields).forEach(cur => cur.classList.toggle('red-focus'));
            document.querySelector(DOMStrings.inputBtn).classList.toggle('red');
        },

        getDOMString: function() {
            return DOMStrings;
        }
    };
})();


//////////////////////////////////////
//  Global App Controller
const controller = (function(budgetCtrl, UICtrl) {

    const setupEventListener = function() {
        const DOM = UICtrl.getDOMString();

        document.addEventListener('keypress', e => {
            if (e.keyCode === 13 || e.which === 13) ctrlAddItem();
        });

        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
        document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changeType);
    };


    const updateBudget = function() {
        // Calculate the budget
        budgetCtrl.CalculateBudget();

        // Return the budget
        const budget = budgetCtrl.getBudget();

        // Display the budget on the UI
        UICtrl.displayBudget(budget); 
    };


    const updatePercentage = function() {
        // Calculate percentage
        budgetCtrl.calculatePercentages();
        
        // Read percentage from budget controller
        const percentages = budgetCtrl.getPercentages();

        // Display new percentage on UI
        UICtrl.displayPerc(percentages);
    };


    const ctrlAddItem = function() {
        let input, newItem;

        // Get input data 
        input = UICtrl.getInput();

        if (input.description !== '' && !isNaN(input.value) && input.value > 0) {

            // Add the item to the budget controller
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);

            // Add the item to the UI 
            UICtrl.addListItem(newItem, input.type);

            // Clear input field
            UICtrl.clearField();
            
            // Calculate and update the budget
            updateBudget();

            // Calculate and update percentage
            updatePercentage();
        }
    };

    const ctrlDeleteItem = event => {
        let itemID, splitID, type, ID;
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

        if (itemID) {
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);

            // Delete item from budget controller
            budgetCtrl.deleteItem(type, ID);

            // Delete item from UI
            UICtrl.deleteListItem(itemID);

            // Update and display new budget
            updateBudget();

            // Calculate and update percentage
            updatePercentage();
        };
    };

    return {
        init: function() {
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
})(budgetController,UIController);

controller.init();




