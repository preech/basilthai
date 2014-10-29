ConfirmOrder = {
    callback: null,
    show: function(data, callbackfn) {
        var me = this;
        me.callback = callbackfn;
        me.form = Ext.create('Ext.Window', ConfirmOrderUi);
        me.bindEvent(data);
        me.form.show();
    },
    bindEvent: function(data) {
        var me = this;
    },
    getCmp: function(id) {
        var me = this;
        var query = me.form.query('#' + id);
        if (query) {
            return query[0];
        }
    },
}