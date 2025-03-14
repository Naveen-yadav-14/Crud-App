const hbs = require('hbs');

function registerHelpers(){
    hbs.registerHelper("inc",(value)=>parseInt(value)+1);

    hbs.registerHelper("ifEquals", (arg1, arg2, options) => {
        return arg1 === arg2 ? options.fn(this) : options.inverse(this);
    });

    hbs.registerHelper("eq", function(a, b) {
        return a === b;
    });

}

module.exports = registerHelpers;