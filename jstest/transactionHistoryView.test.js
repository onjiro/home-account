var expect = require('expect.js')
, sinon = require('sinon')
, TransactionHistoryView = require('../assets/www/js/transactionHistoryView.js').TransactionHistoryView;

describe('TransactionHistoryView', function() {
    describe('#initialize', function() {
        it('should be a function', function() {
            expect(TransactionHistoryView).be.a(Function);
        });
    });
});
