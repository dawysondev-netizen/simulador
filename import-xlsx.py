#!/usr/bin/env python3
"""
import-xlsx.py — Extrai tabela de premiação do xlsx e gera JavaScript
ADS Software · Simulador de Premiação · Carteira

USO:
    pip install openpyxl pandas
    python import-xlsx.py

O script lê "Tabela de premiações  28042026.xlsx" na mesma pasta e
gera um bloco JavaScript pronto para colar em premiacao-rules.js.

COLUNAS ESPERADAS em Planilha1:
    A  → Desempenho  (valor de faturamento em R$)
    E  → Premio Cons (prêmio do consultor)
    H  → Premio Sup  (prêmio do supervisor)
    J  → Qualidade   (referência — já embutida nos valores das colunas E/H)
    K  → Qualidade S (referência — já embutida nos valores das colunas E/H)
"""

import pandas as pd
import re
import sys
from pathlib import Path

XLSX_FILE = "Tabela de premiações  28042026.xlsx"
SHEET     = "Planilha1"

# Índices de coluna (0-based): A=0, E=4, H=7, J=9, K=10
COL_DESEMPENHO  = 0
COL_PREMIO_CONS = 4
COL_PREMIO_SUP  = 7

FAT_MINIMO = 10_000  # linhas abaixo de R$ 10.000 são ignoradas


def is_numeric(v):
    """Retorna True se v é número válido (não NaN, não None, não string)."""
    try:
        f = float(v)
        return not (f != f)  # NaN check
    except (TypeError, ValueError):
        return False


def clean(v):
    """Converte para int, arredondando para baixo."""
    return int(float(v))


def main():
    xlsx_path = Path(XLSX_FILE)
    if not xlsx_path.exists():
        print(f"ERRO: arquivo não encontrado: {XLSX_FILE}", file=sys.stderr)
        print("Certifique-se de executar o script na mesma pasta do xlsx.", file=sys.stderr)
        sys.exit(1)

    df = pd.read_excel(xlsx_path, sheet_name=SHEET, header=None)
    print(f"Planilha carregada: {df.shape[0]} linhas × {df.shape[1]} colunas")

    linhas = []
    erros  = []

    for i, row in df.iterrows():
        desemp = row.iloc[COL_DESEMPENHO] if df.shape[1] > COL_DESEMPENHO else None
        pcons  = row.iloc[COL_PREMIO_CONS] if df.shape[1] > COL_PREMIO_CONS else None
        psup   = row.iloc[COL_PREMIO_SUP]  if df.shape[1] > COL_PREMIO_SUP  else None

        # Ignorar cabeçalhos e linhas sem dados numéricos
        if not is_numeric(desemp):
            continue

        fat = clean(desemp)

        # Ignorar desempenho = 1 (linha de cabeçalho numérico)
        if fat == 1:
            continue

        # Ignorar abaixo do mínimo
        if fat < FAT_MINIMO:
            continue

        if not is_numeric(pcons) or not is_numeric(psup):
            erros.append(f"  Linha {i+1}: desempenho={fat}, Premio Cons={pcons}, Premio Sup={psup} — ignorada (valor inválido)")
            continue

        linhas.append((fat, clean(pcons), clean(psup)))

    if erros:
        print("\n⚠️  Linhas ignoradas (valor inválido ou #REF!):")
        for e in erros:
            print(e)

    if not linhas:
        print("\nERRO: nenhuma linha válida encontrada. Verifique os índices de coluna.", file=sys.stderr)
        sys.exit(1)

    # Ordenar por faturamento ASC
    linhas.sort(key=lambda x: x[0])

    # Gerar JavaScript
    js_rows = []
    for fat, pcons, psup in linhas:
        js_rows.append(f"  [{fat:>7}, {pcons:>6}, {psup:>6}],")

    js_output = f"""// Gerado automaticamente por import-xlsx.py
// Fonte: {XLSX_FILE} · Planilha1
// Cols A (Desempenho), E (Premio Cons), H (Premio Sup)
// Total de faixas: {len(linhas)}

const TABELA_PREMIACAO = [
  // [desempenho, premioConsultor, premioSupervisor]
{chr(10).join(js_rows)}
];"""

    # Salvar em arquivo
    out_file = Path("tabela_premiacao_gerada.js")
    out_file.write_text(js_output, encoding="utf-8")

    print(f"\n✅ {len(linhas)} faixas exportadas → {out_file}")
    print("\nCOPIE o conteúdo abaixo e cole em premiacao-rules.js substituindo TABELA_PREMIACAO:\n")
    print("─" * 60)
    print(js_output)
    print("─" * 60)

    # Validar faixas esperadas
    fats = [l[0] for l in linhas]
    checks = [10000, 11000, 15000, 25000, 35000, 45000, 60000]
    print("\nValidação de faixas esperadas:")
    for f in checks:
        ok = f in fats
        print(f"  R$ {f:>7,} → {'✅ presente' if ok else '❌ AUSENTE'}")


if __name__ == "__main__":
    main()
