var expect = require('expect.js');
var sinon = require('sinon');
var Transaction = require('../assets/www/js/transaction.js').Transaction;

describe('Transaction', function() {
    describe('#initialize', function() {
        it('should be a constractor', function() {
            var target = new Transaction();
            expect(target).to.be.a(Transaction);
        });
        it('should not store accounts unless argument passed', function() {
            var target = new Transaction();
            expect(target.accounts).to.be.empty();
        });
        it('should store argument as accounts', function() {
            var target = new Transaction({accounts: ["hoge", "fuga"]});
            expect(target.accounts).to.have.length(2);
            expect(target.accounts[0]).to.be("hoge");
            expect(target.accounts[1]).to.be("fuga");
        });
    });
});
