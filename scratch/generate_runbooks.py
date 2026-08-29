import os

base_dir = r"c:\Users\Ganesh Nair\OneDrive\Desktop\agentic_ops"
runbooks_dir = os.path.join(base_dir, "rag", "data", "runbooks")
os.makedirs(runbooks_dir, exist_ok=True)

runbooks = [
    # RB 1
    {
        "filename": "RB-001_k8s_pod_crashloop.md",
        "content": """# Runbook: Kubernetes Pod CrashLoopBackOff & OOMKilled Triage

## Description
Standard operating procedure for diagnosing and remediating Kubernetes pods stuck in `CrashLoopBackOff` or terminated due to `OOMKilled` (Exit Code 137) events in production namespaces.

## Prerequisites
- Administrative access to Kubernetes cluster via `kubectl`.
- Read access to cluster monitoring tools (Grafana, Prometheus, Loki).
- Helm / Argo CD access for deployment rollbacks.

## Diagnosis Steps
1. Identify affected pod status:
   `kubectl get pods -n <namespace> -o wide --field-selector status.phase!=Running`
2. Fetch logs from previous crashed instance:
   `kubectl logs -n <namespace> <pod_name> --previous --tail=200`
3. Inspect pod failure reason and termination code:
   `kubectl describe pod <pod_name> -n <namespace>`
4. Check node-level memory pressure or OOM killer events:
   `kubectl get events -n <namespace> --sort-by='.metadata.creationTimestamp'`

## Recovery Steps
1. **OOMKilled Error**: If `Reason: OOMKilled` (Exit Code 137) is observed, increase container memory limits in the Helm values or Deployment manifest:
   `kubectl set resources deployment/<deployment_name> -n <namespace> --limits=memory=4Gi --requests=memory=2Gi`
2. **Missing Secret/ConfigMap**: If application panics on missing environment variables or secrets, verify Secret key bindings:
   `kubectl get secret <secret_name> -n <namespace> -o yaml`
3. **Rollback Deployment**: If code crash introduced in recent release, initiate immediate rollback:
   `kubectl rollout undo deployment/<deployment_name> -n <namespace>`

## Verification Steps
1. Confirm pods reach `1/1 Ready` status and `Running` phase:
   `kubectl get deployment <deployment_name> -n <namespace>`
2. Monitor crash loop counter to ensure restarts have ceased:
   `kubectl get pods -n <namespace> -l app=<app_label> -watch`
3. Verify application health check endpoints (`/healthz`, `/livez`) respond with HTTP 200.

## Related Tags
- kubernetes
- crashloopbackoff
- pod-failure
- oomkilled
- deployment
- auth-service
- search-indexer
"""
    },
    # RB 2
    {
        "filename": "RB-002_postgres_connection_pool.md",
        "content": """# Runbook: PostgreSQL Connection Pool Exhaustion Mitigation

## Description
Remediation procedures for handling PostgreSQL client connection exhaustion (`FATAL: sorry, too many clients already`) and PgBouncer pool saturation.

## Prerequisites
- Superuser access to PostgreSQL database (`psql`).
- SSH/kubectl access to PgBouncer proxy instances.

## Diagnosis Steps
1. Check active database connection count vs `max_connections`:
   `SELECT count(*), state, usename, client_addr FROM pg_stat_activity GROUP BY state, usename, client_addr;`
2. Identify long-running idle transactions:
   `SELECT pid, now() - xact_start AS duration, query FROM pg_stat_activity WHERE state = 'idle in transaction' ORDER BY duration DESC;`
3. Inspect PgBouncer pool statistics:
   `psql -h <pgbouncer_host> -p 6432 -U pgbouncer pgbouncer -c "SHOW POOLS;"`

## Recovery Steps
1. **Terminate Rogue Connections**: Cancel hung backend connections holding pool slots:
   `SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE state = 'idle in transaction' AND now() - xact_start > interval '5 minutes';`
2. **Adjust PgBouncer Capacity**: Dynamically increase max client connections in PgBouncer config and reload:
   `RELOAD;` (in pgbouncer admin console).
3. **Scale API Replicas / Restart Leaking Workers**: Restart microservice pods leaking unclosed connections.

## Verification Steps
1. Validate active connection count drops below 70% of pool capacity:
   `SELECT count(*) FROM pg_stat_activity;`
2. Confirm client requests no longer throw HTTP 503 or DB connection timeout errors.

## Related Tags
- postgresql
- database
- connection-pool
- pgbouncer
- user-profile-api
"""
    },
    # RB 3
    {
        "filename": "RB-003_postgres_replication_lag.md",
        "content": """# Runbook: PostgreSQL Read Replica Lag Remediation

## Description
Procedures to diagnose and resolve high WAL replication lag between PostgreSQL primary node and read replicas.

## Prerequisites
- Access to PostgreSQL primary and standby nodes.
- Grafana dashboard access for `pg_replication_lag_bytes` and network I/O.

## Diagnosis Steps
1. Measure current replication lag on primary database node:
   `SELECT client_addr, replay_lag, write_lag, flush_lag FROM pg_stat_replication;`
2. Measure standby WAL receive/replay delay:
   `SELECT now() - pg_last_xact_replay_timestamp() AS replication_lag;`
3. Check for blocking heavy read queries on standby node causing conflict:
   `SELECT pid, query, age(clock_timestamp(), query_start) FROM pg_stat_activity WHERE waiting;`

## Recovery Steps
1. Cancel conflicting long-running analytical queries on read replica:
   `SELECT pg_cancel_backend(pid);`
2. Adjust standby conflict delay timeout parameter in `postgresql.conf`:
   `max_standby_streaming_delay = 30s`
3. If WAL lag is unrecoverable, re-sync standby node from primary snapshot using `pg_basebackup`.

## Verification Steps
1. Ensure `pg_replication_lag_bytes` returns to < 100MB.
2. Confirm analytics workers and read queries receive up-to-date data.

## Related Tags
- postgresql
- database
- read-replica
- replication-lag
- analytics-worker
"""
    },
    # RB 4
    {
        "filename": "RB-004_api_gateway_504_timeouts.md",
        "content": """# Runbook: API Gateway 504 Gateway Timeout Triage

## Description
Guide for handling elevated HTTP 504 Gateway Timeout errors at the Ingress API Gateway tier caused by upstream microservice slowness or external dependency stalls.

## Prerequisites
- Access to Envoy / NGINX ingress controller logs and metrics.
- Distributed tracing system (Jaeger / Zipkin / Datadog APM).

## Diagnosis Steps
1. Filter ingress gateway access logs for HTTP 504 status codes:
   `kubectl logs -n ingress-nginx deployment/ingress-nginx-controller --grep=" 504 "`
2. Identify failing upstream upstream host and route:
   Extract `$upstream_addr` and `$request_time` from access logs.
3. Trace latency breakdown in Zipkin/Jaeger to determine whether delay is internal service or 3rd-party vendor.

## Recovery Steps
1. **Enable Circuit Breaker / Fallback**: If 3rd party integration is failing, trip circuit breaker to fail-fast or return cached fallback payload.
2. **Scale Upstream Deployment**: If upstream pods are CPU throttled, scale replica count:
   `kubectl scale deployment/<upstream_service> --replicas=10 -n production`
3. **Adjust Gateway Timeout**: Temporarily increase upstream timeout limit in Ingress annotation if batch processing requires longer window:
   `nginx.ingress.kubernetes.io/proxy-read-timeout: "30"`

## Verification Steps
1. Confirm HTTP 504 error rate drops to < 0.01% on API Gateway dashboard.
2. Verify p99 latency metrics return to baseline service SLO.

## Related Tags
- api-gateway
- http-504
- timeout
- ingress
- checkout-gateway
"""
    },
    # RB 5
    {
        "filename": "RB-005_redis_memory_eviction.md",
        "content": """# Runbook: Redis Memory Exhaustion & Eviction Policy Management

## Description
Guide for resolving Redis `maxmemory` limit exhaustion, key eviction cascades, and `OOM command not allowed` exceptions.

## Prerequisites
- Redis CLI (`redis-cli`) access to affected cluster or standalone node.
- Read access to Redis memory telemetry (`INFO memory`).

## Diagnosis Steps
1. Inspect current Redis memory usage and eviction statistics:
   `redis-cli -h <redis_host> INFO memory`
2. Check configured maxmemory policy and hit/miss ratio:
   `redis-cli -h <redis_host> CONFIG GET maxmemory-policy`
3. Check eviction counters:
   `redis-cli -h <redis_host> INFO stats | grep evicted_keys`

## Recovery Steps
1. **Live Policy Change**: If policy is set to `noeviction`, dynamically switch policy to `allkeys-lru`:
   `redis-cli -h <redis_host> CONFIG SET maxmemory-policy allkeys-lru`
2. **Purge Expired/Unneeded Cache Keys**: Perform batch deletion of stale temporary cache prefixes using `redis-cli --scan`.
3. **Scale Memory Allocation**: Vertically scale Redis cluster node instance memory or scale out shard count.

## Verification Steps
1. Verify Redis accepts write operations without `OOM command not allowed` errors.
2. Ensure cache hit ratio recovers above 90% target threshold.

## Related Tags
- redis
- cache
- memory-exhaustion
- eviction-policy
- session-store
"""
    },
    # RB 6
    {
        "filename": "RB-006_redis_latency_single_thread.md",
        "content": """# Runbook: Redis Single-Threaded Latency & Slowlog Investigation

## Description
Troubleshooting response time spikes caused by long-running synchronous operations (`KEYS`, `FLUSHALL`, heavy Lua scripts) blocking Redis single-threaded execution thread.

## Prerequisites
- `redis-cli` access to primary master node.

## Diagnosis Steps
1. Check Redis slow execution log:
   `redis-cli -h <redis_host> SLOWLOG GET 10`
2. Monitor real-time incoming command stream:
   `redis-cli -h <redis_host> MONITOR` (Execute briefly, max 5 seconds).
3. Check CPU usage per core on Redis server host.

## Recovery Steps
1. Kill long-running client connection running full-scan queries:
   `redis-cli CLIENT KILL TYPE normal`
2. Replace blocking `KEYS` command calls in application code with non-blocking `SCAN` iteration.
3. Add command restriction in `redis.conf` to disable dangerous blocking commands:
   `rename-command KEYS ""`

## Verification Steps
1. Confirm `SLOWLOG GET` shows command execution times under 5ms.
2. Confirm application p99 response times return to normal bounds.

## Related Tags
- redis
- cache
- latency-spike
- single-thread-blocking
- recommendation-cache
"""
    },
    # RB 7
    {
        "filename": "RB-007_vpc_peering_network_partition.md",
        "content": """# Runbook: VPC Peering & Route Table Network Partition Recovery

## Description
Instructions to diagnose and restore inter-VPC network connectivity drops affecting cross-region or cross-account service communications.

## Prerequisites
- AWS CLI / Cloud Management Console permissions for EC2 VPC & Route Tables.
- Network diagnostic tools (`traceroute`, `nc`, `mpath`).

## Diagnosis Steps
1. Test port connectivity to target private IP:
   `nc -zvw3 10.200.1.15 443`
2. Trace network hops to locate drop point:
   `traceroute -n 10.200.1.15`
3. Inspect VPC Peering Connection status in AWS CLI:
   `aws ec2 describe-vpc-peering-connections --vpc-peering-connection-ids pcx-0a1b2c3d`
4. Inspect route table entries attached to source subnet:
   `aws ec2 describe-route-tables --filters "Name=association.subnet-id,Values=subnet-123456"`

## Recovery Steps
1. **Add Missing Route Entry**: Add destination CIDR routing through VPC peering connection target:
   `aws ec2 create-route --route-table-id rt-prod-private-a --destination-cidr-block 10.200.0.0/16 --vpc-peering-connection-id pcx-0a1b2c3d`
2. **Verify Security Group Rules**: Ensure egress/ingress SG rules permit traffic on target port.

## Verification Steps
1. Verify `nc` / `curl` connection succeeds between subnets.
2. Check CloudWatch `NetworkPacketsDrop` returns to 0.

## Related Tags
- networking
- vpc-peering
- route-table
- network-partition
- payment-processor
"""
    },
    # RB 8
    {
        "filename": "RB-008_failed_canary_deployment.md",
        "content": """# Runbook: Failed Canary Rollout Triage & Rollback

## Description
Handling automated deployment failures and metric anomaly rollbacks during Argo Rollouts or Flagger canary releases.

## Prerequisites
- `kubectl-argo-rollouts` CLI plugin installed.
- Access to Prometheus canary metric analysis dashboard.

## Diagnosis Steps
1. Check current rollout status:
   `kubectl argo rollouts get rollout <rollout_name> -n <namespace>`
2. View analysis run metrics failure reasons:
   `kubectl get analysisrun -n <namespace> --sort-by='.metadata.creationTimestamp'`
3. Inspect logs of canary pods:
   `kubectl logs -n <namespace> -l rollouts-pod-template-hash=<canary_hash>`

## Recovery Steps
1. **Manual Abort / Rollback**: If automated abort has not fired, force rollback immediately:
   `kubectl argo rollouts undo <rollout_name> -n <namespace>`
2. **Promote Stable Revision**: Ensure traffic is 100% pointed back to stable revision pods.

## Verification Steps
1. Confirm rollout step shows `Phase: Degraded` or `Phase: Healthy (Rolled Back)`.
2. Confirm 100% of ingress traffic is routed to stable deployment pods.

## Related Tags
- deployments
- canary-rollout
- argo-rollouts
- helm
- notification-service
"""
    },
    # RB 9
    {
        "filename": "RB-009_vault_jwt_auth_failure.md",
        "content": """# Runbook: HashiCorp Vault Token Expiry & Authentication Recovery

## Description
Procedures for resolving authentication service outages resulting from expired HashiCorp Vault client tokens or sidecar renewal failures.

## Prerequisites
- Vault CLI access with administrative token or recovery keys.
- `kubectl` access to identity service namespace.

## Diagnosis Steps
1. Check Vault status and seal state:
   `vault status`
2. Inspect application container sidecar logs:
   `kubectl logs -n auth <pod_name> -c vault-agent`
3. Verify token lookup details:
   `vault token lookup`

## Recovery Steps
1. **Re-authenticate Vault Agent**: Force token refresh via Kubernetes auth engine:
   `kubectl exec -it <pod_name> -n auth -c vault-agent -- vault login -method=kubernetes role=auth-service`
2. **Restart Microservice Pods**: Restart pods to reload valid secret leases from memory:
   `kubectl rollout restart deployment/identity-provider -n auth`

## Verification Steps
1. Confirm application authentication requests respond with HTTP 200 OK.
2. Confirm `vault-agent` logs report `token successfully renewed`.

## Related Tags
- authentication
- jwt
- hashicorp-vault
- token-expired
- identity-provider
"""
    },
    # RB 10
    {
        "filename": "RB-010_pvc_storage_pending_disk_full.md",
        "content": """# Runbook: Kubernetes PVC Pending & Node Disk Space Cleanup

## Description
Triage procedure for PersistentVolumeClaim provisioning failures (`Pending`) and Node `DiskPressure` cleanups.

## Prerequisites
- `kubectl` cluster-admin permissions.
- SSH access to worker nodes (for emergencies).

## Diagnosis Steps
1. Check PVC status and storage class events:
   `kubectl get pvc -A`
   `kubectl describe pvc <pvc_name> -n <namespace>`
2. Check CSI provisioner logs:
   `kubectl logs -n kube-system deployment/ebs-csi-controller`
3. Check node disk usage:
   `kubectl get nodes -o custom-columns=NAME:.metadata.name,DISKPRESSURE:.status.conditions[?(@.type=="DiskPressure")].status`

## Recovery Steps
1. **Expand PVC Volume**: Increase storage request size in PVC definition (if volume expansion supported).
2. **Drain Node / Rebalance EBS Volumes**: If AWS EBS volume limit per node is hit:
   `kubectl drain <node_name> --ignore-daemonsets --delete-emptydir-data`
3. **Clean Pod Logs**: Truncate container logs on node:
   `find /var/log/pods -name "*.log" -size +1G -exec truncate -s 0 {} +`

## Verification Steps
1. Confirm PVC transitions from `Pending` to `Bound`.
2. Ensure Node `DiskPressure` condition returns to `False`.

## Related Tags
- storage
- pvc
- ebs
- disk-full
- filesystem
- order-fulfillment-db
- log-aggregator
"""
    },
    # RB 11
    {
        "filename": "RB-011_coredns_name_resolution.md",
        "content": """# Runbook: CoreDNS & ExternalDNS Resolution Failure Remediation

## Description
Resolving internal Kubernetes DNS resolution failures, CoreDNS upstream timeouts, and ExternalDNS TTL caching issues.

## Prerequisites
- `kubectl` permissions in `kube-system` namespace.
- Access to external DNS provider (Route53 / Cloudflare).

## Diagnosis Steps
1. Test DNS resolution inside a temporary debug pod:
   `kubectl run -it --rm debug --image=busybox -- nslookup inventory-db.internal`
2. Inspect CoreDNS deployment logs:
   `kubectl logs -n kube-system -l k8s-app=kube-dns --tail=100`
3. Check CoreDNS metrics: `coredns_dns_request_duration_seconds_bucket` and dropped query count.

## Recovery Steps
1. **Scale CoreDNS Replicas**: Scale deployment to meet query demand:
   `kubectl scale deployment coredns -n kube-system --replicas=8`
2. **Restart CoreDNS Pods**:
   `kubectl rollout restart deployment coredns -n kube-system`
3. **Flush Upstream Cache**: For ExternalDNS TTL drift, trigger cache purge on CDN/DNS provider.

## Verification Steps
1. Confirm `nslookup` resolves internal `.cluster.local` names in < 5ms.
2. Confirm application DNS lookup error rates drop to zero.

## Related Tags
- dns
- coredns
- external-dns
- name-resolution
- kube-dns
- ttl-drift
- inventory-api
- customer-portal-dns
"""
    },
    # RB 12
    {
        "filename": "RB-012_prometheus_tsdb_monitoring.md",
        "content": """# Runbook: Prometheus TSDB Corruption & Alertmanager Deadman Recovery

## Description
Restoring monitoring functionality when Prometheus TSDB Write-Ahead Log (WAL) corruption occurs or Alertmanager routing drops heartbeats.

## Prerequisites
- `kubectl` access to monitoring namespace.
- Direct filesystem access to Prometheus persistent volume.

## Diagnosis Steps
1. Check Prometheus pod container logs:
   `kubectl logs -n monitoring statefulset/prometheus-k8s -c prometheus`
2. Check for WAL corruption error signatures: `corrupt WAL segment`.
3. Check Alertmanager cluster mesh status.

## Recovery Steps
1. **Remove Corrupt WAL Segment**:
   Exec into Prometheus pod or attach debug volume and delete corrupted segment file:
   `rm /prometheus/data/wal/00000XXX`
2. **Restart Prometheus StatefulSet**:
   `kubectl rollout restart statefulset/prometheus-k8s -n monitoring`

## Verification Steps
1. Confirm Prometheus logs report `Server is ready to receive web requests`.
2. Confirm Grafana metrics graph query execution succeeds.

## Related Tags
- monitoring
- prometheus
- tsdb
- alertmanager
- monitoring-prometheus
"""
    },
    # RB 13
    {
        "filename": "RB-013_vector_fluentbit_logging.md",
        "content": """# Runbook: Log Pipeline Backpressure & Buffer Overflow Remediation

## Description
Handling log collector (Vector / Fluentbit) buffer backpressure caused by ingester or Elasticsearch cluster bottlenecks.

## Prerequisites
- Access to Vector / Fluentbit metrics endpoints.
- Elasticsearch cluster health metrics.

## Diagnosis Steps
1. Check Vector log buffer usage:
   `curl -s http://vector.logging:8686/metrics | grep vector_buffer_byte_size`
2. Inspect Fluentbit log tailing position:
   `kubectl logs -n logging daemonset/fluent-bit`

## Recovery Steps
1. **Enable Disk-Backed Buffering**: Switch buffer type from `memory` to `disk` with fallback limit in Vector configuration.
2. **Scale Ingestion Pipeline**: Increase elasticsearch batch size or add ingester nodes.

## Verification Steps
1. Verify log ingestion lag in Kibana drops back to < 5 seconds.
2. Confirm Vector memory usage drops below 70%.

## Related Tags
- monitoring
- logging
- fluentbit
- vector-backpressure
- telemetry-pipeline
"""
    },
    # RB 14
    {
        "filename": "RB-014_postgres_deadlock_cascades.md",
        "content": """# Runbook: PostgreSQL Transaction Deadlock Cascade Resolution

## Description
Identifying and breaking PostgreSQL application transaction deadlocks blocking critical worker queues.

## Prerequisites
- PostgreSQL DB admin privileges.

## Diagnosis Steps
1. Query PostgreSQL logs for deadlock entries:
   `SELECT query, pid, age(clock_timestamp(), query_start) FROM pg_stat_activity WHERE waiting AND query ILIKE '%UPDATE%';`
2. Identify locking and locked transaction pairs using `pg_locks`.

## Recovery Steps
1. Cancel blocking query process:
   `SELECT pg_cancel_backend(<pid>);`
2. Force-kill stubborn backend if cancel times out:
   `SELECT pg_terminate_backend(<pid>);`
3. Enforce standardized table update ordering in application code (e.g. acquire locks in sorted primary key order).

## Verification Steps
1. Confirm no active queries remain in `waiting` state in `pg_stat_activity`.
2. Confirm application queue processing throughput resumes.

## Related Tags
- postgresql
- database
- deadlock
- transaction-lock
- billing-service
"""
    },
    # RB 15
    {
        "filename": "RB-015_envoy_rate_limit_ebs_iops_iam.md",
        "content": """# Runbook: Cloud Infrastructure Edge Cases (Rate Limits, IOPS Throttling, STS IAM)

## Description
Multi-domain runbook covering Envoy API rate limit misconfigurations, AWS EBS IOPS burst depletion, and STS AssumeRole token permission drifts.

## Prerequisites
- Access to AWS Console / AWS CLI.
- Access to Envoy proxy configuration files.

## Diagnosis Steps
1. **Rate Limits**: Inspect Envoy metric `ratelimit.over_limit` and verify `X-Forwarded-For` header client IP parsing.
2. **EBS IOPS**: Check AWS CloudWatch metric `BurstBalance` for storage volume.
3. **AWS IAM STS**: Inspect application logs for `AccessDenied: Not authorized to perform sts:AssumeRoleWithWebIdentity`.

## Recovery Steps
1. **Rate Limit Hotfix**: Update Envoy config `use_remote_address: true` to evaluate actual client IPs instead of shared proxy IPs.
2. **EBS IOPS Migration**: Modify EBS volume type live from `gp2` to `gp3` with baseline 3000 IOPS in AWS CLI:
   `aws ec2 modify-volume --volume-id vol-1234567890abcdef0 --volume-type gp3 --iops 3000 --throughput 125`
3. **IAM Trust Policy Sync**: Update IAM role trust policy JSON with correct OIDC sub and audience `sts.amazonaws.com`.

## Verification Steps
1. Confirm legitimate user HTTP 429 errors cease.
2. Confirm EBS await read/write latency drops below 5ms.
3. Confirm S3 / AWS API calls succeed without `AccessDenied`.

## Related Tags
- api-gateway
- rate-limit
- envoy
- cascading-failure
- storage
- ebs
- iops-throttling
- volume-performance
- authentication
- iam
- aws-sts
- permission-denied
- public-api-gateway
- elastic-search-node
- s3-exporter-service
"""
    }
]

for rb in runbooks:
    path = os.path.join(runbooks_dir, rb["filename"])
    with open(path, "w", encoding="utf-8") as f:
        f.write(rb["content"])

print(f"Successfully wrote {len(runbooks)} Markdown runbooks.")
