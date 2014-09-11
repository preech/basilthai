EditOptionDefault = {
    form: null,
    callback: null,
    currentItemOption: null,
    show: function(data, itemOption, callbackfn) {
        var me = this;
        me.callback = callbackfn;
        me.currentItemOption = itemOption;
        var screensize = Util.getScreenSize();
        me.form = Ext.create('Ext.Window', EditOptionDefaultUi);
        me.bindEvent(data);
        me.getCmp('boxName').setText(data.Name);
        var store = Ext.getStore('storeEditOptionDefault');
        store.removeAll();
        for (var i=0; i<data.OptionList.length; i++) {
            var option = data.OptionList[i];
            store.add({
                code: option.OptionCode,
                name: option.Name,
                default: (option.OptionCode == itemOption.DefaultOptionCode) ? 'X' : '',
            });
        }
        me.form.show();
    },
    bindEvent: function(data) {
        var me = this;
        Ext.getCmp('gridEditOptionDefault').on('selectionchange', function(control, selected, options) {
            if (selected.length == 1) {
                var optioncode = selected[0].data.code;
                console.log(optioncode);
                var store = Ext.getStore('storeEditOptionDefault');
                Ext.each(store.getRange(), function(row) {
                    if (row.get('code') == optioncode) {
                        row.set('default', 'X');
                    }
                    else {
                        row.set('default', null);
                    }
                });
                store.commitChanges();
            }
        });
        me.getCmp('buttonOk').on('click', function() {
            var store = Ext.getStore('storeEditOptionDefault');
            Ext.each(store.getRange(), function(row) {
                if (row.get('default') == 'X') {
                    me.currentItemOption.DefaultOptionCode = row.get('code');
                    return false;
                }
            });
            console.log(me.currentItemOption);
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