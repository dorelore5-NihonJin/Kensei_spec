import paramiko

host = "151.244.253.105"
port = 22
username = "root"
password = "t8f_SwRkX_"

print(f"Connecting to {host}:{port} via SSH...")
client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())

try:
    client.connect(host, port=port, username=username, password=password, timeout=10)
    print("SSH connection successful!")
    
    commands = [
        "uname -a",
        "ls -la /var/www",
        "ls -la /var/www/html",
        "apache2ctl -S || httpd -S || nginx -T",
        "ls -la /etc/apache2/sites-enabled/ || ls -la /etc/httpd/conf.d/"
    ]
    
    for cmd in commands:
        print(f"\n--- Running: {cmd} ---")
        stdin, stdout, stderr = client.exec_command(cmd)
        out = stdout.read().decode('utf-8', errors='ignore')
        err = stderr.read().decode('utf-8', errors='ignore')
        if out:
            print("STDOUT:\n", out)
        if err:
            print("STDERR:\n", err)
            
finally:
    client.close()
    print("SSH connection closed.")
