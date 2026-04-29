# push-to-github.ps1 (sem acentos para evitar erro de encoding)

$ErrorActionPreference = "Stop"

$RepoOwner = "comercial729"
$RepoName  = "simulador-premiacao"
$RepoFull  = "$RepoOwner/$RepoName"

$ProjectPath = "C:\Users\Usuario\OneDrive\Documentos\Claude\Projects\Simulador premiacao"
$Bundle      = Join-Path $ProjectPath "simulador-premiacao.bundle"
$TmpDir      = Join-Path $ProjectPath "simulador-tmp"

# Fallback: se a pasta com acento nao existir, usa a outra grafia
if (-not (Test-Path $ProjectPath)) {
    $ProjectPath = "C:\Users\Usuario\OneDrive\Documentos\Claude\Projects\Simulador premiacao"
}
if (-not (Test-Path $ProjectPath)) {
    # tentar pasta com til
    $alt = "C:\Users\Usuario\OneDrive\Documentos\Claude\Projects\Simulador premia" + [char]0x00E7 + [char]0x00E3 + "o"
    if (Test-Path $alt) { $ProjectPath = $alt }
}

$Bundle = Join-Path $ProjectPath "simulador-premiacao.bundle"
$TmpDir = Join-Path $ProjectPath "simulador-tmp"

Write-Host "Pasta do projeto: $ProjectPath"
Write-Host "Bundle git: $Bundle"
Write-Host "Pasta temporaria: $TmpDir"
Write-Host ""

if (-not (Test-Path $Bundle)) {
    Write-Host "ERRO: bundle nao encontrado em $Bundle" -ForegroundColor Red
    exit 1
}

if (Test-Path $TmpDir) {
    Write-Host "Removendo pasta temporaria antiga..."
    Remove-Item -Recurse -Force $TmpDir
}

Write-Host "Clonando do bundle local..."
git clone $Bundle $TmpDir
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERRO no clone do bundle" -ForegroundColor Red
    exit 1
}

Set-Location $TmpDir

$ghAvailable = $null -ne (Get-Command gh -ErrorAction SilentlyContinue)

if ($ghAvailable) {
    Write-Host ""
    Write-Host "GitHub CLI detectado. Criando repositorio PRIVADO..."

    gh auth status 2>$null
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Faca login no GitHub:"
        gh auth login
    }

    gh repo create $RepoFull --private --source=. --push --remote=origin --description "Simulador de Premiacao ADS Software"
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Repo talvez ja exista. Tentando push..."
        git remote add origin "https://github.com/$RepoFull.git" 2>$null
        git push -u origin main
    }
} else {
    Write-Host ""
    Write-Host "GitHub CLI (gh) nao instalado." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "OPCAO A - Instalar gh CLI:"
    Write-Host "  https://cli.github.com/"
    Write-Host "  Depois rode este script de novo."
    Write-Host ""
    Write-Host "OPCAO B - Criar repo manual:"
    Write-Host "  1. Va em https://github.com/new"
    Write-Host "  2. Nome: $RepoName"
    Write-Host "  3. Marque Private"
    Write-Host "  4. NAO marque 'Add README'"
    Write-Host "  5. Create repository"
    Write-Host ""
    Read-Host "Pressione ENTER quando o repo estiver criado"

    git remote add origin "https://github.com/$RepoFull.git"
    Write-Host ""
    Write-Host "Fazendo push (vai pedir Personal Access Token como senha)"
    git push -u origin main
}

Write-Host ""
Write-Host "==========================================================="
Write-Host "  REPOSITORIO NO AR (privado)"
Write-Host "  https://github.com/$RepoFull"
Write-Host "==========================================================="
Write-Host ""
Write-Host "Pasta clonada local: $TmpDir"
