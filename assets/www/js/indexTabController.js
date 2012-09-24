$(function() {
    // タブの動作
    $('.js-tab a').click(function(e) {
        e.preventDefault();
        $(this).tab('show');
    });
    
    // タブ押下時に入力内容を引き継ぐ
    $('.js-tab a').on('show', function(e) {
        var $inputs = $(e.target.hash).find('input')
        , $previousInputs = $(e.relatedTarget.hash).find('input');
        
        $.each(['date', 'amount', 'item', 'opposite-item'], function(i, name) {
            var selector = '[name="' + name + '"]';
            $inputs.filter(selector).val(
                $previousInputs.filter(selector).val() || $inputs.filter(selector).val());
        });
    });
});

