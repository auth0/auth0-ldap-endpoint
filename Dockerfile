FROM mhart/alpine-node:base-6

WORKDIR /src
ADD . .

EXPOSE 1389
CMD ["node", "index"]