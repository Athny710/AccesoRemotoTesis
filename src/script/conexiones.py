import telnetlib
import sys

def swTopologico():
    switch1_IP = "192.168.1.7"
    connection = telnetlib.Telnet(switch1_IP, 5000)
    connection.interact()


if __name__ == '__main__':
    globals()[sys.argv[1]]()