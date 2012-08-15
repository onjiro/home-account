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
            expect(target.date).to.be.a(Date);
            expect(target.accounts).to.be.empty();
            expect(target.details).to.be("");
        });
        
        it('should accepts initial values', function() {
            var values = {
                date    : new Date("2012-04-01"),
                accounts: ["hoge", "fuga"],
                details : "details"
            };
            
            var target = new Transaction(values);
            
            expect(target.date).to.be(values.date);
            expect(target.accounts).to.be(values.accounts);
            expect(target.details).to.be(values.details);
        });
    });
});
