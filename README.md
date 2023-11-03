# ラクマネイングリッシュ
本アプリは、英単語の暗記に特化した学習管理アプリです。  

昨今、グローバル化が進んでいるため、海外とのやりとりや海外の資料を参照する機会が増えています。  
グローバル化が進む現代では、英語の会話力や読解力等が求められます。  

英語学習の第一歩として英単語の暗記から始めますが、なかなか覚えられないことが多いでしょう。  
このアプリは、ユーザーが覚えた単語とそうでない単語を自動で分ける機能があるため、効率よく学習を進めることができます。

# アプリURL
http://e-rakumane.com

# 使用技術
当アプリの実装に利用した技術は以下の通りです。

## クライアントサイド
- React（v18.2.0）
- TypeScript（v5.1.6）
- Next.js（v13.4.10）
- Material UI（v5.14.1）

## サーバーサイド 
- TypeScript（v5.1.6）
- Node.js（v16.19.1）

## データベース
- MySQL（v5.7.39）

## AWS
- VPC
- EC2
- RDS
- Route53

アーキテクチャ図は以下の通りです。  
ポートフォリオを目的としたアプリのため、シンプルなネットワーク構成にしました。  
(画像を貼る)

## その他
- Webサーバ：Apache（v2.4.57）

# 環境構築　〜　ローカル実行方法
以下の手順で実行します。
1. git cloneでローカルにソースコードをダウンロードする
2. clientディレクトリとapiディレクトリにcdコマンドで移動
3. 2の各ディレクトリでnpm install（もしくはyarn add）を実行
4. apiディレクトリに.envファイルを作成し、「DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/DATABASE"」を貼り付ける
5. 4のUSER、PASSWORD、HOST、PORT、DATABASEを適切な形に修正（PORTは3306、DATABASEはrakumane）
6. .envファイルにSECRET_KEY="(任意の文字列)"を入力
7. MySQLとWebサーバーを起動する
8. 2の各ディレクトリでnpm run devを実行
9. clientディレクトリで実行すると、http://localhost:3000 が表示されるのでアクセスする

# ターゲット
このアプリのターゲットは以下を想定しています。
- 英語学習が苦手な人
- 学習管理が苦手な人
- 解答はキーボードで入力したい人
- 手書きよりもPCやスマホなどのデジタル端末を使いたい人

# アプリ機能一覧
本アプリで実装した機能は以下の通りです。
- ユーザー登録/退会
- ログイン/ログアウト
- 単語の登録/編集/削除
- 単語検索
- 学習忘れの検知
- 1日ごとに取り組む単語の登録（バッチ処理）
- 結果表示
- カウントダウン
- 自由に単語学習ができるフリーモード
- ユーザー名、パスワード、単語数、カウントダウンの設定

以上の中で説明が必要な機能を以下に追記します。

## 単語検索
単語を検索するときは、以下の検索方法があります。
- 単語番号
- 英単語
- 苦手度

### 単語番号
単語番号は、単語を登録する際に自動的に連続で振られる番号です。
単語帳の英単語は番号順であることが多く、番号順で登録することで検索がしやすいです。  

### 英単語
英単語は、検索したい英単語をそのまま入力したり、一部のアルファベットを入力すると検索できます。
例えば、一部しか思い出せない場合も入力することで、検索したい単語を表示することが可能です。  

### 苦手度
苦手度は、単語の正答率と結びついています。「苦手」「まあまあ」「得意」の3段階で、基準は以下です。
- 苦手：0% ~ 59%
- まあまあ：60% ~ 89%
- 得意：90% ~ 100%

各段階にある単語をすぐに調べることができ、どの単語が苦手かを分ける手間がありません。

## 学習忘れの検知
本アプリは1日ごとに取り組む単語(以下、毎日の単語)を用意しています。  

もし、その単語に取り組み忘れたり、全単語の正解が翌0時までにできない場合は正解数と出題回数をリセットします。  
リセットされると苦手な単語に分類され、毎日の単語に出題される可能性が高まります。  

これにより、実際は暗記できていないのにアプリ上では暗記できている扱いになることを防ぐことが可能です。

## 1日ごとに取り組む単語の登録（バッチ処理）
毎日の単語を登録するために、深夜にバッチ処理があります。  

処理内容は、単語の未学習や苦手度などを考慮して自動で登録される仕組みです。  
そのため、得意な単語が毎日の単語に登録される可能性が低く、苦手または未学習の単語を優先しています。

## 自由に単語学習ができるフリーモード
より多くの単語を学習したい人向けにフリーモードを実装しました。  

単語を検索し、出題登録した単語が出題されます。  
ここで取り組んだ記録は毎日の単語の登録でも考慮されるので、精度が高い判定が可能です。

# 今後の実装予定機能
実装したい機能は以下の通りです。
- SSL化
- パスワード再設定機能
- 他サービスアカウントでの認証機能
- LINEで学習通知する機能
- 英語音声の登録
- カレンダーに予定を追加する機能