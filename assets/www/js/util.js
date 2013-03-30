define(['jquery'], function() {
     $(function() {
        $(document).on('change', 'select', function(e) {
            $(this.selectedOptions[0]).trigger('select');
        });
    });
});
