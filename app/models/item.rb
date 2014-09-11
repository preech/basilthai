class Item < ActiveRecord::Base
#  attr_accessible :item_code, :name, :description, :price_type, :price, :category_code, :choice_group_code
  has_many :options, class_name: :ItemOption, dependent: :delete_all, autosave: :true
end
