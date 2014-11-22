class PosOrderController < TemplateController
  def load
    data = Item.load_all
    render :json => { :success => true, :data => data }
  end
  
  def create
    transaction do
      data = params[:data] || "{}"
      hash = JSON.parse(data)
      order = Order.new
      logger.info(hash)
      order.hash_data = hash
      order.save!
      #abort!
      render :json => { :success => true }
    end
  end
  
  def get_last_queue_no
    orderdate = params[:OrderDate]
    data = {
      :LastQueueNo => Order.get_last_queue_no(orderdate),
    }
    render :json => { :success => true, :data => data }
  end
end
