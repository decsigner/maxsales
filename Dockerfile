FROM debian:bullseye as builder

ARG NODE_VERSION=18.12.1
ARG YARN_VERSION=1.22.19

# Debian 11 (bullseye) foi movido para archive.debian.org
RUN sed -i 's|deb.debian.org|archive.debian.org|g' /etc/apt/sources.list && \
    echo 'Acquire::Check-Valid-Until "false";' > /etc/apt/apt.conf.d/99archive
RUN apt-get update; apt install -y curl python-is-python3 pkg-config build-essential
RUN curl https://get.volta.sh | bash
ENV VOLTA_HOME /root/.volta
ENV PATH /root/.volta/bin:$PATH
RUN volta install node@${NODE_VERSION} yarn@${YARN_VERSION}

#######################################################################

RUN mkdir /app
WORKDIR /app

# Yarn will not install any package listed in "devDependencies" when NODE_ENV is set to "production"
# to install all modules: "yarn install --production=false"
# Ref: https://classic.yarnpkg.com/lang/en/docs/cli/install/#toc-yarn-install-production-true-false

ENV NODE_ENV production

COPY . .

RUN yarn install --production=false
FROM debian:bullseye

LABEL fly_launch_runtime="nodejs"

COPY --from=builder /root/.volta /root/.volta
COPY --from=builder /app /app

WORKDIR /app
ENV NODE_ENV production
ENV PATH /root/.volta/bin:$PATH

# /app/tmp e um volume do Fly (uploads permanentes). As imagens do repo ficam
# em /app/tmp-seed e sao copiadas para o volume no start, sem sobrescrever.
RUN cp -r /app/tmp /app/tmp-seed

CMD [ "yarn", "run", "start" ]
