# Configuration Android pour Misterdil (Windows)
# Exécuter avant un build :  . .\scripts\android-env.ps1

$env:JAVA_HOME = "C:\Users\mondong\.jdks\ms-17.0.18"
$env:ANDROID_HOME = "C:\Users\mondong\Android\Sdk"
$env:ANDROID_SDK_ROOT = $env:ANDROID_HOME
# Cache Gradle hors sandbox Cursor (évite les chemins > 260 caractères sous Windows)
$env:GRADLE_USER_HOME = "C:\gradle"
$env:Path = "$env:JAVA_HOME\bin;$env:ANDROID_HOME\platform-tools;$env:Path"

Write-Host "JAVA_HOME=$env:JAVA_HOME"
Write-Host "ANDROID_HOME=$env:ANDROID_HOME"
java -version
