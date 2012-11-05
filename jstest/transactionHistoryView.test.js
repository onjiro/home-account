var require = this.require;
if (require) {
    var expect = require('expect.js')
    , sinon = require('sinon')
    , Account = require('../assets/www/js/account.js').Account
    , Transaction = require('../assets/www/js/transactionModel.js').Transaction
    , TransactionHistoryView = require('../assets/www/js/transactionHistoryView.js').TransactionHistoryView;
}

describe('TransactionHistoryView', function() {
    var $parent = {
        prepend: sinon.spy.create(function() { return this }),
        append: sinon.spy.create(function() { return this }),
        children: sinon.spy.create(function() { return this }),
        hide: sinon.spy.create(function() { return this }),
        fadeIn: sinon.spy.create(function() { return this })
    },
    target = new TransactionHistoryView($parent);

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
        it('should call `$parent.prepend` once', function() {
            target.prepend(new Transaction());
            expect($parent.prepend.callCount).be(1);
        });
        it('should prepend new dom element to $parent', function() {
            target.prepend(new Transaction({
                rowid: 0,
                date: new Date('2012/04/30 12:34:56'),
                details: 'details',
                accounts: [
                    new Account({
                        item: 'debit item',
                        type: 'debit',
                        amount: 1234567
                    }),
                    new Account({
                        item: 'credit item',
                        type: 'credit',
                        amount: 1234567
                    })
                ]
            }));
            expect($parent.prepend.args[0][0]).to.be.equal([
                '<tr data-transaction-id="0">',
                '  <td>2012/04/30 12:34</td>',
                '  <td>debit item</td>',
                '  <td><span class="label">credit item</span></td>',
                '  <td style="text-align: right;">1234567</td>',
                '  <td>details</td>',
                '</tr>'
            ].join('\n'));
        });
    });
    describe('#append', function() {
        it('should be a function', function() {
            expect(target.append).be.a(Function);
        });
        it('should call `$parent.append` once', function() {
            target.append(new Transaction());
            expect($parent.append.callCount).be(1);
        });
        it('should append new dom element to $parent', function() {
            target.append(new Transaction({
                rowid: 0,
                date: new Date('2012/04/30 12:34:56'),
                details: 'details',
                accounts: [
                    new Account({
                        item: 'debit item',
                        type: 'debit',
                        amount: 1234567
                    }),
                    new Account({
                        item: 'credit item',
                        type: 'credit',
                        amount: 1234567
                    })
                ]
            }));
            expect($parent.append.args[0][0]).to.be.equal([
                '<tr data-transaction-id="0">',
                '  <td>2012/04/30 12:34</td>',
                '  <td>debit item</td>',
                '  <td><span class="label">credit item</span></td>',
                '  <td style="text-align: right;">1234567</td>',
                '  <td>details</td>',
                '</tr>'
            ].join('\n'));
        });
    });
});
