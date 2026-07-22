# Bastillion v5+ ships as a self-contained executable jar (embedded Jetty 11).
# Build the jar first (mvn package), then build this image — it only needs a JRE.
FROM eclipse-temurin:21-jre

LABEL org.opencontainers.image.title="Bastillion"
LABEL org.opencontainers.image.description="Web-based SSH console that centrally manages administrative access to systems with key management and two-factor authentication"
LABEL org.opencontainers.image.source="https://github.com/lusky3/Bastillion-Docker"
LABEL org.opencontainers.image.url="https://www.bastillion.io"
LABEL org.opencontainers.image.licenses="Prosperity-3.0.0"

# openssh-client: SSHUtil shells out to ssh-keygen to passphrase-encrypt generated
# ed25519 keys — without it, keys are silently written unencrypted.
# curl: used by container healthchecks.
# Acquire::Retries + timeouts: the Ubuntu apt mirrors intermittently time out on
# CI runners, which was failing the build outright; retry transient fetch errors.
RUN apt-get -o Acquire::Retries=5 -o Acquire::http::Timeout=30 update \
    && apt-get -o Acquire::Retries=5 -o Acquire::http::Timeout=30 install -y --no-install-recommends openssh-client curl \
    && rm -rf /var/lib/apt/lists/*

RUN groupadd -g 999 bastillion \
    && useradd -r -u 999 -g bastillion -d /opt/bastillion -s /usr/sbin/nologin bastillion \
    && mkdir -p /opt/bastillion/data \
    && chown -R bastillion:bastillion /opt/bastillion

COPY --chown=999:999 target/bastillion-*.jar /opt/bastillion/bastillion.jar
COPY --chown=999:999 --chmod=755 docker/entrypoint.sh /opt/bastillion/entrypoint.sh

USER bastillion

# Runtime state (H2 keydb, generated TLS keystore, BastillionConfig.properties)
# lands in the working directory — mount a volume here to persist it.
WORKDIR /opt/bastillion/data
VOLUME /opt/bastillion/data

# All BastillionConfig.properties settings can be overridden with environment
# variables using SCREAMING_SNAKE_CASE names (sshKeyType -> SSH_KEY_TYPE,
# dbPassword -> DB_PASSWORD, licenseKey -> LICENSE_KEY, ...).
# TLS is on by default with a self-signed certificate generated at first start;
# set KEYSTORE_PATH/KEYSTORE_PASSWORD for a real certificate, or TLS_ENABLED=false
# to serve plain HTTP (e.g. behind a reverse proxy).
ENV PORT=8443
EXPOSE 8443

ENTRYPOINT ["/opt/bastillion/entrypoint.sh"]
