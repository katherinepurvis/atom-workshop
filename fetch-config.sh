#!/usr/bin/env bash

region="eu-west-1"

mkdir -p ~/.configuration-magic/
aws s3 cp s3://guconf-flexible/atom-workshop/atom-workshop.conf ~/.configuration-magic/atom-workshop.conf --profile composer --region $region
