![words are images logo](app/assets/images/shovel_logo_w100.png)

By [words are images](http://wordsareimages.com)

# Bomb Squad

Bomb Squad is a fun little exercise, based on Microsoft's Minesweeper (with a slightly fresher look). 

I use "/bomb_squad" as a mount point. I like to add it as part of the development group. :-)

## Implementation Details

This is a pretty simple app. It just allows you to attach a little game/distraction/time-water to any rails application. Because there aren't enough distractions out there. 

+ *Making it work:* Bomb Squad is written as a rails engine so **you'll need to add the following to your routes.rb file:**

  `mount BombSquad::Engine => "/<mount point>", as: "<mount name>"` 
        
  (I use `bomb_squad` for the mount point and mount name.) There is only one route: `/play`. The URL helper to link to the game page is `bomb_squad.play_path`.

+ *Ruby version:* This was written using v. 1.9.3, but it should work on other versions without a problem; the complexity     is in the Javascript.

+ *Rails version:* This was written under Rails 4, but it should work under Rails 3, too.

+ *Dependencies:* This uses `haml` and `sass-rails`, the latter to simplify asset management. Minimal testing is done with `rspec` for test.

### How It Works  

This app is dead simple. It just provides a controller which renders the game page. The game is written entirely in Javscript/jquery, so the game page is self-contained, using no layout. It pulls bootstrap in from CDN for styling and functionality. I haven't tested how well it works for smaller devices - expect no miracles.

![words are images](app/assets/images/shovel_logo_w100.png)

