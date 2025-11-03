# 音声文字起こしサービス

OpenAI Whisperを使用した音声ファイルの文字起こしWebサービスです。

## 機能

- 音声ファイルのアップロード
- 自動文字起こし（日本語対応）
- 文字起こし結果のコピー・ダウンロード
- レスポンシブデザイン

## 対応ファイル形式

- MP3
- M4A
- WAV

最大ファイルサイズ: 100MB

## 必要な環境

- Python 3.8以上
- pip

## インストール手順

### 1. リポジトリのクローン

```bash
git clone <リポジトリURL>
cd translate
```

### 2. 依存パッケージのインストール

```bash
pip install -r requirements.txt
```

注: OpenAI Whisperモデルは初回実行時に自動的にダウンロードされます。

### 3. アプリケーションの起動

```bash
python app.py
```

アプリケーションは `http://localhost:5000` で起動します。

## 使い方

1. ブラウザで `http://localhost:5000` にアクセス
2. 音声ファイル（MP3、M4A、WAV）を選択
3. 「文字起こしを開始」ボタンをクリック
4. 処理が完了すると、文字起こし結果が表示されます
5. 結果をコピーまたはテキストファイルとしてダウンロードできます

## プロジェクト構造

```
translate/
├── app.py              # Flaskアプリケーション本体
├── requirements.txt    # Python依存パッケージ
├── templates/
│   └── index.html     # メインページHTML
├── static/
│   ├── style.css      # スタイルシート
│   └── script.js      # JavaScriptファイル
└── README.md          # このファイル
```

## 技術スタック

- **バックエンド**: Flask, OpenAI Whisper
- **フロントエンド**: HTML, CSS, JavaScript
- **文字起こしモデル**: Whisper (base model)

## Whisperモデルについて

デフォルトでは `base` モデルを使用していますが、`app.py` の以下の行を変更することで、より高精度なモデルを使用できます：

```python
model = whisper.load_model("base")  # tiny, small, medium, large から選択可能
```

- `tiny`: 最速だが精度は低い
- `base`: バランスが良い（デフォルト）
- `small`: より高精度
- `medium`: さらに高精度
- `large`: 最高精度だが処理が遅い

## ライセンス

MIT License

## 注意事項

- 処理時間はファイルサイズとモデルサイズに依存します
- 初回実行時はWhisperモデルのダウンロードに時間がかかります
- 大きなファイルや高精度モデルを使用する場合は、十分なメモリとCPU/GPUリソースが必要です
