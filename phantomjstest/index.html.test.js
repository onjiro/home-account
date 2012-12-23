var expect = require('./node_modules/expect.js/expect.js');
describe('index.html', function() {
    it('can be opened', function() {
        page.open('./assets/www/index.html', function(status) {
            expect(status).to.be('success');
        });
    });
});

