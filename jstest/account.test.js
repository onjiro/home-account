var expect = require('expect.js');
var sinon = require('sinon');
var Account = require('../assets/www/js/account.js').Account;

describe('Account', function() {
    var target;
    beforeEach(function() {
        target = new Account();
    });
    
    describe('#initialize', function() {
        it('should have default values', function() {
            expect(target.item).to.be(undefined);
            expect(target.amount).to.be(0);
            expect(target.date).to.be.a(Date);
        });
        it('should accepts initial values', function() {
            var target = new Account({
                item: '科目',
                amount: 3000,
                date: new Date(),
            });
            expect(target.item).to.be('科目');
            expect(target.amount).to.be(3000);
            expect(target.date).to.be.a(Date);
        });
    });
    describe('::find', function() {
        it('should function', function() {
            expect(Account.find).to.be.a('function')
        });
    });
});

