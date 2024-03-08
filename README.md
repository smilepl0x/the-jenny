# the-jenny
## What this is
The Jenny is a Discord bot that I made for a personal server with some friends, but feel free to spin her up if you think she'd be useful.
## Commands

`/start [game_name]`
 - Start a game with your friends!
 - This command also supports aliases. (i.e. `/start ow` instead of `/start Overwatch`)
   
![image](https://github.com/smilepl0x/the-jenny/assets/47682247/cde218c2-5be8-4bdc-a36a-e7f4af1c38e8)


`/add [game_name] | optional: [max_party_size] [aliases]`
 - Add a new game to your server
 - This adds a new role to your server for this game
 - max_party_size takes an integer
 - aliases takes comma separated strings (i.e. ow,ow2)

`/register [game_name]`
 - Register self for one of the channel's games (adds user to role)
 - Game must be selected from populated list

--- Deprecated (will be removed soon) ---

`/show battletag#id`
 - This will scrape Overwatch data from the Blizzard webpage and display QP stats in a message
