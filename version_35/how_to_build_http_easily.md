# HTTPサーバーでの動作確認方法

このページをHTTPサーバーで動作確認したい場合の手段をいくつか紹介します。

## Python（最も簡単）
```bash
# Python 3の場合
python3 -m http.server 8000

# Python 2の場合
python -m SimpleHTTPServer 8000
```

## Node.js
```bash
# グローバルインストール
npm install -g http-server
http-server -p 8000

# またはnpxで一時実行
npx http-server -p 8000
```

## PHP
```bash
php -S localhost:8000
```

## Live Server（VS Code拡張）
VS Codeの「Live Server」拡張をインストールしてHTMLファイルを右クリック→「Open with Live Server」

## どの方法でも：
1. コマンドを実行後、ブラウザで `http://localhost:8000` にアクセス
2. `index.html` をクリックしてページを表示

**注意**: imagesフォルダが `../images/` にあるので、サーバーは `/home/heresynth/contents/ripple/` ディレクトリから起動してください。

Python方式が最も手軽でおすすめです。