var ConfirmOrderUi = {
    title: 'Confirm Order',
    constrain: true,
    border: false,
    modal: true,
    width: 760,
    height: 400,
    layout: 'border',
    items: [{
        xtype: 'panel',
        region: 'center',
        border: false,
        items: [{
            xtype: 'panel',
            layout: 'anchor',
            border: false,
            margin: '20 0 20 0',
            defaults: {
                xtype: 'textfield',
                margin: '5 20 5 20',
            },
            items: [{
                fieldLabel: 'Queue No',
                id: 'boxqueue',
                fieldStyle: 'color: red; font-size: 25px',
                height: 30,
                width: 150,
                value: '25',
            }, {
                xtype: 'radiogroup',
                id: 'ordertype',
                fieldLabel: 'Type',
                items: [{
                    boxLabel: 'For Here',
                    name: 'ordertype',
                    inputValue: 'HERE',
                    checked: true,
                }, {
                    boxLabel: 'To Go',
                    name: 'ordertype',
                    inputValue: 'HOME',
                }]
            }, {
                xtype: 'panel',
                height: 30,
                border: false,
            }, {
                fieldLabel: 'Net Total',
                id: 'boxamount',
                fieldStyle: 'text-align: right; color: red; font-size:20px',
                readOnly: true,
                value: '12.95',
            }, {
                xtype: 'panel',
                border: false,
                items: [{
                    xtype: 'textfield',
                    fieldLabel: 'Tax',
                    id: 'boxtax',
                    margin: '5 5 5 0',
                    style: 'float: left',
                    fieldStyle: 'text-align: right; color: red; font-size:20px',
                    readOnly: true,
                    value: '1.00',
                }, {
                    xtype: 'checkbox',
                    id: 'boxexempt',
                    boxLabel: 'Exempt',
                    margin: '5 0 5 0',
                }]
            }, {
                fieldLabel: 'Total',
                id: 'boxtotal',
                fieldStyle: 'text-align: right; color: red; font-size:20px',
                readOnly: true,
                value: '13.95',
            }, {
                xtype: 'panel',
                height: 30,
                border: false,
            }, {
                xtype: 'radiogroup',
                id: 'boxpayby',
                fieldLabel: 'Pay by',
                items: [{
                    boxLabel: 'Cash',
                    name: 'boxpayby',
                    inputValue: 'CASH',
                    checked: true,
                }, {
                    boxLabel: 'Credit Card',
                    name: 'boxpayby',
                    inputValue: 'CARD',
                }]
            }, {
                xtype: 'panel',
                layout: 'card',
                border: false,
                activeItem: 0,
                items: [{
                    xtype: 'panel',
                    layout: 'anchor',
                    border: false,
                    items: [{
                        xtype: 'textfield',
                        fieldLabel: 'Cash Tendered',
                        id: 'boxreceive',
                        fieldStyle: 'text-align: right; color: green; font-size:20px',
                        value: '20.00',
                    }, {
                        xtype: 'textfield',
                        fieldLabel: 'Change',
                        id: 'boxchange',
                        fieldStyle: 'text-align: right; color: red; font-size:20px',
                        readOnly: true,
                        value: '7.00',
                    }]
                }, {
                    xtype: 'panel',
                    layout: 'anchor',
                    border: false,
                    items: [{
                        xtype: 'textfield',
                        fieldLabel: 'Credit Card No',
                        id: 'boxcreditcardno',
                        fieldStyle: 'color: green; font-size:20px',
                        value: '123456789012345',
                        anchor: '100%',
                    }]
                }]
            }]
        }]
    }, {
        xtype: 'panel',
        region: 'east',
        border: false,
        width: 360,
        margin: 1,
        layout: {
            type: 'table',
            columns: 4,
        },
        defaults: {
            width: 90,
            height: 90,
            xtype: 'panel',
            bodyCls: 'touchbutton',
            bodyStyle: 'font-size:100%',
        },
        items: [{
            data: { value: 7 },
            html: '<table cellpadding=0 cellspacint=0 style="text-align:center" width=100% height=100%><tr><td><span>7</span></td></tr></table>',
        }, {
            data: { text: '8', value: 8 },
            html: '<table cellpadding=0 cellspacint=0 style="text-align:center" width=100% height=100%><tr><td><span>8</span></td></tr></table>',
        }, {
            data: { text: '9', value: 9 },
            html: '<table cellpadding=0 cellspacint=0 style="text-align:center" width=100% height=100%><tr><td><span>9</span></td></tr></table>',
        }, {
            data: { text: '<-' },
            html: '<table cellpadding=0 cellspacint=0 style="text-align:center" width=100% height=100%><tr><td><span>remark</span></td></tr></table>',
        }, {
            data: { text: '4', value: 4 },
            html: '<table cellpadding=0 cellspacint=0 style="text-align:center" width=100% height=100%><tr><td><span>4</span></td></tr></table>',
        }, {
            data: { text: '5', value: 5 },
            html: '<table cellpadding=0 cellspacint=0 style="text-align:center" width=100% height=100%><tr><td><span>5</span></td></tr></table>',
        }, {
            data: { text: '6', value: 6 },
            html: '<table cellpadding=0 cellspacint=0 style="text-align:center" width=100% height=100%><tr><td><span>6</span></td></tr></table>',
        }, {
            data: { text: '' },
            html: '<table cellpadding=0 cellspacint=0 style="text-align:center" width=100% height=100%><tr><td><span></span></td></tr></table>',
        }, {
            data: { text: '1', value: 1 },
            html: '<table cellpadding=0 cellspacint=0 style="text-align:center" width=100% height=100%><tr><td><span>1</span></td></tr></table>',
        }, {
            data: { text: '2', value: 2 },
            html: '<table cellpadding=0 cellspacint=0 style="text-align:center" width=100% height=100%><tr><td><span>2</span></td></tr></table>',
        }, {
            data: { text: '3', value: 3 },
            html: '<table cellpadding=0 cellspacint=0 style="text-align:center" width=100% height=100%><tr><td><span>3</span></td></tr></table>',
        }, {
            data: { text: '' },
            html: '<table cellpadding=0 cellspacint=0 style="text-align:center" width=100% height=100%><tr><td><span></span></td></tr></table>',
        }, {
            data: { text: '0', value: 0 },
            html: '<table cellpadding=0 cellspacint=0 style="text-align:center" width=100% height=100%><tr><td><span>0</span></td></tr></table>',
        }, {
            data: { text: '' },
            html: '<table cellpadding=0 cellspacint=0 style="text-align:center" width=100% height=100%><tr><td><span></span></td></tr></table>',
        }, {
            data: { text: '' },
            html: '<table cellpadding=0 cellspacint=0 style="text-align:center" width=100% height=100%><tr><td><span></span></td></tr></table>',
        }, {
            data: { text: '' },
            html: '<table cellpadding=0 cellspacint=0 style="text-align:center" width=100% height=100%><tr><td><span></span></td></tr></table>',
        }]
    }]
}