//////////////////////////////////////
// Budget Controller
const budgetController = (function() {
    const Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
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
        }
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

        getBudget: function() {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            };
        }
    }
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
        container: ".container"
    };

    return {
        getDOMString: function() {
            return DOMStrings;
        },

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
                        <div class="item__value">${obj.value}</div>
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
                        <div class="item__value">${obj.value}</div>
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

        clearField: function() {
            const fields = Array.from(document.querySelectorAll(DOMStrings.inputDescription + ',' + DOMStrings.inputValue));
            fields.forEach(cur => cur.value = '');
            fields[0].focus();
        }
    };
})();


//////////////////////////////////////
//  Controller
const controller = (function(budgetCtrl, UICtrl) {
    const setupEventListener = function() {
        const DOM = UICtrl.getDOMString();

        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress', e => {
            if (e.keyCode === 13 || e.which === 13) ctrlAddItem();
        });
    };

    const updateBudget = function() {
        // Calculate the budget
        budgetCtrl.CalculateBudget();

        // Return the budget
        const budget = budgetCtrl.getBudget();

        // Display the budget on the UI
        UICtrl.displayBudget(budget); 
    };

    const ctrlAddItem = function() {
        let input, newItem;

        // Get input data 
        input = UICtrl.getInput();

        // Add the item to the budget controller
        newItem = budgetCtrl.addItem(input.type, input.description, input.value);

        // Add the item to the UI 
        UICtrl.addListItem(newItem, input.type);

        // Clear input field
        UICtrl.clearField();
            
        // Calculate and update the budget
        updateBudget();
        
    }

    return {
        init: function() {
            console.log('Application has started.');
            setupEventListener();
        }
    };
})(budgetController,UIController);

controller.init();


