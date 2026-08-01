import os
import paramiko

host = "151.244.253.105"
port = 22
username = "root"
password = "t8f_SwRkX_"

remote_dir = "/var/www/html/Kensei_spec"
local_dist = os.path.abspath("dist")

print(f"Connecting via SSH to {host}...")
client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect(host, port=port, username=username, password=password, timeout=15)
sftp = client.open_sftp()

print(f"Ensuring remote directory {remote_dir} exists...")
def mkdir_p(sftp_client, remote_path):
    dirs = []
    path = remote_path
    while path and path != '/':
        dirs.append(path)
        path = os.path.dirname(path)
    dirs.reverse()
    for d in dirs:
        try:
            sftp_client.stat(d)
        except IOError:
            sftp_client.mkdir(d)

mkdir_p(sftp, remote_dir)

print(f"Uploading files from {local_dist} to {remote_dir}...")
uploaded_count = 0

for root_dir, dirs, files in os.walk(local_dist):
    rel_path = os.path.relpath(root_dir, local_dist)
    if rel_path == ".":
        cur_remote = remote_dir
    else:
        cur_remote = os.path.join(remote_dir, rel_path).replace("\\", "/")

    mkdir_p(sftp, cur_remote)

    for filename in files:
        local_file = os.path.join(root_dir, filename)
        remote_file = os.path.join(cur_remote, filename).replace("\\", "/")
        sftp.put(local_file, remote_file)
        uploaded_count += 1
        print(f"Uploaded: {remote_file}")

sftp.close()
print(f"Uploaded {uploaded_count} files successfully!")

# Set proper ownership and permissions
print("Setting permissions on /var/www/html/Kensei_spec...")
client.exec_command("chown -R www-data:www-data /var/www/html/Kensei_spec && chmod -R 755 /var/www/html/Kensei_spec")

# Create symlink for /var/www/html/kensei (lowercase alias)
client.exec_command("ln -sfn /var/www/html/Kensei_spec /var/www/html/kensei")

# Update Apache Config for kulakovpro.space-le-ssl.conf
print("Updating Apache configuration for SSL & HTTP...")
def update_apache_conf(conf_path):
    stdin, stdout, stderr = client.exec_command(f"cat {conf_path}")
    content = stdout.read().decode('utf-8', errors='ignore')
    
    changed = False
    if "ProxyPass /Kensei_spec !" not in content:
        # Insert ProxyPass exclusion before ProxyPass / http://127.0.0.1:3000/
        content = content.replace(
            "ProxyPass / ! \n",
            "ProxyPass /Kensei_spec !\n    ProxyPass /kensei !\n"
        ).replace(
            "ProxyPass /.well-known !",
            "ProxyPass /Kensei_spec !\n    ProxyPass /kensei !\n    ProxyPass /.well-known !"
        )
        changed = True
        
    if "Alias /Kensei_spec" not in content:
        alias_block = """
    Alias /Kensei_spec /var/www/html/Kensei_spec
    <Directory /var/www/html/Kensei_spec>
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>

    Alias /kensei /var/www/html/Kensei_spec
    <Directory /var/www/html/Kensei_spec>
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>
"""
        # Append before ErrorLog or </VirtualHost>
        if "</VirtualHost>" in content:
            content = content.replace("</VirtualHost>", alias_block + "\n</VirtualHost>")
            changed = True

    if changed:
        # Write back updated config using base64 or temp file
        import base64
        b64_content = base64.b64encode(content.encode('utf-8')).decode('ascii')
        client.exec_command(f"echo '{b64_content}' | base64 -d > {conf_path}")
        print(f"✓ Updated Apache config {conf_path}")

update_apache_conf("/etc/apache2/sites-available/kulakovpro.space-le-ssl.conf")
update_apache_conf("/etc/apache2/sites-available/kulakovpro.space.conf")

# Reload Apache
print("Testing and reloading Apache server...")
stdin, stdout, stderr = client.exec_command("apache2ctl configtest && systemctl reload apache2")
test_out = stdout.read().decode('utf-8', errors='ignore') + stderr.read().decode('utf-8', errors='ignore')
print("Apache Status:\n", test_out)

client.close()
print("Deployment Finished Successfully!")
