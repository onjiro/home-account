var require = this.require;
if (require) {
    var expect = require('expect.js')
    , sinon = require('sinon')
    , Account = require('../assets/www/js/account.js').Account
    , Transaction = require('../assets/www/js/transactionModel.js').Transaction
    , TransactionHistoryView = require('../assets/www/js/transactionHistoryView.js').TransactionHistoryView;
}

describe('TransactionHistoryView', function() {
    var target, $parent;
    beforeEach(function() {
        $parent = {};
        target = new TransactionHistoryView($parent);
    });

    describe('#initialize', function() {
        it('should be a function', function() {
            expect(TransactionHistoryView).be.a(Function);
        });
        it('should encupsulate argument `$parent`', function() {
            expect(target.$parent).not.to.be.ok();
            expect(target.$_parent).not.to.be.ok();
        });
    });

    describe('#prepend', function() {
        it('should be a function', function() {
            expect(target.prepend).be.a(Function);
        });
        it('should call `$parent.prepend` once');
        it('should prepend new dom element to $parent');
    });
    describe('#append', function() {
        it('should be a function', function() {
            expect(target.append).be.a(Function);
        });
        it('should call `$parent.append` once');
        it('should append new dom element to $parent');
    });
});
