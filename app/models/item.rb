class Item < ActiveRecord::Base
#  attr_accessible :item_code, :name, :description, :price_type, :price, :category_code, :choice_group_code
  has_many :options, class_name: :ItemOption, dependent: :delete_all, autosave: :true
  
  def self.load_all
    itemcategories = ItemCategory.all
    itemcategoryhash = {}
    itemcategories.each do | itemcategory |
      itemcategoryhash[itemcategory.item_category_code] = {
        :ItemCategoryCode => itemcategory.item_category_code,
        :Name => itemcategory.name,
        :SeqNo => itemcategory.seq_no,
      }
    end
    choicegroups = ChoiceGroup.all
    choicegrouphash = {}
    choicegroups.each do | choicegroup |
      choicelist = [];
      choicegroup.choices.each do | choice |
        choicelist.push({
          :ChoiceCode => choice.choice_code,
          :Name => choice.name,
          :Price => choice.price,
        });
      end
      choicegrouphash[choicegroup.choice_group_code] = {
        :ChoiceGroupCode => choicegroup.choice_group_code,
        :Name => choicegroup.name,
        :ChoiceList => choicelist,
      }
    end
    optiongroups = OptionGroup.all
    optiongrouphash = {}
    optiongroups.each do | optiongroup |
      optionlist = [];
      optiongroup.options.each do | option |
        optionlist.push({
          :OptionCode => option.option_code,
          :Name => option.name,
        });
      end
      optiongrouphash[optiongroup.option_group_code] = {
        :OptionGroupCode => optiongroup.option_group_code,
        :Name => optiongroup.name,
        :OptionList => optionlist,
      }
    end
    items = Item.all
    itemhash = {}
    items.each do | item |
      optionlist = [];
      item.options.each do | option |
        optionlist.push({
          :DefaultOptionCode => option.default_option_code,
          :OptionGroupCode => option.option_group_code,
        });
      end
      itemhash[item.item_code] = {
        :ItemCode => item.item_code,
        :Name => item.name,
        :Description => item.description,
        :PriceType => item.price_type,
        :Price => item.price,
        :CategoryCode => item.category_code,
        :ChoiceGroupCode => item.choice_group_code,
        :SeqNo => item.seq_no,
        :OptionList => optionlist,
      }
    end
    data = {
      :ChoiceGroups => choicegrouphash,
      :ItemCategories => itemcategoryhash,
      :OptionGroups => optiongrouphash,
      :Items => itemhash,
    }
    return data
  end
end
