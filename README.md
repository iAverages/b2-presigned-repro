
## Commands

```bash 

# Login with master key
b2 account authorize

# Create bucket
b2 bucket create dan-presigned-error-private allPrivate
b2 bucket create dan-presigned-error-public allPublic

# Create keys
b2 key create --bucket dan-presigned-error-public dan-presigned-error-public deleteFiles,listAllBucketNames,listBuckets,listFiles,readBucketEncryption,readBucketReplications,readBuckets,readFiles,shareFiles,writeBucketEncryption,writeBucketNotifications,writeBucketReplications,writeFiles

# Add CORS rules to buckets
b2 bucket update --cors-rules "$(<./cors-rules.json)" dan-presigned-error-private
b2 bucket update --cors-rules "$(<./cors-rules.json)" dan-presigned-error-public
```
