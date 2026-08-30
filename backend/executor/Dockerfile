# emendator-executor — dedicated sandbox for untrusted LeetCode submissions.
# Contains ONLY the language runtimes required by the backend and a strict
# non-root runtime configuration. Intended to be launched per-run by the
# backend via `docker run` with a hardened isolation flag set.
FROM node:18-alpine

# Language runtimes required by execution.service.js: Java, Node, Python, C++.
RUN apk add --no-cache \
        openjdk17-jdk \
        python3 \
        py3-pip \
        g++ \
        make

# Dedicated unprivileged user for executing untrusted code.
RUN addgroup -S exec && adduser -S -G exec exec \
    && mkdir -p /workspace && chown exec:exec /workspace

WORKDIR /workspace
USER exec

# Minimal sanitized environment only (no application secrets reachable).
ENV PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin \
    TZ=UTC

# Runtimes must resolve for the configured languages.
# NOTE: the authoritative runtime check is performed at build/runtime inside
# an actual container (see Phase 36 verification); a compile-time placeholder
# command keeps the image self-consistent.
CMD ["sh", "-c", "echo 'emendator-executor ready'; test -x /usr/bin/java && test -x /usr/bin/node && test -x /usr/bin/python3 && test -x /usr/bin/g++ && echo 'runtimes ok' || exit 1"]
