var expect = require('expect.js');
var sinon = require('sinon');
var Transaction = require('../assets/www/js/transaction.js').Transaction;

describe('Transaction', function() {
    describe('#initialize', function() {
        it('should be a constractor', function() {
            var target = new Transaction();
            expect(target).to.be.a(Transaction);
        });
        it('should have default values', function() {
            var target = new Transaction();
            expect(target.accounts).to.be.empty();
        });
        it('should accepts initial values', function() {
            var target = new Transaction({accounts: ["hoge", "fuga"]});
            expect(target.accounts).to.have.length(2);
            expect(target.accounts[0]).to.be("hoge");
            expect(target.accounts[1]).to.be("fuga");
        });
    });
});
