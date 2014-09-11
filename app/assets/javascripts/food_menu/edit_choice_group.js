EditChoiceGroup = {
    form: null,
    callback: null,
    show: function(data, callbackfn) {
        var me = this;
        me.callback = callbackfn;
        var screensize = Util.getScreenSize();
        me.form = Ext.create('Ext.Window', EditChoiceGroupUi);
        me.bindEvent(data);
        me.getCmp('boxName').setValue(data.Name);
        var store = Ext.getStore('storeEditChoiceGroup');
        store.removeAll();
        for (var i=0; i<data.ChoiceList.length; i++) {
            var choice = data.ChoiceList[i];
            store.add({
                code: choice.ChoiceCode,
                name: choice.Name,
                price: choice.Price,
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
            data.ChoiceList = [];
            var store = Ext.getStore('storeEditChoiceGroup');
            Ext.each(store.getRange(), function(record) {
                var code = record.get('code');
                var name = record.get('name');
                var price = Util.toFloat(record.get('price'));
                if (name) {
                    if (!code) {
                        var code = Util.genCode(8, function(value) {
                            for (var i=0; i<data.ChoiceList.length; i++) {
                                if (data.ChoiceList[i].ChoiceCode == value) {
                                    return true;
                                }
                            }
                            return false;
                        });
                    }
                    data.ChoiceList.push({
                        ChoiceCode: code,
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