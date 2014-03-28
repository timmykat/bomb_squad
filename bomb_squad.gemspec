$:.push File.expand_path('../lib', __FILE__)

# Gem version
require 'bomb_squad/version'

Gem::Specification.new do |s|
  s.name          = 'bomb_squad'
  s.version       = BombSquad::VERSION
  s.summary       = 'Bomb Squad'
  s.description   = 'Game that looks a lot like Minesweeper'
  s.authors       = ['Tim Kinnel, words are images']
  s.email         = ['tim@wordsareimages.com']
  s.homepage      = 'https://github.com/timmykat/bomb_squad'
  s.files         = Dir["{app,config,lib}/**/*", "README.rdoc"]
  s.test_files    = Dir["test/**/*"]
  s.require_paths = ['lib']
  
  s.add_dependency 'haml-rails'
  s.add_dependency 'sass-rails'
  s.add_development_dependency 'rspec-rails'
end