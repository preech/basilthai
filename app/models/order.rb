class Order < ActiveRecord::Base
  has_many :order_items, dependent: :delete_all, autosave: :true
  
  def save!
    if self.order_no.blank?
      begin
        self.order_no = (0...8).map { (65 + rand(26)).chr }.join
      end until self.class.where(:order_no => self.order_no).blank?
    end
    super
  end
  
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
    result[:OrderItems] = self.order_items.map { | order_item | order_item.hash_data}
    return result
  end
  
  def hash_data= hash
    hash.each do | key,value |
      name = key.underscore
      case name
        when 'order_items'
          self.order_items.clear
          (value||[]).each do | childvalue |
            record = self.order_items.build
            childvalue['id'] = nil
            record.hash_data = childvalue
          end
        else
          if not value.kind_of?(Array)
            self[name] = value
          end
      end
    end
  end
  
  def self.get_last_queue_no orderdate
    a = arel_table.dup; a.table_alias = 'a'
    arel = a.project(a[:queue_no]).
      where(a[:order_date].eq(orderdate)).
      order('order_time desc').take(1)
    record = find_by_sql(arel.to_sql).first
    return record.queue_no unless record.blank?
  end
  
  def self.refresh_order orderdate, lastrefreshtime
    a = arel_table.dup; a.table_alias = 'a'
    arel = a.project(Arel.star).
      where(a[:order_date].eq(orderdate)).
      order('order_time asc')
    arel.where(a[:update_date].gteq(lastrefreshtime)) unless lastrefreshtime.blank?
    records = find_by_sql(arel.to_sql)
    return records
  end
end
