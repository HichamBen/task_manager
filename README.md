# To update server with the latest push to github repo

## 1) Authentificate to audis.com Hostinger VPS.
- In Terminal write this command:

```bash
sudo ssh root@195.35.24.83
```
- Enter your sudo password.
- Next write the VPS root password.

## 2) Update the repositroy.

```bash
# Go to the location of git repository 'dash-audlis' in the server
root@audlis:~# cd /var/www/dash-audlis/

# Pull the new commit from github
root@audlis:/var/www/dash-audlis# git pull origin main

# If you change the .env.example file go to the 'Steps B' before the next step.
# Generate key & install dependencies:
root@audlis:/var/www/dash-audlis# php artisan key:generate --ansi
root@audlis:/var/www/dash-audlis# composer install --no-dev ---optimize-autoloader 
root@audlis:/var/www/dash-audlis# php artisan route:cache
root@audlis:/var/www/dash-audlis# php artisan cache:clear
root@audlis:/var/www/dash-audlis# php artisan migrate

# Your server Now was update successfully
# Exist from it:
root@audlis:/var/www/dash-audlis# exit

# Steps B
# Copy the new changes in .env.example to .env file
root@audlis:/var/www/dash-audlis# cp .env.example .env

# Edit environement variable.
root@audlis:/var/www/dash-audlis# nano .env

....
 DB_DATABASE= 
 DB_USERNAME=root
 DB_PASSWORD=
...
# Go back to finish steps before 'Steps B'
```

### Note: All credentials key exist secret.txt file.
