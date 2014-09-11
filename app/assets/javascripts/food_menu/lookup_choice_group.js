LookupChoiceGroup = {
    form: null,
    callback: null,
    show: function(data, callbackfn) {
        var me = this;
        me.callback = callbackfn;
        var screensize = Util.getScreenSize();
        var config = {
            title: 'Choice Group',
            constrain: true,
            border: false,
            modal: true,
            items: LookupChoiceGroupUi,
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
    },
    renderSheetSelect: function(data) {
        var me = this;
        var tag = '';
        for (var choiceGroupCode in data.ChoiceGroups) {
            var choiceGroup = data.ChoiceGroups[choiceGroupCode];
            tag += "<div class='choicegroup' code='" + choiceGroup.ChoiceGroupCode + "'>"
            tag += "<table class='tableheader' cellpadding=0 cellspacing=0><tr><td>" + choiceGroup.Name + "</td></tr></table>";
            tag += "<table class='tabledetail' cellpadding=0 cellspacing=0>";
            for (var i=0; i<choiceGroup.ChoiceList.length; i++) {
                var choice = choiceGroup.ChoiceList[i];
                tag += "<tr><td style='border-top:1px dotted blue'>" + choice.Name + "</td><td style='border-top:1px dotted blue;text-align:right'>" + choice.Price + "</td></tr>";
            }
            tag += "</table>";
            tag += "</div>";
            // var style = "width:100px;height:100px;border:1px solid blue;font-size:80%;overflow:hidden;float:left;margin:5px;background-color:#C9DDF5;cursor:pointer";
            // tag += "<div class='choicegroup' code='" + choiceGroup.ChoiceGroupCode + "' style='" + style + "'><table cellpadding=0 cellspacing=0 style='margin:5%;width:90%;height:40%;text-align:center'><tr><td>" + choiceGroup.Name + "</td></tr></table><table cellpadding=0 cellspacing=0 style='margin:5%;width:90%;height:45%;font-size:80%'>";
            // for (var i=0; i<choiceGroup.ChoiceList.length; i++) {
                // var choice = choiceGroup.ChoiceList[i];
                // tag += "<tr><td style='border-top:1px dotted blue'>" + choice.Name + "</td><td style='border-top:1px dotted blue;text-align:right'>" + choice.Price + "</td></tr>";
            // }
            // tag += "</table></div>";
        }
        var sheetSelect = me.form.query("panel[cid=SheetSelect]")[0];
        sheetSelect.update(tag);
        $(sheetSelect.el.dom).find("div[class='choicegroup']").bind('click', function(event) {
            var box = $(event.target);
            if (box.attr('class') != 'choicegroup') {
                box = box.parents("div[class='choicegroup']:first");
            }
            var choiceGroupCode = box.attr('code');
            me.form.close();
            if (me.callback) {
                me.callback(choiceGroupCode);
            }
        });
    },
    renderSheetEdit: function(data) {
        var me = this;
        var tag = '';
        for (var choiceGroupCode in data.ChoiceGroups) {
            var choiceGroup = data.ChoiceGroups[choiceGroupCode];
            tag += "<div class='choicegroup' code='" + choiceGroup.ChoiceGroupCode + "'>"
            tag += "<table class='tableheader' cellpadding=0 cellspacing=0><tr><td>" + choiceGroup.Name + "</td></tr></table>";
            tag += "<div class='deletebutton'><span class='text'>X</span></div>";
            tag += "<table class='tabledetail' style='position:relative;left:0px;top:-20px;' cellpadding=0 cellspacing=0>";
            for (var i=0; i<choiceGroup.ChoiceList.length; i++) {
                var choice = choiceGroup.ChoiceList[i];
                tag += "<tr><td style='border-top:1px dotted blue'>" + choice.Name + "</td><td style='border-top:1px dotted blue;text-align:right'>" + choice.Price + "</td></tr>";
            }
            tag += "</table>";
            tag += "</div>";
        }
        tag += "<div class='choicegroup' code='<<new>>'>"
        tag += "<table class='tablenew' cellpadding=0 cellspacing=0><tr><td><< New >></td></tr></table></div>";
        var sheetEdit = me.form.query("panel[cid=SheetEdit]")[0];
        sheetEdit.update(tag);
        $(sheetEdit.el.dom).find("div[class='choicegroup']").bind('click', function(event) {
            var target = $(event.target);
            if (target.attr('class') == 'choicegroup') {
                var box = target;
            }
            else {
                var box = target.parents("div[class='choicegroup']:first");
            }
            var choiceGroupCode = box.attr('code');
            if (target.attr('class') == 'deletebutton' || target.parents("div[class='deletebutton']:first").length > 0) {
                delete data.ChoiceGroups[choiceGroupCode];
                me.renderSheetEdit(data);
            }
            else {
                if (choiceGroupCode == '<<new>>') {
                    var choiceGroup = {
                        ChoiceList: []
                    }
                    EditChoiceGroup.show(choiceGroup, function(result) {
                        if (result) {
                            choiceGroup.ChoiceGroupCode = Util.genCode(8, function(value) {
                                for (var key in data.ChoiceGroups) {
                                    if (key == value) {
                                        return true;
                                    }
                                };
                            });
                            data.ChoiceGroups[choiceGroup.ChoiceGroupCode] = choiceGroup;
                            console.log(data.ChoiceGroups);
                            me.renderSheetEdit(data);
                        }
                    });
                }
                else {
                    EditChoiceGroup.show(data.ChoiceGroups[choiceGroupCode], function(result) {
                        if (result) {
                            me.renderSheetEdit(data);
                        }
                    });
                }
            }
        });
    },
}