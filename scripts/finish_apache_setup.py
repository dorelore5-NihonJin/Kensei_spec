import paramiko
import base64

host = "151.244.253.105"
port = 22
username = "root"
password = "t8f_SwRkX_"

print("Connecting to server...")
client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect(host, port=port, username=username, password=password, timeout=15)

print("Setting permissions...")
client.exec_command("chown -R www-data:www-data /var/www/html/Kensei_spec && chmod -R 755 /var/www/html/Kensei_spec")
client.exec_command("ln -sfn /var/www/html/Kensei_spec /var/www/html/kensei")

def configure_file(conf_path):
    stdin, stdout, stderr = client.exec_command(f"cat {conf_path}")
    content = stdout.read().decode('utf-8', errors='ignore')
    
    if "ProxyPass /Kensei_spec !" not in content:
        content = content.replace("ProxyPass /Portfolio !", "ProxyPass /Kensei_spec !\n    ProxyPass /kensei !\n    ProxyPass /Portfolio !")
    
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
        content = content.replace("</VirtualHost>", alias_block + "\n</VirtualHost>")
        
    b64 = base64.b64encode(content.encode('utf-8')).decode('ascii')
    client.exec_command(f"echo '{b64}' | base64 -d > {conf_path}")
    print(f"Configured {conf_path}")

configure_file("/etc/apache2/sites-available/kulakovpro.space-le-ssl.conf")
configure_file("/etc/apache2/sites-available/kulakovpro.space.conf")

print("Testing and reloading Apache...")
stdin, stdout, stderr = client.exec_command("apache2ctl configtest && systemctl reload apache2")
print("Apache output:", stdout.read().decode('utf-8', errors='ignore') + stderr.read().decode('utf-8', errors='ignore'))

client.close()
print("Apache setup finished!")
