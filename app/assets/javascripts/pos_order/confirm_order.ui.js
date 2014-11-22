var ConfirmOrderUi = {
    title: 'Confirm Order',
    constrain: true,
    border: false,
    modal: true,
    width: 760,
    height: 453,
    layout: 'border',
    items: [{
        xtype: 'panel',
        region: 'center',
        layout: 'absolute',
        bodyStyle: 'background-color: #86C2F7',
        items: [{
            xtype: 'button',
            id: 'btnCloseBack',
            x: 150,
            y: 10,
            width: 100,
            height: 30,
            text: 'Back',
        }, {
            xtype: 'button',
            id: 'btnCloseFinish',
            x: 500,
            y: 10,
            width: 100,
            height: 30,
            text: 'Finish',
        }]
    }, {
        xtype: 'panel',
        region: 'north',
        layout: 'border',
        height: 362,
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
                    xtype: 'radiogroup',
                    id: 'ordertype',
                    fieldLabel: 'Type',
                    items: [{
                        boxLabel: 'For Here',
                        name: 'ordertype',
                        inputValue: 'FORHERE',
                        checked: true,
                    }, {
                        boxLabel: 'To Go',
                        name: 'ordertype',
                        inputValue: 'TOGO',
                    }]
                }, {
                    xtype: 'panel',
                    height: 10,
                    border: false,
                }, {
                    fieldLabel: 'Net Total',
                    id: 'boxamount',
                    fieldStyle: 'text-align: right; font-size:20px; background-color:#BBBBFB;',
                    readOnly: true,
                    value: '',
                    height: 30,
                }, {
                    xtype: 'panel',
                    border: false,
                    height: 40,
                    items: [{
                        xtype: 'textfield',
                        fieldLabel: 'Tax',
                        id: 'boxtax',
                        margin: '5 5 5 0',
                        style: 'float: left',
                        fieldStyle: 'text-align: right; font-size:20px; background-color:#BBBBFB;',
                        readOnly: true,
                        value: '0.00',
                        height: 30,
                    }, {
                        xtype: 'checkbox',
                        id: 'boxexempt',
                        boxLabel: 'Exempt',
                        margin: '5 0 5 0',
                    }]
                }, {
                    fieldLabel: 'Total',
                    id: 'boxtotal',
                    fieldStyle: 'text-align: right; font-size:20px; background-color:#BBBBFB;',
                    readOnly: true,
                    value: '0.00',
                    height: 30,
                }, {
                    xtype: 'panel',
                    height: 10,
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
                    id: 'panelpayby',
                    layout: 'card',
                    border: false,
                    activeItem: 0,
                    height: 75,
                    items: [{
                        xtype: 'panel',
                        id: 'tabcash',
                        layout: 'anchor',
                        border: false,
                        items: [{
                            xtype: 'textfield',
                            fieldLabel: 'Cash Tendered',
                            id: 'boxreceive',
                            fieldStyle: 'text-align: right; font-size:20px',
                            height: 30,
                            readOnly: true,
                        }, {
                            xtype: 'textfield',
                            fieldLabel: 'Change',
                            id: 'boxchange',
                            fieldStyle: 'text-align: right; font-size:20px; background-color:#BBBBFB;',
                            readOnly: true,
                            value: '0.00',
                            height: 30,
                        }]
                    }, {
                        xtype: 'panel',
                        id: 'tabcard',
                        layout: 'anchor',
                        border: false,
                        items: [{
                            xtype: 'textfield',
                            fieldLabel: 'Credit Card No',
                            id: 'boxcreditcardno',
                            fieldStyle: 'font-size:20px',
                            anchor: '100%',
                            readOnly: true,
                            height: 30,
                        }]
                    }]
                }, {
                    xtype: 'numberfield',
                    fieldLabel: 'Queue No',
                    id: 'boxqueue',
                    fieldStyle: 'font-size: 25px; background-color:#BBBBFB;',
                    height: 30,
                    width: 200,
                    decimalPrecision: 0,
                    maxValue: 50,
                    minValue: 1,
                }]
            }]
        }, {
            xtype: 'panel',
            region: 'east',
            border: false,
            width: 360,
            margin: 1,
            id: 'keypadorder',
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
                data: { value: '7' },
                html: '<table cellpadding=0 cellspacint=0 style="text-align:center" width=100% height=100%><tr><td><span>7</span></td></tr></table>',
            }, {
                data: { value: '8' },
                html: '<table cellpadding=0 cellspacint=0 style="text-align:center" width=100% height=100%><tr><td><span>8</span></td></tr></table>',
            }, {
                data: { value: '9' },
                html: '<table cellpadding=0 cellspacint=0 style="text-align:center" width=100% height=100%><tr><td><span>9</span></td></tr></table>',
            }, {
                data: { command: 'backspace' },
                html: '<table cellpadding=0 cellspacint=0 style="text-align:center" width=100% height=100%><tr><td><span>Backspace</span></td></tr></table>',
            }, {
                data: { value: '4' },
                html: '<table cellpadding=0 cellspacint=0 style="text-align:center" width=100% height=100%><tr><td><span>4</span></td></tr></table>',
            }, {
                data: { value: '5' },
                html: '<table cellpadding=0 cellspacint=0 style="text-align:center" width=100% height=100%><tr><td><span>5</span></td></tr></table>',
            }, {
                data: { value: '6' },
                html: '<table cellpadding=0 cellspacint=0 style="text-align:center" width=100% height=100%><tr><td><span>6</span></td></tr></table>',
            }, {
                data: { command: 'clear' },
                html: '<table cellpadding=0 cellspacint=0 style="text-align:center" width=100% height=100%><tr><td><span>Clear</span></td></tr></table>',
            }, {
                data: { value: '1' },
                html: '<table cellpadding=0 cellspacint=0 style="text-align:center" width=100% height=100%><tr><td><span>1</span></td></tr></table>',
            }, {
                data: { value: '2' },
                html: '<table cellpadding=0 cellspacint=0 style="text-align:center" width=100% height=100%><tr><td><span>2</span></td></tr></table>',
            }, {
                data: { value: '3' },
                html: '<table cellpadding=0 cellspacint=0 style="text-align:center" width=100% height=100%><tr><td><span>3</span></td></tr></table>',
            }, {
                data: { command: 'remark' },
                html: '<table cellpadding=0 cellspacint=0 style="text-align:center" width=100% height=100%><tr><td><span>Remark</span></td></tr></table>',
            }, {
                colspan: 2,
                width: 180,
                data: { text: '0', value: 0 },
                html: '<table cellpadding=0 cellspacint=0 style="text-align:center" width=100% height=100%><tr><td><span>0</span></td></tr></table>',
            }, {
                data: { text: '.', value: '.' },
                html: '<table cellpadding=0 cellspacint=0 style="text-align:center" width=100% height=100%><tr><td><span style="font-weight: bold">.</span></td></tr></table>',
            }, {
                data: { command: 'enter' },
                html: '<table cellpadding=0 cellspacint=0 style="text-align:center" width=100% height=100%><tr><td><span>Enter</span></td></tr></table>',
            }]
        }]
    }]
}