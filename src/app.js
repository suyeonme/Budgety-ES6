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

    const ctrlAddItem = function() {
        let input, newItem;

        // Get input data 
        input = UICtrl.getInput();

        // Add the item to the budget controller

        // Add the item to the UI 

        // Clear input field
            
        // Calculate and update the budget
        
    }

    return {
        init: function() {
            console.log('Application has started.');
            setupEventListener();
        }
    };
})(budgetController,UIController);

controller.init();


