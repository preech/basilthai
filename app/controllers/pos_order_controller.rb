class PosOrderController < ApplicationController
  def load
    data = Item.load_all
    render :json => { :success => true, :data => data }
  end
end
