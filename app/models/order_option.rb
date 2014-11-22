class OrderOption < ActiveRecord::Base
  belongs_to :order_item
  
  def hash_data= hash
    hash.each do | key,value |
      name = key.underscore
      self[name] = value
    end
  end
end
