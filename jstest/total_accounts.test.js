var expect = require('expect.js')
, sinon = require('sinon')
, TotalAccounts = require('../assets/www/js/total_accounts.js').TotalAccounts;

describe('TotalAccounts', function() {
    describe('#initialize', function() {
        it('should have default values', function() {
            var actual = new TotalAccounts();
            expect(actual.item).to.be(undefined);
            expect(actual.type).to.be('credit');
            expect(actual.amount).to.be(0);
        });

        it('should accepts initial values', function() {
            var actual = new TotalAccounts({
                item: 'account item',
                type: 'debit',
                amount: 100
            });
            expect(actual.item).to.be('account item');
            expect(actual.type).to.be('debit');
            expect(actual.amount).to.be(100);
        });
    });

    describe('#makeInventory', function() {
        var target;
        beforeEach(function() {
            target = new TotalAccounts({
                item: 'account item',
                type: 'debit',
                amount: 100
            });
        });

        it('should be a function', function() {
            expect(target.makeInventory).to.be.a(Function);
        });
    });

    describe('::select', function() {
        var target;
        it('should be a function', function() {
            expect(TotalAccounts.select).to.be.a(Function);
        });
    });
});

