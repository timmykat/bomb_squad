# Configure Rails Environment
ENV["RAILS_ENV"] = "test"
require File.expand_path("../dummy/config/environment.rb",  __FILE__)

require 'bundler/setup'
Bundler.setup

require "rspec/rails"
require "haml"

ENGINE_RAILS_ROOT = File.join(File.dirname(__FILE__), '../')

# Load support files
Dir[File.join(ENGINE_RAILS_ROOT, "spec/support/**/*.rb")].each { |f| require f }

# No fixtures needed - no models

RSpec.configure do |config|
  # Nothing to configure at the moment
end
