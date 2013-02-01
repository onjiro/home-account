/**
 * AccountItemを設定するためのビュー
 *
 * el, collectionをオブジェクトの生成時に与えること。
 */
AccountItemConfigureView = (function(global) {
    return Backbone.View.extend({
        events: {
            'click .classification': function(e) {
                $(e.currentTarget)
                    .children('select').show()
                    .siblings().hide();
            },
            'change .classification': function(e) {
                $(e.currentTarget)
                    .children('span').text(e.target.value).show()
                    .siblings().hide();
            }
        },

        initialize: function(options) {
            this.classifications = options.classifications;
            this.rowTemplate = _.template($('#account-item-template').html());
            this.optionTemplate = _.template($('#select-option-template').html());
            this.$tableBody = this.$('tbody');
            this.$classificationOptions = $('<div/>');

            this.collection.on('reset', this.render, this);
            this.classifications.on('reset', this.render, this);
        },
        render: function() {
            this.$classificationOptions.empty();
            this.classifications.each(function(classificationItem) {
                this.$classificationOptions.append(this.optionTemplate(classificationItem.attributes));
            }, this);
            this.collection.each(function(accountItem) {
                this.$tableBody.append(this.rowTemplate(accountItem.attributes));
            }, this);
            this.$tableBody.find('select').append(this.$classificationOptions.html());
        },
    });
})(this);

