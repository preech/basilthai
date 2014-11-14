var RemarkUi = {
    title: 'Order Remark',
    constrain: true,
    border: false,
    modal: true,
    width: 500,
    height: 300,
    layout: 'border',
    items: [{
        xtype: 'textarea',
        id: 'boxremark',
        region: 'center',
    }, {
        xtype: 'panel',
        region: 'south',
        height: 50,
        layout: 'absolute',
        bodyStyle: 'background-color: #86C2F7',
        items: [{
            xtype: 'button',
            id: 'btnRemarkCancel',
            x: 75,
            y: 10,
            width: 100,
            height: 30,
            text: 'Cancel',
        }, {
            xtype: 'button',
            id: 'btnRemarkOk',
            x: 325,
            y: 10,
            width: 100,
            height: 30,
            text: 'OK',
        }]
    }]
}