
Ext.define('modelEditOptionGroup', {
    extend: 'Ext.data.Model',
    fields:[{
        name: 'code',
        type: 'string',
    }, {
        name: 'name', 
        type: 'string',
    }],
});

Ext.create('Ext.data.Store', {
    storeId: 'storeEditOptionGroup',
    model: 'modelEditOptionGroup',
    proxy: {
        type: 'memory',
        reader: {
            type: 'json',
        }
    }
});
var EditOptionGroupEditor = Ext.create('Ext.grid.plugin.CellEditing', {
    clicksToEdit: 1,
    listeners: {
        edit: function(editor, e) {
            if (e.colIdx == 0) {
                if ((e.rowIdx+1) == e.store.getCount()) {
                    var value = e.record.get('name');
                    if (value) {
                        e.store.add({
                            code: null,
                            name: null,
                        });
                    }
                }
            }
        },
    },
});
var EditOptionGroupUi = {
    title: 'Edit Option Group',
    constrain: true,
    border: false,
    modal: true,
    width: 400,
    height: 400,
    layout: 'fit',
    items: [{
        layout: 'border',
        items: [{
            xtype: 'textfield',
            region: 'north',
            id: 'boxName',
        }, {
            xtype: 'grid',
            region: 'center',
            store: 'storeEditOptionGroup',
            plugins: [EditOptionGroupEditor],
            selModel: {
                selType: 'cellmodel'
            },
            columns: [{
                text: 'Name',
                dataIndex: 'name',
                flex: 1,
                sortable: false,
                hideable: false,
                editor: {
                    allowBlank: true
                },
            }]
        }, {
            xtype: 'panel',
            region: 'south',
            defaults: {
                xtype: 'button',
                margin: '5 0 5 5',
            },
            items: [{
                id: 'buttonOk',
                text: 'ok',
            }, {
                id: 'buttonCancel',
                text: 'cancel',
            }],
        }],
    }],
};