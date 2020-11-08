import telnetlib
import sys

def swTop():
    switch1_IP = "192.168.1.100"
    connection = telnetlib.Telnet(switch1_IP, 5000)
    connection.interact()

def router1():
    switch1_IP = "192.168.35.22"
    connection = telnetlib.Telnet(switch1_IP, 5002)
    connection.interact()

def router2():
    switch1_IP = "192.168.35.22"
    connection = telnetlib.Telnet(switch1_IP, 5003)
    connection.interact()

def router3():
    switch1_IP = "192.168.35.23"
    connection = telnetlib.Telnet(switch1_IP, 5000)
    connection.interact()

def router4():
    switch1_IP = "192.168.35.23"
    connection = telnetlib.Telnet(switch1_IP, 5001)
    connection.interact()

def router5():
    switch1_IP = "192.168.35.24"
    connection = telnetlib.Telnet(switch1_IP, 5000)
    connection.interact()

def router6():
    switch1_IP = "192.168.35.24"
    connection = telnetlib.Telnet(switch1_IP, 5001)
    connection.interact()

def router7():
    switch1_IP = "192.168.35.25"
    connection = telnetlib.Telnet(switch1_IP, 5000)
    connection.interact()

def router8():
    switch1_IP = "192.168.35.25"
    connection = telnetlib.Telnet(switch1_IP, 5001)
    connection.interact()

def switch1():
    switch1_IP = "192.168.35.22"
    connection = telnetlib.Telnet(switch1_IP, 5000)
    connection.interact()

def switch2():
    switch1_IP = "192.168.35.22"
    connection = telnetlib.Telnet(switch1_IP, 5001)
    connection.interact()

def switch3():
    switch1_IP = "192.168.35.23"
    connection = telnetlib.Telnet(switch1_IP, 5002)
    connection.interact()

def switch4():
    switch1_IP = "192.168.35.23"
    connection = telnetlib.Telnet(switch1_IP, 5003)
    connection.interact()

def switch5():
    switch1_IP = "192.168.35.24"
    connection = telnetlib.Telnet(switch1_IP, 5002)
    connection.interact()

def switch6():
    switch1_IP = "192.168.35.24"
    connection = telnetlib.Telnet(switch1_IP, 5003)
    connection.interact()

def switch7():
    switch1_IP = "192.168.35.25"
    connection = telnetlib.Telnet(switch1_IP, 5002)
    connection.interact()

def switch8():
    switch1_IP = "192.168.35.25"
    connection = telnetlib.Telnet(switch1_IP, 5003)
    connection.interact()


if __name__ == '__main__':
    globals()[sys.argv[1]]()