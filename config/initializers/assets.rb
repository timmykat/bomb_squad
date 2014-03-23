##
# Specifies the locations of the image, css, and javascript assets

module BombSquad
 class Engine < ::Rails::Engine
   initializer :assets do |config|
      Rails.application.config.assets.precompile += %w{ bomb_squad.css }
      Rails.application.config.assets.precompile += %w{ bomb_squad.js }
      Rails.application.config.assets.paths << root.join("app", "assets", "images").to_s
    end
  end
end
