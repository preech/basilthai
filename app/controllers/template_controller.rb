class TemplateController < ApplicationController
  around_filter :try

  private
  
  def try
    begin
      yield
    rescue Exception => err
      result = { 
        :message => err.message,
        :success => false
      }
      list = []
      list.push('')
      list.push(err.message)
      actionstr = "undefined" 
      actionstr = params[:action] unless params.blank?
      list.push('error at ' + self.class.name + "." + actionstr)
      list.push("params:-")
      unless self.params.blank?
        params.each do | k, v | 
          if k != "controller" && k != "action"
            list.push("   " + k.to_s + " = " + v.to_s)
          end
        end
      end
      list.push("backtrace:-")
      err.backtrace.each do |x|   
        x.match(/^(.+?):(\d+)(|:in `(.+)')$/); 
        unless $1.blank?
          if $1.include? "/projects/"
            unless $1.include? "template_controller"
              line = "   #{$1} at line #{$2} in method #{$4}"
              list.push(line)
            end
          end
        end
      end
      list.each { | l | logger.info(l) }
      render :json => result.to_json
    end
  end
  
  def transaction
    ActiveRecord::Base.transaction do
      yield
    end
  end
  
  def abort!
    raise Exception, "abort!"
  end
end

