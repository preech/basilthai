Remark = {
    callback: null,
    show: function(data, order, callbackfn) {
        var me = this;
        me.callback = callbackfn;
        me.form = Ext.create('Ext.Window', RemarkUi);
        me.getCmp('boxremark').setValue(order.remark);
        me.bindEvent(data, order);
        me.form.show();
    },
    bindEvent: function(data, order) {
        var me = this;
        me.getCmp('btnRemarkCancel').on('click', function() {
            me.form.close();
        });
        me.getCmp('btnRemarkOk').on('click', function() {
            order.remark = me.getCmp('boxremark').getValue();
            me.form.close();
            if (me.callback) {
                me.callback();
            }
        });
    },
    getCmp: function(id) {
        var me = this;
        var query = me.form.query('#' + id);
        if (query) {
            return query[0];
        }
    },
}