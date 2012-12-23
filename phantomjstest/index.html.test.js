var expect = require('./phantomjslib/expect-0.2.0.js');
describe('index.html', function() {
    it('can be opened', function() {
        page.open('./assets/www/index.html', function(status) {
            expect(status).to.be('success');
        });
    });
});

