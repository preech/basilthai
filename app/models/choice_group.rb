class ChoiceGroup < ActiveRecord::Base
#  attr_accessible :choice_group_code, :name
  has_many :choices, dependent: :delete_all, autosave: :true
end
