class Order < ActiveRecord::Base
  has_many :order_items, dependent: :delete_all, autosave: :true
  
  def hash_data= hash
    hash.each do | key,value |
      name = key.underscore
      case name
        when 'order_items'
          self.order_items.clear
          (value||[]).each do | childvalue |
            record = self.order_items.build
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
end
