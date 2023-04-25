# .env: https://www.robg3d.com/2020/05/2288/
ifneq (,$(wildcard ./.env))
    include .env
    export
endif

.PHONY: deploy
deploy:
	sam deploy \
		--capabilities CAPABILITY_IAM \
		--parameter-overrides \
			Bucket=$(BUCKET) \
			Key=$(KEY) \
		--resolve-s3 \
		--stack-name $(STACK) \
		--template-file template.yaml \
		--

.PHONY: local
local:
	sam local start-api \
		--parameter-overrides \
			Bucket=$(BUCKET) \
			Key=$(KEY) \
		--
