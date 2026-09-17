# ご縁ガール Webサイト - Netlify 公開手順

このフォルダはビルドや npm の実行が不要な静的サイトです。`index.html` が入ったこのフォルダ全体を Netlify にアップロードすることで、企業・店舗向けLPとファン会員ページの両方を公開できます。

## サイト構成
- `/` (`index.html`): 企業・店舗向けLP（メイン）
- `/portal/` (`portal/index.html`): ご縁ガール公式情報ポータル（ぽかログ風の巡礼ガイド・キャラ図鑑・パネル・グッズ・コラボ）
- `/join/` (`join/index.html`): ファン会員登録ランディングページ（LINE友だち登録・入会特典）
- `/member/` (`member/index.html`): 会員ダッシュボード（デジタル会員証・GPS/カメラチェックイン・スタンプ帳・限定ボイス・ポイント交換所）
- `/admin/` (`admin/index.html`): 運営管理コンソール（提携企業店舗管理CRUD、売上・サブスク台帳、決済状況、パネル・グッズ在庫管理）
- `/privacy.html`: プライバシーポリシー
- `/tokusho.html`: 特定商取引法に基づく表記
- `/thanks.html`: お問い合わせ送信完了画面



## 公開手順

1. [Netlify ダッシュボード](https://app.netlify.com/)へログインします。
2. **Add new site** → **Deploy manually** を選びます。
3. この `ご縁ガール-netlify` フォルダをドラッグ＆ドロップします。
4. 公開後、**Site settings** → **Forms** で `goen-bto-inquiry` の受信を確認します。
5. フォームを一度テスト送信し、`/thanks` の完了画面とNetlifyの受信内容を確認します。

## 公開前に確認・差し替えが必要な項目

- `index.html`: OG画像URL、canonical URL、GA4 ID、Microsoft Clarity ID
- `privacy.html`: 正式なプライバシーポリシー
- `tokusho.html`: 特定商取引法に基づく正式な表記

未確定の箇所は、捏造せず `<!-- {{ 要確認: ... }} -->` コメントとして残しています。
