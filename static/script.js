document.addEventListener('DOMContentLoaded', function() {
    // DOM要素の取得
    const uploadForm = document.getElementById('uploadForm');
    const audioFile = document.getElementById('audioFile');
    const fileLabel = document.querySelector('.file-label');
    const fileName = document.getElementById('fileName');
    const submitBtn = document.getElementById('submitBtn');

    const progressSection = document.getElementById('progressSection');
    const resultSection = document.getElementById('resultSection');
    const errorSection = document.getElementById('errorSection');

    const resultFilename = document.getElementById('resultFilename');
    const resultText = document.getElementById('resultText');
    const errorMessage = document.getElementById('errorMessage');

    const copyBtn = document.getElementById('copyBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const newTranscriptionBtn = document.getElementById('newTranscriptionBtn');
    const retryBtn = document.getElementById('retryBtn');

    // ファイル選択時の処理
    audioFile.addEventListener('change', function() {
        if (this.files && this.files[0]) {
            const file = this.files[0];
            fileName.textContent = file.name;
            fileLabel.classList.add('has-file');

            // ファイルサイズのチェック (100MB)
            const maxSize = 100 * 1024 * 1024;
            if (file.size > maxSize) {
                alert('ファイルサイズが大きすぎます。100MB以下のファイルを選択してください。');
                this.value = '';
                fileName.textContent = 'ファイルを選択';
                fileLabel.classList.remove('has-file');
            }
        }
    });

    // フォーム送信時の処理
    uploadForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const file = audioFile.files[0];
        if (!file) {
            alert('ファイルを選択してください。');
            return;
        }

        // UIの更新
        hideAllSections();
        progressSection.classList.remove('hidden');
        submitBtn.disabled = true;

        // FormDataの作成
        const formData = new FormData();
        formData.append('file', file);

        try {
            // APIリクエスト
            const response = await fetch('/transcribe', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (response.ok && data.success) {
                // 成功時の処理
                showResult(data);
            } else {
                // エラー時の処理
                showError(data.error || 'エラーが発生しました。');
            }
        } catch (error) {
            // ネットワークエラーなど
            showError('サーバーとの通信に失敗しました: ' + error.message);
        } finally {
            submitBtn.disabled = false;
        }
    });

    // 結果表示
    function showResult(data) {
        hideAllSections();
        resultSection.classList.remove('hidden');
        resultFilename.textContent = data.filename;
        resultText.value = data.text;
    }

    // エラー表示
    function showError(message) {
        hideAllSections();
        errorSection.classList.remove('hidden');
        errorMessage.textContent = message;
    }

    // すべてのセクションを非表示
    function hideAllSections() {
        progressSection.classList.add('hidden');
        resultSection.classList.add('hidden');
        errorSection.classList.add('hidden');
    }

    // テキストをコピー
    copyBtn.addEventListener('click', function() {
        resultText.select();
        document.execCommand('copy');

        const originalText = this.textContent;
        this.textContent = 'コピーしました！';
        setTimeout(() => {
            this.textContent = originalText;
        }, 2000);
    });

    // テキストをダウンロード
    downloadBtn.addEventListener('click', function() {
        const text = resultText.value;
        const filename = resultFilename.textContent.replace(/\.[^/.]+$/, '') + '.txt';

        const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });

    // 新しい文字起こし
    newTranscriptionBtn.addEventListener('click', function() {
        hideAllSections();
        uploadForm.reset();
        fileName.textContent = 'ファイルを選択';
        fileLabel.classList.remove('has-file');
    });

    // リトライ
    retryBtn.addEventListener('click', function() {
        hideAllSections();
    });
});
