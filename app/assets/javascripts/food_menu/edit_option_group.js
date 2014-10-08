EditOptionGroup = {
    form: null,
    callback: null,
    show: function(data, callbackfn) {
        var me = this;
        me.callback = callbackfn;
        var screensize = Util.getScreenSize();
        me.form = Ext.create('Ext.Window', EditOptionGroupUi);
        me.bindEvent(data);
        me.getCmp('boxName').setValue(data.Name);
        var store = Ext.getStore('storeEditOptionGroup');
        store.removeAll();
        for (var i=0; i<data.OptionList.length; i++) {
            var option = data.OptionList[i];
            store.add({
                code: option.OptionCode,
                name: option.Name,
                price: option.Price,
            });
        }
        store.add({
            code: null,
            name: null,
            price: null,
        });
        me.form.show();
    },
    bindEvent: function(data) {
        var me = this;
        me.getCmp('buttonOk').on('click', function() {
            data.Name = me.getCmp('boxName').getValue();
            data.OptionList = [];
            var store = Ext.getStore('storeEditOptionGroup');
            Ext.each(store.getRange(), function(record) {
                var code = record.get('code');
                var name = record.get('name');
                var price = Util.toFloat(record.get('price'));
                if (name) {
                    if (!code) {
                        var code = Util.genCode(8, function(value) {
                            for (var i=0; i<data.OptionList.length; i++) {
                                if (data.OptionList[i].OptionCode == value) {
                                    return true;
                                }
                            }
                            return false;
                        });
                    }
                    data.OptionList.push({
                        OptionCode: code,
                        Name: name,
                        Price: price,
                    });
                }
            });
            me.form.close();
            if (me.callback) {
                me.callback(true);
            }
        });
        me.getCmp('buttonCancel').on('click', function() {
            me.form.close();
            if (me.callback) {
                me.callback(false);
            }
        });
    },
    getCmp: function(id) {
        var me = this;
        var query = me.form.query('#' + id);
        if (query) {
            return query[0];
        }
    }
}