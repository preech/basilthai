class OrderOption < ActiveRecord::Base
  belongs_to :order_item
  
  def hash_data
    result = {}
    self.attributes.each do | key,value |
      name = key.camelize
      case self.class.columns_hash[key].type
        when :decimal
          result[name] = value.to_f
        when :time
          result[name] = value.strftime('%H:%M:%S.%L')
        else
          result[name] = value
      end
    end
    return result
  end
  
  def hash_data= hash
    hash.each do | key,value |
      name = key.underscore
      self[name] = value
    end
  end
end
