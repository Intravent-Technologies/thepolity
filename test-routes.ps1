$urls = @('/', '/about', '/services', '/contact')
$base = 'http://localhost:3000'

Write-Host 'Testing routes...' -ForegroundColor Cyan
Start-Sleep -Seconds 2

foreach($path in $urls) {
    $url = $base + $path
    try {
        $response = Invoke-WebRequest -Uri $url -TimeoutSec 5 -ErrorAction Stop
        Write-Host "$url - Status: $($response.StatusCode)" -ForegroundColor Green
    } catch {
        try {
            $status = $_.Exception.Response.StatusCode
            Write-Host "$url - Status: $status" -ForegroundColor Red
        } catch {
            Write-Host "$url - Connection Failed" -ForegroundColor Yellow
        }
    }
}
