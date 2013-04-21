define(['jquery', 'underscore', 'jquery-ui', 'bootstrap'], function($, _) {
     $(function() {
        $(document).on('change', 'select', function(e) {
            $(this.selectedOptions[0]).trigger('select');
        });
    });

    $(function() {
        $.datepicker.setDefaults({
            dateFormat: 'yy/mm/dd',
        });
        $(document).on('focusin', '.datepicker', function(e) {
            $(e.target).datepicker();
        });
    });

    // タブ変更時の動作を設定
    $(function() {
        $('body')
            .on('click', '.js-tab a', function(e) {
                e.preventDefault();
                $(this).tab('show');
            })
            .on('show', '.js-tab a', function(e) {
                $($(this).attr('href')).trigger('show', e);
            })
            .on('show', '.js-tab a', function(e) {
                // タブペインの入力内容を引き継ぐ
                var $currents = $(e.target.hash).find('input')
                , $previouses = $(e.relatedTarget.hash).find('input');
                _.chain(['date', 'amount', 'item', 'opposite-item'])
                    .map(function(type) { return '[name="' + type + '"]' })
                    .map(function(selector) { return {
                        current:  $currents.filter(selector).val(),
                        previous: $previouses.filter(selector).val(),
                        target:   $currents.filter(selector),
                    }})
                    .each(function(params) {
                        params.target.val(params.previous || params.current);
                    });
            });
    });
});
