import os
import json

base_dir = r"c:\Users\Ganesh Nair\OneDrive\Desktop\agentic_ops"
incidents_dir = os.path.join(base_dir, "rag", "data", "incidents")
runbooks_dir = os.path.join(base_dir, "rag", "data", "runbooks")

os.makedirs(incidents_dir, exist_ok=True)
os.makedirs(runbooks_dir, exist_ok=True)

# 20 Incidents
incidents = [
    # 1. K8s Pod CrashLoop
    {
        "filename": "INC-2026-001_k8s_pod_crashloop.json",
        "data": {
            "incident_id": "INC-2026-001",
            "title": "Auth Service pod stuck in CrashLoopBackOff due to missing environment variable secret",
            "severity": "P1",
            "affected_service": "auth-service",
            "symptoms": [
                "HTTP 500 internal server errors on /v1/auth/login and /v1/auth/verify endpoints",
                "Kubernetes deployment auth-service shows 0/5 ready replicas",
                "Pod status reported as CrashLoopBackOff in namespace production",
                "Alertmanager notification: AuthServiceDegraded"
            ],
            "root_cause": "The auth-service pod failed initialization because JWT_SECRET_KEY environment variable failed to mount from Secret 'auth-jwt-secrets', which was rotated with a mismatched key name.",
            "resolution": "Updated the Secret key mapping in Deployment manifest to match 'jwt-signing-key' and triggered a rolling update via kubectl rollout restart deployment/auth-service.",
            "tags": ["kubernetes", "crashloopbackoff", "pod-failure", "deployment", "auth-service"],
            "timestamp": "2026-08-01T08:15:00Z"
        }
    },
    # 2. K8s OOMKilled
    {
        "filename": "INC-2026-002_k8s_oomkilled_pod.json",
        "data": {
            "incident_id": "INC-2026-002",
            "title": "Search Indexer pod OOMKilled under high batch indexing payload load",
            "severity": "P2",
            "affected_service": "search-indexer",
            "symptoms": [
                "Pod terminated with Exit Code 137 (OOMKilled)",
                "Search indexing job queue backlog spiked to 45,000 pending items",
                "Prometheus alert: ContainerMemoryUsageNearLimit triggered for search-indexer namespace production"
            ],
            "root_cause": "Search indexer worker attempted to buffer 2GB bulk product catalogue update entirely in memory without pagination, exceeding the container memory limit of 1.5Gi.",
            "resolution": "Increased container memory limit to 4Gi in pod resource requests/limits and refactored batch stream chunking size from 10,000 to 500 items.",
            "tags": ["kubernetes", "crashloopbackoff", "pod-failure", "oomkilled", "search-indexer"],
            "timestamp": "2026-08-01T11:30:00Z"
        }
    },
    # 3. DB Conn Pool Exhaustion
    {
        "filename": "INC-2026-003_postgres_conn_pool_exhaustion.json",
        "data": {
            "incident_id": "INC-2026-003",
            "title": "User Profile API failing with PostgreSQL connection pool exhaustion",
            "severity": "P1",
            "affected_service": "user-profile-api",
            "symptoms": [
                "HTTP 503 Service Unavailable across all profile endpoints",
                "Application log error: 'FATAL: sorry, too many clients already' from PostgreSQL",
                "PgBouncer client waiting queue reached max limit of 1000 active clients",
                "Grafana metric pg_stat_activity active connections saturated at 200/200 max pool size"
            ],
            "root_cause": "A rogue async background worker leak held DB connections open indefinitely without releasing them back to PgBouncer due to an unhandled exception block in user audit log writer.",
            "resolution": "Terminated idle orphan connections in PostgreSQL via pg_terminate_backend(), deployed hotfix patching try-finally connection cleanup in audit worker, and increased PgBouncer default pool size.",
            "tags": ["postgresql", "database", "connection-pool", "pgbouncer", "user-profile-api"],
            "timestamp": "2026-08-01T14:45:00Z"
        }
    },
    # 4. DB Read Replica Lag
    {
        "filename": "INC-2026-004_postgres_read_replica_lag.json",
        "data": {
            "incident_id": "INC-2026-004",
            "title": "Analytics Dashboard serving stale data due to PostgreSQL read replica replication lag",
            "severity": "P3",
            "affected_service": "analytics-worker",
            "symptoms": [
                "Dashboard reports lagging behind live transactional data by up to 45 minutes",
                "Prometheus metric pg_replication_lag_bytes exceeded 12GB",
                "Read replica CPU utilization pinned at 100% on node db-replica-02"
            ],
            "root_cause": "A heavy analytical vacuum/reindex query was executed directly on the primary DB, producing massive write-ahead log (WAL) streams that choked replica network bandwidth.",
            "resolution": "Canceled long-running maintenance queries on primary, tuned max_standby_streaming_delay on replica, and allocated dedicated WAL network bandwidth.",
            "tags": ["postgresql", "database", "read-replica", "replication-lag", "analytics-worker"],
            "timestamp": "2026-08-02T02:10:00Z"
        }
    },
    # 5. API Gateway 504 Timeout
    {
        "filename": "INC-2026-005_api_gateway_504_timeout.json",
        "data": {
            "incident_id": "INC-2026-005",
            "title": "Checkout Gateway API returning 504 Gateway Timeout during peak traffic surge",
            "severity": "P1",
            "affected_service": "checkout-gateway",
            "symptoms": [
                "HTTP 504 Gateway Timeout response rate reached 34% on /v2/checkout/process",
                "Upstream Envoy proxy logs: 'upstream request timeout after 15000ms'",
                "Customer cart checkout conversions dropped by 60%"
            ],
            "root_cause": "The backend payment fraud evaluation microservice was synchronously calling a degraded 3rd-party anti-fraud vendor without an explicit circuit breaker timeout, blocking gateway worker threads.",
            "resolution": "Enabled resilience4j circuit breaker on external vendor call with 1.5s fallback, allowing checkout orders to process under soft risk scoring.",
            "tags": ["api-gateway", "http-504", "timeout", "ingress", "checkout-gateway"],
            "timestamp": "2026-08-02T09:20:00Z"
        }
    },
    # 6. Redis Maxmemory Eviction
    {
        "filename": "INC-2026-006_redis_maxmemory_eviction.json",
        "data": {
            "incident_id": "INC-2026-006",
            "title": "Session store cache collapse caused by Redis maxmemory eviction misconfiguration",
            "severity": "P1",
            "affected_service": "session-store",
            "symptoms": [
                "Mass user logout events reported across web app and mobile clients",
                "Redis memory usage reached 100% of allocated 16GB limit",
                "Redis latency elevated to 800ms due to key eviction processing overhead",
                "Cache hit ratio dropped from 98% to 12%"
            ],
            "root_cause": "Redis eviction policy was set to `noeviction` instead of `allkeys-lru`. When memory hit maxmemory, write commands to create new session keys threw `OOM command not allowed` errors.",
            "resolution": "Updated Redis `maxmemory-policy` configuration live via `CONFIG SET maxmemory-policy allkeys-lru`, updated redis.conf, and scaled cluster instance memory to 32GB.",
            "tags": ["redis", "cache", "memory-exhaustion", "eviction-policy", "session-store"],
            "timestamp": "2026-08-02T13:00:00Z"
        }
    },
    # 7. Redis Single Thread Blocking Keyscan
    {
        "filename": "INC-2026-007_redis_latency_keyscan.json",
        "data": {
            "incident_id": "INC-2026-007",
            "title": "Recommendation cache response latency spike caused by unindexed KEYS pattern scan",
            "severity": "P2",
            "affected_service": "recommendation-cache",
            "symptoms": [
                "Recommendation service p99 latency spiked to 3200ms",
                "Redis slowlog recorded single command execution duration of 2.8 seconds",
                "High CPU usage on single core of Redis master node"
            ],
            "root_cause": "A newly deployed cron job executed `KEYS user:rec:*` against a production Redis cluster with 15 million keys, blocking single-threaded event loop execution.",
            "resolution": "Killed the rogue SCAN script process, patched the cron job to use non-blocking cursor-based `SCAN` with batching, and added command rename rule in redis.conf for `KEYS`.",
            "tags": ["redis", "cache", "latency-spike", "single-thread-blocking", "recommendation-cache"],
            "timestamp": "2026-08-02T18:40:00Z"
        }
    },
    # 8. VPC Peering Network Partition
    {
        "filename": "INC-2026-008_vpc_peering_route_drop.json",
        "data": {
            "incident_id": "INC-2026-008",
            "title": "Payment Processor unable to connect to Banking Core due to VPC Peering route deletion",
            "severity": "P1",
            "affected_service": "payment-processor",
            "symptoms": [
                "Connection timeout exceptions (No route to host / EHOSTUNREACH) from payment-processor to 10.200.0.0/16 subnet",
                "All credit card processing batch requests failing instantly",
                "CloudWatch NetworkPacketsDrop metric elevated across VPC peering connection pcx-0a1b2c3d"
            ],
            "root_cause": "An automated Terraform apply script accidentally deleted the VPC Peering route entry in production subnet route table rt-prod-private-a during an infrastructure refactoring.",
            "resolution": "Restored missing route rule in route table targeting `pcx-0a1b2c3d` and added a terraform lifecycle lock rule on VPC peering route attachments.",
            "tags": ["networking", "vpc-peering", "route-table", "network-partition", "payment-processor"],
            "timestamp": "2026-08-03T04:15:00Z"
        }
    },
    # 9. Failed Canary Rollout
    {
        "filename": "INC-2026-009_canary_deployment_failure.json",
        "data": {
            "incident_id": "INC-2026-009",
            "title": "Notification Service deployment failed canary metrics analysis during version v2.4.0 rollout",
            "severity": "P2",
            "affected_service": "notification-service",
            "symptoms": [
                "Canary pod error rate spiked to 14.5% compared to baseline 0.1%",
                "Argo Rollouts automated analysis failed phase 2 validation",
                "Push notifications for transactional SMS queued without dispatching"
            ],
            "root_cause": "Version v2.4.0 included an updated notification template engine that failed to parse legacy message JSON schemas missing the `locale` property.",
            "resolution": "Argo Rollouts automatically initiated canary rollback to v2.3.9. Hotfix committed to provide default fallback locale for legacy payloads before re-deploying.",
            "tags": ["deployments", "canary-rollout", "argo-rollouts", "helm", "notification-service"],
            "timestamp": "2026-08-03T10:50:00Z"
        }
    },
    # 10. Vault Token Expiry
    {
        "filename": "INC-2026-010_vault_token_expiry_auth_drop.json",
        "data": {
            "incident_id": "INC-2026-010",
            "title": "Identity Provider authentication tokens rejecting requests following HashiCorp Vault token expiration",
            "severity": "P1",
            "affected_service": "identity-provider",
            "symptoms": [
                "Identity provider logs flooded with 'Permission Denied: Vault token expired'",
                "OAuth2 authorization code flow failing for all external API consumers",
                "Prometheus alert: VaultAuthTokenExpirationTriggered active"
            ],
            "root_cause": "The HashiCorp Vault authentication sidecar daemon failed to renew its periodic client token due to a background renewal lease renewal retry bug in vault-agent v1.12.",
            "resolution": "Manually re-authenticated vault-agent using Kubernetes auth method, restarted identity-provider pods, and upgraded vault-agent sidecar to v1.14.",
            "tags": ["authentication", "jwt", "hashicorp-vault", "token-expired", "identity-provider"],
            "timestamp": "2026-08-03T16:05:00Z"
        }
    },
    # 11. PVC Storage Pending
    {
        "filename": "INC-2026-011_pvc_pending_storage_provision.json",
        "data": {
            "incident_id": "INC-2026-011",
            "title": "Order Fulfillment DB replica pod stuck in Pending state due to PVC volume allocation failure",
            "severity": "P2",
            "affected_service": "order-fulfillment-db",
            "symptoms": [
                "Pod order-fulfillment-db-replica-2 stuck in `Pending` phase for > 30 minutes",
                "kubectl describe pod event: '0/12 nodes available: 12 VolumeBindingWaiting'",
                "EBS CSI driver logs: 'Failed to provision volume: VolumeLimitExceeded on AWS zone us-east-1a'"
            ],
            "root_cause": "AWS EC2 instance volume attachment limit (28 EBS volumes per node) reached on target Kubernetes worker node, preventing EBS CSI provisioner from mounting new PVC.",
            "resolution": "Cordoned and drained affected node to re-balance pod distribution across worker pool, and updated storage provisioner settings to use Nitro instance types with higher EBS attachment limits.",
            "tags": ["storage", "pvc", "ebs", "disk-full", "order-fulfillment-db"],
            "timestamp": "2026-08-03T21:30:00Z"
        }
    },
    # 12. Disk Space 100% Full
    {
        "filename": "INC-2026-012_disk_space_100_percent_full.json",
        "data": {
            "incident_id": "INC-2026-012",
            "title": "Log Aggregator node filesystem 100% full due to unrotated container debug stdout logs",
            "severity": "P2",
            "affected_service": "log-aggregator",
            "symptoms": [
                "Kubelet reporting NodeDiskPressure on node k8s-worker-08",
                "Containers evicted rapidly across namespace logging",
                "Syslog error: 'No space left on device' writing to /var/log/pods"
            ],
            "root_cause": "A debug log verbosity level enabled on the ingester service generated 120GB of uncompressed JSON logs in 4 hours, bypassing Docker/CRI-O container log rotation limits.",
            "resolution": "Truncated oversized log files in `/var/log/pods`, adjusted logrotate container configuration max size to 50MB, and reset ingester verbosity level to INFO.",
            "tags": ["storage", "pvc", "disk-full", "filesystem", "log-aggregator"],
            "timestamp": "2026-08-04T01:15:00Z"
        }
    },
    # 13. CoreDNS Upstream Timeout
    {
        "filename": "INC-2026-013_coredns_upstream_timeout.json",
        "data": {
            "incident_id": "INC-2026-013",
            "title": "Inventory API cross-service communication dropping due to CoreDNS upstream resolver failure",
            "severity": "P1",
            "affected_service": "inventory-api",
            "symptoms": [
                "DNS lookup timeout errors (`i/o timeout resolving inventory-db.internal`)",
                "High latency spikes across all internal microservice gRPC calls",
                "CoreDNS pod metrics reporting 50% dropped UDP queries"
            ],
            "root_cause": "CoreDNS pods were overloaded due to single-threaded IP lookup bottlenecks combined with an upstream cloud DNS resolver rate-limit throttling policy.",
            "resolution": "Scaled CoreDNS deployment replicas from 2 to 10, enabled autopath plugin, and enabled local NodeLocal DNSCache daemonset across worker nodes.",
            "tags": ["dns", "coredns", "name-resolution", "kube-dns", "inventory-api"],
            "timestamp": "2026-08-04T06:00:00Z"
        }
    },
    # 14. Prometheus TSDB Corruption
    {
        "filename": "INC-2026-014_prometheus_tsdb_corruption.json",
        "data": {
            "incident_id": "INC-2026-014",
            "title": "Prometheus Monitoring instance failing to start due to TSDB WAL corruption after unclean shutdown",
            "severity": "P2",
            "affected_service": "monitoring-prometheus",
            "symptoms": [
                "Prometheus pod crashlooping with log: 'err=\"opening storage failed: corrupt WAL segment\"'",
                "Grafana dashboards empty, all SRE alert notifications silent",
                "Alertmanager DeadManSwitch failing to receive heartbeat"
            ],
            "root_cause": "Unexpected node hardware power interruption caused incomplete chunk writes to the Prometheus Time Series Database Write-Ahead Log (WAL).",
            "resolution": "Removed corrupted WAL segment files in `/prometheus/data/wal/`, restarted Prometheus pod to rebuild WAL index, and restored backup metrics data.",
            "tags": ["monitoring", "prometheus", "tsdb", "alertmanager", "monitoring-prometheus"],
            "timestamp": "2026-08-04T09:45:00Z"
        }
    },
    # 15. Vector Log Pipeline Backpressure
    {
        "filename": "INC-2026-015_vector_log_pipeline_backpressure.json",
        "data": {
            "incident_id": "INC-2026-015",
            "title": "Telemetry Pipeline log buffer overflow under heavy log emission rate",
            "severity": "P3",
            "affected_service": "telemetry-pipeline",
            "symptoms": [
                "Vector agent memory usage exceeding 90% allocation limit",
                "Log ingestion delay spiked to 25 minutes in Elasticsearch / Kibana",
                "Fluentbit buffer files filling disk `/var/log/buffer/`"
            ],
            "root_cause": "Elasticsearch cluster indexing queue was throttled due to high bulk request payload sizes, propagating backpressure down to Vector collector instances.",
            "resolution": "Increased Elasticsearch bulk queue capacity, added disk-backed buffer persistence in Vector config, and horizontally scaled Elasticsearch ingester nodes.",
            "tags": ["monitoring", "logging", "fluentbit", "vector-backpressure", "telemetry-pipeline"],
            "timestamp": "2026-08-04T13:20:00Z"
        }
    },
    # 16. DB Transaction Deadlock Cascade
    {
        "filename": "INC-2026-016_db_transaction_deadlock_cascade.json",
        "data": {
            "incident_id": "INC-2026-016",
            "title": "Billing Service processing queue halted due to PostgreSQL transaction deadlock cascade",
            "severity": "P1",
            "affected_service": "billing-service",
            "symptoms": [
                "PostgreSQL logs flooded with `ERROR: deadlock detected`",
                "Billing queue worker thread pool 100% blocked waiting for row locks",
                "Payment invoice generation latency infinite / timed out"
            ],
            "root_cause": "Two concurrent background processes updated tables `invoices` and `account_balances` in reverse lock order within non-atomic explicit transactions.",
            "resolution": "Killed deadlocked backends using `pg_cancel_backend()`, enforced deterministic lock ordering (sort by account ID first) in code codebase, and set `deadlock_timeout = 1s`.",
            "tags": ["postgresql", "database", "deadlock", "transaction-lock", "billing-service"],
            "timestamp": "2026-08-04T17:10:00Z"
        }
    },
    # 17. Envoy Rate Limit Misconfig
    {
        "filename": "INC-2026-017_envoy_rate_limit_misconfig.json",
        "data": {
            "incident_id": "INC-2026-017",
            "title": "Public API Gateway rejecting legitimate traffic with HTTP 429 Too Many Requests",
            "severity": "P2",
            "affected_service": "public-api-gateway",
            "symptoms": [
                "Legitimate API clients receiving HTTP 429 Too Many Requests on valid API key queries",
                "Envoy rate limit filter metric `ratelimit.over_limit` spiking",
                "Customer support tickets reporting false rate limit blocks"
            ],
            "root_cause": "Envoy global rate limit service configuration applied client IP rate limits to X-Forwarded-For headers behind Cloudflare proxy without parsing trusted proxies, lumping all users under one single IP.",
            "resolution": "Updated Envoy `use_remote_address` configuration to trust Cloudflare CIDR ranges and extract true client IP header for bucket partitioning.",
            "tags": ["api-gateway", "rate-limit", "envoy", "cascading-failure", "public-api-gateway"],
            "timestamp": "2026-08-04T20:30:00Z"
        }
    },
    # 18. EBS GP2 IOPS Exhaustion
    {
        "filename": "INC-2026-018_ebs_gp2_iops_exhaustion.json",
        "data": {
            "incident_id": "INC-2026-018",
            "title": "Elasticsearch cluster node slow indexing due to AWS EBS gp2 burst balance exhaustion",
            "severity": "P2",
            "affected_service": "elastic-search-node",
            "symptoms": [
                "Disk I/O await latency jumped from 2ms to 450ms on node es-data-04",
                "Elasticsearch cluster health status degraded from GREEN to YELLOW",
                "AWS CloudWatch metric `BurstBalance` reached 0%"
            ],
            "root_cause": "Elasticsearch data node was provisioned on legacy gp2 EBS volume of 100GB, which ran out of IOPS credit balance under continuous high-volume indexing.",
            "resolution": "Migrated AWS EBS volume type live from `gp2` to `gp3` with provisioned baseline 3000 IOPS and 125 MB/s throughput without unmounting.",
            "tags": ["storage", "ebs", "iops-throttling", "volume-performance", "elastic-search-node"],
            "timestamp": "2026-08-04T22:50:00Z"
        }
    },
    # 19. AWS IAM STS Assume Role Drift
    {
        "filename": "INC-2026-019_aws_iam_sts_assume_role_drift.json",
        "data": {
            "incident_id": "INC-2026-019",
            "title": "S3 Exporter Service failing with AccessDenied calling AWS STS AssumeRoleWithWebIdentity",
            "severity": "P2",
            "affected_service": "s3-exporter-service",
            "symptoms": [
                "Application log error: 'AccessDenied: Not authorized to perform sts:AssumeRoleWithWebIdentity'",
                "S3 backup exports failed to upload for 6 consecutive scheduled runs",
                "Kubelet service account token projected volume updated"
            ],
            "root_cause": "The IAM OIDC provider trust policy for the service account lacked updated audience string when cluster OIDC endpoint was recreated.",
            "resolution": "Updated AWS IAM Role trust relationship JSON policy to include correct `sts.amazonaws.com` audience and service account namespace binding.",
            "tags": ["authentication", "iam", "aws-sts", "permission-denied", "s3-exporter-service"],
            "timestamp": "2026-08-05T00:10:00Z"
        }
    },
    # 20. External DNS TTL Drift
    {
        "filename": "INC-2026-020_external_dns_ttl_drift.json",
        "data": {
            "incident_id": "INC-2026-020",
            "title": "Customer Portal domain resolving to obsolete IP address due to ExternalDNS TTL caching drift",
            "severity": "P3",
            "affected_service": "customer-portal-dns",
            "symptoms": [
                "Subset of global users routed to decommissioned legacy load balancer IP",
                "TLS handshake errors: SSL certificate mismatch for stale IP address",
                "ExternalDNS controller failed sync cycle logs"
            ],
            "root_cause": "ExternalDNS record TTL was set to 86400 (24 hours) prior to ingress IP migration, causing upstream ISP recursive resolvers to cache old A record.",
            "resolution": "Lowered Route53 record TTL to 60 seconds, flushed public DNS caches via Google/Cloudflare purge APIs, and decommissioned legacy IP after cache TTL expiry.",
            "tags": ["dns", "external-dns", "ttl-drift", "name-resolution", "customer-portal-dns"],
            "timestamp": "2026-08-05T00:45:00Z"
        }
    }
]

# Write JSON files
for inc in incidents:
    path = os.path.join(incidents_dir, inc["filename"])
    with open(path, "w", encoding="utf-8") as f:
        json.dump(inc["data"], f, indent=2)

print(f"Successfully wrote {len(incidents)} JSON incident reports.")
