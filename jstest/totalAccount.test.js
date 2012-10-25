var expect = require('expect.js')
, sinon = require('sinon')
, TotalAccount = require('../assets/www/js/totalAccount.js').TotalAccount;

describe('TotalAccount', function() {
    describe('#initialize', function() {
        it('should have default values', function() {
            var actual = new TotalAccount();
            expect(actual.item).to.be(undefined);
            expect(actual.type).to.be('credit');
            expect(actual.amount).to.be(0);
        });

        it('should accepts initial values', function() {
            var actual = new TotalAccount({
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
            target = new TotalAccount({
                item: 'account item',
                type: 'debit',
                amount: 100
            });
        });

        it('should be a function', function() {
            expect(target.makeInventory).to.be.a(Function);
        });
    });

    describe('::selectImproved', function() {
        var target;
        it('should be a function', function() {
            expect(TotalAccount.selectImproved).to.be.a(Function);
        });
    });
});

