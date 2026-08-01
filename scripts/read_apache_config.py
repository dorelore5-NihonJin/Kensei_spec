import paramiko

host = "151.244.253.105"
port = 22
username = "root"
password = "t8f_SwRkX_"

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())

try:
    client.connect(host, port=port, username=username, password=password, timeout=10)
    print("Connected.")
    
    cmd = "cat /etc/apache2/sites-available/kulakovpro.space-le-ssl.conf"
    stdin, stdout, stderr = client.exec_command(cmd)
    out = stdout.read().decode('utf-8', errors='ignore')
    print("--- kulakovpro.space-le-ssl.conf ---")
    print(out)
    
finally:
    client.close()
