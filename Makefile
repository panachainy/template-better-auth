b build:
	docker build . -t template-better-auth:latest

f format:
	bun check:fix
