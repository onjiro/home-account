var EntryTabView = (function() {
    return Backbone.View.extend({
        events: {
            'click .edit-date': function(e){
                $('.past-mode').show()
                    .siblings().hide();
            },
            'click .no-edit-date': function(e) {
                $('.now-mode').show()
                    .siblings().hide();
                $('input').val(null);
            },
            'submit': function(e) {
                e.preventDefault();
                this.onSubmit();
            },
        },
        onSubmit: function() {
            // 画面に入力された情報を取得
            var dateVal = $('[name=date]').val();
            var entries = {
                date: (dateVal) ? new Date(dateVal): new Date(),
                item: $('[name=item]').val(),
                oppositeItem: $('[name=opposite-item]').val(),
                amount: $('[name=amount]').val(),
                details: null
            };
            // 勘定を登録する
            var accountTransaction = new Transaction({
                date: entries.date,
                details: entries.details,
                accounts: [
                    // 購入した品目側、通常は資産増加のため、借方（左側）の増加
                    new Account({
                        date: entries.date,
                        item: entries.item,
                        amount: entries.amount,
                        type: 'debit'
                    }),
                    // 支払い方法、通常は資産減少のため、貸方（右側）の増加
                    new Account({
                        date: entries.date,
                        item: entries.oppositeItem,
                        amount: entries.amount,
                        type: 'credit'
                    }),
                ],
            });
            accountTransaction.save({success: function() {
                var $alert = $(alertTemplate({
                    message: "ok to save!!"
                })).delay(1000).fadeOut();

                $history.prepend($alert, function() { this.remove(); });
                currentTransactions.add(accountTransaction, {at: 0, newest: true});
                _this.reset();
            }});
        },
    });
})();
