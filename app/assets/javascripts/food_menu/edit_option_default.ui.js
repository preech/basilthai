
Ext.define('modelEditOptionDefault', {
    extend: 'Ext.data.Model',
    fields:[{
        name: 'code',
        type: 'string',
    }, {
        name: 'name', 
        type: 'string',
    }, {
        name: 'default',
        type: 'string',
    }],
});

Ext.create('Ext.data.Store', {
    storeId: 'storeEditOptionDefault',
    model: 'modelEditOptionDefault',
    proxy: {
        type: 'memory',
        reader: {
            type: 'json',
        }
    }
});
var EditOptionDefaultUi = {
    title: 'Edit Option Default',
    constrain: true,
    border: false,
    modal: true,
    width: 400,
    height: 400,
    layout: 'fit',
    items: [{
        layout: 'border',
        items: [{
            xtype: 'panel',
            region: 'north',
            align: 'center',
            bodyStyle: 'font-size:200%;color:blue',
            style: 'text-align:center;',
            items: [{
                xtype: 'label',
                id: 'boxName',
            }]
        }, {
            xtype: 'grid',
            id: 'gridEditOptionDefault',
            region: 'center',
            store: 'storeEditOptionDefault',
            columns: [{
                text: 'Default',
                dataIndex: 'default',
                sortable: false,
                hideable: false,
                align: 'center',
            }, {
                text: 'Name',
                dataIndex: 'name',
                flex: 1,
                sortable: false,
                hideable: false,
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