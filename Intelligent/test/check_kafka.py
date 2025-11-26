#!/usr/bin/env python3
"""
Script to check Kafka connectivity and start if needed
"""

import socket
import subprocess
import time
import sys
import os

def check_port(host, port, timeout=3):
    """Check if a port is open"""
    try:
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.settimeout(timeout)
        result = sock.connect_ex((host, port))
        sock.close()
        return result == 0
    except Exception:
        return False

def check_kafka():
    """Check if Kafka is running"""
    print("🔍 Checking Kafka connectivity...")
    
    # Check Zookeeper (port 2181)
    zk_running = check_port('localhost', 2181)
    print(f"  Zookeeper (2181): {'✅ Running' if zk_running else '❌ Not running'}")
    
    # Check Kafka (port 9092)
    kafka_running = check_port('localhost', 9092)
    print(f"  Kafka (9092): {'✅ Running' if kafka_running else '❌ Not running'}")
    
    return zk_running and kafka_running

def start_kafka():
    """Start Kafka using docker-compose"""
    print("🚀 Starting Kafka services...")
    
    try:
        # Check if docker-compose.dev.yml exists
        if not os.path.exists('../docker-compose.dev.yml'):
            print("❌ docker-compose.dev.yml not found in parent directory")
            return False
        
        # Start Zookeeper and Kafka
        result = subprocess.run([
            'docker-compose', '-f', '../docker-compose.dev.yml', 
            'up', '-d', 'zookeeper', 'kafka'
        ], capture_output=True, text=True)
        
        if result.returncode == 0:
            print("✅ Docker services started successfully")
            
            # Wait for services to be ready
            print("⏳ Waiting for services to be ready...")
            for i in range(30):  # Wait up to 30 seconds
                if check_kafka():
                    print("✅ Kafka is ready!")
                    return True
                time.sleep(1)
                print(f"  Waiting... ({i+1}/30)")
            
            print("⚠️  Services started but Kafka not responding")
            return False
        else:
            print(f"❌ Failed to start services: {result.stderr}")
            return False
            
    except Exception as e:
        print(f"❌ Error starting Kafka: {e}")
        return False

def main():
    """Main function"""
    print("🎯 Kafka Connectivity Checker")
    print("=" * 40)
    
    if check_kafka():
        print("✅ Kafka is already running!")
        return True
    
    print("\n❌ Kafka is not running. Attempting to start...")
    
    if start_kafka():
        print("\n🎉 Kafka started successfully!")
        print("\nYou can now:")
        print("  1. Start video producer: python video_producer.py 10.0.0.1.mp4")
        print("  2. Use camera API: POST /api/camera/start")
        return True
    else:
        print("\n❌ Failed to start Kafka")
        print("\nManual steps:")
        print("  1. cd ..")
        print("  2. docker-compose -f docker-compose.dev.yml up -d zookeeper kafka")
        print("  3. Wait 30 seconds")
        print("  4. Try again")
        return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)