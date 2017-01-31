.PHONY: all
all: image build

build:
	docker-compose build

run: all
	docker-compose up -d

DOCKER_ORGANISATION:=creatordev
DOCKER_SHELL:=bash
CONTAINER_NAME:=ewdemo-webapp
DOCKER_BUILDARG_BUILDDATE:=

include docker.mk