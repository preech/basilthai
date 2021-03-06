ConfirmOrder = {
    callback: null,
    show: function(data, order, callbackfn) {
        var me = this;
        me.callback = callbackfn;
        me.form = Ext.create('Ext.Window', ConfirmOrderUi);
        me.bindEvent(data, order);
        me.getCmp('boxamount').setValue(Util.toFloat(order.Amount).formatMoney(2));
        Ext.each(me.getCmp('ordertype').query('radiofield'), function(radio) {
            if (radio.inputValue == order.OrderType) {
                radio.setValue(true);
            }
        });
        me.getCmp('boxexempt').setValue(order.TaxExemptFlag == 'T');
        Ext.each(me.getCmp('boxpayby').query('radiofield'), function(radio) {
            if (radio.inputValue == order.PaymentType) {
                radio.setValue(true);
            }
        });
        var cashtendered = Util.toFloat(order.CashTendered);
        if (cashtendered) {
            me.getCmp('boxreceive').setValue(cashtendered.formatMoney(2));
        }
        else {
            me.getCmp('boxreceive').setValue(null);
        }
        me.getCmp('boxcreditcardno').setValue(order.CreditCardNo);
        me.getCmp('boxqueue').setValue(order.QueueNo);
        me.calculate();
        me.form.show();
        me.afterShow(data, order);
    },
    bindEvent: function(data, order) {
        var me = this;
        Ext.each(me.getCmp('boxpayby').query('radiofield'), function(radio) {
            radio.on('change', function(comp, newvalue) {
                if (newvalue) {
                    switch(comp.inputValue) {
                        case 'CASH':
                            me.clearkeypadtimeout();
                            me.getCmp('panelpayby').getLayout().setActiveItem(0);
                            me.getCmp('boxcreditcardno').setValue(null);
                            break;
                        case 'CARD':
                            me.clearkeypadtimeout();
                            me.getCmp('panelpayby').getLayout().setActiveItem(1);
                            me.getCmp('boxreceive').setValue(null);
                            me.getCmp('boxchange').setValue(null);
                            break;
                    }
                }
            });
        });
        me.getCmp('boxexempt').on('change', function() {
            me.calculate();
        });
        me.getCmp('btnCloseBack').on('click', function() {
            me.saveOrder(order);
            me.form.close();
            if (me.callback) {
                me.callback(false);
            }
        });
        me.getCmp('btnCloseFinish').on('click', function() {
            me.saveOrder(order);
            me.form.close();
            if (me.callback) {
                me.callback(true);
            }
        });
        me.getCmp('boxqueue').on('focus', function() {
            SelectQueue.show(order.QueueNo, function(result) {
                order.QueueNo = result;
                me.getCmp('boxqueue').setValue(result);
            });
        });
    },
    afterShow: function(data, order) {
        var me = this;
        Ext.each(me.getCmp('keypadorder').query('panel'), function(panel) {
            var element = $(panel.el.dom);
            Util.bindClick(element, function(control) {
                var target = $(control);
                while (target && !target.hasClass('x-panel')) {
                    target = target.parent();
                }
                var comp = Ext.getCmp(target.attr('id'));
                if (comp.data.command == 'remark') {
                    Remark.show(data, order, function() {
                    });
                }
                else {
                    var tabindex = me.getCmp('panelpayby').getLayout().getActiveItem();
                    if (tabindex.getId() == 'tabcash') {
                        var receive = me.getCmp('boxreceive').getValue();
                        if (comp.data.command == 'enter') {
                            var amount = Util.toFloat(receive);
                            me.getCmp('boxreceive').setValue(amount.formatMoney(2));
                            me.calculate();
                            me.clearkeypadtimeout();
                        }
                        else if (comp.data.command == 'clear') {
                            me.getCmp('boxreceive').setValue(null);
                            me.calculate();
                            me.clearkeypadtimeout();
                        }
                        else if (comp.data.command == 'backspace') {
                            if (receive.length > 0) {
                                me.getCmp('boxreceive').setValue(receive.substr(0, receive.length-1));
                                me.setkeypadtimeout();
                            }
                        }
                        else if (comp.data.value != undefined) {
                            if (!me.keypadtimer) {
                                receive = '';
                            }
                            receive += comp.data.value;
                            me.getCmp('boxreceive').setValue(receive);
                            me.getCmp('boxchange').setValue(null);
                            me.setkeypadtimeout();
                        }
                    }
                    else {
                        if (comp.data.command == 'backspace') {
                            var cardno = me.getCmp('boxcreditcardno').getValue();
                            if (cardno.length > 0) {
                                me.getCmp('boxcreditcardno').setValue(cardno.substr(0, cardno.length-1));
                            }
                        }
                        else if (comp.data.command == 'clear') {
                            me.getCmp('boxcreditcardno').setValue(null);
                        }
                        else if (comp.data.value != undefined) {
                            var cardno = me.getCmp('boxcreditcardno').getValue();
                            cardno += comp.data.value;
                            me.getCmp('boxcreditcardno').setValue(cardno);
                        }
                    }
                }
            });
        });
        me.getCmp('boxreceive').focus();
    },
    getCmp: function(id) {
        var me = this;
        var query = me.form.query('#' + id);
        if (query) {
            return query[0];
        }
    },
    saveOrder: function(order) {
        var me = this;
        order.QueueNo = me.getCmp('boxqueue').getValue();
        Ext.each(me.getCmp('ordertype').query('radiofield'), function(radio) {
            if (radio.getValue()) {
                order.OrderType = radio.inputValue;
            }
        });
        order.TaxExemptFlag = me.getCmp('boxexempt').getValue()?'T':'F';
        order.Tax = Util.toFloat(me.getCmp('boxtax').getValue());
        order.TotalAmount = Util.toFloat(me.getCmp('boxtotal').getValue());
        Ext.each(me.getCmp('boxpayby').query('radiofield'), function(radio) {
            if (radio.getValue()) {
                order.PaymentType = radio.inputValue;
            }
        });
        order.CashTendered = Util.toFloat(me.getCmp('boxreceive').getValue());
        order.Change = Util.toFloat(me.getCmp('boxchange').getValue());
        order.CreditCardNo = me.getCmp('boxcreditcardno').getValue();
    },
    calculate: function() {
        var me = this;
        var netamount = Util.toFloat(me.getCmp('boxamount').getValue());
        if (me.getCmp('boxexempt').getValue()) {
            var tax = 0;
        }
        else {
            var tax = netamount*0.095;
        }
        var totalamount = netamount + tax;
        me.getCmp('boxtax').setValue(tax.formatMoney(2));
        me.getCmp('boxtotal').setValue(totalamount.formatMoney(2));
        var receive = Util.toFloat(me.getCmp('boxreceive').getValue());
        if (receive) {
            me.getCmp('boxreceive').setValue(receive.formatMoney(2));
            var change = receive - totalamount;
            me.getCmp('boxchange').setValue(change.formatMoney(2));
        }
        else {
            me.getCmp('boxreceive').setValue(null);
            me.getCmp('boxchange').setValue(null);
        }
    },
    keypadtimer: undefined,
    setkeypadtimeout: function() {
        var me = this;
        me.clearkeypadtimeout();
        me.keypadtimer = setTimeout(function() {
            me.keypadtimer = undefined;
            me.calculate();
        }, 2000);
    },
    clearkeypadtimeout: function() {
        var me = this;
        if (me.keypadtimer) {
            clearTimeout(me.keypadtimer);
            me.keypadtimer = undefined;
        }
    },
}