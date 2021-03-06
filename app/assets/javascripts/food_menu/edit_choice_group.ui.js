
Ext.define('modelEditChoiceGroup', {
    extend: 'Ext.data.Model',
    fields:[{
        name: 'code',
        type: 'string',
    }, {
        name: 'name', 
        type: 'string',
    }, {
        name: 'price',
        type: 'string',
    }],
});

Ext.create('Ext.data.Store', {
    storeId: 'storeEditChoiceGroup',
    model: 'modelEditChoiceGroup',
    proxy: {
        type: 'memory',
        reader: {
            type: 'json',
        }
    }
});
var EditChoiceGroupUi = {
    title: 'Edit Choice Group',
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
            emptyText: 'input name here',
        }, {
            xtype: 'grid',
            region: 'center',
            store: 'storeEditChoiceGroup',
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
            }, {
                text: 'Price',
                dataIndex: 'price',
                sortable: false,
                hideable: false,
                editor: {
                    xtype: 'numberfield',
                    allowBlank: true,
                    minValue: 0,
                    maxValue: 100000,
                    hideTrigger: true,
                }
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