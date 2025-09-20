FROM mysql:8.4.3

# カスタム設定ファイルをコピー
COPY my.cnf /etc/mysql/conf.d/my.cnf

# 初期化スクリプト用のディレクトリを作成
RUN mkdir -p /docker-entrypoint-initdb.d

# 必要に応じて初期化スクリプトをコピー
# COPY init.sql /docker-entrypoint-initdb.d/

# ポート3306を公開
EXPOSE 3306

# MySQL 8.4以降のデフォルトコマンド
CMD ["mysqld"]