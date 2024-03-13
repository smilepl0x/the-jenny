# the-jenny
## What this is
The Jenny is a Discord bot that I made for a personal server with some friends, but feel free to spin her up if you think she'd be useful.
## Commands

### `/start`
Start a game with your friends!
 - Args
   - `[game_name: string]` or `[alias: string]`
 - Examples
   - `/start Overwatch`
   - `/start ow`
   
![image](https://github.com/smilepl0x/the-jenny/assets/47682247/cde218c2-5be8-4bdc-a36a-e7f4af1c38e8)


### `/add`
Add a new game (and a role) to your server
 - Args
   - `[game_name: string]`
   - `[max_party_size: integer, optional]`
   - `[aliases: string (comma separated), optional]`
 - Examples
   - `/add Overwatch`
   - `/add Overwatch 5 ow,ow2`

### `/register`
Register self for one of the channel's games (adds user to role)
 - Args
   - `[game_name: string]`

## --- Deprecated (will be removed soon) ---

### `/show battletag#id`
 - This will scrape Overwatch data from the Blizzard webpage and display QP stats in a message
