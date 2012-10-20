var expect = require('expect.js')
, sinon = require('sinon')
, TransactionHistoryView = require('../assets/www/js/transactionHistoryView.js').TransactionHistoryView;

describe('TransactionHistoryView', function() {
    var target;
    beforeEach(function() {
        target = new TransactionHistoryView();
    });
    describe('#initialize', function() {
        it('should be a function', function() {
            expect(TransactionHistoryView).be.a(Function);
        });
    });

    describe('#prepend', function() {
        it('should be a function', function() {
            expect(target.prepend).be.a(Function);
        });
    });
});
