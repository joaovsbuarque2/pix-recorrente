#!/bin/bash
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
export PATH=$JAVA_HOME/bin:$PATH

echo "✅ Usando Java 17"
java -version

echo ""
echo "🚀 Iniciando build..."
cd android
./gradlew assembleDebug
