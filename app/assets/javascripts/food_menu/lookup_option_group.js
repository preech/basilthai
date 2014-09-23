LookupOptionGroup = {
    form: null,
    callback: null,
    closecallback: null,
    ignoreList: [],
    show: function(data, ignoreList, callbackfn, closefn) {
        var me = this;
        me.callback = callbackfn;
        me.closecallback = closefn;
        me.ignoreList = ignoreList;
        var screensize = Util.getScreenSize();
        var config = {
            title: 'Option Group',
            constrain: true,
            border: false,
            modal: true,
            items: LookupOptionGroupUi,
            width: screensize.width-100,
            height: screensize.height-100,
            layout: 'fit',
        }
        me.form = Ext.create('Ext.Window', config);
        me.bindEvent(data);
        me.form.show();
        me.renderSheetSelect(data);
    },
    bindEvent: function(data) {
        var me = this;
        me.form.query('tabpanel')[0].on('tabchange', function(tabpanel, newcard, oldcard) {
            if (newcard.cid == 'SheetEdit') {
                me.renderSheetEdit(data);
            }
            else if (newcard.cid == 'SheetSelect') {
                me.renderSheetSelect(data);
            }
        });
        me.form.on('close', function() {
            if (me.closecallback) {
                me.closecallback();
            }
        });
    },
    renderSheetSelect: function(data) {
        var me = this;
        var tag = '';
        for (var optionGroupCode in data.OptionGroups) {
            var optionGroup = data.OptionGroups[optionGroupCode];
            if (me.ignoreList.indexOf(optionGroupCode) < 0) {
                tag += "<div class='optiongroup' code='" + optionGroup.OptionGroupCode + "'>"
                tag += "<table class='tableheader' cellpadding=0 cellspacing=0><tr><td>" + optionGroup.Name + "</td></tr></table>";
                tag += "<table class='tabledetail' cellpadding=0 cellspacing=0>";
                for (var i=0; i<optionGroup.OptionList.length; i++) {
                    var option = optionGroup.OptionList[i];
                    tag += "<tr>";
                    tag += "<td style='border-top:1px dotted blue;text-align:center'>" + option.Name + "</td>";
                    tag += "</tr>";
                }
                tag += "</table>";
                tag += "</div>";
            }
        }
        var sheetSelect = me.form.query("panel[cid=SheetSelect]")[0];
        sheetSelect.update(tag);
        $(sheetSelect.el.dom).find("div[class='optiongroup']").bind('click', function(event) {
            var box = $(event.target);
            if (box.attr('class') != 'optiongroup') {
                box = box.parents("div[class='optiongroup']:first");
            }
            var optionGroupCode = box.attr('code');
            itemOption = {
                OptionGroupCode: optionGroupCode,
                DefaultOptionCode: data.OptionGroups[optionGroupCode].OptionList[0].OptionCode
            }
            EditOptionDefault.show(data.OptionGroups[optionGroupCode], itemOption, function(result) {
                if (result) {
                    if (me.callback) {
                        me.callback(itemOption);
                    }
                    me.form.close();
                }
            });
        });
    },
    renderSheetEdit: function(data) {
        var me = this;
        var tag = '';
        for (var optionGroupCode in data.OptionGroups) {
            var optionGroup = data.OptionGroups[optionGroupCode];
            tag += "<div class='optiongroup' code='" + optionGroup.OptionGroupCode + "'>"
            tag += "<table class='tableheader' cellpadding=0 cellspacing=0><tr><td>" + optionGroup.Name + "</td></tr></table>";
            tag += "<div class='deletebutton'><span class='text'>X</span></div>";
            tag += "<table class='tabledetail' style='position:relative;left:0px;top:-20px;' cellpadding=0 cellspacing=0>";
            for (var i=0; i<optionGroup.OptionList.length; i++) {
                var option = optionGroup.OptionList[i];
                tag += "<tr><td style='border-top:1px dotted blue;text-align:center'>" + option.Name + "</td></tr>";
            }
            tag += "</table>";
            tag += "</div>";
        }
        tag += "<div class='optiongroup' code='<<new>>'>"
        tag += "<table class='tablenew' cellpadding=0 cellspacing=0><tr><td><< New >></td></tr></table></div>";
        var sheetEdit = me.form.query("panel[cid=SheetEdit]")[0];
        sheetEdit.update(tag);
        $(sheetEdit.el.dom).find("div[class='optiongroup']").bind('click', function(event) {
            var target = $(event.target);
            if (target.attr('class') == 'optiongroup') {
                var box = target;
            }
            else {
                var box = target.parents("div[class='optiongroup']:first");
            }
            var optionGroupCode = box.attr('code');
            if (target.attr('class') == 'deletebutton' || target.parents("div[class='deletebutton']:first").length > 0) {
                delete data.OptionGroups[optionGroupCode];
                me.renderSheetEdit(data);
            }
            else {
                if (optionGroupCode == '<<new>>') {
                    var optionGroup = {
                        OptionList: []
                    }
                    EditOptionGroup.show(optionGroup, function(result) {
                        if (result) {
                            optionGroup.OptionGroupCode = Util.genCode(8, function(value) {
                                for (var key in data.OptionGroups) {
                                    if (key == value) {
                                        return true;
                                    }
                                };
                            });
                            data.OptionGroups[optionGroup.OptionGroupCode] = optionGroup;
                            me.renderSheetEdit(data);
                        }
                    });
                }
                else {
                    EditOptionGroup.show(data.OptionGroups[optionGroupCode], function(result) {
                        if (result) {
                            me.renderSheetEdit(data);
                        }
                    });
                }
            }
        });
    },
}