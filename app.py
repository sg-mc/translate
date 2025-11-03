import os
import whisper
from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from werkzeug.utils import secure_filename
import tempfile

app = Flask(__name__)
CORS(app)

# 設定
ALLOWED_EXTENSIONS = {'mp3', 'm4a', 'wav'}
MAX_FILE_SIZE = 100 * 1024 * 1024  # 100MB

# Whisperモデルをロード（起動時に1回だけ）
print("Whisperモデルをロード中...")
model = whisper.load_model("base")  # base, small, medium, large から選択可能
print("Whisperモデルのロード完了")

def allowed_file(filename):
    """ファイル拡張子のチェック"""
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def check_file_size(file):
    """ファイルサイズのチェック"""
    file.seek(0, os.SEEK_END)
    file_size = file.tell()
    file.seek(0)
    return file_size <= MAX_FILE_SIZE

@app.route('/')
def index():
    """メインページ"""
    return render_template('index.html')

@app.route('/transcribe', methods=['POST'])
def transcribe():
    """音声ファイルを文字起こしするエンドポイント"""
    try:
        # ファイルがアップロードされているかチェック
        if 'file' not in request.files:
            return jsonify({'error': 'ファイルがアップロードされていません'}), 400

        file = request.files['file']

        # ファイル名が空でないかチェック
        if file.filename == '':
            return jsonify({'error': 'ファイルが選択されていません'}), 400

        # ファイル形式のチェック
        if not allowed_file(file.filename):
            return jsonify({'error': f'許可されていないファイル形式です。対応形式: {", ".join(ALLOWED_EXTENSIONS)}'}), 400

        # ファイルサイズのチェック
        if not check_file_size(file):
            return jsonify({'error': f'ファイルサイズが大きすぎます。最大サイズ: 100MB'}), 400

        # 安全なファイル名を取得
        filename = secure_filename(file.filename)

        # 一時ファイルに保存
        with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(filename)[1]) as temp_file:
            file.save(temp_file.name)
            temp_path = temp_file.name

        try:
            # Whisperで文字起こし
            print(f"文字起こし処理を開始: {filename}")
            result = model.transcribe(temp_path, language='ja')  # 日本語として処理
            print(f"文字起こし処理完了: {filename}")

            # 結果を返す
            return jsonify({
                'success': True,
                'text': result['text'],
                'language': result.get('language', 'ja'),
                'filename': filename
            })

        finally:
            # 一時ファイルを削除
            if os.path.exists(temp_path):
                os.remove(temp_path)

    except Exception as e:
        print(f"エラーが発生しました: {str(e)}")
        return jsonify({'error': f'処理中にエラーが発生しました: {str(e)}'}), 500

@app.route('/health', methods=['GET'])
def health():
    """ヘルスチェックエンドポイント"""
    return jsonify({'status': 'ok'})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
