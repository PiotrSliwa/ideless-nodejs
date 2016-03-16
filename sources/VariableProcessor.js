'use strict';

function VariableProcessor(globalVariables) {

    this.process = process;

    function process(expr, scope) {
        if (!isVariableExpr(expr))
            return expr;
        function replaceWithScope(match, variableExpr) { return processVariableExpr(variableExpr, scope) }
        return expr.replace(/\$([\w\d\[\]\'\"\.\_]+)/g, replaceWithScope)
    }

    function processVariableExpr(variableExpr, scope) {
        if (isScopedVariable(variableExpr))
            return processScopedVariableExpr(variableExpr, scope);
        let value = getVariable(variableExpr);
        assertVariableExists(value, variableExpr);
        return JSON.stringify(value);
    }

    function processScopedVariableExpr(variableExpr, scope) {
        let value = getScopedVariable(variableExpr, scope);
        assertVariableExists(value, variableExpr);
        return JSON.stringify(value);
    }

    function isVariableExpr(expr) {
        return expr[0] === '$';
    }

    function getVariable(variableExpr) {
        return eval('globalVariables.' + variableExpr);
    }

    function isScopedVariable(variableExpr) {
        return variableExpr.match(/^this\b/);
    }

    function getScopedVariable(variableExpr, scope) {
        let varScope = { this: scope }
        return eval('varScope.' + variableExpr);
    }

    function assertVariableExists(variableValue, variableExpr) {
        if (!variableValue)
            throw new Error('Error: Variable ' + variableExpr + ' does not exist!');
    }

}

module.exports = VariableProcessor;